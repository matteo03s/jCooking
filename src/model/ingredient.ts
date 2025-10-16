import {IngredientType, Season} from './enums';

export interface Ingredient {
  id: number;
  name: string;
  description:string;
  season: Season;
  type: IngredientType;
}
