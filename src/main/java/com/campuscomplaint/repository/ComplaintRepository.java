package com.campuscomplaint.repository;

import com.campuscomplaint.entity.Complaint;
import com.campuscomplaint.entity.User;
import com.campuscomplaint.enums.ComplaintStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ComplaintRepository extends JpaRepository<Complaint, Long> {

    List<Complaint> findByStudent(User student);

    List<Complaint> findByStatus(ComplaintStatus status);

    Page<Complaint> findByStatus(ComplaintStatus status, Pageable pageable);

    long countByStatus(ComplaintStatus status);
}