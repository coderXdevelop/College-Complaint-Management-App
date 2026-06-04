package com.campuscomplaint.controller;
import org.springframework.web.multipart.MultipartFile;
import com.campuscomplaint.dto.ComplaintRequest;
import com.campuscomplaint.entity.Complaint;
import com.campuscomplaint.entity.User;
import com.campuscomplaint.service.ComplaintService;
import com.campuscomplaint.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import java.util.List;

@RestController
@RequestMapping("/api/complaints")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class ComplaintController  {

    private final ComplaintService complaintService;
    private final UserService userService;

    @PostMapping(consumes = "multipart/form-data")
    public Complaint createComplaint(

            @RequestParam String title,

            @RequestParam String description,

            @RequestParam String location,

            @RequestParam(value = "image",
                    required = false)
            MultipartFile image,

            Authentication authentication) {

        String email = authentication.getName();

        User student =
                userService.getUserByEmail(email);

        ComplaintRequest request =
                new ComplaintRequest();

        request.setTitle(title);
        request.setDescription(description);
        request.setLocation(location);

        return complaintService.createComplaint(
                request,
                student,
                image);
    }
    @GetMapping
    public List<Complaint> getAllComplaints() {

        return complaintService.getAllComplaints();
    }

    @GetMapping("/{id}")
    public Complaint getComplaintById(
            @PathVariable Long id) {

        return complaintService.getComplaintById(id);
    }

    @GetMapping("/my")
    public List<Complaint> getMyComplaints(
            Authentication authentication) {

        String email = authentication.getName();

        User student = userService.getUserByEmail(email);

        return complaintService.getStudentComplaints(student);
    }
}