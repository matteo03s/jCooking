export class Validator {
  constructor(
    private modelName: string,
    private fields: string[],
    private requiredFields: string[]
  ) {}

  validate(data: any): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    this.requiredFields.forEach(field => {
      if (data[field] === undefined || data[field] === null) {
        errors.push(`${this.modelName}: missing required field '${field}'`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }
}
