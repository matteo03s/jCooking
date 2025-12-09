package it.jpanik.jCooking.mappers;

import it.jpanik.jCooking.dtos.recipes.RecipeDto;
import it.jpanik.jCooking.entities.Recipe;
import it.jpanik.jCooking.repositories.RecipeRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
public class RecipeMapper extends Mapper<RecipeDto, Recipe> {

    // 1
    private final RecipeRepository recipeRepository;

    public RecipeMapper(
            final RecipeRepository recipeRepository
    ) {
        this.recipeRepository = recipeRepository;
    }

    @Override
    protected Recipe convertDtoToEntityImpl(RecipeDto dto) {
        Recipe entity;

        // 2
        if (dto.getId() != null) {
            entity = this.recipeRepository.findById(dto.getId()).orElseThrow(); // 4
        } else {
            entity = new Recipe();
            entity.setUploadDate(LocalDate.now());
//            entity.setCreationDate(LocalDate.now());
//            entity.setCreationUser("Current User");
        }

        // 3
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setPrepTime(dto.getPrepTime());
        entity.setServings(dto.getServings());
        entity.setLevel(dto.getLevel());
        entity.setTags(dto.getTags());
//        entity.setUploadDate(dto.getUploadDate());

        return entity;
    }

    @Override
    protected RecipeDto convertEntityToDtoImpl(Recipe entity) {
        RecipeDto dto = new RecipeDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setPrepTime(entity.getPrepTime());
        dto.setServings(entity.getServings());
        dto.setLevel(entity.getLevel());
        dto.setTags(entity.getTags());
        return dto;
    }

}
