export const SEASONS = ["Весна", "Лето", "Осень", "Зима", "Демисезон"] as const;
export const STYLES = ["Casual", "Smart casual", "Minimalist", "Streetwear", "Formal", "Sporty", "Vintage", "Techwear"] as const;
export const GENDERS = ["Мужской", "Женский", "Унисекс"] as const;

export type Season = typeof SEASONS[number];
export type Style = typeof STYLES[number];
export type Gender = typeof GENDERS[number];

export interface CatalogItem {
  id: string;
  name: string;
  season: Season;
  style: Style;
  gender: Gender;
  imageUrl?: string;
}

// ── Mock data ──────────────────────────────────────────────────────────────
export const MOCK_ITEMS: CatalogItem[] = [
  { id: "1", name: "Белая оверсайз-рубашка", season: "Весна", style: "Minimalist", gender: "Унисекс", imageUrl: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop" },
  { id: "2", name: "Чёрные прямые джинсы", season: "Демисезон", style: "Casual", gender: "Мужской", imageUrl: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=200&h=200&fit=crop" },
  { id: "3", name: "Бежевый тренч", season: "Осень", style: "Smart casual", gender: "Женский", imageUrl: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=200&h=200&fit=crop" },
  { id: "4", name: "Худи графит", season: "Зима", style: "Streetwear", gender: "Унисекс", imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=200&h=200&fit=crop" },
  { id: "5", name: "Льняные шорты", season: "Лето", style: "Casual", gender: "Мужской", imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=200&h=200&fit=crop" },
  { id: "6", name: "Кожаный блейзер", season: "Осень", style: "Vintage", gender: "Женский", imageUrl: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?w=200&h=200&fit=crop" },
  { id: "7", name: "Техническая ветровка", season: "Весна", style: "Techwear", gender: "Мужской", imageUrl: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=200&h=200&fit=crop" },
  { id: "8", name: "Плиссированная юбка", season: "Лето", style: "Minimalist", gender: "Женский", imageUrl: "https://images.unsplash.com/photo-1583496661160-fb5218afa9a3?w=200&h=200&fit=crop" },
];
