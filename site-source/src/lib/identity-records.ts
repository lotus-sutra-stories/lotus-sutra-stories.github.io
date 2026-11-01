import records from "@/content/identities.json";
import { IDENTITY_CATEGORIES, type IdentityCategory } from "./identities";

/** 僅供建置時使用；不可從客戶端元件匯入。 */
export function getIdentityCategory(id: string): IdentityCategory {
  const value = (records as Record<string, { category: string }>)[id]?.category;
  return IDENTITY_CATEGORIES.includes(value as IdentityCategory) ? value as IdentityCategory : "unknown";
}
