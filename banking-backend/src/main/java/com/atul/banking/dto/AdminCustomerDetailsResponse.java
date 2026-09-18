package com.atul.banking.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminCustomerDetailsResponse {

    // =====================================================
    // CUSTOMER
    // =====================================================

    private CustomerResponse customer;

    // =====================================================
    // ATM CARD
    // =====================================================

    private ATMAdminResponse atmCard;

    // =====================================================
    // CHEQUE BOOKS
    // =====================================================

    private List<ChequeBookRequestResponse> chequeBooks;

    // =====================================================
    // LOANS
    // =====================================================

    private List<LoanResponse> loans;

    // =====================================================
    // FIXED DEPOSITS
    // =====================================================

    private List<FDAdminResponse> fixedDeposits;

    // =====================================================
    // RECURRING DEPOSITS
    // =====================================================

    private List<RDAdminResponse> recurringDeposits;

    // =====================================================
    // TRANSACTIONS
    // =====================================================

    private List<TransactionReportResponse> transactions;
}