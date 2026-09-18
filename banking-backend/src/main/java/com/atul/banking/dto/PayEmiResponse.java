package com.atul.banking.dto;

import java.time.LocalDateTime;

public class PayEmiResponse {

    private String message;
    private Double emiPaid;
    private Double remainingLoan;
    private Integer remainingInstallments;
    private LocalDateTime nextEmiDate;
    private Double currentBalance;

    public PayEmiResponse() {
    }

    public PayEmiResponse(
            String message,
            Double emiPaid,
            Double remainingLoan,
            Integer remainingInstallments,
            LocalDateTime nextEmiDate,
            Double currentBalance) {

        this.message = message;
        this.emiPaid = emiPaid;
        this.remainingLoan = remainingLoan;
        this.remainingInstallments = remainingInstallments;
        this.nextEmiDate = nextEmiDate;
        this.currentBalance = currentBalance;
    }

    public String getMessage() {
        return message;
    }

    public Double getEmiPaid() {
        return emiPaid;
    }

    public Double getRemainingLoan() {
        return remainingLoan;
    }

    public Integer getRemainingInstallments() {
        return remainingInstallments;
    }

    public LocalDateTime getNextEmiDate() {
        return nextEmiDate;
    }

    public Double getCurrentBalance() {
        return currentBalance;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setEmiPaid(Double emiPaid) {
        this.emiPaid = emiPaid;
    }

    public void setRemainingLoan(Double remainingLoan) {
        this.remainingLoan = remainingLoan;
    }

    public void setRemainingInstallments(Integer remainingInstallments) {
        this.remainingInstallments = remainingInstallments;
    }

    public void setNextEmiDate(LocalDateTime nextEmiDate) {
        this.nextEmiDate = nextEmiDate;
    }

    public void setCurrentBalance(Double currentBalance) {
        this.currentBalance = currentBalance;
    }
}