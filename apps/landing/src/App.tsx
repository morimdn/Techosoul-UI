import { useEffect, useRef, useState, type ReactNode } from "react";
import { Segmented } from "antd";
import { ArrowUpRight, Check, Copy, Moon, Sun } from "lucide-react";
import { Github, Linkedin } from "./brand-icons";
import {
  AccountSummary,
  BidAskDisplay,
  Button,
  ClientStatus,
  CurrencyAmount,
  DataGrid,
  Input,
  PnLIndicator,
  Select,
  StatusIndicator,
  TechosoulProvider,
  TransactionStatus,
  getTokens,
  useTechosoulTheme,
  palettes,
  type ColorMode,
  type Density,
} from "@techosoul/ui";
import { EventDisplay } from "./EventDisplay";
import { TRACKS } from "./tracks";

const SHOWCASE = "https://morimdn.github.io/Techosoul-UI/";
const DOCS = "https://morimdn.github.io/Techosoul-UI/#docs-getting-started";
const REPO = "https://github.com/morimdn/Techosoul-UI";
const INSTALL = "npm i @techosoul/ui antd";

/* ---------- small pieces ---------- */

function RingMark() {
  return (
    <svg viewBox="0 0 32 32" width="28" height="28" aria-hidden="true" className="ringmark">
      <circle cx="16" cy="16" r="14.5" fill="none" stroke="currentColor" strokeOpacity=".45" />
      <circle cx="16" cy="16" r="9.5" fill="none" stroke="currentColor" strokeOpacity=".7" strokeDasharray="3 2" />
      <circle cx="16" cy="16" r="4" fill="none" stroke="currentColor" />
      <path d="M16 16 C 20 13, 25 12, 30 6" fill="none" stroke="#91b5ff" strokeWidth="1.6" />
      <path d="M16 16 C 13 20, 13 25, 9 29" fill="none" stroke="#70dfb2" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="1.4" fill="var(--vertex)" />
    </svg>
  );
}

function CopyCommand({ command, primary = false }: { command: string; primary?: boolean }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable: the command stays selectable */
    }
  }
  return (
    <div className={`cmd ${primary ? "cmd-primary" : ""}`}>
      <code>
        <span aria-hidden="true" className="cmd-prompt">$</span>
        {command}
      </code>
      <button type="button" onClick={copy} aria-label={`Copy command: ${command}`}>
        {copied ? <Check size={16} strokeWidth={1.75} /> : <Copy size={16} strokeWidth={1.5} />}
        <span>{copied ? "Copied" : "Copy"}</span>
      </button>
      <span className="sr-only" aria-live="polite">
        {copied ? "Command copied" : ""}
      </span>
    </div>
  );
}

/** Instrument header strip: id, reading, count — the readout's own grammar. */
function Strip({ items }: { items: ReactNode[] }) {
  return (
    <div className="strip">
      {items.map((x, i) => (
        <span key={i}>{x}</span>
      ))}
    </div>
  );
}

function SectionHead({ children }: { children: ReactNode }) {
  return (
    <div className="sec-head reveal">
      <span className="sec-rule" aria-hidden="true" />
      <h2>{children}</h2>
    </div>
  );
}

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>(".reveal");
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.in = "";
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    items.forEach((el) => {
      // Stagger siblings that reveal together (list rows, step cards, paired panels).
      const peers = el.parentElement
        ? [...el.parentElement.children].filter((c) => c.classList.contains("reveal"))
        : [];
      el.style.setProperty("--stagger", String(Math.max(0, peers.indexOf(el))));
      io.observe(el);
    });
    return () => io.disconnect();
  }, []);
}

/* ---------- 02 Detector layers ---------- */

const LAYER_ROWS = [
  {
    name: "Semantic tokens",
    ring: "Beam pipe",
    body: "One typed source in tokens.ts resolves mode × density into scoped CSS variables, Ant Design theme tokens and a generated tokens.json.",
    api: "getTokens · cssVariables · tokens.json",
  },
  {
    name: "Ant Design 6 controls",
    ring: "Tracker",
    body: "Standard controls are re-exported, not rebuilt. React, React DOM and Ant Design stay peers, so your app keeps one control framework.",
    api: "Button · Input · Select · Form · Modal · Tabs",
  },
  {
    name: "Techosoul wrappers",
    ring: "Calorimeter",
    body: "The parts Ant Design leaves open: controlled column resizing and ordering, money display, financial states and quotes.",
    api: "DataGrid · CurrencyAmount · PnLIndicator · KYCStatus",
  },
  {
    name: "Your application",
    ring: "Muon chambers",
    body: "Composition stays yours. The brokerage CRM in the Showcase is an example application built from these layers, not a bundled product.",
    api: "TechosoulProvider · colorOverrides",
  },
];

const LAYER_CYCLE_MS = 3200;

function Layers() {
  const [active, setActive] = useState(0);
  const [held, setHeld] = useState(false); // a row is hovered or focused
  const [visible, setVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  // Only cycle while the section is on screen.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const reduced =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cycling = visible && !held && !reduced;

  // Advance through the layers in a loop until someone takes over.
  useEffect(() => {
    if (!cycling) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % LAYER_ROWS.length), LAYER_CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [cycling, active]);

  const radii = [
    [0, 46],
    [62, 128],
    [144, 214],
    [230, 270],
  ];
  return (
    <div ref={rootRef} className={`layers ${cycling ? "is-cycling" : ""}`}>
      <figure className="layers-cut reveal" aria-hidden="true">
        <svg viewBox="-290 -290 580 300" role="presentation">
          {radii.map(([r0, r1], i) => {
            const mid = (r0 + r1) / 2;
            const width = r1 - r0;
            return (
              <g key={i} className={active === i ? "is-on" : ""}>
                <path
                  d={`M ${-mid} 0 A ${mid} ${mid} 0 0 1 ${mid} 0`}
                  fill="none"
                  strokeWidth={Math.max(width, 2)}
                  className="band"
                  strokeDasharray={i === 1 ? "14 5" : i === 2 ? "22 3" : i === 3 ? "60 6" : undefined}
                />
                <text x={-mid} y={22} textAnchor="middle" className="band-no">
                  {String(i + 1).padStart(2, "0")}
                </text>
              </g>
            );
          })}
          <path d="M 0 0 C 50 -60, 140 -120, 250 -150" className="cut-track" />
          <path d="M 0 0 C -30 -80, -60 -160, -150 -230" className="cut-track alt" />
          <circle r="4" cx="0" cy="0" fill="var(--vertex)" />
          <line x1="-290" x2="290" y1="0" y2="0" className="cut-axis" />
        </svg>
        <figcaption>Section through the detector. Each band is a layer of the system.</figcaption>
      </figure>
      <ol
        className="layer-list"
        onMouseLeave={() => setHeld(false)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setHeld(false);
        }}
      >
        {LAYER_ROWS.map((row, i) => (
          <li
            key={row.name}
            className={`reveal ${active === i ? "is-on" : ""}`}
            onMouseEnter={() => {
              setHeld(true);
              setActive(i);
            }}
            onFocus={() => {
              setHeld(true);
              setActive(i);
            }}
            tabIndex={0}
          >
            {active === i && (
              <span
                key={`${i}-${cycling}`}
                className="layer-timer"
                aria-hidden="true"
                style={{ animationDuration: `${LAYER_CYCLE_MS}ms` }}
              />
            )}
            <span className="layer-no">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3>{row.name}</h3>
              <p>{row.body}</p>
              <code>{row.api}</code>
              <p className="layer-ring">Detector analogue · {row.ring}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- 03 Signal classification ---------- */

const ROLES: {
  key: keyof typeof palettes.light;
  name: string;
  use: string;
  sample: ReactNode;
}[] = [
  { key: "action", name: "action", use: "Filled primary actions", sample: <Button type="primary" size="small">Approve</Button> },
  { key: "primary", name: "primary", use: "Links and selected foregrounds", sample: <a href="#signal">View statement</a> },
  { key: "positive", name: "positive", use: "Financial gain, money in", sample: <PnLIndicator value="318.40" currency="EUR" /> },
  { key: "negative", name: "negative", use: "Financial loss, money out", sample: <PnLIndicator label="Fee" value="-4.20" currency="EUR" /> },
  { key: "warning", name: "warning", use: "Needs attention", sample: <StatusIndicator label="Review" tone="warning" /> },
  { key: "info", name: "info", use: "In progress, informational", sample: <TransactionStatus status="processing" /> },
  { key: "neutral", name: "neutral", use: "No direction, unknown", sample: <StatusIndicator label="Unverified" tone="neutral" /> },
];

function TrackGlyph({ color, bend }: { color: string; bend: number }) {
  return (
    <svg viewBox="0 0 72 24" width="72" height="24" aria-hidden="true">
      <circle cx="4" cy="12" r="2" fill="var(--vertex)" />
      <path d={`M4 12 Q 36 ${12 + bend} 70 ${12 + bend * 0.4}`} fill="none" stroke={color} strokeWidth="1.6" />
    </svg>
  );
}

function Signals({ mode }: { mode: ColorMode }) {
  return (
    <div className="signals">
      <div className="signal-table reveal" role="table" aria-label="Semantic colour roles">
        <div className="signal-row signal-head" role="row">
          <span role="columnheader">Track</span>
          <span role="columnheader">Role</span>
          <span role="columnheader">Light</span>
          <span role="columnheader">Dark</span>
          <span role="columnheader">Rendered</span>
        </div>
        {ROLES.map((r, i) => (
          <div className="signal-row" role="row" key={r.key} style={{ ["--row" as string]: i }}>
            <span role="cell">
              <TrackGlyph color={palettes[mode][r.key]} bend={(i % 2 ? 1 : -1) * (4 + i * 1.4)} />
            </span>
            <span role="cell" className="signal-role">
              <strong>{r.name}</strong>
              <small>{r.use}</small>
            </span>
            <span role="cell" className="hex" data-mode="Light">
              <i style={{ background: palettes.light[r.key] }} />
              {palettes.light[r.key]}
            </span>
            <span role="cell" className="hex" data-mode="Dark">
              <i style={{ background: palettes.dark[r.key] }} />
              {palettes.dark[r.key]}
            </span>
            <span role="cell" className="signal-sample">
              {r.sample}
            </span>
          </div>
        ))}
      </div>
      <aside className="signal-note reveal">
        <h3>An action is not its outcome.</h3>
        <div className="note-flow">
          <Button type="primary">Approve transfer</Button>
          <span className="note-arrow" aria-hidden="true" />
          <PnLIndicator value="318.40" currency="EUR" />
        </div>
        <p>
          The button is blue because it is an action. The result is green because it is a
          financial outcome. Techosoul keeps those roles apart, so a screen full of buttons never
          reads like a screen full of profit.
        </p>
      </aside>
    </div>
  );
}

/* ---------- 04 Calibration ---------- */

interface Row {
  key: string;
  ref: string;
  client: string;
  amount: string;
  status: "pending" | "processing" | "completed" | "failed";
}
const ROWS: Row[] = [
  { key: "1", ref: "TX-000742", client: "Halden Capital", amount: "12480.50", status: "processing" },
  { key: "2", ref: "TX-000741", client: "Noor Trading", amount: "-2310.00", status: "completed" },
  { key: "3", ref: "TX-000739", client: "Arvo Partners", amount: "904.15", status: "pending" },
  { key: "4", ref: "TX-000736", client: "Kestrel FX", amount: "-75.80", status: "failed" },
];

function Instrument({ mode, density }: { mode: ColorMode; density: Density }) {
  const [widths, setWidths] = useState<Record<string, number>>({ ref: 132, client: 170, amount: 150, status: 190 });
  return (
    <TechosoulProvider key={`${mode}-${density}`} initialMode={mode} initialDensity={density}>
      <div className="instrument-body">
        <div className="instrument-top">
          <AccountSummary
            name="Operating account"
            reference="ACC-2024-0187 · synthetic"
            balance={{ value: "84210.75", currency: "EUR" }}
            status={<ClientStatus status="active" />}
          />
          <div className="instrument-quote">
            <p className="instrument-label">Supplied quote</p>
            <BidAskDisplay symbol="EUR/USD" bid="1.0842" ask="1.0844" spread="0.0002" />
          </div>
        </div>
        <div className="instrument-controls">
          <Input placeholder="Search references" aria-label="Search references" />
          <Select
            aria-label="Status filter"
            defaultValue="all"
            options={[
              { value: "all", label: "All statuses" },
              { value: "processing", label: "Processing" },
              { value: "completed", label: "Completed" },
            ]}
          />
          <Button>Hold</Button>
          <Button type="primary">Approve transfer</Button>
        </div>
        <DataGrid<Row>
          rowKey="key"
          pagination={false}
          dataSource={ROWS}
          columnWidths={widths}
          onColumnWidthChange={(key, w) => setWidths((prev) => ({ ...prev, [String(key)]: w }))}
          scroll={{ x: 640 }}
          columns={[
            { key: "ref", dataIndex: "ref", title: "Reference" },
            { key: "client", dataIndex: "client", title: "Client" },
            {
              key: "amount",
              dataIndex: "amount",
              title: "Amount",
              align: "right",
              render: (v: string) => (
                <span className={v.startsWith("-") ? "financial-negative" : "financial-positive"}>
                  <CurrencyAmount value={v} currency="EUR" />
                </span>
              ),
            },
            {
              key: "status",
              dataIndex: "status",
              title: "Status",
              render: (v: Row["status"]) => <TransactionStatus status={v} />,
            },
          ]}
        />
      </div>
    </TechosoulProvider>
  );
}

function Calibration({ pageMode }: { pageMode: ColorMode }) {
  // Opens in the page's theme and re-syncs whenever the page theme flips;
  // its own Mode switch can still preview the other one.
  const [mode, setMode] = useState<ColorMode>(pageMode);
  useEffect(() => setMode(pageMode), [pageMode]);
  const [density, setDensity] = useState<Density>("comfortable");
  const t = getTokens(mode, density);
  return (
    <div className="calibration">
      <div className="calib-panel reveal">
        <div className="calib-controls">
          <label>
            <span className="field-label">Mode</span>
            <Segmented
              aria-label="Colour mode"
              value={mode}
              options={[
                { label: "Light", value: "light" },
                { label: "Dark", value: "dark" },
              ]}
              onChange={(v) => setMode(v as ColorMode)}
            />
          </label>
          <label>
            <span className="field-label">Density</span>
            <Segmented
              aria-label="Density"
              value={density}
              options={[
                { label: "Comfortable", value: "comfortable" },
                { label: "Compact", value: "compact" },
              ]}
              onChange={(v) => setDensity(v as Density)}
            />
          </label>
        </div>
        <dl className="readout">
          <div>
            <dt>canvas</dt>
            <dd>{t.color.canvas}</dd>
          </div>
          <div>
            <dt>text</dt>
            <dd>{t.color.text}</dd>
          </div>
          <div>
            <dt>action</dt>
            <dd>{t.color.action}</dd>
          </div>
          <div>
            <dt>control</dt>
            <dd>{t.sizing.control}px</dd>
          </div>
          <div>
            <dt>cell</dt>
            <dd>{t.sizing.cell}px</dd>
          </div>
          <div>
            <dt>body</dt>
            <dd>{t.typography.body}px</dd>
          </div>
        </dl>
        <p className="calib-note">
          Real components, re-themed in place by a nested <code>TechosoulProvider</code>. Drag a
          column edge in the grid to resize it.
        </p>
      </div>
      <div className="instrument reveal" aria-label="Live component preview">
        <div className="instrument-frame">
          <span>LIVE · {mode.toUpperCase()} · {density.toUpperCase()}</span>
          <span>SYNTHETIC RECORDS</span>
        </div>
        <Instrument mode={mode} density={density} />
      </div>
    </div>
  );
}

/* ---------- readout ---------- */

function Readout({ selected, className = "" }: { selected: number; className?: string }) {
  const { mode } = useTechosoulTheme();
  const track = TRACKS[selected];
  return (
    <section className={`readout-card ${className}`} aria-label="Selected track" aria-live="polite">
      <header>
        <span style={{ color: palettes[mode][track.role] }}>
          TRACK {String(selected + 1).padStart(2, "0")} / {String(TRACKS.length).padStart(2, "0")}
        </span>
        <span>TX-000742 · synthetic</span>
      </header>
      <div className="readout-body">
        <p className="readout-name">{track.title}</p>
        <div className="readout-render" key={track.id}>
          {track.render()}
        </div>
        <code className="readout-code">{track.code}</code>
      </div>
    </section>
  );
}

/* ---------- page ---------- */

export default function App() {
  const [selected, setSelected] = useState(0);
  const mainRef = useRef<HTMLElement>(null);
  const { mode, setMode } = useTechosoulTheme();
  useEffect(() => {
    document.documentElement.dataset.theme = mode;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", mode === "dark" ? "#070b12" : "#f4f7fc");
    try {
      localStorage.setItem("techosoul-landing-theme", mode);
    } catch {
      /* storage unavailable: theme still applies for this visit */
    }
  }, [mode]);
  useReveal();

  return (
    <div className="page">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="masthead">
        <a className="wordmark" href="#top" aria-label="Techosoul UI home">
          <RingMark />
          <span>
            <strong>TECHOSOUL UI</strong>
            <small>Design system</small>
          </span>
        </a>
        <nav aria-label="Primary">
          <a href="#layers">Architecture</a>
          <a href="#signal">Colour roles</a>
          <a href="#calibration">Themes</a>
          <a href="#install">Install</a>
          <a href={DOCS}>Docs</a>
        </nav>
        <div className="masthead-end">
          <span className="run-state">
            <i aria-hidden="true" /> v0.3.0 · preview · MIT
          </span>
          <button
            type="button"
            className="theme-toggle"
            onClick={() => setMode(mode === "dark" ? "light" : "dark")}
            aria-label={mode === "dark" ? "Switch to light theme" : "Switch to dark theme"}
            title={mode === "dark" ? "Light theme" : "Dark theme"}
          >
            {mode === "dark" ? <Sun size={17} strokeWidth={1.6} /> : <Moon size={17} strokeWidth={1.6} />}
          </button>
          <a className="btn-ghost" href={REPO}>
            <Github size={16} strokeWidth={1.5} aria-hidden="true" />
            GitHub
          </a>
        </div>
      </header>

      <main id="main" ref={mainRef} tabIndex={-1}>
        {/* 01 · Event */}
        <section className="hero" id="top" aria-labelledby="hero-title">
          <div className="hero-copy">
            <h1 id="hero-title">
              <span>FinTech-first.</span>
              <span className="h1-alt">Built for modern software.</span>
            </h1>
            <p className="lede">
              An open-source React design system on Ant Design 6. Semantic tokens, financial display
              components and one interaction language for dense, data-heavy interfaces.
            </p>
            <div className="hero-actions">
              <CopyCommand command={INSTALL} primary />
              <a className="btn-outline" href={SHOWCASE}>
                Open the Showcase
                <span className="btn-icon" aria-hidden="true">
                  <ArrowUpRight size={16} strokeWidth={1.5} />
                </span>
              </a>
            </div>
          </div>
          <Readout selected={selected} className="readout-desktop" />
          <div className="hero-visual">
            <EventDisplay tracks={TRACKS} selected={selected} onSelect={setSelected} mode={mode}>
              <Readout selected={selected} className="readout-compact" />
            </EventDisplay>
          </div>
        </section>

        {/* 02 · Layers */}
        <section className="sec" id="layers" aria-labelledby="layers-title">
          <SectionHead>
            <span id="layers-title">Extends Ant Design. Doesn't replace it.</span>
          </SectionHead>
          <Layers />
        </section>

        {/* 03 · Signals */}
        <section className="sec" id="signal" aria-labelledby="signal-title">
          <SectionHead>
            <span id="signal-title">Colour is a role, not a value.</span>
          </SectionHead>
          <Signals mode={mode} />
        </section>

        {/* 04 · Calibration */}
        <section className="sec sec-wide" id="calibration" aria-labelledby="calib-title">
          <SectionHead>
            <span id="calib-title">Two axes. Set independently.</span>
          </SectionHead>
          <Calibration pageMode={mode} />
        </section>

        {/* 05 · Run snapshot */}
        <section className="sec" id="validation" aria-labelledby="run-title">
          <SectionHead>
            <span id="run-title">Validated, not claimed.</span>
          </SectionHead>
          <div className="run">
            <div className="panel reveal">
            <Strip items={["RUN 0.3.0", <b key="p">4 / 4 PASSED</b>, "consumer-*.json"]} />
            <div className="matrix" role="table" aria-label="Consumer validation matrix">
              <div role="row" className="matrix-row">
                <span role="columnheader" />
                <span role="columnheader">antd 6.0.0</span>
                <span role="columnheader">antd 6.6.6</span>
              </div>
              {["18.3.1", "19.3.1"].map((r) => (
                <div role="row" className="matrix-row" key={r}>
                  <span role="rowheader">React {r}</span>
                  {["6.0.0", "6.6.6"].map((a) => (
                    <span role="cell" className="matrix-cell" key={a}>
                      <i aria-hidden="true" />
                      Build passed
                    </span>
                  ))}
                </div>
              ))}
              <p className="matrix-note">
                Independent tarball installs, recorded in <code>docs/consumer-*.json</code>. Other
                versions inside the peer ranges are not individually verified.
              </p>
            </div>
            </div>
            <div className="panel reveal">
            <Strip items={["PACKAGE PROBES", "peers external", "package-metrics.json"]} />
            <dl className="figures">
              <div>
                <dt>CurrencyAmount, tree-shaken</dt>
                <dd>
                  485<small> B gzip</small>
                </dd>
                <p>Bundled with peers external; Ant Design not retained.</p>
              </div>
              <div>
                <dt>Tokens entry</dt>
                <dd>
                  1.1<small> kB gzip</small>
                </dd>
                <p>Import the token contract without any UI code.</p>
              </div>
              <div>
                <dt>Theme combinations</dt>
                <dd>
                  2 × 2<small> axes</small>
                </dd>
                <p>Light/Dark × Comfortable/Compact, contrast-tested in both modes.</p>
              </div>
              <div>
                <dt>Curated icons</dt>
                <dd>
                  36<small> Lucide</small>
                </dd>
                <p>Sizes, strokes and tones documented in the Showcase gallery.</p>
              </div>
            </dl>
            </div>
          </div>
        </section>

        {/* 06 · Limits */}
        <section className="sec sec-limits" aria-labelledby="limits-title">
          <SectionHead>
            <span id="limits-title">What it does not measure.</span>
          </SectionHead>
          <div className="limits reveal">
            <p>
              Techosoul UI displays financial values. It does not calculate, store or move them.
              Decimal strings are preferred, and no financial arithmetic is performed.
            </p>
            <div className="panel">
            <Strip items={["OUT OF SCOPE", <b key="n">5 / 5</b>, "display only"]} />
            <ul>
              {[
                "No ledger",
                "No trading engine",
                "No broker integration",
                "No payment system",
                "No live data feed",
              ].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            </div>
          </div>
        </section>

        {/* 07 · Install */}
        <section className="sec" id="install" aria-labelledby="install-title">
          <SectionHead>
            <span id="install-title">Three steps to the first figure.</span>
          </SectionHead>
          <ol className="steps">
            <li className="reveal">
              <Strip items={["STEP 01", "terminal", "npm"]} />
              <h3>Install the package and its peers</h3>
              <CopyCommand command={INSTALL} />
              <p>Consumers supply React or React DOM 18.3 or 19, and Ant Design 6.</p>
            </li>
            <li className="reveal">
              <Strip items={["STEP 02", "main.tsx", "provider"]} />
              <h3>Wrap the app and load the styles</h3>
              <pre>
                <code>{`import "@techosoul/ui/styles.css";
import { TechosoulProvider } from "@techosoul/ui";

<TechosoulProvider initialMode="dark">
  <App />
</TechosoulProvider>`}</code>
              </pre>
            </li>
            <li className="reveal">
              <Strip items={["STEP 03", "App.tsx", "first figure"]} />
              <h3>Render a figure</h3>
              <pre>
                <code>{`import { CurrencyAmount } from "@techosoul/ui";

<CurrencyAmount value="12480.50" currency="EUR" />`}</code>
              </pre>
              <p className="step-out">
                Output <CurrencyAmount value="12480.50" currency="EUR" />
              </p>
            </li>
          </ol>
          <div className="install-actions reveal">
            <a className="btn-solid" href={DOCS}>
              Read the getting-started guide
              <span className="btn-icon" aria-hidden="true">
                <ArrowUpRight size={16} strokeWidth={1.5} />
              </span>
            </a>
            <a className="btn-outline" href={SHOWCASE}>
              Open the Showcase
              <span className="btn-icon" aria-hidden="true">
                <ArrowUpRight size={16} strokeWidth={1.5} />
              </span>
            </a>
            <a className="btn-outline" href={REPO}>
              View on GitHub
              <span className="btn-icon" aria-hidden="true">
                <Github size={16} strokeWidth={1.5} />
              </span>
            </a>
          </div>
        </section>

        {/* 08 · Techosoul */}
        <section className="sec sec-brand" aria-labelledby="brand-title">
          <SectionHead>
            <span id="brand-title">Technology with a human soul.</span>
          </SectionHead>
          <div className="brand reveal">
            <p className="brand-lede">
              Techosoul is an emerging software product brand focused on intelligent software
              engineering, agentic AI workflows and human-centred product design. Its strengths
              include FinTech, enterprise applications, CRM and data-intensive software. Techosoul UI
              is one of its first public products.
            </p>
            <article className="founder">
              <Strip items={["@morimdn", "Techosoul"]} />
              <div className="founder-body">
              <h3>Dr. Mirmorsal Madani</h3>
              <p className="founder-role">Founder &amp; lead maintainer</p>
              <p>
                Ph.D. in Computer Engineering, Software Systems. Chief Product Officer in the FinTech
                industry, with experience developing and managing Forex CRM, risk management, social
                trading, IB platforms and enterprise applications.
              </p>
              <div className="founder-links">
                <a href="https://github.com/morimdn">
                  <Github size={16} strokeWidth={1.5} aria-hidden="true" /> morimdn
                </a>
                <a href="https://www.linkedin.com/in/mirmorsal-madani/">
                  <Linkedin size={16} strokeWidth={1.5} aria-hidden="true" /> LinkedIn
                </a>
              </div>
              </div>
            </article>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="wordmark">
          <RingMark />
          <span>
            <strong>TECHOSOUL UI</strong>
            <small>FinTech-first. Built for modern software.</small>
          </span>
        </div>
        <nav aria-label="Footer">
          <a href={SHOWCASE}>Showcase</a>
          <a href={DOCS}>Documentation</a>
          <a href={REPO}>GitHub</a>
          <a href="https://www.npmjs.com/package/@techosoul/ui">npm</a>
        </nav>
        <p>MIT licensed · Preview 0.3.0 · Event data on this page is synthetic.</p>
      </footer>
    </div>
  );
}
