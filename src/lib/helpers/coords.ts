const radian = 180 / Math.PI;

const EPSILON = 1e-5;

export function polar2Cartesian(lng: number, lat: number, r = 0) {
  const phi = ((90.0 - lat) * Math.PI) / 180.0;
  const theta = ((90.0 - lng) * Math.PI) / 180.0;
  return [
    r * Math.sin(phi) * Math.cos(theta), // x
    r * Math.cos(phi), // y
    r * Math.sin(phi) * Math.sin(theta) // z
  ];
}

export function cartesian2Polar(x: number, y: number, z: number) {
  const r = Math.sqrt(x * x + y * y + z * z);
  if (r < EPSILON) return [NaN, NaN];
  const cylinderX = Math.sqrt(x * x + z * z),
    cylinderY = y,
    phi = Math.atan2(cylinderY, cylinderX),
    theta = Math.atan2(x, z),
    lng = 180.0 - (phi * 180.0) / Math.PI,
    _lat = (theta * 180.0) / Math.PI,
    lat = _lat > 90 ? _lat - 180 : _lat;
  return [lng, lat];
}
