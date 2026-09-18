package com.atul.banking.dto;

import java.time.LocalDateTime;

public class RDAdminResponse {

    private Long id;
    private String customerEmail;
    private Double monthlyInstallment;
    private Double interestRate;
    private Integer tenureMonths;
    private Double totalDeposited;
    private Double maturityAmount;
    private String status;
    private LocalDateTime createdDate;

    public RDAdminResponse(
            Long id,
            String customerEmail,
            Double monthlyInstallment,
            Double interestRate,
            Integer tenureMonths,
            Double totalDeposited,
            Double maturityAmount,
            String status,
            LocalDateTime createdDate) {

        this.id = id;
        this.customerEmail = customerEmail;
        this.monthlyInstallment = monthlyInstallment;
        this.interestRate = interestRate;
        this.tenureMonths = tenureMonths;
        this.totalDeposited = totalDeposited;
        this.maturityAmount = maturityAmount;
        this.status = status;
        this.createdDate = createdDate;
    }

    public Long getId() {
        return id;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public Double getMonthlyInstallment() {
        return monthlyInstallment;
    }

    public Double getInterestRate() {
        return interestRate;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public Double getTotalDeposited() {
        return totalDeposited;
    }

    public Double getMaturityAmount() {
        return maturityAmount;
    }

    public String getStatus() {
        return status;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }
}