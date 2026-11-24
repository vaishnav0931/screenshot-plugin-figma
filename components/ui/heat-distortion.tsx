"use client";

import * as React from "react";

export type HeatDistortionMode = "text" | "image";
export type HeatDistortionImageFit = "contain" | "cover";

export interface HeatDistortionConfig {
  /** Render source mode: crisp typography or uploaded/external image */
  mode: HeatDistortionMode;
  /** How an image fits inside the square source texture */
  imageFit: HeatDistortionImageFit;
  /** Scale multiplier applied to the drawn image (0.2 - 2) */
  imageScale: number;
  /** Multiline source text when `mode === "text"` */
  text: string;
  /** CSS font-family stack used on the offscreen 2D canvas */
  fontFamily: string;
  /** Font weight ("300" | "400" | "600" | "800") */
  fontWeight: string;
  /** Foreground text hex color */
  textColor: string;
  /** Canvas background hex color */
  backgroundColor: string;
  /** Base font size (20 - 200) */
  fontSize: number;
  /** Letter spacing adjustment (-5 - 30) */
  letterSpacing: number;
  /** Multiplier for text line height (0.8 - 2) */
  lineHeight: number;
  /** Overall displacement strength (0 - 4) */
  strength: number;
  /** Time speed multiplier (0 - 4) */
  speed: number;
  /** Vertical shimmer wave frequency (2 - 120) */
  frequency: number;
  /** Value-noise turbulence depth (0 - 2) */
  turbulence: number;
  /** Horizontal RGB chromatic aberration split (0 - 0.01) */
  chromaticAberration: number;
  /** Heat mask gradient angle in degrees (0 - 360) */
  maskAngle: number;
  /** Heat mask threshold midpoint (0 - 1) */
  maskPosition: number;
  /** Heat mask edge softness (0.02 - 0.8) */
  maskSoftness: number;
  /** Noise patchiness modulating the heat mask (0 - 1) */
  patchiness: number;
  /** Enable interactive localized pointer heat boost */
  mouseHeat: boolean;
}

export interface HeatDistortionProps extends Partial<HeatDistortionConfig> {
  /** Image URL or object URL rendered when `mode === "image"` */
  imageSrc?: string | null;
  /** Pause shader time advancement while keeping live uniform/source updates */
  paused?: boolean;
  /** Internal offscreen texture resolution in pixels (default: 1024) */
  resolution?: number;
  className?: string;
  style?: React.CSSProperties;
  ariaLabel?: string;
}

export interface HeatDistortionHandle {
  canvas: HTMLCanvasElement | null;
  exportPngBlob: () => Promise<Blob | null>;
  downloadPng: (filename?: string) => Promise<void>;
}

export const HEAT_DISTORTION_FONTS: ReadonlyArray<{
  label: string;
  value: string;
}> = [
  { label: "Helvetica", value: "Helvetica Neue, Helvetica, Arial, sans-serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Courier", value: "Courier New, monospace" },
  { label: "Impact", value: "Impact, Haettenschweiler, sans-serif" },
  { label: "System", value: "system-ui, sans-serif" }
];

export const DEFAULT_HEAT_DISTORTION_CONFIG: HeatDistortionConfig = {
  mode: "text",
  imageFit: "contain",
  imageScale: 1,
  text: "Building Fast Planes. Fast.",
  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
  fontWeight: "400",
  textColor: "#3a3a3a",
  backgroundColor: "#dcdcdc",
  fontSize: 64,
  letterSpacing: 0,
  lineHeight: 1.2,
  strength: 1.3,
  speed: 1,
  frequency: 40,
  turbulence: 0.8,
  chromaticAberration: 0,
  maskAngle: 0,
  maskPosition: 0.4,
  maskSoftness: 0.35,
  patchiness: 0.8,
  mouseHeat: true
};

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_pos;
varying vec2 vUv;
void main() {
  vUv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
precision highp float;
varying vec2 vUv;
uniform sampler2D u_tex;
uniform float u_t, u_str, u_freq, u_turb, u_ca, u_mang, u_mpos, u_msoft, u_patch, u_mon;
uniform vec2 u_mouse;

float h(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float vn(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(h(i), h(i + vec2(1.0, 0.0)), f.x),
    mix(h(i + vec2(0.0, 1.0)), h(i + vec2(1.0, 1.0)), f.x),
    f.y
  );
}

void main() {
  vec2 uv = vUv;
  float t = u_t;
  float a = radians(u_mang);
  float proj = dot(uv - 0.5, vec2(cos(a), sin(a))) + 0.5;
  float m = smoothstep(u_mpos - u_msoft, u_mpos + u_msoft, proj);
  m *= mix(1.0, vn(uv * vec2(5.0, 9.0) + vec2(t * 0.3, -t * 0.2)) * 1.7, u_patch);
  m += u_mon * exp(-length(uv - u_mouse) * 6.0) * 1.5;

  float wave = sin(uv.y * u_freq - t * 3.0 + vn(uv * 4.0 + t * 0.2) * 6.0);
  float nz = vn(uv * vec2(3.0, u_freq * 0.35) + vec2(t * 0.5, -t)) - 0.5;
  vec2 off = vec2(
    wave * 0.35 + nz * 2.0 * u_turb,
    (vn(uv * vec2(u_freq * 0.3, 4.0) + t * 0.4) - 0.5) * 1.2
  ) * 0.02 * u_str * m;

  vec2 ca = vec2(u_ca * m, 0.0);
  gl_FragColor = vec4(
    texture2D(u_tex, uv + off + ca).r,
    texture2D(u_tex, uv + off).g,
    texture2D(u_tex, uv + off - ca).b,
    1.0
  );
}
`;

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error("Could not allocate WebGL shader.");
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) || "Shader compilation failed.";
    gl.deleteShader(shader);
    throw new Error(info);
  }
  return shader;
}

function formatStringProp(name: string, value: string): string {
  if (value.includes("\n") || value.includes('"')) {
    return `  ${name}={${JSON.stringify(value)}}`;
  }
  return `  ${name}=${JSON.stringify(value)}`;
}

export function buildHeatDistortionUsageSnippet(
  config: Partial<HeatDistortionConfig>
): string {
  const merged = { ...DEFAULT_HEAT_DISTORTION_CONFIG, ...config };
  const props: string[] = [];

  if (merged.mode !== DEFAULT_HEAT_DISTORTION_CONFIG.mode) {
    props.push(formatStringProp("mode", merged.mode));
  }
  if (merged.imageFit !== DEFAULT_HEAT_DISTORTION_CONFIG.imageFit) {
    props.push(formatStringProp("imageFit", merged.imageFit));
  }
  if (merged.imageScale !== DEFAULT_HEAT_DISTORTION_CONFIG.imageScale) {
    props.push(`  imageScale={${merged.imageScale}}`);
  }
  if (merged.text !== DEFAULT_HEAT_DISTORTION_CONFIG.text) {
    props.push(formatStringProp("text", merged.text));
  }
  if (merged.fontFamily !== DEFAULT_HEAT_DISTORTION_CONFIG.fontFamily) {
    props.push(formatStringProp("fontFamily", merged.fontFamily));
  }
  if (merged.fontWeight !== DEFAULT_HEAT_DISTORTION_CONFIG.fontWeight) {
    props.push(formatStringProp("fontWeight", merged.fontWeight));
  }
  if (merged.textColor !== DEFAULT_HEAT_DISTORTION_CONFIG.textColor) {
    props.push(formatStringProp("textColor", merged.textColor));
  }
  if (merged.backgroundColor !== DEFAULT_HEAT_DISTORTION_CONFIG.backgroundColor) {
    props.push(formatStringProp("backgroundColor", merged.backgroundColor));
  }
  if (merged.fontSize !== DEFAULT_HEAT_DISTORTION_CONFIG.fontSize) {
    props.push(`  fontSize={${merged.fontSize}}`);
  }
  if (merged.letterSpacing !== DEFAULT_HEAT_DISTORTION_CONFIG.letterSpacing) {
    props.push(`  letterSpacing={${merged.letterSpacing}}`);
  }
  if (merged.lineHeight !== DEFAULT_HEAT_DISTORTION_CONFIG.lineHeight) {
    props.push(`  lineHeight={${merged.lineHeight}}`);
  }
  if (merged.strength !== DEFAULT_HEAT_DISTORTION_CONFIG.strength) {
    props.push(`  strength={${merged.strength}}`);
  }
  if (merged.speed !== DEFAULT_HEAT_DISTORTION_CONFIG.speed) {
    props.push(`  speed={${merged.speed}}`);
  }
  if (merged.frequency !== DEFAULT_HEAT_DISTORTION_CONFIG.frequency) {
    props.push(`  frequency={${merged.frequency}}`);
  }
  if (merged.turbulence !== DEFAULT_HEAT_DISTORTION_CONFIG.turbulence) {
    props.push(`  turbulence={${merged.turbulence}}`);
  }
  if (
    merged.chromaticAberration !==
    DEFAULT_HEAT_DISTORTION_CONFIG.chromaticAberration
  ) {
    props.push(`  chromaticAberration={${merged.chromaticAberration}}`);
  }
  if (merged.maskAngle !== DEFAULT_HEAT_DISTORTION_CONFIG.maskAngle) {
    props.push(`  maskAngle={${merged.maskAngle}}`);
  }
  if (merged.maskPosition !== DEFAULT_HEAT_DISTORTION_CONFIG.maskPosition) {
    props.push(`  maskPosition={${merged.maskPosition}}`);
  }
  if (merged.maskSoftness !== DEFAULT_HEAT_DISTORTION_CONFIG.maskSoftness) {
    props.push(`  maskSoftness={${merged.maskSoftness}}`);
  }
  if (merged.patchiness !== DEFAULT_HEAT_DISTORTION_CONFIG.patchiness) {
    props.push(`  patchiness={${merged.patchiness}}`);
  }
  if (merged.mouseHeat !== DEFAULT_HEAT_DISTORTION_CONFIG.mouseHeat) {
    props.push(`  mouseHeat={${merged.mouseHeat}}`);
  }

  const tag =
    props.length === 0
      ? `<HeatDistortion />`
      : `<HeatDistortion\n${props.join("\n")}\n/>`;

  return `import { HeatDistortion } from "@/components/ui/heat-distortion";\n\nexport function Example() {\n  return (\n    <div style={{ width: 520, aspectRatio: "1" }}>\n      ${tag.replace(/\n/g, "\n      ")}\n    </div>\n  );\n}`;
}

export const HeatDistortion = React.forwardRef<
  HeatDistortionHandle,
  HeatDistortionProps
>(function HeatDistortion(
  {
    mode = DEFAULT_HEAT_DISTORTION_CONFIG.mode,
    imageFit = DEFAULT_HEAT_DISTORTION_CONFIG.imageFit,
    imageScale = DEFAULT_HEAT_DISTORTION_CONFIG.imageScale,
    text = DEFAULT_HEAT_DISTORTION_CONFIG.text,
    fontFamily = DEFAULT_HEAT_DISTORTION_CONFIG.fontFamily,
    fontWeight = DEFAULT_HEAT_DISTORTION_CONFIG.fontWeight,
    textColor = DEFAULT_HEAT_DISTORTION_CONFIG.textColor,
    backgroundColor = DEFAULT_HEAT_DISTORTION_CONFIG.backgroundColor,
    fontSize = DEFAULT_HEAT_DISTORTION_CONFIG.fontSize,
    letterSpacing = DEFAULT_HEAT_DISTORTION_CONFIG.letterSpacing,
    lineHeight = DEFAULT_HEAT_DISTORTION_CONFIG.lineHeight,
    strength = DEFAULT_HEAT_DISTORTION_CONFIG.strength,
    speed = DEFAULT_HEAT_DISTORTION_CONFIG.speed,
    frequency = DEFAULT_HEAT_DISTORTION_CONFIG.frequency,
    turbulence = DEFAULT_HEAT_DISTORTION_CONFIG.turbulence,
    chromaticAberration = DEFAULT_HEAT_DISTORTION_CONFIG.chromaticAberration,
    maskAngle = DEFAULT_HEAT_DISTORTION_CONFIG.maskAngle,
    maskPosition = DEFAULT_HEAT_DISTORTION_CONFIG.maskPosition,
    maskSoftness = DEFAULT_HEAT_DISTORTION_CONFIG.maskSoftness,
    patchiness = DEFAULT_HEAT_DISTORTION_CONFIG.patchiness,
    mouseHeat = DEFAULT_HEAT_DISTORTION_CONFIG.mouseHeat,
    imageSrc = null,
    paused = false,
    resolution = 1024,
    className,
    style,
    ariaLabel = "Heat distortion WebGL canvas"
  },
  ref
) {
  const [webglError, setWebglError] = React.useState<string | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const srcCanvasRef = React.useRef<HTMLCanvasElement | null>(null);
  const loadedImgRef = React.useRef<HTMLImageElement | null>(null);

  const cfgRef = React.useRef({
    mode,
    imageFit,
    imageScale,
    text,
    fontFamily,
    fontWeight,
    textColor,
    backgroundColor,
    fontSize,
    letterSpacing,
    lineHeight,
    strength,
    speed,
    frequency,
    turbulence,
    chromaticAberration,
    maskAngle,
    maskPosition,
    maskSoftness,
    patchiness,
    mouseHeat,
    paused,
    resolution: Math.max(128, Math.round(resolution))
  });

  cfgRef.current = {
    mode,
    imageFit,
    imageScale,
    text,
    fontFamily,
    fontWeight,
    textColor,
    backgroundColor,
    fontSize,
    letterSpacing,
    lineHeight,
    strength,
    speed,
    frequency,
    turbulence,
    chromaticAberration,
    maskAngle,
    maskPosition,
    maskSoftness,
    patchiness,
    mouseHeat,
    paused,
    resolution: Math.max(128, Math.round(resolution))
  };

  const simRef = React.useRef({
    time: 0,
    mouseX: 0.5,
    mouseY: 0.5,
    mouseTarget: 0,
    mouseAmount: 0
  });

  const glStateRef = React.useRef<{
    gl: WebGLRenderingContext;
    texture: WebGLTexture;
    renderFrame: () => void;
    uploadSourceTexture: () => void;
  } | null>(null);

  const drawSourceCanvas = React.useCallback(() => {
    if (typeof document === "undefined") return null;
    const c = cfgRef.current;
    const res = c.resolution;

    if (!srcCanvasRef.current) {
      srcCanvasRef.current = document.createElement("canvas");
    }
    const src = srcCanvasRef.current;
    if (src.width !== res || src.height !== res) {
      src.width = res;
      src.height = res;
    }

    const ctx = src.getContext("2d");
    if (!ctx) return null;

    ctx.fillStyle = c.backgroundColor;
    ctx.fillRect(0, 0, res, res);

    const img = loadedImgRef.current;
    if (
      c.mode === "image" &&
      img &&
      (img.naturalWidth || img.width) > 0 &&
      (img.naturalHeight || img.height) > 0
    ) {
      const iw = img.naturalWidth || img.width;
      const ih = img.naturalHeight || img.height;
      const k =
        (c.imageFit === "cover" ? Math.max : Math.min)(res / iw, res / ih) *
        c.imageScale;
      const w = iw * k;
      const h = ih * k;
      ctx.drawImage(img, (res - w) / 2, (res - h) / 2, w, h);
    } else {
      const scaleRatio = res / 1024;
      const lines = c.text.split("\n");
      let sz = c.fontSize * 1.6 * scaleRatio;

      const setFont = () => {
        ctx.font = `${c.fontWeight} ${sz}px ${c.fontFamily}`;
        if ("letterSpacing" in ctx) {
          (
            ctx as CanvasRenderingContext2D & { letterSpacing?: string }
          ).letterSpacing = `${(c.letterSpacing * sz) / 64}px`;
        }
      };

      setFont();
      const maxLinePx = 920 * scaleRatio;
      const wmax = Math.max(0, ...lines.map((line) => ctx.measureText(line).width));
      if (wmax > maxLinePx && wmax > 0) {
        sz *= maxLinePx / wmax;
        setFont();
      }

      ctx.fillStyle = c.textColor;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const lh = sz * c.lineHeight;
      const y0 = res / 2 - ((lines.length - 1) * lh) / 2;
      lines.forEach((line, i) => {
        ctx.fillText(line, res / 2, y0 + i * lh);
      });
    }

    return src;
  }, []);

  React.useEffect(() => {
    if (!imageSrc) {
      loadedImgRef.current = null;
      glStateRef.current?.uploadSourceTexture();
      return;
    }

    let cancelled = false;
    const im = new Image();
    if (/^https?:/i.test(imageSrc)) {
      im.crossOrigin = "anonymous";
    }
    im.onload = () => {
      if (cancelled) return;
      loadedImgRef.current = im;
      glStateRef.current?.uploadSourceTexture();
    };
    im.onerror = () => {
      if (cancelled) return;
      loadedImgRef.current = null;
      glStateRef.current?.uploadSourceTexture();
    };
    im.src = imageSrc;

    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  React.useEffect(() => {
    if (!mouseHeat) {
      simRef.current.mouseTarget = 0;
    }
  }, [mouseHeat]);

  React.useEffect(() => {
    glStateRef.current?.uploadSourceTexture();
  }, [
    mode,
    imageFit,
    imageScale,
    text,
    fontFamily,
    fontWeight,
    textColor,
    backgroundColor,
    fontSize,
    letterSpacing,
    lineHeight,
    resolution
  ]);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      preserveDrawingBuffer: true,
      antialias: false
    });
    if (!gl) {
      setWebglError("WebGL is unavailable in this browser context.");
      return;
    }
    setWebglError(null);

    let program: WebGLProgram | null = null;
    let vs: WebGLShader | null = null;
    let fs: WebGLShader | null = null;
    let quadBuf: WebGLBuffer | null = null;
    let texture: WebGLTexture | null = null;

    try {
      vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER_SOURCE);
      fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER_SOURCE);
      program = gl.createProgram();
      if (!program) throw new Error("Could not create WebGL program.");
      gl.attachShader(program, vs);
      gl.attachShader(program, fs);
      gl.linkProgram(program);
      if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        throw new Error(gl.getProgramInfoLog(program) || "Shader link failed.");
      }

      gl.useProgram(program);

      quadBuf = gl.createBuffer();
      if (!quadBuf) throw new Error("Could not allocate WebGL vertex buffer.");
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
        gl.STATIC_DRAW
      );

      const posLoc = gl.getAttribLocation(program, "a_pos");
      gl.enableVertexAttribArray(posLoc);
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

      texture = gl.createTexture();
      if (!texture) throw new Error("Could not create WebGL texture.");
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

      const locs = {
        u_tex: gl.getUniformLocation(program, "u_tex"),
        u_t: gl.getUniformLocation(program, "u_t"),
        u_str: gl.getUniformLocation(program, "u_str"),
        u_freq: gl.getUniformLocation(program, "u_freq"),
        u_turb: gl.getUniformLocation(program, "u_turb"),
        u_ca: gl.getUniformLocation(program, "u_ca"),
        u_mang: gl.getUniformLocation(program, "u_mang"),
        u_mpos: gl.getUniformLocation(program, "u_mpos"),
        u_msoft: gl.getUniformLocation(program, "u_msoft"),
        u_patch: gl.getUniformLocation(program, "u_patch"),
        u_mon: gl.getUniformLocation(program, "u_mon"),
        u_mouse: gl.getUniformLocation(program, "u_mouse")
      };

      const syncCanvasSize = () => {
        const cw = Math.max(1, canvas.clientWidth || canvas.offsetWidth || 512);
        const ch = Math.max(1, canvas.clientHeight || cw);
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const pw = Math.round(cw * dpr);
        const ph = Math.round(ch * dpr);
        if (canvas.width !== pw || canvas.height !== ph) {
          canvas.width = pw;
          canvas.height = ph;
        }
        gl.viewport(0, 0, canvas.width, canvas.height);
      };

      const renderFrame = () => {
        const c = cfgRef.current;
        const sim = simRef.current;
        gl.useProgram(program);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(locs.u_tex, 0);
        gl.uniform1f(locs.u_t, sim.time);
        gl.uniform1f(locs.u_str, c.strength);
        gl.uniform1f(locs.u_freq, c.frequency);
        gl.uniform1f(locs.u_turb, c.turbulence);
        gl.uniform1f(locs.u_ca, c.chromaticAberration);
        gl.uniform1f(locs.u_mang, c.maskAngle);
        gl.uniform1f(locs.u_mpos, c.maskPosition);
        gl.uniform1f(locs.u_msoft, Math.max(0.001, c.maskSoftness));
        gl.uniform1f(locs.u_patch, c.patchiness);
        gl.uniform1f(locs.u_mon, sim.mouseAmount);
        gl.uniform2f(locs.u_mouse, sim.mouseX, sim.mouseY);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      };

      const uploadSourceTexture = () => {
        const src = drawSourceCanvas();
        if (!src || !texture) return;
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(
          gl.TEXTURE_2D,
          0,
          gl.RGBA,
          gl.RGBA,
          gl.UNSIGNED_BYTE,
          src
        );
        renderFrame();
      };

      glStateRef.current = {
        gl,
        texture,
        renderFrame,
        uploadSourceTexture
      };

      syncCanvasSize();
      uploadSourceTexture();

      const ro = new ResizeObserver(() => {
        syncCanvasSize();
        renderFrame();
      });
      ro.observe(canvas);

      let rafId = 0;
      let lastMs = performance.now();

      const tick = (now: number) => {
        const dt = Math.min((now - lastMs) / 1000, 0.1);
        lastMs = now;
        const c = cfgRef.current;
        const sim = simRef.current;
        if (!c.paused) {
          sim.time += dt * c.speed;
        }
        sim.mouseAmount += (sim.mouseTarget - sim.mouseAmount) * 0.1;
        renderFrame();
        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);

      return () => {
        cancelAnimationFrame(rafId);
        ro.disconnect();
        glStateRef.current = null;
        if (texture) gl.deleteTexture(texture);
        if (quadBuf) gl.deleteBuffer(quadBuf);
        if (program) gl.deleteProgram(program);
        if (vs) gl.deleteShader(vs);
        if (fs) gl.deleteShader(fs);
      };
    } catch (err) {
      setWebglError(
        err instanceof Error ? err.message : "Failed to initialize WebGL."
      );
      if (texture) gl.deleteTexture(texture);
      if (quadBuf) gl.deleteBuffer(quadBuf);
      if (program) gl.deleteProgram(program);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      return undefined;
    }
  }, [drawSourceCanvas]);

  const exportPngBlob = React.useCallback((): Promise<Blob | null> => {
    const canvas = canvasRef.current;
    if (!canvas) return Promise.resolve(null);
    glStateRef.current?.renderFrame();
    return new Promise((resolve) => {
      canvas.toBlob((blob) => resolve(blob), "image/png");
    });
  }, []);

  const downloadPng = React.useCallback(
    async (filename = "heat-distortion.png") => {
      const blob = await exportPngBlob();
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    },
    [exportPngBlob]
  );

  React.useImperativeHandle(
    ref,
    () => ({
      canvas: canvasRef.current,
      exportPngBlob,
      downloadPng
    }),
    [exportPngBlob, downloadPng]
  );

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0) {
      simRef.current.mouseX = (e.clientX - rect.left) / rect.width;
      simRef.current.mouseY = 1 - (e.clientY - rect.top) / rect.height;
    }
    simRef.current.mouseTarget = cfgRef.current.mouseHeat ? 1 : 0;
  };

  const handlePointerLeave = () => {
    simRef.current.mouseTarget = 0;
  };

  if (webglError) {
    return (
      <div
        className={className}
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          backgroundColor: backgroundColor,
          color: textColor,
          fontSize: 13,
          textAlign: "center",
          ...style
        }}
      >
        {webglError}
      </div>
    );
  }

  return (
    <canvas
      ref={canvasRef}
      aria-label={ariaLabel}
      className={className}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{
        width: "100%",
        height: "100%",
        display: "block",
        touchAction: "none",
        ...style
      }}
    />
  );
});

export default HeatDistortion;
