import { ImageResponse } from "next/og";
import { AppIcon } from "@/lib/appIcon";

// Icoon op het beginscherm van iPhone/iPad ("Zet op beginscherm").
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(<AppIcon size={180} padding={0.12} />, size);
}
