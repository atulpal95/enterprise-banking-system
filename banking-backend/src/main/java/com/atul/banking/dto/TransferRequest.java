package com.atul.banking.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public class TransferRequest {
 
    private String toEmail;


    private String accountNumber;

    private String ifscCode;

    @NotNull(message = "Amount is required")
    @Positive(message = "Transfer amount must be greater than zero")
    private Double amount;

    public TransferRequest() {
    }

   public TransferRequest(
        String toEmail,
        String accountNumber,
        String ifscCode,
        Double amount) {

    this.toEmail = toEmail;
    this.accountNumber = accountNumber;
    this.ifscCode = ifscCode;
    this.amount = amount;
}
    public String getToEmail() {
        return toEmail;
    }

    public void setToEmail(String toEmail) {
        this.toEmail = toEmail;
    }


    public String getAccountNumber() {
    return accountNumber;
}

public void setAccountNumber(String accountNumber) {
    this.accountNumber = accountNumber;
}

public String getIfscCode() {
    return ifscCode;
}

public void setIfscCode(String ifscCode) {
    this.ifscCode = ifscCode;
}

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }
}