import { MetadataRoute } from "next";


const baseUrl = "https://univ3.uncx.network"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*'
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl
  };
}
