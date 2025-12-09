package it.jpanik.jCooking.dtos.ai;

public record AiIngredientRecord(
        String name,
        Double quantity, // Usiamo Double per i numeri (es. 100, 0.5)
        String unit      // Ci aspettiamo: "G", "KG", "PZ", ecc.
) {}
