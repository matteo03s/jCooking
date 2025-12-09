package it.jpanik.jCooking.repositories;

import it.jpanik.jCooking.entities.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import org.springframework.data.domain.Pageable;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends CrudRepository<User, Long> {
    public User findByName (String name);
    public User findByEmail (String email);
    boolean existsByEmail (String email);

    public User findByUsername(String username);

    @Query("SELECT u FROM User u ORDER BY size(u.recipes) DESC")
    List<User> findTopUsers(Pageable pageable);
}