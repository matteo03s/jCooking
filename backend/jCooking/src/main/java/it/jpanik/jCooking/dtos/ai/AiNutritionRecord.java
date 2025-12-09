package it.jpanik.jCooking.dtos.ai;

public record AiNutritionRecord(
        int calories,       // Kcal per porzione
        int carbohydrates,  // Grammi per porzione
        int proteins,       // Grammi per porzione
        int fats,           // Grammi per porzione
        String briefComment // Es. "Piatto iperproteico", "Basso contenuto di grassi"
) {}