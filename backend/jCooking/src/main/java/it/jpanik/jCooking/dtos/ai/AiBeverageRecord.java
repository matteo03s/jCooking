package it.jpanik.jCooking.dtos.ai;

public record AiBeverageRecord(
        String name,
        String type,
        String description,
        String pairingReason,
        String servingTemp
) {}