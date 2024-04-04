import { NavbarConfig } from "../../types/navbar";

/**
 * MM
 * This is because tailwind extracts only class names as complete unbroken strings
 * see https://tailwindcss.com/docs/content-configuration#dynamic-class-names
 * or you can safelist classes in tailwind.config.cjs file and configure the safelist
 * see https://www.codeconcisely.com/posts/tailwind-css-dynamic-class/
 */

const widthVariants: { [key: number]: string } = {
  70: "w-70",
  56: "w-56",
  16: "w-16",
};

const mlVariants: { [key: number]: string } = {
  70: "ml-70",
  56: "ml-56",
  16: "ml-16",
};
const mtVariants: { [key: number]: string } = {
  70: "mt-70",
  56: "mt-56",
  16: "mt-16",
};

const heightVariants: { [key: number]: string } = {
  16: "h-16",
  20: "h-20",
};
const topVariants: { [key: number]: string } = {
  16: "top-16",
  20: "top-20",
};

export function getHeight(height: number, variant: string) {
  if (variant === "top") {
    return topVariants[height];
  } else if (variant === "h") {
    return heightVariants[height];
  } else if (variant === "mt") {
    return mtVariants[height];
  }
  return heightVariants[height];
}

export function getWidth(
  navProperties: NavbarConfig,
  isSidebarOpen: boolean,
  variant: string
) {
  let sideWidth = isSidebarOpen
    ? Number(navProperties.sidebar.width)
    : Number(navProperties.sidebar.minWidth);
  if (variant === "ml") {
    return mlVariants[sideWidth];
  } else if (variant === "w") {
    return widthVariants[sideWidth];
  }
  return widthVariants[sideWidth];
}
