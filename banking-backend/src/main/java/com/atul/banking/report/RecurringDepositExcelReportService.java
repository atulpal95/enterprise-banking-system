package com.atul.banking.report;

import com.atul.banking.entity.RecurringDeposit;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class RecurringDepositExcelReportService {

    public byte[] generateReport(List<RecurringDeposit> deposits) throws IOException {

        Workbook workbook = new XSSFWorkbook();

        Sheet sheet = workbook.createSheet("Recurring Deposits");

        // =========================
        // Title Style
        // =========================

        Font titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short) 16);

        CellStyle titleStyle = workbook.createCellStyle();
        titleStyle.setFont(titleFont);
        titleStyle.setAlignment(HorizontalAlignment.CENTER);

        // =========================
        // Header Style
        // =========================

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
        titleCell.setCellValue("ENTERPRISE BANK - RECURRING DEPOSIT REPORT");
        titleCell.setCellStyle(titleStyle);

        sheet.addMergedRegion(
                new org.apache.poi.ss.util.CellRangeAddress(
                        0,
                        0,
                        0,
                        7
                )
        );

        rowNum++;

        Row header = sheet.createRow(rowNum++);

        String[] columns = {
                "ID",
                "Customer Email",
                "Monthly Installment",
                "Interest %",
                "Tenure",
                "Maturity Amount",
                "Status",
                "Created Date"
        };

        for (int i = 0; i < columns.length; i++) {

            Cell cell = header.createCell(i);

            cell.setCellValue(columns[i]);

            cell.setCellStyle(headerStyle);
        }

        for (RecurringDeposit rd : deposits) {

            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(rd.getId());

            row.createCell(1).setCellValue(
                    rd.getCustomerEmail() != null
                            ? rd.getCustomerEmail()
                            : "-"
            );

            row.createCell(2).setCellValue(
                    rd.getMonthlyInstallment() != null
                            ? rd.getMonthlyInstallment()
                            : 0
            );

            row.createCell(3).setCellValue(
                    rd.getInterestRate() != null
                            ? rd.getInterestRate()
                            : 0
            );

            row.createCell(4).setCellValue(
                    rd.getTenureMonths() != null
                            ? rd.getTenureMonths()
                            : 0
            );

            row.createCell(5).setCellValue(
                    rd.getMaturityAmount() != null
                            ? rd.getMaturityAmount()
                            : 0
            );

            row.createCell(6).setCellValue(
                    rd.getStatus() != null
                            ? rd.getStatus()
                            : "-"
            );

            row.createCell(7).setCellValue(
                    rd.getCreatedDate() != null
                            ? rd.getCreatedDate().toString()
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