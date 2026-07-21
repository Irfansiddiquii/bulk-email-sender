<script lang="ts">
	import { onMount, onDestroy } from "svelte";
	import { toastStore } from "$lib/stores/toastStore";
	import { configsStore } from "$lib/stores/configsStore";
	import { sendApi } from "$lib/api/send";
	import Header from "$lib/components/layout/Header.svelte";
	import {
		Calendar,
		Trash2,
		Clock,
		Mail,
		AlertCircle,
		RefreshCw,
		Plus,
		Sparkles,
		CheckCircle2,
		Activity,
		Users,
		Bell,
		X,
		Send,
		FileSpreadsheet,
		LayoutTemplate,
		FileCode,
		ArrowRight,
		ChevronDown,
		ChevronLeft,
		ChevronRight,
		Settings,
		Check
	} from "lucide-svelte";
	import type { ScheduledJob } from "$lib/types";

	let loading = true;
	let scheduledJobs: ScheduledJob[] = [];
	let timer: NodeJS.Timeout | null = null;
	let secondTimer: NodeJS.Timeout | null = null;
	let refreshing = false;
	let lastPolledTime: Date | null = null;
	let secondsAgo = 0;

	// In-page Schedule Modal state
	let showScheduleModal = false;
	let templates: any[] = [];
	let selectedTemplateId = "";
	let scheduleSubject = "";
	let scheduleBody = "";
	let selectedConfigId = "";
	let scheduledTime = "";
	let notifyEmail = "";
	let excelFile: File | null = null;
	let submittingSchedule = false;

	// Custom Dropdowns UI State
	let showTemplateDropdown = false;
	let showSmtpDropdown = false;
	let showDatePickerPopover = false;

	// Custom Date Picker Menu States (No native select elements)
	let showMonthMenu = false;
	let showYearMenu = false;
	let showHourMenu = false;
	let showMinuteMenu = false;

	// Custom Premium Calendar & Time Picker State
	let calendarMonth = new Date().getMonth();
	let calendarYear = new Date().getFullYear();
	let selectedDate = new Date(Date.now() + 3600 * 1000);
	let selectedHour = 12;
	let selectedMinute = 0;
	let selectedAmPm: "AM" | "PM" = "PM";

	const monthNames = [
		"January",
		"February",
		"March",
		"April",
		"May",
		"June",
		"July",
		"August",
		"September",
		"October",
		"November",
		"December"
	];
	const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

	onMount(async () => {
		await configsStore.load();
		await loadScheduledJobs();

		// Poll scheduled jobs every 15 seconds while on this page
		timer = setInterval(loadScheduledJobs, 15000);

		// Update seconds-ago counter every 1 second
		secondTimer = setInterval(() => {
			if (lastPolledTime) {
				secondsAgo = Math.floor((Date.now() - lastPolledTime.getTime()) / 1000);
			}
		}, 1000);
	});

	onDestroy(() => {
		if (timer) {
			clearInterval(timer);
		}
		if (secondTimer) {
			clearInterval(secondTimer);
		}
		if (typeof document !== "undefined") {
			document.body.style.overflow = "";
		}
	});

	// Lock body scrolling when modal opens
	$: if (typeof document !== "undefined") {
		if (showScheduleModal) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "";
		}
	}

	function clickOutside(node: HTMLElement, callback: () => void) {
		const handleClick = (event: MouseEvent) => {
			if (node && !node.contains(event.target as Node)) {
				callback();
			}
		};
		document.addEventListener("click", handleClick, true);
		return {
			destroy() {
				document.removeEventListener("click", handleClick, true);
			}
		};
	}

	function initDatePicker() {
		const target = new Date(Date.now() + 3600 * 1000); // 1 hr from now
		calendarMonth = target.getMonth();
		calendarYear = target.getFullYear();
		selectedDate = new Date(target.getFullYear(), target.getMonth(), target.getDate());

		let h = target.getHours();
		selectedAmPm = h >= 12 ? "PM" : "AM";
		h = h % 12;
		selectedHour = h === 0 ? 12 : h;
		selectedMinute = Math.floor(target.getMinutes() / 5) * 5;

		showMonthMenu = false;
		showYearMenu = false;
		showHourMenu = false;
		showMinuteMenu = false;
	}

	// Compute ISO scheduledTime string from selectedDate and time controls
	$: if (selectedDate) {
		const year = selectedDate.getFullYear();
		const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
		const day = String(selectedDate.getDate()).padStart(2, "0");
		let h = selectedHour;
		if (selectedAmPm === "PM" && h < 12) h += 12;
		if (selectedAmPm === "AM" && h === 12) h = 0;
		const hours = String(h).padStart(2, "0");
		const minutes = String(selectedMinute).padStart(2, "0");
		scheduledTime = `${year}-${month}-${day}T${hours}:${minutes}`;
	}

	function getDaysInMonth(year: number, month: number) {
		return new Date(year, month + 1, 0).getDate();
	}

	function getFirstDayOfWeek(year: number, month: number) {
		const day = new Date(year, month, 1).getDay();
		return day === 0 ? 6 : day - 1;
	}

	function prevMonth() {
		if (calendarMonth === 0) {
			calendarMonth = 11;
			calendarYear -= 1;
		} else {
			calendarMonth -= 1;
		}
	}

	function nextMonth() {
		if (calendarMonth === 11) {
			calendarMonth = 0;
			calendarYear += 1;
		} else {
			calendarMonth += 1;
		}
	}

	function setToday() {
		const now = new Date();
		calendarMonth = now.getMonth();
		calendarYear = now.getFullYear();
		selectedDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
	}

	function selectDay(dayNumber: number) {
		selectedDate = new Date(calendarYear, calendarMonth, dayNumber);
	}

	function setTimeShortcut(hoursFromNow: number) {
		const target = new Date(Date.now() + hoursFromNow * 3600 * 1000);
		calendarMonth = target.getMonth();
		calendarYear = target.getFullYear();
		selectedDate = new Date(target.getFullYear(), target.getMonth(), target.getDate());

		let h = target.getHours();
		selectedAmPm = h >= 12 ? "PM" : "AM";
		h = h % 12;
		selectedHour = h === 0 ? 12 : h;
		selectedMinute = Math.floor(target.getMinutes() / 5) * 5;
	}

	function openScheduleModal() {
		// Load templates from localStorage
		const storedTemps = localStorage.getItem("campaign_templates");
		if (storedTemps) {
			try {
				templates = JSON.parse(storedTemps);
			} catch (e) {
				templates = [];
			}
		} else {
			templates = [];
		}

		// Ensure configs are loaded
		configsStore.load();

		// Select default config if available
		const def = $configsStore.find((c) => c.isDefault);
		if (def) {
			selectedConfigId = def.id;
		} else if ($configsStore.length > 0) {
			selectedConfigId = $configsStore[0].id;
		}

		// Reset form state
		selectedTemplateId = "";
		scheduleSubject = "";
		scheduleBody = "";
		excelFile = null;
		notifyEmail = "";
		showTemplateDropdown = false;
		showSmtpDropdown = false;
		showDatePickerPopover = false;

		initDatePicker();

		showScheduleModal = true;
	}

	$: selectedTemplate = templates.find((t) => t.id === selectedTemplateId);
	$: selectedConfig = $configsStore.find((c) => c.id === selectedConfigId);

	$: formattedTargetTime = scheduledTime
		? (() => {
				try {
					const d = new Date(scheduledTime);
					return isNaN(d.getTime())
						? ""
						: d.toLocaleDateString("en-US", {
								weekday: "short",
								month: "short",
								day: "numeric",
								year: "numeric",
								hour: "2-digit",
								minute: "2-digit"
						  });
				} catch (e) {
					return "";
				}
		  })()
		: "";

	function handleScheduleFileChange(e: Event) {
		const target = e.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			excelFile = target.files[0];
			toastStore.success(`Attached ${excelFile.name} for schedule dispatch.`);
		}
	}

	async function handleCreateSchedule() {
		if (templates.length === 0) {
			toastStore.warning("Please create a campaign template first.");
			return;
		}

		if (!selectedConfigId && $configsStore.length > 0) {
			selectedConfigId = $configsStore[0].id;
		}

		if (!selectedConfigId) {
			toastStore.warning("Please configure an SMTP account first.");
			return;
		}

		if (!scheduleSubject) {
			toastStore.warning("Please enter a campaign subject.");
			return;
		}

		if (!scheduledTime) {
			toastStore.warning("Please pick a scheduled date and time.");
			return;
		}

		submittingSchedule = true;

		try {
			const formData = new FormData();
			formData.append("configId", selectedConfigId);
			formData.append("subject", scheduleSubject);
			formData.append("htmlContent", scheduleBody || "<p>Scheduled campaign body</p>");
			formData.append("delay", "20");
			formData.append("emailRangeStart", "0");
			formData.append("emailRangeCount", "100");
			formData.append("scheduleEmail", "on");
			formData.append("scheduledTime", scheduledTime);
			if (notifyEmail) formData.append("notifyEmail", notifyEmail);

			if (excelFile) {
				formData.append("excelFile", excelFile);
			} else {
				// Provide a fallback lightweight CSV file
				const dummyCsv = "Name,Email,Company\nRecipient,recipient@example.com,Organization";
				const dummyFile = new File([dummyCsv], "schedule_recipients.csv", { type: "text/csv" });
				formData.append("excelFile", dummyFile);
			}

			const res = await sendApi.sendCampaign(formData);
			if (res.data.success) {
				toastStore.success("Campaign scheduled successfully.");
				showScheduleModal = false;
				await loadScheduledJobs();
			} else {
				toastStore.danger(res.data.message || "Failed to schedule campaign.");
			}
		} catch (err: any) {
			toastStore.danger(err.response?.data?.message || "Error scheduling campaign.");
		} finally {
			submittingSchedule = false;
		}
	}

	async function loadScheduledJobs() {
		refreshing = true;
		try {
			const res = await sendApi.getScheduledJobs();
			if (res.data.success) {
				scheduledJobs = res.data.data || [];
			}
		} catch (err) {
			console.error("Error fetching scheduled jobs:", err);
		} finally {
			loading = false;
			lastPolledTime = new Date();
			secondsAgo = 0;
			setTimeout(() => {
				refreshing = false;
			}, 400);
		}
	}

	async function cancelJob(id: string, subject: string) {
		if (confirm(`Cancel scheduled campaign "${subject}"?`)) {
			try {
				const res = await sendApi.deleteScheduledJob(id);
				if (res.data.success) {
					toastStore.success("Scheduled campaign cancelled successfully.");
					await loadScheduledJobs();
				} else {
					toastStore.danger(res.data.message || "Failed to cancel job.");
				}
			} catch (err: any) {
				toastStore.danger(err.response?.data?.message || "Failed to cancel scheduled campaign.");
			}
		}
	}
</script>

<div class="space-y-6 w-full max-w-7xl mx-auto pb-12">
	<!-- Page Header & Main Controls -->
	<Header
		title="Automation Scheduler"
		subtitle="View and manage automated campaigns set to dispatch in the future"
	/>

	<!-- Single Premium Unified Toolbar (Doppelrand / Double-Bezel Enclosure) -->
	<div class="p-1.5 rounded-[1.5rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-xs mb-8 backdrop-blur-xl transition-all duration-200">
		<div
			class="bg-white rounded-[calc(1.5rem-0.375rem)] p-3.5 sm:p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4 shadow-2xs relative z-20"
		>
			<!-- Status / Overview Badge -->
			<div class="flex items-center gap-3">
				<div class="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 shadow-2xs">
					<Calendar class="w-5 h-5" />
				</div>
				<div>
					<div class="flex items-center gap-2">
						<h2 class="font-bold text-slate-900 text-base">Campaign Dispatch Queue</h2>
						<span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
							<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
							Engine Live
						</span>
					</div>
					<p class="text-xs text-slate-500">Automated queue evaluated continuously</p>
				</div>
			</div>

			<!-- Toolbar Actions & Primary CTA -->
			<div class="flex items-center justify-between sm:justify-end gap-3 shrink-0">
				<button
					on:click={loadScheduledJobs}
					class="bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 font-semibold px-3.5 py-2 rounded-xl border border-slate-200/80 text-xs transition-all duration-150 flex items-center gap-2 shadow-2xs shrink-0"
					title="Refresh Schedules"
				>
					<RefreshCw class="w-3.5 h-3.5 text-slate-500 {refreshing ? 'animate-spin text-indigo-600' : ''}" />
					<span class="hidden xs:inline">Refresh</span>
				</button>

				<div
					class="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100/80 border border-slate-200/60 text-xs font-semibold text-slate-700 select-none shrink-0"
				>
					<Clock class="w-3.5 h-3.5 text-indigo-600" />
					<span>{scheduledJobs.length} {scheduledJobs.length === 1 ? "Job" : "Jobs"}</span>
				</div>

				<!-- In-Page Schedule Trigger Button -->
				<button
					on:click={openScheduleModal}
					class="relative group overflow-hidden bg-slate-900 hover:bg-slate-800 text-white font-semibold pl-4 pr-2.5 py-2 rounded-xl text-xs sm:text-sm shadow-md shadow-slate-900/10 hover:shadow-xl hover:shadow-indigo-500/15 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2.5 shrink-0"
				>
					<span class="tracking-tight text-white font-semibold">Create Schedule</span>
					<div class="w-7 h-7 rounded-lg bg-white/10 border border-white/10 text-white flex items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:border-indigo-400 group-hover:scale-105 transition-all duration-200 shadow-2xs">
						<Plus class="w-4 h-4 text-white group-hover:rotate-90 transition-transform duration-300" />
					</div>
				</button>
			</div>
		</div>
	</div>

	<!-- Scheduling Stats Metric Overview Strip -->
	<div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
		<div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-2xs transition-all duration-200">
			<div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100">
				<div class="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0">
					<Clock class="w-5 h-5" />
				</div>
				<div>
					<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Upcoming Jobs</p>
					<p class="text-xl font-bold text-slate-900 leading-none mt-1">{scheduledJobs.length}</p>
				</div>
			</div>
		</div>

		<div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-blue-200/70 hover:border-blue-400/80 shadow-2xs transition-all duration-200">
			<div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100">
				<div class="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shrink-0">
					<Activity class="w-5 h-5" />
				</div>
				<div>
					<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Active Dispatch</p>
					<p class="text-xl font-bold text-slate-900 leading-none mt-1">
						{scheduledJobs.filter(j => j.status === 'running').length}
					</p>
				</div>
			</div>
		</div>

		<div class="p-1 rounded-2xl bg-slate-900/[0.03] border border-emerald-200/70 hover:border-emerald-400/80 shadow-2xs transition-all duration-200">
			<div class="bg-white rounded-[calc(1rem-0.25rem)] p-4 flex items-center gap-3.5 border border-slate-100">
				<div class="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center shrink-0">
					<CheckCircle2 class="w-5 h-5" />
				</div>
				<div>
					<p class="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">Polling Heartbeat</p>
					<p class="text-xs font-semibold text-emerald-700 mt-1 flex items-center gap-1.5">
						<span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
						<span>Last checked {secondsAgo <= 0 ? "Just now" : `${secondsAgo}s ago`}</span>
					</p>
				</div>
			</div>
		</div>
	</div>

	{#if loading}
		<div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 shadow-md">
			<div class="bg-white rounded-[calc(2.25rem-0.5rem)] p-12 text-center flex flex-col items-center justify-center border border-slate-100">
				<div class="animate-spin rounded-full h-9 w-9 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
				<p class="text-slate-600 font-semibold text-sm">Retrieving automated schedules...</p>
				<p class="text-slate-400 text-xs mt-1">Syncing with campaign queue background engine</p>
			</div>
		</div>
	{:else}
		{#if scheduledJobs.length === 0}
			<!-- High-End Rich Empty State -->
			<div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md">
				<div class="bg-white rounded-[calc(2.25rem-0.5rem)] p-8 sm:p-12 text-center border border-slate-100 shadow-[inset_0_1px_1px_rgba(255,255,255,0.9)] max-w-2xl mx-auto my-4">
					<div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/25 flex items-center justify-center mx-auto mb-5">
						<Calendar class="w-8 h-8 text-white" />
					</div>
					<h3 class="text-xl font-bold text-slate-900 tracking-tight">No Active Schedules</h3>
					<p class="text-sm text-slate-500 max-w-md mx-auto leading-relaxed mt-2 mb-8">
						Automate your email dispatch queue by scheduling campaigns in advance. Scheduled mailings execute automatically at your specified date and time.
					</p>
					<button
						on:click={openScheduleModal}
						class="inline-flex items-center gap-2.5 bg-slate-900 hover:bg-indigo-600 text-white font-semibold px-6 py-3 rounded-xl text-sm shadow-md shadow-slate-900/10 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-[0.98] transition-all"
					>
						<Plus class="w-4.5 h-4.5" />
						<span>Schedule New Campaign</span>
					</button>
				</div>
			</div>
		{:else}
			<!-- Premium Doppelrand Table Container -->
			<div class="p-1.5 rounded-[2.25rem] bg-gradient-to-b from-slate-900/[0.03] to-indigo-900/[0.03] border border-indigo-200/70 hover:border-indigo-400/80 hover:ring-1 hover:ring-indigo-400/20 shadow-md backdrop-blur-xl transition-all duration-300 relative overflow-hidden group">
				<div class="bg-white rounded-[calc(2.25rem-0.5rem)] overflow-hidden border border-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)]">
					<div class="overflow-x-auto">
						<table class="w-full text-sm text-left text-slate-600">
							<thead class="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-50/80 text-slate-400 border-b border-slate-200/80">
								<tr>
									<th class="px-6 py-4">Campaign Subject</th>
									<th class="px-6 py-4">Execution Time</th>
									<th class="px-6 py-4">Recipients</th>
									<th class="px-6 py-4">Notification Email</th>
									<th class="px-6 py-4">Status</th>
									<th class="px-6 py-4 text-right w-20">Cancel</th>
								</tr>
							</thead>
							<tbody class="divide-y divide-slate-100/90">
								{#each scheduledJobs as job (job.id)}
									<tr class="hover:bg-slate-50/70 transition-all duration-150">
										<td class="px-6 py-4 font-semibold text-slate-900 flex items-center gap-2.5">
											<div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-100/80">
												<Mail class="w-4 h-4" />
											</div>
											<span class="truncate max-w-xs">{job.subject || "Mailing Campaign"}</span>
										</td>
										<td class="px-6 py-4">
											<span class="inline-flex items-center gap-1.5 font-mono text-xs text-slate-700 bg-slate-100/70 px-2.5 py-1 rounded-lg border border-slate-200/60">
												<Clock class="w-3 h-3 text-slate-400" />
												{new Date(job.scheduled_time || job.scheduledTime || Date.now()).toLocaleString()}
											</span>
										</td>
										<td class="px-6 py-4">
											<span class="inline-flex items-center gap-1 font-semibold text-slate-700 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200/60 text-xs">
												<Users class="w-3 h-3 text-slate-400" />
												{job.contact_count || "All Contacts"}
											</span>
										</td>
										<td class="px-6 py-4 text-xs font-medium text-slate-600">
											{#if job.notify_email}
												<span class="inline-flex items-center gap-1 text-slate-700">
													<Bell class="w-3 h-3 text-indigo-500" />
													{job.notify_email}
												</span>
											{:else}
												<span class="text-slate-400 italic">None</span>
											{/if}
										</td>
										<td class="px-6 py-4">
											{#if job.status === "running"}
												<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 border border-blue-200 animate-pulse">
													<span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-ping"></span>
													Running
												</span>
											{:else}
												<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700 border border-amber-200">
													<span class="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
													Scheduled
												</span>
											{/if}
										</td>
										<td class="px-6 py-4 text-right">
											<button
												on:click={() => cancelJob(job.id, job.subject)}
												disabled={job.status === "running"}
												class="w-9 h-9 rounded-xl bg-slate-50 hover:bg-rose-50 border border-slate-200/70 hover:border-rose-200 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-all duration-200 shadow-2xs disabled:opacity-30 disabled:cursor-not-allowed group/del active:scale-95"
												title="Cancel Campaign"
												aria-label="Cancel campaign {job.subject}"
											>
												<Trash2 class="w-4 h-4 transition-transform group-hover/del:scale-110" />
											</button>
										</td>
									</tr>
								{/each}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		{/if}
	{/if}
</div>

{#if showScheduleModal}
	<!-- Modal Overlay Centered Relative to Content Area (Respects Sidebar Offset md:left-64) -->
	<div
		role="presentation"
		class="fixed inset-0 md:left-64 bg-slate-950/70 backdrop-blur-md z-40 p-4 sm:p-6 md:p-8 flex items-center justify-center overflow-y-auto select-none animate-in fade-in duration-200"
		on:click|self={() => (showScheduleModal = false)}
		on:keydown|self={(e) => { if (e.key === 'Escape') showScheduleModal = false; }}
	>
		<!-- Double-Bezel Centered Modal Container -->
		<div
			class="relative w-full max-w-2xl bg-white rounded-[2.25rem] border border-slate-200/90 shadow-2xl shadow-slate-950/30 p-6 sm:p-8 space-y-6 overflow-hidden max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 select-text"
		>
			<div class="absolute top-0 left-10 right-10 h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-600 z-10"></div>

			<!-- Modal Header -->
			<div class="flex justify-between items-center border-b border-slate-100/90 pb-5 shrink-0">
				<div class="flex items-center gap-4">
					<div class="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-md shadow-indigo-500/20 shrink-0">
						<Calendar class="w-6 h-6 text-white" />
					</div>
					<div>
						<div class="flex items-center gap-2.5">
							<h3 class="font-bold text-slate-900 text-lg sm:text-xl tracking-tight leading-snug">
								Schedule Automated Campaign
							</h3>
							<span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-50 text-indigo-700 border border-indigo-100/80 shadow-2xs">
								<Sparkles class="w-3.5 h-3.5 text-indigo-600" />
								Automated Dispatch
							</span>
						</div>
						<p class="text-xs sm:text-sm text-slate-500 mt-0.5 font-normal">Configure dispatch timing, SMTP sender, and campaign templates</p>
					</div>
				</div>
				<button
					on:click={() => (showScheduleModal = false)}
					aria-label="Close modal"
					class="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95"
				>
					<X class="w-5 h-5" />
				</button>
			</div>

			<!-- Modal Content Body -->
			<div class="overflow-y-auto flex-grow space-y-5 pr-1">
				{#if templates.length === 0}
					<!-- Notice Banner when no templates exist -->
					<div class="p-6 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-center max-w-lg mx-auto my-4 space-y-4">
						<div class="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 border border-amber-200 flex items-center justify-center mx-auto shadow-2xs">
							<AlertCircle class="w-6 h-6" />
						</div>
						<div>
							<h4 class="font-bold text-amber-900 text-base">No Saved Campaign Templates Found</h4>
							<p class="text-xs text-amber-700 mt-1.5 leading-relaxed">
								To schedule an automated dispatch, you must first create or select a campaign template. Create a campaign template first to proceed with scheduling.
							</p>
						</div>
						<div class="flex items-center justify-center gap-3 pt-2">
							<button
								on:click={() => (showScheduleModal = false)}
								class="px-4 py-2 bg-white border border-amber-200 text-amber-800 font-semibold text-xs rounded-xl shadow-2xs hover:bg-amber-100/50 transition-colors"
							>
								Cancel
							</button>
							<a
								href="/compose"
								class="px-4.5 py-2 bg-slate-900 hover:bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-1.5"
							>
								<Plus class="w-3.5 h-3.5" />
								<span>Create Campaign</span>
							</a>
						</div>
					</div>
				{:else}
					<!-- Schedule Form Fields -->
					<div class="space-y-5">
						<!-- Custom Campaign Template Select -->
						<div class="relative" use:clickOutside={() => (showTemplateDropdown = false)}>
							<label
								for="schedule-template-trigger"
								class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono"
							>
								<span class="flex items-center gap-1.5">
									<LayoutTemplate class="w-3.5 h-3.5 text-indigo-500" />
									Select Campaign Template <span class="text-rose-500">*</span>
								</span>
								<span class="text-[10px] text-slate-400 font-sans font-normal uppercase">
									{templates.length} {templates.length === 1 ? "Template" : "Templates"} Available
								</span>
							</label>

							<button
								id="schedule-template-trigger"
								type="button"
								on:click={() => (showTemplateDropdown = !showTemplateDropdown)}
								class="w-full pl-4 pr-10 py-3 bg-slate-50/80 hover:bg-slate-50 active:bg-slate-100 border border-slate-200/80 hover:border-indigo-300 rounded-xl text-left transition-all shadow-2xs flex items-center justify-between gap-3 group"
							>
								{#if selectedTemplate}
									<div class="min-w-0">
										<p class="font-bold text-slate-900 text-sm truncate">{selectedTemplate.name}</p>
										<p class="text-xs text-slate-500 truncate mt-0.5">{selectedTemplate.subject}</p>
									</div>
								{:else}
									<span class="text-sm font-medium text-slate-400">-- Select a Saved Template --</span>
								{/if}
								<ChevronDown class="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 shrink-0 {showTemplateDropdown ? 'rotate-180 text-indigo-600' : ''}" />
							</button>

							{#if showTemplateDropdown}
								<div class="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl p-2 z-50 max-h-56 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-150">
									{#each templates as t}
										<button
											type="button"
											on:click={() => {
												selectedTemplateId = t.id;
												scheduleSubject = t.subject;
												scheduleBody = t.body;
												showTemplateDropdown = false;
											}}
											class="w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between gap-3 {selectedTemplateId === t.id ? 'bg-indigo-50/80 text-indigo-900 border border-indigo-100 font-semibold' : 'hover:bg-slate-50 text-slate-700'}"
										>
											<div class="min-w-0">
												<p class="font-semibold text-xs sm:text-sm text-slate-900 truncate">{t.name}</p>
												<p class="text-[11px] text-slate-500 truncate mt-0.5">{t.subject}</p>
											</div>
											{#if selectedTemplateId === t.id}
												<div class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
													<Check class="w-3 h-3" />
												</div>
											{/if}
										</button>
									{/each}
								</div>
							{/if}
						</div>

						<!-- Subject Line Input -->
						<div>
							<label for="schedule-subject-input" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono">
								Campaign Subject <span class="text-rose-500">*</span>
							</label>
							<input
								id="schedule-subject-input"
								type="text"
								bind:value={scheduleSubject}
								placeholder="e.g. Special Product Update"
								class="w-full px-4 py-3 bg-slate-50/70 focus:bg-white rounded-xl border border-slate-200/80 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/12 focus:border-indigo-500 transition-all shadow-inner/5"
							/>
						</div>

						<!-- SMTP Account Selection -->
						<div class="relative" use:clickOutside={() => (showSmtpDropdown = false)}>
							<label
								for="schedule-smtp-trigger"
								class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono"
							>
								<span class="flex items-center gap-1.5">
									<Settings class="w-3.5 h-3.5 text-indigo-500" />
									SMTP Sender Account <span class="text-rose-500">*</span>
								</span>
							</label>

							{#if $configsStore.length === 0}
								<div class="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-center justify-between gap-3 text-xs">
									<div class="flex items-center gap-2 text-amber-900 font-medium">
										<AlertCircle class="w-4 h-4 text-amber-600 shrink-0" />
										<span>No SMTP account configured.</span>
									</div>
									<a
										href="/configs"
										class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs shadow-2xs transition-colors shrink-0"
									>
										<Settings class="w-3.5 h-3.5" />
										<span>Configure SMTP</span>
									</a>
								</div>
							{:else}
								<button
									id="schedule-smtp-trigger"
									type="button"
									on:click={() => (showSmtpDropdown = !showSmtpDropdown)}
									class="w-full pl-4 pr-10 py-3 bg-slate-50/80 hover:bg-slate-50 active:bg-slate-100 border border-slate-200/80 hover:border-indigo-300 rounded-xl text-left transition-all shadow-2xs flex items-center justify-between gap-3 group"
								>
									{#if selectedConfig}
										<div class="min-w-0">
											<p class="font-bold text-slate-900 text-xs sm:text-sm truncate">{selectedConfig.name || selectedConfig.host}</p>
											<p class="text-[11px] text-slate-500 truncate">{selectedConfig.senderEmail}</p>
										</div>
									{:else}
										<span class="text-sm font-medium text-slate-400">-- Select SMTP Account --</span>
									{/if}
									<ChevronDown class="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 shrink-0 {showSmtpDropdown ? 'rotate-180 text-indigo-600' : ''}" />
								</button>

								{#if showSmtpDropdown}
									<div class="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-2xl p-2 z-50 max-h-56 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-150">
										{#each $configsStore as cfg}
											<button
												type="button"
												on:click={() => {
													selectedConfigId = cfg.id;
													showSmtpDropdown = false;
												}}
												class="w-full p-2.5 rounded-xl text-left transition-all flex items-center justify-between gap-3 {selectedConfigId === cfg.id ? 'bg-indigo-50/80 text-indigo-900 border border-indigo-100 font-semibold' : 'hover:bg-slate-50 text-slate-700'}"
											>
												<div class="min-w-0">
													<p class="font-semibold text-xs sm:text-sm text-slate-900 truncate">{cfg.name || cfg.host}</p>
													<p class="text-[11px] text-slate-500 truncate">{cfg.senderEmail}</p>
												</div>
												{#if selectedConfigId === cfg.id}
													<div class="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
														<Check class="w-3 h-3" />
													</div>
												{/if}
											</button>
										{/each}
									</div>
								{/if}
							{/if}
						</div>

						<!-- Execution Date & Time Field with Popover Pop-up Calendar -->
						<div class="relative" use:clickOutside={() => (showDatePickerPopover = false)}>
							<label
								for="schedule-datepicker-trigger"
								class="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono"
							>
								<span class="flex items-center gap-1.5">
									<Calendar class="w-3.5 h-3.5 text-indigo-500" />
									Execution Date & Time <span class="text-rose-500">*</span>
								</span>
							</label>

							<!-- Styled Date/Time Input Trigger Bar with Calendar Icon -->
							<button
								id="schedule-datepicker-trigger"
								type="button"
								on:click={() => (showDatePickerPopover = !showDatePickerPopover)}
								class="w-full pl-3.5 pr-10 py-3 bg-slate-50/80 hover:bg-slate-50 active:bg-slate-100 border border-slate-200/80 hover:border-indigo-300 rounded-xl text-left transition-all shadow-2xs flex items-center justify-between gap-3 group"
							>
								<div class="flex items-center gap-3 min-w-0">
									<div class="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center shrink-0 shadow-2xs group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-200">
										<Calendar class="w-4 h-4" />
									</div>
									<div class="min-w-0">
										<p class="font-bold text-slate-900 text-xs sm:text-sm truncate">
											{formattedTargetTime || "Select Date & Time"}
										</p>
										<p class="text-[11px] text-indigo-600 font-medium truncate">
											Click to choose execution timing
										</p>
									</div>
								</div>
								<ChevronDown class="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 shrink-0 {showDatePickerPopover ? 'rotate-180 text-indigo-600' : ''}" />
							</button>

							{#if showDatePickerPopover}
								<!-- Floating Popover Calendar Dropdown Card -->
								<div
									class="absolute left-0 right-0 sm:right-auto sm:w-[380px] top-full mt-2 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-4"
								>
									<!-- Month & Year Selectors & Navigation Header -->
									<div class="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
										<div class="flex items-center gap-1.5">
											<button
												type="button"
												on:click={prevMonth}
												class="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all border border-slate-200/80 shadow-2xs"
												title="Previous Month"
											>
												<ChevronLeft class="w-3.5 h-3.5" />
											</button>

											<!-- Custom Premium Month Floating Dropdown -->
											<div class="relative" use:clickOutside={() => (showMonthMenu = false)}>
												<button
													type="button"
													on:click={() => { showMonthMenu = !showMonthMenu; showYearMenu = false; }}
													class="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-800 transition-all flex items-center gap-1.5 shadow-2xs group"
												>
													<span>{monthNames[calendarMonth]}</span>
													<ChevronDown class="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 {showMonthMenu ? 'rotate-180 text-indigo-600' : ''}" />
												</button>

												{#if showMonthMenu}
													<div class="absolute left-0 top-full mt-1.5 w-36 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-2xl p-1.5 z-50 max-h-56 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-150">
														{#each monthNames as mName, idx}
															<button
																type="button"
																on:click={() => { calendarMonth = idx; showMonthMenu = false; }}
																class="w-full px-3 py-1.5 rounded-xl text-left text-xs transition-all flex items-center justify-between {calendarMonth === idx ? 'bg-indigo-50/80 text-indigo-900 font-bold border border-indigo-100' : 'hover:bg-slate-50 font-medium text-slate-700'}"
															>
																<span>{mName}</span>
																{#if calendarMonth === idx}
																	<Check class="w-3.5 h-3.5 text-indigo-600 shrink-0" />
																{/if}
															</button>
														{/each}
													</div>
												{/if}
											</div>

											<!-- Custom Premium Year Floating Dropdown -->
											<div class="relative" use:clickOutside={() => (showYearMenu = false)}>
												<button
													type="button"
													on:click={() => { showYearMenu = !showYearMenu; showMonthMenu = false; }}
													class="px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 active:bg-slate-200 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-800 transition-all flex items-center gap-1.5 shadow-2xs group"
												>
													<span>{calendarYear}</span>
													<ChevronDown class="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 {showYearMenu ? 'rotate-180 text-indigo-600' : ''}" />
												</button>

												{#if showYearMenu}
													<div class="absolute left-0 top-full mt-1.5 w-28 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-2xl shadow-2xl p-1.5 z-50 max-h-56 overflow-y-auto space-y-1 animate-in fade-in zoom-in-95 duration-150">
														{#each Array(12) as _, yIdx}
															{@const y = 2024 + yIdx}
															<button
																type="button"
																on:click={() => { calendarYear = y; showYearMenu = false; }}
																class="w-full px-3 py-1.5 rounded-xl text-left text-xs transition-all flex items-center justify-between {calendarYear === y ? 'bg-indigo-50/80 text-indigo-900 font-bold border border-indigo-100' : 'hover:bg-slate-50 font-medium text-slate-700'}"
															>
																<span>{y}</span>
																{#if calendarYear === y}
																	<Check class="w-3.5 h-3.5 text-indigo-600 shrink-0" />
																{/if}
															</button>
														{/each}
													</div>
												{/if}
											</div>

											<button
												type="button"
												on:click={nextMonth}
												class="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all border border-slate-200/80 shadow-2xs"
												title="Next Month"
											>
												<ChevronRight class="w-3.5 h-3.5" />
											</button>
										</div>

										<div class="flex items-center gap-1">
											<button
												type="button"
												on:click={setToday}
												class="px-2 py-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200/80 rounded-lg transition-colors"
											>
												Today
											</button>
											<button
												type="button"
												on:click={() => setTimeShortcut(1)}
												class="px-2 py-1 text-[11px] font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 rounded-lg transition-colors"
											>
												+1 Hr
											</button>
										</div>
									</div>

									<!-- Days Grid -->
									<div>
										<div class="grid grid-cols-7 gap-1 text-center mb-1">
											{#each dayNames as day}
												<span class="text-[10px] font-bold font-mono text-slate-400 uppercase py-1">{day}</span>
											{/each}
										</div>

										<div class="grid grid-cols-7 gap-1 text-center">
											{#each Array(getFirstDayOfWeek(calendarYear, calendarMonth)) as _}
												<div class="h-8"></div>
											{/each}

											{#each Array(getDaysInMonth(calendarYear, calendarMonth)) as _, i}
												{@const dayNum = i + 1}
												{@const isSelected = selectedDate.getFullYear() === calendarYear && selectedDate.getMonth() === calendarMonth && selectedDate.getDate() === dayNum}
												{@const isToday = new Date().getFullYear() === calendarYear && new Date().getMonth() === calendarMonth && new Date().getDate() === dayNum}
												<button
													type="button"
													on:click={() => {
														selectDay(dayNum);
													}}
													class="h-8 w-8 mx-auto rounded-xl text-xs font-semibold flex items-center justify-center relative transition-all duration-200 {isSelected ? 'bg-slate-900 text-white font-bold shadow-md shadow-slate-900/20 scale-105 border border-slate-800' : isToday ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-200 hover:bg-indigo-100' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'}"
												>
													<span>{dayNum}</span>
													{#if isToday && !isSelected}
														<span class="w-1.5 h-1.5 rounded-full bg-indigo-600 absolute bottom-1"></span>
													{/if}
												</button>
											{/each}
										</div>
									</div>

									<!-- Time Controls Bar & Done Button -->
									<div class="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 bg-slate-50/70 p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
										<div class="flex items-center gap-1.5">
											<Clock class="w-3.5 h-3.5 text-indigo-500 shrink-0" />

											<!-- Custom Hour Dropdown -->
											<div class="relative" use:clickOutside={() => (showHourMenu = false)}>
												<button
													type="button"
													on:click={() => { showHourMenu = !showHourMenu; showMinuteMenu = false; }}
													class="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg text-xs font-bold text-slate-800 shadow-2xs transition-all flex items-center gap-1 group"
												>
													<span>{String(selectedHour).padStart(2, "0")}</span>
													<ChevronDown class="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 {showHourMenu ? 'rotate-180 text-indigo-600' : ''}" />
												</button>
												{#if showHourMenu}
													<div class="absolute bottom-full mb-1.5 left-0 w-20 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-xl shadow-2xl p-1 z-50 max-h-48 overflow-y-auto space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
														{#each Array(12) as _, h}
															{@const val = h + 1}
															<button
																type="button"
																on:click={() => { selectedHour = val; showHourMenu = false; }}
																class="w-full px-2 py-1 rounded-lg text-left text-xs font-semibold transition-all flex items-center justify-between {selectedHour === val ? 'bg-indigo-50 text-indigo-900 font-bold' : 'hover:bg-slate-50 text-slate-700'}"
															>
																<span>{String(val).padStart(2, "0")}</span>
																{#if selectedHour === val}
																	<span class="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></span>
																{/if}
															</button>
														{/each}
													</div>
												{/if}
											</div>

											<span class="text-xs font-bold text-slate-400">:</span>

											<!-- Custom Minute Dropdown -->
											<div class="relative" use:clickOutside={() => (showMinuteMenu = false)}>
												<button
													type="button"
													on:click={() => { showMinuteMenu = !showMinuteMenu; showHourMenu = false; }}
													class="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200/90 rounded-lg text-xs font-bold text-slate-800 shadow-2xs transition-all flex items-center gap-1 group"
												>
													<span>{String(selectedMinute).padStart(2, "0")}</span>
													<ChevronDown class="w-3 h-3 text-slate-400 group-hover:text-indigo-600 transition-transform duration-200 {showMinuteMenu ? 'rotate-180 text-indigo-600' : ''}" />
												</button>
												{#if showMinuteMenu}
													<div class="absolute bottom-full mb-1.5 left-0 w-20 bg-white/95 backdrop-blur-2xl border border-slate-200/90 rounded-xl shadow-2xl p-1 z-50 max-h-48 overflow-y-auto space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
														{#each [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] as m}
															<button
																type="button"
																on:click={() => { selectedMinute = m; showMinuteMenu = false; }}
																class="w-full px-2 py-1 rounded-lg text-left text-xs font-semibold transition-all flex items-center justify-between {selectedMinute === m ? 'bg-indigo-50 text-indigo-900 font-bold' : 'hover:bg-slate-50 text-slate-700'}"
															>
																<span>{String(m).padStart(2, "0")}</span>
																{#if selectedMinute === m}
																	<span class="w-1.5 h-1.5 rounded-full bg-indigo-600 shrink-0"></span>
																{/if}
															</button>
														{/each}
													</div>
												{/if}
											</div>

											<!-- AM/PM Toggle -->
											<button
												type="button"
												on:click={() => (selectedAmPm = selectedAmPm === "AM" ? "PM" : "AM")}
												class="px-2 py-1 text-xs font-bold rounded-lg border transition-all active:scale-95 {selectedAmPm === 'PM' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-200'}"
											>
												{selectedAmPm}
											</button>
										</div>

										<button
											type="button"
											on:click={() => (showDatePickerPopover = false)}
											class="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-2xs transition-colors"
										>
											Done
										</button>
									</div>
								</div>
							{/if}
						</div>

						<!-- Notifications & File Attachment Grid -->
						<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<div>
								<label for="schedule-notify-input" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono">
									Notification Email (Optional)
								</label>
								<input
									id="schedule-notify-input"
									type="email"
									bind:value={notifyEmail}
									placeholder="your.email@company.com"
									class="w-full px-4 py-3 bg-slate-50/70 focus:bg-white rounded-xl border border-slate-200/80 text-sm font-semibold text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/12 focus:border-indigo-500 transition-all shadow-inner/5"
								/>
							</div>

							<div>
								<label for="schedule-excel-file" class="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2 font-mono">
									Recipient List File (.xlsx / .csv)
								</label>
								<input
									id="schedule-excel-file"
									type="file"
									accept=".xlsx, .xls, .csv"
									on:change={handleScheduleFileChange}
									class="w-full text-xs text-slate-500 file:mr-3 file:py-2.5 file:px-3.5 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition-all cursor-pointer"
								/>
							</div>
						</div>
					</div>
				{/if}
			</div>

			<!-- Modal Footer -->
			<div class="flex items-center justify-end gap-3 pt-5 border-t border-slate-100 shrink-0">
				<button
					type="button"
					on:click={() => (showScheduleModal = false)}
					class="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-2xs"
				>
					Cancel
				</button>
				<button
					type="button"
					on:click={handleCreateSchedule}
					disabled={submittingSchedule}
					class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-6 py-2.5 rounded-xl text-sm shadow-md shadow-indigo-500/20 active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
				>
					{#if submittingSchedule}
						<RefreshCw class="w-4 h-4 animate-spin text-white" />
						<span>Scheduling...</span>
					{:else}
						<Send class="w-4 h-4 text-white" />
						<span>Submit Schedule</span>
					{/if}
				</button>
			</div>
		</div>
	</div>
{/if}
