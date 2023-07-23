const RAD2DEG = 180 / Math.PI,
  DEG2RAD = Math.PI / 180;

export function polarToCartesian(lng: number, lat: number, radius: number) {
  const phi = (90 - lat) * DEG2RAD,
    theta = (lng + 180) * DEG2RAD;

  return {
    x: -(radius * Math.sin(phi) * Math.sin(theta)),
    y: radius * Math.cos(phi),
    z: radius * Math.sin(phi) * Math.cos(theta)
  };
}

export function cartesianToPolar(coord: { x: number; y: number; z: number }) {
  const lng = Math.atan2(coord.x, -coord.z) * RAD2DEG,
    length = Math.sqrt(coord.x * coord.x + coord.z * coord.z),
    lat = Math.atan2(coord.y, length) * RAD2DEG;

  return [lng, lat];
}
