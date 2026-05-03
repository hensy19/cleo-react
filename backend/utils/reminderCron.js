const cron = require('node-cron');
const pool = require('../db');
const { sendReminderEmail } = require('../services/emailService');

// Run every day at 9:00 AM
const initReminderCron = () => {
    cron.schedule('0 9 * * *', async () => {
        console.log('Running daily reminder check...');
        try {
            // 1. Get all users with their reminder settings
            const usersWithReminders = await pool.query(`
                SELECT u.id, u.name, u.email, u.cycle_length, u.last_period_date, 
                       r.period_approaching, r.days_before_period, r.ovulation_approaching
                FROM users u
                JOIN reminders r ON u.id = r.user_id
                WHERE u.last_period_date IS NOT NULL
            `);

            for (const user of usersWithReminders.rows) {
                const cycleLength = user.cycle_length || 28;
                const lastPeriod = new Date(user.last_period_date);
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                // --- 2. Period Approaching Reminder ---
                if (user.period_approaching) {
                    const nextPeriodDate = new Date(lastPeriod);
                    nextPeriodDate.setDate(lastPeriod.getDate() + cycleLength);
                    
                    const reminderDate = new Date(nextPeriodDate);
                    reminderDate.setDate(nextPeriodDate.getDate() - (user.days_before_period || 2));
                    reminderDate.setHours(0,0,0,0);

                    if (reminderDate.getTime() === today.getTime()) {
                        await sendReminderEmail(user.email, user.name, 'period', nextPeriodDate);
                    }
                }

                // --- 3. Ovulation Approaching Reminder ---
                if (user.ovulation_approaching) {
                    // Ovulation is roughly 14 days before next period
                    const nextPeriodDate = new Date(lastPeriod);
                    nextPeriodDate.setDate(lastPeriod.getDate() + cycleLength);
                    
                    const ovulationDate = new Date(nextPeriodDate);
                    ovulationDate.setDate(nextPeriodDate.getDate() - 14);
                    ovulationDate.setHours(0,0,0,0);

                    if (ovulationDate.getTime() === today.getTime()) {
                        await sendReminderEmail(user.email, user.name, 'ovulation', ovulationDate);
                    }
                }
            }
        } catch (error) {
            console.error('Error in daily reminder cron:', error);
        }
    });
    
    console.log('Daily reminder cron job scheduled.');
};

module.exports = { initReminderCron };
