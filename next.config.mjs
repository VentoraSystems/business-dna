import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "img.clerk.com" },
    ],
  },
  experimental: {
    typedRoutes: true,
    // business-library/**'s content is read via fs.readFileSync at request
    // time (readBusinessDisplayContent(), readBlueprintGenerationContext())
    // with the business slug resolved only at runtime — Next's file tracer
    // can't statically resolve that path, so without this, Vercel's deployed
    // function bundle doesn't include these files at all and any read
    // throws ENOENT in production. Keyed by "/**" (every route) since more
    // than one route/Server Action reads business-library content, not just
    // Blueprint generation's route — see the "Vercel serverless filesystem
    // fix" commit for the full investigation.
    outputFileTracingIncludes: {
      "/**": ["business-library/**/*"],
    },
  },
};

export default withNextIntl(nextConfig);
