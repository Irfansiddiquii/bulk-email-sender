import { Hono } from "hono";
import { logService } from "../services/logService";
import { requireAuth } from "../middleware/auth";

const app = new Hono();

// Get email logs and statistics
app.get("/report", (c) => {
  const user = requireAuth(c);
  const logs = logService.getLogs(user.id);
  const stats = logService.getStats(user.id);

  return c.json({
    success: true,
    data: {
      logs,
      stats,
    },
  });
});

// Export logs as CSV
app.get("/report/export/csv", (c) => {
  const user = requireAuth(c);
  const csv = logService.getLogsAsCSV(user.id);

  c.header("Content-Type", "text/csv");
  c.header("Content-Disposition", 'attachment; filename="email-logs.csv"');

  return c.text(csv);
});

// Export logs as JSON
app.get("/report/export/json", (c) => {
  const user = requireAuth(c);
  const json = logService.getLogsAsJSON(user.id);

  c.header("Content-Type", "application/json");
  c.header("Content-Disposition", 'attachment; filename="email-logs.json"');

  return c.text(json);
});

// Clear all logs
app.delete("/report/clear", (c) => {
  const user = requireAuth(c);
  logService.clearLogs(user.id);
  return c.json({ success: true, message: "Logs cleared successfully" });
});

export default app;
