import { useState, type ReactNode, } from "react";

// ─── TYPES ────────────────────────────────────────────────────────────────────

type TabId = "card" | "upi" | "netbanking" | "wallet";
type Status = "idle" | "processing" | "success";

interface Tab {
    id: TabId;
    label: string;
    icon: React.ReactNode;
}

interface UpiApp {
    id: string;
    label: string;
    bg: string;
    text: string;
    textColor: string;
}

interface Bank {
    id: string;
    label: string;
    abbr: string;
    color: string;
}

interface Wallet {
    id: string;
    name: string;
    sub: string;
    bg: string;
    text: string;
}

interface OrderDetail {
    label: string;
    value: string;
}

export interface PaymentModalProps {
    amount?: string;
    merchantName?: string;
    merchantInitial?: string;
    description?: string;
    orderId?: string;
    customerName?: string;
    customerEmail?: string;
    onClose?: () => void;
    onSuccess?: (txnId: string) => void;
}

// ─── CONSTANTS ────────────────────────────────────────────────────────────────

const TABS: Tab[] = [
    {
        id: "card",
        label: "Card",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
        ),
    },
    {
        id: "upi",
        label: "UPI",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
            </svg>
        ),
    },
    {
        id: "netbanking",
        label: "Net Banking",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        id: "wallet",
        label: "Wallet",
        icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M20 12V22H4a2 2 0 01-2-2V6c0-1.1.9-2 2-2h14l4 4v4z" />
                <circle cx="16" cy="12" r="1" fill="currentColor" />
            </svg>
        ),
    },
];

const UPI_APPS: UpiApp[] = [
    { id: "gpay", label: "Google Pay", bg: "bg-white border border-gray-200", text: "G", textColor: "text-blue-600" },
    { id: "phonepe", label: "PhonePe", bg: "bg-purple-700", text: "Pe", textColor: "text-white" },
    { id: "paytm", label: "Paytm", bg: "bg-sky-400", text: "P", textColor: "text-white" },
    { id: "bhim", label: "BHIM", bg: "bg-orange-500", text: "B", textColor: "text-white" },
];

const BANKS: Bank[] = [
    { id: "sbi", label: "State Bank", abbr: "SBI", color: "bg-blue-800" },
    { id: "hdfc", label: "HDFC Bank", abbr: "HDFC", color: "bg-red-600" },
    { id: "icici", label: "ICICI Bank", abbr: "ICICI", color: "bg-orange-500" },
    { id: "axis", label: "Axis Bank", abbr: "Axis", color: "bg-red-700" },
    { id: "pnb", label: "Punjab Natl", abbr: "PNB", color: "bg-blue-500" },
    { id: "kotak", label: "Kotak", abbr: "Kotak", color: "bg-pink-800" },
];

const WALLETS: Wallet[] = [
    { id: "paytm", name: "Paytm Wallet", sub: "Balance: ₹342.50", bg: "bg-sky-400", text: "P" },
    { id: "mobikwik", name: "Mobikwik", sub: "SuperCash available", bg: "bg-orange-500", text: "MZ" },
    { id: "ola", name: "Ola Money", sub: "Postpaid available", bg: "bg-purple-600", text: "OL" },
    { id: "amazon", name: "Amazon Pay", sub: "5% cashback on first use", bg: "bg-green-600", text: "AM" },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function formatCardNumber(val: string): string {
    const digits = val.replace(/\D/g, "").substring(0, 16);
    return digits.match(/.{1,4}/g)?.join(" ") ?? digits;
}

function formatExpiry(val: string): string {
    const digits = val.replace(/\D/g, "").substring(0, 4);
    return digits.length >= 2 ? `${digits.substring(0, 2)} / ${digits.substring(2)}` : digits;
}

function detectCardType(num: string): string | null {
    const v = num.replace(/\s/g, "");
    if (v.startsWith("4")) return "VISA";
    if (v.startsWith("5")) return "MC";
    if (v.startsWith("3")) return "AMEX";
    return null;
}

function generateTxnId(): string {
    return "pay_" + Math.random().toString(36).substring(2, 12).toUpperCase();
}

// ─── CARD TAB ─────────────────────────────────────────────────────────────────

function CardTab(): ReactNode {
    const [cardNum, setCardNum] = useState<string>("");
    const [name, setName] = useState<string>("");
    const [expiry, setExpiry] = useState<string>("");
    const [cvv, setCvv] = useState<string>("");

    const cardType = detectCardType(cardNum);

    return (
        <div>
            {/* Accepted cards strip */}
            <div className="flex items-center gap-2 mb-4 px-3 py-2.5 bg-blue-50 border border-blue-100 rounded-lg">
                <svg width="30" height="20" viewBox="0 0 40 24">
                    <circle cx="14" cy="12" r="10" fill="#eb001b" />
                    <circle cx="26" cy="12" r="10" fill="#f79e1b" opacity="0.85" />
                </svg>
                <svg width="34" height="20" viewBox="0 0 60 24">
                    <text x="0" y="18" fontSize="20" fontWeight="700" fill="#1a1f71" fontFamily="serif">VISA</text>
                </svg>
                <span className="text-xs text-gray-400 ml-1">We accept all major cards</span>
                {cardType && (
                    <span className="ml-auto text-xs font-semibold bg-blue-600 text-white px-2 py-0.5 rounded">
                        {cardType}
                    </span>
                )}
            </div>

            {/* Card Number */}
            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Card Number</label>
                <input
                    type="text"
                    value={cardNum}
                    onChange={(e) => setCardNum(formatCardNumber(e.target.value))}
                    maxLength={19}
                    placeholder="0000 0000 0000 0000"
                    autoComplete="cc-number"
                    className="w-full h-11 px-3 border border-gray-300 rounded-md text-sm font-mono tracking-widest
                     focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
            </div>

            {/* Cardholder Name */}
            <div className="mb-4">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Cardholder Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name on card"
                    autoComplete="cc-name"
                    className="w-full h-11 px-3 border border-gray-300 rounded-md text-sm
                     focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                />
            </div>

            {/* Expiry + CVV */}
            <div className="flex gap-3">
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Expiry</label>
                    <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(formatExpiry(e.target.value))}
                        maxLength={7}
                        placeholder="MM / YY"
                        autoComplete="cc-exp"
                        className="w-full h-11 px-3 border border-gray-300 rounded-md text-sm font-mono tracking-wider
                       focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">CVV</label>
                    <input
                        type="password"
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").substring(0, 4))}
                        maxLength={4}
                        placeholder="•••"
                        autoComplete="cc-csc"
                        className="w-full h-11 px-3 border border-gray-300 rounded-md text-sm font-mono tracking-widest
                       focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
                    />
                </div>
            </div>
        </div>
    );
}

// ─── UPI TAB ──────────────────────────────────────────────────────────────────

function UpiTab(): ReactNode {
    const [selectedApp, setSelectedApp] = useState<string | null>(null);
    const [upiId, setUpiId] = useState<string>("");

    const isValidUpi = /@/.test(upiId);

    const borderClass =
        upiId.length > 3
            ? isValidUpi
                ? "border-green-500 focus:ring-green-100"
                : "border-red-400 focus:ring-red-100"
            : "border-gray-300 focus:border-blue-500 focus:ring-blue-100";

    return (
        <div>
            {/* App grid */}
            <div className="grid grid-cols-4 gap-2 mb-4">
                {UPI_APPS.map((app) => (
                    <button
                        key={app.id}
                        type="button"
                        onClick={() => { setSelectedApp(app.id); setUpiId(""); }}
                        className={`flex flex-col items-center gap-1.5 py-3 px-1 rounded-lg border text-xs font-medium transition cursor-pointer
              ${selectedApp === app.id
                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                : "border-gray-200 text-gray-600 hover:border-blue-300 hover:bg-blue-50"}`}
                    >
                        <div className={`w-9 h-9 rounded-lg ${app.bg} flex items-center justify-center font-bold text-sm ${app.textColor}`}>
                            {app.text}
                        </div>
                        {app.label}
                    </button>
                ))}
            </div>

            {/* Divider */}
            <div className="relative flex items-center my-4">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="mx-3 text-xs text-gray-400">or enter UPI ID</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* UPI ID input */}
            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">UPI ID</label>
                <input
                    type="text"
                    value={upiId}
                    onChange={(e) => { setUpiId(e.target.value); setSelectedApp(null); }}
                    placeholder="yourname@paytm / @okicici"
                    className={`w-full h-11 px-3 border rounded-md text-sm focus:outline-none focus:ring-2 transition ${borderClass}`}
                />
                <p className="text-xs text-gray-400 mt-1.5">Your UPI ID will not be stored</p>
            </div>
        </div>
    );
}

// ─── NET BANKING TAB ──────────────────────────────────────────────────────────

function NetBankingTab(): ReactNode {
    const [selectedBank, setSelectedBank] = useState<string | null>(null);

    return (
        <div>
            <div className="grid grid-cols-3 gap-2 mb-4">
                {BANKS.map((bank) => (
                    <button
                        key={bank.id}
                        type="button"
                        onClick={() => setSelectedBank(bank.id)}
                        className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-lg border text-xs font-medium transition cursor-pointer
              ${selectedBank === bank.id
                                ? "border-blue-500 bg-blue-50 text-blue-600"
                                : "border-gray-200 text-gray-500 hover:border-blue-300 hover:bg-blue-50"}`}
                    >
                        <div className={`w-9 h-7 rounded ${bank.color} flex items-center justify-center text-white text-[10px] font-bold`}>
                            {bank.abbr}
                        </div>
                        {bank.label}
                    </button>
                ))}
            </div>

            <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">Other banks</label>
                <select className="w-full h-11 px-3 border border-gray-300 rounded-md text-sm text-gray-700 bg-white
                           focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition">
                    <option value="">Select your bank</option>
                    <option>Bank of Baroda</option>
                    <option>Canara Bank</option>
                    <option>Indian Bank</option>
                    <option>IndusInd Bank</option>
                    <option>Yes Bank</option>
                    <option>Union Bank of India</option>
                    <option>IDFC First Bank</option>
                    <option>Federal Bank</option>
                </select>
            </div>
        </div>
    );
}

// ─── WALLET TAB ───────────────────────────────────────────────────────────────

function WalletTab(): ReactNode {
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

    return (
        <div className="flex flex-col gap-2.5">
            {WALLETS.map((w) => (
                <button
                    key={w.id}
                    type="button"
                    onClick={() => setSelectedWallet(w.id)}
                    className={`flex items-center gap-3 px-3.5 py-3 rounded-lg border transition cursor-pointer w-full text-left
            ${selectedWallet === w.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"}`}
                >
                    <div className={`w-10 h-10 rounded-lg ${w.bg} flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                        {w.text}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-800">{w.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{w.sub}</p>
                    </div>
                    <div className={`ml-auto w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition
            ${selectedWallet === w.id ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}>
                        {selectedWallet === w.id && (
                            <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                                <polyline points="2 6 5 9 10 3" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
}

// ─── LOCK ICON ────────────────────────────────────────────────────────────────

function LockIcon({ color = "#bbb" }: { color?: string }): ReactNode {
    return (
        <svg width="10" height="12" viewBox="0 0 12 14" fill="none">
            <path d="M6 1L1 3v4c0 3 2.5 5.5 5 6 2.5-.5 5-3 5-6V3L6 1z" stroke={color} strokeWidth="1.2" fill="none" />
            <path d="M4 7l1.5 1.5L8 5" stroke={color} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────────────────

export default function PaymentModal({
    amount = "2,499.00",
    merchantName = "ShopKart Pvt. Ltd.",
    merchantInitial = "S",
    description = "Premium Plan · 1 month subscription",
    orderId = "ORD-2025-039421",
    customerName = "Priya Sharma",
    customerEmail = "priya@example.com",
    onClose,
    onSuccess,
}: PaymentModalProps): ReactNode {
    const [activeTab, setActiveTab] = useState<TabId>("card");
    const [status, setStatus] = useState<Status>("idle");
    const [txnId, setTxnId] = useState<string>("");

    const orderDetails: OrderDetail[] = [
        { label: "Order ID", value: orderId },
        { label: "Customer", value: customerName },
        { label: "Email", value: customerEmail },
    ];

    const handlePay = (): void => {
        setStatus("processing");
        setTimeout(() => {
            const id = generateTxnId();
            setTxnId(id);
            setStatus("success");
            onSuccess?.(id);
        }, 2500);
    };

    const tabContent: Record<TabId, ReactNode> = {
        card: <CardTab />,
        upi: <UpiTab />,
        netbanking: <NetBankingTab />,
        wallet: <WalletTab />,
    };

    return (
        <div className="fixed inset-0 bg-black/55 flex items-center justify-center z-50 p-4">
            {/* Close button */}
            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="fixed top-4 right-4 w-8 h-8 bg-white/15 hover:bg-white/25 rounded-full
                     flex items-center justify-center text-white transition z-50 cursor-pointer"
                >
                    ✕
                </button>
            )}

            <div className="flex w-[740px] max-w-full min-h-[500px] rounded-xl overflow-hidden shadow-2xl">

                {/* ── LEFT PANEL ── */}
                <div className="w-52 flex-shrink-0 bg-[#163c6e] text-white flex flex-col p-6">
                    {/* Brand */}
                    <div className="flex items-center gap-2.5 mb-6">
                        <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg flex-shrink-0">
                            {merchantInitial}
                        </div>
                        <span className="text-sm font-semibold leading-tight">{merchantName}</span>
                    </div>

                    {/* Amount */}
                    <p className="text-[10px] text-white/50 uppercase tracking-wider mb-1">Amount Payable</p>
                    <p className="text-3xl font-bold tracking-tight mb-1">₹{amount}</p>
                    <p className="text-xs text-white/55 leading-relaxed mb-5">{description}</p>

                    <div className="h-px bg-white/10 mb-5" />

                    {/* Order details */}
                    {orderDetails.map((item) => (
                        <div key={item.label} className="mb-3">
                            <p className="text-[9px] text-white/35 uppercase tracking-widest">{item.label}</p>
                            <p className="text-xs text-white/65 mt-0.5 break-all">{item.value}</p>
                        </div>
                    ))}

                    {/* Secure badge */}
                    <div className="mt-auto flex items-center gap-1.5 text-[10px] text-white/35">
                        <LockIcon color="currentColor" />
                        Secured by Razorpay
                    </div>
                </div>

                {/* ── RIGHT PANEL ── */}
                <div className="flex-1 bg-white flex flex-col">
                    {status === "success" ? (
                        // ── SUCCESS STATE ──
                        <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
                            <div className="w-16 h-16 rounded-full bg-green-600 flex items-center justify-center mb-5">
                                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                                    <polyline points="20 6 9 17 4 12" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
                            <p className="text-sm text-gray-500 leading-relaxed mb-5">
                                ₹{amount} paid to {merchantName}
                                <br />You'll receive a confirmation email shortly.
                            </p>
                            <span className="bg-gray-100 text-gray-500 text-xs font-mono px-4 py-1.5 rounded-full">
                                TXN • {txnId}
                            </span>
                        </div>
                    ) : (
                        <>
                            {/* ── TABS ── */}
                            <div className="flex border-b border-gray-100 bg-gray-50">
                                {TABS.map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex-1 flex flex-col items-center gap-1 py-3 text-[11px] font-medium border-b-2 transition cursor-pointer
                      ${activeTab === tab.id
                                                ? "border-blue-600 text-blue-600 bg-white"
                                                : "border-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100"}`}
                                    >
                                        {tab.icon}
                                        {tab.label}
                                    </button>
                                ))}
                            </div>

                            {/* ── TAB CONTENT ── */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {tabContent[activeTab]}
                            </div>

                            {/* ── PAY BUTTON ── */}
                            <div className="px-6 pb-5 pt-3 border-t border-gray-100">
                                <button
                                    type="button"
                                    onClick={handlePay}
                                    disabled={status === "processing"}
                                    className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white
                             font-semibold text-[15px] rounded-lg flex items-center justify-center gap-2
                             transition active:scale-[0.99] cursor-pointer"
                                >
                                    {status === "processing" ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                                                <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                                                <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                                            </svg>
                                            Processing...
                                        </>
                                    ) : (
                                        `Pay ₹${amount}`
                                    )}
                                </button>

                                <p className="text-center text-[11px] text-gray-400 mt-2.5 flex items-center justify-center gap-1">
                                    <LockIcon />
                                    Safe &amp; secure payments. Powered by Razorpay.
                                </p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

/*
  ── USAGE ────────────────────────────────────────────────────────────────────

  import { useState } from "react";
  import PaymentModal from "./PaymentModal";

  function App() {
    const [open, setOpen] = useState(false);

    return (
      <>
        <button onClick={() => setOpen(true)}>Pay Now</button>

        {open && (
          <PaymentModal
            amount="2,499.00"
            merchantName="ShopKart Pvt. Ltd."
            merchantInitial="S"
            description="Premium Plan · 1 month subscription"
            orderId="ORD-2025-039421"
            customerName="Priya Sharma"
            customerEmail="priya@example.com"
            onClose={() => setOpen(false)}
            onSuccess={(txnId: string) => {
              console.log("Payment done! TXN:", txnId);
              setOpen(false);
            }}
          />
        )}
      </>
    );
  }

  ── TAILWIND CONFIG (popIn animation) ───────────────────────────────────────

  // tailwind.config.ts
  theme: {
    extend: {
      keyframes: {
        popIn: {
          from: { transform: "scale(0.92)", opacity: "0" },
          to:   { transform: "scale(1)",    opacity: "1" },
        },
      },
      animation: {
        popIn: "popIn 0.25s ease-out",
      },
    },
  },

  ── RAZORPAY INTEGRATE KARNA HO TAB ─────────────────────────────────────────

  onSuccess callback mein ye add karo:

  const options = {
    key: "YOUR_RAZORPAY_KEY_ID",
    amount: 249900,             // paise mein (₹2499 = 249900)
    currency: "INR",
    name: "ShopKart Pvt. Ltd.",
    description: "Premium Plan",
    order_id: "order_id_from_backend",
    handler: (response: {
      razorpay_payment_id: string;
      razorpay_order_id: string;
      razorpay_signature: string;
    }) => {
      console.log(response.razorpay_payment_id);
      // verify signature on backend
    },
    prefill: {
      name: "Priya Sharma",
      email: "priya@example.com",
    },
    theme: { color: "#2563eb" },
  };

  const rzp = new (window as any).Razorpay(options);
  rzp.open();
*/