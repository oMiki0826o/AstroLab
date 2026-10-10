/*
 * File: astronomy.ts
 * Modification: 2026-10-11 - Shared validated astronomy and camera calculations.
 * Precision: planning approximations, not topocentric professional ephemerides.
 */

// ── Types and conversion helpers ──
export interface Equatorial { raDeg: number; decDeg: number }
export interface Horizontal { altitude: number; azimuth: number }
export interface MoonPhase { ageDays: number; illumination: number; index: number }
export const SYNODIC_MONTH = 29.530588853;
const RAD = Math.PI / 180;
const norm360 = (x: number) => ((x % 360) + 360) % 360;
const norm180 = (x: number) => ((x + 180) % 360 + 360) % 360 - 180;
export const isLatitude = (value: number) => Number.isFinite(value) && value >= -90 && value <= 90;
export const isLongitude = (value: number) => Number.isFinite(value) && value >= -180 && value <= 180;
export const isPosition = (latitude: number, longitude: number) => isLatitude(latitude) && isLongitude(longitude);
export const isEquatorial = ({ raDeg, decDeg }: Equatorial) => Number.isFinite(raDeg) && raDeg >= 0 && raDeg < 360 && Number.isFinite(decDeg) && decDeg >= -90 && decDeg <= 90;

export function formatRa(deg: number): string {
  if (!Number.isFinite(deg)) return "—";
  const totalSeconds = Math.round(norm360(deg) / 15 * 3600) % 86400;
  const h = Math.floor(totalSeconds / 3600), m = Math.floor(totalSeconds % 3600 / 60), s = totalSeconds % 60;
  return `${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}
export function formatDec(deg: number): string {
  if (!Number.isFinite(deg)) return "—";
  const total = Math.round(Math.abs(deg) * 60);
  return `${deg < 0 ? "−" : "+"}${String(Math.floor(total / 60)).padStart(2, "0")}° ${String(total % 60).padStart(2, "0")}′`;
}

// ── Date and sky position ──
export function formatLocalDateTime(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
export function julianDay(date: Date): number { return date.getTime() / 86400000 + 2440587.5; }
export function localSiderealDegrees(date: Date, longitude: number): number {
  const jd = julianDay(date);
  const t = (jd - 2451545) / 36525;
  return norm360(280.46061837 + 360.98564736629 * (jd - 2451545) + 0.000387933 * t * t - (t * t * t) / 38710000 + longitude);
}
export function toHorizontal(eq: Equatorial, date: Date, latitude: number, longitude: number): Horizontal | null {
  if (!isEquatorial(eq) || !isPosition(latitude, longitude) || !Number.isFinite(date.getTime())) return null;
  const ha = norm180(localSiderealDegrees(date, longitude) - eq.raDeg) * RAD;
  const phi = latitude * RAD, dec = eq.decDeg * RAD;
  const altitude = Math.asin(Math.max(-1, Math.min(1, Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(ha)))) / RAD;
  // Numerically stable azimuth: 0 North / 90 East / 180 South / 270 West.
  const east = -Math.cos(dec) * Math.sin(ha);
  const north = Math.sin(dec) * Math.cos(phi) - Math.cos(dec) * Math.sin(phi) * Math.cos(ha);
  const azimuth = norm360(Math.atan2(east, north) / RAD);
  return { altitude, azimuth };
}

// ── Approximate solar and lunar models ──
export function solarEquatorial(date: Date): Equatorial {
  const n = julianDay(date) - 2451545;
  const meanLongitude = norm360(280.460 + 0.9856474 * n);
  const meanAnomaly = norm360(357.528 + 0.9856003 * n) * RAD;
  const lambda = (meanLongitude + 1.915 * Math.sin(meanAnomaly) + 0.020 * Math.sin(2 * meanAnomaly)) * RAD;
  const epsilon = (23.439 - 0.0000004 * n) * RAD;
  const raDeg = norm360(Math.atan2(Math.cos(epsilon) * Math.sin(lambda), Math.cos(lambda)) / RAD);
  const decDeg = Math.asin(Math.sin(epsilon) * Math.sin(lambda)) / RAD;
  return { raDeg, decDeg };
}
export function solarAltitude(date: Date, latitude: number, longitude: number): number | null {
  return toHorizontal(solarEquatorial(date), date, latitude, longitude)?.altitude ?? null;
}
export function moonPhase(date: Date): MoonPhase {
  if (!Number.isFinite(date.getTime())) return { ageDays: NaN, illumination: NaN, index: -1 };
  const reference = Date.UTC(2000, 0, 6, 18, 14);
  const ageDays = (((date.getTime() - reference) / 86400000) % SYNODIC_MONTH + SYNODIC_MONTH) % SYNODIC_MONTH;
  const illumination = (1 - Math.cos(2 * Math.PI * ageDays / SYNODIC_MONTH)) / 2;
  const index = Math.floor((ageDays / SYNODIC_MONTH) * 8 + .5) % 8;
  return { ageDays, illumination, index };
}

// ── Observation window ──
export interface NightSample { time: Date; altitude: number; sunAltitude: number }
export interface NightWindow { start: Date; end: Date; peak: NightSample; durationMinutes: number }
export function nightWindow(eq: Equatorial, day: Date, latitude: number, longitude: number, minAltitude = 25, maxSunAltitude = -12): NightWindow | null {
  if (!isPosition(latitude, longitude) || !isEquatorial(eq) || !Number.isFinite(day.getTime())) return null;
  // A local evening plus the following morning; before noon belongs to the previous evening.
  const start = new Date(day.getFullYear(), day.getMonth(), day.getDate(), 18, 0);
  if (day.getHours() < 12) start.setDate(start.getDate() - 1);
  const good: NightSample[] = [];
  const step = 15;
  for (let i = 0; i <= 12 * 60 / step; i++) {
    const time = new Date(start.getTime() + i * step * 60000);
    const pos = toHorizontal(eq, time, latitude, longitude);
    const sun = solarAltitude(time, latitude, longitude);
    if (pos && sun !== null && pos.altitude >= minAltitude && sun <= maxSunAltitude) {
      good.push({ time, altitude: pos.altitude, sunAltitude: sun });
    }
  }
  if (!good.length) return null;
  const peak = good.reduce((best, sample) => sample.altitude > best.altitude ? sample : best);
  return { start: good[0].time, end: good[good.length - 1].time, peak, durationMinutes: good.length * step };
}

// ── Imaging calculations ──
export function fieldOfView(sensorMm: number, focalMm: number): number | null {
  if (!Number.isFinite(sensorMm) || !Number.isFinite(focalMm) || sensorMm <= 0 || focalMm <= 0) return null;
  return 2 * Math.atan(sensorMm / (2 * focalMm)) / RAD;
}
export function exposurePlan(seconds: number, frames: number, ditherEvery: number, overheadSeconds = 0, settleSeconds = 0) {
  if (![seconds, frames, ditherEvery, overheadSeconds, settleSeconds].every(Number.isFinite) || seconds <= 0 || !Number.isInteger(frames) || frames < 1 || !Number.isInteger(ditherEvery) || ditherEvery < 0 || overheadSeconds < 0 || settleSeconds < 0) return null;
  const dithers = ditherEvery === 0 ? 0 : Math.floor((frames - 1) / ditherEvery);
  const integrationSeconds = seconds * frames;
  const elapsedSeconds = integrationSeconds + overheadSeconds * frames + dithers * settleSeconds;
  if (!Number.isFinite(elapsedSeconds)) return null;
  return { integrationSeconds, elapsedSeconds, dithers };
}
