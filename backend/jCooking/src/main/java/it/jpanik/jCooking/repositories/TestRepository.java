package it.jpanik.jCooking.repositories;

import it.jpanik.jCooking.entities.TestEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TestRepository extends CrudRepository<TestEntity, Long> {
}