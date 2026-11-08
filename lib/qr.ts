import QRCode from "qrcode";

export function verificationUrl(kind: "certificate" | "offer", publicId: string) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  return `${base}/verify/${kind}/${encodeURIComponent(publicId)}`;
}

export async function generateQrDataUrl(url: string) {
  return QRCode.toDataURL(url, {
    margin: 1,
    width: 240,
    color: { dark: "#0B1D36", light: "#FFFFFF" },
  });
}
