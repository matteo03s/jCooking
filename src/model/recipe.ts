import {Level} from './enums';

export interface Recipe {
  id: number;
  title: string;
  description: string;
  prepTime: number;
  servings: number;
  tags: string[];
  level: Level;
}
