package com.atul.banking.dto;

import jakarta.validation.constraints.NotBlank;

public class RejectATMRequest {

    @NotBlank(message = "Reason is required")
    private String reason;

    public RejectATMRequest() {
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}