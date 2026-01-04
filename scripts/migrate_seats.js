const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../server/db.json');

try {
  const rawData = fs.readFileSync(dbPath, 'utf8');
  const db = JSON.parse(rawData);

  if (!db.buses || !db.seat_positions) {
    console.error('Missing buses or seat_positions in db.json');
    process.exit(1);
  }

  const seats = [];
  let seatIdCounter = 1;

  db.buses.forEach(bus => {
    // Find layout for this bus
    // Note: bus.layout_id might be string or number, strict check might fail if types differ
    // Converting to string for comparison is safer
    const positions = db.seat_positions.filter(pos => 
      String(pos.layout_id) === String(bus.layout_id) && 
      !pos.is_driver_seat && 
      !pos.is_door && 
      !pos.is_stair &&
      !pos.is_aisle &&
      pos.label // Only create seats for positions with a label
    );

    positions.forEach(pos => {
      const seat = {
        id: String(seatIdCounter++), // Simple incremental ID
        bus_id: String(bus.id),
        seat_number: pos.label,
        seat_label: pos.label,
        seat_type_id: String(pos.seat_type_id || '2'), // Default to '2' (Giường đôi/thường based on user example) if missing
        price_extra: 0, // Default to 0, user example had 50000 but better to start neutral
        is_available_for_booking: true
      };
      seats.push(seat);
    });
  });

  // Backup db.json just in case
  fs.writeFileSync(dbPath + '.bak', rawData);

  // Update db object
  db.seats = seats;

  // Write back
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

  console.log(`Successfully migrated ${seats.length} seats.`);

} catch (err) {
  console.error('Error migrating seats:', err);
}
