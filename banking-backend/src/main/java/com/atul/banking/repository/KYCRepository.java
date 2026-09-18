package com.atul.banking.repository;

import com.atul.banking.entity.KYC;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface KYCRepository extends JpaRepository<KYC, Long> {

    Optional<KYC> findByCustomerEmail(String email);

    Optional<KYC> findByCustomerId(Long customerId);

    boolean existsByCustomerEmail(String email);

    List<KYC> findByStatus(String status);

    long countByStatus(String status);
}