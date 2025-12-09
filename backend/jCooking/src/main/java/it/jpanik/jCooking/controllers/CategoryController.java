package it.jpanik.jCooking.controllers;

import it.jpanik.jCooking.dtos.CategoryDto;
import it.jpanik.jCooking.dtos.recipes.RecipeWithAuthorDto;
import it.jpanik.jCooking.entities.Category;
import it.jpanik.jCooking.mappers.CategoryMapper;
import it.jpanik.jCooking.repositories.CategoryRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final CategoryMapper categoryMapper;

    public CategoryController(CategoryRepository categoryRepository, CategoryMapper categoryMapper) {
        this.categoryRepository = categoryRepository;
        this.categoryMapper = categoryMapper;
    }

    @GetMapping
    public List<CategoryDto> getAll() {
        List<Category> result = new ArrayList<>();
        this.categoryRepository.findAll().forEach(result::add);
        return this.categoryMapper.convertListEntityToListDto(result);
    }

}
