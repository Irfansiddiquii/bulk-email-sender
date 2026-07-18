<script lang="ts">
	export let title = '';
	export let subtitle = '';
</script>

<div class="mb-6 shrink-0">
	<h2 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
		{title}
	</h2>
	{#if subtitle}
		<p class="text-slate-500 text-sm mt-1">{subtitle}</p>
	{/if}
</div>
