"use client";

import { type CSSProperties, useId, useRef } from "react";
import { MOTION_QUERY, gsap, useGSAP } from "@/lib/gsap";
import type { Gradient, WaveLayer, WaveSpec } from "./waves";
import styles from "./WaveShape.module.scss";

type WaveShapeProps = {
  spec: WaveSpec;
};

type Point = [number, number];

const VIEW_WIDTH = 1440;
const VIEW_HEIGHT = 1000;
const ANCHOR_X = [0, 240, 480, 720, 960, 1200, 1440];

const stops: Record<Gradient, { offset: string; color: string }[]> = {
  brand: [
    { offset: "0%", color: "#8b5cf6" },
    { offset: "45%", color: "#4f7cf0" },
    { offset: "100%", color: "#14d2e6" },
  ],
  hero: [
    { offset: "0%", color: "#8b5cf6" },
    { offset: "100%", color: "#14d2e6" },
  ],
  charcoal: [
    { offset: "0%", color: "#333333" },
    { offset: "100%", color: "#333333" },
  ],
};

const gradientVector = {
  vertical: { x1: "0", y1: "0", x2: "0", y2: "1" },
  diagonal: { x1: "0", y1: "0", x2: "1", y2: "1" },
};

/** Smooth curve through the points (Catmull-Rom as cubic segments). Starts from the current point. */
function curve(points: Point[]) {
  let d = "";
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x} ${c1y} ${c2x} ${c2y} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

/** The region between two curves. The second curve runs back right to left so the shape closes. */
function bandPath(top: Point[], bottom: Point[]) {
  const bottomReversed = [...bottom].reverse();
  return (
    `M${top[0][0]} ${top[0][1]}${curve(top)}` +
    ` L${bottomReversed[0][0]} ${bottomReversed[0][1]}${curve(bottomReversed)} Z`
  );
}

/** Heights with a sine swell per anchor. A zero anchor stays at zero, so flat edges stay flat. */
function swell(heights: number[], amplitude: number, t: number) {
  return heights.map((height, i) => height * (1 + amplitude * Math.sin(t + i * 1.3)));
}

function toPoints(heights: number[]) {
  return heights.map((y, i): Point => [ANCHOR_X[i], y]);
}

/** The layer's band at phase t. */
function layerPath(layer: WaveLayer, t: number) {
  const top = toPoints(swell(layer.top, layer.topAmplitude ?? layer.amplitude, t));
  const bottom = toPoints(swell(layer.bottom, layer.amplitude, t + 0.7));
  return bandPath(top, bottom);
}

/** The backdrop above the layer's top curve, in the same phase as the layer. */
function backdropPath(layer: WaveLayer, edge: number, t: number) {
  const top = toPoints(swell(layer.top, layer.topAmplitude ?? layer.amplitude, t));
  return bandPath(top, toPoints(layer.top.map(() => edge)));
}

export function WaveShape({ spec }: WaveShapeProps) {
  const id = useId();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bandRefs = useRef<(SVGPathElement | null)[]>([]);
  const backdropRefs = useRef<(SVGPathElement | null)[]>([]);

  // One gradient per fill used: the section gradient plus any layer backdrops.
  const gradients = Array.from(
    new Set<Gradient>([spec.gradient, ...spec.layers.flatMap((layer) => (layer.backdrop ? [layer.backdrop.gradient] : []))]),
  );
  const gradientId = (name: Gradient) => `${id}-${name}`;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(MOTION_QUERY, () => {
        // Liquid motion: each layer's anchors swell on a sine, each layer on its own period.
        // A layer's backdrop follows the same phase, so the two edges never separate.
        spec.layers.forEach((layer, index) => {
          const band = bandRefs.current[index];
          const backdrop = backdropRefs.current[index];
          if (!band) return;

          const phase = { t: 0 };
          gsap.to(phase, {
            t: Math.PI * 2,
            duration: layer.period,
            ease: "none",
            repeat: -1,
            delay: -index * 1.5,
            onUpdate: () => {
              band.setAttribute("d", layerPath(layer, phase.t));
              if (backdrop && layer.backdrop) {
                backdrop.setAttribute("d", backdropPath(layer, layer.backdrop.edge, phase.t));
              }
            },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: wrapperRef, dependencies: [spec] },
  );

  return (
    <div
      ref={wrapperRef}
      className={`${styles.wave} ${spec.mobileScale ? styles.scaled : ""}`}
      style={{ "--wave-mobile-scale": spec.mobileScale } as CSSProperties}
      aria-hidden="true"
    >
      <svg
        className={styles.svg}
        viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
        preserveAspectRatio="none"
        focusable="false"
      >
        <defs>
          {gradients.map((name) => (
            <linearGradient key={name} id={gradientId(name)} {...gradientVector[spec.direction]}>
              {stops[name].map((stop) => (
                <stop key={stop.offset} offset={stop.offset} stopColor={stop.color} />
              ))}
            </linearGradient>
          ))}
        </defs>
        {/* Backdrops first, so translucent layers can still show over them. */}
        {spec.layers.map((layer, index) =>
          layer.backdrop ? (
            <path
              key={`backdrop-${index}`}
              ref={(node) => {
                backdropRefs.current[index] = node;
              }}
              d={backdropPath(layer, layer.backdrop.edge, 0)}
              fill={`url(#${gradientId(layer.backdrop.gradient)})`}
            />
          ) : null,
        )}
        {spec.layers.map((layer, index) => (
          <path
            key={index}
            ref={(node) => {
              bandRefs.current[index] = node;
            }}
            d={layerPath(layer, 0)}
            fill={`url(#${gradientId(spec.gradient)})`}
            opacity={layer.opacity}
          />
        ))}
      </svg>
    </div>
  );
}
