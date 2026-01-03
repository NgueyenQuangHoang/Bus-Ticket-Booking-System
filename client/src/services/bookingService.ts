import api from '../api/api';

export interface SeatSchedule {
  id: string;
  seat_id: string | number;
  schedule_id: string | number;
  ticket_id?: string;
  status: 'BOOKED' | 'HOLD' | 'AVAILABLE';
  hold_expired_at?: string | null;
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
}

// New interfaces for DB Schema
export interface Ticket {
  id: string;
  user_id: string; // potentially mapped from logged in user or guest
  schedule_id: string;
  code: string;
  status: 'BOOKED' | 'COMPLETED' | 'CANCELLED' | 'PENDING';
  total_price: number;
  created_at: string;
  updated_at: string;
  contact_info: ContactInfo;
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
      const response = await api.get<SeatSchedule[]>(`/seat_schedules?schedule_id=${scheduleId}`);
      return response as unknown as SeatSchedule[];
    } catch (error) {
      console.error('Error fetching seat schedule:', error);
      return [];
    }
  },

  createBooking: async (bookingData: Booking, selectedSeats: string[] = []): Promise<Booking | null> => {
    try {
      const ticketId = bookingData.id || `${Date.now()}`;
      const scheduleId = bookingData.tripInfo.id;
      const now = new Date().toISOString();

      // 1. Create Ticket
      const ticket: Ticket = {
        id: ticketId,
        user_id: "guest", // or fetch from auth context if possible, but strict types here might need adjustment later
        schedule_id: scheduleId,
        code: `TICKET_${ticketId.slice(-6)}`,
        status: bookingData.status === 'CONFIRMED' ? 'BOOKED' : 'PENDING',
        total_price: bookingData.totalPrice,
        created_at: bookingData.createdAt,
        updated_at: now,
        contact_info: bookingData.contactInfo
      };
      
      await api.post('/tickets', ticket);

      // 2. Create Seat Schedules
      // Note: Assuming price per seat is total / seats count, or just 0 if not tracked per seat here
      const pricePerSeat = selectedSeats.length > 0 ? bookingData.totalPrice / selectedSeats.length : 0;
      
      const seatPromises = selectedSeats.map(seatId => {
        return api.post('/seat_schedules', {
          id: `${Date.now()}_${seatId}`,
          schedule_id: scheduleId,
          seat_id: seatId,
          ticket_id: ticketId,
          status: 'BOOKED',
          price: pricePerSeat
        });
      });
      await Promise.all(seatPromises);

      // 3. Create Payment
      const payment: Payment = {
        id: `PAY_${Date.now()}`,
        ticket_id: ticketId,
        amount: bookingData.totalPrice,
        method: bookingData.paymentMethod,
        status: 'COMPLETED', // logic says if we are here it's likely confirmed
        transaction_date: now
      };
      await api.post('/payments', payment);

      // 4. Update Available Seats in Schedule
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
      }

      return bookingData;
    } catch (error) {
      console.error('Error creating booking:', error);
      return null;
    }
  }
};

export default bookingService;
