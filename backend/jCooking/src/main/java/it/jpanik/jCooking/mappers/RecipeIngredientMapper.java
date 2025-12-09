package it.jpanik.jCooking.mappers;

import it.jpanik.jCooking.dtos.IngredientDto;
import it.jpanik.jCooking.dtos.RecipeIngredientDto;
import it.jpanik.jCooking.entities.RecipeIngredient;
import it.jpanik.jCooking.repositories.RecipeIngredientRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class RecipeIngredientMapper extends Mapper<IngredientDto, RecipeIngredient> {

    private final RecipeIngredientRepository recipeIngredientRepository;

    public RecipeIngredientMapper(RecipeIngredientRepository recipeIngredientRepository) {
        this.recipeIngredientRepository = recipeIngredientRepository;
    }


    // Metodo per convertire interi set
    public List<IngredientDto> toDtoList(Set<RecipeIngredient> entities) {
        if (entities == null) {
            return List.of();
        }
        return entities.stream()
                .map(this::convertEntityToDtoImpl)
                .collect(Collectors.toList());
    }

    @Override
    protected RecipeIngredient convertDtoToEntityImpl(IngredientDto ingredientDto) {
        return null;
    }

    @Override
    protected IngredientDto convertEntityToDtoImpl(RecipeIngredient entity) {
        if (entity == null) {
            return null;
        }
        IngredientDto dto = new IngredientDto();
        dto.setName(entity.getIngredient().getName());
        dto.setQuantity(entity.getQuantity());
        dto.setUnit(entity.getUnit());
        return dto;
    }
}

