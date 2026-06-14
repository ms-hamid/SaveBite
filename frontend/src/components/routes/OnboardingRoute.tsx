import type { ScreenFolder } from "../screens";
import { ScreenByFolder } from "../screen/ScreenByFolder";

type OnboardingStep = "economy" | "process" | "sustainability";

type OnboardingRouteProps = {
  step: OnboardingStep;
};

const ONBOARDING_FOLDER: Record<OnboardingStep, ScreenFolder> = {
  economy: "savebite_onboarding_economy",
  process: "savebite_onboarding_process",
  sustainability: "savebite_onboarding_sustainability",
};

export function OnboardingRoute({ step }: OnboardingRouteProps) {
  return <ScreenByFolder folder={ONBOARDING_FOLDER[step]} />;
}

