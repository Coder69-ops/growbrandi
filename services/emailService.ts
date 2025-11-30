import emailjs from '@emailjs/browser';

// Initialize EmailJS with your Public Key
// You can find this in your EmailJS dashboard under "Account" -> "API Keys"
export const initEmailJS = (publicKey: string) => {
    emailjs.init(publicKey);
};

interface EmailParams {
    name: string;
    email: string;
    subject: string;
    service: string;
    message: string;
}

export const sendEmail = async (
    serviceId: string,
    templateId: string,
    formElement: HTMLFormElement,
    publicKey: string
) => {
    try {
        const result = await emailjs.sendForm(serviceId, templateId, formElement, publicKey);
        return result;
    } catch (error) {
        console.error('EmailJS Error:', error);
        throw error;
    }
};
