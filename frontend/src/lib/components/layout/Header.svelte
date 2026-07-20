<script lang="ts">
	export let title = '';
	export let subtitle = '';
</script>

<div class="mb-6 md:mb-8 shrink-0 flex gap-4 items-start relative select-none">
	<!-- Left vertical indicator bar -->
	<div class="w-1.5 self-stretch rounded-full bg-gradient-to-b from-primary to-secondary opacity-80 shrink-0"></div>
	
	<div class="flex-grow min-w-0">
		<h2 class="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight leading-none flex items-center gap-2">
			{title}
		</h2>
		{#if subtitle}
			<p class="text-slate-500 text-xs md:text-sm mt-1.5 font-medium leading-relaxed tracking-wide">{subtitle}</p>
		{/if}
	</div>
</div>
