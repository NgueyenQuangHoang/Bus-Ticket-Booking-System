CREATE DATABASE IF NOT EXISTS car_booking CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE car_booking;

-- 1. roles
CREATE TABLE roles (
  id VARCHAR(36) PRIMARY KEY,
  role_name VARCHAR(50) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 2. users
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  bus_company_id VARCHAR(36),
  status ENUM('ACTIVE','INACTIVE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 3. user_role
CREATE TABLE user_role (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  role_id VARCHAR(36) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- 4. cities
CREATE TABLE cities (
  id VARCHAR(36) PRIMARY KEY,
  city_name VARCHAR(255) NOT NULL,
  image_city TEXT,
  region VARCHAR(100),
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 5. stations
CREATE TABLE stations (
  id VARCHAR(36) PRIMARY KEY,
  station_name VARCHAR(255) NOT NULL,
  city_id VARCHAR(36) NOT NULL,
  image TEXT,
  wallpaper TEXT,
  description TEXT,
  location VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE
);

-- 6. bus_companies
CREATE TABLE bus_companies (
  id VARCHAR(36) PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  image TEXT,
  license_number VARCHAR(100),
  contact_phone VARCHAR(20),
  contact_email VARCHAR(255),
  address TEXT,
  description TEXT,
  rating_avg DECIMAL(3,2) DEFAULT 0,
  rating_count INT DEFAULT 0,
  status ENUM('ACTIVE','INACTIVE','PENDING') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 7. vehicle_types
CREATE TABLE vehicle_types (
  vehicle_type_id VARCHAR(36) PRIMARY KEY,
  code VARCHAR(100) NOT NULL DEFAULT '',
  type_name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 8. bus_layouts
CREATE TABLE bus_layouts (
  layout_id VARCHAR(36) PRIMARY KEY,
  layout_name VARCHAR(255) NOT NULL,
  total_rows INT NOT NULL,
  total_columns INT NOT NULL,
  floor_count INT DEFAULT 1,
  is_template BOOLEAN DEFAULT FALSE,
  bus_company_id VARCHAR(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bus_company_id) REFERENCES bus_companies(id) ON DELETE SET NULL
);

-- 9. buses
CREATE TABLE buses (
  id VARCHAR(36) PRIMARY KEY,
  bus_company_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  descriptions TEXT,
  license_plate VARCHAR(50),
  capacity INT,
  vehicle_type_id VARCHAR(36),
  layout_id VARCHAR(36),
  thumbnail_image TEXT,
  status ENUM('ACTIVE','INACTIVE','PENDING','MAINTENANCE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bus_company_id) REFERENCES bus_companies(id) ON DELETE CASCADE,
  FOREIGN KEY (vehicle_type_id) REFERENCES vehicle_types(vehicle_type_id) ON DELETE SET NULL,
  FOREIGN KEY (layout_id) REFERENCES bus_layouts(layout_id) ON DELETE SET NULL
);

-- 10. bus_images
CREATE TABLE bus_images (
  id VARCHAR(36) PRIMARY KEY,
  image_url TEXT NOT NULL,
  bus_id VARCHAR(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);

-- 11. seat_types
CREATE TABLE seat_types (
  seat_type_id VARCHAR(36) PRIMARY KEY,
  type_name VARCHAR(100) NOT NULL,
  description TEXT,
  price_multiplier DECIMAL(5,2) DEFAULT 1.00,
  color VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 12. seat_positions
CREATE TABLE seat_positions (
  id VARCHAR(36) PRIMARY KEY,
  layout_id VARCHAR(36) NOT NULL,
  floor INT DEFAULT 1,
  row_index INT NOT NULL,
  column_index INT NOT NULL,
  seat_type_id VARCHAR(36),
  is_driver_seat BOOLEAN DEFAULT FALSE,
  is_door BOOLEAN DEFAULT FALSE,
  is_stair BOOLEAN DEFAULT FALSE,
  is_aisle BOOLEAN DEFAULT FALSE,
  label VARCHAR(20),
  status ENUM('ACTIVE','MAINTENANCE') DEFAULT 'ACTIVE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (layout_id) REFERENCES bus_layouts(layout_id) ON DELETE CASCADE,
  FOREIGN KEY (seat_type_id) REFERENCES seat_types(seat_type_id) ON DELETE SET NULL
);

-- 13. seats
CREATE TABLE seats (
  id VARCHAR(36) PRIMARY KEY,
  bus_id VARCHAR(36) NOT NULL,
  seat_number VARCHAR(20),
  seat_label VARCHAR(20),
  seat_type_id VARCHAR(36),
  price_extra DECIMAL(12,2) DEFAULT 0,
  is_available_for_booking BOOLEAN DEFAULT TRUE,
  status ENUM('AVAILABLE','BOOKED','LOCKED','MAINTENANCE') DEFAULT 'AVAILABLE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
  FOREIGN KEY (seat_type_id) REFERENCES seat_types(seat_type_id) ON DELETE SET NULL
);

-- 14. routes
CREATE TABLE routes (
  id VARCHAR(36) PRIMARY KEY,
  departure_station_id VARCHAR(36) NOT NULL,
  arrival_station_id VARCHAR(36) NOT NULL,
  base_price DECIMAL(12,2) NOT NULL,
  duration INT,
  distance DECIMAL(10,2),
  description TEXT,
  image TEXT,
  total_bookings INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (departure_station_id) REFERENCES stations(id),
  FOREIGN KEY (arrival_station_id) REFERENCES stations(id)
);

-- 15. schedules
CREATE TABLE schedules (
  id VARCHAR(36) PRIMARY KEY,
  route_id VARCHAR(36) NOT NULL,
  bus_id VARCHAR(36) NOT NULL,
  departure_time DATETIME NOT NULL,
  arrival_time DATETIME NOT NULL,
  total_seats INT DEFAULT 0,
  available_seats INT DEFAULT 0,
  status ENUM('AVAILABLE','FULL','CANCELLED') DEFAULT 'AVAILABLE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES routes(id),
  FOREIGN KEY (bus_id) REFERENCES buses(id)
);

-- 16. tickets
CREATE TABLE tickets (
  id VARCHAR(36) PRIMARY KEY,
  schedule_id VARCHAR(36) NOT NULL,
  seat_id VARCHAR(36),
  user_id VARCHAR(36),
  code VARCHAR(50) NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  status ENUM('PENDING','BOOKED','COMPLETED','CANCELLED') DEFAULT 'PENDING',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (schedule_id) REFERENCES schedules(id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 17. passengers
CREATE TABLE passengers (
  id VARCHAR(36) PRIMARY KEY,
  ticket_id VARCHAR(36) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  identity_number VARCHAR(50),
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE CASCADE
);

-- 18. seat_schedules
CREATE TABLE seat_schedules (
  id VARCHAR(36) PRIMARY KEY,
  schedule_id VARCHAR(36) NOT NULL,
  seat_id VARCHAR(36) NOT NULL,
  ticket_id VARCHAR(36),
  status ENUM('AVAILABLE','HOLD','BOOKED') DEFAULT 'AVAILABLE',
  hold_expired_at DATETIME,
  user_id VARCHAR(36),
  price DECIMAL(12,2),
  FOREIGN KEY (schedule_id) REFERENCES schedules(id),
  FOREIGN KEY (ticket_id) REFERENCES tickets(id) ON DELETE SET NULL
);

-- 19. payments
CREATE TABLE payments (
  id VARCHAR(36) PRIMARY KEY,
  payment_provider_id VARCHAR(36),
  user_id VARCHAR(36),
  ticket_id VARCHAR(36),
  payment_method ENUM('CASH','QR_PAYMENT','E_WALLET','BANK_TRANSFER') DEFAULT 'CASH',
  amount DECIMAL(12,2) NOT NULL,
  status ENUM('PENDING','COMPLETED','FAILED','REFUNDED') DEFAULT 'PENDING',
  transaction_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ticket_id) REFERENCES tickets(id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- 20. payment_providers
CREATE TABLE payment_providers (
  id VARCHAR(36) PRIMARY KEY,
  provider_name VARCHAR(255) NOT NULL,
  provider_type ENUM('CARD','E_WALLET','BANK_TRANSFER','QR_CODE'),
  api_endpoint TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 21. cancellation_policies
CREATE TABLE cancellation_policies (
  id VARCHAR(36) PRIMARY KEY,
  route_id VARCHAR(36),
  cancellation_time_limit INT,
  refund_percentage DECIMAL(5,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- 22. popular_routes
CREATE TABLE popular_routes (
  id VARCHAR(36) PRIMARY KEY,
  route_id VARCHAR(36) NOT NULL,
  image_url TEXT,
  priority INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

-- 23. banners
CREATE TABLE banners (
  id VARCHAR(36) PRIMARY KEY,
  image_url TEXT NOT NULL,
  position INT DEFAULT 0,
  target_type VARCHAR(50),
  target_id VARCHAR(36),
  start_date DATETIME,
  end_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 24. bus_reviews
CREATE TABLE bus_reviews (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  bus_id VARCHAR(36) NOT NULL,
  bus_company_id VARCHAR(36),
  ticket_id VARCHAR(36),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review TEXT,
  status ENUM('VISIBLE','HIDDEN') DEFAULT 'VISIBLE',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE
);
