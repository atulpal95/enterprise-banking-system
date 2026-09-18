package com.atul.banking.dto;

public class LoginResponse {

    private Long customerId;
    private String message;
    private String token;
    private String fullName;
    private String email;
    private Double balance;

    public LoginResponse() {
    }

    public LoginResponse(
            Long customerId,
            String message,
            String token,
            String fullName,
            String email,
            Double balance) {

        this.customerId = customerId;
        this.message = message;
        this.token = token;
        this.fullName = fullName;
        this.email = email;
        this.balance = balance;
    }

    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getBalance() {
        return balance;
    }

    public void setBalance(Double balance) {
        this.balance = balance;
    }
}