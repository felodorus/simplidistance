

import mysql from 'mysql2/promise.js';

const R = 6371e3; // Earthradius in meter
const sin = Math.sin, cos = Math.cos, acos = Math.acos;
const π = Math.PI;

// query selection parameters: latitude, longitude & radius of bounding circle
const lat = req.query.lat //degrees
const lon = req.query.lon //degrees
const radius = req.query.radius; //meters

// database connection
const Db = await mysql.createConnection({
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    namedPlaceholders: true,
});

// query points within first-cut bounding box (Lat & Lon should be indexed for fast query)
const sql = `
    Select Id, Postcode, Lat, Lon
    From MyTable
    Where Lat Between :minLat And :maxLat
      And Lon Between :minLon And :maxLon`;

const params = {
    minLat: lat - radius / R * 180 / π,
    maxLat: lat + radius / R * 180 / π,
    minLon: lon - radius / R * 180 / π / cos(lat * π / 180),
    maxLon: lon + radius / R * 180 / π / cos(lat * π / 180),
};
const [pointsBoundingBox] = await Db.execute(sql, params);
Db.end(); // close DB connection

// add in distance d = acos( sinφ₁⋅sinφ₂ + cosφ₁⋅cosφ₂⋅cosΔλ ) ⋅ R
pointsBoundingBox.forEach(p => {
    p.d = acos(sin(p.Lat * π / 180) * sin(lat * π / 180) +
        cos(p.Lat * π / 180) * cos(lat * π / 180) * cos(p.Lon * π / 180 - lon * π / 180)) * R
})

// filter for points with distance from bounding circle centre less than radius, and sort
const pointsWithinCircle = pointsBoundingBox.filter(p => p.d < radius).sort((a, b) => a.d - b.d);

console.log(pointsWithinCircle); 