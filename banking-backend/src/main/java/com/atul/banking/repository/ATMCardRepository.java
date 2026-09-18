package com.atul.banking.repository;

import com.atul.banking.entity.ATMCard;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ATMCardRepository extends JpaRepository<ATMCard, Long> {

    // Find by Card Number
    Optional<ATMCard> findByCardNumber(String cardNumber);

    // Find by Customer Email
    Optional<ATMCard> findByCustomerEmail(String email);

    // Check Existing Card
    boolean existsByCustomerEmail(String email);

    // Find by Status
    List<ATMCard> findByStatus(String status);

    // Count by Status
    long countByStatus(String status);

    // Admin Dashboard
    List<ATMCard> findAllByOrderByRequestDateDesc();
}