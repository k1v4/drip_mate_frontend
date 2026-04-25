export interface CatalogItem {
  id: string;
  name: string;
  season: string;
  style: string;
  gender: string;
  imageUrl?: string;
}

export interface UpdateCatalogRequest {
  id: string;
  name: string;
  category_id?: number;
  gender?: string;
  season_id?: number;
  image_url?: string;
  color_ids?: number[];
  style_ids?: number[];
}

interface DictItem {
  id: number;
  name: string;
}

export function mapToUpdateRequest(
  item: CatalogItem,
  styles: DictItem[],
  seasons: DictItem[]
): UpdateCatalogRequest {

  const season = seasons.find(s => s.name === item.season);
  if (!season) {
    throw new Error(`Season not found: ${item.season}`);
  }

  const style = styles.find(s => s.name === item.style);

  return {
    id: item.id,
    name: item.name,
    gender: item.gender,
    image_url: item.imageUrl ?? "",

    season_id: season.id,
    style_ids: style ? [style.id] : [],
  };
}

// Справочные константы — для фильтров в UI
export const SEASONS = ["Весна", "Лето", "Осень", "Зима", "Демисезон"] as const;
export const STYLES  = ["Casual", "Smart casual", "Minimalist", "Streetwear", "Formal", "Sporty", "Vintage", "Techwear"] as const;
export const GENDERS = ["Мужской", "Женский", "Унисекс"] as const;