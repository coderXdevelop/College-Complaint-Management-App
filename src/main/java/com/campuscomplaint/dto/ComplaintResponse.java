package com.campuscomplaint.dto;

import com.campuscomplaint.enums.ComplaintStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class ComplaintResponse {

    private Long id;

    private String title;

    private String description;

    private String location;

    private String imageUrl;

    private String remarks;

    private ComplaintStatus status;

    private String studentName;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}