import { jsPDF } from 'jspdf';
import { formatCurrency, formatDate } from './formatters';

/**
 * Generate a PDF receipt for a payment
 * @param {Object} payment - The payment object
 * @param {Object} student - The student object
 * @param {Object} fee - The fee object (optional)
 * @param {Object} schoolInfo - School information for the receipt header
 * @returns {Promise<Blob>} - Promise that resolves to the PDF blob
 */
export const generateReceipt = async (payment, student, fee, schoolInfo) => {
  // Create new PDF document
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Set font size and styles
  doc.setFontSize(10);
  
  // Set default school info if not provided
  const school = {
    name: 'School Management System',
    address: '123 Education St, Cityville',
    phone: '+1 234 567 8900',
    email: 'info@school.edu',
    ...schoolInfo
  };
  
  // Document title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('PAYMENT RECEIPT', 105, 20, { align: 'center' });
  
  // School info
  doc.setFontSize(14);
  doc.text(school.name, 105, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(school.address, 105, 35, { align: 'center' });
  doc.text(`Phone: ${school.phone} | Email: ${school.email}`, 105, 40, { align: 'center' });
  
  // Draw a horizontal line
  doc.setDrawColor(0);
  doc.setLineWidth(0.5);
  doc.line(20, 45, 190, 45);
  
  // Receipt details
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Receipt Number:', 20, 55);
  doc.text('Date:', 20, 62);
  doc.text('Payment Method:', 20, 69);
  
  doc.setFont('helvetica', 'normal');
  doc.text(payment.receipt_number || 'N/A', 60, 55);
  doc.text(formatDate(payment.payment_date) || 'N/A', 60, 62);
  doc.text(payment.payment_method || 'N/A', 60, 69);
  
  // Student details
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('Student Information', 130, 55);
  doc.setFont('helvetica', 'normal');
  doc.text(`Name: ${student.first_name} ${student.last_name}`, 130, 62);
  doc.text(`ID: ${student.student_id}`, 130, 69);
  
  // Draw another horizontal line
  doc.line(20, 75, 190, 75);
  
  // Payment details
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Payment Details', 105, 85, { align: 'center' });
  
  // Table header
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 90, 170, 8, 'F');
  doc.setFontSize(10);
  doc.text('Description', 25, 95);
  doc.text('Amount', 175, 95, { align: 'right' });
  
  // Payment row
  doc.setFont('helvetica', 'normal');
  const description = fee 
    ? `${fee.fee_types?.name || 'Fee payment'} - ${formatDate(fee.due_date)}`
    : payment.notes || 'School fee payment';
  
  doc.text(description, 25, 105);
  doc.text(formatCurrency(payment.amount), 175, 105, { align: 'right' });
  
  // Total
  doc.line(20, 110, 190, 110);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', 140, 120);
  doc.text(formatCurrency(payment.amount), 175, 120, { align: 'right' });
  
  // Payment status
  doc.setFontSize(12);
  doc.text('Payment Status:', 25, 135);
  
  // Add status indicator
  const statusText = payment.status?.toUpperCase() || 'COMPLETED';
  
  // Set color based on status
  if (statusText === 'COMPLETED' || statusText === 'PAID') {
    doc.setTextColor(0, 128, 0); // Green for completed
  } else if (statusText === 'PENDING') {
    doc.setTextColor(255, 165, 0); // Orange for pending
  } else if (statusText === 'FAILED' || statusText === 'CANCELLED') {
    doc.setTextColor(255, 0, 0); // Red for failed/cancelled
  }
  
  doc.text(statusText, 70, 135);
  doc.setTextColor(0, 0, 0); // Reset to black
  
  // Notes section
  if (payment.notes) {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Notes:', 25, 145);
    doc.setFont('helvetica', 'normal');
    doc.text(payment.notes, 25, 155, {
      maxWidth: 160
    });
  }
  
  // Footer
  doc.setFontSize(9);
  doc.text('This is a computer generated receipt and does not require a signature.', 105, 270, { align: 'center' });
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 105, 275, { align: 'center' });
  
  // Return the PDF as a blob
  return doc.output('blob');
};

/**
 * Generate a PDF receipt and trigger download
 * @param {Object} payment - The payment object
 * @param {Object} student - The student object
 * @param {Object} fee - The fee object (optional)
 * @param {Object} schoolInfo - School information for the receipt header
 */
export const downloadReceipt = async (payment, student, fee, schoolInfo) => {
  try {
    const pdfBlob = await generateReceipt(payment, student, fee, schoolInfo);
    
    // Create a URL for the blob
    const pdfUrl = URL.createObjectURL(pdfBlob);
    
    // Create a temporary link element
    const downloadLink = document.createElement('a');
    downloadLink.href = pdfUrl;
    downloadLink.download = `Receipt-${payment.receipt_number}.pdf`;
    
    // Append to the document, click it, and remove it
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    
    // Release the URL object
    URL.revokeObjectURL(pdfUrl);
  } catch (error) {
    console.error('Failed to generate receipt:', error);
    throw error;
  }
};

/**
 * Send receipt via email
 * @param {Object} payment - The payment object
 * @param {Object} student - The student object
 * @param {Object} fee - The fee object (optional)
 * @param {Object} schoolInfo - School information for the receipt header
 * @param {string} emailAddress - Email address to send the receipt to
 * @returns {Promise<boolean>} - Promise that resolves to true if email sent successfully
 */
export const emailReceipt = async (payment, student, fee, schoolInfo, emailAddress) => {
  try {
    // In a real app, this would call an API to send the email with the receipt
    // For this example, we'll just log it
    console.log(`Sending receipt for payment ${payment.receipt_number} to ${emailAddress}`);
    
    // Generate the receipt
    const pdfBlob = await generateReceipt(payment, student, fee, schoolInfo);
    
    // Here you would send the PDF blob to your backend
    // The backend would then attach it to an email and send it
    
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  } catch (error) {
    console.error('Failed to email receipt:', error);
    throw error;
  }
};

export default {
  generateReceipt,
  downloadReceipt,
  emailReceipt
};
