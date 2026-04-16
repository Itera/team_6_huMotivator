// API service for backend communication
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000/api';

export const motivate = (task: string, settings: any) =>
  axios.post(`${API_BASE}/motivate`, { task, settings });

export const getSettings = () =>
  axios.get(`${API_BASE}/settings`);

export const updateSettings = (settings: any) =>
  axios.post(`${API_BASE}/settings`, settings);
