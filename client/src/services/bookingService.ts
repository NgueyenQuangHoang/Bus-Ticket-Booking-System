import api from '../api/api';

export interface SeatSchedule {
  id: string;
  seat_id: string | number;
  schedule_id: string | number;
  status: 'BOOKED' | 'HOLD' | 'AVAILABLE';
  hold_expired_at?: string | null;
}

export interface ContactInfo {
  fullName: string;
  phone: string;
  email: string;
  countryCode: string;
}

export interface TripInfo {
  id: string;
  type: "departure" | "return" | "single";
  dateStr: string;
  operator: {
    name: string;
    image: string;
    vehicleType: string;
    passengerCount: number;
    seatIds: string;
  };
  departure: {
    time: string;
    date: string;
    name: string;
    address: string;
  };
  arrival: {
    time: string;
    date: string;
    name: string;
    address: string;
  };
  policy: {
    text: string;
    colorClass: string;
  };
  totalPrice: number;
  ticketCode?: string;
  priceDisplay?: string;
  route?: string;
  price?: string;
}

export interface Booking {
  id?: string;
  tripInfo: TripInfo;
  contactInfo: ContactInfo;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  paymentMethod: 'QR_PAYMENT' | 'CASH';
}

const bookingService = {
  getSeatSchedule: async (scheduleId: string | number): Promise<SeatSchedule[]> => {
    try {
      const response = await api.get<SeatSchedule[]>(`/seat_schedule?schedule_id=${scheduleId}`);
      return response as unknown as SeatSchedule[];
    } catch (error) {
      console.error('Error fetching seat schedule:', error);
      return [];
    }
  },

  createBooking: async (bookingData: Booking, selectedSeats: string[] = []): Promise<Booking | null> => {
    try {
      // 1. Create Booking
      const response = await api.post<Booking>('/bookings', bookingData);

      // 2. Lock Seats in seat_schedule
      const scheduleId = bookingData.tripInfo.id;
      const seatPromises = selectedSeats.map(seatId => {
        return api.post('/seat_schedule', {
          id: `${Date.now()}_${seatId}`, // Simple unique ID
          seat_id: seatId,
          schedule_id: scheduleId,
          status: 'BOOKED',
          hold_expired_at: null
        });
      });
      await Promise.all(seatPromises);

      // 3. Update Available Seats in Schedule
      // Fetch current schedule first to be safe, or just atomic update if supported (json-server doesn't support atomic)
      try {
        const scheduleResponse: any = await api.get(`/schedules/${scheduleId}`);
        if (scheduleResponse) {
          const currentAvailable = parseInt(scheduleResponse.available_seats) || 0;
          const newAvailable = Math.max(0, currentAvailable - selectedSeats.length);

          await api.patch(`/schedules/${scheduleId}`, {
            available_seats: newAvailable
          });
        }
      } catch (scheduleError) {
        console.error('Error updating schedule availability:', scheduleError);
        // Don't fail the whole booking if this fails, but log it
      }

      return response as unknown as Booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  }
};

export default bookingService;
