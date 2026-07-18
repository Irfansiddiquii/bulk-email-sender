import { apiClient } from './client';

export const reportApi = {
	getReports: () => 
		apiClient.get('/report'),
	clearLogs: () => 
		apiClient.delete('/report/clear'),
	getCSVExportURL: () => '/report/export/csv',
	getJSONExportURL: () => '/report/export/json'
};
