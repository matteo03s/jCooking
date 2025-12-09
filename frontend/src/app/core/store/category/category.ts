import {Validator} from '../../model/validator';
import {ActiveModel} from '../../model/active-model';
import {model} from '@angular/core';


const validator = new Validator (
  'Category',
  [
    'id',
    'name',
    'slug',
    'pathIcon',
    'description',
  ],
  []
);

export interface CategoryJSON {
  id?: number;
  name: string;
  slug: string;
  pathIcon: string;
  description: string;
}

export class Category extends ActiveModel {
  id?: number;
  name: string;
  slug: string;
  pathIcon: string;
  description: string;


  constructor( categoryJSON: CategoryJSON) {
    super (categoryJSON, validator);
    this.id = categoryJSON.id;
    this.name = categoryJSON.name;
    this.slug = categoryJSON.slug;
    this.pathIcon = categoryJSON.pathIcon;
    this.description = categoryJSON.description;
  }

  public static fromJSON (response: CategoryJSON): Category {
    return new Category(response);
  }
  public static toJSON (model: Category) : CategoryJSON
{
  return {
    id: model.id,
    name: model.name,
    slug: model.slug,
    description: model.description,
    pathIcon: model.pathIcon,
  }
}
}
