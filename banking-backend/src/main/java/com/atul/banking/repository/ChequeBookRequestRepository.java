package com.atul.banking.repository;

import com.atul.banking.entity.ChequeBookRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChequeBookRequestRepository
        extends JpaRepository<ChequeBookRequest, Long> {

    // Customer Cheque Book Requests
    List<ChequeBookRequest> findByCustomerEmail(String customerEmail);

    // Check if customer already has a pending/processing request
    boolean existsByCustomerEmailAndStatusIn(
            String customerEmail,
            List<String> statuses
    );

    // Dashboard Statistics
    long countByStatus(String status);
}