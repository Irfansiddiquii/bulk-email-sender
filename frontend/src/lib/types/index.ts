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

export interface BatchJob {
	id: string;
	totalContacts: number;
	currentBatch: number;
	totalBatches: number;
	emailsSent: number;
	emailsFailed: number;
	status: string;
	startTime: string;
	config?: any;
	emailJob?: any;
	delay?: number;
	userId?: string;
}

export interface BatchStatus {
	isRunning: boolean;
	currentJob: BatchJob | null;
	totalJobs?: number;
	completedJobs?: number;
}
