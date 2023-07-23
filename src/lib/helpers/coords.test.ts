import { describe, expect, it } from 'vitest';
import { cartesian2Polar, polar2Cartesian } from './coords';

describe('coords', () => {
  it('coords', () => {
    const lng = 124.45053144586961,
      lat = -9.1801897109863262,
      r = 150,
      [x, y, z] = polar2Cartesian(lat, lng, r),
      [newLng, newLat] = cartesian2Polar(x, y, z);
    expect(newLat.toFixed(5)).equal(lat.toFixed(5));
    expect(newLng.toFixed(5)).equal(lng.toFixed(5));
  });
});
