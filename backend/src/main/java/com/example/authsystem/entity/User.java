
package com.example.authsystem.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "full_name", nullable = true, length = 100)
    private String fullName;
    
    @Column(unique = true, nullable = false, length = 50)
    private String username;
    
    @Column(unique = true, nullable = false, length = 100)
    private String email;
    
    @Column(nullable = false)
    private String password;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    // Thêm các thuộc tính đánh giá
    @Column(name = "review_platform", length = 20)
    private String reviewPlatform; // "google" hoặc "facebook"
    
    @Column(name = "review_rating")
    private Integer reviewRating; // 1-5 sao
    
    @Column(name = "review_text", columnDefinition = "TEXT")
    private String reviewText; // Nội dung đánh giá
    
    @Column(name = "review_date")
    private LocalDateTime reviewDate; // Thời gian đánh giá
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}