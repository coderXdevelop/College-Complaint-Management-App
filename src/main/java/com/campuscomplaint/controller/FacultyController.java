package com.campuscomplaint.controller;

import com.campuscomplaint.dto.DashboardStatsResponse;
import com.campuscomplaint.dto.StatusUpdateRequest;
import com.campuscomplaint.entity.Complaint;
import com.campuscomplaint.enums.ComplaintStatus;
import com.campuscomplaint.service.ComplaintService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@RestController
@RequestMapping("/api/faculty")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
@PreAuthorize("hasRole('FACULTY')")
public class FacultyController {

    private final ComplaintService complaintService;

    @GetMapping("/complaints")
    public Page<Complaint> getAllComplaints(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return complaintService.getAllComplaints(pageable);
    }

    @PutMapping("/complaints/{id}/status")
    public Complaint updateComplaintStatus(
            @PathVariable Long id,
            @RequestBody StatusUpdateRequest request) {
        return complaintService.updateStatus(id, request);
    }

    @GetMapping("/dashboard")
    public DashboardStatsResponse dashboard() {
        return DashboardStatsResponse.builder()
                .totalComplaints(complaintService.countAllComplaints())
                .pendingComplaints(complaintService.countByStatus(ComplaintStatus.PENDING))
                .inProgressComplaints(complaintService.countByStatus(ComplaintStatus.IN_PROGRESS))
                .resolvedComplaints(complaintService.countByStatus(ComplaintStatus.RESOLVED))
                .build();


    }
}