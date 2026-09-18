package com.atul.banking.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "cheque_book_requests")
public class ChequeBookRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String customerEmail;

    // Number of cheque leaves requested
    private int numberOfLeaves;

    private LocalDateTime requestDate;

    // REQUESTED
    // APPROVED
    // REJECTED
    // DISPATCHED
    // DELIVERED
    private String status;

    // Production Improvements
    private LocalDateTime approvedDate;

    private LocalDateTime dispatchedDate;

    private LocalDateTime deliveredDate;

    private String approvedBy;

    private LocalDateTime rejectedDate;

    private String rejectedBy;

    @Column(length = 500)
    private String rejectionReason;

    public ChequeBookRequest() {
    }

    // =========================
    // Getters & Setters
    // =========================

    public Long getId() {
        return id;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public int getNumberOfLeaves() {
        return numberOfLeaves;
    }

    public void setNumberOfLeaves(int numberOfLeaves) {
        this.numberOfLeaves = numberOfLeaves;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getApprovedDate() {
        return approvedDate;
    }

    public void setApprovedDate(LocalDateTime approvedDate) {
        this.approvedDate = approvedDate;
    }

    public LocalDateTime getDispatchedDate() {
        return dispatchedDate;
    }

    public void setDispatchedDate(LocalDateTime dispatchedDate) {
        this.dispatchedDate = dispatchedDate;
    }

    public LocalDateTime getDeliveredDate() {
        return deliveredDate;
    }

    public void setDeliveredDate(LocalDateTime deliveredDate) {
        this.deliveredDate = deliveredDate;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }

    public LocalDateTime getRejectedDate() {
    return rejectedDate;
}

public void setRejectedDate(LocalDateTime rejectedDate) {
    this.rejectedDate = rejectedDate;
}

public String getRejectedBy() {
    return rejectedBy;
}

public void setRejectedBy(String rejectedBy) {
    this.rejectedBy = rejectedBy;
}
}