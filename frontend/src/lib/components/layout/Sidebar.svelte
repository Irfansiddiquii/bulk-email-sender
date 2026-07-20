<script lang="ts">
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/authStore';
	import { toastStore } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { 
		Mail, LayoutDashboard, Send, History, Users, FileText, 
		Calendar, Bell, Settings, User, LogOut 
	} from 'lucide-svelte';

	const menuGroups = [
		{
			title: 'Overview',
			items: [
				{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
				{ name: 'Compose Campaign', path: '/compose', icon: Send },
				{ name: 'History Logs', path: '/history', icon: History }
			]
		},
		{
			title: 'Management',
			items: [
				{ name: 'Contact Manager', path: '/contacts', icon: Users },
				{ name: 'Templates Store', path: '/templates', icon: FileText },
				{ name: 'Active Scheduler', path: '/scheduler', icon: Calendar }
			]
		},
		{
			title: 'System & Profile',
			items: [
				{ name: 'Alert Notification', path: '/notifications', icon: Bell },
				{ name: 'SMTP Configurations', path: '/configs', icon: Settings },
				{ name: 'My Profile', path: '/profile', icon: User }
			]
		}
	];

	async function handleLogout() {
		try {
			await authStore.logout();
			toastStore.success('Logged out successfully!');
			goto('/login');
		} catch (err) {
			toastStore.danger('Logout failed.');
		}
	}
</script>

<aside class="hidden md:flex flex-col w-64 bg-[#0A0E17] text-slate-300 shrink-0 border-r border-slate-800/60 h-screen sticky top-0 relative z-20 shadow-[1px_0_16px_rgba(0,0,0,0.3)] select-none font-sans">
	<!-- Background subtle accent glow -->
	<div class="absolute inset-0 bg-gradient-to-b from-indigo-500/[0.03] via-transparent to-transparent pointer-events-none"></div>

	<!-- Brand header -->
	<div class="px-5 py-4 border-b border-slate-800/60 flex items-center justify-between gap-3 relative z-10">
		<div class="flex items-center gap-3 min-w-0">
			<!-- Double bezel logo shell -->
			<div class="p-1 bg-white/[0.04] border border-white/[0.08] rounded-xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] shrink-0 transition-transform duration-300 hover:scale-105">
				<!-- Inner core -->
				<div class="p-1.5 bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 rounded-lg flex items-center justify-center shadow-[0_2px_8px_rgba(99,102,241,0.35)]">
					<Mail class="w-4 h-4 text-white" />
				</div>
			</div>
			<div class="min-w-0">
				<h1 class="font-semibold text-sm leading-tight tracking-tight text-white truncate">Bulk Email Sender</h1>
				<span class="text-[10px] text-slate-400 font-medium tracking-wider uppercase block mt-0.5 opacity-80">Enterprise SaaS</span>
			</div>
		</div>
		<span class="px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 uppercase shrink-0">PRO</span>
	</div>

	<!-- Navigation links -->
	<nav class="flex-grow px-3 py-3 space-y-4 overflow-y-auto relative z-10">
		{#each menuGroups as group}
			<div>
				<div class="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500 font-mono">
					{group.title}
				</div>
				<div class="space-y-0.5">
					{#each group.items as item}
						{@const isActive = $page.url.pathname === item.path}
						<a 
							href={item.path}
							class="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] group relative {isActive ? 'bg-indigo-500/10 text-white font-semibold border border-indigo-500/20 shadow-[0_1px_8px_rgba(99,102,241,0.12)]' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'}"
						>
							{#if isActive}
								<div class="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
							{/if}
							<svelte:component 
								this={item.icon} 
								class="w-4 h-4 shrink-0 transition-colors duration-200 {isActive ? 'text-indigo-400' : 'text-slate-400 group-hover:text-slate-200'}" 
							/>
							<span class="truncate">{item.name}</span>
						</a>
					{/each}
				</div>
			</div>
		{/each}
	</nav>

	<!-- User Profile Card -->
	<div class="p-3 border-t border-slate-800/60 bg-[#070A10]/60 relative z-10">
		<div class="p-2.5 rounded-xl border border-slate-800/80 bg-slate-900/40 flex items-center justify-between gap-2.5 transition-all duration-200 hover:border-slate-700/80 hover:bg-slate-900/60">
			{#if $authStore.user}
				<div class="flex items-center gap-2.5 min-w-0">
					<!-- Avatar shell -->
					<div class="relative shrink-0">
						<div class="p-0.5 bg-white/[0.04] border border-white/[0.08] rounded-lg">
							<div class="w-7 h-7 rounded-[6px] bg-indigo-950/80 border border-indigo-500/20 flex items-center justify-center">
								<User class="w-3.5 h-3.5 text-indigo-300" />
							</div>
						</div>
						<span class="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#070A10]"></span>
					</div>
					<div class="min-w-0">
						<p class="font-semibold text-xs text-slate-200 truncate leading-none">{$authStore.user.name}</p>
						<p class="text-[10px] text-slate-400 truncate mt-1 leading-none font-normal">{$authStore.user.email}</p>
					</div>
				</div>
			{/if}
			<button 
				on:click={handleLogout}
				title="Log Out"
				class="p-1.5 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 rounded-lg text-slate-400 hover:text-rose-400 transition-all duration-200 active:scale-95 shrink-0"
			>
				<LogOut class="w-3.5 h-3.5" />
			</button>
		</div>
	</div>
</aside>
