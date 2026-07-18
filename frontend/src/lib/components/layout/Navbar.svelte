<script lang="ts">
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/authStore';
	import { toastStore } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { 
		Mail, LayoutDashboard, Send, History, Users, FileText, 
		Calendar, Bell, Settings, User, LogOut, Menu, X 
	} from 'lucide-svelte';

	let mobileMenuOpen = false;

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

<header class="md:hidden bg-slate-900 text-white flex items-center justify-between p-4 shadow-md z-50 shrink-0">
	<div class="flex items-center gap-2">
		<Mail class="w-6 h-6 text-primary" />
		<span class="font-bold text-lg">Antigravity</span>
	</div>
	<button 
		on:click={() => mobileMenuOpen = !mobileMenuOpen}
		class="p-2 hover:bg-slate-800 rounded-lg transition-colors"
	>
		{#if mobileMenuOpen}
			<X class="w-6 h-6" />
		{:else}
			<Menu class="w-6 h-6" />
		{/if}
	</button>
</header>

{#if mobileMenuOpen}
	<div class="md:hidden fixed inset-0 top-[60px] bg-slate-900/95 backdrop-blur-sm z-40 flex flex-col p-6 space-y-6 overflow-y-auto">
		<nav class="space-y-2 flex-grow">
			{#each menuItems as item}
				<a 
					href={item.path}
					on:click={() => mobileMenuOpen = false}
					class="flex items-center gap-4 p-4 rounded-xl font-bold text-base transition-colors"
					class:bg-primary={($page.url.pathname === item.path)}
					class:text-white={($page.url.pathname === item.path)}
					class:text-slate-400={($page.url.pathname !== item.path)}
					class:hover:bg-slate-800={($page.url.pathname !== item.path)}
				>
					<svelte:component this={item.icon} class="w-6 h-6" />
					{item.name}
				</a>
			{/each}
		</nav>
		{#if $authStore.user}
			<div class="border-t border-slate-800 pt-6 flex items-center justify-between">
				<div class="flex items-center gap-3">
					<div class="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center">
						<User class="w-5 h-5 text-slate-300" />
					</div>
					<div>
						<p class="font-bold text-sm text-slate-200">{$authStore.user.name}</p>
						<p class="text-xs text-slate-500">{$authStore.user.email}</p>
					</div>
				</div>
				<button 
					on:click={() => { mobileMenuOpen = false; handleLogout(); }}
					class="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors"
				>
					<LogOut class="w-4 h-4" />
					Logout
				</button>
			</div>
		{/if}
	</div>
{/if}
