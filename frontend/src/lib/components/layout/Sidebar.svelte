<script lang="ts">
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/authStore';
	import { toastStore } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { 
		Mail, LayoutDashboard, Send, History, Users, FileText, 
		Calendar, Bell, Settings, User, LogOut 
	} from 'lucide-svelte';

	const menuItems = [
		{ name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
		{ name: 'Compose Campaign', path: '/compose', icon: Send },
		{ name: 'History Logs', path: '/history', icon: History },
		{ name: 'Contact Manager', path: '/contacts', icon: Users },
		{ name: 'Templates Store', path: '/templates', icon: FileText },
		{ name: 'Active Scheduler', path: '/scheduler', icon: Calendar },
		{ name: 'Alert Notification', path: '/notifications', icon: Bell },
		{ name: 'SMTP Configurations', path: '/configs', icon: Settings },
		{ name: 'My Profile', path: '/profile', icon: User }
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

<aside class="hidden md:flex flex-col w-64 bg-[#090d16] text-white shrink-0 border-r border-slate-900/80 h-screen sticky top-0 relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.15)]">
	<!-- Brand header -->
	<div class="p-6 border-b border-slate-900/60 flex items-center gap-3">
		<!-- Double bezel outer shell -->
		<div class="p-1 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center shadow-inner">
			<!-- Inner core -->
			<div class="p-2 bg-gradient-to-tr from-primary to-secondary rounded-xl flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]">
				<Mail class="w-5 h-5 text-white" />
			</div>
		</div>
		<div>
			<h1 class="font-bold text-base leading-tight tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">Bulk Email Sender</h1>
			<span class="text-[10px] text-slate-500 font-bold uppercase tracking-[0.15em] block mt-0.5">Bulk Sender</span>
		</div>
	</div>

	<!-- Navigation links -->
	<nav class="flex-grow p-4 space-y-1.5 overflow-y-auto">
		{#each menuItems as item}
			{@const isActive = $page.url.pathname === item.path}
			<a 
				href={item.path}
				class="flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-xs tracking-wide uppercase transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group relative {isActive ? 'bg-gradient-to-r from-primary to-primary-light text-white shadow-lg shadow-primary/20' : 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-100'}"
			>
				{#if isActive}
					<div class="absolute left-1 w-1 h-5 rounded-full bg-white"></div>
				{/if}
				<svelte:component 
					this={item.icon} 
					class="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110" 
				/>
				<span>{item.name}</span>
			</a>
		{/each}
	</nav>

	<!-- User Profile Card -->
	<div class="p-4 border-t border-slate-900/60 bg-slate-950/40 flex items-center justify-between gap-3">
		{#if $authStore.user}
			<div class="flex items-center gap-3 min-w-0">
				<!-- Double-bezel avatar -->
				<div class="p-0.5 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center">
					<div class="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
						<User class="w-4 h-4 text-slate-300" />
					</div>
				</div>
				<div class="min-w-0">
					<p class="font-bold text-xs text-slate-200 truncate leading-tight">{$authStore.user.name}</p>
					<p class="text-[10px] text-slate-500 truncate mt-0.5 font-medium">{$authStore.user.email}</p>
				</div>
			</div>
		{/if}
		<button 
			on:click={handleLogout}
			title="Log Out"
			class="p-2 hover:bg-slate-900/80 border border-transparent hover:border-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] active:scale-95"
		>
			<LogOut class="w-4 h-4" />
		</button>
	</div>
</aside>
