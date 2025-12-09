package it.jpanik.jCooking.services;

import it.jpanik.jCooking.dtos.TestDto;
import it.jpanik.jCooking.entities.TestEntity;
import it.jpanik.jCooking.mappers.TestMapper;
import it.jpanik.jCooking.repositories.TestRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;


@Service
public class TestService {

    private final TestRepository testRepository;
    private final TestMapper testMapper;

    // 1
    public TestService(
            final TestRepository testRepository,
            final TestMapper testMapper
    ) {
        this.testRepository  = testRepository;
        this.testMapper = testMapper;
    }

    // 2
    public List<TestDto> getAll() {
        List<TestEntity> result = new ArrayList<>();
        testRepository.findAll().forEach(result::add);
        return this.testMapper.convertListEntityToListDto(result);
    }

    // 3
    public TestDto get(Long id) {
        return this.testMapper.convertEntityToDto(
                this.testRepository.findById(id).orElseThrow()
        );
    }

    // 4
    public TestDto saveOrUpdate(TestDto testDto) {
        TestEntity entity = this.testMapper.convertDtoToEntity(testDto);
        entity = this.testRepository.save(entity);
        return this.testMapper.convertEntityToDto(entity);
    }

    // 5
    public TestDto delete(Long id) {
        TestEntity entity = this.testRepository.findById(id).orElseThrow();
        this.testRepository.delete(entity);
        return this.testMapper.convertEntityToDto(entity);
    }
}