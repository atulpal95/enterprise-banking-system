package com.atul.banking.dto;

public class IssueATMCardRequest {

    private String customerEmail;

    public IssueATMCardRequest() {
    }

    public String getCustomerEmail() {
        return customerEmail;
    }

    public void setCustomerEmail(String customerEmail) {
        this.customerEmail = customerEmail;
    }
}