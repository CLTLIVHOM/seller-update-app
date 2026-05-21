import { useState } from "react";

// ─── LISTING DATA — UPDATE THIS EACH WEEK ───────────────────────────────────
const LISTINGS = [
  {
    password: "burning2024",
    address: "7778 Burning Ridge Dr",
    neighborhood: "Palisades",
    city: "Charlotte, NC",
    listPrice: "$649,000",
    sellerName: "The Johnson Family",
    weekNumber: 2,
    goLiveDate: "May 12, 2026",
    stats: {
      totalShowings: 11,
      thisWeekShowings: 4,
      openHouseAttendees: 23,
      onlineSavedCount: 847,
    },
    feedbackPositive: [
      "Kitchen and open layout consistently praised",
      "Backyard and outdoor space a top highlight",
      "Price point seen as competitive for the area",
    ],
    feedbackConcerns: [
      "A few buyers wanted larger primary closet",
      "One group concerned about proximity to Hwy 16",
    ],
    marketContext:
      "Two new listings came to market in Palisades this week at similar price points. We remain the strongest value per square foot in the neighborhood. Days on market for comparable homes is averaging 18 days right now.",
    agentRead:
      "Traffic has been strong and feedback is positive. The concerns we're hearing are not dealbreakers for serious buyers — they're negotiating points. I'd like to give it one more week of full exposure before we reassess pricing strategy. I'll reach out Thursday to discuss.",
    nextSteps: [
      "Open House scheduled for Sunday, May 26, 1–4pm",
      "Paid social ad running through May 28",
      "Agent follow-up calls going out Monday",
      "Price strategy review call with you on Thursday",
    ],
    agentPhone: "704.806.6543",
    agentEmail: "kristen@charlottelivinghome.com",
    agentWeb: "www.charlottelivinghome.com",
  },
  {
    password: "whitepoint903",
    address: "903 White Point Rd",
    neighborhood: "Dilworth",
    city: "Charlotte, NC",
    listPrice: "$785,000",
    sellerName: "The Smith Family",
    weekNumber: 1,
    goLiveDate: "May 19, 2026",
    stats: {
      totalShowings: 6,
      thisWeekShowings: 6,
      openHouseAttendees: 14,
      onlineSavedCount: 512,
    },
    feedbackPositive: [
      "Location and walkability mentioned by nearly every group",
      "Character and original details well received",
      "Outdoor entertaining space a standout",
    ],
    feedbackConcerns: [
      "Some buyers flagged the master bath as dated",
      "One group asked about the HVAC age",
    ],
    marketContext:
      "Dilworth inventory remains tight. Only 3 comparable homes active right now. We launched at the right time — demand in this neighborhood is strong heading into summer.",
    agentRead:
      "Excellent first week. Six showings in launch week is above average for Dilworth. The feedback we're getting is constructive and manageable. No red flags. Staying the course.",
    nextSteps: [
      "Broker Open on Tuesday, May 27, 11am–1pm",
      "Open House Sunday, June 1, 2–4pm",
      "Social media feature reel going live Wednesday",
      "Week 2 update will land in your inbox next Sunday",
    ],
    agentPhone: "704.806.6543",
    agentEmail: "kristen@charlottelivinghome.com",
    agentWeb: "www.charlottelivinghome.com",
  },
];
// ────────────────────────────────────────────────────────────────────────────

const BRAND = {
  burgundy: "#670038",
  burgundyLight: "rgba(103,0,56,0.06)",
  charcoal: "#2a2223",
  taupe: "#867268",
  sage: "#bcd6c7",
  sageDark: "#7aab96",
  sageLight: "rgba(188,214,199,0.15)",
  white: "#ffffff",
  offWhite: "#f9f6f4",
  border: "#e8e0dc",
  textMuted: "#9e8c85",
};

function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleSubmit = () => {
    const listing = LISTINGS.find((l) => l.password === password.trim().toLowerCase());
    if (listing) {
      onLogin(listing);
    } else {
      setError(true);
      setShake(true);
      setTimeout(() => setShake(false), 600);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: BRAND.offWhite,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Jost', sans-serif",
      padding: "24px",
    }}>
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input:focus { outline: none; border-color: ${BRAND.burgundy} !important; box-shadow: 0 0 0 3px rgba(103,0,56,0.08) !important; }
      `}</style>
      <div style={{
        background: BRAND.white,
        borderRadius: "20px",
        padding: "52px 44px",
        maxWidth: "420px",
        width: "100%",
        textAlign: "center",
        boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
        borderTop: `4px solid ${BRAND.burgundy}`,
        animation: "fadeUp 0.5s ease forwards",
      }}>
        <div style={{
          width: "56px", height: "56px", borderRadius: "50%",
          background: BRAND.sageLight, border: `2px solid ${BRAND.sage}`,
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 20px", fontSize: "22px",
        }}>🏡</div>

        <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 300, color: BRAND.charcoal, marginBottom: "6px", letterSpacing: "0.5px" }}>
          Your Home Update
        </div>
        <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: BRAND.taupe, marginBottom: "32px", fontWeight: 500 }}>
          Kristen Dibble · Charlotte Living & Homes
        </div>

        <p style={{ fontSize: "13px", color: BRAND.taupe, marginBottom: "24px", lineHeight: 1.7 }}>
          Enter the access code from your welcome email to view your listing update.
        </p>

        <div style={{ animation: shake ? "shake 0.5s ease" : "none" }}>
          <input
            type="password"
            placeholder="Enter your access code"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            style={{
              width: "100%", padding: "13px 16px", border: `1.5px solid ${error ? BRAND.burgundy : BRAND.border}`,
              borderRadius: "10px", fontSize: "14px", fontFamily: "'Jost', sans-serif",
              color: BRAND.charcoal, background: BRAND.white, boxSizing: "border-box",
              marginBottom: "8px", transition: "border-color 0.2s",
            }}
          />
          {error && <div style={{ fontSize: "12px", color: BRAND.burgundy, marginBottom: "8px" }}>That code doesn't match. Please try again.</div>}
        </div>

        <button
          onClick={handleSubmit}
          style={{
            width: "100%", padding: "13px", background: BRAND.burgundy, border: "none",
            borderRadius: "10px", color: BRAND.white, fontSize: "13px", fontWeight: 600,
            fontFamily: "'Jost', sans-serif", cursor: "pointer", letterSpacing: "1px",
            textTransform: "uppercase", marginTop: "8px",
          }}
        >
          View My Update
        </button>

        <div style={{ marginTop: "28px", paddingTop: "20px", borderTop: `1px solid ${BRAND.border}`, fontSize: "11px", color: BRAND.textMuted }}>
          Questions? Call or text Kristen at 704.806.6543
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, value, label }) {
  return (
    <div style={{
      background: BRAND.white, borderRadius: "14px", padding: "24px 20px",
      textAlign: "center", border: `1px solid ${BRAND.border}`,
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    }}>
      <div style={{ fontSize: "24px", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", fontWeight: 600, color: BRAND.burgundy, lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: BRAND.taupe, marginTop: "6px", fontWeight: 500 }}>{label}</div>
    </div>
  );
}

function Section({ title, children, accent }) {
  return (
    <div style={{
      background: accent ? BRAND.sageLight : BRAND.white,
      borderRadius: "16px", padding: "28px 28px",
      border: `1px solid ${accent ? BRAND.sage : BRAND.border}`,
      marginBottom: "16px",
    }}>
      <div style={{
        fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase",
        color: accent ? BRAND.sageDark : BRAND.burgundy, fontWeight: 600, marginBottom: "16px",
      }}>{title}</div>
      {children}
    </div>
  );
}

function Dashboard({ listing, onLogout }) {
  const weekLabel = listing.weekNumber === 1 ? "Week 1 — Launch" : `Week ${listing.weekNumber}`;

  return (
    <div style={{ minHeight: "100vh", background: BRAND.offWhite, fontFamily: "'Jost', sans-serif" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.4s ease forwards; }
        .fade-up-1 { animation: fadeUp 0.4s ease 0.1s both; }
        .fade-up-2 { animation: fadeUp 0.4s ease 0.2s both; }
        .fade-up-3 { animation: fadeUp 0.4s ease 0.3s both; }
        .fade-up-4 { animation: fadeUp 0.4s ease 0.4s both; }
      `}</style>

      {/* Header */}
      <div style={{
        background: BRAND.charcoal, borderBottom: `3px solid ${BRAND.burgundy}`,
        padding: "0 32px", minHeight: "72px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ color: BRAND.sage, fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", fontWeight: 500, marginBottom: "2px" }}>
            Charlotte Living & Homes
          </div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", color: BRAND.white, fontSize: "20px", fontWeight: 300 }}>
            {listing.address}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: BRAND.sage, fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase" }}>{weekLabel}</div>
            <div style={{ color: BRAND.textMuted, fontSize: "11px" }}>Listed {listing.goLiveDate}</div>
          </div>
          <button onClick={onLogout} style={{
            background: "transparent", border: `1px solid rgba(255,255,255,0.2)`, borderRadius: "8px",
            color: BRAND.textMuted, fontSize: "11px", padding: "6px 12px", cursor: "pointer",
            fontFamily: "'Jost', sans-serif",
          }}>Sign Out</button>
        </div>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "32px 24px" }}>

        {/* Welcome */}
        <div className="fade-up" style={{ marginBottom: "28px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "32px", fontWeight: 300, color: BRAND.charcoal, marginBottom: "6px" }}>
            Hello, {listing.sellerName.split(" ")[1] || listing.sellerName}. 👋
          </div>
          <div style={{ fontSize: "13px", color: BRAND.taupe, lineHeight: 1.8 }}>
            Here's your {weekLabel.toLowerCase()} market update for <strong style={{ color: BRAND.charcoal }}>{listing.address}</strong> — listed at <strong style={{ color: BRAND.charcoal }}>{listing.listPrice}</strong>.
          </div>
        </div>

        {/* Stats Grid */}
        <div className="fade-up-1" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "16px" }}>
          <StatCard icon="🚪" value={listing.stats.totalShowings} label="Total Showings" />
          <StatCard icon="📅" value={listing.stats.thisWeekShowings} label="This Week" />
          <StatCard icon="👥" value={listing.stats.openHouseAttendees} label="Open House" />
          <StatCard icon="❤️" value={listing.stats.onlineSavedCount.toLocaleString()} label="Online Saves" />
        </div>

        {/* Feedback */}
        <div className="fade-up-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
          <Section title="What Buyers Are Loving">
            {listing.feedbackPositive.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: BRAND.sage, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                  <span style={{ fontSize: "9px", color: "#2a5a3a" }}>✓</span>
                </div>
                <span style={{ fontSize: "13px", color: BRAND.charcoal, lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </Section>
          <Section title="Feedback to Note">
            {listing.feedbackConcerns.map((item, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "flex-start" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#f0e8d8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: "1px" }}>
                  <span style={{ fontSize: "9px", color: "#8a6a3a" }}>!</span>
                </div>
                <span style={{ fontSize: "13px", color: BRAND.charcoal, lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </Section>
        </div>

        {/* Market Context */}
        <div className="fade-up-3">
          <Section title="Market Context">
            <p style={{ fontSize: "13px", color: BRAND.charcoal, lineHeight: 1.8, margin: 0 }}>{listing.marketContext}</p>
          </Section>

          {/* Kristen's Read */}
          <Section title="Kristen's Strategic Read" accent>
            <p style={{ fontSize: "14px", color: BRAND.charcoal, lineHeight: 1.9, margin: 0, fontStyle: "italic", fontFamily: "'Cormorant Garamond', serif", fontSize: "17px", fontWeight: 300 }}>
              "{listing.agentRead}"
            </p>
          </Section>

          {/* Next Steps */}
          <Section title="What's Happening Next">
            {listing.nextSteps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "12px", marginBottom: "10px", alignItems: "flex-start" }}>
                <div style={{
                  width: "22px", height: "22px", borderRadius: "50%", background: BRAND.burgundyLight,
                  border: `1px solid ${BRAND.burgundy}`, display: "flex", alignItems: "center",
                  justifyContent: "center", flexShrink: 0, fontSize: "10px", color: BRAND.burgundy, fontWeight: 600,
                }}>
                  {i + 1}
                </div>
                <span style={{ fontSize: "13px", color: BRAND.charcoal, lineHeight: 1.7, paddingTop: "2px" }}>{step}</span>
              </div>
            ))}
          </Section>
        </div>

        {/* Contact Footer */}
        <div className="fade-up-4" style={{
          background: BRAND.charcoal, borderRadius: "16px", padding: "28px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          flexWrap: "wrap", gap: "16px",
        }}>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", color: BRAND.white, fontSize: "20px", fontWeight: 300, marginBottom: "4px" }}>
              Kristen Dibble
            </div>
            <div style={{ color: BRAND.sage, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase" }}>
              Realtor® · BHHS Carolinas Realty
            </div>
          </div>
          <div style={{ display: "flex", gap: "24px" }}>
            <a href={`tel:${listing.agentPhone}`} style={{ color: BRAND.textMuted, fontSize: "13px", textDecoration: "none" }}>
              📞 {listing.agentPhone}
            </a>
            <a href={`mailto:${listing.agentEmail}`} style={{ color: BRAND.textMuted, fontSize: "13px", textDecoration: "none" }}>
              ✉️ {listing.agentEmail}
            </a>
          </div>
          <a href={`https://${listing.agentWeb}`} target="_blank" rel="noreferrer" style={{
            padding: "10px 20px", background: BRAND.burgundy, borderRadius: "8px",
            color: BRAND.white, fontSize: "11px", fontWeight: 600, textDecoration: "none",
            letterSpacing: "1px", textTransform: "uppercase",
          }}>
            {listing.agentWeb}
          </a>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px", fontSize: "11px", color: BRAND.textMuted }}>
          This update is private and intended only for {listing.sellerName}. © Kristen Dibble · Charlotte Living & Homes
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [listing, setListing] = useState(null);
  return listing
    ? <Dashboard listing={listing} onLogout={() => setListing(null)} />
    : <LoginScreen onLogin={setListing} />;
}