// src/middleware/auth.ts
import { Context, Next } from "hono";
import { userDatabase, User } from "../services/userDatabase";
import { getCookie, deleteCookie } from "hono/cookie";

// Extend Context type to include user
declare module "hono" {
  interface Context {
    user?: User;
  }
}

export function isApiRequest(c: Context): boolean {
  const path = c.req.path;
  const accept = c.req.header("Accept") || "";
  const secFetchMode = c.req.header("sec-fetch-mode") || "";

  // If path starts with API prefixes, it is an API request
  if (
    path.startsWith("/api/") ||
    path.startsWith("/auth/") ||
    path.startsWith("/config/") ||
    path.startsWith("/send/") ||
    path.startsWith("/report/") ||
    path.startsWith("/dashboard/") ||
    path.startsWith("/user/info") ||
    path.startsWith("/parse-excel") ||
    path.startsWith("/test-notification") ||
    path.startsWith("/batch-") ||
    path.startsWith("/scheduled-jobs") ||
    path.startsWith("/provider-info") ||
    path.startsWith("/health")
  ) {
    return true;
  }

  // Check headers
  if (accept.includes("application/json")) {
    return true;
  }

  if (secFetchMode && secFetchMode !== "navigate") {
    return true;
  }

  if (accept.includes("text/html") || secFetchMode === "navigate") {
    return false;
  }

  return true;
}

export async function authMiddleware(c: Context, next: Next) {
  const path = c.req.path;
  
  // Skip auth for auth routes and health checks
  const publicPaths = [
    "/auth/",
    "/health",
  ];

  if (publicPaths.some((p) => path.startsWith(p)) || path === "/") {
    return await next();
  }

  // Check for session token
  const token =
    c.req.header("Authorization")?.replace("Bearer ", "") ||
    getCookie(c, "session_token");

  if (!token) {
    return c.json({ success: false, message: "Authentication required" }, 401);
  }

  const user = userDatabase.validateSession(token);
  if (!user) {
    deleteCookie(c, "session_token");
    return c.json(
      { success: false, message: "Invalid or expired session" },
      401
    );
  }

  // Add user to context
  c.user = user;
  return await next();
}

export function requireAuth(c: Context): User {
  if (!c.user) {
    throw new Error("User not authenticated");
  }
  return c.user;
}
