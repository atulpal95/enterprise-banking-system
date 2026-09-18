package com.atul.banking.dto;

public class ATMCardRequestResponse {

    private String message;

    public ATMCardRequestResponse() {
    }

    public ATMCardRequestResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}