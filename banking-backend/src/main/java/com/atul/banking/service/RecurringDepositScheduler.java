package com.atul.banking.service;

import com.atul.banking.entity.RecurringDeposit;
import com.atul.banking.repository.RecurringDepositRepository;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class RecurringDepositScheduler {

    private final RecurringDepositRepository recurringDepositRepository;
    private final CustomerService customerService;

    public RecurringDepositScheduler(
            RecurringDepositRepository recurringDepositRepository,
            CustomerService customerService) {

        this.recurringDepositRepository = recurringDepositRepository;
        this.customerService = customerService;
    }

    @Scheduled(cron = "0 0 0 * * *")
    public void processDueRDInstallments() {


        LocalDateTime now = LocalDateTime.now();

        List<RecurringDeposit> dueRDs =
                recurringDepositRepository
                        .findByStatusAndNextInstallmentDateLessThanEqual(
                                "ACTIVE",
                                now
                        );

        for (RecurringDeposit rd : dueRDs) {

            try {

                customerService.payRecurringDepositInstallment(
                        rd.getId(),
                        rd.getCustomerEmail()
                );

            } catch (Exception e) {

               
            }
        }
    }
}