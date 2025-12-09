package it.jpanik.jCooking.mappers;

import it.jpanik.jCooking.dtos.recipes.RecipeWithAuthorDto;
import it.jpanik.jCooking.dtos.recipes.SimpleRecipeDto;
import it.jpanik.jCooking.entities.Recipe;
import it.jpanik.jCooking.entities.User;
import it.jpanik.jCooking.repositories.FavouriteRepository;
import it.jpanik.jCooking.repositories.RecipeRepository;
import it.jpanik.jCooking.repositories.ReviewRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;

@Service
    public class RecipeSimpleMapper extends Mapper<SimpleRecipeDto, Recipe> {

        private final RecipeRepository recipeRepository;
        private final ReviewRepository reviewRepository;
        private final FavouriteRepository favouriteRepository;
        private final CategoryMapper categoryMapper;

    public RecipeSimpleMapper(
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
        protected Recipe convertDtoToEntityImpl(SimpleRecipeDto dto) {
            Recipe entity;

            if (dto.getId() != null) {
                entity = this.recipeRepository.findById(dto.getId()).orElseThrow();
                entity.setId(dto.getId());
            } else {
                entity = new Recipe();
                entity.setUploadDate(LocalDate.now());
            }

            entity.setTitle(dto.getTitle());
            entity.setCategory(this.categoryMapper.convertDtoToEntityImpl(dto.getCategory()));
            entity.setTags(dto.getTags());

//        entity.setUploadDate(dto.getUploadDate());

            return entity;
        }

        @Override
        protected SimpleRecipeDto convertEntityToDtoImpl(Recipe entity) {
            SimpleRecipeDto dto = new SimpleRecipeDto();
            dto.setId(entity.getId());
            dto.setTitle(entity.getTitle());
            dto.setCategory(this.categoryMapper.convertEntityToDtoImpl(entity.getCategory()));
            dto.setTags(entity.getTags());

            Double average = reviewRepository.findAverageRatingByRecipeId(entity.getId());
            dto.setAverageRating(average != null ? average : 0.0);

            User user = entity.getUser();
            if (user != null) {
                dto.setUsername(entity.getUser().getUsername());
            }
            dto.setFavouritesCount(this.favouriteRepository.countByRecipe(entity));

            if (entity.getImages() != null && entity.getImages().size() > 0) {
                dto.setFirstImageUrl(entity.getImages().getFirst().getImageUrl());
            }
            return dto;
        }


    }
