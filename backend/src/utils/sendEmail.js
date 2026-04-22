const nodemailer = require('nodemailer');

const sendEmail = async (to, subject, html) => {
  try {
    // Vérifier que les variables existent
    console.log('EMAIL_USER:', process.env.EMAIL_USER ? '✅ défini' : '❌ manquant');
    console.log('EMAIL_PASSWORD:', process.env.EMAIL_PASSWORD ? '✅ défini' : '❌ manquant');
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      throw new Error('Variables d\'email manquantes dans .env');
    }
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const mailOptions = {
      from: `"GestiÉtudiants" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Email envoyé avec succès à: ${to}`);
    
    return { success: true };
  } catch (error) {
    console.error('❌ Erreur envoi email:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = sendEmail;