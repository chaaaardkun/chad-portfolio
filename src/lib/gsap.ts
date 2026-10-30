"use client";

// Single registration point for GSAP. Import gsap, ScrollTrigger, ScrollSmoother and useGSAP
// from here, never from "gsap" directly, so plugins are registered once and
// only in client bundles.
import gsap from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollToPlugin, ScrollSmoother);

/** Media conditions for gsap.matchMedia. Every animation lives behind `motion`. */
export const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";
export const REDUCED_QUERY = "(prefers-reduced-motion: reduce)";

export { gsap, ScrollSmoother, ScrollTrigger, useGSAP };
