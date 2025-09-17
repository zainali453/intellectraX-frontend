import React from "react";

import openBook from "../assets/icons/openBook.png";
import studentCap from "../assets/icons/studentCap.png";
import users from "../assets/icons/users.png";
import location from "../assets/icons/location.png";
import user from "../assets/icons/user.png";
import camera from "../assets/icons/camera.png";
import upload from "../assets/icons/upload.png";
import success from "../assets/icons/success.png";
import dashboard from "../assets/icons/dashboard.png";
import assignments from "../assets/icons/assignments.png";
import classes from "../assets/icons/classes.png";
import earnings from "../assets/icons/earnings.png";
import messages from "../assets/icons/messages.png";
import parents from "../assets/icons/parents.png";
import quizzes from "../assets/icons/quizzes.png";
import settings from "../assets/icons/settings.png";
import students from "../assets/icons/students.png";
import supportTickets from "../assets/icons/supportTickets.png";
import systemLogs from "../assets/icons/systemLogs.png";
import teachers from "../assets/icons/teachers.png";
import verifications from "../assets/icons/verifications.png";
import pairing from "../assets/icons/pairing.png";
import back from "../assets/icons/back.png";
import bookOpen from "../assets/icons/bookOpen.png";
import dollar from "../assets/icons/dollar.png";
import totalUsers from "../assets/icons/totalUsers.png";
import audioVideo from "../assets/icons/audioVideo.png";
import card from "../assets/icons/card.png";
import badge from "../assets/icons/badge.png";

import dashboardActive from "../assets/icons/dashboardActive.png";
import assignmentsActive from "../assets/icons/assignmentsActive.png";
import classesActive from "../assets/icons/classesActive.png";
import earningsActive from "../assets/icons/earningsActive.png";
import messagesActive from "../assets/icons/messagesActive.png";
import parentsActive from "../assets/icons/parentsActive.png";
import quizzesActive from "../assets/icons/quizzesActive.png";
import settingsActive from "../assets/icons/settingsActive.png";
import studentsActive from "../assets/icons/studentsActive.png";
import supportTicketsActive from "../assets/icons/supportTicketsActive.png";
import systemLogsActive from "../assets/icons/systemLogsActive.png";
import teachersActive from "../assets/icons/teachersActive.png";
import verificationsActive from "../assets/icons/verificationsActive.png";
import pairingActive from "../assets/icons/pairingActive.png";
import audioVideoActive from "../assets/icons/audioVideoActive.png";
import cardActive from "../assets/icons/cardActive.png";

const ICONS = {
  openBook,
  studentCap,
  users,
  location,
  user,
  camera,
  upload,
  success,
  dashboard,
  assignments,
  classes,
  earnings,
  messages,
  parents,
  quizzes,
  settings,
  students,
  supportTickets,
  systemLogs,
  teachers,
  verifications,
  pairing,
  back,
  bookOpen,
  dollar,
  totalUsers,
  audioVideo,
  card,
  badge,

  dashboardActive,
  assignmentsActive,
  classesActive,
  earningsActive,
  messagesActive,
  parentsActive,
  quizzesActive,
  settingsActive,
  studentsActive,
  supportTicketsActive,
  systemLogsActive,
  teachersActive,
  verificationsActive,
  pairingActive,
  audioVideoActive,
  cardActive,
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
