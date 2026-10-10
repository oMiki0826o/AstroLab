/*
 * File: astronomy.test.ts
 * Modification: 2026-10-11 - Regression tests for time, equatorial, imaging and moon calculations.
 */
import { describe, expect, it } from "vitest";
import {
  exposurePlan, fieldOfView, formatRa, formatDec, isPosition,
  localSiderealDegrees, moonPhase, nightWindow, solarAltitude, toHorizontal,
} from "../lib/astronomy";
import { catalog, findObjects, getObject } from "../lib/catalog";

describe("sidereal and horizon calculations", () => {
  const date = new Date("2000-01-01T12:00:00Z");
  it("uses J2000 epoch correctly", () => expect(localSiderealDegrees(date, 0)).toBeCloseTo(280.46061837, 4));
  it("transits at the zenith for a matching equatorial coordinate", () => {
    const result = toHorizontal({raDeg:localSiderealDegrees(date,0),decDeg:0},date,0,0);
    expect(result?.altitude).toBeCloseTo(90,6);
  });
  it("defines East as 90 and West as 270 degrees", () => {
    const ra=localSiderealDegrees(date,0);
    expect(toHorizontal({raDeg:(ra+90)%360,decDeg:0},date,0,0)?.azimuth).toBeCloseTo(90,4);
    expect(toHorizontal({raDeg:(ra+270)%360,decDeg:0},date,0,0)?.azimuth).toBeCloseTo(270,4);
  });
  it("rejects invalid observer positions", () => {
    expect(isPosition(91,0)).toBe(false);
    expect(isPosition(0,181)).toBe(false);
    expect(toHorizontal({raDeg:1,decDeg:0},date,91,0)).toBeNull();
  });
  it("formats coordinates", () => {
    expect(formatRa(90)).toBe("06h 00m 00s");
    expect(formatDec(-5.5)).toBe("−05° 30′");
  });
  it("solar altitude depends on the observation hour", () => {
    expect(solarAltitude(new Date("2026-06-21T04:00:00Z"),25,121)).toBeGreaterThan(0);
    expect(solarAltitude(new Date("2026-06-21T16:00:00Z"),25,121)).toBeLessThan(-12);
  });
  it("does not produce a fake window for impossible altitude thresholds", () => {
    expect(nightWindow({raDeg:90,decDeg:0},new Date("2026-10-11T10:00:00Z"),25,121,91)).toBeNull();
  });
});
describe("lunar and imaging calculations", () => {
  it("puts the January 2000 reference near new moon", () => {
    const phase=moonPhase(new Date("2000-01-06T18:14:00Z"));
    expect(phase.index).toBe(0);
    expect(phase.illumination).toBeCloseTo(0);
  });
  it("puts half of a synodic month near full moon", () => {
    const phase=moonPhase(new Date(Date.UTC(2000,0,6,18,14)+29.530588853*86400000/2));
    expect(phase.index).toBe(4);
    expect(phase.illumination).toBeCloseTo(1,3);
  });
  it("computes trigonometric FOV", () => {
    expect(fieldOfView(36,600)).toBeCloseTo(3.4377,2);
    expect(fieldOfView(36,0)).toBeNull();
  });
  it("does not dither after the final frame", () => {
    expect(exposurePlan(180,40,10)?.dithers).toBe(3);
    expect(exposurePlan(180,40,0)?.dithers).toBe(0);
    expect(exposurePlan(180,41,10)?.dithers).toBe(4);
  });
  it("tracks elapsed time separately", () => {
    expect(exposurePlan(100,20,5,3,10)).toEqual({integrationSeconds:2000,elapsedSeconds:2090,dithers:3});
  });
  it("rejects invalid exposure inputs", () => {
    expect(exposurePlan(-10,5,0)).toBeNull();
    expect(exposurePlan(10,2.5,0)).toBeNull();
  });
});
describe("canonical catalogue", () => {
  it("has unique route IDs",()=>expect(new Set(catalog.map(x=>x.id)).size).toBe(catalog.length));
  it("does not duplicate M42 and separates B33 from IC434",()=>{
    expect(catalog.filter(x=>x.id==="m42")).toHaveLength(1);
    expect(getObject("b33")?.id).not.toBe(getObject("ic434")?.id);
  });
  it("searches English names in Traditional Chinese UI",()=>expect(findObjects("Orion", "zh-TW").map(x=>x.id)).toContain("m42"));
  it("searches Chinese names in English UI",()=>expect(findObjects("獵戶座", "en").map(x=>x.id)).toContain("m42"));
  it("exposes M110 as index without inventing a magnitude",()=>{
    expect(getObject("m110")?.magnitude).toBeNull();
    expect(findObjects("", "en").some(x=>x.id==="m110")).toBe(false);
  });
});
