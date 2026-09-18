package com.atul.banking.dto;

import jakarta.validation.constraints.NotBlank;

public class RejectFDRequest {

    @NotBlank(message = "Reason is required.")
    private String reason;

    public RejectFDRequest() {
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}