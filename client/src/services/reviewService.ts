import api from '../api/api';

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar?: string;
}

export interface Review {
    id: string;
    user_id: string;
    bus_id: string;
    bus_company_id?: string; // Add company ID for company-level aggregation
    ticket_id?: string;
    booking_id?: string;
    rating: number;
    review: string;
    status: string;
    created_at: string;
    updated_at: string;
    user?: User; // Expanded user data
    bus?: {
        id: string;
        name: string;
        bus_number?: string;
    };
    ticket?: {
        id: string;
        code: string;
    };
    is_verified?: boolean;
}

export const reviewService = {
    getReviewsByCompanyId: async (companyId: string, page: number = 1, limit: number = 5, rating?: number | null) => {
        try {
            let url = `/reviews?bus_company_id=${companyId}&page=${page}&limit=${limit}`;

            if (rating) {
                url += `&rating=${rating}`;
            }

            const response: any = await api.get(url);

            // api interceptor returns { data, total } for paginated responses
            const reviews = response.data || response;
            const totalCount = response.total || (Array.isArray(reviews) ? reviews.length : 0);

            return {
                data: Array.isArray(reviews) ? reviews as Review[] : [],
                total: totalCount
            };
        } catch (error) {
            console.error('Error fetching reviews by company:', error);
            throw error;
        }
    },

    getReviewsByBusId: async (busId: string, page: number = 1, limit: number = 5, rating?: number | null) => {
        try {
            let url = `/reviews?bus_id=${busId}&page=${page}&limit=${limit}`;

            if (rating) {
                url += `&rating=${rating}`;
            }

            const response: any = await api.get(url);

            const reviews = response.data || response;
            const totalCount = response.total || (Array.isArray(reviews) ? reviews.length : 0);

            return {
                data: Array.isArray(reviews) ? reviews as Review[] : [],
                total: totalCount
            };
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    },

    // Helper to fetch all reviews for stats (Company level)
    getAllReviewsForCompanyStats: async (companyId: string) => {
        try {
            const response: any = await api.get(`/reviews?bus_company_id=${companyId}&limit=1000`);
            const reviews = response.data || response;
            return Array.isArray(reviews) ? reviews as Review[] : [];
        } catch (error) {
            console.error('Error fetching all reviews for company stats:', error);
            throw error;
        }
    },

    // Helper to calculate average rating (optional, if not provided by backend)
    // Legacy: by Bus ID
    getAllReviewsForStats: async (busId: string) => {
        try {
            const response: any = await api.get(`/reviews?bus_id=${busId}&limit=1000`);
            const reviews = response.data || response;
            return Array.isArray(reviews) ? reviews as Review[] : [];
        } catch (error) {
            console.error('Error fetching all reviews for stats:', error);
            throw error;
        }
    },

    createReview: async (review: Omit<Review, 'id' | 'updated_at' | 'status'>) => {
        try {
            const newReview = {
                ...review,
                status: "VISIBLE",
                updated_at: new Date().toISOString()
            };
            const response: Review = await api.post('/reviews', newReview);
            return response;
        } catch (error) {
            console.error('Error creating review:', error);
            throw error;
        }
    },

    updateReview: async (id: string, review: Partial<Review>) => {
        try {
            const updatedReview = {
                ...review,
                updated_at: new Date().toISOString()
            };
            const response: Review = await api.patch(`/reviews/${id}`, updatedReview);
            return response;
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    },

    deleteReview: async (id: string) => {
        try {
            await api.delete(`/reviews/${id}`);
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    },
    // Admin: Get all reviews
    getAllReviews: async (page: number = 1, limit: number = 10, search: string = "", busIds: string[] = []) => {
        try {
            let url = `/reviews/all?page=${page}&limit=${limit}`;

            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }

            if (busIds && busIds.length > 0) {
                url += `&busIds=${busIds.join(',')}`;
            }

            const response: any = await api.get(url);

            const reviews = response.data || response;
            const totalCount = response.total || (Array.isArray(reviews) ? reviews.length : 0);

            return {
                data: Array.isArray(reviews) ? reviews as Review[] : [],
                total: totalCount
            };
        } catch (error) {
            console.error('Error fetching all reviews:', error);
            throw error;
        }
    },
}
