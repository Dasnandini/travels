export const env = {
  DATABASE_URL: process.env.DATABASE_URL || "",
  AUTH_SECRET: process.env.AUTH_SECRET || "development-secret-key-min-32-chars-length!",
  AUTH_URL: process.env.AUTH_URL || "http://localhost:3000",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  isProduction: process.env.NODE_ENV === "production",
};
