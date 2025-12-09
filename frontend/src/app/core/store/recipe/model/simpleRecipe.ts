import {ActiveModel} from '../../../model/active-model';
import {Validator} from '../../../model/validator';
import {Category} from '../../category/category';


export interface Page<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
}

const validator = new Validator (
  'Recipe',
  [
    'id',
    'title',
    'tags',
    'firstImageUrl',
    'category',
    'averageRating',
    'favouritesCount',
    'username'
  ],
  [
    'id',
    'title',
  ]
);

export interface SimpleRecipeJSON {
  id?: number;
  title: string;
  averageRating?: number;
  favouritesCount?: number;
  tags?: string[];
  category?: Category;
  username?: string;
  firstImageUrl?: string;
}

export class SimpleRecipe extends ActiveModel {
  id?: number;
  title: string;
  averageRating?: number;
  favouritesCount?: number;
  tags?: string[];
  category?: Category;
  username?: string;
  firstImageUrl?: string;

  constructor( recipeJSON: SimpleRecipeJSON) {
    super (recipeJSON, validator);
    this.id = recipeJSON.id;
    this.title = recipeJSON.title;
    this.averageRating = recipeJSON.averageRating;
    this.favouritesCount = recipeJSON.favouritesCount;
    this.tags = recipeJSON.tags;
    this.category = recipeJSON.category;
    this.username = recipeJSON.username;
    this.firstImageUrl = recipeJSON.firstImageUrl;
  }

  public static fromJSON (response: SimpleRecipeJSON): SimpleRecipe {
    return new SimpleRecipe(response);
  }
  public static toJSON (model: SimpleRecipe) : SimpleRecipeJSON {
    return {
      id: model.id,
      title: model.title,
      averageRating: model.averageRating,
      favouritesCount: model.favouritesCount,
      tags: model.tags!,
      category: model.category!,
      username: model.username!,
      firstImageUrl: model.firstImageUrl!
    }
  }


}
