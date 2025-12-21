
// Replace with your actual Mailgun API key and domain
const MAILGUN_API_KEY = 'a7e1b86c5a02b58eab4bc7d44a4b76e6'; // e.g., 'key-xxxxxxxxxxxxxxxxxxxxxxxx'
const MAILGUN_DOMAIN = 'sandbox242ac7ab61094fe0bf2002fa56ed264d.mailgun.org';   // e.g., 'sandbox123.mailgun.org'

// Email configuration
const email = {
  from: 'Your Name <postmaster@sandbox242ac7ab61094fe0bf2002fa56ed264d.mailgun.org>',
  to: 'yesterdiscordm3@gmail.com',
  subject: 'Hello from Mailgun!',
  text: 'This is a sample email sent via the Mailgun API using Node.js.',
  html: '<p>This is a sample email sent via the Mailgun API using Node.js.</p>'
};

// Mailgun API endpoint
const apiUrl = `https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`;

// Send email
async function testMail() {
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams(email)
    });

    const result = await response.json();
    console.log('Email sent successfully!');
    console.log(result);
  } catch (error) {
    console.error('Error sending email:', error.message);
  }
}

export {testMail}
