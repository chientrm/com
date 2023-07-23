import { describe, expect, it } from 'vitest';
import { cartesian2Polar, polar2Cartesian } from './coords';

describe('coords', () => {
  it('coords', () => {
    const lat = 124.45053144586961,
      lng = -9.1801897109863262,
      r = 150,
      [x, y, z] = polar2Cartesian(lat, lng, r),
      [newLat, newLng] = cartesian2Polar(x, y, z);
    console.log({ lat, lng });
    console.log({ newLat, newLng });
    expect(newLat).toBe(lat);
    expect(newLng).toBe(lng);
  });
});
