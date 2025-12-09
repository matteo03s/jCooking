package it.jpanik.jCooking.repositories;

import it.jpanik.jCooking.entities.Recipe;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RecipeRepository extends CrudRepository<Recipe, Long> {

    Page<Recipe> findAll(Pageable pageable);

    @Query(value = "SELECT * FROM \"RECIPE\" r WHERE :tag = ANY(r.\"TAGS\")", nativeQuery = true)
    List<Recipe> findByTag(@Param("tag") String tag);

    Page<Recipe> findByUserUsername(String username, Pageable pageable);

    Page<Recipe> findByTitleContainingIgnoreCase(String title, Pageable pageable);

    Page<Recipe> findByUser_UsernameContainingIgnoreCase(String username, Pageable pageable);

    Page<Recipe> findByCategory_Slug(String categorySlug, Pageable pageable);

    @Query("SELECT r FROM Recipe r WHERE LOWER(r.level) LIKE LOWER(CONCAT('%', :level, '%'))")
    Page<Recipe> findByLevel(@Param("level") String level, Pageable pageable);

    @Query(
            value = "SELECT * FROM \"RECIPE\" r WHERE array_to_string(r.\"TAGS\", ',') ILIKE CONCAT('%', :tag, '%')",
            countQuery = "SELECT count(*) FROM \"RECIPE\" r WHERE array_to_string(r.\"TAGS\", ',') ILIKE CONCAT('%', :tag, '%')",
            nativeQuery = true
    )
    Page<Recipe> findByTagContaining(@Param("tag") String tag, Pageable pageable);
    @Query(
            value = """
                        SELECT r
                        FROM Recipe r
                        WHERE (
                          SELECT AVG(rv.rating)
                          FROM Review rv
                          WHERE rv.recipe.id = r.id
                        ) >= :minRating
                    """,
            countQuery = """
                        SELECT count(r)
                        FROM Recipe r
                        WHERE (
                          SELECT AVG(rv.rating)
                          FROM Review rv
                          WHERE rv.recipe.id = r.id
                        ) >= :minRating
                    """
    )
    Page<Recipe> findByAverageRatingGreaterThanEqual(@Param("minRating") Double minRating, Pageable pageable);
    /*
    List<Recipe> findByUserUsername(String username);

    List<Recipe> findByTitleContainingIgnoreCase(String title);
    List<Recipe> findByUser_UsernameContainingIgnoreCase(String username);

    @Query(value = "SELECT * FROM \"RECIPE\" r WHERE LOWER(r.\"LEVEL\") LIKE LOWER(CONCAT('%', :level, '%'))", nativeQuery = true)
    List<Recipe> findByLevel(@Param("level") String level);

    List<Recipe> findByCategory_Slug(String categorySlug);

    @Query(value = "SELECT * FROM \"RECIPE\" r WHERE EXISTS (SELECT 1 FROM unnest(r.\"TAGS\") t WHERE LOWER(t) LIKE LOWER(CONCAT('%', :tag, '%')))", nativeQuery = true)
    List<Recipe> findByTagContaining(@Param("tag") String tag);
@Query("""
            SELECT r
            FROM Recipe r
            WHERE (
              SELECT AVG(rv.rating)
              FROM Review rv
              WHERE rv.recipe.id = r.id
            ) >= :minRating
        """)
List<Recipe> findByAverageRatingGreaterThanEqual(@Param("minRating") Double minRating);
*/

    @Query("""
                SELECT r 
                FROM Recipe r 
                LEFT JOIN r.reviews rev
                GROUP BY r
                ORDER BY COALESCE(AVG(rev.rating), 0) DESC
            """)
    List<Recipe> findTopRatedRecipes(Pageable pageable);

}
