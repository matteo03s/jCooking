package it.jpanik.jCooking.validator;

import it.jpanik.jCooking.dtos.*;
import it.jpanik.jCooking.dtos.recipes.RecipeDto;
import it.jpanik.jCooking.dtos.recipes.RecipeWithAuthorDto;
import it.jpanik.jCooking.exceptions.ValidationException;
import org.springframework.stereotype.Service;

@Service
public class TestValidator extends Validator {

    public void validate(TestDto dto) throws ValidationException {
        checkEmpty(dto.getName(), "Name: required field");
        checkLength(dto.getName(), 1, 64, "Name: length must be between 1 and 64");
        checkEmpty(dto.getSurname(), "Surname: required field");
        checkLength(dto.getSurname(), 1, 64, "Surname: length must be between 1 and 64");
    }

    public void validate(RecipeDto dto) throws ValidationException {
        checkEmpty(dto.getTitle(), "Title: required field");
        checkLength(dto.getTitle(), 1, 64, "Title: length must be between 1 and 64");
        checkEmpty(dto.getDescription(), "Description: required field");
        checkRange(dto.getServings(), 1, 10, "Servings: range must be between 1 and 10");
        checkRange(dto.getPrepTime(), 1, 6000, "Prep time: range must be between 1 and 6000");
    }
    public void validate(RecipeWithAuthorDto dto) throws ValidationException {
        checkEmpty(dto.getTitle(), "Title: required field");
        checkLength(dto.getTitle(), 1, 64, "Title: length must be between 1 and 64");
        checkEmpty(dto.getDescription(), "Description: required field");
        checkRange(dto.getServings(), 1, 10, "Servings: range must be between 1 and 10");
        checkRange(dto.getPrepTime(), 1, 6000, "Prep time: range must be between 1 and 6000");
    }

    public void validate(IngredientDto dto) throws ValidationException {
        checkEmpty(dto.getName(), "Name: required field");
        checkLength(dto.getName(), 1, 64, "Name: length must be between 1 and 64");

    }

    public void validate(RecipeIngredientDto dto) throws ValidationException {
        checkEmpty(dto.getUnit(), "Unit: required field");
        checkEmpty(dto.getQuantity(), "Quantity: required field");
    }
}
