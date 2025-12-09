package it.jpanik.jCooking.dtos.ai;

import java.util.List;

public record AiSommelierResponse(
        List<AiBeverageRecord> beverages
) {}
