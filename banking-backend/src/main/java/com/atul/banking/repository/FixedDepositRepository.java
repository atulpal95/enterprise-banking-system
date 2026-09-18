package com.atul.banking.repository;

import com.atul.banking.entity.FixedDeposit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FixedDepositRepository extends JpaRepository<FixedDeposit, Long> {

    List<FixedDeposit> findByCustomerEmail(String customerEmail);

    List<FixedDeposit> findByStatus(String status);

    long countByStatus(String status);

    boolean existsByCustomerEmailAndStatusIn(
            String customerEmail,
            List<String> statuses
    );
}