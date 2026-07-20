<script lang="ts">
	import { onMount } from "svelte";
	import { goto } from "$app/navigation";
	import { authStore } from "$lib/stores/authStore";
	import { toastStore } from "$lib/stores/toastStore";
	import { apiClient } from "$lib/api/client";
	import { User, Mail, Lock, Eye, EyeOff, ChevronRight } from "lucide-svelte";
	import { fly } from "svelte/transition";
	import { cubicOut } from "svelte/easing";

	let name = "";
	let email = "";
	let password = "";
	let loading = false;
	let showPassword = false;

	onMount(() => {
		if ($authStore.user) {
			goto("/dashboard");
		}
	});

	async function handleRegister() {
		if (!name || !email || !password) {
			toastStore.warning("Please fill in all fields.");
			return;
		}

		if (password.length < 6) {
			toastStore.warning("Password must be at least 6 characters.");
			return;
		}

		loading = true;
		try {
			const res = await apiClient.post("/auth/register", {
				name,
				email,
				password,
			});
			if (res.data.success) {
				authStore.setUser(res.data.user);
				toastStore.success("Account created successfully!");
				goto("/dashboard");
			} else {
				toastStore.danger(res.data.message || "Registration failed.");
			}
		} catch (err: any) {
			toastStore.danger(
				err.response?.data?.message ||
					"Registration failed. Please try again.",
			);
		} finally {
			loading = false;
		}
	}
</script>

<div
	class="min-h-[100dvh] h-screen md:h-screen flex flex-col justify-center items-center p-4 select-none font-sans bg-[#030307] text-white relative overflow-y-auto md:overflow-hidden"
>
	<!-- Background Mesh & Radial Gradients -->
	<div
		class="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
	>
		<!-- Ambient Grid -->
		<div class="absolute inset-0 pointer-events-none bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_70%)] opacity-70"></div>
		<div
			class="absolute -top-[15%] -left-[10%] w-[65%] h-[65%] rounded-full bg-gradient-to-br from-primary/15 via-primary/5 to-transparent blur-[130px] animate-[pulse_10s_infinite_alternate]"
		></div>
		<div
			class="absolute -bottom-[15%] -right-[10%] w-[65%] h-[65%] rounded-full bg-gradient-to-tl from-secondary/15 via-secondary/5 to-transparent blur-[130px] animate-[pulse_12s_infinite_alternate_delay-1000]"
		></div>
		<div
			class="absolute top-[25%] left-[25%] w-[60%] h-[60%] rounded-full bg-gradient-to-tr from-emerald-500/5 via-transparent to-transparent blur-[140px] animate-[pulse_8s_infinite_alternate]"
		></div>
	</div>

	<!-- Logo & Header Block -->
	<div class="w-full max-w-[430px] text-center space-y-4 mb-6 relative z-10">
		<!-- Secure Eyebrow Tag -->
		<div class="flex justify-center">
			<span
				class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] bg-white/[0.03] text-slate-400 border border-white/5 shadow-inner"
			>
				<span
					class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
				></span>
				Create Account
			</span>
		</div>

		<!-- Centered Logo (Reduced weight) -->
		<div class="flex items-center justify-center gap-2">
			<Mail class="w-4 h-4 text-slate-400" />
			<span class="font-medium text-xs text-slate-400 tracking-wider uppercase">Bulk Email Sender</span>
		</div>

		<div class="space-y-1 mt-1">
			<h2
				class="text-xl md:text-2xl font-semibold tracking-tight bg-gradient-to-b from-white to-slate-200 bg-clip-text text-transparent"
			>
				Create your account
			</h2>
			<p class="text-slate-400 text-xs font-medium">
				Get started in a few seconds.
			</p>
		</div>
	</div>

	<!-- Register Card with Double-Bezel nested architecture -->
	<div
		in:fly={{ y: 20, duration: 800, easing: cubicOut }}
		class="w-full max-w-[430px] p-2 bg-white/[0.01] border border-white/5 rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.8)] backdrop-blur-3xl relative z-10"
	>
		<div
			class="bg-[#090d16]/95 border border-white/10 p-7 md:p-8 rounded-[calc(2rem-0.5rem)] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)] space-y-5"
		>
			<form on:submit|preventDefault={handleRegister} class="space-y-4">
				<!-- Full Name Field -->
				<div class="space-y-1.5">
					<label
						for="name"
						class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1"
						>Full Name</label
					>
					<div class="relative group/input">
						<div
							class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-primary transition-colors duration-300"
						>
							<User class="w-4 h-4" />
						</div>
						<input
							id="name"
							type="text"
							bind:value={name}
							placeholder="John Doe"
							class="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50 text-xs md:text-sm font-medium transition-all duration-300 h-12"
							required
							disabled={loading}
						/>
					</div>
				</div>

				<!-- Email Field -->
				<div class="space-y-1.5">
					<label
						for="email"
						class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1"
						>Email Address</label
					>
					<div class="relative group/input">
						<div
							class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-primary transition-colors duration-300"
						>
							<Mail class="w-4 h-4" />
						</div>
						<input
							id="email"
							type="email"
							bind:value={email}
							placeholder="name@company.com"
							class="w-full pl-10 pr-4 py-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50 text-xs md:text-sm font-medium transition-all duration-300 h-12"
							required
							disabled={loading}
						/>
					</div>
				</div>

				<!-- Password Field -->
				<div class="space-y-1.5">
					<label
						for="password"
						class="block text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1"
						>Password</label
					>
					<div class="relative group/input">
						<div
							class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500 group-focus-within/input:text-primary transition-colors duration-300"
						>
							<Lock class="w-4 h-4" />
						</div>
						{#if showPassword}
							<input
								id="password"
								type="text"
								bind:value={password}
								placeholder="••••••••"
								minlength="6"
								class="w-full pl-10 pr-12 py-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50 text-xs md:text-sm font-medium transition-all duration-300 h-12"
								required
								disabled={loading}
							/>
						{:else}
							<input
								id="password"
								type="password"
								bind:value={password}
								placeholder="••••••••"
								minlength="6"
								class="w-full pl-10 pr-12 py-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-primary/30 focus:border-primary/50 text-xs md:text-sm font-medium transition-all duration-300 h-12"
								required
								disabled={loading}
							/>
						{/if}
						<!-- Password visibility toggle -->
						<button
							type="button"
							on:click={() => (showPassword = !showPassword)}
							class="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-white transition-colors duration-200"
							title={showPassword
								? "Hide Password"
								: "Show Password"}
							disabled={loading}
						>
							{#if showPassword}
								<EyeOff class="w-4 h-4" />
							{:else}
								<Eye class="w-4 h-4" />
							{/if}
						</button>
					</div>
				</div>

				<!-- CTA Button -->
				<button
					type="submit"
					disabled={loading}
					class="group w-full h-12 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-950 font-semibold rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.2)] hover:shadow-[0_4px_24px_rgba(255,255,255,0.12)] active:scale-[0.985] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] flex items-center justify-center gap-2.5 text-xs uppercase tracking-wider"
				>
					{#if loading}
						<div
							class="animate-spin rounded-full h-4 w-4 border-2 border-slate-950 border-t-transparent"
						></div>
						<span>Creating Account...</span>
					{:else}
						<span>Create Account</span>
						<span
							class="w-5 h-5 rounded-full bg-slate-950/5 flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 shrink-0"
						>
							<ChevronRight class="w-3.5 h-3.5 text-slate-950" />
						</span>
					{/if}
				</button>
			</form>

			<div
				class="pt-4 border-t border-white/5 text-center text-xs text-slate-400 font-medium"
			>
				Already have an account?
				<a
					href="/login"
					class="text-primary hover:text-primary-light font-bold transition-colors duration-200 ml-1"
					>Sign In</a
				>
			</div>
		</div>
	</div>

	<!-- Tiny Bottom Footer -->
	<div
		class="mt-6 text-[9px] text-slate-600 font-bold uppercase tracking-[0.2em] relative z-10"
	>
		© 2026 BULK EMAIL SENDER CORP. ALL RIGHTS RESERVED.
	</div>
</div>
