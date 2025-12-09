package it.jpanik.jCooking.controllers;


import it.jpanik.jCooking.dtos.FavouriteDto;
import it.jpanik.jCooking.services.FavouriteService;
import it.jpanik.jCooking.services.RecipeService;
import it.jpanik.jCooking.services.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/favourites")
public class FavouriteController {

    private final FavouriteService favouriteService;



    public FavouriteController(FavouriteService favouriteService) {
        this.favouriteService = favouriteService;


    }
/*
    @PostMapping("/{recipeId}")
    public ResponseEntity<FavouriteDto> addFavourite(
            @PathVariable Long recipeId,
            @RequestParam Long userId) {
        User user = userService.getUserById(userId);
        Recipe recipe = recipeService.getRecipeById(recipeId);
        var favourite = favouriteService.addFavourite(user, recipe);
        return ResponseEntity.ok(FavouriteMapper.toDTO(favourite));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<FavouriteDto>> getUserFavourites(@PathVariable Long userId) {
        User user = userService.getUserById(userId);
        var favourites = favouriteService.getFavouritesByUser(user)
                .stream()
                .map(FavouriteMapper::toDTO)
                .toList();
        return ResponseEntity.ok(favourites);
    }

    @DeleteMapping("/{recipeId}")
    public ResponseEntity<Void> removeFavourite(@PathVariable Long recipeId, @RequestParam Long userId) {
        User user = userService.getUserById(userId);
        Recipe recipe = recipeService.getRecipeById(recipeId);
        favouriteService.removeFavourite(user, recipe);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<FavouriteDto> addFavourite(
            @RequestBody FavouriteDto favouriteDto,
            @RequestParam Long recipeId,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
    ) {
        return ResponseEntity.ok(this.favouriteService.saveOrUpdate(favouriteDto, principal.getUsername(), recipeId));
    }

    @GetMapping
    public ResponseEntity<List<FavouriteDto>> getFavourites(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
    ) {
        return ResponseEntity.ok(this.favouriteService.getByUsername(principal.getUsername()));
    }

*/
    @PostMapping("/{recipeId}")
    public ResponseEntity<FavouriteDto> addFavourite(
            @PathVariable Long recipeId,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
        ) {
        FavouriteDto favourite = favouriteService.addFavourite(recipeId, principal.getUsername());
        return ResponseEntity.ok(favourite);
    }

    @DeleteMapping("/{recipeId}")
    public ResponseEntity<Void> removeFavourite(
            @PathVariable Long recipeId,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
        ) {
        favouriteService.removeFavourite(recipeId, principal.getUsername());
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<FavouriteDto>> getUserFavourites(
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
        ) {
        List<FavouriteDto> favourites = favouriteService.getUserFavourites(principal.getUsername());
        return ResponseEntity.ok(favourites);
    }

}
