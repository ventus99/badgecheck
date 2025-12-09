// --- Utility: Parse latitude & longitude ---
if (line.startsWith('B')) {
const timeStr = line.slice(1, 7);
const latStr = line.slice(7, 14);
const lonStr = line.slice(14, 23);
const pAlt = parseInt(line.slice(24, 29));
const gAlt = parseInt(line.slice(29, 34));


const { lat, lon } = parseIGCLatLon(latStr, lonStr);


fixes.push({
timeStr,
lat,
lon,
pAlt: isNaN(pAlt) ? null : pAlt,
gAlt: isNaN(gAlt) ? null : gAlt,
});
}
if (line.startsWith('G')) {
signature += line + '\n';
}
}


return { headers, fixes, signature };
}


// --- SC3 Validation Checks ---
export function validateFlight({ fixes, signature }) {
const checks = [];


const num = fixes.length;
const p = fixes.filter(f => f.pAlt !== null).length;
const g = fixes.filter(f => f.gAlt !== null).length;


checks.push({
title: 'Pressure altitude present',
pass: p / num > 0.8,
detail: `${p}/${num} fixes have barometric altitude`,
});


checks.push({
title: 'GPS altitude present',
pass: g / num > 0.8,
detail: `${g}/${num} fixes have GPS altitude`,
});


const paired = fixes.filter(f => f.pAlt !== null && f.gAlt !== null);
if (paired.length > 0) {
const diff = paired.map(f => f.gAlt - f.pAlt);
const avg = diff.reduce((a, b) => a + b, 0) / diff.length;
checks.push({
title: 'GPS vs Barometric offset reasonable',
pass: Math.abs(avg) < 50,
detail: `Avg offset = ${avg.toFixed(1)} m`,
});
}


checks.push({
title: 'Digital signature present',
pass: signature.length > 0,
detail: signature.length > 0 ? 'Signature block detected' : 'No signature block',
});


return checks;
}