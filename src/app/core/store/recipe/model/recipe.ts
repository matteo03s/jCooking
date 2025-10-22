import {Level} from './enums';
import {ActiveModel} from './active-model';
import {Validator} from './validator';

const validator = new Validator (
  'Recipe',
  [
    'id',
    'title',
    'description',
    'prepTime',
    'servings',
    'tags',
    'level'
  ],
  [
    'id',
    'title',
    'description',
    'prepTime',
    'servings',
    'tags',
    'level'
  ]
);

export interface RecipeJSON {
  id: number;
  title: string;
  description: string;
  prepTime: number;
  servings: number;
  tags: string[];
  level: Level;
}

export class Recipe extends ActiveModel {
  id: number;
  title: string;
  description: string;
  prepTime: number;
  servings: number;
  tags: string[];
  level: Level;


  constructor( recipeJSON: RecipeJSON) {
    super (recipeJSON, validator);
    this.id = recipeJSON.id;
    this.title = recipeJSON.title;
    this.description = recipeJSON.description;
    this.prepTime = recipeJSON.prepTime;
    this.servings = recipeJSON.servings;
    this. tags = recipeJSON.tags;
    this.level = recipeJSON.level;
  }

  public static fromJSON (response: RecipeJSON): Recipe {
    return new Recipe(response);
  }
  public static toJSON (model: Recipe) : RecipeJSON {
    return {
      id: model.id,
      title: model.title,
      description: model.description,
      prepTime: model.prepTime,
      servings: model.servings,
      tags: model.tags,
      level: model.level
    }
  }


}
