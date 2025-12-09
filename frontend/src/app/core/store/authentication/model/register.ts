import {Credentials, CredentialsJSON} from './credentials';
import {User, UserJSON} from './user';

export interface RegisterJSON {
  credentials: CredentialsJSON;
  user: UserJSON;
}

export class Register {
  credentials: Credentials;
  user: User;

  constructor(credentials: Credentials, user: User) {
    this.credentials = credentials;
    this.user = user;
  }

  public static toJSON(model: Register): RegisterJSON {
    return {
      credentials: Credentials.toJSON(model.credentials),
      user: User.toJSON(model.user),
    };
  }
}
