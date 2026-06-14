import { screenComponentMap } from "../screens";
import type { ScreenFolder } from "../screens";

type ScreenByFolderProps = {
  folder: ScreenFolder;
};

export function ScreenByFolder({ folder }: ScreenByFolderProps) {
  const Component = screenComponentMap[folder];
  return <Component />;
}

