package it.jpanik.jCooking.mappers;

import it.jpanik.jCooking.dtos.ImageDto;
import it.jpanik.jCooking.entities.Image;
import org.springframework.stereotype.Service;

@Service
public class RecipeImageMapper extends Mapper<ImageDto, Image> {
    @Override
    protected Image convertDtoToEntityImpl(ImageDto dto) {
        Image image = new Image();
        image.setId(dto.getId());
        image.setImageUrl(dto.getUrlImage());
        image.setPrimary(dto.isPrimary());
        return image;
    }

    @Override
    protected ImageDto convertEntityToDtoImpl(Image entity) {
        ImageDto dto = new ImageDto();
        dto.setId(entity.getId());
        dto.setUrlImage(entity.getImageUrl());
        dto.setPrimary(entity.isPrimary());
        return dto;
    }
}
