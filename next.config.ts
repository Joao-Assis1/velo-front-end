import type { NextConfig } from "next";
import withPWA from "@ducanh2912/next-pwa";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  fallbacks: {
    document: "/offline",
  },
  workboxOptions: {
    runtimeCaching: [
      // NetworkOnly para auth e pagamentos (nunca cachear)
      {
        urlPattern: /\/(auth|payments|payment-methods)/,
        handler: "NetworkOnly",
      },
      // NetworkFirst para chamadas de API
      {
        urlPattern: /^https:\/\/.*\/api\//,
        handler: "NetworkFirst",
        options: { networkTimeoutSeconds: 10 },
      },
    ],
  },
})(nextConfig);
