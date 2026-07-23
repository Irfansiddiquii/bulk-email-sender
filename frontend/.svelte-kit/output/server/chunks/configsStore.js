import { w as writable } from "./index.js";
import { b as apiClient } from "./authStore.js";
const configs = writable([]);
const loading = writable(false);
const configsStore = {
  subscribe: configs.subscribe,
  loading: { subscribe: loading.subscribe },
  load: async () => {
    loading.set(true);
    try {
      const res = await apiClient.get("/config/smtp");
      if (res.data.success) {
        configs.set(res.data.userConfigs || []);
      }
    } catch (err) {
      console.error("Error loading configs:", err);
    } finally {
      loading.set(false);
    }
  },
  setDefault: async (id) => {
    try {
      const res = await apiClient.post(`/config/smtp/${id}/default`);
      if (res.data.success) {
        configs.update((list) => list.map((c) => ({ ...c, isDefault: c.id === id })));
        return true;
      }
    } catch (err) {
      console.error("Error setting default:", err);
    }
    return false;
  },
  delete: async (id) => {
    try {
      const res = await apiClient.delete(`/config/smtp/${id}`);
      if (res.data.success) {
        configs.update((list) => list.filter((c) => c.id !== id));
        return true;
      }
    } catch (err) {
      console.error("Error deleting config:", err);
    }
    return false;
  }
};
export {
  configsStore as c
};
