import { apiClient } from './client';

export const sendApi = {
	sendCampaign: (formData: FormData) => 
		apiClient.post('/send', formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		}),
	parseExcel: (file: File) => {
		const formData = new FormData();
		formData.append('excelFile', file);
		return apiClient.post('/parse-excel', formData, {
			headers: { 'Content-Type': 'multipart/form-data' }
		});
	},
	getScheduledJobs: () => 
		apiClient.get('/scheduled-jobs'),
	deleteScheduledJob: (id: string) => 
		apiClient.delete(`/scheduled-jobs/${id}`),
	getBatchStatus: () => 
		apiClient.get('/batch-status'),
	pauseBatch: () => 
		apiClient.post('/batch-pause'),
	resumeBatch: () => 
		apiClient.post('/batch-resume'),
	cancelBatch: () => 
		apiClient.delete('/batch-cancel'),
	testNotification: (testEmail: string) => 
		apiClient.post('/test-notification', { testEmail })
};
