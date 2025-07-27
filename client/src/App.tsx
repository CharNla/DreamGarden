import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Onboarding from "@/pages/onboarding";
import AlarmSetting from "@/pages/alarm-setting";
import WakeUp from "@/pages/wake-up";
import SleepRating from "@/pages/sleep-rating";
import Garden from "@/pages/garden";
import Chat from "@/pages/chat";
import SleepDiary from "@/pages/sleep-diary";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Onboarding} />
      <Route path="/onboarding" component={Onboarding} />
      <Route path="/alarm-setting" component={AlarmSetting} />
      <Route path="/wake-up" component={WakeUp} />
      <Route path="/sleep-rating" component={SleepRating} />
      <Route path="/garden" component={Garden} />
      <Route path="/chat" component={Chat} />
      <Route path="/sleep-diary" component={SleepDiary} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="mobile-container">
          <Toaster />
          <Router />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
