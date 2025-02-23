// src/api/dashboardApi.js
import axios from 'axios';
import mockData from '../data/mockData'; // adjust the path as needed

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
});

export const getDashboardData = async () => {
  try {
    const response = await api.get('/dashboard');

    // If response data is empty or not returned, use mock data
    if (!response.data || Object.keys(response.data).length === 0) {
      console.warn('No data returned from POST request, using mock data.');
      return mockData;
    }

    return response.data;
  } catch (error) {
    console.error('Error posting dashboard data, using mock data:', error);
    return mockData;
  }
};

export const submitFinancialData = async (data) => {
  try {
    const response = await fetch('http://127.0.0.1:3000/initialData', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    console.log(data);
    return response.data;
  } catch (error) {
    console.error('Error submitting financial data:', error);
    // For development, return success even if the API call fails
    return { success: true };
  }
};
