package com.atul.banking.repository;

import com.atul.banking.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByEmailOrderByTransactionTimeDesc(String email);

    List<Transaction> findByEmailOrderByTransactionTimeAsc(String email);

    List<Transaction> findTop5ByEmailOrderByTransactionTimeDesc(String email);

    List<Transaction> findByEmailAndTransactionTimeGreaterThanEqualAndTransactionTimeLessThanOrderByTransactionTimeAsc(
        String email,
        LocalDateTime fromDateTime,
        LocalDateTime toDateTime
);

    long countByType(String type);

    @Query("""
            SELECT t
            FROM Transaction t
            WHERE t.transactionTime >= :start
            AND t.transactionTime <= :end
            ORDER BY t.transactionTime DESC
            """)
    List<Transaction> findTransactionsBetween(
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
            SELECT t.type, COUNT(t)
            FROM Transaction t
            GROUP BY t.type
            """)
    List<Object[]> countTransactionsByType();

    @Query("""
    SELECT
        FUNCTION('DATE_FORMAT', t.transactionTime, '%b'),
        SUM(t.amount)
    FROM Transaction t
    WHERE t.email = :email
      AND t.type IN (
            'WITHDRAW',
            'TRANSFER_OUT',
            'FIXED_DEPOSIT',
            'RD_OPEN',
            'RD_INSTALLMENT'
      )
    GROUP BY FUNCTION('DATE_FORMAT', t.transactionTime, '%Y-%m'),
             FUNCTION('DATE_FORMAT', t.transactionTime, '%b')
    ORDER BY MIN(t.transactionTime)
    """)
    List<Object[]> getMonthlySpending(
            @Param("email") String email
    );


    @Query("""
SELECT COALESCE(SUM(t.amount),0)
FROM Transaction t
WHERE t.email = :email
AND t.type IN ('DEPOSIT','TRANSFER_IN','LOAN_CREDIT','FD_MATURITY','RD_MATURITY')
""")
Double getTotalDeposits(@Param("email") String email);


@Query("""
SELECT COALESCE(SUM(t.amount),0)
FROM Transaction t
WHERE t.email = :email
AND t.type IN ('WITHDRAW','TRANSFER_OUT','LOAN_EMI','FD_OPEN','RD_OPEN')
""")
Double getTotalWithdrawals(@Param("email") String email);


long countByEmail(String email);
}