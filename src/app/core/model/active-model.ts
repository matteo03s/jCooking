import {Validator} from './validator';

export class ActiveModel {
  protected _isValid: boolean = true;
  protected _errors: string[] = [];

  constructor(data: any, validator?: Validator) {
    if (validator) {
      const result = validator.validate(data);
      this._isValid = result.isValid;
      this._errors = result.errors;
    }
  }

  get isValid(): boolean {
    return this._isValid;
  }

  get errors(): string[] {
    return this._errors;
  }
}
