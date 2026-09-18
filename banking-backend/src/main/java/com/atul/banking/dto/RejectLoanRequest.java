package com.atul.banking.dto;

public class RejectLoanRequest {

    private String reason;

    public RejectLoanRequest() {
    }

    public RejectLoanRequest(String reason) {
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}