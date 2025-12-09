package it.jpanik.jCooking.mappers;

import it.jpanik.jCooking.dtos.TestDto;
import it.jpanik.jCooking.entities.TestEntity;
import it.jpanik.jCooking.repositories.TestRepository;
import org.springframework.stereotype.Service;

@Service
public class TestMapper extends Mapper<TestDto, TestEntity> {

    // 1
    private final TestRepository testRepository;

    public TestMapper(
            final TestRepository testRepository
    ) {
        this.testRepository = testRepository;
    }

    @Override
    protected TestEntity convertDtoToEntityImpl(TestDto dto) {
        TestEntity entity;

        // 2
        if (dto.getId() != null) {
            entity = this.testRepository.findById(dto.getId()).orElseThrow(); // 4
        } else {
            entity = new TestEntity();
//            entity.setCreationDate(LocalDate.now());
//            entity.setCreationUser("Current User");
        }

        // 3
        entity.setName(dto.getName());
        entity.setSurname(dto.getSurname());

        return entity;
    }

    @Override
    protected TestDto convertEntityToDtoImpl(TestEntity entity) {
        TestDto dto = new TestDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setSurname(entity.getSurname());
        return dto;
    }
}