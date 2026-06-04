package com.campuscomplaint.service;
import org.springframework.web.multipart.MultipartFile;
import com.campuscomplaint.dto.ComplaintRequest;
import com.campuscomplaint.dto.StatusUpdateRequest;
import com.campuscomplaint.entity.Complaint;
import com.campuscomplaint.entity.User;
import com.campuscomplaint.enums.ComplaintStatus;
import com.campuscomplaint.repository.ComplaintRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ComplaintService {

    private final ComplaintRepository complaintRepository;
    private final CloudinaryService cloudinaryService;
    public Complaint createComplaint(
            ComplaintRequest request,
            User student,
            MultipartFile image) {

        String imageUrl = null;

        if (image != null &&
                !image.isEmpty()) {

            imageUrl =
                    cloudinaryService
                            .uploadFile(image);
        }

        Complaint complaint =
                Complaint.builder()
                        .title(request.getTitle())
                        .description(
                                request.getDescription())
                        .location(
                                request.getLocation())
                        .imageUrl(imageUrl)
                        .student(student)
                        .build();

        return complaintRepository
                .save(complaint);
    }

    public List<Complaint> getAllComplaints() {

        return complaintRepository.findAll();
    }

    public List<Complaint> getStudentComplaints(
            User student) {

        return complaintRepository.findByStudent(student);
    }

    public Complaint updateStatus(
            Long complaintId,
            StatusUpdateRequest request) {

        Complaint complaint = complaintRepository
                .findById(complaintId)
                .orElseThrow(() ->
                        new RuntimeException("Complaint not found"));

        complaint.setStatus(request.getStatus());
        complaint.setRemarks(request.getRemarks());

        return complaintRepository.save(complaint);
    }

    public Complaint getComplaintById(Long id) {

        return complaintRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Complaint not found"));
    }

    // Dashboard methods

    public long countAllComplaints() {
        return complaintRepository.count();
    }

    public long countByStatus(ComplaintStatus status) {
        return complaintRepository.findByStatus(status).size();
    }
}