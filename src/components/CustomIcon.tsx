import React from "react";

import openBook from "../assets/icons/openBook.png";
import studentCap from "../assets/icons/studentCap.png";
import users from "../assets/icons/users.png";
import location from "../assets/icons/location.png";
import user from "../assets/icons/user.png";
import camera from "../assets/icons/camera.png";
import upload from "../assets/icons/upload.png";
import success from "../assets/icons/success.png";

const ICONS = {
  openBook,
  studentCap,
  users,
  location,
  user,
  camera,
  upload,
  success,
} as const;

export type IconName = keyof typeof ICONS;

export type CustomIconProps = Omit<
  React.ImgHTMLAttributes<HTMLImageElement>,
  "src" | "alt"
> & {
  name: IconName;
  alt?: string;
  size?: number | string;
};

export function getIconUrl(name: IconName): string | undefined {
  return ICONS[name];
}

export const availableIconNames: IconName[] = Object.keys(ICONS) as IconName[];

export default function CustomIcon({
  name,
  alt,
  size,
  style,
  ...imgProps
}: CustomIconProps) {
  const src = getIconUrl(name);
  if (!src) {
    if (import.meta.env.MODE !== "production") {
      // eslint-disable-next-line no-console
      console.warn(
        `[CustomIcon] Icon not found for name="${name}". Available: ${availableIconNames.join(
          ", "
        )}`
      );
    }
    return null;
  }

  const resolvedSize =
    size == null ? undefined : typeof size === "number" ? `${size}px` : size;

  const mergedStyle = {
    ...(resolvedSize ? { width: resolvedSize, height: resolvedSize } : {}),
    ...style,
  } as React.CSSProperties | undefined;

  return <img src={src} alt={alt ?? name} style={mergedStyle} {...imgProps} />;
}
