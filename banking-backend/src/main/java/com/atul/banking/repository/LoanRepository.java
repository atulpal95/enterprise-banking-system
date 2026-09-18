package com.atul.banking.repository;

import com.atul.banking.entity.Customer;
import com.atul.banking.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    List<Loan> findByCustomerEmail(String customerEmail);

    Optional<Loan> findByIdAndCustomerEmail(
            Long id,
            String customerEmail

    );


    List<Loan> findByStatus(String status);

    long countByStatus(String status);

    boolean existsByCustomerAndStatusIn(Customer customer, List<String> statuses);
}