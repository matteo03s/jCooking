package it.jpanik.jCooking.mappers;

import it.jpanik.jCooking.dtos.CategoryDto;
import it.jpanik.jCooking.dtos.IngredientDto;
import it.jpanik.jCooking.dtos.ai.AiRecipeRecord;
import it.jpanik.jCooking.dtos.recipes.RecipeWithAuthorDto;
import it.jpanik.jCooking.entities.Category;
import it.jpanik.jCooking.entities.Enums.LevelEnum;
import it.jpanik.jCooking.entities.Enums.UnitEnum;
import it.jpanik.jCooking.repositories.CategoryRepository;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
public class AiRecipeMapper {

    private final CategoryRepository categoryRepository;

    public AiRecipeMapper(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    public RecipeWithAuthorDto toDto(AiRecipeRecord record) {
        RecipeWithAuthorDto dto = new RecipeWithAuthorDto();

        // 1. Campi semplici
        dto.setTitle(record.title());
        dto.setDescription(record.description());
        dto.setPrepTime(record.prepTimeMinutes());
        dto.setCookTime(record.cookTimeMinutes());
        dto.setServings(record.servings());
        dto.setSteps(record.steps());
        dto.setTags(record.tags());

        // 2. Mapping Enum Livello (con sicurezza)
        dto.setLevel(mapLevel(record.difficulty()));

        // 3. Mapping Categoria
        CategoryDto catDto = resolveCategory(record.category());
        dto.setCategory(catDto);

        // 4. MAPPING INGREDIENTI (La parte che ti interessa)
        if (record.ingredients() != null) {
            List<IngredientDto> ingDtos = record.ingredients().stream().map(aiIng -> {
                IngredientDto i = new IngredientDto();

                // Set nome
                i.setName(aiIng.name());

                // Set Quantità (Gestione null: se null mettiamo null o 0.0)
                i.setQuantity(aiIng.quantity());

                // Set Unità (Conversione da Stringa AI -> UnitEnum)
                i.setUnit(mapUnit(aiIng.unit()));

                return i;
            }).toList();

            dto.setIngredients(ingDtos);
        }

        // 5. Default per i campi mancanti
        dto.setFavouritesCount(0);
        dto.setAverageRating(0.0);
        dto.setImages(new ArrayList<>());
        dto.setAuthor(new RecipeWithAuthorDto.AuthorDto("Groq Chef", "assets/catIcons/diverse-chef-avatar-set-vector-43403795.svg"));

        return dto;
    }

    // --- HELPER PER CONVERTIRE LE UNITÀ ---
    private UnitEnum mapUnit(String input) {
        if (input == null || input.isBlank()) {
            return UnitEnum.QB;
        }

        try {
            // Tentativo 1: Match esatto (es. "KG" -> UnitEnum.KG)
            return UnitEnum.valueOf(input.toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            // Tentativo 2: Correzione errori comuni dell'AI (Fallback)
            String clean = input.toUpperCase().trim();

            if (clean.startsWith("GR")) return UnitEnum.G;       // Grammi, Gr, G
            if (clean.startsWith("KG") || clean.contains("CHIL")) return UnitEnum.KG;
            if (clean.startsWith("ML")) return UnitEnum.ML;
            if (clean.startsWith("CL")) return UnitEnum.CL;
            if (clean.startsWith("L") || clean.startsWith("LIT")) return UnitEnum.L;

            // Gestione Cucchiai/Cucchiaini
            if (clean.contains("CUCCHIAIO") || clean.equals("TBSP")) return UnitEnum.TBSP;
            if (clean.contains("CUCCHAINO") || clean.contains("TSP")) return UnitEnum.TSP;

            if (clean.contains("TAZZA") || clean.contains("CUP")) return UnitEnum.CUP;
            if (clean.contains("PZ") || clean.contains("PEZZ") || clean.contains("NUMERO")) return UnitEnum.PZ;

            // Se tutto fallisce -> Quanto Basta
            return UnitEnum.QB;
        }
    }

    // --- HELPER PER CONVERTIRE IL LIVELLO ---
    private LevelEnum mapLevel(String input) {
        if (input == null) return LevelEnum.MEDIUM;
        try {
            return LevelEnum.valueOf(input.toUpperCase().trim());
        } catch (IllegalArgumentException e) {
            String clean = input.toUpperCase();
            if (clean.contains("EASY") && clean.contains("VERY")) return LevelEnum.VERY_EASY;
            if (clean.contains("EASY")) return LevelEnum.EASY;
            if (clean.contains("HARD")) return LevelEnum.HARD;
            return LevelEnum.MEDIUM;
        }
    }

    private CategoryDto resolveCategory(String aiInput) {
        // Slug di default se non capiamo cosa dice l'AI
        String targetSlug = "other";

        if (aiInput != null) {
            String input = aiInput.toLowerCase().trim();

            // Mappatura manuale basata sulle tue categorie DB
            if (containsAny(input, "antipasto", "starter", "stuzzichino", "appetizer")) {
                targetSlug = "appetizer";
            } else if (containsAny(input, "primo", "pasta", "riso", "zuppa", "minestra", "first")) {
                targetSlug = "first";
            } else if (containsAny(input, "secondo", "carne", "pesce", "pollo", "arrosto", "second")) {
                targetSlug = "second";
            } else if (containsAny(input, "piatto unico", "insalatona", "single", "bowl")) {
                targetSlug = "single";
            } else if (containsAny(input, "contorno", "verdura", "insalata", "side", "patate")) {
                targetSlug = "side";
            } else if (containsAny(input, "dolce", "dessert", "torta", "biscotti", "gelato")) {
                targetSlug = "dessert";
            } else if (containsAny(input, "snack", "merenda", "spuntino")) {
                targetSlug = "snack";
            } else if (containsAny(input, "bevanda", "drink", "cocktail", "frullato")) {
                targetSlug = "beverage";
            }
        }

        // Recuperiamo l'entità reale dal DB usando lo slug corretto
        // Se per qualche motivo lo slug non esiste (es. DB vuoto), ritorniamo null o gestiamo l'errore
        Category category = categoryRepository.findBySlug(targetSlug)
                .orElse(categoryRepository.findBySlug("other").orElse(null));

        if (category == null) {
            // Caso disperato: categoria "other" non trovata nel DB.
            // Ritorniamo un DTO fittizio o null, ma meglio evitare crash.
            return null;
        }

        // Convertiamo l'entità trovata nel DTO che il frontend si aspetta
        CategoryDto catDto = new CategoryDto();
        catDto.setId(category.getId());
        catDto.setName(category.getName());
        catDto.setSlug(category.getSlug());
        catDto.setDescription(category.getDescription());
        catDto.setPathIcon(category.getPathIcon());

        return catDto;
    }

    private boolean containsAny(String input, String... keywords) {
        for (String keyword : keywords) {
            if (input.contains(keyword)) return true;
        }
        return false;
    }
}
