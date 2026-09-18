package com.atul.banking.dto.analytics;

public class TransactionTypeDTO {

    private String type;
    private long count;

    public TransactionTypeDTO() {
    }

    public TransactionTypeDTO(String type, long count) {
        this.type = type;
        this.count = count;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public long getCount() {
        return count;
    }

    public void setCount(long count) {
        this.count = count;
    }
}