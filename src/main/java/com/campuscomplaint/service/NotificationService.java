package com.campuscomplaint.service;

import com.campuscomplaint.entity.Notification;
import com.campuscomplaint.entity.User;
import com.campuscomplaint.enums.Role;
import com.campuscomplaint.repository.NotificationRepository;
import com.campuscomplaint.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final EmailService emailService; // optional, if you want email sends here

    public Notification createNotification(User recipient, String message) {
        log.info("Creating notification for {}: {}", recipient.getEmail(), message);
        Notification n = Notification.builder()
                .user(recipient)
                .message(message)
                .readFlag(false)
                .build();
        Notification saved = notificationRepository.save(n);

        // Send email notification (non-blocking - errors logged)
        try {
            emailService.sendNotificationEmail(
                    recipient.getEmail(),
                    "Campus Complaint System Notification",
                    message
            );
        } catch (Exception e) {
            log.warn("Email send failed for {}: {}", recipient.getEmail(), e.getMessage());
        }

        return saved;
    }

    public void notifyAllFaculty(String message) {
        List<User> faculty = userRepository.findByRole(Role.FACULTY);
        for (User u : faculty) {
            createNotification(u, message);
        }
    }

    public void notifyAllFacultyExcept(String message, User except) {
        List<User> faculty = userRepository.findByRole(Role.FACULTY);
        for (User u : faculty) {
            if (except != null && u.getId().equals(except.getId())) continue;
            createNotification(u, message);
        }
    }

    public void notifyComplaintCreated(String complaintTitle, Long complaintId) {
        List<User> faculty = userRepository.findByRole(Role.FACULTY);
        String message = "New complaint created (#" + complaintId + "): " + complaintTitle;

        for (User u : faculty) {
            // Save notification in database
            Notification n = Notification.builder()
                    .user(u)
                    .message(message)
                    .readFlag(false)
                    .build();
            notificationRepository.save(n);

            // Send formatted email notification
            try {
                emailService.sendComplaintNotification(u.getEmail(), complaintTitle, complaintId);
                log.info("Formatted complaint notification email sent to: {}", u.getEmail());
            } catch (Exception e) {
                log.warn("Email send failed for {}: {}", u.getEmail(), e.getMessage());
            }
        }
    }

    public void notifyStudentComplaintCreated(User student, String complaintTitle, Long complaintId) {
        String message = "Your complaint has been successfully registered (#" + complaintId + "): " + complaintTitle;

        Notification n = Notification.builder()
                .user(student)
                .message(message)
                .readFlag(false)
                .build();
        notificationRepository.save(n);

        try {
            emailService.sendStudentComplaintRegisteredNotification(student.getEmail(), complaintTitle, complaintId);
            log.info("Formatted complaint registration email sent to student: {}", student.getEmail());
        } catch (Exception e) {
            log.warn("Email send failed for student {}: {}", student.getEmail(), e.getMessage());
        }
    }

    public void notifyFeedbackRequested(User student, String complaintTitle, Long complaintId) {
        String message = "Please provide feedback for your resolved complaint #" + complaintId;

        Notification n = Notification.builder()
                .user(student)
                .message(message)
                .readFlag(false)
                .build();
        notificationRepository.save(n);

        try {
            emailService.sendStudentFeedbackRequestNotification(student.getEmail(), complaintTitle, complaintId);
            log.info("Formatted feedback request email sent to student: {}", student.getEmail());
        } catch (Exception e) {
            log.warn("Email send failed for student {}: {}", student.getEmail(), e.getMessage());
        }
    }

    public void notifyFeedbackSubmitted(Long complaintId) {
        List<User> faculty = userRepository.findByRole(Role.FACULTY);
        String message = "Feedback submitted for complaint #" + complaintId;
        for (User u : faculty) {
            createNotification(u, message);
        }
    }

    // New: get notifications for a user, newest first
    public List<Notification> getNotificationsForUser(User user) {
        return notificationRepository.findByUserOrderByCreatedAtDesc(user);
    }

    // New: efficient unread count for badge
    public long countUnread(User user) {
        return notificationRepository.countByUserAndReadFlagFalse(user);
    }

    // New: mark a notification as read (ensures only recipient can mark)
    public Notification markAsRead(Long notificationId, User user) {
        Notification n = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        if (!n.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized");
        }

        if (!n.isReadFlag()) {
            n.setReadFlag(true);
            n = notificationRepository.save(n);
        }

        return n;
    }

    // New: mark all notifications for user as read
    public void markAllAsRead(User user) {
        List<Notification> list = notificationRepository.findByUserOrderByCreatedAtDesc(user);
        boolean changed = false;
        for (Notification n : list) {
            if (!n.isReadFlag()) {
                n.setReadFlag(true);
                changed = true;
            }
        }
        if (changed) {
            notificationRepository.saveAll(list);
        }
    }
}