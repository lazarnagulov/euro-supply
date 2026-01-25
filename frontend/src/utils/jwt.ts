export const getRoleFromToken = (): string => {
  const token = localStorage.getItem("token");
  if (!token) return "GUEST";

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role ?? "GUEST"; 
  } catch (e) {
    console.error("Invalid token", e);
    return "GUEST";
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