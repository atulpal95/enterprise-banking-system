package com.atul.banking.dto;

import java.time.LocalDate;

public class ATMAdminResponse {

    private Long id;

    private String customerEmail;

    private String status;

    private LocalDate requestDate;

    private String cardNumber;

    private LocalDate expiryDate;

    private LocalDate approvedDate;

    private String approvedBy;

    private LocalDate rejectedDate;

    private String rejectedBy;

    private String rejectionReason;


    public ATMAdminResponse() {
    }


    public ATMAdminResponse(
            Long id,
            String customerEmail,
            String status,
            LocalDate requestDate,
            String cardNumber,
            LocalDate expiryDate,
            LocalDate approvedDate,
            String approvedBy,
            LocalDate rejectedDate,
            String rejectedBy,
            String rejectionReason
    ) {

        this.id = id;
        this.customerEmail = customerEmail;
        this.status = status;
        this.requestDate = requestDate;
        this.cardNumber = cardNumber;
        this.expiryDate = expiryDate;
        this.approvedDate = approvedDate;
        this.approvedBy = approvedBy;
        this.rejectedDate = rejectedDate;
        this.rejectedBy = rejectedBy;
        this.rejectionReason = rejectionReason;
    }


    public Long getId() {
        return id;
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public String getStatus() {
        return status;
    }

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public LocalDate getApprovedDate() {
        return approvedDate;
    }

    public String getApprovedBy() {
        return approvedBy;
    }

    public LocalDate getRejectedDate() {
        return rejectedDate;
    }

    public String getRejectedBy() {
        return rejectedBy;
    }

    public String getRejectionReason() {
        return rejectionReason;
    }
}