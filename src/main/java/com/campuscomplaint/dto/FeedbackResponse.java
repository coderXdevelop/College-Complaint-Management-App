package com.campuscomplaint.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class FeedbackResponse {
    private Long id;
    private Long complaintId;
    private Integer rating;
    private String comments;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}