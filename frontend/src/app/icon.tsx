import { ImageResponse } from "next/og";
import { AppIcon } from "@/lib/appIcon";

// Favicon in het browsertabblad.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(<AppIcon size={64} padding={0.06} />, size);
}
