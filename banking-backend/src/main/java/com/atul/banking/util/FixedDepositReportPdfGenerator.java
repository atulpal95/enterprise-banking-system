package com.atul.banking.util;

import com.atul.banking.entity.FixedDeposit;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.util.List;

public class FixedDepositReportPdfGenerator {

    public static byte[] generate(List<FixedDeposit> deposits) {

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {

            Document document = new Document(PageSize.A4.rotate());

            PdfWriter.getInstance(document, out);

            document.open();

            Font titleFont =
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 18);

            Paragraph title =
                    new Paragraph("ENTERPRISE BANK - FIXED DEPOSIT REPORT", titleFont);

            title.setAlignment(Element.ALIGN_CENTER);

            document.add(title);

            document.add(new Paragraph(" "));

            PdfPTable table = new PdfPTable(8);

            table.setWidthPercentage(100);

            table.setWidths(new float[]{
                    1.2f,
                    3f,
                    2f,
                    1.5f,
                    1.5f,
                    2f,
                    1.8f,
                    2f
            });

            addHeader(table, "ID");
            addHeader(table, "Customer Email");
            addHeader(table, "Principal");
            addHeader(table, "Interest %");
            addHeader(table, "Tenure");
            addHeader(table, "Maturity");
            addHeader(table, "Status");
            addHeader(table, "Created");

            for (FixedDeposit fd : deposits) {

                table.addCell(String.valueOf(fd.getId()));

                table.addCell(
                        fd.getCustomerEmail() != null
                                ? fd.getCustomerEmail()
                                : "-"
                );

                table.addCell(
                        fd.getPrincipalAmount() != null
                                ? String.valueOf(fd.getPrincipalAmount())
                                : "0"
                );

                table.addCell(
                        fd.getInterestRate() != null
                                ? String.valueOf(fd.getInterestRate())
                                : "0"
                );

                table.addCell(
                        fd.getTenureMonths() != null
                                ? String.valueOf(fd.getTenureMonths())
                                : "0"
                );

                table.addCell(
                        fd.getMaturityAmount() != null
                                ? String.valueOf(fd.getMaturityAmount())
                                : "0"
                );

                table.addCell(
                        fd.getStatus() != null
                                ? fd.getStatus()
                                : "-"
                );

                table.addCell(
                        fd.getCreatedDate() != null
                                ? fd.getCreatedDate().toString()
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

        cell.setHorizontalAlignment(Element.ALIGN_CENTER);

        cell.setBackgroundColor(Color.LIGHT_GRAY);

        table.addCell(cell);
    }
}