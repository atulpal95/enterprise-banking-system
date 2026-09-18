package com.atul.banking.repository;

import com.atul.banking.entity.Beneficiary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BeneficiaryRepository extends JpaRepository<Beneficiary, Long> {

    // Get all beneficiaries of a customer
    List<Beneficiary> findByCustomerEmail(String customerEmail);


    // Prevent duplicate beneficiary
    boolean existsByCustomerEmailAndBeneficiaryEmail(
            String customerEmail,
            String beneficiaryEmail
    );

    // Find a beneficiary by ID belonging to a customer
    Optional<Beneficiary> findByIdAndCustomerEmail(
            Long id,
            String customerEmail
    );

}