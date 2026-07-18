import { apiClient } from './client';

export const dashboardApi = {
	getPollStatus: () => 
		apiClient.get('/dashboard/poll-status'),
	getDashboardData: () => 
		apiClient.get('/dashboard/data')
};
