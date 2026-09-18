package com.atul.banking.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "recurring_deposits")
public class RecurringDeposit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerEmail;

    private Double monthlyInstallment;

    private Double interestRate;

    private Integer tenureMonths;

    // Amount actually deposited so far
    private Double totalDeposited;

    private Double maturityAmount;

    // Number of installments actually paid
    private Integer paidInstallments;

    private String status;

    private LocalDateTime createdDate;

    private LocalDateTime approvedDate;

    private LocalDateTime maturityDate;

    private LocalDateTime nextInstallmentDate;

    private LocalDateTime closedDate;

    private String approvedBy;

    @Column(length = 500)
    private String rejectionReason;

    private LocalDateTime rejectedDate;

    private String rejectedBy;

    public RecurringDeposit() {
    }

    // ---------------- ID ----------------

    public Long getId() {
        return id;
    }

    // ---------------- Customer ----------------

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    // ---------------- RD Details ----------------

    public Double getMonthlyInstallment() {
        return monthlyInstallment;
    }

    public void setMonthlyInstallment(Double monthlyInstallment) {
        this.monthlyInstallment = monthlyInstallment;
    }

    public Double getInterestRate() {
        return interestRate;
    }

    public void setInterestRate(Double interestRate) {
        this.interestRate = interestRate;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }

    public Double getTotalDeposited() {
        return totalDeposited;
    }

    public void setTotalDeposited(Double totalDeposited) {
        this.totalDeposited = totalDeposited;
    }

    public Double getMaturityAmount() {
        return maturityAmount;
    }

    public void setMaturityAmount(Double maturityAmount) {
        this.maturityAmount = maturityAmount;
    }

    // ---------------- Installments ----------------

    public Integer getPaidInstallments() {
        return paidInstallments;
    }

    public void setPaidInstallments(Integer paidInstallments) {
        this.paidInstallments = paidInstallments;
    }

    // ---------------- Status ----------------

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // ---------------- Dates ----------------

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getApprovedDate() {
        return approvedDate;
    }

    public void setApprovedDate(LocalDateTime approvedDate) {
        this.approvedDate = approvedDate;
    }

    public LocalDateTime getMaturityDate() {
        return maturityDate;
    }

    public void setMaturityDate(LocalDateTime maturityDate) {
        this.maturityDate = maturityDate;
    }

    public LocalDateTime getNextInstallmentDate() {
        return nextInstallmentDate;
    }

    public void setNextInstallmentDate(LocalDateTime nextInstallmentDate) {
        this.nextInstallmentDate = nextInstallmentDate;
    }

    public LocalDateTime getClosedDate() {
        return closedDate;
    }

    public void setClosedDate(LocalDateTime closedDate) {
        this.closedDate = closedDate;
    }

    // ---------------- Approved ----------------

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }

    // ---------------- Rejected ----------------

    public String getRejectedBy() {
        return rejectedBy;
    }

    public void setRejectedBy(String rejectedBy) {
        this.rejectedBy = rejectedBy;
    }

    public LocalDateTime getRejectedDate() {
        return rejectedDate;
    }

    public void setRejectedDate(LocalDateTime rejectedDate) {
        this.rejectedDate = rejectedDate;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}