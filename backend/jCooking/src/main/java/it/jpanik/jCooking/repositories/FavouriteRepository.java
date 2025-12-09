package it.jpanik.jCooking.repositories;

import it.jpanik.jCooking.entities.Favourite;
import it.jpanik.jCooking.entities.Recipe;
import it.jpanik.jCooking.entities.User;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface FavouriteRepository extends CrudRepository<Favourite, Long> {
    public List<Favourite> findByUser(User user);
    public Optional<Favourite> findByUserAndRecipe(User user, Recipe recipe);
    public void deleteByUserAndRecipe(User user, Recipe recipe);
    public boolean existsByUserAndRecipe(User user, Recipe recipe);
    public List <Favourite> findByUser_UsernameContainingIgnoreCase (String username);
    public List <Favourite> findByUser_Username (String username);

    @Query("""
        SELECT f.recipe
        FROM Favourite f
        GROUP BY f.recipe
        ORDER BY COUNT(f.recipe) DESC
    """)
    List<Recipe> findMostFavoritedRecipes(Pageable pageable);

    Integer countByRecipe(Recipe recipe);

    @Transactional
    void deleteAllByRecipe_Id(Long recipeId);
}
