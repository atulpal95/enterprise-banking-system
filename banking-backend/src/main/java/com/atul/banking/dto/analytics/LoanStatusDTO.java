package com.atul.banking.dto.analytics;

public class LoanStatusDTO {

    private String status;
    private long count;

    public LoanStatusDTO() {
    }

    public LoanStatusDTO(String status, long count) {
        this.status = status;
        this.count = count;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}