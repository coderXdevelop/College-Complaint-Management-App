package com.campuscomplaint.controller;

import com.campuscomplaint.dto.FeedbackRequest;
import com.campuscomplaint.dto.FeedbackResponse;
import com.campuscomplaint.entity.Complaint;
import com.campuscomplaint.entity.Feedback;
import com.campuscomplaint.entity.User;
import com.campuscomplaint.service.ComplaintService;
import com.campuscomplaint.service.FeedbackService;
import com.campuscomplaint.service.NotificationService;
import com.campuscomplaint.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/feedback")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class FeedbackController {

    private final FeedbackService feedbackService;
    private final UserService userService;
    private final ComplaintService complaintService;
    private final NotificationService notificationService;

    // Student views the feedback form (generated when faculty resolves)
    @GetMapping("/complaint/{complaintId}")
    public FeedbackResponse getFeedbackForComplaint(
            @PathVariable Long complaintId,
            Authentication authentication) {

        String email = authentication.getName();
        User student = userService.getUserByEmail(email);

        Feedback fb = feedbackService.getFeedbackByComplaintId(complaintId);

        if (!fb.getStudent().getId().equals(student.getId())) {
            throw new RuntimeException("Not authorized to view this feedback");
        }

        return feedbackService.toResponse(fb);
    }

    // Student submits feedback for a complaint
    @PostMapping("/complaint/{complaintId}")
    public FeedbackResponse submitFeedback(
            @PathVariable Long complaintId,
            @Valid @RequestBody FeedbackRequest request,
            Authentication authentication) {

        String email = authentication.getName();
        User student = userService.getUserByEmail(email);

        Complaint complaint = complaintService.getComplaintById(complaintId);

        if (!complaint.getStudent().getId().equals(student.getId())) {
            throw new RuntimeException("Not authorized to submit feedback for this complaint");
        }

        Feedback fb = feedbackService.submitFeedback(complaint, student, request);

        // notify faculty that feedback was submitted (could notify only assigned faculty if you add such a field)
        notificationService.notifyAllFaculty("Feedback submitted for complaint #" + complaint.getId());

        return feedbackService.toResponse(fb);
    }
}