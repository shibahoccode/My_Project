package com.example.authsystem.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private String reviewPlatform;
    private Integer reviewRating;
    private String reviewText;
    private LocalDateTime reviewDate;
    private String username;
    
    public ReviewResponse(String reviewPlatform, Integer reviewRating, String reviewText, LocalDateTime reviewDate) {
        this.reviewPlatform = reviewPlatform;
        this.reviewRating = reviewRating;
        this.reviewText = reviewText;
        this.reviewDate = reviewDate;
    }
}