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

<aside class="hidden md:flex flex-col w-64 bg-slate-900 text-white shrink-0 shadow-xl h-screen sticky top-0">
	<!-- Brand header -->
	<div class="p-6 border-b border-slate-800 flex items-center gap-3">
		<div class="p-2 bg-gradient-to-tr from-primary to-secondary rounded-xl">
			<Mail class="w-6 h-6 text-white" />
		</div>
		<div>
			<h1 class="font-bold text-lg leading-tight">Antigravity</h1>
			<span class="text-xs text-slate-500 font-semibold uppercase tracking-wider">Bulk Sender</span>
		</div>
	</div>

	<!-- Navigation links -->
	<nav class="flex-grow p-4 space-y-1.5 overflow-y-auto">
		{#each menuItems as item}
			<a 
				href={item.path}
				class="flex items-center gap-3.5 px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200"
				class:bg-primary={($page.url.pathname === item.path)}
				class:text-white={($page.url.pathname === item.path)}
				class:text-slate-400={($page.url.pathname !== item.path)}
				class:hover:bg-slate-800={($page.url.pathname !== item.path)}
				class:hover:text-slate-100={($page.url.pathname !== item.path)}
			>
				<svelte:component this={item.icon} class="w-5 h-5 shrink-0" />
				{item.name}
			</a>
		{/each}
	</nav>

	<!-- User Profile Card -->
	<div class="p-4 border-t border-slate-800 flex items-center justify-between gap-3">
		{#if $authStore.user}
			<div class="flex items-center gap-3 min-w-0">
				<div class="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
					<User class="w-5 h-5 text-slate-300" />
				</div>
				<div class="min-w-0">
					<p class="font-bold text-sm text-slate-200 truncate leading-snug">{$authStore.user.name}</p>
					<p class="text-xs text-slate-500 truncate text-[10px]">{$authStore.user.email}</p>
				</div>
			</div>
		{/if}
		<button 
			on:click={handleLogout}
			title="Log Out"
			class="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-rose-400 transition-colors"
		>
			<LogOut class="w-5 h-5" />
		</button>
	</div>
</aside>
