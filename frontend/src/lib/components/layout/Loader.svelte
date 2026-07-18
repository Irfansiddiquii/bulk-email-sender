<script lang="ts">
	export let visible = false;
	export let text = 'Processing...';
</script>

{#if visible}
	<div class="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[9998] flex items-center justify-center transition-opacity">
		<div class="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center max-w-xs w-full border border-slate-100">
			<div class="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
			<p class="mt-4 text-sm font-semibold text-slate-700 text-center">{text}</p>
		</div>
	</div>
{/if}
