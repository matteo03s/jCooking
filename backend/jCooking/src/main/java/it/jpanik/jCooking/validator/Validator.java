package it.jpanik.jCooking.validator;

import it.jpanik.jCooking.exceptions.ValidationException;

import java.util.List;

public abstract class Validator {

    public void checkEmpty(String value, String message) throws ValidationException {
        if (value == null || value.trim().isEmpty()) {
            throw new ValidationException(message);
        }
    }

    public void checkEmpty(Long value, String message) throws ValidationException {
        if (value == null) {
            throw new ValidationException(message);
        }
    }

    public void checkEmpty(Double value, String message) throws ValidationException {
        if (value == null) {
            throw new ValidationException(message);
        }
    }

    public void checkEmpty(List<?> values, String message) throws ValidationException {
        if (values == null || values.isEmpty()) {
            throw new ValidationException(message);
        }
    }

    public void checkNull(Object obj, String message) throws ValidationException {
        if (obj == null) {
            throw new ValidationException(message);
        }
    }

    public void checkRange(int value, int min, int max, String message) throws ValidationException {
        if (value < min || value > max) {
            throw new ValidationException(message);
        };
    }

    public void checkLength(String value, int min, int max, String message) throws ValidationException {
        if (value != null) {
            int size = value.trim().length();
            if (size < min || size > max) {
                throw new ValidationException(message);
            };
        }
    }
}