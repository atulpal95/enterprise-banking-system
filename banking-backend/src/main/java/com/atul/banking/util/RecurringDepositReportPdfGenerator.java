package com.atul.banking.util;

import com.atul.banking.entity.RecurringDeposit;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.List;

public class RecurringDepositReportPdfGenerator {

    public static byte[] generate(List<RecurringDeposit> deposits) {

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
                    "ENTERPRISE BANK - RECURRING DEPOSIT REPORT",
                    titleFont
            );

            title.setAlignment(Element.ALIGN_CENTER);

            document.add(title);

            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(8);

            table.setWidthPercentage(100);

            table.setWidths(new float[]{
                    1.2f,
                    2.8f,
                    2.0f,
                    1.5f,
                    1.5f,
                    2.0f,
                    1.8f,
                    2.5f
            });

            addHeader(table, "ID");
            addHeader(table, "Customer Email");
            addHeader(table, "Monthly Installment");
            addHeader(table, "Interest %");
            addHeader(table, "Tenure");
            addHeader(table, "Maturity");
            addHeader(table, "Status");
            addHeader(table, "Created Date");

            for (RecurringDeposit rd : deposits) {

                table.addCell(String.valueOf(rd.getId()));

                table.addCell(
                        rd.getCustomerEmail() != null
                                ? rd.getCustomerEmail()
                                : "-"
                );

                table.addCell(
                        rd.getMonthlyInstallment() != null
                                ? String.valueOf(rd.getMonthlyInstallment())
                                : "0"
                );

                table.addCell(
                        rd.getInterestRate() != null
                                ? String.valueOf(rd.getInterestRate())
                                : "0"
                );

                table.addCell(
                        rd.getTenureMonths() != null
                                ? String.valueOf(rd.getTenureMonths())
                                : "0"
                );

                table.addCell(
                        rd.getMaturityAmount() != null
                                ? String.valueOf(rd.getMaturityAmount())
                                : "0"
                );

                table.addCell(
                        rd.getStatus() != null
                                ? rd.getStatus()
                                : "-"
                );

                table.addCell(
                        rd.getCreatedDate() != null
                                ? rd.getCreatedDate().toString()
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