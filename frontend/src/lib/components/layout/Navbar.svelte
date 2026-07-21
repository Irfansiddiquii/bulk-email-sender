<script lang="ts">
	import { page } from '$app/stores';
	import { authStore } from '$lib/stores/authStore';
	import { toastStore } from '$lib/stores/toastStore';
	import { goto } from '$app/navigation';
	import { fade, slide } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
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

<header class="md:hidden bg-[#090d16] text-white flex items-center justify-between px-5 py-4 border-b border-slate-900 sticky top-0 z-50 shadow-lg shrink-0">
	<div class="flex items-center gap-2.5">
		<div class="p-1.5 bg-gradient-to-tr from-primary to-secondary rounded-lg flex items-center justify-center">
			<Mail class="w-4.5 h-4.5 text-white" />
		</div>
		<span class="font-bold text-base tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-200 bg-clip-text text-transparent">Bulk Email Sender</span>
	</div>
	<button 
		on:click={() => mobileMenuOpen = !mobileMenuOpen}
		class="p-2 hover:bg-slate-900 border border-transparent hover:border-slate-800 rounded-xl transition-all duration-300 active:scale-90"
		aria-label="Toggle Menu"
	>
		{#if mobileMenuOpen}
			<X class="w-5 h-5 text-slate-300" />
		{:else}
			<Menu class="w-5 h-5 text-slate-300" />
		{/if}
	</button>
</header>

{#if mobileMenuOpen}
	<!-- Overlay backdrop -->
	<button 
		type="button"
		aria-label="Close Mobile Navigation Menu"
		transition:fade={{ duration: 250 }} 
		class="md:hidden fixed inset-0 top-[57px] w-full h-full bg-[#090d16]/40 backdrop-blur-md z-40 cursor-default border-none outline-none"
		on:click={() => mobileMenuOpen = false}
		on:keydown={(e) => { if (e.key === 'Escape') mobileMenuOpen = false; }}
	></button>

	<!-- Menu content -->
	<div 
		transition:slide={{ duration: 300, easing: cubicOut }}
		class="md:hidden fixed top-[57px] left-0 right-0 max-h-[calc(100vh-57px)] bg-[#090d16] border-b border-slate-900 z-50 flex flex-col p-6 space-y-6 overflow-y-auto shadow-2xl"
	>
		<nav class="space-y-1.5 flex-grow">
			{#each menuItems as item}
				{@const isActive = $page.url.pathname === item.path}
				<a 
					href={item.path}
					on:click={() => mobileMenuOpen = false}
					class="flex items-center gap-3.5 p-3 rounded-xl font-semibold text-xs tracking-wide uppercase transition-all duration-200"
					class:bg-gradient-to-r={isActive}
					class:from-primary={isActive}
					class:to-primary-light={isActive}
					class:text-white={isActive}
					class:text-slate-400={!isActive}
					class:hover:bg-slate-900={!isActive}
				>
					<svelte:component this={item.icon} class="w-4.5 h-4.5" />
					<span>{item.name}</span>
				</a>
			{/each}
		</nav>
		{#if $authStore.user}
			<div class="border-t border-slate-900/80 pt-5 flex items-center justify-between gap-3">
				<div class="flex items-center gap-3 min-w-0">
					<div class="w-9 h-9 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center shrink-0">
						<User class="w-4.5 h-4.5 text-slate-400" />
					</div>
					<div class="min-w-0">
						<p class="font-bold text-xs text-slate-200 truncate leading-tight">{$authStore.user.name}</p>
						<p class="text-[10px] text-slate-500 truncate mt-0.5 font-medium">{$authStore.user.email}</p>
					</div>
				</div>
				<button 
					on:click={() => { mobileMenuOpen = false; handleLogout(); }}
					class="flex items-center gap-2 bg-rose-500/10 hover:bg-rose-500/20 active:scale-95 text-rose-400 border border-rose-500/10 px-4 py-2.5 rounded-xl font-semibold text-xs transition-all uppercase tracking-wider shrink-0"
				>
					<LogOut class="w-3.5 h-3.5" />
					Logout
				</button>
			</div>
		{/if}
	</div>
{/if}
