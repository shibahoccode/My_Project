package com.example.authsystem.controller;

import com.example.authsystem.dto.ReviewPublicResponse;
import com.example.authsystem.entity.User;
import com.example.authsystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = {
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://[::1]:5173"
})
public class ReviewController1 {

    private final UserRepository userRepository;

    /**
     * PUBLIC: Lấy danh sách reviews để hiển thị
     * ❌ Không cần Authentication
     */
    @GetMapping
    public ResponseEntity<?> getPublicReviews() {
        try {
            log.info("🌐 Fetching public reviews");

            List<User> usersWithReview =
                    userRepository.findByReviewRatingIsNotNull();

            log.info("📊 Found {} users with reviews in database", usersWithReview.size());

            if (usersWithReview.isEmpty()) {
                log.warn("⚠️ No reviews found in database!");
                // Trả về mảng rỗng thay vì error
                return ResponseEntity.ok(List.of());
            }

            List<ReviewPublicResponse> responses = usersWithReview.stream()
                    .map(this::mapToPublicResponse)
                    .toList();

            log.info("✅ Returning {} public reviews", responses.size());
            return ResponseEntity.ok(responses);

        } catch (Exception e) {
            log.error("❌ Error fetching public reviews", e);
            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Không thể tải danh sách đánh giá: " + e.getMessage());
        }
    }

    /* ================= HELPER METHODS ================= */

    private ReviewPublicResponse mapToPublicResponse(User user) {
        return new ReviewPublicResponse(
                user.getId(),
                getDisplayName(user),
                getAvatar(user),
                user.getReviewRating(),
                user.getReviewText(),
                user.getReviewPlatform(),
                formatDate(user.getReviewDate())
        );
    }

    private String getDisplayName(User user) {
        if (user.getFullName() != null && !user.getFullName().isBlank()) {
            return user.getFullName();
        }
        return user.getUsername();
    }

    private String getAvatar(User user) {
        String name = getDisplayName(user);
        String[] parts = name.trim().split(" ");

        if (parts.length == 1) {
            return parts[0].substring(0, 1).toUpperCase();
        }

        return ("" + parts[0].charAt(0) + parts[parts.length - 1].charAt(0))
                .toUpperCase();
    }

    private String formatDate(LocalDateTime date) {
        if (date == null) return "";
        return date.toLocalDate().toString(); 
        // frontend có thể format "2 ngày trước"
    }
}   