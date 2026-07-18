import { apiClient } from './client';

export const configApi = {
	getSMTPConfigs: () => 
		apiClient.get('/config/smtp'),
	saveSMTPConfig: (config: any) => 
		apiClient.post('/config/smtp', config),
	updateSMTPConfig: (id: string, config: any) => 
		apiClient.put(`/config/smtp/${id}`, config),
	deleteSMTPConfig: (id: string) => 
		apiClient.delete(`/config/smtp/${id}`),
	setDefaultSMTPConfig: (id: string) => 
		apiClient.post(`/config/smtp/${id}/default`),
	testSMTPConfig: (config: any) => 
		apiClient.post('/config/smtp/test', config)
};
