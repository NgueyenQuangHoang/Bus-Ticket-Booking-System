import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Updated to match api.ts configuration

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
    is_verified?: boolean;
}

export const reviewService = {
    getReviewsByBusId: async (busId: string, page: number = 1, limit: number = 5, rating?: number | null) => {
        try {
            let url = `${API_URL}/bus_reviews?bus_id=${busId}&_expand=user&_sort=created_at&_order=desc`;

            if (page && limit) {
                url += `&_page=${page}&_limit=${limit}`;
            }

            if (rating) {
                url += `&rating=${rating}`;
            }

            const response = await axios.get(url);

            // json-server returns total count in headers when using pagination
            const totalHeader = response.headers['x-total-count'] || response.headers['X-Total-Count'];
            const totalCount = parseInt(totalHeader || '0', 10);

            const reviews = response.data as Review[];
            const reviewsWithUser = await Promise.all(reviews.map(async (review) => {
                if (!review.user && review.user_id) {
                    try {
                        const userRes = await axios.get(`${API_URL}/users/${review.user_id}`);
                        review.user = userRes.data;
                    } catch (e) {
                        console.warn(`Could not fetch user ${review.user_id} for review ${review.id}`);
                    }
                }
                return review;
            }));

            return {
                data: reviewsWithUser,
                total: totalCount
            };
        } catch (error) {
            console.error('Error fetching reviews:', error);
            throw error;
        }
    },

    // Helper to calculate average rating (optional, if not provided by backend)
    getAllReviewsForStats: async (busId: string) => {
        try {
            const response = await axios.get(`${API_URL}/bus_reviews?bus_id=${busId}`);
            return response.data as Review[];
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
            const response = await axios.post(`${API_URL}/bus_reviews`, newReview);
            return response.data as Review;
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
            const response = await axios.patch(`${API_URL}/bus_reviews/${id}`, updatedReview);
            return response.data as Review;
        } catch (error) {
            console.error('Error updating review:', error);
            throw error;
        }
    },

    deleteReview: async (id: string) => {
        try {
            await axios.delete(`${API_URL}/bus_reviews/${id}`);
        } catch (error) {
            console.error('Error deleting review:', error);
            throw error;
        }
    },
    // Admin: Get all reviews
    getAllReviews: async (page: number = 1, limit: number = 10, search: string = "") => {
        try {
            let url = `${API_URL}/bus_reviews?_expand=user&_sort=created_at&_order=desc`;

            if (page && limit) {
                url += `&_page=${page}&_limit=${limit}`;
            }

            if (search) {
                url += `&q=${search}`;
            }

            const response = await axios.get(url);
            const totalHeader = response.headers['x-total-count'] || response.headers['X-Total-Count'];
            let totalCount = parseInt(totalHeader || '0', 10);

            const reviews = response.data as Review[];

            // Fallback if header is missing but data exists (common in some CORS setups or json-server versions)
            if (totalCount === 0 && reviews.length > 0) {
                if (page === 1 && reviews.length < limit) {
                    totalCount = reviews.length;
                } else {
                    // Best effort guess if we assume it's at least the current page amount
                    // If we are on page 1 and length == limit, likely at least limit.
                    totalCount = reviews.length;
                }
            }

            // Enrich with User and Bus info
            const enrichedReviews = await Promise.all(reviews.map(async (review) => {
                // Fetch User if missing
                if (!review.user && review.user_id) {
                    try {
                        const userRes = await axios.get(`${API_URL}/users/${review.user_id}`);
                        review.user = userRes.data;
                    } catch (e) {
                        // console.warn(`Could not fetch user ${review.user_id}`);
                    }
                }

                // Fetch Bus Info
                if (review.bus_id) {
                    try {
                        const busRes = await axios.get(`${API_URL}/buses/${review.bus_id}`);
                        review.bus = busRes.data;
                    } catch (e) {
                        // console.warn(`Could not fetch bus ${review.bus_id}`);
                    }
                }

                return review;
            }));

            return {
                data: enrichedReviews,
                total: totalCount
            };
        } catch (error) {
            console.error('Error fetching all reviews:', error);
            throw error;
        }
    },
}
