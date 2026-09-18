package com.atul.banking.dto;

public class ApplyLoanRequest {

    private String loanType;

    private Double amount;

    private Integer tenureMonths;

    public ApplyLoanRequest() {
    }

    public ApplyLoanRequest(
            String loanType,
            Double amount,
            Integer tenureMonths) {

        this.loanType = loanType;
        this.amount = amount;
        this.tenureMonths = tenureMonths;
    }

    public String getLoanType() {
        return loanType;
    }

    public void setLoanType(String loanType) {
        this.loanType = loanType;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }
}