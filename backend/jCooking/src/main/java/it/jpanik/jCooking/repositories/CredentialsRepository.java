package it.jpanik.jCooking.repositories;

import it.jpanik.jCooking.entities.Credentials;
import org.springframework.data.repository.CrudRepository;

public interface CredentialsRepository extends CrudRepository<Credentials, Long> {
    Credentials findByUsername(String username);
    boolean existsByUsername(String username);
}
