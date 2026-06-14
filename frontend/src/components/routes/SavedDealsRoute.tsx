import { ScreenByFolder } from "../screen/ScreenByFolder";

type SavedDealsRouteProps = {
  hasDeals: boolean;
};

export function SavedDealsRoute({ hasDeals }: SavedDealsRouteProps) {
  return (
    <ScreenByFolder
      folder={hasDeals ? "savebite_saved_deals_populated" : "savebite_saved_deals_empty"}
    />
  );
}

