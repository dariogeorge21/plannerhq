import { AwarenessUser } from "./types";

const COLORS = [
  "#f87171", // red
  "#fb923c", // orange
  "#fbbf24", // amber
  "#34d399", // emerald
  "#38bdf8", // sky
  "#818cf8", // indigo
  "#c084fc", // purple
  "#f472b6", // pink
];

export function getRandomColor(): string {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}

export function createAwarenessUser(user: any): AwarenessUser {
  return {
    name: user?.user_metadata?.full_name || user?.email || "Anonymous",
    color: getRandomColor(),
    avatar: user?.user_metadata?.avatar_url,
  };
}
