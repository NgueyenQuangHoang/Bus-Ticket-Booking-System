import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 5,
  charset: 'utf8mb4',
  multipleStatements: true,
});

function parseDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 19).replace('T', ' ');
}

async function seed() {
  const dbPath = path.join(__dirname, '..', 'db.json');
  const raw = fs.readFileSync(dbPath, 'utf8');
  const data = JSON.parse(raw);

  const conn = await pool.getConnection();

  try {
    // Disable FK checks for seeding
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');

    // Truncate all tables in reverse dependency order
    const tables = [
      'bus_reviews', 'banners', 'popular_routes', 'cancellation_policies',
      'payment_providers', 'payments', 'seat_schedules', 'passengers',
      'tickets', 'schedules', 'routes', 'seat_positions', 'seats',
      'bus_images', 'buses', 'bus_layouts', 'seat_types', 'vehicle_types',
      'bus_companies', 'stations', 'cities', 'user_role', 'users', 'roles',
    ];
    for (const t of tables) {
      await conn.query(`TRUNCATE TABLE ${t}`);
    }

    console.log('Tables truncated.');

    // 1. roles
    for (const r of data.roles || []) {
      await conn.query(
        'INSERT INTO roles (id, role_name) VALUES (?, ?)',
        [r.id, r.role_name]
      );
    }
    console.log(`Seeded roles: ${data.roles?.length || 0}`);

    // 2. users (hash passwords)
    for (const u of data.users || []) {
      const hashedPw = await bcrypt.hash(u.password, 10);
      await conn.query(
        `INSERT INTO users (id, first_name, last_name, email, password, phone, bus_company_id, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          u.id, u.first_name, u.last_name, u.email, hashedPw,
          u.phone || null, u.bus_company_id || null,
          u.status || 'ACTIVE',
          parseDate(u.created_at) || new Date().toISOString().slice(0, 19).replace('T', ' '),
          parseDate(u.updated_at) || new Date().toISOString().slice(0, 19).replace('T', ' '),
        ]
      );
    }
    console.log(`Seeded users: ${data.users?.length || 0}`);

    // 3. user_role
    for (const ur of data.user_role || []) {
      await conn.query(
        'INSERT INTO user_role (id, user_id, role_id) VALUES (?, ?, ?)',
        [ur.id, ur.user_id, ur.role_id]
      );
    }
    console.log(`Seeded user_role: ${data.user_role?.length || 0}`);

    // 4. cities
    for (const c of data.cities || []) {
      await conn.query(
        `INSERT INTO cities (id, city_name, image_city, region, description, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          c.id, c.city_name, c.image_city || null, c.region || null,
          c.description || null,
          parseDate(c.created_at), parseDate(c.updated_at),
        ]
      );
    }
    console.log(`Seeded cities: ${data.cities?.length || 0}`);

    // 5. stations
    for (const s of data.stations || []) {
      await conn.query(
        `INSERT INTO stations (id, station_name, city_id, image, wallpaper, description, location, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          s.id, s.station_name, s.city_id,
          s.image || null, s.wallpaper || null, s.description || null,
          s.location || null,
          parseDate(s.created_at), parseDate(s.updated_at),
        ]
      );
    }
    console.log(`Seeded stations: ${data.stations?.length || 0}`);

    // 6. bus_companies
    for (const bc of data.bus_companies || []) {
      await conn.query(
        `INSERT INTO bus_companies (id, company_name, image, license_number, contact_phone, contact_email, address, description, rating_avg, rating_count, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bc.id, bc.company_name, bc.image || null,
          bc.license_number || null, bc.contact_phone || null,
          bc.contact_email || null, bc.address || null,
          bc.description || null,
          bc.rating_avg || 0, bc.rating_count || 0,
          bc.status || 'ACTIVE',
          parseDate(bc.created_at), parseDate(bc.updated_at),
        ]
      );
    }
    console.log(`Seeded bus_companies: ${data.bus_companies?.length || 0}`);

    // 7. vehicle_types (db.json: id → vehicle_type_id, display_name → type_name)
    for (const vt of data.vehicle_types || []) {
      await conn.query(
        `INSERT INTO vehicle_types (vehicle_type_id, type_name, description)
         VALUES (?, ?, ?)`,
        [vt.id, vt.display_name || vt.type_name, vt.description || null]
      );
    }
    console.log(`Seeded vehicle_types: ${data.vehicle_types?.length || 0}`);

    // 8. bus_layouts (db.json: id → layout_id)
    for (const bl of data.bus_layouts || []) {
      await conn.query(
        `INSERT INTO bus_layouts (layout_id, layout_name, total_rows, total_columns, floor_count, is_template, bus_company_id, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          bl.id, bl.layout_name, bl.total_rows, bl.total_columns,
          bl.floor_count || 1, bl.is_template ? 1 : 0,
          bl.bus_company_id || null,
          parseDate(bl.created_at),
        ]
      );
    }
    console.log(`Seeded bus_layouts: ${data.bus_layouts?.length || 0}`);

    // 9. buses
    for (const b of data.buses || []) {
      await conn.query(
        `INSERT INTO buses (id, bus_company_id, name, descriptions, license_plate, capacity, vehicle_type_id, layout_id, thumbnail_image, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          b.id, b.bus_company_id || b.company_id,
          b.name, b.descriptions || b.amenities || null,
          b.license_plate || null, b.capacity || null,
          b.vehicle_type_id || null, b.layout_id || null,
          b.thumbnail_image || null,
          b.status || 'ACTIVE',
          parseDate(b.created_at), parseDate(b.updated_at),
        ]
      );
    }
    console.log(`Seeded buses: ${data.buses?.length || 0}`);

    // 10. bus_images
    for (const bi of data.bus_images || []) {
      await conn.query(
        'INSERT INTO bus_images (id, image_url, bus_id) VALUES (?, ?, ?)',
        [bi.id, bi.image_url, bi.bus_id]
      );
    }
    console.log(`Seeded bus_images: ${data.bus_images?.length || 0}`);

    // 11. seat_types (db.json: id → seat_type_id)
    for (const st of data.seat_types || []) {
      await conn.query(
        `INSERT INTO seat_types (seat_type_id, type_name, description, price_multiplier, color)
         VALUES (?, ?, ?, ?, ?)`,
        [
          st.id, st.type_name, st.description || null,
          st.price_multiplier || 1.00, st.color || null,
        ]
      );
    }
    console.log(`Seeded seat_types: ${data.seat_types?.length || 0}`);

    // 12. seat_positions
    for (const sp of data.seat_positions || []) {
      await conn.query(
        `INSERT INTO seat_positions (id, layout_id, floor, row_index, column_index, seat_type_id, is_driver_seat, is_door, is_stair, is_aisle, label)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          sp.id, sp.layout_id, sp.floor || 1,
          sp.row_index, sp.column_index,
          sp.seat_type_id || null,
          sp.is_driver_seat ? 1 : 0, sp.is_door ? 1 : 0,
          sp.is_stair ? 1 : 0, sp.is_aisle ? 1 : 0,
          sp.label || null,
        ]
      );
    }
    console.log(`Seeded seat_positions: ${data.seat_positions?.length || 0}`);

    // 13. seats
    for (const s of data.seats || []) {
      await conn.query(
        `INSERT INTO seats (id, bus_id, seat_number, seat_label, seat_type_id, price_extra, is_available_for_booking, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          s.id, s.bus_id, s.seat_number || null, s.seat_label || null,
          s.seat_type_id || null, s.price_extra || 0,
          s.is_available_for_booking !== false ? 1 : 0,
          s.status || 'AVAILABLE',
        ]
      );
    }
    console.log(`Seeded seats: ${data.seats?.length || 0}`);

    // 14. routes (INSERT IGNORE to skip duplicates in source data)
    for (const r of data.routes || []) {
      await conn.query(
        `INSERT IGNORE INTO routes (id, departure_station_id, arrival_station_id, base_price, duration, distance, description, image, total_bookings, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          r.id, r.departure_station_id, r.arrival_station_id,
          r.base_price, r.duration || null, r.distance || null,
          r.description || null, r.image || null, r.total_bookings || 0,
          parseDate(r.created_at), parseDate(r.updated_at),
        ]
      );
    }
    console.log(`Seeded routes: ${data.routes?.length || 0}`);

    // 15. schedules
    for (const s of data.schedules || []) {
      await conn.query(
        `INSERT INTO schedules (id, route_id, bus_id, departure_time, arrival_time, total_seats, available_seats, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          s.id, s.route_id, s.bus_id,
          parseDate(s.departure_time), parseDate(s.arrival_time),
          s.total_seats || 0, s.available_seats || 0,
          s.status || 'AVAILABLE',
          parseDate(s.created_at), parseDate(s.updated_at),
        ]
      );
    }
    console.log(`Seeded schedules: ${data.schedules?.length || 0}`);

    // 16. tickets
    for (const t of data.tickets || []) {
      await conn.query(
        `INSERT INTO tickets (id, schedule_id, seat_id, user_id, code, price, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          t.id, t.schedule_id, t.seat_id || null, t.user_id || null,
          t.code, t.price, t.status || 'PENDING',
          parseDate(t.created_at), parseDate(t.updated_at),
        ]
      );
    }
    console.log(`Seeded tickets: ${data.tickets?.length || 0}`);

    // 17. passengers
    for (const p of data.passengers || []) {
      await conn.query(
        `INSERT INTO passengers (id, ticket_id, full_name, phone, email, identity_number)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          p.id, p.ticket_id, p.full_name, p.phone,
          p.email || null, p.identity_number || null,
        ]
      );
    }
    console.log(`Seeded passengers: ${data.passengers?.length || 0}`);

    // 18. seat_schedules
    for (const ss of data.seat_schedules || []) {
      await conn.query(
        `INSERT INTO seat_schedules (id, schedule_id, seat_id, ticket_id, status, hold_expired_at, user_id, price)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ss.id, ss.schedule_id, ss.seat_id,
          ss.ticket_id || null, ss.status || 'AVAILABLE',
          parseDate(ss.hold_expired_at), ss.user_id || null,
          ss.price || null,
        ]
      );
    }
    console.log(`Seeded seat_schedules: ${data.seat_schedules?.length || 0}`);

    // 19. payment_providers
    for (const pp of data.payment_providers || []) {
      await conn.query(
        `INSERT INTO payment_providers (id, provider_name, provider_type, api_endpoint)
         VALUES (?, ?, ?, ?)`,
        [pp.id, pp.provider_name, pp.provider_type, pp.api_endpoint || null]
      );
    }
    console.log(`Seeded payment_providers: ${data.payment_providers?.length || 0}`);

    // 20. payments
    for (const p of data.payments || []) {
      await conn.query(
        `INSERT INTO payments (id, payment_provider_id, user_id, ticket_id, payment_method, amount, status, transaction_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          p.id, p.payment_provider_id || null, p.user_id || null,
          p.ticket_id || null, p.payment_method || 'CASH',
          p.amount, p.status || 'PENDING',
          parseDate(p.transaction_date),
        ]
      );
    }
    console.log(`Seeded payments: ${data.payments?.length || 0}`);

    // 21. cancellation_policies
    for (const cp of data.cancellation_policies || []) {
      await conn.query(
        `INSERT INTO cancellation_policies (id, route_id, cancellation_time_limit, refund_percentage, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          cp.id, cp.route_id, cp.cancellation_time_limit,
          cp.refund_percentage,
          parseDate(cp.created_at), parseDate(cp.updated_at),
        ]
      );
    }
    console.log(`Seeded cancellation_policies: ${data.cancellation_policies?.length || 0}`);

    // 22. popular_routes
    for (const pr of data.popular_routes || []) {
      await conn.query(
        'INSERT INTO popular_routes (id, route_id, image_url, priority) VALUES (?, ?, ?, ?)',
        [pr.id, pr.route_id, pr.image_url || null, pr.priority || 0]
      );
    }
    console.log(`Seeded popular_routes: ${data.popular_routes?.length || 0}`);

    // 23. banners
    for (const b of data.banners || []) {
      await conn.query(
        `INSERT INTO banners (id, image_url, position, target_type, target_id, start_date, end_date)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          b.id, b.image_url, b.position || 0,
          b.target_type || null, b.target_id || null,
          parseDate(b.start_date), parseDate(b.end_date),
        ]
      );
    }
    console.log(`Seeded banners: ${data.banners?.length || 0}`);

    // 24. bus_reviews
    for (const br of data.bus_reviews || []) {
      await conn.query(
        `INSERT INTO bus_reviews (id, user_id, bus_id, bus_company_id, ticket_id, rating, review, status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          br.id, br.user_id, br.bus_id,
          br.bus_company_id || null, br.ticket_id || null,
          br.rating, br.review || null,
          br.status || 'VISIBLE',
          parseDate(br.created_at), parseDate(br.updated_at),
        ]
      );
    }
    console.log(`Seeded bus_reviews: ${data.bus_reviews?.length || 0}`);

    // Re-enable FK checks
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');

    console.log('\nSeed completed successfully!');
  } catch (err) {
    console.error('Seed failed:', err.message);
    console.error(err);
  } finally {
    conn.release();
    await pool.end();
  }
}

seed();
