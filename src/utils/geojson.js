// src/utils/log-field-incident/geojson.js

/**
 * Extract a center coordinate from a park's boundary_geojson.
 * Supports both Point and Polygon types.
 *
 * @param {object} geojson - GeoJSON object from the parks table
 * @returns {{ latitude: number, longitude: number } | null}
 */
export function extractParkLocation(geojson) {
  if (!geojson) return null;

  if (geojson.type === "Point" && Array.isArray(geojson.coordinates)) {
    return {
      latitude: geojson.coordinates[1],
      longitude: geojson.coordinates[0],
    };
  }

  if (geojson.type === "Polygon" && Array.isArray(geojson.coordinates?.[0])) {
    // Compute centroid of the polygon's outer ring
    const ring = geojson.coordinates[0];
    const sumLat = ring.reduce((acc, [, lat]) => acc + lat, 0);
    const sumLng = ring.reduce((acc, [lng]) => acc + lng, 0);
    return {
      latitude: sumLat / ring.length,
      longitude: sumLng / ring.length,
    };
  }

  return null;
}
