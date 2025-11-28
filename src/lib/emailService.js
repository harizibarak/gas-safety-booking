// Email service using EmailJS
// You'll need to set up EmailJS at https://www.emailjs.com/
// and configure your service ID, template ID, and public key

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

export const sendQuoteEmail = async (lead) => {
    // Check if EmailJS is configured
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
        throw new Error('EmailJS is not configured. Please set up EmailJS credentials.');
    }

    // Dynamically import EmailJS only when needed
    const emailjs = await import('@emailjs/browser');
    
    // Prepare email template parameters
    const templateParams = {
        to_email: lead.client_email,
        to_name: lead.client_email.split('@')[0], // Use email prefix as name
        address: lead.address,
        expiry_date: lead.expiry_date || 'Not specified',
        quoted_price: lead.quoted_price ? `£${parseFloat(lead.quoted_price).toFixed(2)}` : 'Not quoted yet',
        booking_token: lead.id, // UUID token for booking completion link
        booking_link: `${window.location.origin}/complete-booking/${lead.id}`,
        reply_to: 'noreply@example.com' // Change this to your email
    };

    try {
        await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams,
            EMAILJS_PUBLIC_KEY
        );
        return true;
    } catch (error) {
        console.error('EmailJS error:', error);
        throw error;
    }
};

// Alternative: Simple mailto link (fallback if EmailJS not configured)
export const generateMailtoLink = (lead) => {
    const subject = encodeURIComponent(`w - ${lead.address}`);
    const body = encodeURIComponent(
        `Dear Customer,\n\n` +
        `Thank you for your interest in our gas safety certificate renewal service.\n\n` +
        `Property Address: ${lead.address}\n` +
        `Certificate Expiry: ${lead.expiry_date || 'Not specified'}\n` +
        `Proposed Quote: ${lead.quoted_price ? `£${parseFloat(lead.quoted_price).toFixed(2)}` : 'Not quoted yet'}\n\n` +
        `Please let us know if you'd like to proceed with this booking.\n\n` +
        `Best regards,\nGas Safety Team`
    );
    return `mailto:${lead.client_email}?subject=${subject}&body=${body}`;
};

