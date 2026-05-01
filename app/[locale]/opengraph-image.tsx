import { ImageResponse } from "next/og";

export const alt = "Chromi";

export const size = {
  width: 1200,
  height: 630
};

export const contentType = "image/png";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function OpengraphImage({ params }: Props) {
  const { locale } = await params;
  const subtitle =
    locale === "zh" ? "无需照片 · 16 季型色彩分析" : "Image-free · 16-season color analysis";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fff9f2 0%, #f3e5dc 45%, #ead4ca 100%)",
          color: "#171313",
          fontFamily:
            'ui-sans-serif, system-ui, "Segoe UI", Roboto, "Noto Sans SC", "PingFang SC", sans-serif'
        }}
      >
        <div
          style={{
            fontSize: 88,
            fontWeight: 600,
            letterSpacing: "-0.02em",
            fontFamily: "Georgia, 'Times New Roman', serif"
          }}
        >
          Chromi
        </div>
        <div
          style={{
            marginTop: 24,
            fontSize: 30,
            fontWeight: 500,
            opacity: 0.85
          }}
        >
          {subtitle}
        </div>
      </div>
    ),
    { ...size }
  );
}
