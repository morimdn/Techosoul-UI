import { useEffect, useRef, useState, type ReactNode } from "react";
import { RotateCw } from "lucide-react";
import { palettes, type ColorMode } from "@techosoul/ui";
import type { Track } from "./tracks";

/* Detector geometry, in units of the outer radius R. */
const BEAM = 0.045;
const TRACKER = [0.11, 0.17, 0.23, 0.3, 0.37, 0.44, 0.51];
const EM = [0.56, 0.705];
const HAD = [0.735, 0.865];
const MUON = [0.9, 1];
const EXIT_R = 0.9;
const LAYERS: [string, number][] = [
  ["TOKENS", 0.08],
  ["ANT DESIGN 6", 0.47],
  ["TECHOSOUL", 0.79],
  ["YOUR APP", 0.95],
];

const INKS = {
  dark: {
    ring: "#2e4a72",
    ringDim: "#1a2a43",
    cell: "rgba(46,74,114,0.16)",
    label: "#6f86a8",
    vertex: "#edf2fb",
    decoCool: "143,166,201",
    decoWarm: "242,205,126",
  },
  light: {
    ring: "#9fb3d1",
    ringDim: "#c9d5e6",
    cell: "rgba(91,125,181,0.09)",
    label: "#5a6b85",
    vertex: "#192941",
    decoCool: "82,104,140",
    decoWarm: "176,124,18",
  },
};
let INK = INKS.dark;

type Pt = [number, number];
interface Path {
  pts: Pt[];
  color: string;
  alpha: number;
  width: number;
}

function mulberry32(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A charged track in a solenoid: a circular arc leaving the origin. */
function arc(theta0: number, rho: number, rEnd: number, maxTurn = 0.92): Pt[] {
  const dir = Math.sign(rho) || 1;
  const r = Math.abs(rho);
  const ds = 0.005;
  const pts: Pt[] = [[0, 0]];
  let x = 0,
    y = 0,
    th = theta0,
    s = 0;
  const sMax = 2 * Math.PI * r * maxTurn;
  while (s < sMax) {
    th += (ds / r) * dir;
    x += Math.cos(th) * ds;
    y += Math.sin(th) * ds;
    s += ds;
    pts.push([x, y]);
    if (x * x + y * y >= rEnd * rEnd) break;
  }
  return pts;
}

/** Initial angle so a track of curvature rho leaves the detector at `exit`. */
function launch(exitRad: number, rho: number, d: number) {
  const r = Math.abs(rho);
  const half = Math.asin(Math.min(1, d / (2 * r)));
  return exitRad - Math.sign(rho) * half;
}

function buildDecor(): Path[] {
  const rnd = mulberry32(742);
  const out: Path[] = [];
  for (let i = 0; i < 64; i++) {
    const warm = rnd() < 0.42;
    const rho = (0.04 + rnd() ** 1.6 * 0.5) * (rnd() < 0.5 ? -1 : 1);
    const rEnd = 0.18 + rnd() * 0.36;
    out.push({
      pts: arc(rnd() * Math.PI * 2, rho, rEnd, 0.55 + rnd() * 0.4),
      color: warm ? "warm" : "cool",
      alpha: 0.3 + rnd() * 0.4,
      width: 0.7 + rnd() * 0.8,
    });
  }
  return out;
}

const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const clamp01 = (t: number) => Math.max(0, Math.min(1, t));
const LAND_MS = 1700;

export function EventDisplay({
  tracks,
  selected,
  onSelect,
  children,
  mode = "dark",
}: {
  tracks: Track[];
  selected: number;
  onSelect: (index: number) => void;
  mode?: ColorMode;
  /** Rendered between the canvas and the track list on narrow screens. */
  children?: ReactNode;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const labelsRef = useRef<HTMLOListElement>(null);
  const hintRef = useRef<HTMLSpanElement>(null);
  const [compact, setCompact] = useState(false);
  const [landed, setLanded] = useState(false);
  const [hover, setHover] = useState(-1);

  const live = useRef({
    selected,
    mode,
    colors: tracks.map((t) => palettes[mode][t.role]) as string[],
    hover: -1,
    compact: false,
    progress: 0,
    start: 0,
    rot: 0,
    vel: 0,
    dragging: false,
    lastAngle: 0,
    raf: 0,
    reduced: false,
    w: 0,
    h: 0,
    paths: [] as Path[],
    primaries: [] as Pt[][],
    requestDraw: () => {},
  });

  useEffect(() => {
    live.current.selected = selected;
    live.current.requestDraw();
  }, [selected]);
  useEffect(() => {
    live.current.mode = mode;
    live.current.colors = tracks.map((t) => palettes[mode][t.role]);
    live.current.requestDraw();
  }, [mode, tracks]);
  useEffect(() => {
    live.current.hover = hover;
    live.current.requestDraw();
  }, [hover]);

  useEffect(() => {
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const s = live.current;
    INK = INKS[s.mode];
    s.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    s.paths = buildDecor();
    s.primaries = tracks.map((t) => {
      const ex = (t.exit * Math.PI) / 180;
      return arc(launch(ex, t.rho, EXIT_R), t.rho, EXIT_R, 0.99);
    });

    function geom() {
      if (s.compact) {
        const R = Math.min(s.w, s.h) * 0.42;
        return { cx: s.w / 2, cy: s.h / 2, R };
      }
      const labelsW = labelsRef.current?.offsetWidth ?? 240;
      const R = Math.min(s.h * 0.46, (s.w - labelsW - 56) / 2);
      return { cx: s.w - labelsW - 40 - R, cy: s.h / 2, R };
    }

    function strokePath(
      pts: Pt[],
      R: number,
      fraction: number,
      color: string,
      alpha: number,
      width: number,
    ) {
      const n = Math.max(2, Math.floor(pts.length * fraction));
      ctx.beginPath();
      ctx.moveTo(pts[0][0] * R, pts[0][1] * R);
      for (let i = 1; i < n; i++) ctx.lineTo(pts[i][0] * R, pts[i][1] * R);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = color;
      ctx.lineWidth = width;
      ctx.stroke();
      ctx.globalAlpha = 1;
    }

    function drawDetector(R: number, active: number) {
      // Beam pipe and tracker barrels, drawn as segmented modules.
      ctx.lineCap = "butt";
      ctx.strokeStyle = INK.ring;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, BEAM * R, 0, Math.PI * 2);
      ctx.stroke();
      TRACKER.forEach((r, i) => {
        const circ = 2 * Math.PI * r * R;
        const modules = 10 + i * 6;
        const seg = circ / modules;
        ctx.setLineDash([seg * 0.72, seg * 0.28]);
        ctx.lineDashOffset = i * 7;
        ctx.strokeStyle = i % 2 ? INK.ringDim : INK.ring;
        ctx.lineWidth = i % 2 ? 2 : 3.2;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.arc(0, 0, r * R, 0, Math.PI * 2);
        ctx.stroke();
      });
      ctx.setLineDash([]);
      ctx.globalAlpha = 1;

      // Calorimeter wedges: electromagnetic then hadronic.
      const wedges = (band: number[], count: number, layers: number) => {
        const step = (Math.PI * 2) / count;
        const dr = (band[1] - band[0]) / layers;
        ctx.strokeStyle = INK.ringDim;
        ctx.lineWidth = 1;
        for (let k = 0; k < count; k++) {
          const a0 = k * step + step * 0.06;
          const a1 = (k + 1) * step - step * 0.06;
          for (let l = 0; l < layers; l++) {
            const r0 = (band[0] + l * dr + dr * 0.08) * R;
            const r1 = (band[0] + (l + 1) * dr - dr * 0.08) * R;
            ctx.beginPath();
            ctx.arc(0, 0, r1, a0, a1);
            ctx.arc(0, 0, r0, a1, a0, true);
            ctx.closePath();
            ctx.fillStyle = INK.cell;
            ctx.fill();
            ctx.stroke();
          }
        }
      };
      wedges(EM, 56, 2);
      wedges(HAD, 40, 3);

      // Muon chambers: twelve open trapezoids.
      const step = (Math.PI * 2) / 12;
      ctx.strokeStyle = INK.ring;
      ctx.lineWidth = 1;
      for (let k = 0; k < 12; k++) {
        const a0 = k * step + 0.05;
        const a1 = (k + 1) * step - 0.05;
        ctx.globalAlpha = 0.7;
        ctx.beginPath();
        ctx.arc(0, 0, MUON[1] * R, a0, a1);
        ctx.arc(0, 0, MUON[0] * R, a1, a0, true);
        ctx.closePath();
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      void active;
    }

    /** Towers scale with each value's magnitude: depth first, then width. */
    function drawDeposits(R: number, grow: number, emphasis: number) {
      tracks.forEach((t, i) => {
        if (grow <= 0) return;
        const focus = emphasis < 0 || emphasis === i;
        const pts = s.primaries[i];
        const [ex, ey] = pts[pts.length - 1];
        const a = (((Math.atan2(ey, ex) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2));
        let left = Math.max(1, Math.round(t.energy * grow));
        const cell = (band: number[], count: number, layers: number, k: number, l: number) => {
          const step = (Math.PI * 2) / count;
          const dr = (band[1] - band[0]) / layers;
          const a0 = k * step + step * 0.06;
          const a1 = (k + 1) * step - step * 0.06;
          const r0 = (band[0] + l * dr + dr * 0.08) * R;
          const r1 = (band[0] + (l + 1) * dr - dr * 0.08) * R;
          ctx.beginPath();
          ctx.arc(0, 0, r1, a0, a1);
          ctx.arc(0, 0, r0, a1, a0, true);
          ctx.closePath();
          ctx.fill();
        };
        ctx.fillStyle = s.colors[i];
        // Central wedge first, then neighbours outward, each filled inner to outer.
        for (const offset of [0, 1, -1, 2, -2]) {
          for (const [band, count, layers] of [
            [EM, 56, 2],
            [HAD, 40, 3],
          ] as [number[], number, number][]) {
            const k = Math.floor(a / ((Math.PI * 2) / count)) + offset;
            for (let l = 0; l < layers && left > 0; l++, left--) {
              const fade = Math.abs(offset) * 0.18 + l * 0.06;
              ctx.globalAlpha = Math.max(0.08, (focus ? 0.96 : 0.13) - (focus ? fade : 0));
              cell(band, count, layers, ((k % count) + count) % count, l);
            }
          }
          if (left <= 0) break;
        }
        ctx.globalAlpha = 1;
      });
    }

    function draw() {
      INK = INKS[s.mode];
      const now = performance.now();
      const p = s.reduced ? 1 : clamp01((now - s.start) / LAND_MS);
      s.progress = p;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, s.w, s.h);
      const { cx, cy, R } = geom();
      if (!(R > 24)) {
        // Not laid out yet; try again next frame.
        s.raf = requestAnimationFrame(draw);
        return;
      }
      const emphasis = s.hover >= 0 ? s.hover : s.selected;

      ctx.save();
      ctx.translate(cx, cy);
      drawDetector(R, emphasis);
      ctx.rotate(s.rot);

      // Low-momentum background tracks curl inside the tracker.
      const decoP = easeOut(clamp01(p / 0.7));
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      for (const d of s.paths)
        strokePath(d.pts, R, decoP, `rgb(${d.color === "warm" ? INK.decoWarm : INK.decoCool})`, d.alpha * 0.9, d.width);

      drawDeposits(R, easeOut(clamp01((p - 0.62) / 0.38)), emphasis);

      // Primary tracks, one per component.
      tracks.forEach((t, i) => {
        const tp = easeOut(clamp01((p - 0.08 - i * 0.035) / 0.62));
        if (tp <= 0) return;
        const isFocus = emphasis === i;
        ctx.shadowColor = s.colors[i];
        ctx.shadowBlur = isFocus ? (s.mode === "dark" ? 14 : 5) : 0;
        strokePath(
          s.primaries[i],
          R,
          tp,
          s.colors[i],
          isFocus ? 1 : 0.22,
          isFocus ? 2.8 : 1.3,
        );
        ctx.shadowBlur = 0;
        // Tracker hits where the track crosses each barrel.
        if (tp > 0.98) {
          ctx.fillStyle = s.colors[i];
          ctx.globalAlpha = isFocus ? 1 : 0.22;
          for (const r of TRACKER) {
            const hit = s.primaries[i].find(([x, y]) => x * x + y * y >= r * r);
            if (!hit) continue;
            ctx.beginPath();
            ctx.arc(hit[0] * R, hit[1] * R, isFocus ? 2.4 : 1.6, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
      });
      ctx.restore();

      // Keep the drag hint centred under the rings.
      const hint = hintRef.current;
      if (hint) {
        if (s.compact) hint.style.transform = "";
        else {
          const top = Math.min(cy + R + 18, s.h - hint.offsetHeight - 8);
          hint.style.transform = `translate(${cx - hint.offsetWidth / 2}px, ${top}px)`;
        }
      }

      // Primary vertex.
      ctx.fillStyle = INK.vertex;
      ctx.beginPath();
      ctx.arc(cx, cy, 2.6, 0, Math.PI * 2);
      ctx.fill();

      // Layer names, fixed to the frame rather than the event.
      ctx.font = '500 9.5px "Saira Variable", sans-serif';
      ctx.fillStyle = INK.label;
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      try {
        (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = "2px";
      } catch {
        /* older engines ignore letter spacing */
      }
      const la = (-100 * Math.PI) / 180;
      for (const [name, r] of s.compact ? [] : LAYERS) {
        const x = cx + Math.cos(la) * r * R;
        const y = cy + Math.sin(la) * r * R;
        ctx.globalAlpha = p;
        ctx.fillText(name, x + 6, y);
        ctx.fillRect(x - 3, y - 0.5, 6, 1);
      }
      ctx.globalAlpha = 1;

      // Leader lines from each exit point to its pinned label.
      const lp = clamp01((p - 0.7) / 0.3);
      if (lp > 0) {
        const wrapBox = wrap.getBoundingClientRect();
        const labels = labelsRef.current?.querySelectorAll<HTMLElement>("[data-anchor]");
        tracks.forEach((t, i) => {
          const pts = s.primaries[i];
          const [ex0, ey0] = pts[pts.length - 1];
          const cos = Math.cos(s.rot);
          const sin = Math.sin(s.rot);
          const ex = (ex0 * cos - ey0 * sin) * R + cx;
          const ey = (ex0 * sin + ey0 * cos) * R + cy;
          const isFocus = emphasis === i;
          ctx.globalAlpha = lp * (isFocus ? 1 : 0.14);
          ctx.strokeStyle = s.colors[i];
          ctx.fillStyle = s.colors[i];
          ctx.lineWidth = 1;
          if (s.compact) {
            const a = Math.atan2(ey - cy, ex - cx);
            const tx = cx + Math.cos(a) * R * 1.035;
            const ty = cy + Math.sin(a) * R * 1.035;
            ctx.beginPath();
            ctx.moveTo(ex, ey);
            ctx.lineTo(tx, ty);
            ctx.stroke();
            ctx.font = '600 9px "Martian Mono Variable", monospace';
            ctx.textAlign = Math.cos(a) >= 0 ? "left" : "right";
            ctx.fillText(String(i + 1).padStart(2, "0"), tx + Math.cos(a) * 4, ty + Math.sin(a) * 4);
          } else if (labels?.[i]) {
            const box = labels[i].getBoundingClientRect();
            const lx = box.left - wrapBox.left - 10;
            const ly = box.top - wrapBox.top + box.height / 2;
            const a = Math.atan2(ey - cy, ex - cx);
            const ox = cx + Math.cos(a) * R * 1.04;
            const oy = cy + Math.sin(a) * R * 1.04;
            ctx.beginPath();
            ctx.moveTo(ex, ey);
            ctx.lineTo(ox, oy);
            ctx.lineTo(Math.max(ox + 12, lx - 18), ly);
            ctx.lineTo(lx, ly);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(lx, ly, 2.2, 0, Math.PI * 2);
            ctx.fill();
          }
        });
        ctx.globalAlpha = 1;
      }

      // Inertia after a drag.
      let again = p < 1;
      if (!s.dragging && Math.abs(s.vel) > 0.0004 && !s.reduced) {
        s.rot += s.vel;
        s.vel *= 0.94;
        again = true;
      }
      s.raf = again ? requestAnimationFrame(draw) : 0;
      if (p >= 1) setLanded(true);
    }

    s.requestDraw = () => {
      if (!s.raf) s.raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const box = wrap.getBoundingClientRect();
      const nextCompact = box.width < 720;
      s.compact = nextCompact;
      setCompact(nextCompact);
      const area = canvas.parentElement!.getBoundingClientRect();
      if (!area.width || !area.height) return;
      s.w = area.width;
      s.h = area.height;
      canvas.width = Math.round(s.w * dpr);
      canvas.height = Math.round(s.h * dpr);
      s.requestDraw();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // Pointer rotation around the beam axis.
    const angleAt = (e: PointerEvent) => {
      const box = canvas.getBoundingClientRect();
      const { cx, cy } = geom();
      return Math.atan2(e.clientY - box.top - cy, e.clientX - box.left - cx);
    };
    const down = (e: PointerEvent) => {
      s.dragging = true;
      s.vel = 0;
      s.lastAngle = angleAt(e);
      canvas.setPointerCapture(e.pointerId);
      wrap.classList.add("is-dragging", "has-dragged");
    };
    const move = (e: PointerEvent) => {
      if (!s.dragging) return;
      const a = angleAt(e);
      let d = a - s.lastAngle;
      if (d > Math.PI) d -= Math.PI * 2;
      if (d < -Math.PI) d += Math.PI * 2;
      s.rot += d;
      s.vel = d;
      s.lastAngle = a;
      s.requestDraw();
    };
    const up = () => {
      s.dragging = false;
      wrap.classList.remove("is-dragging");
      s.requestDraw();
    };
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);

    s.start = performance.now();
    document.fonts?.ready.then(() => s.requestDraw());
    return () => {
      ro.disconnect();
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
    };
  }, [tracks]);

  return (
    <div
      ref={wrapRef}
      className={`event ${compact ? "is-compact" : ""} ${landed ? "is-landed" : ""}`}
    >
      <div className="event-stage">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="Event display: one synthetic payment at the centre, with seven tracks curving out through the token, Ant Design and Techosoul layers to the components that display it. Drag to rotate."
        />
        <span ref={hintRef} className="event-hint" aria-hidden="true">
          <RotateCw size={15} strokeWidth={1.75} />
          Drag to rotate
        </span>
      </div>
      {compact && children}
      <ol ref={labelsRef} className="event-labels" aria-label="Tracks">
        {tracks.map((t, i) => (
          <li key={t.id} style={{ ["--track" as string]: palettes[mode][t.role], ["--i" as string]: i }}>
            <button
              type="button"
              data-anchor
              aria-pressed={selected === i}
              className={selected === i ? "is-selected" : ""}
              onClick={() => onSelect(i)}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(-1)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(-1)}
            >
              <span className="label-no">{String(i + 1).padStart(2, "0")}</span>
              <span className="label-name">{t.title}</span>
              <span className="label-reading">{t.reading}</span>
            </button>
          </li>
        ))}
      </ol>
    </div>
  );
}
