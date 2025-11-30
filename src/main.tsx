import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import * as Sentry from "@sentry/react";

import * as TanStackQueryProvider from "./integrations/tanstack-query/root-provider.tsx";
import { config } from "@/lib/config";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";

import "./styles.css";

// Create a new router instance

const TanStackQueryProviderContext = TanStackQueryProvider.getContext();
const router = createRouter({
  routeTree,
  context: {
    ...TanStackQueryProviderContext,
  },
  defaultPreload: "intent",
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

// Setup Sentry logging
Sentry.init({
  dsn: "https://31a8c418bf02209e32da099168a1cf4d@o4510454717612032.ingest.us.sentry.io/4510454720233472",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true,
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Enable logs to be sent to Sentry
  enableLogs: true,
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", new RegExp(`^${config.apiBaseUrl}`)],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

// Render the app
const rootElement = document.getElementById("app");
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <StrictMode>
      <TanStackQueryProvider.Provider {...TanStackQueryProviderContext}>
        <RouterProvider router={router} />
      </TanStackQueryProvider.Provider>
    </StrictMode>,
  );
}
