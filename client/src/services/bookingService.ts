import api from '../api/api';

export interface SeatSchedule {
  id: string;
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
      const response = await api.get<SeatSchedule[]>(`/seat_schedules?schedule_id=${scheduleId}`);
      const schedules = response as unknown as SeatSchedule[];
      
      // Filter out expired holds
      const now = new Date();
      return schedules.filter(s => {
         if (s.status === 'HOLD' && s.hold_expired_at) {
             const expiredAt = new Date(s.hold_expired_at);
             return expiredAt > now; // Only keep if not expired
         }
         return true; // Keep BOOKED and others
      });
    } catch (error) {
      console.error('Error fetching seat schedule:', error);
      return [];
    }
  },

  holdSeats: async (scheduleId: string, seatIds: string[], holderId?: string): Promise<boolean> => {
    try {
      const now = new Date();
      const expiredAt = new Date(now.getTime() + 15 * 60000).toISOString(); // 15 minutes

      // We need to check if these seats are already booked
      const currentSchedule = await bookingService.getSeatSchedule(scheduleId);
      
      // Filter for conflicts
      const conflicts = currentSchedule.filter(s => 
        seatIds.includes(String(s.seat_id)) && 
        (s.status === 'BOOKED' || (s.status === 'HOLD' && new Date(s.hold_expired_at || '') > now && s.user_id !== holderId))
      );

      if (conflicts.length > 0) {
        return false; // Some seats are not available
      }
      
      // Create hold entries
      for (const seatId of seatIds) {
          await api.post('/seat_schedules', {
            id: `${Date.now()}_${seatId}_HOLD`,
            schedule_id: scheduleId,
            seat_id: seatId,
            status: 'HOLD',
            hold_expired_at: expiredAt,
            user_id: holderId 
          });
      }
      return true;
    } catch (error) {
       console.error('Error holding seats:', error);
       return false;
    }
  },

  createBooking: async (bookingData: Booking, selectedSeats: string[] = []): Promise<Booking | null> => {
    try {
      const now = new Date().toISOString();
      const scheduleId = bookingData.tripInfo.id;
      const pricePerSeat = selectedSeats.length > 0 ? bookingData.totalPrice / selectedSeats.length : 0;
      
      const ticketsCreated: string[] = [];

      // Loop through each seat to create individual tickets
      for (const seatId of selectedSeats) {
        const ticketId = `${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
        ticketsCreated.push(ticketId);

        // 1. Create Ticket
        const ticket: Ticket = {
          id: ticketId,
          user_id: bookingData.userId,
          schedule_id: scheduleId,
          seat_id: seatId,
          code: `TICKET_${ticketId.slice(-6).toUpperCase()}`,
          status: bookingData.status === 'CONFIRMED' ? 'BOOKED' : 'PENDING',
          price: pricePerSeat,
          created_at: bookingData.createdAt,
          updated_at: now,
        };
        await api.post('/tickets', ticket);

        // 2. Create Passenger
        const passenger: Passenger = {
          id: `${Date.now()}_P_${Math.random().toString(36).substr(2, 5)}`,
          ticket_id: ticketId,
          full_name: bookingData.contactInfo.fullName,
          phone: bookingData.contactInfo.phone,
          email: bookingData.contactInfo.email,
        };
        await api.post('/passengers', passenger);

        // 3. Create Seat Schedule (for availability check)
        // Since we might have a HOLD, we should technically update it or just ignore it implies a new valid status
        // For simple json-server usage, we just append the BOOKED status. 
        // Our getSeatSchedule filters, so BOOKED should take precedence or we rely on 'latest'.
        // However, getSeatSchedule currently returns ALL. 
        // Let's rely on the fact that we are adding a "BOOKED" status which is permanent.
        
        await api.post('/seat_schedules', {
          id: `${Date.now()}_${seatId}_S`,
          schedule_id: scheduleId,
          seat_id: seatId,
          ticket_id: ticketId,
          status: 'BOOKED',
          price: pricePerSeat
        });
      }

      // 4. Create Payment (Linked to the first ticket for reference, or separate handling)
      if (ticketsCreated.length > 0) {
        const payment: Payment = {
          id: `PAY_${Date.now()}`,
          ticket_id: ticketsCreated[0], // Link to first ticket
          amount: bookingData.totalPrice,
          method: bookingData.paymentMethod,
          status: 'COMPLETED',
          transaction_date: now
        };
        await api.post('/payments', payment);
      }

      // 4. Update Available Seats in Schedule
      try {
        const scheduleResponse = await api.get<Schedule>(`/schedules/${scheduleId}`) as unknown as Schedule;
        if (scheduleResponse) {
          const currentAvailable = scheduleResponse.available_seats || 0;
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
