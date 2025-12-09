import React, { useState } from 'react';


file.text().then(text => {
const parsed = parseIGC(text);
setFlight(parsed);
setChecks(validateFlight(parsed));
});
}


const points = flight ? flight.fixes.map(f => [f.lat, f.lon]) : [];
const chartData = flight ? flight.fixes.map((f, i) => ({ id: i, baro: f.pAlt, gps: f.gAlt })) : [];


return (
<div style={{ display: 'flex' }}>
<div className="sidebar">
<h2>IGC Analyzer</h2>
<input type="file" accept=".igc" onChange={handleFiles} />


{checks.map((c, i) => (
<div key={i} className={c.pass ? 'check-pass' : 'check-fail'}>
<strong>{c.title}</strong>
<div>{c.detail}</div>
</div>
))}
</div>


<div style={{ flex: 1, padding: '15px' }}>
<div className="map-container">
{points.length > 0 && (
<MapContainer center={points[0]} zoom={10} style={{ height: '100%', width: '100%' }}>
<TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
<Polyline positions={points} />
<Marker position={points[0]} />
<Marker position={points[points.length - 1]} />
</MapContainer>
)}
</div>


<div style={{ height: '300px' }}>
{chartData.length > 0 && (
<ResponsiveContainer width="100%" height="100%">
<LineChart data={chartData}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="id" />
<YAxis />
<Tooltip />
<Legend />
<Line type="monotone" dataKey="baro" stroke="#8884d8" dot={false} name="Barometric" />
<Line type="monotone" dataKey="gps" stroke="#82ca9d" dot={false} name="GPS" />
</LineChart>
</ResponsiveContainer>
)}
</div>
</div>
</div>
);
}