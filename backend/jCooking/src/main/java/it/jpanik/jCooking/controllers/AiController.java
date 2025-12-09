package it.jpanik.jCooking.controllers;

import it.jpanik.jCooking.dtos.ai.AiTranslatedRecipeRecord;
import it.jpanik.jCooking.dtos.ai.RecipeFields.AiDescriptionRecord;
import it.jpanik.jCooking.dtos.ai.AiNutritionRecord;
import it.jpanik.jCooking.dtos.ai.AiSommelierResponse;
import it.jpanik.jCooking.dtos.ai.RecipeFields.AiStepsRecord;
import it.jpanik.jCooking.dtos.ai.RecipeFields.AiTagsRecord;
import it.jpanik.jCooking.dtos.recipes.RecipeWithAuthorDto;
import it.jpanik.jCooking.services.ai.AiChefService;
import it.jpanik.jCooking.services.ai.AiNutritionService;
import it.jpanik.jCooking.services.ai.AiSommelierService;
import it.jpanik.jCooking.services.ai.AiTranslateService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ai")
public class AiController {

    private final AiChefService aiChefService;
    private final AiSommelierService aiSommelierService;
    private final AiNutritionService aiNutritionService;
    private final AiTranslateService aiTranslateService;

    public AiController(
            AiChefService aiChefService,
            AiSommelierService aiSommelierService,
            AiNutritionService aiNutritionService,
            AiTranslateService aiTranslateService
    ) {
        this.aiChefService = aiChefService;
        this.aiSommelierService = aiSommelierService;
        this.aiNutritionService = aiNutritionService;
        this.aiTranslateService = aiTranslateService;
    }

    /**
     * Endpoint per generare una ricetta.
     * Esempio chiamata: GET /api/ai/generate?ingredients=uova,farina&type=primo
     */
    @GetMapping("/generate")
    public ResponseEntity<RecipeWithAuthorDto> generateRecipe(
            @RequestParam String ingredients,
            @RequestParam(required = false, defaultValue = "A tua scelta") String type
    ) {
        System.out.println("Richiesta AI ricevuta. Ingredienti: " + ingredients + ", Tipo: " + type);
        RecipeWithAuthorDto generatedRecipe = aiChefService.generateRecipe(ingredients, type);
        return ResponseEntity.ok(generatedRecipe);
    }

    @GetMapping("/sommelier")
    public ResponseEntity<AiSommelierResponse> getBeverageRecommendations(
            @RequestParam String title,
            @RequestParam String ingredients,
            @RequestParam(defaultValue = "Generico") String category
    ) {
        AiSommelierResponse response = aiSommelierService.recommendBeverages(title, ingredients, category);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/nutrition")
    public ResponseEntity<AiNutritionRecord> analyzeNutrition(
            @RequestParam String title,
            @RequestParam String ingredients,
            @RequestParam(defaultValue = "1") int servings
    ) {
        AiNutritionRecord result = aiNutritionService.analyzeNutrition(title, ingredients, servings);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/description")
    public ResponseEntity<AiDescriptionRecord> generateDescription(
            @RequestParam String title,
            @RequestParam(required = false, defaultValue = "") String ingredients
    ) {
        return ResponseEntity.ok(aiChefService.generateDescription(title, ingredients));
    }

    @GetMapping("/tags")
    public ResponseEntity<AiTagsRecord> generateTags(
            @RequestParam String title,
            @RequestParam(required = false, defaultValue = "") String ingredients
    ) {
        return ResponseEntity.ok(aiChefService.generateTags(title, ingredients));
    }
    @GetMapping("/steps")
    public ResponseEntity<AiStepsRecord> generateSteps(
            @RequestParam String title,
            @RequestParam(required = false, defaultValue = "") String ingredients
    ) {
        return ResponseEntity.ok(aiChefService.generateSteps(title, ingredients));
    }

    @PostMapping("/translate")
    public ResponseEntity<AiTranslatedRecipeRecord> translateRecipe(
            @RequestParam String language,
            @RequestBody AiTranslatedRecipeRecord request
    ) {
        // Passiamo direttamente la lista di oggetti, non una stringa appiattita
        AiTranslatedRecipeRecord translated = aiTranslateService.translateRecipe(
                request.title(),
                request.description(),
                request.ingredients(), // <--- Passiamo la List<AiTranslatedIngredientRecord>
                request.steps(),       // Anche per gli step, meglio passare la lista
                language
        );

        return ResponseEntity.ok(translated);
    }
}