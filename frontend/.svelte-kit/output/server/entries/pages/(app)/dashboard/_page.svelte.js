import { c as create_ssr_component, o as onDestroy, v as validate_component, b as each } from "../../../../chunks/ssr.js";
import "../../../../chunks/Icon.js";
import { b as apiClient } from "../../../../chunks/authStore.js";
import { H as Header } from "../../../../chunks/Header.js";
const dashboardApi = {
  getPollStatus: () => apiClient.get("/dashboard/poll-status"),
  getDashboardData: () => apiClient.get("/dashboard/data")
};
const reportApi = {
  getReports: () => apiClient.get("/report"),
  clearLogs: () => apiClient.delete("/report/clear"),
  getCSVExportURL: () => "/report/export/csv",
  getJSONExportURL: () => "/report/export/json"
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let pollTimer = null;
  let currentInterval = 3e4;
  let isPolling = false;
  let hasActiveBatch = false;
  let hasScheduledJobs = false;
  let hasRunningScheduledJobs = false;
  let stats = {
    total: 0,
    success: 0,
    failed: 0,
    successRate: "0%"
  };
  let batchStatus = null;
  let scheduledJobs = [];
  let lastUpdated = "";
  onDestroy(() => {
    stopPolling();
  });
  function startPolling(interval) {
    stopPolling();
    currentInterval = interval;
    isPolling = true;
    pollTimer = setInterval(
      async () => {
        await checkSystemState();
      },
      interval
    );
  }
  function stopPolling() {
    if (pollTimer) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
    isPolling = false;
  }
  async function fetchStats() {
    try {
      const res = await reportApi.getReports();
      if (res.data.success) {
        const rawStats = res.data.data.stats || { total: 0, sent: 0, failed: 0, errors: 0 };
        const success = rawStats.sent || 0;
        const failed = (rawStats.failed || 0) + (rawStats.errors || 0);
        const total = rawStats.total || success + failed;
        const successRate = total > 0 ? `${Math.round(success / total * 100)}%` : "0%";
        stats = { total, success, failed, successRate };
      }
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
    }
  }
  async function checkSystemState() {
    try {
      const res = await dashboardApi.getPollStatus();
      if (res.data.success) {
        const info = res.data.data;
        hasActiveBatch = info.hasActiveBatch;
        hasScheduledJobs = info.hasScheduledJobs;
        hasRunningScheduledJobs = info.hasRunningScheduledJobs;
        lastUpdated = new Date(info.lastUpdated).toLocaleTimeString();
        if (info.pollNeeded) {
          if (currentInterval !== info.pollInterval || !isPolling) {
            startPolling(info.pollInterval);
          }
          await fetchDashboardData();
          await fetchStats();
        } else {
          stopPolling();
          batchStatus = null;
          scheduledJobs = [];
        }
      }
    } catch (err) {
      console.error("System state check error:", err);
    }
  }
  async function fetchDashboardData() {
    try {
      const res = await dashboardApi.getDashboardData();
      if (res.data.success) {
        batchStatus = res.data.data.batch;
        scheduledJobs = res.data.data.scheduledJobs || [];
      }
    } catch (err) {
      console.error("Dashboard data fetch error:", err);
    }
  }
  async function refreshDashboard(showToast = false) {
    await checkSystemState();
    await fetchDashboardData();
    await fetchStats();
  }
  batchStatus && batchStatus.currentJob ? Math.round(batchStatus.currentJob.emailsSent / batchStatus.currentJob.totalContacts * 100) : 0;
  return `<div class="space-y-6 sm:space-y-8 select-none w-full"> ${validate_component(Header, "Header").$$render(
    $$result,
    {
      title: "Campaign Dashboard",
      subtitle: "Monitor live email sends, queues, and background automated actions",
      lastUpdated,
      onRefresh: () => refreshDashboard(true)
    },
    {},
    {}
  )} ${` <div class="space-y-6"><div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">${each(Array(4), (_) => {
    return `<div class="p-1.5 bg-[#090d16]/5 border border-slate-200/40 rounded-2xl animate-pulse" data-svelte-h="svelte-tas38k"><div class="p-5 bg-white border border-slate-100 rounded-[calc(1rem-0.125rem)] shadow-soft h-[104px] flex items-center gap-4"><div class="w-11 h-11 bg-slate-100 rounded-xl shrink-0"></div> <div class="space-y-2 flex-grow"><div class="h-3 bg-slate-100 rounded w-1/2"></div> <div class="h-6 bg-slate-100 rounded w-3/4"></div> </div></div> </div>`;
  })}</div> <div class="p-1.5 bg-[#090d16]/5 border border-slate-200/40 rounded-[2rem] animate-pulse" data-svelte-h="svelte-10gdg46"><div class="p-12 bg-white border border-slate-100 rounded-[calc(2rem-0.375rem)] shadow-soft flex flex-col items-center justify-center gap-4"><div class="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-500 animate-spin"></div> <div class="space-y-2 text-center w-full max-w-sm"><div class="h-4 bg-slate-100 rounded w-2/3 mx-auto"></div> <div class="h-3.5 bg-slate-100 rounded w-1/2 mx-auto"></div></div></div></div></div>`}</div>`;
});
export {
  Page as default
};
