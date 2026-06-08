package com.campuscomplaint.repository;

import com.campuscomplaint.entity.Notification;
import com.campuscomplaint.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    List<Notification> findByUserOrderByCreatedAtDesc(User user);
    long countByUserAndReadFlagFalse(User user);
}