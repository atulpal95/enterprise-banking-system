package com.atul.banking.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class OpenRDRequest {

    @NotNull
    @Min(100)
    private Double monthlyInstallment;

    @NotNull
    @Min(6)
    private Integer tenureMonths;

    public OpenRDRequest() {
    }

    public Double getMonthlyInstallment() {
        return monthlyInstallment;
    }

    public void setMonthlyInstallment(Double monthlyInstallment) {
        this.monthlyInstallment = monthlyInstallment;
    }

    public Integer getTenureMonths() {
        return tenureMonths;
    }

    public void setTenureMonths(Integer tenureMonths) {
        this.tenureMonths = tenureMonths;
    }
}