import {ActiveModel} from '../../../model/active-model';
import {Validator} from '../../../model/validator';
import {Gender} from '../enum/genderEnum';

const validator = new Validator (
  'User',
  [
    'id',
    'name',
    'surname',
    'email',
    'age',
    'gender',
    'username',
    'avatar',
    'recipesCount'
  ],
  [
    'name',
    'email',
    'age',
    'gender'
  ]
);

export interface UserJSON {
  id?: number;
  username: string;
  name: string;
  surname: string;
  email: string;
  age: number;
  gender: Gender;
  avatar: string;
  recipesCount?: number;
}

export class User extends ActiveModel {
  id?: number;
  username?: string;
  name: string;
  surname: string;
  email: string;
  age: number;
  gender: Gender;
  avatar: string;
  recipesCount?: number;


  constructor( userJSON: UserJSON) {
    super (userJSON, validator);
    this.id = userJSON.id;
    this.username = userJSON.username;
    this.name = userJSON.name;
    this.surname = userJSON.surname;
    this.email = userJSON.email;
    this.age = userJSON.age;
    this.gender = userJSON.gender;
    this.avatar = userJSON.avatar;
    this.recipesCount = userJSON.recipesCount;
  }

  public static fromJSON (response: UserJSON): User {
    return new User(response);
  }
  public static toJSON (model: User) : UserJSON {
    return {
      id: model.id,
      username: model.username!,
      name: model.name,
      surname: model.surname,
      email: model.email,
      age: model.age,
      gender: model.gender,
      avatar: model.avatar,
      recipesCount: model.recipesCount
    }
  }
}
