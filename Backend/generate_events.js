// node generate_events.js
const fs = require('fs');
const path = require('path');

const TRIP_COUNT = 5;
const EVENTS_PER_TRIP = 2000; // total 10k
const START_TIME = Date.now();
const MS_BETWEEN_EVENTS = 1000;

function randBetween(a, b) { return a + Math.random() * (b - a); }

const events = [];

for (let trip = 1; trip <= TRIP_COUNT; trip++) {
  let lat = randBetween(12.9, 13.2);
  let lon = randBetween(77.4, 77.7);
  let odo = 0;
  for (let i = 0; i < EVENTS_PER_TRIP; i++) {
    const ts = START_TIME + i * MS_BETWEEN_EVENTS + trip * 500;
    lat += randBetween(-0.0005, 0.0005);
    lon += randBetween(-0.0005, 0.0005);
    const speed = Math.max(0, randBetween(20, 80));
    odo += speed / 3600; // km
    events.push({ id:`${trip}-${i}`, tripId:`T${trip}`, timestamp:ts, lat:+lat.toFixed(6),
      lon:+lon.toFixed(6), speed:+speed.toFixed(1), odometer:+odo.toFixed(2),
      status: i===EVENTS_PER_TRIP-1 ? 'completed':'running'
    });
  }
}
events.sort((a,b)=>a.timestamp-b.timestamp);
fs.writeFileSync(path.join(__dirname,'events.json'), JSON.stringify(events,null,2));
console.log('✅ Generated events.json with', events.length, 'records');
