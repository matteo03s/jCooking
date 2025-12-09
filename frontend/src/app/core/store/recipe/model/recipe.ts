import {ActiveModel} from '../../../model/active-model';
import {Validator} from '../../../model/validator';
import {Level} from '../enum/levelEnum';
import {UnitEnum} from '../enum/UnitEnum';
import {ImageJSON} from './ImageJSON';
import {Category} from '../../category/category';

const validator = new Validator (
  'Recipe',
  [
    'id',
    'title',
    'description',
    'prepTime',
    'cookTime',
    'servings',
    'uploadDate',
    'tags',
    'steps',
    'ingredients',
    'images',
    'level',
    'category',
    'averageRating',
    'favouritesCount',
    'userId',
    'author'
  ],
  [
    'id',
    'title',
    'description',
    'prepTime',
    'CookTime',
    'servings',
    'level'
  ]
);
export interface Ingredient {
  name: string;
  quantity: number;
  unit: UnitEnum;
}

export interface RecipeJSON {
  id?: number;
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  uploadDate?: Date;
  averageRating?: number;
  favouritesCount?: number;
  tags?: string[];
  steps?: string[];
  level: Level;
  category?: Category;
  userId?: number;
  ingredients?: Ingredient[];
  images?: ImageJSON[];
  author?: {
    username: string;
    avatarUrl?: string;
  };
}

export class Recipe extends ActiveModel {
  id?: number;
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  servings: number;
  uploadDate?: Date;
  averageRating?: number;
  favouritesCount?: number;
  tags?: string[];
  steps?: string[];
  ingredients?: Ingredient[];
  images?: ImageJSON[];
  level: Level;
  category?: Category;
  userId?: number;
  author?: {
    username: string;
    avatarUrl?: string;
  };


  constructor( recipeJSON: RecipeJSON) {
    super (recipeJSON, validator);
    this.id = recipeJSON.id;
    this.title = recipeJSON.title;
    this.description = recipeJSON.description;
    this.prepTime = recipeJSON.prepTime;
    this.cookTime = recipeJSON.cookTime;
    this.servings = recipeJSON.servings;
    this.uploadDate = recipeJSON.uploadDate;
    this.averageRating = recipeJSON.averageRating;
    this.favouritesCount = recipeJSON.favouritesCount;
    this.tags = recipeJSON.tags;
    this.steps = recipeJSON.steps;
    this.ingredients = recipeJSON.ingredients;
    this.images = recipeJSON.images;
    this.level = recipeJSON.level;
    this.category = recipeJSON.category;
    this.userId = recipeJSON.userId;
    this.author = recipeJSON.author;
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
      cookTime: model.cookTime,
      servings: model.servings,
      uploadDate: model.uploadDate,
      averageRating: model.averageRating,
      favouritesCount: model.favouritesCount,
      tags: model.tags!,
      steps: model.steps!,
      ingredients: model.ingredients ?? [],
      images: model.images ?? [],
      level: model.level,
      category: model.category!,
      userId: model.userId!,
      author: model.author!
    }
  }


}
