package com.atul.banking.util;

import com.atul.banking.dto.StatementTransaction;
import com.lowagie.text.*;
import com.lowagie.text.pdf.*;

import java.awt.Color;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class StatementPdfGenerator {

    public static ByteArrayInputStream generateStatement(
            String customerName,
            String accountNumber,
            String email,
            Double currentBalance,
            List<StatementTransaction> transactions) {

        Document document = new Document(PageSize.A4);

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {

            PdfWriter.getInstance(document, out);

            document.open();

            Font bankTitle =
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Color.BLUE);

            Font subTitle =
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 13);

            Font labelFont =
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11);

            Font valueFont =
                    FontFactory.getFont(FontFactory.HELVETICA, 11);

            Font tableHeader =
                    FontFactory.getFont(FontFactory.HELVETICA_BOLD, 11, Color.WHITE);

            Font tableFont =
                    FontFactory.getFont(FontFactory.HELVETICA, 10);

            //-------------------------------------------------------
            // Bank Heading
            //-------------------------------------------------------

            Paragraph title = new Paragraph("ENTERPRISE BANK", bankTitle);
            title.setAlignment(Element.ALIGN_CENTER);
            document.add(title);

            Paragraph subtitle =
                    new Paragraph("Official Account Statement", subTitle);
            subtitle.setAlignment(Element.ALIGN_CENTER);
            document.add(subtitle);

            document.add(new Paragraph(" "));

            //-------------------------------------------------------
            // Customer Details
            //-------------------------------------------------------

            PdfPTable infoTable = new PdfPTable(2);
            infoTable.setWidthPercentage(100);
            infoTable.setSpacingAfter(20f);

            infoTable.addCell(new Phrase("Statement Date", labelFont));
            infoTable.addCell(new Phrase(
                    LocalDateTime.now().format(
                            DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm")),
                    valueFont));

            infoTable.addCell(new Phrase("Customer Name", labelFont));
            infoTable.addCell(new Phrase(customerName, valueFont));

            infoTable.addCell(new Phrase("Email", labelFont));
            infoTable.addCell(new Phrase(email, valueFont));

            infoTable.addCell(new Phrase("Account Number", labelFont));
            infoTable.addCell(new Phrase(accountNumber, valueFont));

            infoTable.addCell(new Phrase("Current Balance", labelFont));
            infoTable.addCell(new Phrase(
                    "₹ " + String.format("%.2f", currentBalance),
                    valueFont));

            document.add(infoTable);

            //-------------------------------------------------------
            // Transaction Heading
            //-------------------------------------------------------

            Paragraph txHeading =
                    new Paragraph("Transaction History", subTitle);

            txHeading.setSpacingAfter(10);

            document.add(txHeading);

            //-------------------------------------------------------
            // Transaction Table
            //-------------------------------------------------------

            PdfPTable table = new PdfPTable(4);

            table.setWidthPercentage(100);

            table.setWidths(new float[]{4,3,2,3});

            PdfPCell cell;

            cell = new PdfPCell(new Phrase("Date", tableHeader));
            cell.setBackgroundColor(new Color(0,102,204));
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Type", tableHeader));
            cell.setBackgroundColor(new Color(0,102,204));
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Amount", tableHeader));
            cell.setBackgroundColor(new Color(0,102,204));
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Balance", tableHeader));
            cell.setBackgroundColor(new Color(0,102,204));
            table.addCell(cell);

            //-------------------------------------------------------
            // Transactions
            //-------------------------------------------------------

            DateTimeFormatter formatter =
                    DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm");

            double totalCredit = 0;
            double totalDebit = 0;

            for (StatementTransaction tx : transactions) {

                table.addCell(new Phrase(
                        tx.getDate().format(formatter),
                        tableFont));

                table.addCell(new Phrase(
                        tx.getType(),
                        tableFont));

                table.addCell(new Phrase(
                        "₹ " + String.format("%.2f", tx.getAmount()),
                        tableFont));

                table.addCell(new Phrase(
                        "₹ " + String.format("%.2f", tx.getBalance()),
                        tableFont));

                String type = tx.getType().toUpperCase();

                if (type.contains("DEPOSIT")
                        || type.contains("TRANSFER_IN")
                        || type.contains("MATURITY")
                        || type.contains("INTEREST")) {

                    totalCredit += tx.getAmount();

                } else {

                    totalDebit += tx.getAmount();
                }
            }

            document.add(table);

            //-------------------------------------------------------
            // Summary
            //-------------------------------------------------------

            document.add(new Paragraph(" "));

            PdfPTable summary = new PdfPTable(2);

            summary.setWidthPercentage(45);
            summary.setHorizontalAlignment(Element.ALIGN_RIGHT);

            summary.addCell(new Phrase("Total Credit", labelFont));
            summary.addCell(new Phrase(
                    "₹ " + String.format("%.2f", totalCredit),
                    valueFont));

            summary.addCell(new Phrase("Total Debit", labelFont));
            summary.addCell(new Phrase(
                    "₹ " + String.format("%.2f", totalDebit),
                    valueFont));

            summary.addCell(new Phrase("Closing Balance", labelFont));
            summary.addCell(new Phrase(
                    "₹ " + String.format("%.2f", currentBalance),
                    valueFont));

            document.add(summary);

            //-------------------------------------------------------
            // Footer
            //-------------------------------------------------------

            document.add(new Paragraph(" "));
            document.add(new Paragraph(
                    "------------------------------------------------------------"));

            Paragraph footer =
                    new Paragraph(
                            "Generated by Enterprise Banking System\n"
                                    + "This is a computer generated statement.\n"
                                    + "Thank you for banking with Enterprise Bank.",
                            valueFont);

            footer.setAlignment(Element.ALIGN_CENTER);

            document.add(footer);

            document.close();

        } catch (Exception e) {

            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }
}