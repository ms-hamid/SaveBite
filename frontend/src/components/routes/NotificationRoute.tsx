import { ScreenByFolder } from "../screen/ScreenByFolder";

type NotificationRouteProps = {
  hasNotification: boolean;
};

export function NotificationRoute({
  hasNotification,
}: NotificationRouteProps) {
  return (
    <ScreenByFolder
      folder={hasNotification ? "refined_notifications" : "generated_screen"}
    />
  );
}

