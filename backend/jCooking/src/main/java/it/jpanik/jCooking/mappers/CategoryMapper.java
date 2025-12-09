package it.jpanik.jCooking.mappers;

import it.jpanik.jCooking.dtos.CategoryDto;
import it.jpanik.jCooking.entities.Category;
import it.jpanik.jCooking.repositories.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CategoryMapper extends Mapper<CategoryDto, Category> {

    private final CategoryRepository categoryRepository;

    public CategoryMapper(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    @Override
    protected Category convertDtoToEntityImpl(CategoryDto dto) {
        Category entity = new Category();
        if (dto == null || dto.getSlug() == null) {
            return null;
        }
        entity = this.categoryRepository.findBySlug(dto.getSlug())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Categoria non trovata con slug: " + dto.getSlug()
                ));
        return entity;
    }

    @Override
    protected CategoryDto convertEntityToDtoImpl(Category entity) {
        CategoryDto dto = new CategoryDto();
        dto.setId(entity.getId());
        dto.setName(entity.getName());
        dto.setSlug(entity.getSlug());
        dto.setPathIcon(entity.getPathIcon());
        dto.setDescription(entity.getDescription());
        return dto;
    }
}
