package com.atul.banking.dto;

import java.time.LocalDateTime;

public class ChequeBookRequestResponse {

    private Long id;

    private String customerEmail;

    private Integer numberOfLeaves;

    private String status;

    private LocalDateTime requestDate;

    private LocalDateTime approvedDate;
    private String approvedBy;

    private LocalDateTime rejectedDate;
    private String rejectedBy;

    private LocalDateTime dispatchedDate;
    private LocalDateTime deliveredDate;

    private String rejectionReason;

    public ChequeBookRequestResponse() {
    }

    public ChequeBookRequestResponse(

        Long id,

        String customerEmail,

        Integer numberOfLeaves,

        String status,

        LocalDateTime requestDate,

        LocalDateTime approvedDate,

        String approvedBy,

        LocalDateTime rejectedDate,

        String rejectedBy,

        LocalDateTime dispatchedDate,

        LocalDateTime deliveredDate,

        String rejectionReason

) {

    this.id = id;

    this.customerEmail = customerEmail;

    this.numberOfLeaves = numberOfLeaves;

    this.status = status;

    this.requestDate = requestDate;

    this.approvedDate = approvedDate;

    this.approvedBy = approvedBy;

    this.rejectedDate = rejectedDate;

    this.rejectedBy = rejectedBy;

    this.dispatchedDate = dispatchedDate;

    this.deliveredDate = deliveredDate;

    this.rejectionReason = rejectionReason;
}

   public ChequeBookRequestResponse(
        Long id,
        String customerEmail,
        Integer numberOfLeaves,
        String status,
        LocalDateTime requestDate,
        LocalDateTime approvedDate,
        String approvedBy,
        LocalDateTime dispatchedDate,
        LocalDateTime deliveredDate,
        String rejectionReason
) {
    this.id = id;
    this.customerEmail = customerEmail;
    this.numberOfLeaves = numberOfLeaves;
    this.status = status;
    this.requestDate = requestDate;
    this.approvedDate = approvedDate;
    this.approvedBy = approvedBy;
    this.dispatchedDate = dispatchedDate;
    this.deliveredDate = deliveredDate;
    this.rejectionReason = rejectionReason;

    // These fields are intentionally empty for the
    // existing customer-side response.
    this.rejectedDate = null;
    this.rejectedBy = null;
}


    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }

    public Integer getNumberOfLeaves() {
        return numberOfLeaves;
    }

    public void setNumberOfLeaves(Integer numberOfLeaves) {
        this.numberOfLeaves = numberOfLeaves;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public LocalDateTime getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDateTime requestDate) {
        this.requestDate = requestDate;
    }

    public LocalDateTime getApprovedDate() {
        return approvedDate;
    }

    public void setApprovedDate(LocalDateTime approvedDate) {
        this.approvedDate = approvedDate;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public void setApprovedBy(String approvedBy) {
        this.approvedBy = approvedBy;
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

    public String getRejectionReason() {
        return rejectionReason;
    }

    public void setRejectionReason(String rejectionReason) {
        this.rejectionReason = rejectionReason;
    }
}