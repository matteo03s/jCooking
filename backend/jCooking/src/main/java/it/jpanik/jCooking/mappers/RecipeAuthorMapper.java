package it.jpanik.jCooking.mappers;

import it.jpanik.jCooking.dtos.recipes.RecipeWithAuthorDto;
import it.jpanik.jCooking.entities.Image;
import it.jpanik.jCooking.entities.Recipe;
import it.jpanik.jCooking.entities.User;
import it.jpanik.jCooking.repositories.FavouriteRepository;
import it.jpanik.jCooking.repositories.RecipeRepository;
import it.jpanik.jCooking.repositories.ReviewRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class RecipeAuthorMapper extends Mapper<RecipeWithAuthorDto, Recipe> {

    private final RecipeRepository recipeRepository;
    private final ReviewRepository reviewRepository;
    private final FavouriteRepository favouriteRepository;
    private final CategoryMapper categoryMapper;

    public RecipeAuthorMapper(
            final RecipeRepository recipeRepository,
            final ReviewRepository reviewRepository,
            final FavouriteRepository favouriteRepository,
            final CategoryMapper categoryMapper
    ) {
        this.recipeRepository = recipeRepository;
        this.reviewRepository = reviewRepository;
        this.favouriteRepository = favouriteRepository;
        this.categoryMapper = categoryMapper;
    }

    @Override
    protected Recipe convertDtoToEntityImpl(RecipeWithAuthorDto dto) {
        Recipe entity;

        if (dto.getId() != null) {
            entity = this.recipeRepository.findById(dto.getId()).orElseThrow();
            entity.setId(dto.getId());
        } else {
            entity = new Recipe();
            entity.setUploadDate(LocalDate.now());
        }

        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setPrepTime(dto.getPrepTime());
        entity.setCookTime(dto.getCookTime());
        entity.setServings(dto.getServings());
        entity.setLevel(dto.getLevel());
        entity.setCategory(this.categoryMapper.convertDtoToEntityImpl(dto.getCategory()));
        entity.setTags(dto.getTags());
        entity.setSteps(dto.getSteps());

//        entity.setUploadDate(dto.getUploadDate());

        return entity;
    }

    @Override
    protected RecipeWithAuthorDto convertEntityToDtoImpl(Recipe entity) {
        RecipeWithAuthorDto dto = new RecipeWithAuthorDto();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setPrepTime(entity.getPrepTime());
        dto.setCookTime(entity.getCookTime());
        dto.setServings(entity.getServings());
        dto.setLevel(entity.getLevel());
        dto.setCategory(this.categoryMapper.convertEntityToDtoImpl(entity.getCategory()));
        dto.setTags(entity.getTags());
        dto.setSteps(entity.getSteps());
        dto.setUploadDate(entity.getUploadDate());

        Double average = reviewRepository.findAverageRatingByRecipeId(entity.getId());
        dto.setAverageRating(average != null ? average : 0.0);

        User user = entity.getUser();
        if (user != null) {
            dto.setUserId(user.getId());
            dto.setAuthor(
                    new RecipeWithAuthorDto.AuthorDto(
                            entity.getUser().getUsername(),
                            entity.getTitle()
                    )
            );
        }
        dto.setFavouritesCount(this.favouriteRepository.countByRecipe(entity));
        return dto;
    }


}
