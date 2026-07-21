<script lang="ts">
	export let variant: 'indigo' | 'emerald' | 'violet' | 'amber' | 'rose' | 'slate' = 'indigo';
	export let padding: 'sm' | 'md' | 'lg' | 'none' = 'md';
	export let classNames: string = '';
	export let hoverable: boolean = true;

	const variantBorders = {
		indigo: 'border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-indigo-500/10',
		emerald: 'border-emerald-200/70 hover:border-emerald-400/80 hover:ring-1 hover:ring-emerald-400/20 shadow-emerald-500/10',
		violet: 'border-violet-200/70 hover:border-violet-400/80 hover:ring-1 hover:ring-violet-400/20 shadow-violet-500/10',
		amber: 'border-amber-200/70 hover:border-amber-400/80 hover:ring-1 hover:ring-amber-400/20 shadow-amber-500/10',
		rose: 'border-rose-200/70 hover:border-rose-400/80 hover:ring-1 hover:ring-rose-400/20 shadow-rose-500/10',
		slate: 'border-slate-200/80 hover:border-slate-400/80 hover:ring-1 hover:ring-slate-400/20 shadow-slate-500/10'
	};

	const variantGradients = {
		indigo: 'from-slate-900/[0.03] to-indigo-900/[0.03]',
		emerald: 'from-slate-900/[0.03] to-emerald-900/[0.03]',
		violet: 'from-slate-900/[0.03] to-violet-900/[0.03]',
		amber: 'from-slate-900/[0.03] to-amber-900/[0.03]',
		rose: 'from-slate-900/[0.03] to-rose-900/[0.03]',
		slate: 'from-slate-900/[0.03] to-slate-900/[0.03]'
	};

	const paddingClasses = {
		none: 'p-0',
		sm: 'p-4 sm:p-5',
		md: 'p-6 sm:p-7',
		lg: 'p-7 sm:p-8'
	};
</script>

<div
	class="p-1.5 rounded-[2.25rem] bg-gradient-to-b {variantGradients[variant]} border {variantBorders[variant]} shadow-md {hoverable ? 'hover:shadow-xl' : ''} transition-all duration-300 relative group overflow-hidden {classNames}"
>
	<div class="bg-white rounded-[calc(2.25rem-0.5rem)] {paddingClasses[padding]} border border-slate-100/90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] h-full flex flex-col justify-between">
		<slot />
	</div>
</div>
