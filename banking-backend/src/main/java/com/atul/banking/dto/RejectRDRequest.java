package com.atul.banking.dto;

import jakarta.validation.constraints.NotBlank;

public class RejectRDRequest {

    @NotBlank
    private String reason;

    public RejectRDRequest() {
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}