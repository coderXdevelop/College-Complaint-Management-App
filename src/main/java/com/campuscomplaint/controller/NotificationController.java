package com.campuscomplaint.controller;

import com.campuscomplaint.dto.NotificationResponse;
import com.campuscomplaint.entity.Notification;
import com.campuscomplaint.entity.User;
import com.campuscomplaint.service.NotificationService;
import com.campuscomplaint.service.UserService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@SecurityRequirement(name = "bearerAuth")
public class NotificationController {

    private final NotificationService notificationService;
    private final UserService userService;

    // GET /api/notifications/my
    @GetMapping("/my")
    public List<NotificationResponse> getMyNotifications(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);

        List<Notification> list = notificationService.getNotificationsForUser(user);

        return list.stream()
                .map(n -> NotificationResponse.builder()
                        .id(n.getId())
                        .message(n.getMessage())
                        .readFlag(n.isReadFlag())
                        .createdAt(n.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    // GET /api/notifications/my/unread-count
    @GetMapping("/my/unread-count")
    public Map<String, Long> getUnreadCount(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);
        long count = notificationService.countUnread(user);
        return Map.of("unread", count);
    }

    // PUT /api/notifications/{id}/read  -> marks as read
    @PutMapping("/{id}/read")
    public NotificationResponse markAsRead(@PathVariable("id") Long id, Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);

        Notification n = notificationService.markAsRead(id, user);

        return NotificationResponse.builder()
                .id(n.getId())
                .message(n.getMessage())
                .readFlag(n.isReadFlag())
                .createdAt(n.getCreatedAt())
                .build();
    }

    // PUT /api/notifications/read-all -> mark all as read
    @PutMapping("/read-all")
    public ResponseEntity<?> markAllRead(Authentication authentication) {
        String email = authentication.getName();
        User user = userService.getUserByEmail(email);

        notificationService.markAllAsRead(user);
        return ResponseEntity.ok().build();
    }
}