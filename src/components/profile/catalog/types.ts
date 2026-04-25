export interface CatalogItem {
  id: string;
  name: string;
  season: string;
  style: string;
  gender: string;
  imageUrl?: string;
}

// Справочные константы — для фильтров в UI
export const SEASONS = ["Весна", "Лето", "Осень", "Зима", "Демисезон"] as const;
export const STYLES  = ["Casual", "Smart casual", "Minimalist", "Streetwear", "Formal", "Sporty", "Vintage", "Techwear"] as const;
export const GENDERS = ["Мужской", "Женский", "Унисекс"] as const;