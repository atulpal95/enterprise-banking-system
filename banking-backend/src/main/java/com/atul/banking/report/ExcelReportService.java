package com.atul.banking.report;

import com.atul.banking.entity.Customer;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class ExcelReportService {

    public byte[] generateCustomerReport(List<Customer> customers) throws IOException {

        Workbook workbook = new XSSFWorkbook();

        Sheet sheet = workbook.createSheet("Customers");

        // Title Style
        Font titleFont = workbook.createFont();
        titleFont.setBold(true);
        titleFont.setFontHeightInPoints((short)16);

        CellStyle titleStyle = workbook.createCellStyle();
        titleStyle.setFont(titleFont);
        titleStyle.setAlignment(HorizontalAlignment.CENTER);

        // Header Style
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
        titleCell.setCellValue("ENTERPRISE BANK - CUSTOMER REPORT");
        titleCell.setCellStyle(titleStyle);

        sheet.addMergedRegion(
                new org.apache.poi.ss.util.CellRangeAddress(
                        0,0,0,6
                )
        );

        rowNum++;

        Row header = sheet.createRow(rowNum++);

        String[] columns = {
                "ID",
                "Full Name",
                "Email",
                "Mobile",
                "Account Number",
                "Status",
                "Balance"
        };

        for(int i=0;i<columns.length;i++){
            Cell cell = header.createCell(i);
            cell.setCellValue(columns[i]);
            cell.setCellStyle(headerStyle);
        }

        for(Customer customer : customers){

            Row row = sheet.createRow(rowNum++);

            row.createCell(0).setCellValue(customer.getId());

            row.createCell(1).setCellValue(customer.getFullName());

            row.createCell(2).setCellValue(customer.getEmail());

            row.createCell(3).setCellValue(customer.getMobile());

            row.createCell(4).setCellValue(customer.getAccountNumber());

            row.createCell(5).setCellValue(
                    customer.isActive() ? "ACTIVE" : "BLOCKED"
            );

            row.createCell(6).setCellValue(customer.getBalance());
        }

        for(int i=0;i<columns.length;i++){
            sheet.autoSizeColumn(i);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();

        workbook.write(out);

        workbook.close();

        return out.toByteArray();
    }
}