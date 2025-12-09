package it.jpanik.jCooking.repositories;

import it.jpanik.jCooking.entities.Recipe;
import it.jpanik.jCooking.entities.Review;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface ReviewRepository extends CrudRepository<Review, Long> {

    public List<Review> findByUploadDate(LocalDate date);
    public List <Review> findByRating(Integer rating);

    /* ricerca tramite ricettaReviewo */
    public List <Review> findByRecipeTitleContainingIgnoreCase (String title);
    public List <Review> findByRecipe (Recipe recipe);

    public List<Review> findByRecipe_Id (Long recipeId);

    /* ordinamento review*/
    public List <Review> findAllByOrderByRatingAsc ();
    public List <Review> findAllByOrderByRatingDesc ();
    public List <Review> findAllByOrderByUploadDateAsc ();
    public List <Review> findAllByOrderByUploadDateDesc ();
    public List <Review> findAllByOrderByTitleAsc ();
    public List <Review> findAllByOrderByTitleDesc ();

    public List <Review> findByUser_UsernameContainingIgnoreCase (String username);
    public List <Review> findByUser_EmailContainingIgnoreCase(String email);
    public void deleteByRecipeId(Long id);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.recipe.id = :recipeId")
    Double findAverageRatingByRecipeId(@Param("recipeId") Long recipeId);

}
