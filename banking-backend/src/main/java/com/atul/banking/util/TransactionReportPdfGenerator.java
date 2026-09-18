package com.atul.banking.util;

import com.atul.banking.entity.Transaction;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.List;

public class TransactionReportPdfGenerator {

    public static byte[] generate(List<Transaction> transactions) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {

            Document document = new Document(PageSize.A4.rotate());

            PdfWriter.getInstance(document, out);

            document.open();

            Font titleFont = FontFactory.getFont(
                    FontFactory.HELVETICA_BOLD,
                    18
            );

            Paragraph title = new Paragraph(
                    "ENTERPRISE BANK - TRANSACTION REPORT",
                    titleFont
            );

            title.setAlignment(Element.ALIGN_CENTER);

            document.add(title);

            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(6);

            table.setWidthPercentage(100);

            table.setWidths(new float[]{
                    1.2f,
                    3.0f,
                    2.5f,
                    2.0f,
                    2.5f,
                    3.5f
            });

            addHeader(table, "ID");
            addHeader(table, "Customer Email");
            addHeader(table, "Transaction Type");
            addHeader(table, "Amount");
            addHeader(table, "Balance After");
            addHeader(table, "Transaction Time");

            for (Transaction transaction : transactions) {

                table.addCell(String.valueOf(transaction.getId()));

                table.addCell(
                        transaction.getEmail() != null
                                ? transaction.getEmail()
                                : "-"
                );

                table.addCell(
                        transaction.getType() != null
                                ? transaction.getType()
                                : "-"
                );

                table.addCell(
                        transaction.getAmount() != null
                                ? String.valueOf(transaction.getAmount())
                                : "0"
                );

                table.addCell(
                        transaction.getBalanceAfterTransaction() != null
                                ? String.valueOf(transaction.getBalanceAfterTransaction())
                                : "0"
                );

                table.addCell(
                        transaction.getTransactionTime() != null
                                ? transaction.getTransactionTime().toString()
                                : "-"
                );
            }

            document.add(table);

            document.close();

        } catch (Exception e) {
            e.printStackTrace();
        }

        return out.toByteArray();
    }

    private static void addHeader(PdfPTable table, String text) {

        PdfPCell cell = new PdfPCell(new Phrase(text));

        cell.setBackgroundColor(Color.LIGHT_GRAY);

        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        table.addCell(cell);
    }
}