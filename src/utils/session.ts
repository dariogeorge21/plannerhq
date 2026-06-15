/**
 * Retrieves a cookie by its name on the client-side.
 */
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const nameEQ = name + "=";
  const ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

/**
 * Sets a cookie with a specific name, value, and expiration in seconds.
 */
export function setCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${value}; max-age=${maxAgeSeconds}; path=/; SameSite=Lax; Secure`;
}

/**
 * Deletes a cookie by name.
 */
export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; max-age=0; path=/; SameSite=Lax; Secure`;
}
