package com.campuscomplaint.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;
import com.campuscomplaint.dto.ComplaintRequest;
import com.campuscomplaint.dto.StatusUpdateRequest;
import com.campuscomplaint.entity.Complaint;
import com.campuscomplaint.entity.User;
import com.campuscomplaint.enums.ComplaintStatus;
import com.campuscomplaint.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final CloudinaryService cloudinaryService;
    private final NotificationService notificationService;
    private final FeedbackService feedbackService;

    public Complaint createComplaint(
            ComplaintRequest request,
            User student,
            MultipartFile image) {

        log.info("Creating complaint for student: {}", student.getEmail());

        String imageUrl = null;

        if (image != null && !image.isEmpty()) {
            imageUrl = cloudinaryService.uploadFile(image);
            log.info("Image uploaded successfully");
        }

        Complaint complaint = Complaint.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .location(request.getLocation())
                .imageUrl(imageUrl)
                .student(student)
                .build();

        Complaint savedComplaint = complaintRepository.save(complaint);
        log.info("Complaint created successfully with ID: {}", savedComplaint.getId());

        // Notify all faculty about new complaint
        notificationService.notifyComplaintCreated(savedComplaint.getTitle(), savedComplaint.getId());

        // Notify student about registered complaint
        notificationService.notifyStudentComplaintCreated(student, savedComplaint.getTitle(), savedComplaint.getId());

        return savedComplaint;
    }

    public List<Complaint> getAllComplaints() {
        log.info("Fetching all complaints");
        return complaintRepository.findAll();
    }

    public Page<Complaint> getAllComplaints(Pageable pageable) {
        log.info("Fetching complaints with pagination: page={}, size={}",
                pageable.getPageNumber(), pageable.getPageSize());
        return complaintRepository.findAll(pageable);
    }

    public List<Complaint> getStudentComplaints(User student) {
        log.info("Fetching complaints for student: {}", student.getEmail());
        return complaintRepository.findByStudent(student);
    }

    public Complaint updateStatus(
            Long complaintId,
            StatusUpdateRequest request) {

        log.info("Updating complaint status: id={}, status={}", complaintId, request.getStatus());

        Complaint complaint = complaintRepository
                .findById(complaintId)
                .orElseThrow(() -> {
                    log.error("Complaint not found: {}", complaintId);
                    return new RuntimeException("Complaint not found");
                });

        complaint.setStatus(request.getStatus());
        complaint.setRemarks(request.getRemarks());

        Complaint updatedComplaint = complaintRepository.save(complaint);
        log.info("Complaint status updated successfully: id={}", complaintId);

        // If status changed to RESOLVED, generate feedback form for the student and notify them
        if (request.getStatus() == ComplaintStatus.RESOLVED) {
            try {
                feedbackService.createPendingFeedback(updatedComplaint, updatedComplaint.getStudent());
                notificationService.notifyFeedbackRequested(updatedComplaint.getStudent(), updatedComplaint.getTitle(), updatedComplaint.getId());
                log.info("Feedback form created and notification sent to student: {}", updatedComplaint.getStudent().getEmail());
            } catch (Exception e) {
                log.error("Failed to create feedback form: {}", e.getMessage());
            }
        }

        return updatedComplaint;
    }

    public Complaint getComplaintById(Long id) {
        log.info("Fetching complaint by id: {}", id);
        return complaintRepository.findById(id)
                .orElseThrow(() -> {
                    log.error("Complaint not found: {}", id);
                    return new RuntimeException("Complaint not found");
                });
    }

    public long countAllComplaints() {
        long count = complaintRepository.count();
        log.info("Total complaints count: {}", count);
        return count;
    }

    public long countByStatus(ComplaintStatus status) {
        long count = complaintRepository.countByStatus(status);
        log.info("Complaints count for status {}: {}", status, count);
        return count;
    }
}