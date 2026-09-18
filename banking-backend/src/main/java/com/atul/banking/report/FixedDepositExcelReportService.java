package com.atul.banking.report;

import com.atul.banking.entity.FixedDeposit;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class FixedDepositExcelReportService {

    public byte[] generateFixedDepositReport(List<FixedDeposit> deposits)
            throws IOException {

        Workbook workbook = new XSSFWorkbook();

        Sheet sheet = workbook.createSheet("Fixed Deposits");

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
        headerStyle.setFillForegroundColor(
                IndexedColors.GREY_25_PERCENT.getIndex());
        headerStyle.setFillPattern(
                FillPatternType.SOLID_FOREGROUND);

        int rowNum = 0;

        Row title = sheet.createRow(rowNum++);
        Cell titleCell = title.createCell(0);

        titleCell.setCellValue(
                "ENTERPRISE BANK - FIXED DEPOSIT REPORT");

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
                "Principal",
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

        for (FixedDeposit fd : deposits) {

            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(fd.getId());

            row.createCell(1).setCellValue(
                    fd.getCustomerEmail());

            row.createCell(2).setCellValue(
                    fd.getPrincipalAmount());

            row.createCell(3).setCellValue(
                    fd.getInterestRate());

            row.createCell(4).setCellValue(
                    fd.getTenureMonths());

            row.createCell(5).setCellValue(
                    fd.getMaturityAmount());

            row.createCell(6).setCellValue(
                    fd.getStatus());

            row.createCell(7).setCellValue(
                    fd.getCreatedDate() != null
                            ? fd.getCreatedDate().toString()
                            : "-"
            );
        }

        for (int i = 0; i < columns.length; i++) {

            sheet.autoSizeColumn(i);

        }

        ByteArrayOutputStream out =
                new ByteArrayOutputStream();

        workbook.write(out);

        workbook.close();

        return out.toByteArray();
    }
}