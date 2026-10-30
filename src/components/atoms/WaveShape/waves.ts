// Wave bands for each section, traced from the Web design.
//
// Each band is painted between a top curve and a bottom curve. Both curves are
// defined by seven anchor heights spaced across the full width (see ANCHOR_X in
// WaveShape.tsx). Heights run from 0 (top of the section) to 1000 (bottom of
// the section). Values above 1000 or below 0 overshoot the section, which is
// how a band can run into the next section.

export type Gradient = "brand" | "hero" | "charcoal";

export type WaveLayer = {
  top: number[];
  bottom: number[];
  opacity: number;
  /** Fraction each anchor swells and shrinks by while animating. */
  amplitude: number;
  /** Swell fraction for the top curve, when it should differ from `amplitude`. */
  topAmplitude?: number;
  /** Seconds for one full swell cycle. */
  period: number;
  /** A solid fill above the layer's top curve, down to `edge`. Animates with the layer. */
  backdrop?: { gradient: Gradient; edge: number };
};

export type WaveSpec = {
  gradient: Gradient;
  /** "vertical" runs top to bottom; "diagonal" runs top left to bottom right. */
  direction: "vertical" | "diagonal";
  layers: WaveLayer[];
  /** Vertical scale below 600px wide, for bands that would otherwise cover a stacked heading. */
  mobileScale?: number;
};

const flat = (value: number) => [value, value, value, value, value, value, value];

export const waves = {
  // Loader exit: a full-height brand liquid whose rippling crest leads it up the screen.
  // The bottom anchors sit well past the section edge so the swell never opens a gap.
  loader: {
    gradient: "brand",
    direction: "vertical",
    layers: [
      { top: [70, 140, 50, 130, 60, 140, 80], bottom: flat(1300), opacity: 0.4, amplitude: 0.1, topAmplitude: 0.35, period: 4 },
      { top: [100, 40, 130, 60, 140, 50, 110], bottom: flat(1300), opacity: 1, amplitude: 0.1, topAmplitude: 0.3, period: 3 },
    ],
  },

  // Dark hero with a violet to cyan blob hanging from the top right.
  hero: {
    gradient: "hero",
    direction: "diagonal",
    mobileScale: 0.5,
    layers: [
      { top: flat(0), bottom: [0, 0, 130, 300, 340, 520, 640], opacity: 0.35, amplitude: 0.08, period: 13 },
      { top: flat(0), bottom: [0, 0, 115, 265, 310, 495, 612], opacity: 0.6, amplitude: 0.07, period: 10 },
      { top: flat(0), bottom: [0, 0, 100, 235, 282, 470, 582], opacity: 1, amplitude: 0.06, period: 8 },
    ],
  },

  // About: gradient band, curved at the top (over the hero) and the bottom (over Skills).
  about: {
    gradient: "brand",
    direction: "vertical",
    layers: [
      {
        top: [0, 135, 95, 60, 145, 275, 375],
        bottom: [782, 882, 790, 715, 748, 873, 957],
        opacity: 0.35,
        amplitude: 0.08,
        topAmplitude: 0.3,
        period: 13,
      },
      {
        top: [0, 125, 85, 50, 135, 265, 365],
        bottom: [762, 862, 770, 695, 728, 853, 937],
        opacity: 0.6,
        amplitude: 0.07,
        topAmplitude: 0.3,
        period: 10,
      },
      {
        top: [0, 115, 70, 35, 120, 250, 350],
        bottom: [742, 842, 750, 675, 708, 833, 917],
        opacity: 1,
        amplitude: 0.06,
        topAmplitude: 0.3,
        period: 8,
      },
    ],
  },

  // Experience: solid charcoal band rising over the Skills section.
  experience: {
    gradient: "charcoal",
    direction: "vertical",
    layers: [
      {
        top: [150, 208, 91, 41, 54, 167, 250],
        // Deep overshoot so the fill reaches under the Projects top curve on every width.
        bottom: flat(1000),
        opacity: 1,
        amplitude: 0.05,
        period: 9,
      },
    ],
  },

  // Projects: gradient band hanging into Experience at the top, and curving away at the bottom.
  projects: {
    gradient: "brand",
    direction: "vertical",
    layers: [
      {
        top: [360, 376, 288, 176, 179, 213, -53],
        bottom: [978, 984, 896, 808, 812, 912, 887],
        opacity: 0.35,
        amplitude: 0.08,
        period: 13,
      },
      {
        top: [373, 389, 301, 189, 192, 226, -40],
        bottom: [958, 964, 876, 788, 792, 892, 867],
        opacity: 0.6,
        amplitude: 0.07,
        period: 10,
      },
      {
        top: [385, 401, 313, 201, 204, 238, -28],
        bottom: [938, 944, 856, 768, 772, 872, 847],
        opacity: 1,
        amplitude: 0.06,
        period: 8,
        // Charcoal above the violet edge, matching the Experience section it sits on.
        backdrop: { gradient: "charcoal", edge: -60 },
      },
    ],
  },
} satisfies Record<string, WaveSpec>;
