import { writable } from 'svelte/store';
import { apiClient } from '$lib/api/client';

export interface User {
	id: string;
	email: string;
	name: string;
}

function createAuthStore() {
	const { subscribe, set, update } = writable<{
		user: User | null;
		loading: boolean;
		initialized: boolean;
	}>({
		user: null,
		loading: false,
		initialized: false
	});

	return {
		subscribe,
		init: async () => {
			update(s => ({ ...s, loading: true }));
			try {
				const res = await apiClient.get('/auth/me');
				if (res.data.success) {
					set({ user: res.data.user, loading: false, initialized: true });
					return res.data.user;
				}
			} catch (err) {
				// User not authenticated
			}
			set({ user: null, loading: false, initialized: true });
			return null;
		},
		setUser: (user: User | null) => {
			update(s => ({ ...s, user, initialized: true }));
		},
		logout: async () => {
			update(s => ({ ...s, loading: true }));
			try {
				await apiClient.post('/auth/logout');
			} catch (err) {
				console.error('Logout error:', err);
			}
			set({ user: null, loading: false, initialized: true });
		}
	};
}

export const authStore = createAuthStore();
