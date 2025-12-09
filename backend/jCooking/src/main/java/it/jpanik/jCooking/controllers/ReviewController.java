package it.jpanik.jCooking.controllers;

import it.jpanik.jCooking.dtos.review.ReviewDto;
import it.jpanik.jCooking.dtos.review.ReviewWithAuthorDto;
import it.jpanik.jCooking.entities.Review;
import it.jpanik.jCooking.services.ReviewService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {
    private static final Logger LOGGER = LoggerFactory.getLogger(ReviewController.class);

    private final ReviewService  reviewService;

    public ReviewController(
            ReviewService reviewService
    ) {
        this.reviewService = reviewService;
    }


    @GetMapping
    public List<ReviewWithAuthorDto> getReviews() {
        LOGGER.info("GET /reviews");
        return this.reviewService.getAllReviews();
    }

    @GetMapping ("/{rating}")
    public List<ReviewWithAuthorDto> getReviewsByRating (@PathVariable Integer rating) {
        LOGGER.info("GET /reviews/{rating}");
        return this.reviewService.getReviewsByRating(rating);
    }

/*    @GetMapping ("/{id}")
    public ReviewWithAuthorDto getReview(@PathVariable Long id) {
        LOGGER.info("GET /reviews/{id}");
        return this.reviewService.getReviewById(id);
    }
*/
    @GetMapping ("/user/{username}")
    public List<ReviewWithAuthorDto> getReviewsByUsername(@PathVariable String username) {
        LOGGER.info("GET /reviews/user/{username}");
        return this.reviewService.getByUser(username);
    }

    @GetMapping ("/recipe/{recipeId}")
    public List<ReviewWithAuthorDto> getReviewsByRecipeId(@PathVariable Long recipeId) {
        LOGGER.info("GET /reviews/recipe/{recipeId}");
        return this.reviewService.getByRecipeId(recipeId);
    }

    @PostMapping
    public ReviewWithAuthorDto createReview (
            @RequestBody ReviewDto review,
            @RequestParam Long recipeId,
            @AuthenticationPrincipal org.springframework.security.core.userdetails.User principal
            ) {
        LOGGER.debug("POST /reviews/{}", review);
        return this.reviewService.saveOrUpdate(review, principal.getUsername(), recipeId);
    }

    @DeleteMapping ("/{id}")
    public ReviewWithAuthorDto deleteReview (@PathVariable Long id){
        LOGGER.info("DELETE /reviews/{id}");
        return this.reviewService.delete(id);
    }
}
