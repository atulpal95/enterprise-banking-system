package com.atul.banking.dto;

public class RejectChequeBookRequest {

    private String reason;

    public RejectChequeBookRequest() {
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}