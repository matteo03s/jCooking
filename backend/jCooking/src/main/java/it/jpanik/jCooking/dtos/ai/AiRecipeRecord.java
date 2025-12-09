package it.jpanik.jCooking.dtos.ai;

import java.util.List;

public record AiRecipeRecord(
        String title,
        String description,
        String category,
        String difficulty, // Ci aspettiamo: "VERY_EASY", "EASY", ecc.
        int prepTimeMinutes,
        int cookTimeMinutes,
        int servings,
        List<AiIngredientRecord> ingredients,
        List<String> steps,
        List<String> tags
) {}