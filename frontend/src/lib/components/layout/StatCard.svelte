<script lang="ts">
	export let variant: 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose' | 'slate' = 'indigo';
	export let classNames: string = '';

	const borderClasses = {
		indigo: 'border-indigo-200/70 hover:border-indigo-400/80',
		emerald: 'border-emerald-200/70 hover:border-emerald-400/80',
		violet: 'border-violet-200/70 hover:border-violet-400/80',
		amber: 'border-amber-200/70 hover:border-amber-400/80',
		rose: 'border-rose-200/70 hover:border-rose-400/80',
		slate: 'border-slate-200/80 hover:border-slate-400/80'
	};
</script>

<div class="p-1 rounded-2xl bg-slate-900/[0.03] border {borderClasses[variant]} shadow-2xs transition-all duration-200 {classNames}">
	<div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100 h-full">
		<slot />
	</div>
</div>
