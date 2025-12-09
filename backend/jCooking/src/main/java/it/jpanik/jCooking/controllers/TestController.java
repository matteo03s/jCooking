package it.jpanik.jCooking.controllers;

import it.jpanik.jCooking.dtos.TestDto;
import it.jpanik.jCooking.exceptions.ValidationException;
import it.jpanik.jCooking.services.TestService;
import it.jpanik.jCooking.validator.TestValidator;
import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/tests")
public class TestController {
    private static final Logger LOGGER = LoggerFactory.getLogger(TestController.class);

    private final TestService testService;
    private final TestValidator testValidator;

    public TestController(
            final TestService testService,
            final TestValidator testValidator
    ) {
        this.testService = testService;
        this.testValidator = testValidator;
    }

    @GetMapping("/welcome")
    public String welcome() {
        return "Welcome to the test controller!";
    }
    @GetMapping
    public List<TestDto> getAll() {
        LOGGER.debug("GET /tests");
        return this.testService.getAll();
    }

    @GetMapping("/{id}")
    public TestDto get(@PathVariable Long id) {
        LOGGER.debug("GET /tests/{}", id);
        return this.testService.get(id);
    }

    @PostMapping
    public TestDto saveOrUpdate(@RequestBody TestDto testDto) throws ValidationException {
        LOGGER.debug("POST /tests with body {}", testDto);
        this.testValidator.validate(testDto);
        return this.testService.saveOrUpdate(testDto);
    }

    @DeleteMapping("/{id}")
    public TestDto delete(@PathVariable Long id) {
        LOGGER.debug("DELETE /tests/{}", id);
        return this.testService.delete(id);
    }
}