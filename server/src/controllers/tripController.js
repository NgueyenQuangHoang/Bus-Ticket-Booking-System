import pool from '../config/db.js';

export const search = async (req, res, next) => {
  try {
    const { fromCity, toCity, date } = req.query;

    if (!fromCity || !toCity || !date) {
      return res.status(400).json({ success: false, message: 'fromCity, toCity and date are required' });
    }

    // 1. Find city IDs by name (LIKE search)
    const [departureCities] = await pool.query(
      'SELECT id FROM cities WHERE city_name LIKE ?',
      [`%${fromCity}%`]
    );

    const [arrivalCities] = await pool.query(
      'SELECT id FROM cities WHERE city_name LIKE ?',
      [`%${toCity}%`]
    );

    if (departureCities.length === 0 || arrivalCities.length === 0) {
      return res.json({ success: true, data: [], message: 'No trips found' });
    }

    const departureCityIds = departureCities.map(c => c.id);
    const arrivalCityIds = arrivalCities.map(c => c.id);

    // 2. Find stations in those cities
    const depPlaceholders = departureCityIds.map(() => '?').join(', ');
    const arrPlaceholders = arrivalCityIds.map(() => '?').join(', ');

    const [departureStations] = await pool.query(
      `SELECT id FROM stations WHERE city_id IN (${depPlaceholders})`,
      departureCityIds
    );

    const [arrivalStations] = await pool.query(
      `SELECT id FROM stations WHERE city_id IN (${arrPlaceholders})`,
      arrivalCityIds
    );

    if (departureStations.length === 0 || arrivalStations.length === 0) {
      return res.json({ success: true, data: [], message: 'No trips found' });
    }

    const depStationIds = departureStations.map(s => s.id);
    const arrStationIds = arrivalStations.map(s => s.id);

    // 3. Find routes connecting departure stations to arrival stations
    const depSPlaceholders = depStationIds.map(() => '?').join(', ');
    const arrSPlaceholders = arrStationIds.map(() => '?').join(', ');

    const [routes] = await pool.query(
      `SELECT id FROM routes
       WHERE departure_station_id IN (${depSPlaceholders})
         AND arrival_station_id IN (${arrSPlaceholders})`,
      [...depStationIds, ...arrStationIds]
    );

    if (routes.length === 0) {
      return res.json({ success: true, data: [], message: 'No trips found' });
    }

    const routeIds = routes.map(r => r.id);
    const routePlaceholders = routeIds.map(() => '?').join(', ');

    // 4. Find schedules for those routes on the given date
    // Filter schedules >= 1 hour before departure
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000)
      .toISOString().slice(0, 19).replace('T', ' ');

    const [schedules] = await pool.query(
      `SELECT sc.id AS schedule_id, sc.route_id, sc.bus_id, sc.departure_time, sc.arrival_time,
              sc.available_seats, sc.status,
              r.base_price, r.distance, r.duration,
              r.departure_station_id, r.arrival_station_id,
              ds.station_name AS departure_station_name, ds.location AS departure_location,
              dc.city_name AS departure_city_name,
              ars.station_name AS arrival_station_name, ars.location AS arrival_location,
              ac.city_name AS arrival_city_name,
              b.name AS bus_name, b.license_plate, b.capacity,
              bc.id AS bus_company_id, bc.company_name, bc.image AS company_image, bc.rating_avg AS company_rating,
              (SELECT COUNT(*) FROM seat_positions sp_t
               WHERE sp_t.layout_id = b.layout_id
                 AND sp_t.is_driver_seat = FALSE AND sp_t.is_door = FALSE
                 AND sp_t.is_stair = FALSE AND sp_t.is_aisle = FALSE
              ) AS calculated_total_seats,
              (
                (SELECT COUNT(*) FROM seat_positions sp_t2
                 WHERE sp_t2.layout_id = b.layout_id
                   AND sp_t2.is_driver_seat = FALSE AND sp_t2.is_door = FALSE
                   AND sp_t2.is_stair = FALSE AND sp_t2.is_aisle = FALSE)
                -
                (SELECT COUNT(*) FROM seat_schedules ss_bh
                 INNER JOIN seat_positions sp_bh ON ss_bh.seat_id = sp_bh.id
                 WHERE ss_bh.schedule_id = sc.id
                   AND (ss_bh.status = 'BOOKED'
                        OR (ss_bh.status = 'HOLD' AND (ss_bh.hold_expired_at IS NULL OR ss_bh.hold_expired_at > NOW())))
                   AND sp_bh.is_driver_seat = FALSE AND sp_bh.is_door = FALSE
                   AND sp_bh.is_stair = FALSE AND sp_bh.is_aisle = FALSE)
              ) AS available_seats_realtime
       FROM schedules sc
       INNER JOIN routes r ON sc.route_id = r.id
       INNER JOIN stations ds ON r.departure_station_id = ds.id
       INNER JOIN stations ars ON r.arrival_station_id = ars.id
       INNER JOIN cities dc ON ds.city_id = dc.id
       INNER JOIN cities ac ON ars.city_id = ac.id
       INNER JOIN buses b ON sc.bus_id = b.id
       INNER JOIN bus_companies bc ON b.bus_company_id = bc.id
       WHERE sc.route_id IN (${routePlaceholders})
         AND DATE(sc.departure_time) = ?
         AND sc.status = 'AVAILABLE'
         AND sc.departure_time >= ?
       ORDER BY sc.departure_time ASC`,
      [...routeIds, date, oneHourFromNow]
    );

    res.json({ success: true, data: schedules, message: 'OK' });
  } catch (err) {
    next(err);
  }
};
