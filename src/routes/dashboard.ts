// src/routes/dashboard.ts - UPDATED FOR USER-SCOPED AND CACHE-FREE OPERATION
import { Hono } from "hono";
import { requireAuth } from "../middleware/auth";

const app = new Hono();

// Optimized endpoint to check if polling is needed (strictly scoped by user)
app.get("/dashboard/poll-status", (c) => {
  const user = requireAuth(c);

  try {
    let hasActiveBatch = false;
    let hasScheduledJobs = false;
    let hasRunningScheduledJobs = false;

    // Check batch status (only import when needed)
    try {
      const { batchService } = require("../services/batchService");
      const batchStatus = batchService.getBatchStatus(user.id);
      hasActiveBatch = batchStatus.isRunning;
    } catch (error) {
      console.warn("Batch service not available:", error.message);
      hasActiveBatch = false;
    }

    // Check scheduled jobs (only import when needed)
    try {
      const { schedulerService } = require("../services/schedulerService");
      const scheduledJobs = schedulerService.getUserScheduledJobs(user.id);
      hasScheduledJobs = scheduledJobs && scheduledJobs.length > 0;
      hasRunningScheduledJobs =
        scheduledJobs &&
        scheduledJobs.some((job) => job.status === "running");
    } catch (error) {
      console.warn("Scheduler service not available:", error.message);
      hasScheduledJobs = false;
    }

    // Determine if polling is needed and at what interval
    let pollNeeded = false;
    let pollInterval = 30000; // Default 30 seconds (slow polling)

    if (hasActiveBatch) {
      pollNeeded = true;
      pollInterval = 3000; // Fast polling for active batch jobs (3 seconds)
    } else if (hasRunningScheduledJobs) {
      pollNeeded = true;
      pollInterval = 10000; // Medium polling for running scheduled jobs (10 seconds)
    } else if (hasScheduledJobs) {
      pollNeeded = true;
      pollInterval = 30000; // Slow polling for pending scheduled jobs (30 seconds)
    }

    return c.json({
      success: true,
      data: {
        pollNeeded,
        pollInterval,
        hasActiveBatch,
        hasScheduledJobs,
        hasRunningScheduledJobs,
        activeBatchCount: hasActiveBatch ? 1 : 0,
        scheduledJobCount: hasScheduledJobs ? 1 : 0, // Simplified count
        lastUpdated: new Date().toISOString(),
        cached: false,
      },
    });
  } catch (error) {
    console.error("Poll status error:", error);
    return c.json({
      success: true,
      data: {
        pollNeeded: false,
        pollInterval: 30000,
        hasActiveBatch: false,
        hasScheduledJobs: false,
        hasRunningScheduledJobs: false,
        activeBatchCount: 0,
        scheduledJobCount: 0,
        lastUpdated: new Date().toISOString(),
        error: "Service unavailable",
      },
    });
  }
});

// Optimized dashboard data endpoint (strictly user-scoped)
app.get("/dashboard/data", (c) => {
  const user = requireAuth(c);

  try {
    let batchStatus = null;
    let scheduledJobs = null;

    // Fetch batch data for current user
    try {
      const { batchService } = require("../services/batchService");
      const status = batchService.getBatchStatus(user.id);
      if (status.currentJob) {
        batchStatus = status;
      }
    } catch (error) {
      console.warn("Batch service unavailable:", error.message);
    }

    // Fetch scheduled jobs for current user
    try {
      const { schedulerService } = require("../services/schedulerService");
      const userJobs = schedulerService.getUserScheduledJobs(user.id);
      scheduledJobs = userJobs.slice(0, 5);
    } catch (error) {
      console.warn("Scheduler service unavailable:", error.message);
    }

    return c.json({
      success: true,
      data: {
        batch: batchStatus,
        scheduledJobs: scheduledJobs || [],
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Dashboard data error:", error);
    return c.json(
      {
        success: false,
        message: "Failed to fetch dashboard data",
        data: {
          batch: null,
          scheduledJobs: [],
          timestamp: new Date().toISOString(),
        },
      },
      500
    );
  }
});

export default app;
