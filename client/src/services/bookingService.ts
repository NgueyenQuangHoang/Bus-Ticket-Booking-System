import api from '../api/api';

export interface SeatSchedule {
  id: string;
  ticketCodes?: string[];
  seat_id: string | number;
  schedule_id: string | number;
  ticket_id?: string;
  status: 'BOOKED' | 'HOLD' | 'AVAILABLE';
  hold_expired_at?: string | null;
  user_id?: string;
  price?: number;
}

export interface ContactInfo {
  fullName: string;
  phone: string;
  email: string;
  countryCode: string;
}

export interface TripInfo {
  id: string; // schedule_id
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

// Keeping Booking interface as DTO for createBooking
export interface Booking {
  id?: string;
  tripInfo: TripInfo;
  contactInfo: ContactInfo;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  createdAt: string;
  paymentMethod: 'QR_PAYMENT' | 'CASH';
  userId?: string;
}

export interface Schedule {
  id: string;
  route_id: string;
  bus_id: string;
  departure_time: string;
  arrival_time: string;
  total_seats: number;
  available_seats: number;
  status: string;
  created_at: string;
  updated_at: string;
}

// New interfaces for DB Schema
export interface Ticket {
  id: string;
  user_id?: string;
  schedule_id: string;
  code: string;
  status: 'BOOKED' | 'COMPLETED' | 'CANCELLED' | 'PENDING';
  price: number;
  seat_id: string;
  created_at: string;
  updated_at: string;
}

export interface Passenger {
  id: string;
  ticket_id: string;
  full_name: string;
  phone: string;
  email: string;
  identity_number?: string;
}

export interface Payment {
  id: string;
  ticket_id: string;
  amount: number;
  method: 'QR_PAYMENT' | 'CASH';
  status: 'COMPLETED' | 'PENDING' | 'FAILED';
  transaction_date: string;
}

const bookingService = {
  getSeatSchedule: async (scheduleId: string | number): Promise<SeatSchedule[]> => {
    try {
      const response = await api.get<SeatSchedule[]>(`/seat-schedules/schedule/${scheduleId}`);
      const schedules = response as unknown as SeatSchedule[];

      // Filter out expired holds client-side as extra safety
      const now = new Date();
      return Array.isArray(schedules) ? schedules.filter(s => {
        if (s.status === 'HOLD' && s.hold_expired_at) {
          const expiredAt = new Date(s.hold_expired_at);
          return expiredAt > now;
        }
        return true;
      }) : [];
    } catch (error) {
      console.error('Error fetching seat schedule:', error);
      return [];
    }
  },

  holdSeats: async (scheduleId: string, seatIds: string[], holderId?: string): Promise<boolean> => {
    try {
      const response: any = await api.post('/bookings/hold-seats', {
        schedule_id: scheduleId,
        seat_ids: seatIds,
        user_id: holderId
      });

      // Backend returns success/failure
      return response !== null && response !== undefined;
    } catch (error) {
      console.error('Error holding seats:', error);
      return false;
    }
  },

  createBooking: async (
    bookingData: Booking,
    selectedSeats: string[] = [],
    seatPriceMap: Record<string, number> = {}
  ): Promise<(Booking & { ticketCodes: string[] }) | null> => {
    try {
      // Backend handles the entire transaction: tickets, passengers, seat_schedules, payments
      const response: any = await api.post('/bookings/create', {
        schedule_id: bookingData.tripInfo.id,
        seat_ids: selectedSeats,
        seat_price_map: seatPriceMap,
        contact_info: {
          full_name: bookingData.contactInfo.fullName,
          phone: bookingData.contactInfo.phone,
          email: bookingData.contactInfo.email
        },
        total_price: bookingData.totalPrice,
        payment_method: bookingData.paymentMethod,
        user_id: bookingData.userId,
        status: bookingData.status === 'CONFIRMED' ? 'BOOKED' : 'PENDING'
      });

      if (response && response.ticketCodes) {
        return { ...bookingData, ticketCodes: response.ticketCodes };
      }

      // Fallback: if backend returns ticket_codes in a different format
      if (response && response.ticket_codes) {
        return { ...bookingData, ticketCodes: response.ticket_codes };
      }

      return { ...bookingData, ticketCodes: [] };
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  }
};

export default bookingService;
