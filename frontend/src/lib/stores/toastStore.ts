import { writable } from 'svelte/store';

export interface Toast {
	id: string;
	type: 'success' | 'danger' | 'info' | 'warning';
	message: string;
}

const toasts = writable<Toast[]>([]);

export const toastStore = {
	subscribe: toasts.subscribe,
	show: (type: Toast['type'], message: string) => {
		const id = Math.random().toString(36).substring(2);
		toasts.update(t => [...t, { id, type, message }]);
		setTimeout(() => {
			toasts.update(t => t.filter(x => x.id !== id));
		}, 5000);
	},
	success: (message: string) => toastStore.show('success', message),
	danger: (message: string) => toastStore.show('danger', message),
	info: (message: string) => toastStore.show('info', message),
	warning: (message: string) => toastStore.show('warning', message)
};
