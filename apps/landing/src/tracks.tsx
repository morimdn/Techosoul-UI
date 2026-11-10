import type { ReactNode } from "react";
import {
  BidAskDisplay,
  CurrencyAmount,
  KYCStatus,
  PnLIndicator,
  RiskLevelIndicator,
  TransactionStatus,
  formatCurrency,
} from "@techosoul/ui";

/** One primary track per component. All values are synthetic display data. */
export interface Track {
  id: string;
  component: string;
  /** Human-readable name shown on labels; the code line keeps the exact component name. */
  title: string;
  /** Short reading shown on the pinned label. */
  reading: string;
  /** Semantic role the colour comes from. */
  role: "primary" | "positive" | "negative" | "info" | "warning" | "neutral";
  color: string;
  /** Exit angle in degrees, 0 = right, positive = clockwise (down). */
  exit: number;
  /** Radius of curvature in detector units (1 = outer radius). Sign = bend. */
  rho: number;
  /** Calorimeter cells deposited; scales with the size of the displayed value. */
  energy: number;
  code: string;
  render: () => ReactNode;
}

export const TRACKS: Track[] = [
  {
    id: "amount",
    component: "CurrencyAmount",
    title: "Currency Amount",
    reading: formatCurrency({ value: "12480.50", currency: "EUR" }),
    role: "primary",
    color: "#91b5ff",
    exit: -58,
    rho: 1.9,
    energy: 13,
    code: '<CurrencyAmount value="12480.50" currency="EUR" />',
    render: () => <CurrencyAmount value="12480.50" currency="EUR" />,
  },
  {
    id: "pnl",
    component: "PnLIndicator",
    title: "P&L Indicator",
    reading: "+" + formatCurrency({ value: "318.40", currency: "EUR" }),
    role: "positive",
    color: "#70dfb2",
    exit: -38,
    rho: -1.4,
    energy: 5,
    code: '<PnLIndicator value="318.40" currency="EUR" />',
    render: () => <PnLIndicator value="318.40" currency="EUR" />,
  },
  {
    id: "fee",
    component: "PnLIndicator",
    title: "P&L Indicator",
    reading: formatCurrency({ value: "-4.20", currency: "EUR" }),
    role: "negative",
    color: "#ff9baa",
    exit: -17,
    rho: 0.95,
    energy: 1,
    code: '<PnLIndicator label="Fee" value="-4.20" currency="EUR" />',
    render: () => <PnLIndicator label="Fee" value="-4.20" currency="EUR" />,
  },
  {
    id: "transaction",
    component: "TransactionStatus",
    title: "Transaction Status",
    reading: "Processing",
    role: "info",
    color: "#becaff",
    exit: 4,
    rho: -2.6,
    energy: 3,
    code: '<TransactionStatus status="processing" />',
    render: () => <TransactionStatus status="processing" />,
  },
  {
    id: "kyc",
    component: "KYCStatus",
    title: "KYC Status",
    reading: "Verified",
    role: "positive",
    color: "#70dfb2",
    exit: 24,
    rho: 1.2,
    energy: 2,
    code: '<KYCStatus status="verified" />',
    render: () => <KYCStatus status="verified" />,
  },
  {
    id: "risk",
    component: "RiskLevelIndicator",
    title: "Risk Level Indicator",
    reading: "Medium",
    role: "warning",
    color: "#f2cd7e",
    exit: 44,
    rho: -0.9,
    energy: 4,
    code: '<RiskLevelIndicator level="medium" />',
    render: () => <RiskLevelIndicator level="medium" />,
  },
  {
    id: "quote",
    component: "BidAskDisplay",
    title: "Bid / Ask Display",
    reading: "EUR/USD 1.0842 / 1.0844",
    role: "neutral",
    color: "#adbad0",
    exit: 63,
    rho: 3.4,
    energy: 3,
    code: '<BidAskDisplay symbol="EUR/USD" bid="1.0842" ask="1.0844" spread="0.0002" />',
    render: () => (
      <BidAskDisplay symbol="EUR/USD" bid="1.0842" ask="1.0844" spread="0.0002" />
    ),
  },
];
