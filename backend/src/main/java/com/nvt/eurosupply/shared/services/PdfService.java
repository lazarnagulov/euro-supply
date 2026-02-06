package com.nvt.eurosupply.shared.services;

import com.nvt.eurosupply.shared.exceptions.PdfGenerationException;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import org.springframework.stereotype.Service;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Service
public class PdfService {

    public<T> byte[] generate(String templatePath, List<T> data, Map<String, Object> params) {
        try {
            InputStream templateStream = getClass().getResourceAsStream(templatePath);
            if (templateStream == null) {
                throw new IllegalArgumentException("Template file not found: " + templatePath);
            }

            JasperReport jasperReport = JasperCompileManager.compileReport(templateStream);
            JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(data);

            JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, params, dataSource);
            return JasperExportManager.exportReportToPdf(jasperPrint);

        } catch (JRException e) {
            throw new PdfGenerationException("Failed to generate pdf.");
        }
    }
}