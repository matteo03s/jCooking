package it.jpanik.jCooking.mappers;

import it.jpanik.jCooking.dtos.FavouriteDto;
import it.jpanik.jCooking.entities.Favourite;
import it.jpanik.jCooking.entities.Image;
import it.jpanik.jCooking.entities.Recipe;
import it.jpanik.jCooking.entities.User;
import it.jpanik.jCooking.repositories.FavouriteRepository;
import it.jpanik.jCooking.repositories.RecipeRepository;
import it.jpanik.jCooking.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
public class FavouriteMapper extends Mapper<FavouriteDto, Favourite> {

    private final FavouriteRepository favouriteRepository;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    FavouriteMapper(
            final FavouriteRepository favouriteRepository,
            final UserRepository userRepository,
            final RecipeRepository recipeRepository
    ) {
        this.favouriteRepository = favouriteRepository;
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
    }

    @Override
    protected Favourite convertDtoToEntityImpl(FavouriteDto dto) {
        Favourite entity;

        if (dto.getId() != null) {
            entity = this.favouriteRepository.findById(dto.getId()).orElseThrow();
        } else {
            entity = new Favourite();
            entity.setCreatedAt(LocalDateTime.now());
        }

        User user = this.userRepository.findById(dto.getUserId()).orElseThrow();
        if (user != null) {
            entity.setUser(user);
        }

        Recipe recipe = this.recipeRepository.findById(dto.getRecipeId()).orElseThrow();
        if (recipe != null) {
            entity.setRecipe(recipe);
        }

        return entity;
    }

    public Favourite convertDtoToEntity(
            FavouriteDto dto,
            User user,
            Recipe recipe) {
        Favourite entity = new  Favourite();
        entity.setId(dto.getId());
        entity.setUser(user);
        entity.setRecipe(recipe);
        entity.setCreatedAt(LocalDateTime.now());

        return entity;
    }

    @Override
    protected FavouriteDto convertEntityToDtoImpl(Favourite entity) {
        if (entity == null) {
            return null;
        }
        FavouriteDto dto = new FavouriteDto();
        dto.setId(entity.getId());
        dto.setCreatedAt(entity.getCreatedAt());

        User user = entity.getUser();
        if (user != null) {
            dto.setUserId(user.getId());
            dto.setUsername(user.getUsername());
        }
        Recipe recipe = entity.getRecipe();
        if (recipe != null) {
            dto.setRecipeId(recipe.getId());
            dto.setRecipeTitle(recipe.getTitle());
            List<Image> images = recipe.getImages();

            if (images != null && !images.isEmpty()) {
                int randomIndex = new Random().nextInt(images.size());
                Image randomImage = images.get(randomIndex);

                dto.setRecipeImage(randomImage.getImageUrl());
            } else {
                dto.setRecipeImage(null);
            }
        }
        return dto;
    }
}
