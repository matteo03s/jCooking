package it.jpanik.jCooking.mappers;


import it.jpanik.jCooking.dtos.recipes.RecipeSummaryDto;
import it.jpanik.jCooking.dtos.review.ReviewDto;
import it.jpanik.jCooking.dtos.review.ReviewWithAuthorDto;
import it.jpanik.jCooking.dtos.review.UserSummaryDto;
import it.jpanik.jCooking.entities.Recipe;
import it.jpanik.jCooking.entities.Review;
import it.jpanik.jCooking.entities.User;
import it.jpanik.jCooking.repositories.ReviewRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ReviewMapper extends Mapper <ReviewWithAuthorDto, Review> {
    private final ReviewRepository reviewRepository;
    public ReviewMapper(
            ReviewRepository reviewRepository
    ) {
        this.reviewRepository = reviewRepository;
    }


    @Override
    protected Review convertDtoToEntityImpl(ReviewWithAuthorDto dto) {
        Review entity;

        if (dto.getId() != null) {
            entity = this.reviewRepository.findById(dto.getId()).orElseThrow();
        } else {
            entity = new Review();
            entity.setUploadDate(LocalDate.now());
        }
        entity.setTitle(dto.getTitle());
        entity.setComment(dto.getComment());
        entity.setRating(dto.getRating());

        return entity;
    }

    public Review convertDtoToEntity(ReviewDto dto, User user, Recipe recipe) {
        Review entity = new Review();
        entity.setId(dto.getId());
        entity.setTitle(dto.getTitle());
        entity.setComment(dto.getComment());
        entity.setRating(dto.getRating());
        entity.setUser(user);
        entity.setRecipe(recipe);
        return entity;
    }

    @Override
    protected ReviewWithAuthorDto convertEntityToDtoImpl(Review entity) {
    ReviewWithAuthorDto dto = new ReviewWithAuthorDto();
    dto.setId(entity.getId());
    dto.setTitle(entity.getTitle());
    dto.setComment(entity.getComment());
    dto.setRating(entity.getRating());
    dto.setUploadDate(entity.getUploadDate());

    User user = entity.getUser();
    if (user != null) {
        dto.setAuthor(
                new UserSummaryDto(
                        user.getId(),
                        user.getUsername(),
                        user.getEmail()
                )
        );
    }

    Recipe recipe = entity.getRecipe();
    if (recipe != null) {
        dto.setRecipe(
                new RecipeSummaryDto(
                        recipe.getId(),
                        recipe.getTitle()
                )
        );
    }
        return dto;
    }
}
