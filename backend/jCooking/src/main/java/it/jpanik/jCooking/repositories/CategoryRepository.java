package it.jpanik.jCooking.repositories;

import it.jpanik.jCooking.entities.Category;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface CategoryRepository extends CrudRepository<Category, Long> {
    Optional<Category> findBySlug(String slug);

}
