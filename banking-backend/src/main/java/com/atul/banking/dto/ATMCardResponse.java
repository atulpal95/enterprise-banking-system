package com.atul.banking.dto;

public class ATMCardResponse {

    private String holderName;

    private String cardNumber;

    private String cvv;

    private String expiryDate;

    private String pin;

    private String status;

    private String cardType;

    private Double dailyLimit;

    private String requestDate;

    private String approvedDate;

    public ATMCardResponse() {
    }

    public ATMCardResponse(
            String holderName,
            String cardNumber,
            String cvv,
            String expiryDate,
            String pin,
            String status,
            String cardType,
            Double dailyLimit,
            String requestDate,
            String approvedDate
    ) {

        this.holderName = holderName;
        this.cardNumber = cardNumber;
        this.cvv = cvv;
        this.expiryDate = expiryDate;
        this.pin = pin;
        this.status = status;
        this.cardType = cardType;
        this.dailyLimit = dailyLimit;
        this.requestDate = requestDate;
        this.approvedDate = approvedDate;
    }

    public String getHolderName() {
        return holderName;
    }

    public void setHolderName(String holderName) {
        this.holderName = holderName;
    }

    public String getCardNumber() {
        return cardNumber;
    }

    public void setCardNumber(String cardNumber) {
        this.cardNumber = cardNumber;
    }

    public String getCvv() {
        return cvv;
    }

    public void setCvv(String cvv) {
        this.cvv = cvv;
    }

    public String getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(String expiryDate) {
        this.expiryDate = expiryDate;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getCardType() {
        return cardType;
    }

    public void setCardType(String cardType) {
        this.cardType = cardType;
    }

    public Double getDailyLimit() {
        return dailyLimit;
    }

    public void setDailyLimit(Double dailyLimit) {
        this.dailyLimit = dailyLimit;
    }

    public String getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(String requestDate) {
        this.requestDate = requestDate;
    }

    public String getApprovedDate() {
        return approvedDate;
    }

    public void setApprovedDate(String approvedDate) {
        this.approvedDate = approvedDate;
    }
}