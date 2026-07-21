export interface Contact {
	id: string;
	name: string;
	email: string;
	company: string;
	createdAt?: string;
}

export interface Template {
	id: string;
	name: string;
	subject: string;
	body: string;
	createdAt?: string;
}

export interface ScheduledJob {
	id: string;
	subject: string;
	scheduledTime?: string;
	scheduled_time?: string;
	totalContacts?: number;
	contact_count?: number;
	notifyEmail?: string;
	notify_email?: string;
	status?: string;
	createdAt?: string;
}

export interface ReportLog {
	id: string;
	email: string;
	subject?: string;
	status: string;
	message?: string;
	level?: string;
	timestamp?: string;
	messageId?: string;
}

export interface BatchStatus {
	isRunning: boolean;
	isPaused: boolean;
	total: number;
	sent: number;
	failed: number;
	elapsedSeconds: number;
	remainingSeconds?: number;
	emailDelay: number;
	batchSize: number;
	batchDelay: number;
	currentBatchCount?: number;
}
