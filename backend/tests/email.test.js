/**
 * Email Test Script
 * 
 * This script tests the email functionality using the configured environment variables.
 * Run with: node backend/tests/email.test.js
 */

require('dotenv').config(); // Load environment variables
const { sendEmail } = require('../utils/email');
const nodemailer = require('nodemailer');

// Temporarily set EMAIL_SECURE to false for port 587
process.env.EMAIL_SECURE = 'false';
console.log('Setting EMAIL_SECURE to false for STARTTLS');

async function createTestAccount() {
  console.log('Creating test account with Ethereal...');
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log('Test account created successfully');
    
    // Set environment variables for the test
    process.env.EMAIL_HOST = 'smtp.ethereal.email';
    process.env.EMAIL_PORT = 587;
    process.env.EMAIL_USER = testAccount.user;
    process.env.EMAIL_PASSWORD = testAccount.pass;
    process.env.EMAIL_SECURE = 'false';
    
    return testAccount;
  } catch (error) {
    console.error('Error creating test account:', error);
    throw error;
  }
}

async function testEmailFunctionality(useEthereal = false) {
  console.log('Testing email functionality...');
  
  if (useEthereal) {
    await createTestAccount();
  }
  
  console.log('Email configuration:');
  console.log('- EMAIL_HOST:', process.env.EMAIL_HOST || 'Not configured');
  console.log('- EMAIL_PORT:', process.env.EMAIL_PORT || 'Not configured');
  console.log('- EMAIL_USER:', process.env.EMAIL_USER ? '****' : 'Not configured');
  console.log('- EMAIL_FROM:', process.env.EMAIL_FROM || 'Not configured');
  console.log('- NOTIFICATION_EMAIL:', process.env.NOTIFICATION_EMAIL || 'Not configured');
  console.log('- EMAIL_SECURE:', process.env.EMAIL_SECURE || 'Not configured');
  
  try {
    // Create a transporter manually for more debug information
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587', 10),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      },
      debug: true, // Show debug output
      logger: true // Log information about the mail
    });
    
    console.log('Verifying SMTP connection...');
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    
    // Send a test email
    console.log('Sending test email...');
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'MedMatch <info@med-match.de>',
      to: process.env.NOTIFICATION_EMAIL || 'test@example.com',
      subject: 'Test Email from MedMatch',
      text: `This is a test email sent at ${new Date().toLocaleString()}.\n\nThis email confirms that the email configuration is working correctly.\n\nBest regards,\nMedMatch Team`
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully!');
    console.log('Message ID:', info.messageId);
    
    if (info.previewUrl) {
      console.log('Preview URL:', info.previewUrl);
    }
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}

// Run the test with production settings (set to true to use Ethereal instead)
testEmailFunctionality(false)
  .then(success => {
    console.log(success ? 'Email test completed successfully!' : 'Email test failed.');
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  }); 