import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://tra-bell.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/api/", "/(dashboard)/", "/(auth)/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
