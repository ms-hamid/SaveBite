import type { ScreenFolder } from "../screens";
import { ScreenByFolder } from "../screen/ScreenByFolder";

type PaymentRouteView = "checking" | "detail";

type PaymentRouteProps = {
  view: PaymentRouteView;
};

const PAYMENT_VIEW_FOLDER: Record<PaymentRouteView, ScreenFolder> = {
  checking: "savebite_checking_payment_screen",
  detail: "savebite_consumer_payment_detail_screen",
};

export function PaymentRoute({ view }: PaymentRouteProps) {
  return <ScreenByFolder folder={PAYMENT_VIEW_FOLDER[view]} />;
}

