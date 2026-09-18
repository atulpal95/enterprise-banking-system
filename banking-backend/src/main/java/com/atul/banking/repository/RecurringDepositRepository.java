package com.atul.banking.repository;

import com.atul.banking.entity.RecurringDeposit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecurringDepositRepository extends JpaRepository<RecurringDeposit, Long> {

    List<RecurringDeposit> findByCustomerEmail(String customerEmail);

    List<RecurringDeposit> findByStatus(String status);

    long countByStatus(String status);

    List<RecurringDeposit> findByStatusOrderByCreatedDateDesc(String status);

    List<RecurringDeposit> findAllByOrderByCreatedDateDesc();

    List<RecurringDeposit> findByStatusAndNextInstallmentDateLessThanEqual(
        String status,
        java.time.LocalDateTime dateTime
);

}