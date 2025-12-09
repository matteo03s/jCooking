package it.jpanik.jCooking.repositories;

import it.jpanik.jCooking.entities.Ingredient;
import it.jpanik.jCooking.entities.Recipe;
import it.jpanik.jCooking.entities.RecipeIngredient;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;


@Repository
public interface RecipeIngredientRepository extends CrudRepository<RecipeIngredient,Long> {

    @Query ("SELECT ri.recipe FROM RecipeIngredient ri WHERE ri.ingredient.id=:ingredientId")
    List<Recipe> findRecipesByIngredientId(@Param("ingredientId") Long ingredientId);

    @Query ("SELECT ri.ingredient FROM RecipeIngredient ri WHERE ri.recipe.id=:recipeId")
    List<Ingredient> findIngredientsByRecipeId(@Param("recipeId") Long RecipeId);

    List<RecipeIngredient> findByIngredientId(Long ingredientId);
    List<RecipeIngredient> findByRecipeId(Long recipeId);

    Optional<RecipeIngredient> findByRecipeIdAndIngredientName(Long recipeId, String ingredientName);

    @Modifying
    @Transactional
    void deleteByRecipeId(Long recipeId);

}
