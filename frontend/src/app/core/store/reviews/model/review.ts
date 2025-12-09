import {ActiveModel} from '../../../model/active-model';
import {Validator} from '../../../model/validator';


const validator = new Validator(
  'Review',
  [
    'id',
    'title',
    'comment',
    'rating',
    'uploadDate',
    'userId',
    'recipeId',
    'author',
    'recipe'
  ],
  [
    'title',
    'comment',
    'rating'
  ]
);

export interface ReviewJSON {
  id?: number;
  title: string;
  comment: string;
  rating: number;
  uploadDate?: Date;
  userId?: number;
  recipeId?: number;
  author?: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
  recipe?: {
    id: number;
    title: string;
  };
}

export class Review extends ActiveModel {
  id?: number;
  title: string;
  comment: string;
  rating: number;
  uploadDate?: Date;
  userId?: number;
  recipeId?: number;
  author?: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
  recipe?: {
    id: number;
    title: string;
  };

  constructor(reviewJSON: ReviewJSON) {
    super(reviewJSON, validator);
    this.id = reviewJSON.id;
    this.title = reviewJSON.title;
    this.comment = reviewJSON.comment;
    this.rating = reviewJSON.rating;
    this.uploadDate = reviewJSON.uploadDate;
    this.userId = reviewJSON.userId;
    this.recipeId = reviewJSON.recipeId;
    this.author = reviewJSON.author;
    this.recipe = reviewJSON.recipe;
  }

  public static fromJSON(response: ReviewJSON): Review {
    return new Review(response);
  }

  public static toJSON(model: Review): ReviewJSON {
    return {
      id: model.id,
      title: model.title,
      comment: model.comment,
      rating: model.rating,
      uploadDate: model.uploadDate,
      userId: model.userId,
      recipeId: model.recipeId,
      author: model.author,
      recipe: model.recipe
    };
  }
}
