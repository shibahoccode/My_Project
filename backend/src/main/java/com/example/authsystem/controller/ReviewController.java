package com.example.authsystem.controller;

import com.example.authsystem.dto.ReviewRequest;
import com.example.authsystem.dto.ReviewResponse;
import com.example.authsystem.service.ReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {
    
    private final ReviewService reviewService;
    
    /**
     * Submit hoặc update đánh giá
     */
    @PostMapping("/submit")
    public ResponseEntity<?> submitReview(
            @RequestBody ReviewRequest request,
            Authentication authentication) {
        
        try {
            String username = authentication.getName();
            log.info("📝 Review submission request from user: {}", username);
            log.info("📝 Request data: platform={}, rating={}, textLength={}", 
                request.getReviewPlatform(), 
                request.getReviewRating(), 
                request.getReviewText() != null ? request.getReviewText().length() : 0);
            
            ReviewResponse response = reviewService.saveReview(username, request);
            
            log.info("✅ Review saved successfully for user: {}", username);
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            log.warn("⚠️ Validation error: {}", e.getMessage());
            return ResponseEntity
                    .badRequest()
                    .body(createErrorResponse(e.getMessage()));
                    
        } catch (Exception e) {
            log.error("❌ Error submitting review", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Có lỗi xảy ra khi lưu đánh giá"));
        }
    }
    
    /**
     * Lấy đánh giá hiện tại của user
     * ✅ FIX: Không throw 401/403 nếu user chưa có review
     */
    @GetMapping("/get")
    public ResponseEntity<?> getUserReview(Authentication authentication) {
        try {
            String username = authentication.getName();
            log.debug("📖 Fetching review for user: {}", username);
            
            // ✅ KIỂM TRA: Authentication có null không?
            if (username == null || username.isEmpty()) {
                log.warn("⚠️ Username is null or empty from authentication");
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(createErrorResponse("Unauthorized"));
            }
            
            Optional<ReviewResponse> review = reviewService.getUserReview(username);
            
            if (review.isPresent()) {
                log.debug("✅ Review found for user: {}", username);
                return ResponseEntity.ok(review.get());
            } else {
                log.debug("ℹ️ No review found for user: {} (this is normal)", username);
                // ✅ QUAN TRỌNG: Trả về 404, KHÔNG phải 401/403
                return ResponseEntity
                        .status(HttpStatus.NOT_FOUND)
                        .body(createErrorResponse("Chưa có đánh giá"));
            }
            
        } catch (Exception e) {
            log.error("❌ Error fetching review", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Có lỗi xảy ra khi tải đánh giá"));
        }
    }
    
    /**
     * Xóa đánh giá
     */
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteReview(Authentication authentication) {
        try {
            String username = authentication.getName();
            log.info("🗑️ Delete review request from user: {}", username);
            
            reviewService.deleteReview(username);
            
            Map<String, String> response = new HashMap<>();
            response.put("message", "Đánh giá đã được xóa thành công");
            
            log.info("✅ Review deleted successfully for user: {}", username);
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            log.error("❌ Error deleting review", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(createErrorResponse("Có lỗi xảy ra khi xóa đánh giá"));
        }
    }
    
    /**
     * Helper method để tạo error response
     */
    private Map<String, String> createErrorResponse(String message) {
        Map<String, String> error = new HashMap<>();
        error.put("message", message);
        return error;
    }
}