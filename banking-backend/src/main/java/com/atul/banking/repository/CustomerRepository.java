package com.atul.banking.repository;

import com.atul.banking.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;

import org.springframework.data.jpa.repository.Query;



public interface CustomerRepository extends JpaRepository<Customer, Long> {

    boolean existsByEmail(String email);

    Optional<Customer> findByEmail(String email);
    List<Customer> findAll();
    Optional<Customer> findById(Long id);

    Optional<Customer> findByAccountNumberAndIfscCode(
            String accountNumber,
            String ifscCode
    );

    long countByActiveTrue();

    long countByActiveFalse();

    @Query("SELECT COALESCE(SUM(c.balance),0) FROM Customer c")
    Double getTotalBalance();
    List<Customer> findTop5ByOrderByBalanceDesc();
}