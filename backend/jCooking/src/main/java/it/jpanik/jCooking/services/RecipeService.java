package it.jpanik.jCooking.services;

import it.jpanik.jCooking.dtos.ImageDto;
import it.jpanik.jCooking.dtos.IngredientDto;
import it.jpanik.jCooking.dtos.recipes.RecipeWithAuthorDto;
import it.jpanik.jCooking.dtos.recipes.SimpleRecipeDto;
import it.jpanik.jCooking.entities.*;
import it.jpanik.jCooking.mappers.*;
import it.jpanik.jCooking.repositories.FavouriteRepository;
import it.jpanik.jCooking.repositories.IngredientRepository;
import it.jpanik.jCooking.repositories.RecipeIngredientRepository;
import it.jpanik.jCooking.repositories.RecipeRepository;
import it.jpanik.jCooking.services.storage.StorageService;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.JpaSort;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecipeService {

    private static final Logger LOGGER = LoggerFactory.getLogger(RecipeService.class);
    private final RecipeRepository recipeRepository;
    private final FavouriteRepository favouriteRepository;
    private final IngredientRepository ingredientRepository;
    private final RecipeIngredientRepository recipeIngredientRepository;
    private final RecipeMapper recipeMapper;
    private final RecipeAuthorMapper recipeAuthorMapper;
    private final RecipeSimpleMapper recipeSimpleMapper;
    private final RecipeIngredientMapper recipeIngredientMapper;
    private final RecipeImageMapper recipeImageMapper;
    private final CredentialsService credentialsService;
    private final StorageService storageService;

    public RecipeService(
            RecipeRepository recipeRepository,
            FavouriteRepository favouriteRepository,
            IngredientRepository ingredientRepository,
            RecipeIngredientRepository recipeIngredientRepository,
            RecipeMapper recipeMapper,
            RecipeAuthorMapper recipeAuthorMapper,
            RecipeSimpleMapper recipeSimpleMapper,
            RecipeIngredientMapper recipeIngredientMapper,
            RecipeImageMapper recipeImageMapper,
            CredentialsService credentialsService,
            StorageService storageService
    ) {
        this.recipeRepository = recipeRepository;
        this.favouriteRepository = favouriteRepository;
        this.ingredientRepository = ingredientRepository;
        this.recipeIngredientRepository = recipeIngredientRepository;
        this.recipeMapper = recipeMapper;
        this.recipeAuthorMapper = recipeAuthorMapper;
        this.recipeSimpleMapper = recipeSimpleMapper;
        this.recipeIngredientMapper = recipeIngredientMapper;
        this.recipeImageMapper = recipeImageMapper;
        this.credentialsService = credentialsService;
        this.storageService = storageService;
    }

    public List<RecipeWithAuthorDto> getAll() {
        List<Recipe> result = new ArrayList<>();
        recipeRepository.findAll().forEach(result::add);
        return this.recipeAuthorMapper.convertListEntityToListDto(result);
    }

    public List<SimpleRecipeDto> getAllSimples() {
        List<Recipe> result = new ArrayList<>();
        recipeRepository.findAll().forEach(result::add);
        return this.recipeSimpleMapper.convertListEntityToListDto(result);
    }

    public Page<SimpleRecipeDto> getAll(Pageable pageable) {
        Page<Recipe> recipePage = recipeRepository.findAll(pageable);
        return recipePage.map(recipeSimpleMapper::convertEntityToDto);
    }

    public Page<SimpleRecipeDto> searchRecipes(Pageable pageable, String term, String filter) {
        Page<Recipe> result;

        switch (filter.toLowerCase()) {
            case "title":
                result = recipeRepository.findByTitleContainingIgnoreCase(term, pageable);
                break;
            case "author":
            case "user":
                result = recipeRepository.findByUser_UsernameContainingIgnoreCase(term, pageable);
                break;
            case "tag":
            case "tags":
                Pageable nativePageable = convertToNativePageable(pageable);
                result = recipeRepository.findByTagContaining(term, nativePageable);
                break;
            case "level":
                result = recipeRepository.findByLevel(term, pageable);
                break;
            case "category":
                result = recipeRepository.findByCategory_Slug(term, pageable);
                break;
            case "averagerating":
                try {
                    Double minRating = Double.parseDouble(term);
                    result = recipeRepository.findByAverageRatingGreaterThanEqual(minRating, pageable);
                } catch (NumberFormatException e) {
                    result = Page.empty();
                }
                break;
            default:
                result = recipeRepository.findAll(pageable);
                break;
        }

        return result.map(recipeSimpleMapper::convertEntityToDto);
    }
    private Pageable convertToNativePageable(Pageable pageable) {
        Sort newSort = Sort.unsorted();

        for (Sort.Order order : pageable.getSort()) {
            if (order.getProperty().equals("uploadDate")) {
                // USARE JpaSort.unsafe è il trucco per le Native Query con nomi colonna raw
                newSort = newSort.and(JpaSort.unsafe(order.getDirection(), "\"UPLOAD_DATE\""));
            } else if (order.getProperty().equals("id")) {
                newSort = newSort.and(JpaSort.unsafe(order.getDirection(), "\"ID\""));
            } else {
                // Fallback per altri campi (usa il sort standard)
                newSort = newSort.and(Sort.by(order.getDirection(), order.getProperty()));
            }
        }

        return PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), newSort);
    }

    public List<SimpleRecipeDto> getHighest() {
        var recipes = recipeRepository.findTopRatedRecipes(PageRequest.of(0, 5));
        return recipeSimpleMapper.convertListEntityToListDto(recipes);
    }

    public List<SimpleRecipeDto> getMostFavourited() {
        List<Recipe> recipes = this.favouriteRepository.findMostFavoritedRecipes(
                PageRequest.of(0, 5)
        );
        return recipeSimpleMapper.convertListEntityToListDto(recipes);
    }

    public RecipeWithAuthorDto get(Long id) {
        Recipe entity = this.recipeRepository.findById(id).orElseThrow();
        RecipeWithAuthorDto dto = this.recipeAuthorMapper.convertEntityToDto(entity);
        dto.setIngredients(this.recipeIngredientMapper.toDtoList(entity.getRecipeIngredients()));
        dto.setImages(this.recipeImageMapper.convertListEntityToListDto(entity.getImages()));
        return dto;
    }

    public Recipe getEntity(Long id) {
        return this.recipeRepository.findById(id).orElseThrow();
    }

/*
    public RecipeWithAuthorDto saveOrUpdate(RecipeWithAuthorDto dto, String username) {

        Recipe recipe = this.recipeAuthorMapper.convertDtoToEntity(dto);
        recipe.setUploadDate(LocalDate.now());
        User user = this.credentialsService.getByUsername(username).getUser();
        recipe.setUser(user);

        this.recipeIngredientRepository.deleteByRecipeId(dto.getId());
        recipe.getRecipeIngredients().clear();
//        if(dto.getIngredients() == null) {
//           this.recipeIngredientRepository.deleteByRecipeId(recipe.getId());
//        } else {}
        if (dto.getIngredients() != null) {
            for (IngredientDto ingDto : dto.getIngredients()) {

                Ingredient ingredient = ingredientRepository.findByName(ingDto.getName())
                        .orElseGet(() -> {
                            Ingredient newIng = new Ingredient();
                            newIng.setName(ingDto.getName());
                            return ingredientRepository.save(newIng);
                        });

                RecipeIngredient ri = new RecipeIngredient();
                ri.setRecipe(recipe);     // !!! RELAZIONE PADRE
                ri.setIngredient(ingredient);
                ri.setQuantity(ingDto.getQuantity());
                ri.setUnit(ingDto.getUnit());

                recipe.getRecipeIngredients().add(ri);
            }
        }

        recipe = recipeRepository.save(recipe);

        return recipeAuthorMapper.convertEntityToDto(recipe);
    }


    private RecipeIngredient mapIngredientDtoToEntity(IngredientDto dto) {
        if (dto == null) {
            return null;
        }

        Ingredient ingredient = ingredientRepository.findByName(dto.getName())
                .orElseGet(() -> {
                    Ingredient newIng = new Ingredient();
                    newIng.setName(dto.getName());
                    return ingredientRepository.save(newIng);
                });

        RecipeIngredient recipeIngredient = new RecipeIngredient();
        recipeIngredient.setIngredient(ingredient);
        recipeIngredient.setQuantity(dto.getQuantity());
        recipeIngredient.setUnit(dto.getUnit());

        return recipeIngredient;
    }

    */
    @Transactional
    public RecipeWithAuthorDto saveOrUpdate(RecipeWithAuthorDto recipeWithAuthorDto, String username) {
        Recipe recipe = this.recipeAuthorMapper.convertDtoToEntity(recipeWithAuthorDto);
        recipe.setUploadDate(LocalDate.now());
        User user = this.credentialsService.getByUsername(username).getUser();
        recipe.setUser(user);

        recipe.getRecipeIngredients().clear();
        this.recipeIngredientRepository.deleteByRecipeId(recipe.getId());

        if (recipeWithAuthorDto.getIngredients() != null && !recipeWithAuthorDto.getIngredients().isEmpty()) {
            Set<RecipeIngredient> recipeIngredients = mapIngredientDtosToEntities(recipeWithAuthorDto.getIngredients(), recipe);
            recipe.setRecipeIngredients(recipeIngredients);
        } else {
           recipe.getRecipeIngredients().clear();
       }
        recipe = this.recipeRepository.save(recipe);
        return this.recipeAuthorMapper.convertEntityToDto(recipe);
   }

   @Transactional
   protected Set<RecipeIngredient> mapIngredientDtosToEntities(List<IngredientDto> ingredientDtos, Recipe recipe) {
        return ingredientDtos.stream().map(dto -> {
            Ingredient ingredient = ingredientRepository.findByName(dto.getName().toLowerCase())
                    .orElseGet(() -> {
                        Ingredient newIng = new Ingredient();
                        newIng.setName(dto.getName().toLowerCase());
                        return ingredientRepository.save(newIng);
                    });


            if (!this.recipeIngredientRepository.findByRecipeIdAndIngredientName(recipe.getId(), dto.getName()).isPresent()) {
                RecipeIngredient recipeIngredient = new RecipeIngredient();
                recipeIngredient.setRecipe(recipe);
                recipeIngredient.setIngredient(ingredient);

                recipeIngredient.setQuantity(dto.getQuantity());
                recipeIngredient.setUnit(dto.getUnit());

                return recipeIngredient;

            }
            else {
                return null;
            }
        }).collect(Collectors.toSet());
    }

    /*    private Set<RecipeIngredient> mapIngredientDtosToEntities(List<IngredientDto> ingredientDtos) {
            if (ingredientDtos == null) {
                return new HashSet<>();
            }
            return ingredientDtos.stream().map(dto -> {
                Ingredient ingredient = ingredientRepository.findByName(dto.getName())
                        .orElseGet(() -> {
                            Ingredient newIng = new Ingredient();
                            newIng.setName(dto.getName());
                            return ingredientRepository.save(newIng);
                        });

                RecipeIngredient recipeIngredient = new RecipeIngredient();
                recipeIngredient.setIngredient(ingredient);
                recipeIngredient.setQuantity(dto.getQuantity());
                recipeIngredient.setUnit(dto.getUnit());

                return recipeIngredient;
            }).collect(Collectors.toSet());
        }
      private Set<RecipeIngredient> mapIngredientDtosToEntities(List<IngredientDto> ingredientDtos, Recipe recipe) {
            return ingredientDtos.stream().map(dto -> {
                // Cerca l'ingrediente master nel DB per nome, o creane uno se non esiste
                Ingredient ingredient = ingredientRepository.findByName(dto.getName())
                        .orElseGet(() -> {
                            Ingredient newIng = new Ingredient();
                            newIng.setName(dto.getName());
                            return ingredientRepository.save(newIng);
                        });

                RecipeIngredient recipeIngredient = new RecipeIngredient();
                recipeIngredient.setRecipe(recipe); // Collega la ricetta corrente
                recipeIngredient.setIngredient(ingredient); // Collega l'ingrediente master
                recipeIngredient.setQuantity(dto.getQuantity());
                recipeIngredient.setUnit(dto.getUnit());

                return recipeIngredient;
            }).collect(Collectors.toSet());
        }
*/



    public RecipeWithAuthorDto delete(Long id) {
        Recipe recipe = this.recipeRepository.findById(id).orElseThrow();
        this.favouriteRepository.deleteAllByRecipe_Id(recipe.getId());
        this.recipeRepository.delete(recipe);
        return this.recipeAuthorMapper.convertEntityToDto(recipe);
    }

    /*
    public List<SimpleRecipeDto> getByTag(String tag) {
        List<Recipe> result = new ArrayList<>();
        recipeRepository.findByTag(tag).forEach(result::add);
        return this.recipeSimpleMapper.convertListEntityToListDto(result);
    }
    public List<SimpleRecipeDto> getByCategorySlug(String categorySlug) {
        List<Recipe> result = recipeRepository.findByCategory_Slug(categorySlug);
        return recipeSimpleMapper.convertListEntityToListDto(result);
    }

    public List<SimpleRecipeDto> getByUser(String username) {
        List<Recipe> result = recipeRepository.findByUserUsername(username);
        return recipeSimpleMapper.convertListEntityToListDto(result);
    }

    public List<SimpleRecipeDto> getByLevel(String level) {
        List<Recipe> result = recipeRepository.findByLevel(level);
        return recipeSimpleMapper.convertListEntityToListDto(result);
    }

    public List<SimpleRecipeDto> searchRecipes(String term, String filter) {
        List<Recipe> result;

        switch (filter.toLowerCase()) {
            case "title":
                result = recipeRepository.findByTitleContainingIgnoreCase(term);
                break;
            case "author":
            case "user":
                result = recipeRepository.findByUser_UsernameContainingIgnoreCase(term);
                break;
            case "tag":
            case "tags":
                result = recipeRepository.findByTagContaining(term);
                break;
            case "level":
                result = recipeRepository.findByLevel(term);
                break;
            case "category":
                result = recipeRepository.findByCategory_Slug(term);
                break;
            case "averagerating":
                try {
                    Double minRating = Double.parseDouble(term);
                    result = recipeRepository.findByAverageRatingGreaterThanEqual(minRating);
                } catch (NumberFormatException e) {
                    result = List.of();
                }
                break;
            default:
                result = new ArrayList<>();
                recipeRepository.findAll().forEach(result::add);
                break;
        }

        return recipeSimpleMapper.convertListEntityToListDto(result);
    }



    public List<RecipeWithAuthorDto> getHighest() {
        var recipes = recipeRepository.findTopRatedRecipes(PageRequest.of(0, 5));
        return recipeAuthorMapper.convertListEntityToListDto(recipes);
    }

    public List<RecipeWithAuthorDto> getMostFavourited() {
        List<Recipe> recipes = this.favouriteRepository.findMostFavoritedRecipes(
                PageRequest.of(0, 5)
        );
        return recipeAuthorMapper.convertListEntityToListDto(recipes);
    }

    public List<RecipeWithAuthorDto> getByTag(String tag) {
        List<Recipe> result = new ArrayList<>();
        recipeRepository.findByTag(tag).forEach(result::add);

        return this.recipeAuthorMapper.convertListEntityToListDto(result);
    }

    public List<RecipeWithAuthorDto> getByCategorySlug(String categorySlug) {
        List<Recipe> result = recipeRepository.findByCategory_Slug(categorySlug);
        return recipeAuthorMapper.convertListEntityToListDto(result);
    }

    public List<RecipeWithAuthorDto> getByUser(String username) {
        List<Recipe> result = recipeRepository.findByUserUsername(username);
        return recipeAuthorMapper.convertListEntityToListDto(result);
    }

    public List<RecipeWithAuthorDto> getByLevel(String level) {
        List<Recipe> result = recipeRepository.findByLevel(level);
        return recipeAuthorMapper.convertListEntityToListDto(result);
    }
    public List<RecipeWithAuthorDto> searchRecipes(String term, String filter) {
        List<Recipe> result;

        switch (filter.toLowerCase()) {
            case "title":
                result = recipeRepository.findByTitleContainingIgnoreCase(term);
                break;
            case "author":
                result = recipeRepository.findByUser_UsernameContainingIgnoreCase(term);
                break;
            case "tags":
                result = recipeRepository.findByTagContaining(term);
                break;
            case "level":
                result = recipeRepository.findByLevel(term);
                break;
            case "category":
                result = recipeRepository.findByCategory_Slug(term);
                break;
            case "averagerating":
                try {
                    Double minRating = Double.parseDouble(term);
                    result = recipeRepository.findByAverageRatingGreaterThanEqual(minRating);
                } catch (NumberFormatException e) {
                    result = List.of();
                }
                break;
            default:
                result = List.of();
        }

        return recipeAuthorMapper.convertListEntityToListDto(result);
    }
*/
    public ImageDto uploadRecipeImage (
            Long recipeId, MultipartFile file
    ) {

        Recipe recipe = this.recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ricetta non trovata con ID: " + recipeId));
            String imageUrl = this.storageService.uploadFile(file, recipeId);

            Image recipeImage = new Image();
            recipeImage.setImageUrl(imageUrl);
            recipeImage.setRecipe(recipe);

            recipe.getImages().add(recipeImage);
            this.recipeRepository.save(recipe);

            return this.recipeImageMapper.convertEntityToDto(recipeImage);
    }

    @Transactional
    public void deleteImageFromRecipe(Long recipeId, Long imageId, String username) {
        Recipe recipe = recipeRepository.findById(recipeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Ricetta non trovata"));

        if (!recipe.getUser().getUsername().equals(username)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Non hai i permessi per modificare questa ricetta");
        }
        Image imageToDelete = recipe.getImages().stream()
                .filter(img -> img.getId().equals(imageId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Immagine non trovata in questa ricetta"));
        try {
            storageService.deleteFile(imageToDelete.getImageUrl());
        } catch (Exception e) {
            LOGGER.warn("Impossibile eliminare il file fisico: " + imageToDelete.getImageUrl());
        }
        recipe.getImages().remove(imageToDelete);
        recipeRepository.save(recipe);
    }
}
