import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import pool from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cityRoutes from './routes/cityRoutes.js';
import stationRoutes from './routes/stationRoutes.js';
import routeRoutes from './routes/routeRoutes.js';
import busCompanyRoutes from './routes/busCompanyRoutes.js';
import busRoutes from './routes/busRoutes.js';
import vehicleTypeRoutes from './routes/vehicleTypeRoutes.js';
import busImageRoutes from './routes/busImageRoutes.js';
import seatTypeRoutes from './routes/seatTypeRoutes.js';
import busLayoutRoutes from './routes/busLayoutRoutes.js';
import seatPositionRoutes from './routes/seatPositionRoutes.js';
import seatRoutes from './routes/seatRoutes.js';
import scheduleRoutes from './routes/scheduleRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import paymentProviderRoutes from './routes/paymentProviderRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import bannerRoutes from './routes/bannerRoutes.js';
import popularRouteRoutes from './routes/popularRouteRoutes.js';
import cancellationPolicyRoutes from './routes/cancellationPolicyRoutes.js';
import seatScheduleRoutes from './routes/seatScheduleRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import roleRoutes from './routes/roleRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cities', cityRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/routes', routeRoutes);
app.use('/api/bus-companies', busCompanyRoutes);
app.use('/api/buses', busRoutes);
app.use('/api/vehicle-types', vehicleTypeRoutes);
app.use('/api/bus-images', busImageRoutes);
app.use('/api/seat-types', seatTypeRoutes);
app.use('/api/bus-layouts', busLayoutRoutes);
app.use('/api/seat-positions', seatPositionRoutes);
app.use('/api/seats', seatRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/payment-providers', paymentProviderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/popular-routes', popularRouteRoutes);
app.use('/api/cancellation-policies', cancellationPolicyRoutes);
app.use('/api/seat-schedules', seatScheduleRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/roles', roleRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  try {
    const connection = await pool.getConnection();
    console.log('MySQL connected successfully');
    connection.release();
  } catch (err) {
    console.error('MySQL connection failed:', err.message);
  }
  console.log(`Server running on port ${PORT}`);
});

export default app;
