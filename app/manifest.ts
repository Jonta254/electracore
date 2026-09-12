import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ElectraCore",
    short_name: "ElectraCore",
    description: "Electrical learning, calculation, reference, and preliminary design tools with visible working.",
    start_url: "/",
    display: "standalone",
    background_color: "#070A0C",
    theme_color: "#070A0C",
    icons: [{ src: "/icon.png", sizes: "any", type: "image/png" }],
  };
}
