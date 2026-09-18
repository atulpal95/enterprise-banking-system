package com.atul.banking.report;

import com.atul.banking.entity.Loan;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class LoanExcelReportService {

    public byte[] generateLoanReport(List<Loan> loans) throws IOException {

        Workbook workbook = new XSSFWorkbook();

        Sheet sheet = workbook.createSheet("Loans");

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
        titleCell.setCellValue("ENTERPRISE BANK - LOAN REPORT");
        titleCell.setCellStyle(titleStyle);

        sheet.addMergedRegion(
                new org.apache.poi.ss.util.CellRangeAddress(
                        0, 0, 0, 8
                )
        );

        rowNum++;

        Row header = sheet.createRow(rowNum++);

        String[] columns = {
                "ID",
                "Customer",
                "Loan Type",
                "Amount",
                "Interest %",
                "Tenure",
                "EMI",
                "Status",
                "Applied Date"
        };

        for (int i = 0; i < columns.length; i++) {
            Cell cell = header.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
        }

        for (Loan loan : loans) {

            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(loan.getId());

            row.createCell(1).setCellValue(
                    loan.getCustomer() != null
                            ? loan.getCustomer().getFullName()
                            : "-"
            );

            row.createCell(2).setCellValue(
                    loan.getLoanType() != null
                            ? loan.getLoanType()
                            : "-"
            );

            row.createCell(3).setCellValue(
                    loan.getAmount() != null
                            ? loan.getAmount()
                            : 0
            );

            row.createCell(4).setCellValue(
                    loan.getInterestRate() != null
                            ? loan.getInterestRate()
                            : 0
            );

            row.createCell(5).setCellValue(
                    loan.getTenureMonths() != null
                            ? loan.getTenureMonths()
                            : 0
            );

            row.createCell(6).setCellValue(
                    loan.getEmi() != null
                            ? loan.getEmi()
                            : 0
            );

            row.createCell(7).setCellValue(
                    loan.getStatus() != null
                            ? loan.getStatus()
                            : "-"
            );

            row.createCell(8).setCellValue(
                    loan.getAppliedDate() != null
                            ? loan.getAppliedDate().toString()
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