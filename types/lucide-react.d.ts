declare module "lucide-react-native" {
  import * as React from "react";
  import { SvgProps } from "react-native-svg";

  export interface IconProps extends SvgProps {
    size?: number;
    color?: string;
  }

  export type Icon = React.FC<IconProps>;

  export const Activity: Icon;
  export const AlertCircle: Icon;
  export const ArrowLeft: Icon;
  export const ArrowRight: Icon;
  // add more icons as needed, or use index signature
  export const icons: Record<string, Icon>;
}
declare module "lucide-react-native/dist/esm/icons/*";
