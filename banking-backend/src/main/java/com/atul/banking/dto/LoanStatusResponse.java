package com.atul.banking.dto;

public class LoanStatusResponse {

    private String status;

    public LoanStatusResponse() {
    }

    public LoanStatusResponse(String status) {
        this.status = status;
    }

    public String getStatus() {
        return status;
    }
}