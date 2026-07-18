import axios from 'axios';

export const apiClient = axios.create({
	baseURL: '', // Blank baseURL resolves relative paths proxied by Vite dev server
	withCredentials: true, // Includes session cookies automatically
	headers: {
		'Content-Type': 'application/json'
	}
});
