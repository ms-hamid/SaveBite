import type { ScreenFolder } from "../screens";
import { ScreenByFolder } from "../screen/ScreenByFolder";

type OrderDetailState = "upcoming" | "ready" | "completed" | "cancelled";

type OrderDetailRouteProps = {
  state: OrderDetailState;
};

const ORDER_DETAIL_FOLDER: Record<OrderDetailState, ScreenFolder> = {
  upcoming: "order_detail_upcoming_state",
  ready: "order_detail_ready_state",
  completed: "order_detail_completed_with_impact",
  cancelled: "order_detail_cancelled_state",
};

export function OrderDetailRoute({ state }: OrderDetailRouteProps) {
  return <ScreenByFolder folder={ORDER_DETAIL_FOLDER[state]} />;
}

