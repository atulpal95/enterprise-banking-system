package com.atul.banking.dto;

public class ATMCardStatusResponse {

    private boolean active;

    public ATMCardStatusResponse() {
    }

    public ATMCardStatusResponse(boolean active) {
        this.active = active;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}