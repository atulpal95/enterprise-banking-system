package com.atul.banking.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "atm_cards")
public class ATMCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Card Details

    @Column(unique = true, length = 16)
    private String cardNumber;

    @Column(length = 3)
    private String cvv;

    private LocalDate expiryDate;

    // BCrypt Encrypted PIN
    @Column(length = 100)
    private String pin;

    // ==========================
    // Status
    // PENDING
    // ACTIVE
    // BLOCKED
    // REJECTED
    // ==========================

    @Column(nullable = false)
    private String status;

    // ==========================
    // Dates
    // ==========================

    private LocalDate requestDate;

    private LocalDate approvedDate;

    private LocalDate rejectedDate;

    // ==========================
    // Admin Information
    // ==========================

    private String approvedBy;

    private String rejectedBy;

    @Column(length = 500)
    private String rejectionReason;

    // ==========================
    // Customer
    // ==========================

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id", unique = true)
    private Customer customer;

    // ==========================
    // Constructor
    // ==========================

    public ATMCard() {
    }

    // ==========================
    // Getters & Setters
    // ==========================

    public Long getId() {
        return id;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    // ==========================
    // Status
    // ==========================

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    // ==========================
    // Dates
    // ==========================

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }

    public LocalDate getApprovedDate() {
        return approvedDate;
    }

    public void setApprovedDate(LocalDate approvedDate) {
        this.approvedDate = approvedDate;
    }

    public LocalDate getRejectedDate() {
        return rejectedDate;
    }

    public void setRejectedDate(LocalDate rejectedDate) {
        this.rejectedDate = rejectedDate;
    }

    // ==========================
    // Admin
    // ==========================

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }

    public String getRejectedBy() {
        return rejectedBy;
    }

    public void setRejectedBy(String rejectedBy) {
        this.rejectedBy = rejectedBy;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    // ==========================
    // Customer
    // ==========================

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    // ==========================
    // toString
    // ==========================

    @Override
    public String toString() {
        return "ATMCard{" +
                "id=" + id +
                ", cardNumber='" + cardNumber + '\'' +
                ", cvv='" + cvv + '\'' +
                ", expiryDate=" + expiryDate +
                ", status='" + status + '\'' +
                ", requestDate=" + requestDate +
                ", approvedDate=" + approvedDate +
                ", rejectedDate=" + rejectedDate +
                ", approvedBy='" + approvedBy + '\'' +
                ", rejectedBy='" + rejectedBy + '\'' +
                ", rejectionReason='" + rejectionReason + '\'' +
                ", customerEmail='" +
                (customer != null ? customer.getEmail() : null) +
                '\'' +
                '}';
    }
}