/** Public contact address for the About / Privacy pages. Set NEXT_PUBLIC_CONTACT_EMAIL. */
export function getContactEmail(): string | null {
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim();
  return email && email.includes("@") ? email : null;
}

/**
 * Amazon requires this exact statement once you're an Associate. Set
 * NEXT_PUBLIC_AMAZON_ASSOCIATE=true after you're approved, not before.
 */
export function isAmazonAssociate(): boolean {
  return process.env.NEXT_PUBLIC_AMAZON_ASSOCIATE === "true";
}

/**
 * Canonical site origin for metadata, sitemap, and JSON-LD.
 * Set `NEXT_PUBLIC_SITE_URL` in production (e.g. https://www.example.com).
 */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (fromEnv) {
    return fromEnv.replace(/\/$/, "");
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return "http://localhost:3000";
}
