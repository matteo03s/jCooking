import {ActiveModel} from '../../../model/active-model';
import {Validator} from '../../../model/validator';

const validator = new Validator (
  'User',
  [
    'id',
    'username',
    'password'
  ],
  [
    'username',
    'password'  ]
);

export interface CredentialsJSON {
  id?: number;
  username: string;
  password: string;
}

export class Credentials extends ActiveModel {
  id?: number;
  username: string;
  password: string;


  constructor( credentialsJSON: CredentialsJSON) {
    super (credentialsJSON, validator);
    this.id = credentialsJSON.id;
    this.username = credentialsJSON.username;
    this.password = credentialsJSON.password;
  }

  public static fromJSON (response: CredentialsJSON): Credentials {
    return new Credentials(response);
  }
  public static toJSON (model: Credentials) : CredentialsJSON {
    return {
      id: model.id,
      username: model.username,
      password: model.password,
    }
  }


}
