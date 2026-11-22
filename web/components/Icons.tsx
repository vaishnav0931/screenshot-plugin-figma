import type { SVGProps } from "react";

const base = (p: SVGProps<SVGSVGElement>) => ({
  width: 16,
  height: 16,
  viewBox: "0 0 16 16",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.25,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  ...p
});

export const IconMove = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3.5 2.5l9 4.2-3.9 1.3-1.3 3.9z" fill="currentColor" stroke="none" />
  </svg>
);
export const IconHand = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 8V3.8a.9.9 0 011.8 0V7m0-3.6a.9.9 0 011.8 0V7m0-2.4a.9.9 0 011.8 0V8m0-2.2a.9.9 0 011.8 0v4.2c0 2.2-1.5 3.6-3.6 3.6-1.6 0-2.6-.7-3.5-1.9L3.4 9.6a.9.9 0 011.4-1.1L5.8 9.6" />
  </svg>
);
export const IconFrame = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M5 1.5v13M11 1.5v13M1.5 5h13M1.5 11h13" />
  </svg>
);
export const IconChevron = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M6 4l4 4-4 4" />
  </svg>
);
export const IconDown = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M4 6l4 4 4-4" />
  </svg>
);
export const IconImage = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="2" y="2.5" width="12" height="11" rx="1.5" />
    <circle cx="5.8" cy="6" r="1.1" />
    <path d="M2.5 12l3.5-3.5 2.5 2.5 2-2 3 3" />
  </svg>
);
export const IconRefresh = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M13 8a5 5 0 10-1.6 3.7M13 3v3h-3" />
  </svg>
);
export const IconDownload = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M8 2.5v8M4.8 7.6L8 10.8l3.2-3.2M3 13h10" />
  </svg>
);
export const IconCopy = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <rect x="5.5" y="5.5" width="8" height="8" rx="1.2" />
    <path d="M3.5 10.5H3a1 1 0 01-1-1V3a1 1 0 011-1h6.5a1 1 0 011 1v.5" />
  </svg>
);
export const IconCheck = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3 8.5l3.2 3.2L13 4.8" />
  </svg>
);
export const IconTrash = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M3 4.5h10M6.5 4.5V3h3v1.5M4.5 4.5l.6 8.5h5.8l.6-8.5" />
  </svg>
);
export const IconPlus = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M8 3v10M3 8h10" />
  </svg>
);
export const IconFit = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <path d="M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10" />
  </svg>
);
export const IconGlobe = (p: SVGProps<SVGSVGElement>) => (
  <svg {...base(p)}>
    <circle cx="8" cy="8" r="5.8" />
    <path d="M2.2 8h11.6M8 2.2c1.8 1.8 2.6 3.7 2.6 5.8S9.8 12 8 13.8C6.2 12 5.4 10.1 5.4 8S6.2 4 8 2.2z" />
  </svg>
);
export const IconLogo = (p: SVGProps<SVGSVGElement>) => (
  <svg width="16" height="16" viewBox="0 0 16 16" {...p}>
    <rect x="1.5" y="1.5" width="13" height="13" rx="2.5" fill="#0d99ff" />
    <rect x="4" y="4.5" width="8" height="1.6" rx=".8" fill="#fff" />
    <rect x="4" y="7.6" width="8" height="4" rx=".8" fill="#fff" opacity=".85" />
  </svg>
);
