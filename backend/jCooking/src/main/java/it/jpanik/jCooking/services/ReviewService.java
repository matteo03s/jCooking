package it.jpanik.jCooking.services;

import it.jpanik.jCooking.dtos.review.ReviewDto;
import it.jpanik.jCooking.dtos.review.ReviewWithAuthorDto;
import it.jpanik.jCooking.entities.Recipe;
import it.jpanik.jCooking.entities.Review;
import it.jpanik.jCooking.entities.User;
import it.jpanik.jCooking.mappers.ReviewMapper;
import it.jpanik.jCooking.repositories.RecipeRepository;
import it.jpanik.jCooking.repositories.ReviewRepository;
import it.jpanik.jCooking.repositories.UserRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ReviewService {
    private final ReviewRepository reviewRepository;
    private final ReviewMapper reviewMapper;
    private final CredentialsService credentialsService;
    private final RecipeService recipeService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final RecipeRepository recipeRepository;

    public ReviewService(
            ReviewRepository reviewRepository,
            ReviewMapper reviewMapper,
            CredentialsService credentialsService,
            RecipeService recipeService,
            UserService userService,
            UserRepository userRepository,
            RecipeRepository recipeRepository
    ) {
        this.reviewRepository = reviewRepository;
        this.reviewMapper = reviewMapper;
        this.credentialsService = credentialsService;
        this.recipeService = recipeService;
        this.userService = userService;
        this.userRepository = userRepository;
        this.recipeRepository = recipeRepository;
    }

    public List<ReviewWithAuthorDto> getAllReviews() {
        List<Review> result = new ArrayList<>();
        reviewRepository.findAll().forEach(result::add);
        return this.reviewMapper.convertListEntityToListDto(result);

    }
    public ReviewWithAuthorDto getReviewById(long id) {
        return this.reviewMapper.convertEntityToDto(
                this.reviewRepository.findById(id).orElseThrow()
        );
    }

    public List<ReviewWithAuthorDto> getReviewsByAuthor(String author) {
        List<Review> result = new ArrayList<>();
        this.reviewRepository.findByUser_UsernameContainingIgnoreCase(author).forEach(result::add);
        return this.reviewMapper.convertListEntityToListDto(result);
    }

    public List <ReviewWithAuthorDto> getReviewsByRating (Integer rating) {
        List<Review> result = new ArrayList<>();
        this.reviewRepository.findByRating(rating).forEach(result::add);
        return this.reviewMapper.convertListEntityToListDto(result);
    }

/*    public ReviewWithAuthorDto saveOrUpdate (
            ReviewWithAuthorDto reviewWithAuthorDto,
            String username,
            Long recipeId
    ) {
        Review review = this.reviewMapper.convertDtoToEntity(reviewWithAuthorDto);
        review.setUploadDate(LocalDate.now());
        User user = this.credentialsService.getByUsername(username).getUser();
        review.setUser(user);
        Recipe recipe = this.recipeService.getEntity(recipeId);
        review.setRecipe(recipe);
        review = this.reviewRepository.save(review);
        return this.reviewMapper.convertEntityToDto(review);
    }
*/
    public ReviewWithAuthorDto saveOrUpdate (
            ReviewDto reviewDto,
            String username,
            Long recipeId
    ) {
        User user = this.userRepository.findByUsername(username);
        Recipe recipe = this.recipeRepository.findById(recipeId).orElseThrow();
        Review review = this.reviewMapper.convertDtoToEntity(reviewDto, user, recipe);
        review.setUploadDate(LocalDate.now());
        review.setUser(user);
        review.setRecipe(recipe);
        review = this.reviewRepository.save(review);
        return this.reviewMapper.convertEntityToDto(review);
    }

    public ReviewWithAuthorDto delete (Long id) {
        Review review = this.reviewRepository.findById(id).orElseThrow();
        this.reviewRepository.delete(review);
        return this.reviewMapper.convertEntityToDto(review);
    }

    public List <ReviewWithAuthorDto> getByRecipe (Recipe recipe) {
        List <Review> result = new ArrayList<>();
        this.reviewRepository.findByRecipe(recipe).forEach(result::add);
        return this.reviewMapper.convertListEntityToListDto(result);
    }

    public List <ReviewWithAuthorDto> getByRecipeId (Long recipeId) {
        List <Review> result = new ArrayList<>();
        this.reviewRepository.findByRecipe_Id(recipeId).forEach(result::add);
        return this.reviewMapper.convertListEntityToListDto(result);
    }

    public List <ReviewWithAuthorDto> getByUser (String username) {
        List <Review> result = new ArrayList<>();
        this.reviewRepository.findByUser_UsernameContainingIgnoreCase(username).forEach(result::add);
        return this.reviewMapper.convertListEntityToListDto(result);
    }

    public List<Review> getAll() {
        return (List<Review>)this.reviewRepository.findAll();
    }

    public Review getById(Long id) {
        return this.reviewRepository.findById(id).orElseThrow();
    }
}
