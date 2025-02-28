import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { jsPDF } from 'jspdf';
import { formatCurrency, formatDate } from '../../utils/formatters';

const ReportGenerator = ({ 
  title,
  reportType,
  dateRange,
  data,
  columns,
  summary,
  onExport
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Generate PDF report
  const generatePdfReport = () => {
    setIsGenerating(true);
    
    try {
      // Create a new PDF document
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set font size and styles
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(title, 105, 20, { align: 'center' });
      
      // Add date range
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(`Period: ${formatDate(dateRange.startDate)} to ${formatDate(dateRange.endDate)}`, 105, 30, { align: 'center' });
      
      // Add generation date
      doc.setFontSize(10);
      doc.text(`Generated on: ${formatDate(new Date())}`, 105, 35, { align: 'center' });
      
      // Add horizontal line
      doc.setDrawColor(0);
      doc.setLineWidth(0.5);
      doc.line(20, 40, 190, 40);
      
      // Add summary data
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Summary', 20, 50);
      
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      
      let yPosition = 60;
      Object.entries(summary).forEach(([key, value], index) => {
        const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
        
        doc.setFont('helvetica', 'bold');
        doc.text(`${label}:`, 20, yPosition);
        
        doc.setFont('helvetica', 'normal');
        const valueText = typeof value === 'number' && key.toLowerCase().includes('amount') 
          ? formatCurrency(value)
          : value.toString();
        
        doc.text(valueText, 70, yPosition);
        
        yPosition += 8;
        
        // Add page break if running out of space
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;
        }
      });
      
      // Add horizontal line
      yPosition += 5;
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 10;
      
      // Add table header
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Detailed Data', 20, yPosition);
      yPosition += 10;
      
      // Set up table columns
      const tableColumns = columns.map(column => ({
        id: column.key,
        name: column.title,
        width: column.width || 30
      }));
      
      // Calculate column positions
      let xPosition = 20;
      const columnPositions = tableColumns.map(column => {
        const position = xPosition;
        xPosition += column.width;
        return position;
      });
      
      // Add table headers
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      tableColumns.forEach((column, index) => {
        doc.text(column.name, columnPositions[index], yPosition);
      });
      
      yPosition += 5;
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 5;
      
      // Add table data
      doc.setFont('helvetica', 'normal');
      data.forEach((row, rowIndex) => {
        tableColumns.forEach((column, colIndex) => {
          let value = row[column.id];
          
          // Format value if needed
          if (column.id === 'amount' || column.id.toLowerCase().includes('amount')) {
            value = formatCurrency(value);
          } else if (column.id.toLowerCase().includes('date')) {
            value = formatDate(value);
          } else if (typeof value === 'boolean') {
            value = value ? 'Yes' : 'No';
          } else if (value === null || value === undefined) {
            value = '';
          } else {
            value = value.toString();
          }
          
          // Truncate long text
          if (value.length > 25) {
            value = value.substring(0, 22) + '...';
          }
          
          doc.text(value, columnPositions[colIndex], yPosition);
        });
        
        yPosition += 6;
        
        // Add page break if running out of space
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
          
          // Add table headers on new page
          doc.setFontSize(9);
          doc.setFont('helvetica', 'bold');
          tableColumns.forEach((column, index) => {
            doc.text(column.name, columnPositions[index], yPosition);
          });
          
          yPosition += 5;
          doc.line(20, yPosition, 190, yPosition);
          yPosition += 5;
          doc.setFont('helvetica', 'normal');
        }
      });
      
      // Add footer
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' });
      }
      
      // Save the PDF
      doc.save(`${reportType}-report-${formatDate(new Date())}.pdf`);
      
      // Notify parent component
      if (onExport) {
        onExport({
          type: 'pdf',
          data: doc.output('blob')
        });
      }
    } catch (error) {
      console.error('Error generating PDF report:', error);
      alert('An error occurred while generating the PDF report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  // Generate CSV report
  const generateCsvReport = () => {
    setIsGenerating(true);
    
    try {
      // Create CSV content
      const headerRow = columns.map(column => column.title).join(',');
      
      const dataRows = data.map(row => {
        return columns.map(column => {
          const value = row[column.key];
          
          // Format value if needed
          if (value === null || value === undefined) {
            return '';
          } else if (typeof value === 'string' && value.includes(',')) {
            // Escape commas in CSV
            return `"${value}"`;
          } else {
            return value;
          }
        }).join(',');
      });
      
      // Combine header and data rows
      const csvContent = [headerRow, ...dataRows].join('\n');
      
      // Create a Blob with the CSV content
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      
      // Create a download link
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportType}-report-${formatDate(new Date())}.csv`);
      link.style.visibility = 'hidden';
      
      // Append to the document, click it, and remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Notify parent component
      if (onExport) {
        onExport({
          type: 'csv',
          data: blob
        });
      }
    } catch (error) {
      console.error('Error generating CSV report:', error);
      alert('An error occurred while generating the CSV report. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <Card title={title}>
      <div className="p-4">
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Report Period</h3>
          <p className="mt-1 text-sm text-gray-900">
            {formatDate(dateRange.startDate)} to {formatDate(dateRange.endDate)}
          </p>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Report Summary</h3>
          <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(summary).map(([key, value]) => {
              const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
              const isMonetary = typeof value === 'number' && key.toLowerCase().includes('amount');
              
              return (
                <div key={key}>
                  <span className="text-xs text-gray-500">{label}</span>
                  <p className="text-sm font-medium text-gray-900">
                    {isMonetary ? formatCurrency(value) : value}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-500">Data Preview</h3>
          <div className="mt-2 overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map(column => (
                    <th
                      key={column.key}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.title}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.slice(0, 5).map((row, index) => (
                  <tr key={row.id || index}>
                    {columns.map(column => {
                      let value = row[column.key];
                      
                      // Use render function if provided
                      if (column.render) {
                        value = column.render(value, row);
                      } else if (column.key === 'amount' || column.key.toLowerCase().includes('amount')) {
                        value = formatCurrency(value);
                      } else if (column.key.toLowerCase().includes('date')) {
                        value = formatDate(value);
                      }
                      
                      return (
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {value}
                        </td>
                      );
                    })}
                  </tr>
                ))}
                
                {data.length === 0 && (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                      No data available
                    </td>
                  </tr>
                )}
                
                {data.length > 5 && (
                  <tr>
                    <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                      ... and {data.length - 5} more rows
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            variant="secondary"
            onClick={generateCsvReport}
            disabled={isGenerating || data.length === 0}
          >
            {isGenerating ? 'Generating...' : 'Export CSV'}
          </Button>
          
          <Button
            variant="primary"
            onClick={generatePdfReport}
            disabled={isGenerating || data.length === 0}
          >
            {isGenerating ? 'Generating...' : 'Export PDF'}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ReportGenerator;
