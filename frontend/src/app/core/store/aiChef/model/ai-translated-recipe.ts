export interface AiTranslatedIngredient {
  name: string;
  quantity: number;
  unit: string;
}

export interface AiTranslatedRecipe {
  title: string;
  description: string;
  ingredients: AiTranslatedIngredient[];
  steps: string[];
}
