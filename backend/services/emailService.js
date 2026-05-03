const transporter = require('../utils/mailTransporter');

const sendCycleSummaryEmail = async (userEmail, userName, details) => {
    const { nextPeriod, ovulationStart, ovulationEnd } = details;

    const mailOptions = {
        from: `"Cleo Period Tracker" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: '🌸 Your New Cycle Summary - Cleo',
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
                <h2 style="color: #d63384; text-align: center;">Hello, ${userName}!</h2>
                <p style="font-size: 16px; color: #555;">You've successfully logged your new cycle. Here are your predictions for this month:</p>
                
                <div style="background-color: #fff0f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <div style="margin-bottom: 15px;">
                        <span style="font-weight: bold; color: #d63384;">🩸 Next Predicted Period:</span>
                        <div style="font-size: 18px; margin-top: 5px;">${new Date(nextPeriod).toDateString()}</div>
                    </div>
                    
                    <div>
                        <span style="font-weight: bold; color: #d63384;">✨ Ovulation Window:</span>
                        <div style="font-size: 18px; margin-top: 5px;">${new Date(ovulationStart).toDateString()} - ${new Date(ovulationEnd).toDateString()}</div>
                    </div>
                </div>

                <p style="font-size: 14px; color: #888; text-align: center;">Take care of yourself! 🌸</p>
                <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="font-size: 12px; color: #aaa; text-align: center;">Sent with love by Cleo Team</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Summary email sent to ${userEmail}`);
    } catch (error) {
        console.error('Error sending summary email:', error);
    }
};

const sendReminderEmail = async (userEmail, userName, type, date) => {
    const isPeriod = type === 'period';
    const subject = isPeriod ? '🩸 Reminder: Your period is approaching' : '✨ Reminder: Your ovulation window is starting';
    const message = isPeriod 
        ? `We predict your next period will start around <strong>${new Date(date).toDateString()}</strong>.`
        : `Your peak fertility window is predicted to start around <strong>${new Date(date).toDateString()}</strong>.`;

    const mailOptions = {
        from: `"Cleo Period Tracker" <${process.env.EMAIL_USER}>`,
        to: userEmail,
        subject: subject,
        html: `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
                <h2 style="color: #d63384; text-align: center;">Hi ${userName}!</h2>
                <p style="font-size: 16px; color: #555; text-align: center;">${message}</p>
                
                <div style="text-align: center; margin: 30px 0;">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard" 
                       style="background-color: #d63384; color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: bold;">
                       Open Cleo App
                    </a>
                </div>

                <p style="font-size: 14px; color: #888; text-align: center;">Stay healthy and track your symptoms!</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`${type} reminder email sent to ${userEmail}`);
    } catch (error) {
        console.error(`Error sending ${type} reminder email:`, error);
    }
};

module.exports = {
    sendCycleSummaryEmail,
    sendReminderEmail
};
