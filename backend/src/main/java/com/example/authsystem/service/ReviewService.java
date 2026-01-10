package com.example.authsystem.service;

import com.example.authsystem.dto.ReviewRequest;
import com.example.authsystem.dto.ReviewResponse;
import com.example.authsystem.entity.User;
import com.example.authsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Slf4j
@Service
@RequiredArgsConstructor
public class ReviewService {
    
    private final UserRepository userRepository;
    
    private static final int MAX_REVIEW_LENGTH = 500;
    private static final String PLATFORM_GOOGLE = "google";
    private static final String PLATFORM_FACEBOOK = "facebook";
    
    /**
     * Lưu hoặc cập nhật đánh giá của user
     * ✅ FIX: Added isolation level, normalize input trước khi validate
     */
    @Transactional(isolation = Isolation.REPEATABLE_READ)
    public ReviewResponse saveReview(String username, ReviewRequest request) {
        log.info("Saving review for user: {}", username);
        
        // Tìm user theo username
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User không tồn tại: " + username));
        
        // ✅ Normalize và validate input
        normalizeAndValidateRequest(request);
        
        // Cập nhật thông tin đánh giá
        user.setReviewPlatform(request.getReviewPlatform());
        user.setReviewRating(request.getReviewRating());
        user.setReviewText(request.getReviewText());
        user.setReviewDate(LocalDateTime.now());
        
        // Lưu vào database
        User savedUser = userRepository.save(user);
        
        log.info("Review saved successfully for user: {}", username);
        
        // Trả về response
        return new ReviewResponse(
            savedUser.getReviewPlatform(),
            savedUser.getReviewRating(),
            savedUser.getReviewText(),
            savedUser.getReviewDate(),
            savedUser.getUsername()
        );
    }
    
    /**
     * Lấy đánh giá của user hiện tại
     */
    @Transactional(readOnly = true)
    public Optional<ReviewResponse> getUserReview(String username) {
        log.debug("Fetching review for user: {}", username);
        
        return userRepository.findByUsername(username)
                .flatMap(user -> {
                    // Nếu user chưa đánh giá, trả về empty
                    if (user.getReviewRating() == null) {
                        log.debug("No review found for user: {}", username);
                        return Optional.empty();
                    }
                    
                    ReviewResponse response = new ReviewResponse(
                        user.getReviewPlatform(),
                        user.getReviewRating(),
                        user.getReviewText(),
                        user.getReviewDate(),
                        user.getUsername()
                    );
                    
                    return Optional.of(response);
                });
    }
    
    /**
     * Xóa đánh giá của user
     */
    @Transactional
    public void deleteReview(String username) {
        log.info("Deleting review for user: {}", username);
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User không tồn tại: " + username));
        
        user.setReviewPlatform(null);
        user.setReviewRating(null);
        user.setReviewText(null);
        user.setReviewDate(null);
        
        userRepository.save(user);
        log.info("Review deleted successfully for user: {}", username);
    }
    
    /**
     * ✅ NEW: Normalize input TRƯỚC khi validate
     * Tránh việc trim() và toLowerCase() nhiều lần
     */
    private void normalizeAndValidateRequest(ReviewRequest request) {
        // Normalize platform
        if (request.getReviewPlatform() != null) {
            request.setReviewPlatform(
                request.getReviewPlatform().trim().toLowerCase()
            );
        }
        
        // Normalize text
        if (request.getReviewText() != null) {
            request.setReviewText(
                request.getReviewText().trim()
            );
        }
        
        // Validate after normalization
        validateReviewRequest(request);
    }
    
    /**
     * Validate ReviewRequest (sau khi đã normalize)
     */
    private void validateReviewRequest(ReviewRequest request) {
        // Validate platform
        if (request.getReviewPlatform() == null || request.getReviewPlatform().isEmpty()) {
            throw new IllegalArgumentException("Nền tảng không được để trống");
        }
        
        String platform = request.getReviewPlatform();
        if (!PLATFORM_GOOGLE.equals(platform) && !PLATFORM_FACEBOOK.equals(platform)) {
            throw new IllegalArgumentException(
                String.format("Nền tảng không hợp lệ. Chỉ chấp nhận '%s' hoặc '%s'", 
                    PLATFORM_GOOGLE, PLATFORM_FACEBOOK)
            );
        }
        
        // Validate rating
        if (request.getReviewRating() == null) {
            throw new IllegalArgumentException("Đánh giá không được để trống");
        }
        
        if (request.getReviewRating() < 1 || request.getReviewRating() > 5) {
            throw new IllegalArgumentException("Đánh giá phải từ 1 đến 5 sao");
        }
        
        // Validate text (đã được trim ở normalizeAndValidateRequest)
        if (request.getReviewText() == null || request.getReviewText().isEmpty()) {
            throw new IllegalArgumentException("Nội dung đánh giá không được để trống");
        }
        
        if (request.getReviewText().length() > MAX_REVIEW_LENGTH) {
            throw new IllegalArgumentException(
                String.format("Nội dung đánh giá không được vượt quá %d ký tự (hiện tại: %d)", 
                    MAX_REVIEW_LENGTH, request.getReviewText().length())
            );
        }
    }
}