package com.example.authsystem.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ReviewPublicResponse {
    private Long id;
    private String fullname;
    private String avatar;
    private Integer rating;
    private String review;
    private String source;
    private String date;
}