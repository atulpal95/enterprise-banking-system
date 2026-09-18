package com.atul.banking.util;

import com.atul.banking.entity.Customer;
import com.atul.banking.entity.Loan;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.List;

public class LoanReportPdfGenerator {

    public static byte[] generate(List<Loan> loans) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {

            Document document = new Document(PageSize.A4.rotate());

            PdfWriter.getInstance(document, out);

            document.open();

            Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);

            Paragraph title = new Paragraph("ENTERPRISE BANK - LOAN REPORT", titleFont);

            title.setAlignment(Element.ALIGN_CENTER);

            document.add(title);

            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(9);

            table.setWidthPercentage(100);

            table.setWidths(new float[]{
                    1.2f,
                    2.8f,
                    2f,
                    2f,
                    1.5f,
                    1.5f,
                    1.5f,
                    1.5f,
                    2f
            });

            addHeader(table, "ID");
            addHeader(table, "Customer");
            addHeader(table, "Loan Type");
            addHeader(table, "Amount");
            addHeader(table, "Interest %");
            addHeader(table, "Tenure");
            addHeader(table, "EMI");
            addHeader(table, "Status");
            addHeader(table, "Applied Date");

            for (Loan loan : loans) {

                Customer customer = loan.getCustomer();

                table.addCell(String.valueOf(loan.getId()));

                table.addCell(
                        customer != null
                                ? customer.getFullName()
                                : "-"
                );

                table.addCell(
                        loan.getLoanType() != null
                                ? loan.getLoanType()
                                : "-"
                );

                table.addCell(
                        loan.getAmount() != null
                                ? String.valueOf(loan.getAmount())
                                : "0"
                );

                table.addCell(
                        loan.getInterestRate() != null
                                ? String.valueOf(loan.getInterestRate())
                                : "0"
                );

                table.addCell(
                        loan.getTenureMonths() != null
                                ? String.valueOf(loan.getTenureMonths())
                                : "0"
                );

                table.addCell(
                        loan.getEmi() != null
                                ? String.valueOf(loan.getEmi())
                                : "0"
                );

                table.addCell(
                        loan.getStatus() != null
                                ? loan.getStatus()
                                : "-"
                );

                table.addCell(
                        loan.getAppliedDate() != null
                                ? loan.getAppliedDate().toString()
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