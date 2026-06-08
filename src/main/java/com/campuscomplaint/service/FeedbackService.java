package com.campuscomplaint.service;

import com.campuscomplaint.dto.FeedbackResponse;
import com.campuscomplaint.dto.FeedbackRequest;
import com.campuscomplaint.entity.Complaint;
import com.campuscomplaint.entity.Feedback;
import com.campuscomplaint.entity.User;
import com.campuscomplaint.repository.FeedbackRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class FeedbackService {

    private final NotificationService notificationService;
    private final FeedbackRepository feedbackRepository;

    public Feedback createPendingFeedback(Complaint complaint, User student) {
        Feedback fb = Feedback.builder()
                .complaint(complaint)
                .student(student)
                .status(Feedback.FeedbackStatus.PENDING)
                .build();
        return feedbackRepository.save(fb);
    }

    public Feedback getFeedbackByComplaintId(Long complaintId) {
        Complaint c = Complaint.builder().id(complaintId).build();
        return feedbackRepository.findByComplaint(c)
                .orElseThrow(() -> new RuntimeException("Feedback not found"));
    }

    @Transactional
    public Feedback submitFeedback(Complaint complaint, User student, FeedbackRequest request) {
        Feedback fb = feedbackRepository.findByComplaint(complaint)
                .orElseThrow(() -> new RuntimeException("Feedback form not found"));

        if (fb.getStudent() == null || fb.getStudent().getId() == null) {
            throw new RuntimeException("Feedback owner information missing");
        }

        if (!fb.getStudent().getId().equals(student.getId())) {
            throw new RuntimeException("Not authorized to submit this feedback");
        }

        fb.setRating(request.getRating());
        fb.setComments(request.getComments());
        fb.setStatus(Feedback.FeedbackStatus.SUBMITTED);

        Feedback saved = feedbackRepository.save(fb);

        // Notify faculty after successful save. If notification fails, log it but do not roll back feedback.
        try {
            notificationService.notifyFeedbackSubmitted(complaint.getTitle(), complaint.getId(), saved.getRating(), saved.getComments());
        } catch (Exception e) {
            log.error("Failed to notify faculty about submitted feedback for complaint {}: {}", complaint.getId(), e.getMessage(), e);
        }

        return saved;
    }

    public FeedbackResponse toResponse(Feedback fb) {
        return FeedbackResponse.builder()
                .id(fb.getId())
                .complaintId(fb.getComplaint().getId())
                .rating(fb.getRating())
                .comments(fb.getComments())
                .status(fb.getStatus().name())
                .createdAt(fb.getCreatedAt())
                .updatedAt(fb.getUpdatedAt())
                .build();
    }
}