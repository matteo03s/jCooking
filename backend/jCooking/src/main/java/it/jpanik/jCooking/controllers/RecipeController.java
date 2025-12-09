package it.jpanik.jCooking.controllers;

import it.jpanik.jCooking.dtos.ImageDto;
import it.jpanik.jCooking.dtos.recipes.RecipeWithAuthorDto;
import it.jpanik.jCooking.dtos.recipes.SimpleRecipeDto;
import it.jpanik.jCooking.exceptions.ValidationException;
import it.jpanik.jCooking.repositories.RecipeRepository;
import it.jpanik.jCooking.services.RecipeService;
import it.jpanik.jCooking.services.storage.StorageService;
import it.jpanik.jCooking.validator.TestValidator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/recipes")
public class RecipeController {
    private static final Logger LOGGER = LoggerFactory.getLogger(RecipeController.class);

    private final RecipeService recipeService;
    private final TestValidator testValidator;
    private final StorageService storageService;
    private final RecipeRepository recipeRepository;

    public RecipeController(
            RecipeService recipeService,
            TestValidator testValidator,
            StorageService storageService,
            RecipeRepository recipeRepository
            ) {
        this.recipeService = recipeService;
        this.testValidator = testValidator;
        this.storageService = storageService;
        this.recipeRepository = recipeRepository;
    }
    /*     @GetMapping
        public List<SimpleRecipeDto> getAllSimples(){
            LOGGER.debug("GET /SimpleRecipes");
            return this.recipeService.getAllSimples();      }

        /*    @GetMapping
            public List<RecipeWithAuthorDto> getAllAuthors(){
                LOGGER.debug("GET /recipesAuthors");
                return this.recipeService.getAll();
            }
        */
    @GetMapping
    public ResponseEntity<Page<SimpleRecipeDto>> getAllRecipes(
            @PageableDefault(size = 10,
                    sort = "uploadDate",
                    direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        return ResponseEntity.ok(this.recipeService.getAll(pageable));
    }
    @GetMapping("/search")
    public ResponseEntity<Page<SimpleRecipeDto>> searchRecipes(
            @PageableDefault(size = 10,
                    sort = "uploadDate",
                    direction = Sort.Direction.DESC)
            Pageable pageable,
            @RequestParam String term,
            @RequestParam String filter
    ) {
        LOGGER.debug("GET /SimpleRecipes/search");
        Page<SimpleRecipeDto> recipes = recipeService.searchRecipes(pageable, term, filter);
        return ResponseEntity.ok(recipes);
    }


    @GetMapping ("/{id}")
    public RecipeWithAuthorDto get (@PathVariable Long id) {
        LOGGER.debug("GET /recipes/{}", id);
        return this.recipeService.get(id);
    }

    @PostMapping
    public RecipeWithAuthorDto saveOrUpdate (
            @RequestBody RecipeWithAuthorDto recipeWithAuthorDto,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal)
            throws ValidationException {
        LOGGER.debug ("POST /recipes/{}", recipeWithAuthorDto);
        try {
            this.testValidator.validate(recipeWithAuthorDto);
            return this.recipeService.saveOrUpdate(recipeWithAuthorDto, principal.getUsername());
        } catch (ValidationException val) {
            return null;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<RecipeWithAuthorDto> updateRecipe(
            @PathVariable Long id,
            @RequestBody RecipeWithAuthorDto recipeDto,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal)
            throws ValidationException {
        LOGGER.debug("PUT /recipes/{} - {}", id, recipeDto);

        try {
            this.testValidator.validate(recipeDto);
            RecipeWithAuthorDto existing = recipeService.get(id);
            if (existing == null) {
                return ResponseEntity.notFound().build();
            }
            if (!existing.getAuthor().getUsername().equals(principal.getUsername())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
            recipeDto.setId(id);
            RecipeWithAuthorDto updated = recipeService.saveOrUpdate(recipeDto, principal.getUsername());

            return ResponseEntity.ok(updated);

        } catch (ValidationException val) {
            LOGGER.error("Errore di validazione durante l'update: {}", val.getMessage());
            throw val;
        } catch (Exception ex) {
            LOGGER.error("Errore durante l'update della ricetta: {}", ex.getMessage(), ex);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping ("/{id}")
    public RecipeWithAuthorDto delete (@PathVariable Long id) {
        LOGGER.debug("DELETE /recipes/{}", id);
        return this.recipeService.delete(id);
    }


    @GetMapping("/highest")
    public List<SimpleRecipeDto> getHighest(){
        LOGGER.debug("GET /highest");
        return this.recipeService.getHighest();
    }

    @GetMapping("/favourites")
    public List<SimpleRecipeDto> getMostFavourited(){
        LOGGER.debug("GET /favourites");
        return this.recipeService.getMostFavourited();
    }
/*
    @GetMapping ("/tag/{tag}")
    public List<SimpleRecipeDto> getByTag(@PathVariable String tag) {
        LOGGER.debug("GET /recipes/tag");
        return this.recipeService.getByTag(tag);
    }
    @GetMapping ("/level/{level}")
    public List<SimpleRecipeDto> getByLevel(@PathVariable String level) {
        LOGGER.debug("GET /recipes/level");
        return this.recipeService.getByLevel(level);
    }

    @GetMapping("/user/{username}")
    public List<SimpleRecipeDto> getByUser(@PathVariable String username) {
        LOGGER.debug("GET /recipes/user/{}", username);
        return recipeService.getByUser(username);
    }
    @GetMapping ("/category/{categorySlug}")
    public List<SimpleRecipeDto> getByCategorySlug(@PathVariable String categorySlug) {
        LOGGER.debug("GET /recipes/category/{}", categorySlug);
        return this.recipeService.getByCategorySlug(categorySlug);
    }
    @GetMapping("/search")
    public ResponseEntity<List<SimpleRecipeDto>> searchRecipes(
            @RequestParam String term,
            @RequestParam String filter
    ) {
        LOGGER.debug("GET /SimpleRecipes/search");
        List<SimpleRecipeDto> recipes = recipeService.searchRecipes(term, filter);
        return ResponseEntity.ok(recipes);
    }
    */
/*
    @GetMapping("/favourites")
    public List<RecipeWithAuthorDto> getMostFavourited(){
        LOGGER.debug("GET /favourites");
        return this.recipeService.getMostFavourited();
    }

    @GetMapping ("/tag/{tag}")
    public List<RecipeWithAuthorDto> getByTag(@PathVariable String tag) {
        LOGGER.debug("GET /recipes/tag");
        return this.recipeService.getByTag(tag);
    }
    @GetMapping ("/level/{level}")
    public List<RecipeWithAuthorDto> getByLevel(@PathVariable String level) {
        LOGGER.debug("GET /recipes/level");
        return this.recipeService.getByLevel(level);
    }
    @GetMapping("/user/{username}")
    public List<RecipeWithAuthorDto> getByUser(@PathVariable String username) {
        LOGGER.debug("GET /recipes/user/{}", username);
        return recipeService.getByUser(username);
    }
        @GetMapping ("/category/{categorySlug}")
    public List<RecipeWithAuthorDto> getByCategorySlug(@PathVariable String categorySlug) {
        LOGGER.debug("GET /recipes/category/{}", categorySlug);
        return this.recipeService.getByCategorySlug(categorySlug);
    }
    @GetMapping("/search")
    public ResponseEntity<List<RecipeWithAuthorDto>> searchRecipes(
            @RequestParam String term,
            @RequestParam String filter
    ) {
        LOGGER.debug("GET /recipesAuthors/search");
        List<RecipeWithAuthorDto> recipes = recipeService.searchRecipes(term, filter);
        return ResponseEntity.ok(recipes);
    }
*/

    @PostMapping("/{recipeId}/images")
    public ResponseEntity<ImageDto> uploadRecipeImage(
            @PathVariable Long recipeId,
            @RequestParam("file") MultipartFile file
    ) {
        try {
            return ResponseEntity.ok(this.recipeService.uploadRecipeImage(recipeId, file));
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Errore nel caricamento dell'immagine: " + e.getMessage());
        }
    }

    @DeleteMapping("/{recipeId}/images/{imageId}")
    public ResponseEntity<Void> deleteImage(
            @PathVariable Long recipeId,
            @PathVariable Long imageId,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
    ) {
        LOGGER.debug("DELETE /recipes/{}/images/{} richiesto da {}", recipeId, imageId, principal.getUsername());
        this.recipeService.deleteImageFromRecipe(recipeId, imageId, principal.getUsername());
        return ResponseEntity.noContent().build();
    }
}
