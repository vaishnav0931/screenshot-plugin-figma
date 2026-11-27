"use client";

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

export interface SilkDesignsCardConfig {
  speed: number;
  foldScale: number;
  relief: number;
  highlight: number;
  glow: number;
  bloom: number;
  grain: number;
  tiltMax: number;
  colorTopLeft: string;
  colorRight: string;
  colorMiddle: string;
  colorTopRight: string;
  paused: boolean;
}

export const DEFAULT_SILK_DESIGNS_CONFIG: SilkDesignsCardConfig = {
  speed: 0.55,
  foldScale: 2.35,
  relief: 1.45,
  highlight: 0.85,
  glow: 0.72,
  bloom: 0.48,
  grain: 0.045,
  tiltMax: 16,
  colorTopLeft: "#ffe03d", // yellow top-left
  colorRight: "#ff2e93", // hot pink on the right
  colorMiddle: "#7b2cbf", // violet in the middle
  colorTopRight: "#a8e6ff", // pale blue top-right
  paused: false,
};

export const SILK_SHUFFLE_PALETTES: ReadonlyArray<
  Pick<
    SilkDesignsCardConfig,
    "colorTopLeft" | "colorRight" | "colorMiddle" | "colorTopRight"
  >
> = [
  {
    colorTopLeft: "#ffe03d",
    colorRight: "#ff2e93",
    colorMiddle: "#7b2cbf",
    colorTopRight: "#a8e6ff",
  },
  {
    colorTopLeft: "#ffd166",
    colorRight: "#ef476f",
    colorMiddle: "#5a189a",
    colorTopRight: "#90e0ef",
  },
  {
    colorTopLeft: "#f9f871",
    colorRight: "#ff4d6d",
    colorMiddle: "#4361ee",
    colorTopRight: "#b8f2e6",
  },
  {
    colorTopLeft: "#ffbe0b",
    colorRight: "#ff006e",
    colorMiddle: "#8338ec",
    colorTopRight: "#a2d2ff",
  },
  {
    colorTopLeft: "#ffe66d",
    colorRight: "#f72585",
    colorMiddle: "#7209b7",
    colorTopRight: "#4cc9f0",
  },
];

export interface SilkDesignsCardHandle {
  replayCountUp: () => void;
  shuffleColors: () => Pick<
    SilkDesignsCardConfig,
    "colorTopLeft" | "colorRight" | "colorMiddle" | "colorTopRight"
  >;
}

export function buildSilkDesignsUsageSnippet(
  config: SilkDesignsCardConfig
): string {
  const props: string[] = [];
  if (config.speed !== DEFAULT_SILK_DESIGNS_CONFIG.speed)
    props.push(`  speed={${config.speed}}`);
  if (config.foldScale !== DEFAULT_SILK_DESIGNS_CONFIG.foldScale)
    props.push(`  foldScale={${config.foldScale}}`);
  if (config.relief !== DEFAULT_SILK_DESIGNS_CONFIG.relief)
    props.push(`  relief={${config.relief}}`);
  if (config.highlight !== DEFAULT_SILK_DESIGNS_CONFIG.highlight)
    props.push(`  highlight={${config.highlight}}`);
  if (config.glow !== DEFAULT_SILK_DESIGNS_CONFIG.glow)
    props.push(`  glow={${config.glow}}`);
  if (config.bloom !== DEFAULT_SILK_DESIGNS_CONFIG.bloom)
    props.push(`  bloom={${config.bloom}}`);
  if (config.grain !== DEFAULT_SILK_DESIGNS_CONFIG.grain)
    props.push(`  grain={${config.grain}}`);
  if (config.tiltMax !== DEFAULT_SILK_DESIGNS_CONFIG.tiltMax)
    props.push(`  tiltMax={${config.tiltMax}}`);
  if (config.colorTopLeft !== DEFAULT_SILK_DESIGNS_CONFIG.colorTopLeft)
    props.push(`  colorTopLeft="${config.colorTopLeft}"`);
  if (config.colorRight !== DEFAULT_SILK_DESIGNS_CONFIG.colorRight)
    props.push(`  colorRight="${config.colorRight}"`);
  if (config.colorMiddle !== DEFAULT_SILK_DESIGNS_CONFIG.colorMiddle)
    props.push(`  colorMiddle="${config.colorMiddle}"`);
  if (config.colorTopRight !== DEFAULT_SILK_DESIGNS_CONFIG.colorTopRight)
    props.push(`  colorTopRight="${config.colorTopRight}"`);
  if (config.paused) props.push(`  paused`);

  if (props.length === 0) {
    return `<SilkDesignsCard />`;
  }
  return `<SilkDesignsCard\n${props.join("\n")}\n/>`;
}

function hexToRgbTuple(hex: string): [number, number, number] {
  const clean = hex.replace("#", "").trim();
  if (clean.length === 3) {
    const r = parseInt(clean[0] + clean[0], 16) / 255;
    const g = parseInt(clean[1] + clean[1], 16) / 255;
    const b = parseInt(clean[2] + clean[2], 16) / 255;
    return [
      Number.isFinite(r) ? r : 1,
      Number.isFinite(g) ? g : 0.8,
      Number.isFinite(b) ? b : 0.2,
    ];
  }
  const num = parseInt(clean.padEnd(6, "0").slice(0, 6), 16);
  if (Number.isNaN(num)) return [1, 0.88, 0.24];
  return [
    ((num >> 16) & 255) / 255,
    ((num >> 8) & 255) / 255,
    (num & 255) / 255,
  ];
}

const VERTEX_SHADER_SOURCE = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER_SOURCE = `
  precision highp float;

  varying vec2 v_uv;

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_pointer;
  uniform float u_hover;
  uniform vec3 u_colTopLeft;
  uniform vec3 u_colRight;
  uniform vec3 u_colMiddle;
  uniform vec3 u_colTopRight;
  uniform float u_foldScale;
  uniform float u_relief;
  uniform float u_highlight;
  uniform float u_glow;
  uniform float u_bloom;
  uniform float u_grain;

  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p + 34.45);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  mat2 rot2(float a) {
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.52;
    mat2 m = rot2(0.55);
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = m * p * 2.03 + vec2(1.7, 9.2);
      a *= 0.5;
    }
    return v;
  }

  float heightField(vec2 uv, float t, out vec2 qOut, out vec2 rOut) {
    // Subtle zoom-in and ripple expansion on pointer enter/leave
    float activeScale = u_foldScale * (1.0 - 0.07 * u_hover);
    vec2 p = (uv - 0.5) * activeScale;
    vec2 flow = vec2(t * 0.24, -t * 0.19);

    vec2 q = vec2(
      fbm(p + flow + vec2(0.0, 0.0)),
      fbm(p + flow + vec2(5.2, 1.3))
    );

    vec2 r = vec2(
      fbm(p + 2.4 * q + vec2(1.7, 9.2) + t * 0.28),
      fbm(p + 2.4 * q + vec2(8.3, 2.8) - t * 0.22)
    );

    qOut = q;
    rOut = r;

    float h = fbm(p + 2.25 * r - flow * 0.6);
    float silkWave = sin((p.x * 2.4 + r.x * 3.6 - t * 0.65)) * (0.14 + 0.04 * u_hover);
    return h + silkWave;
  }

  void main() {
    vec2 uv = v_uv;
    float t = u_time;

    vec2 q;
    vec2 r;
    float h = heightField(uv, t, q, r);

    // Finite-difference surface normals
    float eps = 0.0045;
    vec2 qx;
    vec2 rx;
    vec2 qy;
    vec2 ry;
    float hx = heightField(uv + vec2(eps, 0.0), t, qx, rx);
    float hy = heightField(uv + vec2(0.0, eps), t, qy, ry);

    float dHx = (hx - h) / eps;
    float dHy = (hy - h) / eps;

    // Relief deepens smoothly as pointer enters and relaxes on leave
    float activeRelief = u_relief * (0.92 + 0.24 * u_hover);
    vec3 normal = normalize(vec3(-dHx * 0.22 * activeRelief, -dHy * 0.22 * activeRelief, 1.0));

    // Warped coordinates for color blending
    vec2 wUv = clamp(uv + (r - 0.5) * 0.34 + (q - 0.5) * 0.14, 0.0, 1.0);

    float wTopLeft = pow(clamp((1.0 - wUv.x) * wUv.y, 0.0, 1.0), 0.78);
    float wTopRight = pow(clamp(wUv.x * wUv.y, 0.0, 1.0), 0.85);
    float wRight = pow(clamp(wUv.x * (1.15 - wUv.y * 0.55), 0.0, 1.0), 0.9);
    float distCenter = length(wUv - vec2(0.47, 0.45));
    float wMiddle = smoothstep(0.76, 0.02, distCenter);

    vec3 baseCol = u_colMiddle * (0.45 + 0.85 * wMiddle);
    baseCol = mix(baseCol, u_colTopLeft, clamp(wTopLeft * 1.35, 0.0, 1.0));
    baseCol = mix(baseCol, u_colTopRight, clamp(wTopRight * 1.15, 0.0, 1.0));
    baseCol = mix(baseCol, u_colRight, clamp(wRight * 1.05, 0.0, 1.0));

    // Subtle fold iridescence
    baseCol = mix(baseCol, u_colTopLeft, smoothstep(0.62, 0.98, h) * 0.24);
    baseCol = mix(baseCol, u_colMiddle, smoothstep(0.55, 0.1, h) * 0.28);

    // Pointer-following 3D light
    vec3 fragPos = vec3(uv, h * 0.18 * activeRelief);
    vec3 lightPos = vec3(u_pointer.x, u_pointer.y, mix(0.78, 0.64, u_hover));
    vec3 lightDir = normalize(lightPos - fragPos);
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    vec3 halfDir = normalize(lightDir + viewDir);

    float diff = max(dot(normal, lightDir), 0.0);
    float diffuse = 0.58 + 0.54 * diff;

    // Silk sheen + specular peak boosted smoothly on enter
    float specBroad = pow(max(dot(normal, halfDir), 0.0), 14.0);
    float specSharp = pow(max(dot(normal, halfDir), 0.0), 48.0);
    vec3 specColor = mix(vec3(1.0, 0.98, 0.92), u_colTopRight, 0.3);
    float activeHighlight = u_highlight * (0.85 + 0.35 * u_hover);
    vec3 specular = specColor * (specBroad * 0.34 + specSharp * 0.48) * activeHighlight;

    // Pink rim glow along grazing silk folds
    float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 2.35);
    vec3 rimColor = mix(u_colRight, vec3(1.0, 0.48, 0.82), 0.38);
    float activeGlow = u_glow * (0.88 + 0.32 * u_hover);
    vec3 rimGlow = rimColor * fresnel * 1.25 * activeGlow;

    // Soft inner bloom
    float pointerDist = length(uv - u_pointer);
    float bloomMask = exp(-pointerDist * pointerDist * 3.6) * (0.55 + 0.35 * u_hover) +
                      exp(-distCenter * distCenter * 2.8) * 0.45;
    vec3 bloomCol = mix(u_colTopLeft, u_colRight, 0.45) * bloomMask * 0.55 * u_bloom;

    vec3 color = baseCol * diffuse + specular + rimGlow + bloomCol;

    // Fine film grain
    float grainVal = (hash(gl_FragCoord.xy + fract(t * 17.3) * 100.0) - 0.5) * u_grain;
    color += grainVal;

    color = clamp(color, 0.0, 1.0);
    gl_FragColor = vec4(color, 1.0);
  }
`;

export interface SilkDesignsCardProps extends Partial<SilkDesignsCardConfig> {
  /** Whether to render the standalone floating control panel when used outside PlaygroundWorkspace */
  showControls?: boolean;
  /** Optional config object override */
  config?: Partial<SilkDesignsCardConfig>;
  /** Optional callback when internal config updates */
  onConfigChange?: (next: SilkDesignsCardConfig) => void;
  /** If true, renders just the 300x300 card without the full-viewport centering wrapper */
  cardOnly?: boolean;
}

export const SilkDesignsCard = forwardRef<
  SilkDesignsCardHandle,
  SilkDesignsCardProps
>(function SilkDesignsCard(
  {
    showControls = false,
    config: externalConfig,
    onConfigChange,
    cardOnly = true,
    speed,
    foldScale,
    relief,
    highlight,
    glow,
    bloom,
    grain,
    tiltMax,
    colorTopLeft,
    colorRight,
    colorMiddle,
    colorTopRight,
    paused,
  },
  ref
) {
  const uid = useId();
  const [internalConfig, setInternalConfig] = useState<SilkDesignsCardConfig>(
    () => ({
      ...DEFAULT_SILK_DESIGNS_CONFIG,
      ...externalConfig,
    })
  );

  const directPropOverrides = useMemo(() => {
    const out: Partial<SilkDesignsCardConfig> = {};
    if (speed !== undefined) out.speed = speed;
    if (foldScale !== undefined) out.foldScale = foldScale;
    if (relief !== undefined) out.relief = relief;
    if (highlight !== undefined) out.highlight = highlight;
    if (glow !== undefined) out.glow = glow;
    if (bloom !== undefined) out.bloom = bloom;
    if (grain !== undefined) out.grain = grain;
    if (tiltMax !== undefined) out.tiltMax = tiltMax;
    if (colorTopLeft !== undefined) out.colorTopLeft = colorTopLeft;
    if (colorRight !== undefined) out.colorRight = colorRight;
    if (colorMiddle !== undefined) out.colorMiddle = colorMiddle;
    if (colorTopRight !== undefined) out.colorTopRight = colorTopRight;
    if (paused !== undefined) out.paused = paused;
    return out;
  }, [
    speed,
    foldScale,
    relief,
    highlight,
    glow,
    bloom,
    grain,
    tiltMax,
    colorTopLeft,
    colorRight,
    colorMiddle,
    colorTopRight,
    paused,
  ]);

  const cfg: SilkDesignsCardConfig = useMemo(
    () => ({
      ...internalConfig,
      ...externalConfig,
      ...directPropOverrides,
    }),
    [internalConfig, externalConfig, directPropOverrides]
  );

  const updateConfig = useCallback(
    (patch: Partial<SilkDesignsCardConfig>) => {
      setInternalConfig((prev) => {
        const next = {
          ...prev,
          ...externalConfig,
          ...directPropOverrides,
          ...patch,
        };
        onConfigChange?.(next);
        return next;
      });
    },
    [externalConfig, directPropOverrides, onConfigChange]
  );

  const [panelOpen, setPanelOpen] = useState(true);
  const [webglAvailable, setWebglAvailable] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [interactionPhase, setInteractionPhase] = useState<
    "idle" | "entering" | "tracking" | "leaving"
  >("idle");
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({
    rx: 0,
    ry: 0,
  });
  const [tagsCount, setTagsCount] = useState(4);
  const [shotsCount, setShotsCount] = useState(1012);
  const [countRunKey, setCountRunKey] = useState(0);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const enterTimerRef = useRef<number | null>(null);
  const leaveTimerRef = useRef<number | null>(null);
  const pointerTargetRef = useRef<{ x: number; y: number }>({
    x: 0.35,
    y: 0.72,
  });
  const pointerCurrentRef = useRef<{ x: number; y: number }>({
    x: 0.35,
    y: 0.72,
  });
  const hoverTargetRef = useRef(0);
  const hoverCurrentRef = useRef(0);
  const configRef = useRef<SilkDesignsCardConfig>(cfg);
  configRef.current = cfg;

  const reducedMotionRef = useRef(reducedMotion);
  reducedMotionRef.current = reducedMotion;

  useEffect(() => {
    return () => {
      if (enterTimerRef.current) window.clearTimeout(enterTimerRef.current);
      if (leaveTimerRef.current) window.clearTimeout(leaveTimerRef.current);
    };
  }, []);

  const handleShuffleColors = useCallback(() => {
    const randomPick =
      SILK_SHUFFLE_PALETTES[
        Math.floor(Math.random() * SILK_SHUFFLE_PALETTES.length)
      ];
    let nextColors = randomPick;
    if (randomPick.colorTopLeft === cfg.colorTopLeft) {
      const randHex = () =>
        "#" +
        Math.floor(Math.random() * 0xffffff)
          .toString(16)
          .padStart(6, "0");
      nextColors = {
        colorTopLeft: randHex(),
        colorRight: randHex(),
        colorMiddle: randHex(),
        colorTopRight: randHex(),
      };
    }
    updateConfig(nextColors);
    return nextColors;
  }, [cfg.colorTopLeft, updateConfig]);

  useImperativeHandle(
    ref,
    () => ({
      replayCountUp: () => setCountRunKey((k) => k + 1),
      shuffleColors: handleShuffleColors,
    }),
    [handleShuffleColors]
  );

  // Detect prefers-reduced-motion
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Count-up numbers once on load (unless prefers-reduced-motion)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (mq?.matches) {
      setTagsCount(4);
      setShotsCount(1012);
      return;
    }

    setTagsCount(0);
    setShotsCount(0);
    const duration = 1150;
    const start = performance.now();
    let rafId = 0;

    const step = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setTagsCount(Math.round(eased * 4));
      setShotsCount(Math.round(eased * 1012));
      if (t < 1) {
        rafId = requestAnimationFrame(step);
      }
    };

    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [countRunKey]);

  // WebGL setup & render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl", {
        alpha: false,
        antialias: true,
        preserveDrawingBuffer: true,
      }) ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);

    if (!gl) {
      setWebglAvailable(false);
      return;
    }

    const compileShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
    const fs = compileShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
    if (!vs || !fs) {
      setWebglAvailable(false);
      return;
    }

    const program = gl.createProgram();
    if (!program) {
      setWebglAvailable(false);
      return;
    }
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      setWebglAvailable(false);
      return;
    }

    gl.useProgram(program);

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(280 * dpr);
    const height = Math.round(220 * dpr);
    canvas.width = width;
    canvas.height = height;
    gl.viewport(0, 0, width, height);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, "u_time");
    const uRes = gl.getUniformLocation(program, "u_resolution");
    const uPointer = gl.getUniformLocation(program, "u_pointer");
    const uHover = gl.getUniformLocation(program, "u_hover");
    const uColTopLeft = gl.getUniformLocation(program, "u_colTopLeft");
    const uColRight = gl.getUniformLocation(program, "u_colRight");
    const uColMiddle = gl.getUniformLocation(program, "u_colMiddle");
    const uColTopRight = gl.getUniformLocation(program, "u_colTopRight");
    const uFoldScale = gl.getUniformLocation(program, "u_foldScale");
    const uRelief = gl.getUniformLocation(program, "u_relief");
    const uHighlight = gl.getUniformLocation(program, "u_highlight");
    const uGlow = gl.getUniformLocation(program, "u_glow");
    const uBloom = gl.getUniformLocation(program, "u_bloom");
    const uGrain = gl.getUniformLocation(program, "u_grain");

    let rafId = 0;
    let simTime = 1.85;
    let lastTs = performance.now();

    const renderFrame = (now: number) => {
      const dt = Math.min(0.05, (now - lastTs) / 1000);
      lastTs = now;

      const currentCfg = configRef.current;
      const isReduced = reducedMotionRef.current;

      // Smoothly interpolate hover enter/leave progress (0 -> 1 on enter, 1 -> 0 on leave)
      const hoverLerp = hoverTargetRef.current > hoverCurrentRef.current ? 0.1 : 0.07;
      hoverCurrentRef.current +=
        (hoverTargetRef.current - hoverCurrentRef.current) * hoverLerp;

      if (!currentCfg.paused && !isReduced) {
        // Gentle velocity boost while hovered/entering
        const hoverSpeedMult = 1 + hoverCurrentRef.current * 0.25;
        simTime += dt * currentCfg.speed * hoverSpeedMult;
      }

      pointerCurrentRef.current.x +=
        (pointerTargetRef.current.x - pointerCurrentRef.current.x) * 0.11;
      pointerCurrentRef.current.y +=
        (pointerTargetRef.current.y - pointerCurrentRef.current.y) * 0.11;

      const cTL = hexToRgbTuple(currentCfg.colorTopLeft);
      const cR = hexToRgbTuple(currentCfg.colorRight);
      const cM = hexToRgbTuple(currentCfg.colorMiddle);
      const cTR = hexToRgbTuple(currentCfg.colorTopRight);

      gl.uniform1f(uTime, simTime);
      gl.uniform2f(uRes, width, height);
      gl.uniform2f(
        uPointer,
        pointerCurrentRef.current.x,
        pointerCurrentRef.current.y
      );
      gl.uniform1f(uHover, hoverCurrentRef.current);
      gl.uniform3f(uColTopLeft, cTL[0], cTL[1], cTL[2]);
      gl.uniform3f(uColRight, cR[0], cR[1], cR[2]);
      gl.uniform3f(uColMiddle, cM[0], cM[1], cM[2]);
      gl.uniform3f(uColTopRight, cTR[0], cTR[1], cTR[2]);
      gl.uniform1f(uFoldScale, currentCfg.foldScale);
      gl.uniform1f(uRelief, currentCfg.relief);
      gl.uniform1f(uHighlight, currentCfg.highlight);
      gl.uniform1f(uGlow, currentCfg.glow);
      gl.uniform1f(uBloom, currentCfg.bloom);
      gl.uniform1f(uGrain, currentCfg.grain);

      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!isReduced) {
        rafId = requestAnimationFrame(renderFrame);
      }
    };

    rafId = requestAnimationFrame(renderFrame);

    return () => {
      cancelAnimationFrame(rafId);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }, [reducedMotion, cfg]);

  const handlePointerEnter = useCallback(
    (e?: React.PointerEvent<HTMLDivElement>) => {
      if (leaveTimerRef.current) {
        window.clearTimeout(leaveTimerRef.current);
        leaveTimerRef.current = null;
      }
      if (enterTimerRef.current) {
        window.clearTimeout(enterTimerRef.current);
      }

      setIsHovered(true);
      hoverTargetRef.current = 1;
      setInteractionPhase("entering");

      if (e && cardRef.current && !reducedMotion) {
        const rect = cardRef.current.getBoundingClientRect();
        const nx = Math.min(
          1,
          Math.max(0, (e.clientX - rect.left) / rect.width)
        );
        const ny = Math.min(
          1,
          Math.max(0, (e.clientY - rect.top) / rect.height)
        );
        pointerTargetRef.current = {
          x: nx,
          y: Math.min(1, Math.max(0, 1 - ny / 0.72)),
        };
        const maxDeg = cfg.tiltMax;
        setTilt({
          rx: (0.5 - ny) * 2 * maxDeg,
          ry: (nx - 0.5) * 2 * maxDeg,
        });
      }

      // After the 260ms entry transition completes, switch to snappy pointer tracking
      enterTimerRef.current = window.setTimeout(() => {
        setInteractionPhase("tracking");
        enterTimerRef.current = null;
      }, 260);
    },
    [cfg.tiltMax, reducedMotion]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
      const ny = Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height));

      pointerTargetRef.current = {
        x: nx,
        y: Math.min(1, Math.max(0, 1 - ny / 0.72)),
      };

      if (reducedMotion) {
        setTilt({ rx: 0, ry: 0 });
        return;
      }

      const maxDeg = cfg.tiltMax;
      const ry = (nx - 0.5) * 2 * maxDeg;
      const rx = (0.5 - ny) * 2 * maxDeg;
      setTilt({ rx, ry });
    },
    [cfg.tiltMax, reducedMotion]
  );

  const handlePointerLeave = useCallback(() => {
    if (enterTimerRef.current) {
      window.clearTimeout(enterTimerRef.current);
      enterTimerRef.current = null;
    }
    if (leaveTimerRef.current) {
      window.clearTimeout(leaveTimerRef.current);
    }

    setIsHovered(false);
    hoverTargetRef.current = 0;
    setInteractionPhase("leaving");
    setTilt({ rx: 0, ry: 0 });
    pointerTargetRef.current = { x: 0.35, y: 0.72 };

    leaveTimerRef.current = window.setTimeout(() => {
      setInteractionPhase("idle");
      leaveTimerRef.current = null;
    }, 620);
  }, []);

  const handleCardKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (reducedMotion) return;
      const step = Math.max(4, cfg.tiltMax * 0.5);
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setTilt((prev) => ({
          ...prev,
          ry: Math.max(-cfg.tiltMax, prev.ry - step),
        }));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setTilt((prev) => ({
          ...prev,
          ry: Math.min(cfg.tiltMax, prev.ry + step),
        }));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setTilt((prev) => ({
          ...prev,
          rx: Math.min(cfg.tiltMax, prev.rx + step),
        }));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setTilt((prev) => ({
          ...prev,
          rx: Math.max(-cfg.tiltMax, prev.rx - step),
        }));
      } else if (e.key === "Escape" || e.key === " ") {
        setTilt({ rx: 0, ry: 0 });
      }
    },
    [cfg.tiltMax, reducedMotion]
  );

  const handleReset = useCallback(() => {
    updateConfig(DEFAULT_SILK_DESIGNS_CONFIG);
  }, [updateConfig]);

  const formattedTags = String(tagsCount).padStart(2, "0");
  const liftY = !reducedMotion && isHovered ? -6 : 0;
  const cardScale = !reducedMotion && isHovered ? 1.018 : 1;

  // Phase-aware CSS transition curve:
  // - entering: smooth spring ease-out into pointer tilt & lift
  // - tracking: responsive low-latency follow while moving inside card
  // - leaving / idle: graceful spring return back to rest (0deg, 0px)
  const cardTransition = reducedMotion
    ? "none"
    : interactionPhase === "entering"
    ? "transform 260ms cubic-bezier(0.22, 1, 0.36, 1), background-color 260ms ease"
    : interactionPhase === "tracking"
    ? "transform 95ms cubic-bezier(0.2, 0.85, 0.35, 1), background-color 260ms ease"
    : "transform 600ms cubic-bezier(0.16, 1, 0.3, 1), background-color 420ms ease";

  const fallbackGradient = `radial-gradient(circle at 14% 14%, ${cfg.colorTopLeft} 0%, transparent 55%), radial-gradient(circle at 88% 16%, ${cfg.colorTopRight} 0%, transparent 52%), radial-gradient(circle at 90% 72%, ${cfg.colorRight} 0%, transparent 58%), linear-gradient(135deg, ${cfg.colorTopLeft} 0%, ${cfg.colorMiddle} 52%, ${cfg.colorRight} 100%)`;

  const cardElement = (
    <div className="sdc-entry-mount">
      <div
        ref={cardRef}
        role="region"
        aria-label="Designs interactive card — Web & App Designs, 04 Tags, 1012 Shots"
        tabIndex={0}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onFocus={() => handlePointerEnter()}
        onBlur={handlePointerLeave}
        onKeyDown={handleCardKeyDown}
        data-hovered={isHovered ? "true" : "false"}
        data-phase={interactionPhase}
        className="sdc-card-outer"
        style={{
          transition: cardTransition,
          transform: reducedMotion
            ? "none"
            : `perspective(900px) translateY(${liftY}px) scale(${cardScale}) rotateX(${tilt.rx.toFixed(
                2
              )}deg) rotateY(${tilt.ry.toFixed(2)}deg)`,
        }}
      >
        <div className="sdc-card-inner">
          <div
            className="sdc-shader-wrap"
            style={{ background: fallbackGradient }}
          >
            {webglAvailable && (
              <canvas
                ref={canvasRef}
                className="sdc-canvas"
                aria-hidden="true"
              />
            )}
          </div>

          <svg
            className="sdc-panel-svg"
            viewBox="0 0 280 280"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              className="sdc-panel-path"
              d="
                M 0 156
                Q 0 138 18 138
                L 124 138
                C 150 138, 156 184, 184 184
                L 262 184
                Q 280 184 280 202
                L 280 280
                L 0 280
                Z
              "
              fill="#fffff4"
            />
          </svg>

          <div className="sdc-content-layer">
            <div className="sdc-tab-header">
              <h2 className="sdc-title">Designs</h2>
              <p className="sdc-subtitle">Web &amp; App Designs</p>
            </div>

            <div className="sdc-bottom-row">
              <div className="sdc-tags-group">
                <span className="sdc-tags-num">{formattedTags}</span>
                <span className="sdc-tags-label">Tags</span>
              </div>
              <div className="sdc-shots-label">{shotsCount} Shots</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Helper for standalone floating studio-styled slider
  const renderStudioSlider = (
    id: string,
    label: string,
    val: number,
    min: number,
    max: number,
    step: number,
    display: string,
    onChange: (n: number) => void
  ) => {
    const clamped = Math.min(max, Math.max(min, val));
    const pct = max > min ? ((clamped - min) / (max - min)) * 100 : 0;
    return (
      <div className="sdc-field">
        <div className="sdc-field-top">
          <label htmlFor={id} className="sdc-field-label">
            {label}
          </label>
          <span className="sdc-field-val">{display}</span>
        </div>
        <div className="sdc-slider-track-wrap">
          <div className="sdc-slider-track">
            <div className="sdc-slider-fill" style={{ width: `${pct}%` }} />
            <div className="sdc-slider-thumb" style={{ left: `${pct}%` }} />
          </div>
          <input
            id={id}
            type="range"
            className="sdc-range-overlay"
            min={min}
            max={max}
            step={step}
            value={val}
            onChange={(e) => onChange(parseFloat(e.target.value))}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <style>{`
        .sdc-stage {
          --sdc-panel-bg: #111115;
          --sdc-panel-border: #24242b;
          --sdc-panel-text: #f4f4f5;
          --sdc-panel-label: #c2c2c8;
          --sdc-panel-muted: #9a9aa6;
          --sdc-panel-input-bg: #24242a;
          --sdc-panel-input-border: #32323c;
          --sdc-panel-accent: #3b82f6;
          --sdc-focus-ring: #3b82f6;
          background: transparent;
          box-sizing: border-box;
          font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }

        @media (prefers-color-scheme: light) {
          .sdc-stage[data-theme="auto"] {
            --sdc-panel-bg: #f8f8fa;
            --sdc-panel-border: #dcdce2;
            --sdc-panel-text: #18181b;
            --sdc-panel-label: #3f3f46;
            --sdc-panel-muted: #71717a;
            --sdc-panel-input-bg: #ffffff;
            --sdc-panel-input-border: #d4d4d8;
            --sdc-panel-accent: #2563eb;
            --sdc-focus-ring: #2563eb;
          }
        }

        .sdc-viewport {
          min-height: 100vh;
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: transparent;
          box-sizing: border-box;
          position: relative;
        }

        @keyframes sdcCardMountIn {
          0% {
            opacity: 0;
            transform: translateY(14px) scale(0.96);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .sdc-entry-mount {
          animation: sdcCardMountIn 540ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .sdc-card-outer {
          width: 300px;
          height: 300px;
          padding: 10px;
          border-radius: 36px;
          background-color: #dedfd3;
          box-sizing: border-box;
          box-shadow: none;
          will-change: transform;
          cursor: pointer;
          user-select: none;
          outline: none;
          position: relative;
          flex-shrink: 0;
        }

        .sdc-card-outer[data-hovered="true"] {
          background-color: #e6e7dc;
        }

        .sdc-card-outer:focus-visible {
          outline: 3px solid var(--sdc-focus-ring, #3b82f6);
          outline-offset: 4px;
        }

        .sdc-card-inner {
          width: 100%;
          height: 100%;
          border-radius: 26px;
          overflow: hidden;
          position: relative;
          background-color: #fffff4;
          box-shadow: none;
        }

        .sdc-shader-wrap {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 74%;
          overflow: hidden;
          transform: scale(1);
          transition: transform 480ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sdc-card-outer[data-hovered="true"] .sdc-shader-wrap {
          transform: scale(1.035);
          transition: transform 340ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sdc-canvas {
          width: 100%;
          height: 100%;
          display: block;
        }

        .sdc-panel-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          display: block;
          transform: translateY(0);
          transition: transform 460ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sdc-card-outer[data-hovered="true"] .sdc-panel-svg {
          transform: translateY(-2px);
          transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sdc-content-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 18px 20px 18px 20px;
          box-sizing: border-box;
        }

        .sdc-tab-header {
          position: absolute;
          top: 152px;
          left: 20px;
          display: flex;
          flex-direction: column;
          gap: 3px;
          transform: translateY(0);
          transition: transform 460ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sdc-card-outer[data-hovered="true"] .sdc-tab-header {
          transform: translateY(-3px);
          transition: transform 280ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sdc-title {
          margin: 0;
          font-size: 17px;
          font-weight: 600;
          line-height: 1.15;
          letter-spacing: -0.02em;
          color: #161616;
          transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1), color 240ms ease;
        }

        .sdc-subtitle {
          margin: 0;
          font-size: 11.5px;
          font-weight: 500;
          line-height: 1.25;
          color: #82827c;
          letter-spacing: -0.01em;
          transition: color 260ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sdc-card-outer[data-hovered="true"] .sdc-subtitle {
          color: #5e5e58;
        }

        .sdc-bottom-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          width: 100%;
          margin-top: auto;
          padding-top: 8px;
          transform: translateY(0);
          transition: transform 480ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sdc-card-outer[data-hovered="true"] .sdc-bottom-row {
          transform: translateY(-2px);
          transition: transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sdc-tags-group {
          display: inline-flex;
          align-items: baseline;
          gap: 7px;
        }

        .sdc-tags-num {
          font-size: 38px;
          font-weight: 800;
          line-height: 0.95;
          letter-spacing: -0.04em;
          color: #141413;
          font-variant-numeric: tabular-nums;
          display: inline-block;
          transform: scale(1);
          transform-origin: left baseline;
          transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .sdc-card-outer[data-hovered="true"] .sdc-tags-num {
          transform: scale(1.045);
          transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sdc-tags-label {
          font-size: 12.5px;
          font-weight: 600;
          color: #575752;
        }

        .sdc-shots-label {
          font-size: 12.5px;
          font-weight: 600;
          color: #767670;
          font-variant-numeric: tabular-nums;
          transition: color 240ms ease, transform 320ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sdc-card-outer[data-hovered="true"] .sdc-shots-label {
          color: #3f3f3a;
          transform: translateX(-2px);
        }

        @media (prefers-reduced-motion: reduce) {
          .sdc-entry-mount {
            animation: none;
          }
          .sdc-shader-wrap,
          .sdc-panel-svg,
          .sdc-tab-header,
          .sdc-bottom-row,
          .sdc-tags-num,
          .sdc-shots-label {
            transition: none !important;
            transform: none !important;
          }
        }

        /* Studio-styled Floating Control Panel */
        .sdc-controls {
          position: fixed;
          top: 16px;
          right: 16px;
          z-index: 40;
          width: 310px;
          max-height: calc(100vh - 32px);
          background-color: var(--sdc-panel-bg);
          border: 1px solid var(--sdc-panel-border);
          border-radius: 12px;
          color: var(--sdc-panel-text);
          box-shadow: none;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-sizing: border-box;
        }

        @media (max-width: 640px) {
          .sdc-controls {
            top: auto;
            right: 0;
            left: 0;
            bottom: 0;
            width: 100%;
            max-height: 58vh;
            border-radius: 16px 16px 0 0;
            border-bottom: none;
          }
        }

        .sdc-controls-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 14px;
          border-bottom: 1px solid var(--sdc-panel-border);
        }

        .sdc-controls-title {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: -0.01em;
        }

        .sdc-toggle-btn {
          appearance: none;
          background: var(--sdc-panel-input-bg);
          color: var(--sdc-panel-text);
          border: 1px solid var(--sdc-panel-input-border);
          border-radius: 6px;
          padding: 4px 10px;
          font-size: 11.5px;
          font-weight: 500;
          cursor: pointer;
        }

        .sdc-controls-body {
          padding: 12px 14px 14px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .sdc-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .sdc-field-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
        }

        .sdc-field-label {
          font-weight: 500;
          color: var(--sdc-panel-label);
        }

        .sdc-field-val {
          font-variant-numeric: tabular-nums;
          color: var(--sdc-panel-muted);
          font-size: 11.5px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
        }

        .sdc-slider-track-wrap {
          position: relative;
          height: 18px;
          display: flex;
          align-items: center;
        }

        .sdc-slider-track {
          position: relative;
          width: 100%;
          height: 2px;
          border-radius: 9999px;
          background-color: var(--sdc-panel-input-border);
        }

        .sdc-slider-fill {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          border-radius: 9999px;
          background-color: var(--sdc-panel-accent);
        }

        .sdc-slider-thumb {
          position: absolute;
          top: 50%;
          width: 10px;
          height: 13px;
          border-radius: 3px;
          background-color: var(--sdc-panel-text);
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .sdc-range-overlay {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: ew-resize;
          margin: 0;
        }

        .sdc-color-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
        }

        .sdc-color-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          background-color: var(--sdc-panel-input-bg);
          border: 1px solid var(--sdc-panel-input-border);
          border-radius: 6px;
          padding: 3px 7px 3px 4px;
        }

        .sdc-color-swatch {
          width: 18px;
          height: 18px;
          padding: 0;
          border: none;
          border-radius: 4px;
          background: transparent;
          cursor: pointer;
        }

        .sdc-color-hex {
          width: 58px;
          background: transparent;
          border: none;
          color: var(--sdc-panel-text);
          font-size: 11.5px;
          font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
          outline: none;
        }

        .sdc-pause-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 12px;
          font-weight: 500;
          color: var(--sdc-panel-label);
          padding-top: 2px;
          cursor: pointer;
        }

        .sdc-checkbox {
          width: 16px;
          height: 16px;
          accent-color: var(--sdc-panel-accent);
          cursor: pointer;
        }

        .sdc-actions-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          padding-top: 4px;
        }

        .sdc-btn {
          appearance: none;
          background: var(--sdc-panel-input-bg);
          color: var(--sdc-panel-text);
          border: 1px solid var(--sdc-panel-input-border);
          border-radius: 6px;
          height: 30px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
        }

        .sdc-btn:hover,
        .sdc-toggle-btn:hover {
          border-color: var(--sdc-panel-accent);
        }
      `}</style>

      <div className="sdc-stage">
        {cardOnly ? (
          cardElement
        ) : (
          <div className="sdc-viewport">{cardElement}</div>
        )}

        {showControls && (
          <aside
            className="sdc-controls"
            aria-label="Silk Designs Card Controls"
          >
            <div className="sdc-controls-header">
              <span className="sdc-controls-title">Silk Designs Card</span>
              <button
                type="button"
                className="sdc-toggle-btn"
                aria-expanded={panelOpen}
                aria-controls={`${uid}-panel-body`}
                onClick={() => setPanelOpen((v) => !v)}
              >
                {panelOpen ? "Hide" : "Show"}
              </button>
            </div>

            {panelOpen && (
              <div id={`${uid}-panel-body`} className="sdc-controls-body">
                {renderStudioSlider(
                  `${uid}-speed`,
                  "Speed",
                  cfg.speed,
                  0,
                  2,
                  0.05,
                  `${cfg.speed.toFixed(2)}x`,
                  (speedVal) => updateConfig({ speed: speedVal })
                )}
                {renderStudioSlider(
                  `${uid}-fold`,
                  "Fold size",
                  cfg.foldScale,
                  0.8,
                  5,
                  0.05,
                  cfg.foldScale.toFixed(2),
                  (foldVal) => updateConfig({ foldScale: foldVal })
                )}
                {renderStudioSlider(
                  `${uid}-relief`,
                  "3D relief",
                  cfg.relief,
                  0,
                  3,
                  0.05,
                  cfg.relief.toFixed(2),
                  (reliefVal) => updateConfig({ relief: reliefVal })
                )}
                {renderStudioSlider(
                  `${uid}-highlight`,
                  "Highlights",
                  cfg.highlight,
                  0,
                  2,
                  0.05,
                  cfg.highlight.toFixed(2),
                  (hlVal) => updateConfig({ highlight: hlVal })
                )}
                {renderStudioSlider(
                  `${uid}-glow`,
                  "Rim glow",
                  cfg.glow,
                  0,
                  2,
                  0.05,
                  cfg.glow.toFixed(2),
                  (glowVal) => updateConfig({ glow: glowVal })
                )}
                {renderStudioSlider(
                  `${uid}-bloom`,
                  "Inner bloom",
                  cfg.bloom,
                  0,
                  2,
                  0.05,
                  cfg.bloom.toFixed(2),
                  (bloomVal) => updateConfig({ bloom: bloomVal })
                )}
                {renderStudioSlider(
                  `${uid}-grain`,
                  "Film grain",
                  cfg.grain,
                  0,
                  0.2,
                  0.005,
                  cfg.grain.toFixed(3),
                  (grainVal) => updateConfig({ grain: grainVal })
                )}
                {renderStudioSlider(
                  `${uid}-tilt`,
                  "3D tilt",
                  cfg.tiltMax,
                  0,
                  28,
                  1,
                  `${cfg.tiltMax}°`,
                  (tiltVal) => updateConfig({ tiltMax: tiltVal })
                )}

                {/* Studio Color Rows */}
                {(
                  [
                    {
                      key: "colorTopLeft",
                      label: "Top-left (Yellow)",
                      val: cfg.colorTopLeft,
                    },
                    {
                      key: "colorTopRight",
                      label: "Top-right (Pale blue)",
                      val: cfg.colorTopRight,
                    },
                    {
                      key: "colorMiddle",
                      label: "Middle (Violet)",
                      val: cfg.colorMiddle,
                    },
                    {
                      key: "colorRight",
                      label: "Right (Hot pink)",
                      val: cfg.colorRight,
                    },
                  ] as const
                ).map((item) => (
                  <div key={item.key} className="sdc-color-row">
                    <span className="sdc-field-label">{item.label}</span>
                    <div className="sdc-color-pill">
                      <input
                        type="color"
                        className="sdc-color-swatch"
                        value={item.val}
                        onChange={(e) =>
                          updateConfig({ [item.key]: e.target.value })
                        }
                        aria-label={item.label}
                      />
                      <input
                        type="text"
                        className="sdc-color-hex"
                        maxLength={7}
                        value={item.val}
                        onChange={(e) =>
                          updateConfig({ [item.key]: e.target.value })
                        }
                        aria-label={`${item.label} hex`}
                      />
                    </div>
                  </div>
                ))}

                <label className="sdc-pause-row">
                  <span>Pause shader</span>
                  <input
                    type="checkbox"
                    className="sdc-checkbox"
                    checked={cfg.paused}
                    onChange={(e) =>
                      updateConfig({ paused: e.target.checked })
                    }
                  />
                </label>

                <div className="sdc-actions-row">
                  <button
                    type="button"
                    className="sdc-btn"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="sdc-btn"
                    onClick={handleShuffleColors}
                  >
                    Shuffle colors
                  </button>
                </div>
              </div>
            )}
          </aside>
        )}
      </div>
    </>
  );
});

export default SilkDesignsCard;
