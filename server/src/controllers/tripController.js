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

    // 4. Find schedules for those routes on the given date (status=AVAILABLE or active)
    // Filter schedules >= 1 hour before departure
    const oneHourFromNow = new Date(Date.now() + 60 * 60 * 1000)
      .toISOString().slice(0, 19).replace('T', ' ');

    const [schedules] = await pool.query(
      `SELECT sc.id AS schedule_id, sc.route_id, sc.bus_id, sc.departure_time, sc.arrival_time,
              sc.price, sc.available_seats, sc.status,
              r.distance, r.duration,
              r.departure_station_id, r.arrival_station_id,
              ds.station_name AS departure_station_name, ds.address AS departure_address,
              dc.city_name AS departure_city_name,
              ars.station_name AS arrival_station_name, ars.address AS arrival_address,
              ac.city_name AS arrival_city_name,
              b.bus_name, b.license_plate, b.total_seats,
              bc.id AS bus_company_id, bc.company_name, bc.logo AS company_logo, bc.rating AS company_rating
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
         AND sc.status IN ('active', 'AVAILABLE')
         AND sc.departure_time >= ?
       ORDER BY sc.departure_time ASC`,
      [...routeIds, date, oneHourFromNow]
    );

    // 5. For each schedule, count available seats from seat_schedules
    const trips = [];
    for (const schedule of schedules) {
      const [seatCount] = await pool.query(
        `SELECT COUNT(*) AS available FROM seat_schedules
         WHERE schedule_id = ? AND status = 'available'`,
        [schedule.schedule_id]
      );

      trips.push({
        ...schedule,
        available_seats_realtime: seatCount[0].available,
      });
    }

    res.json({ success: true, data: trips, message: 'OK' });
  } catch (err) {
    next(err);
  }
};
