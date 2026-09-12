import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { defineConfig, type Plugin, type ViteDevServer } from "vite";
import express from "express";
import { createGeminiDeliveryRouter } from "./server/geminiDelivery";
import { createGitHubDeliveryRouter } from "./server/githubDelivery";
import { createInquiryRouter } from "./server/inquiries";

function vitePluginInquiryApi(): Plugin {
  return {
    name: "dsd-inquiry-api",
    configureServer(server: ViteDevServer) {
      const inquiryApp = express();
      inquiryApp.use(express.json({ limit: "16kb" }));
      inquiryApp.use("/", createInquiryRouter());
      server.middlewares.use("/api/inquiries", inquiryApp);
    },
  };
}

function vitePluginGitHubDeliveryWebhook(): Plugin {
  return {
    name: "dsd-github-delivery-webhook",
    configureServer(server: ViteDevServer) {
      const webhookApp = express();
      webhookApp.use(express.raw({ type: "application/json", limit: "64kb" }));
      webhookApp.use("/", createGitHubDeliveryRouter());
      server.middlewares.use("/api/test-webhooks/github", webhookApp);
    },
  };
}

function vitePluginGeminiDeliveryWebhook(): Plugin {
  return {
    name: "dsd-gemini-delivery-webhook",
    configureServer(server: ViteDevServer) {
      const webhookApp = express();
      webhookApp.use(express.raw({ type: "application/json", limit: "64kb" }));
      webhookApp.use("/", createGeminiDeliveryRouter());
      server.middlewares.use("/api/test-webhooks/gemini", webhookApp);
    },
  };
}

const plugins = [
  react(),
  tailwindcss(),
  jsxLocPlugin(),
  vitePluginInquiryApi(),
  vitePluginGitHubDeliveryWebhook(),
  vitePluginGeminiDeliveryWebhook(),
];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    strictPort: true,
    host: "0.0.0.0",
    allowedHosts: true,
  },
});
