package com.atul.banking.dto;

import jakarta.validation.constraints.NotBlank;

public class KYCSubmitRequest {

    @NotBlank(message = "Document type is required")
    private String documentType;

    @NotBlank(message = "Document number is required")
    private String documentNumber;

    public KYCSubmitRequest() {
    }

    public KYCSubmitRequest(
            String documentType,
            String documentNumber
    ) {
        this.documentType = documentType;
        this.documentNumber = documentNumber;
    }

    public String getDocumentType() {
        return documentType;
    }

    public void setDocumentType(String documentType) {
        this.documentType = documentType;
    }

    public String getDocumentNumber() {
        return documentNumber;
    }

    public void setDocumentNumber(String documentNumber) {
        this.documentNumber = documentNumber;
    }
}