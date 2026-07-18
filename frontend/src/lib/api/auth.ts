import { apiClient } from './client';

export const authApi = {
	login: (email: string, pass: string) => 
		apiClient.post('/auth/login', { email, password: pass }),
	register: (name: string, email: string, pass: string) => 
		apiClient.post('/auth/register', { name, email, password: pass }),
	logout: () => 
		apiClient.post('/auth/logout'),
	getUserInfo: () => 
		apiClient.get('/user/info')
};
