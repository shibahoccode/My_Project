package com.example.authsystem.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewRequest {
    private String reviewPlatform; // "google" hoặc "facebook"
    private Integer reviewRating;  // 1-5
    private String reviewText;     // Nội dung đánh giá
}