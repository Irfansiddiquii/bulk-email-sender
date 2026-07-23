import { w as writable } from "./index.js";
import axios from "axios";
const apiClient = axios.create({
  baseURL: "",
  // Blank baseURL resolves relative paths proxied by Vite dev server
  withCredentials: true,
  // Includes session cookies automatically
  headers: {
    "Content-Type": "application/json"
  }
});
function createAuthStore() {
  const { subscribe, set, update } = writable({
    user: null,
    loading: false,
    initialized: false
  });
  return {
    subscribe,
    init: async () => {
      update((s) => ({ ...s, loading: true }));
      try {
        const res = await apiClient.get("/auth/me");
        if (res.data.success) {
          set({ user: res.data.user, loading: false, initialized: true });
          return res.data.user;
        }
      } catch (err) {
      }
      set({ user: null, loading: false, initialized: true });
      return null;
    },
    setUser: (user) => {
      update((s) => ({ ...s, user, initialized: true }));
    },
    logout: async () => {
      update((s) => ({ ...s, loading: true }));
      try {
        await apiClient.post("/auth/logout");
      } catch (err) {
        console.error("Logout error:", err);
      }
      set({ user: null, loading: false, initialized: true });
    }
  };
}
const authStore = createAuthStore();
export {
  authStore as a,
  apiClient as b
};
