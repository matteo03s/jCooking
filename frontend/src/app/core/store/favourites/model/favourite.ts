import {ActiveModel} from '../../../model/active-model';
import {Validator} from '../../../model/validator';

const validator = new Validator(
  'Favourite',
  [
    'id',
    'userId',
    'username',
    'recipeId',
    'recipeTitle',
    'recipeImage',
    'createdAt',
  ],
  [
  ]
);

export interface FavouriteJSON {
  id?: number;
  userId: number;
  username?: string;
  recipeId: number;
  recipeTitle?: string;
  recipeImage?: string;
  createdAt?: string;
}

export class Favourite extends ActiveModel {
  id?: number;
  userId: number;
  username?: string;
  recipeId: number;
  recipeTitle?: string;
  recipeImage?: string;
  createdAt?: Date;

  constructor(f: FavouriteJSON) {
    super (f, validator);
    this.id = f.id;
    this.userId = f.userId;
    this.username = f.username;
    this.recipeId = f.recipeId;
    this.recipeTitle = f.recipeTitle;
    this.recipeImage = f.recipeImage;
    this.createdAt = f.createdAt ? new Date(f.createdAt) : undefined;
  }

  public static fromJSON(json: FavouriteJSON): Favourite {
    return new Favourite(json);
  }

  static toJSON(fav: Favourite): FavouriteJSON {
    return {
      id: fav.id,
      userId: fav.userId,
      recipeId: fav.recipeId,
      username: fav.username,
      recipeTitle: fav.recipeTitle,
      recipeImage: fav.recipeImage,
      createdAt: fav.createdAt?.toISOString(),
    };
  }
}
