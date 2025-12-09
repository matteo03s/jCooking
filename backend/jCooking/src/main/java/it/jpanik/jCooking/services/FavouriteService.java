package it.jpanik.jCooking.services;

import it.jpanik.jCooking.dtos.FavouriteDto;
import it.jpanik.jCooking.entities.Favourite;
import it.jpanik.jCooking.entities.Recipe;
import it.jpanik.jCooking.entities.User;
import it.jpanik.jCooking.exceptions.AlreadyExistingException;
import it.jpanik.jCooking.mappers.FavouriteMapper;
import it.jpanik.jCooking.repositories.FavouriteRepository;
import it.jpanik.jCooking.repositories.RecipeRepository;
import it.jpanik.jCooking.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class FavouriteService {

    private final FavouriteRepository favouriteRepository;
    private final FavouriteMapper favouriteMapper;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    public FavouriteService(
            FavouriteRepository favouriteRepository,
            FavouriteMapper favouriteMapper,
            UserRepository userRepository,
            RecipeRepository recipeRepository
    ) {
        this.favouriteRepository = favouriteRepository;
        this.favouriteMapper = favouriteMapper;
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
    }

    public FavouriteDto addFavourite(Long recipeId, String username) {
        User user = userRepository.findByUsername(username);
//                .orElseThrow(() -> new RuntimeException("User not found"));

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

        if (favouriteRepository.existsByUserAndRecipe(user, recipe)) {
            throw new AlreadyExistingException("Recipe is already in favourites");
        }

        Favourite favourite = new Favourite();
        favourite.setUser(user);
        favourite.setRecipe(recipe);
        favourite.setCreatedAt(LocalDateTime.now());

        favourite = this.favouriteRepository.save(favourite);
        return favouriteMapper.convertEntityToDto(favourite);
    }

    public void removeFavourite(Long recipeId, String username) {
        User user = userRepository.findByUsername(username);
//                .orElseThrow(() -> new RuntimeException("User not found"));

        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new RuntimeException("Recipe not found"));

//        this.favouriteRepository.deleteByUserAndRecipe(user, recipe);
        Favourite fav = this.favouriteRepository.findByUserAndRecipe(user, recipe).orElseThrow();
        this.favouriteRepository.delete(fav);
    }

    public List<FavouriteDto> getUserFavourites(String username) {
        User user = userRepository.findByUsername(username);
//                .orElseThrow(() -> new RuntimeException("User not found"));
        List <Favourite> result = new ArrayList<>();
        this.favouriteRepository.findByUser_Username(username).forEach(result::add);
        return this.favouriteMapper.convertListEntityToListDto(result);
    }
/*
    public List<Favourite> getFavouritesByUser(User user) {
        return favouriteRepository.findByUser(user);
    }

    public List<FavouriteDto> getByUsername (String username) {
        List <Favourite> result = new ArrayList<>();
        this.favouriteRepository.findByUser_UsernameContainingIgnoreCase(username).forEach(result::add);
        return this.favouriteMapper.convertListEntityToListDto(result);
    }

    public boolean isRecipeFavourited(User user, Recipe recipe) {
        return favouriteRepository.existsByUserAndRecipe(user, recipe);
    }

    public FavouriteDto saveOrUpdate (
            FavouriteDto favouriteDto,
            String username,
            Long recipeId
    ) {
        User user = this.userRepository.findByUsername(username);
        Recipe recipe = this.recipeRepository.findById(recipeId).orElseThrow();
        Favourite favourite = this.favouriteMapper.convertDtoToEntity(favouriteDto, user, recipe);
        favourite.setCreatedAt(LocalDateTime.now());
        favourite.setRecipe(recipe);
        favourite.setUser(user);
        favourite = this.favouriteRepository.save(favourite);
        return this.favouriteMapper.convertEntityToDto(favourite);
    }

    public FavouriteDto delete (Long id) {
        Favourite favourite = this.favouriteRepository.findById(id).orElseThrow();
        this.favouriteRepository.delete(favourite);
        return this.favouriteMapper.convertEntityToDto(favourite);
    }
 */
}

