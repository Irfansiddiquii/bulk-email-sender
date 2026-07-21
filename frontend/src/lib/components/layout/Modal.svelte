<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { X } from 'lucide-svelte';

	export let show = false;
	export let title = 'Modal Title';
	export let size: 'sm' | 'md' | 'lg' | 'xl' = 'md';

	const dispatch = createEventDispatcher();

	function close() {
		show = false;
		dispatch('close');
	}
</script>

{#if show}
	<div class="fixed inset-0 bg-slate-950/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
		<div 
			class="bg-white rounded-[2.25rem] shadow-2xl shadow-slate-950/30 w-full overflow-hidden border border-indigo-200/80 max-h-[90vh] flex flex-col transition-all transform scale-100 relative"
			class:max-w-sm={size === 'sm'}
			class:max-w-md={size === 'md'}
			class:max-w-lg={size === 'lg'}
			class:max-w-2xl={size === 'xl'}
		>
			<!-- Header -->
			<div class="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
				<h3 class="font-bold text-slate-800 text-base">{title}</h3>
				<button 
					on:click={close}
					class="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Body -->
			<div class="p-6 overflow-y-auto flex-grow text-sm text-slate-600">
				<slot />
			</div>

			<!-- Footer -->
			{#if $$slots.footer}
				<div class="p-5 border-t border-slate-100 bg-slate-50 shrink-0 flex justify-end gap-2.5 text-xs">
					<slot name="footer" />
				</div>
			{/if}
		</div>
	</div>
{/if}
