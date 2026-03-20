# ResQ Moto – Leaflet Roadside Assistance Demo

A polished front-end demo for roadside assistance and mobile mechanic booking in Ho Chi Minh City.

## Features
- 6-step booking flow
- Modern UI with responsive layout for desktop, tablet and mobile
- Leaflet + OpenStreetMap map
- All drivers visible on the map
- Click driver markers to:
  - choose driver immediately
  - preview the route
- Customer location by:
  - current GPS
  - address search
  - dragging the customer pin
- OSRM route preview from driver to customer
- Payment step:
  - cash
  - bank transfer
- Fuel delivery option:
  - E5
  - RON95
  - Diesel
  - liters input
- Bilingual UI:
  - Vietnamese
  - English
- Tracking step with trip timeline
- Quick actions:
  - call driver
  - quick chat mock
- Reference price drawer
- Admin demo page:
  - `pages/admin.html`

## Run
Use a local server for best results.

### Option 1: VS Code Live Server
Open the folder in VS Code and run Live Server on `index.html`.

### Option 2: Python
```bash
python3 -m http.server 8000
```

Then open:
```text
http://localhost:8000
```

## Notes
- Internet is required for map tiles, route calculation and geocoding.
- OTP demo code is `123456`.
- Booking records are stored in browser `localStorage` for demo purposes.
