// test-smtp.js
const nodemailer = require('nodemailer');

async function testSMTP() {
  try {
    console.log('Testing SMTP configuration...');
    console.log('Host:', process.env.SMTP_HOST);
    console.log('Port:', process.env.SMTP_PORT);
    console.log('User:', process.env.SMTP_USER);
    
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    console.log('Testing SMTP connection...');
    
    // Verify connection
    await transporter.verify();
    console.log('✅ SMTP connection successful');
    
    // Send test email
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: 'test@example.com',
      subject: 'Test email from Bio Lab',
      text: 'This is a test email from the Mobile Bio Lab application',
    });
    
    console.log('✅ Test email sent successfully:', info.messageId);
  } catch (error) {
    console.error('❌ SMTP test failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    
    // Provide specific troubleshooting tips based on the error
    if (error.code === 'EAUTH') {
      console.log('\n🔧 Troubleshooting tips for authentication error:');
      console.log('1. For Gmail: Make sure you generated an App Password, not using your regular password');
      console.log('2. Enable 2-factor authentication on your Gmail account');
      console.log('3. Check if your credentials are correct in the .env.local file');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n🔧 Troubleshooting tips for connection error:');
      console.log('1. Check if your SMTP_HOST is correct');
      console.log('2. Verify the SMTP_PORT matches your email provider');
      console.log('3. Ensure your internet connection is working');
    }
  }
}

testSMTP();