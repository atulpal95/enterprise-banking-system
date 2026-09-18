package com.atul.banking.report;

import com.atul.banking.entity.Transaction;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class TransactionExcelReportService {

    public byte[] generateReport(List<Transaction> transactions) throws IOException {

        Workbook workbook = new XSSFWorkbook();

        Sheet sheet = workbook.createSheet("Transactions");

        Font titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 16);

        CellStyle titleStyle = workbook.createCellStyle();
        titleStyle.setFont(titleFont);
        titleStyle.setAlignment(HorizontalAlignment.CENTER);

        Font headerFont = workbook.createFont();
        headerFont.setBold(true);

        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setBorderBottom(BorderStyle.THIN);
        headerStyle.setBorderTop(BorderStyle.THIN);
        headerStyle.setBorderLeft(BorderStyle.THIN);
        headerStyle.setBorderRight(BorderStyle.THIN);

        int rowNum = 0;

        Row title = sheet.createRow(rowNum++);

        Cell titleCell = title.createCell(0);
        titleCell.setCellValue("ENTERPRISE BANK - TRANSACTION REPORT");
        titleCell.setCellStyle(titleStyle);

        sheet.addMergedRegion(
                new org.apache.poi.ss.util.CellRangeAddress(
                        0,
                        0,
                        0,
                        5
                )
        );

        rowNum++;

        Row header = sheet.createRow(rowNum++);

        String[] columns = {
                "ID",
                "Customer Email",
                "Transaction Type",
                "Amount",
                "Balance After",
                "Transaction Time"
        };

        for (int i = 0; i < columns.length; i++) {

            Cell cell = header.createCell(i);

            cell.setCellValue(columns[i]);

            cell.setCellStyle(headerStyle);
        }

        for (Transaction transaction : transactions) {

            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(transaction.getId());

            row.createCell(1).setCellValue(
                    transaction.getEmail() != null
                            ? transaction.getEmail()
                            : "-"
            );

            row.createCell(2).setCellValue(
                    transaction.getType() != null
                            ? transaction.getType()
                            : "-"
            );

            row.createCell(3).setCellValue(
                    transaction.getAmount() != null
                            ? transaction.getAmount()
                            : 0
            );

            row.createCell(4).setCellValue(
                    transaction.getBalanceAfterTransaction() != null
                            ? transaction.getBalanceAfterTransaction()
                            : 0
            );

            row.createCell(5).setCellValue(
                    transaction.getTransactionTime() != null
                            ? transaction.getTransactionTime().toString()
                            : "-"
            );
        }

        for (int i = 0; i < columns.length; i++) {
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        workbook.write(out);

        workbook.close();

        return out.toByteArray();
    }
}