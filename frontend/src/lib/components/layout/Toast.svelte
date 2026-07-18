<script lang="ts">
	import { toastStore } from '$lib/stores/toastStore';
	import { X } from 'lucide-svelte';
</script>

<div class="fixed top-5 right-5 z-[9999] flex flex-col gap-2 max-w-sm w-full">
	{#each $toastStore as toast (toast.id)}
		<div 
			class="p-4 rounded-xl shadow-lg border text-white flex items-start gap-3 transition-all duration-300 transform translate-y-0"
			class:bg-emerald-600={toast.type === 'success'}
			class:border-emerald-700={toast.type === 'success'}
			class:bg-rose-600={toast.type === 'danger'}
			class:border-rose-700={toast.type === 'danger'}
			class:bg-blue-600={toast.type === 'info'}
			class:border-blue-700={toast.type === 'info'}
			class:bg-amber-500={toast.type === 'warning'}
			class:border-amber-600={toast.type === 'warning'}
		>
			<div class="flex-grow text-sm font-medium">
				{toast.message}
			</div>
			<button 
				class="text-white hover:text-slate-200 transition-colors shrink-0 mt-0.5"
				on:click={() => toastStore.dismiss(toast.id)}
			>
				<X class="w-4 h-4" />
			</button>
		</div>
	{/each}
</div>
