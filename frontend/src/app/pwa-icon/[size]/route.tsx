import { ImageResponse } from "next/og";
import { AppIcon } from "@/lib/appIcon";

// Iconen voor het app-manifest: /pwa-icon/192 en /pwa-icon/512.
export async function GET(_req: Request, { params }: { params: Promise<{ size: string }> }) {
  const { size } = await params;
  const px = size === "512" ? 512 : 192;
  return new ImageResponse(<AppIcon size={px} />, {
    width: px,
    height: px,
    headers: { "Cache-Control": "public, max-age=86400" },
  });
}
