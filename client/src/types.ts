
export type Timestamp = string // ISO string
export type Decimal = number

export interface User {
  user_id: number
  first_name: string
  last_name: string
  email: string
  password: string
  phone?: string
  status?: string
  created_at?: Timestamp
  updated_at?: Timestamp
}

export interface Role {
  role_id: number
  role_name: string
}

export interface UserRole {
  user_id: number
  role_id: number
}

export interface Station {
  stations_id: number
  stations_name: string
  image?: string
  wallpaper?: string
  descriptions?: string
  location?: string
  created_at?: Timestamp
  updated_at?: Timestamp
}

export interface BusCompany {
  bus_companies_id: number
  company_name: string
  image?: string
  descriptions?: string
  created_at?: Timestamp
  updated_at?: Timestamp
}

export interface Bus {
  bus_id: number
  company_id: number
  name?: string
  descriptions?: string
  license_plate?: string
  capacity?: number
  created_at?: Timestamp
  updated_at?: Timestamp
}

export interface BusStation {
  station_id: number
  bus_id: number
}

export interface BusImage {
  bus_image_id: number
  image_url?: string
  bus_id: number
}

export interface Route {
  routes_id: number
  departure_station_id: number
  arrival_station_id: number
  price?: Decimal
  duration?: number // minutes
  distance?: number // km
  created_at?: Timestamp
  updated_at?: Timestamp
}

export type ScheduleStatus = 'AVAILABLE' | 'FULL' | 'CANCELLED' | string

export interface Schedule {
  schedule_id: number
  route_id: number
  bus_id: number
  departure_time?: Timestamp
  arrival_time?: Timestamp
  available_seat?: number
  total_seats?: number
  status?: ScheduleStatus
  created_at?: Timestamp
  updated_at?: Timestamp
}

export type SeatType = 'LUXURY' | 'VIP' | 'STANDARD' | string

export interface Seat {
  seat_id: number
  bus_id: number
  seat_number?: string
  seat_type?: SeatType
  status?: string
  price_for_seat_type?: Decimal
  created_at?: Timestamp
  updated_at?: Timestamp
}

export interface BusReview {
  review_id: number
  user_id: number
  bus_id: number
  rating?: number
  review?: string
  created_at?: Timestamp
  updated_at?: Timestamp
}

export type TicketStatus = 'BOOKED' | 'CANCELLED' | string

export interface Ticket {
  ticket_id: number
  schedule_id: number
  seat_id: number
  departure_time?: Timestamp
  arrival_time?: Timestamp
  seat_type?: string
  price?: Decimal
  status?: TicketStatus
  created_at?: Timestamp
  updated_at?: Timestamp
}

export type PaymentProviderType = 'CARD' | 'E-WALLET' | 'BANK_TRANSFER' | 'QR_CODE' | string

export interface PaymentProvider {
  payment_provider_id: number
  provider_name?: string
  provider_type?: PaymentProviderType
  api_endpoint?: string
  created_at?: Timestamp
  updated_at?: Timestamp
}

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | string
export type PaymentMethod = 'CASH' | 'ONLINE' | string

export interface Payment {
  payment_id: number
  payment_provider_id: number
  user_id: number
  ticket_id: number
  payment_method?: PaymentMethod
  amount?: Decimal
  status?: PaymentStatus
  created_at?: Timestamp
  updated_at?: Timestamp
}

export interface Banner {
  banner_id: number
  banner_url?: string
  position?: string
}

export interface CancellationPolicy {
  cancellation_policies_id: number
  descriptions?: string
  route_id: number
  cancellation_time_limit?: number // minutes
  refunc_percentage?: number // percent
  created_at?: Timestamp
  updated_at?: Timestamp
}
