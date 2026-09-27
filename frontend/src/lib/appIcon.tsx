/**
 * App-icoon: blauw vlak met "OV" en een groen live-stipje. Getekend als JSX voor ImageResponse (next/og),
 * zodat er geen losse afbeeldingsbestanden nodig zijn. `padding` houdt het logo binnen de veilige zone
 * van "maskable" iconen (Android snijdt die rond of in een druppelvorm bij).
 */
export function AppIcon({ size, padding = 0.18 }: { size: number; padding?: number }) {
  const inner = size * (1 - padding * 2);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#2563eb",
      }}
    >
      <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: inner, height: inner }}>
        <div style={{ color: "white", fontSize: inner * 0.52, fontWeight: 800, letterSpacing: -inner * 0.02 }}>OV</div>
        <div
          style={{
            position: "absolute",
            top: inner * 0.06,
            right: inner * 0.02,
            width: inner * 0.2,
            height: inner * 0.2,
            borderRadius: "50%",
            background: "#34d399",
            border: `${Math.max(1, inner * 0.035)}px solid white`,
          }}
        />
      </div>
    </div>
  );
}
