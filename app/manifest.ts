import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Alhimik Studio",
    short_name: "Alhimik",
    description:
      "Иммерсивная студия: VR, AR, AI-опыт, 3D-шоукейсы и интерактивные цифровые продукты.",
    start_url: "/",
    display: "standalone",
    background_color: "#07080d",
    theme_color: "#00c6ff",
    orientation: "portrait",
    icons: [
      {
        src: "/logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
