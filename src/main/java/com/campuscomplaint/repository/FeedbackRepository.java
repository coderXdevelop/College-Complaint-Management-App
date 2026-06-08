package com.campuscomplaint.repository;

import com.campuscomplaint.entity.Complaint;
import com.campuscomplaint.entity.Feedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    Optional<Feedback> findByComplaint(Complaint complaint);
}