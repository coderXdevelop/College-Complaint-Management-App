package com.campuscomplaint.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendNotificationEmail(String toEmail, String subject, String message) {
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setTo(toEmail);
            email.setSubject(subject);
            email.setText(message);
            email.setFrom("noreply@campuscomplaint.com"); // replace with your sender email

            mailSender.send(email);
            log.info("Email sent to: {}", toEmail);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage());
            // Don't throw — if email fails, notification is still saved in DB
        }
    }

    // fixed parameter name (no space)
    public void sendComplaintNotification(String facultyEmail, String complaintTitle, Long complaintId) {
        String subject = "New Complaint: " + complaintTitle;
        String body = "A new complaint (#" + complaintId + ") has been submitted.\n\n"
                + "Title: " + complaintTitle + "\n\n"
                + "Please log in to the system to review.";
        sendNotificationEmail(facultyEmail, subject, body);
    }

    public void sendFeedbackRequestEmail(String studentEmail, Long complaintId) {
        String subject = "Feedback Requested for Complaint #" + complaintId;
        String body = "Your complaint #" + complaintId + " has been resolved.\n\n"
                + "Please provide your feedback to help us improve.";
        sendNotificationEmail(studentEmail, subject, body);
    }

    public void sendFeedbackSubmittedEmail(String facultyEmail, Long complaintId) {
        String subject = "Feedback Submitted for Complaint #" + complaintId;
        String body = "Student feedback has been submitted for complaint #" + complaintId + ".";
        sendNotificationEmail(facultyEmail, subject, body);
    }
}