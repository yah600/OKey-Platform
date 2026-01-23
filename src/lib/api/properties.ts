import { apiClient } from './base';
import { Property } from '@/types';

/**
 * Property API endpoints
 * Currently returns mock data, ready for backend integration
 */
export const propertiesApi = {
  getAll: async (): Promise<Property[]> => {
    // return await apiClient.get<Property[]>('/properties');
    // Mock implementation
    return [];
  },

  getById: async (id: string): Promise<Property> => {
    // return await apiClient.get<Property>(`/properties/${id}`);
    throw new Error('Not implemented - using local store');
  },

  create: async (data: Partial<Property>): Promise<Property> => {
    // return await apiClient.post<Property>('/properties', data);
    throw new Error('Not implemented - using local store');
  },

  update: async (id: string, data: Partial<Property>): Promise<Property> => {
    // return await apiClient.put<Property>(`/properties/${id}`, data);
    throw new Error('Not implemented - using local store');
  },

  delete: async (id: string): Promise<void> => {
    // return await apiClient.delete(`/properties/${id}`);
    throw new Error('Not implemented - using local store');
  },
};
