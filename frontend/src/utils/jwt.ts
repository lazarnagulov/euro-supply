import {type Role, ROLES} from "../features/auth/types/auth.types.ts";

export const getRoleFromToken = (): Role => {
  const token = localStorage.getItem("token");
  if (!token) return ROLES.GUEST;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.role ?? ROLES.GUEST;
  } catch {
    return ROLES.GUEST;
  }
};

export const getUsernameFromToken = (): string | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.sub ?? null;
  } catch (e) {
    console.error("Invalid token", e);
    return null;
  }
};