import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Campaigns from "./pages/Campaigns";
import Credentials from "./pages/Credentials";
import Analytics from "./pages/Analytics";
import CRM from "./pages/CRM";
import Dashboard from "./pages/Dashboard";
import Competitors from "./pages/Competitors";
import Pricing from "./pages/Pricing";
import DeveloperLogin from "./pages/DeveloperLogin";
import DeveloperPanel from "./pages/DeveloperPanel";
import AdvancedCampaignControl from "./pages/AdvancedCampaignControl";
import MediaBoost from "./pages/MediaBoost";
import InteractiveGuide from "./pages/InteractiveGuide";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/campaigns"} component={Campaigns} />
      <Route path={"/credentials"} component={Credentials} />
      <Route path={"/analytics"} component={Analytics} />
      <Route path={"/crm"} component={CRM} />
      <Route path={"/competitors"} component={Competitors} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/developer-login"} component={DeveloperLogin} />
      <Route path={"/developer-panel"} component={DeveloperPanel} />
      <Route path={"/advanced-campaigns"} component={AdvancedCampaignControl} />
      <Route path={"/media-boost"} component={MediaBoost} />
      <Route path={"/guide"} component={InteractiveGuide} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
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
