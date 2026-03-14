import api from "../api/api";

export interface VehicleType {
    id: string;
    code: string;
    display_name: string;
    description: string;
}

export const vehicleTypeService = {
    getAllVehicleTypes: async (): Promise<VehicleType[] | undefined> => {
        try {
            const response: VehicleType[] = await api.get('/vehicle-types');
            return response ? response : undefined;
        } catch (error) {
            console.error('Error fetching vehicle types:', error);
            throw error;
        }
    },

    createVehicleType: async (data: Omit<VehicleType, 'id'> & { id?: string }): Promise<VehicleType> => {
        try {
            const response = await api.post('/vehicle-types', data);
            return response as unknown as VehicleType;
        } catch (error) {
            console.error('Error creating vehicle type:', error);
            throw error;
        }
    },

    updateVehicleType: async (id: string, data: Partial<VehicleType>): Promise<VehicleType> => {
        try {
            const response = await api.patch(`/vehicle-types/${id}`, data);
            return response as unknown as VehicleType;
        } catch (error) {
            console.error('Error updating vehicle type:', error);
            throw error;
        }
    },

    deleteVehicleType: async (id: string): Promise<void> => {
        try {
            await api.delete(`/vehicle-types/${id}`);
        } catch (error) {
            console.error('Error deleting vehicle type:', error);
            throw error;
        }
    }
}
