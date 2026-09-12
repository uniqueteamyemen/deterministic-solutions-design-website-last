import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

const PayLock = lazy(() => import("./pages/PayLock"));
const Catalog = lazy(() => import("./pages/Catalog"));
const PayLockCatalog = lazy(() => import("./pages/PayLockCatalog"));
const InstitutionalPage = lazy(() => import("./pages/InstitutionalPage"));
const TechnicalLibrary = lazy(() => import("./pages/TechnicalLibrary"));
const NotFound = lazy(() => import("./pages/NotFound"));

function Router() {
  return (
    <Suspense fallback={<main className="route-loading" aria-live="polite">Loading DS&amp;D system file…</main>}>
      <Switch>
        <Route path={"/"} component={Home} />
        <Route path={"/paylock"} component={PayLock} />
        <Route path={"/catalog"} component={Catalog} />
        <Route path={"/paylock/catalog"} component={PayLockCatalog} />
        <Route path={"/hc-cxl"} component={InstitutionalPage} />
        <Route path={"/ssdd"} component={InstitutionalPage} />
        <Route path={"/evidence"} component={InstitutionalPage} />
        <Route path={"/library"} component={TechnicalLibrary} />
        <Route path={"/technical-library"} component={TechnicalLibrary} />
        <Route path={"/about"} component={InstitutionalPage} />
        <Route path={"/contact"} component={InstitutionalPage} />
        <Route path={"/404"} component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
