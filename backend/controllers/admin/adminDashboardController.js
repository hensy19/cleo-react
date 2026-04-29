const pool = require("../../db");

// Get stats for admin dashboard
const getDashboardStats = async (req, res) => {
    try {
        // 1. Total Users
        const totalUsersResult = await pool.query("SELECT COUNT(*) FROM users");
        const totalUsers = parseInt(totalUsersResult.rows[0].count);

        // 2. Monthly Signups (users created in the last 30 days)
        const monthlySignupsResult = await pool.query(
            "SELECT COUNT(*) FROM users WHERE created_at >= NOW() - INTERVAL '30 days'"
        );
        const monthlySignups = parseInt(monthlySignupsResult.rows[0].count);

        // 3. Avg Cycle Length
        const avgCycleResult = await pool.query("SELECT AVG(cycle_length) FROM users WHERE cycle_length IS NOT NULL");
        const avgCycle = parseFloat(avgCycleResult.rows[0].avg || 28).toFixed(1);

        // 4. New Today
        const newTodayResult = await pool.query(
            "SELECT COUNT(*) FROM users WHERE created_at >= CURRENT_DATE"
        );
        const newToday = parseInt(newTodayResult.rows[0].count);

        // 5. Active Users (last 7 days)
        const activeUsersResult = await pool.query(`
            SELECT COUNT(DISTINCT user_id) FROM (
                SELECT user_id FROM period_logs WHERE created_at >= NOW() - INTERVAL '7 days'
                UNION
                SELECT user_id FROM mood_logs WHERE created_at >= NOW() - INTERVAL '7 days'
                UNION
                SELECT user_id FROM symptom_logs WHERE created_at >= NOW() - INTERVAL '7 days'
                UNION
                SELECT user_id FROM notes WHERE created_at >= NOW() - INTERVAL '7 days'
            ) AS active_pool
        `);
        const activeUsers = parseInt(activeUsersResult.rows[0].count);

        // 6. User Growth (Daily - Last 14 days)
        const userGrowthResult = await pool.query(`
            SELECT 
                DATE(created_at) AS date,
                COUNT(*) AS users
            FROM users
            WHERE created_at >= NOW() - INTERVAL '14 days'
            GROUP BY date
            ORDER BY date
        `);

        // 7. Daily Activity Logs (Last 14 days)
        const dailyLogsResult = await pool.query(`
            SELECT 
                DATE(created_at) AS date,
                COUNT(*) AS logs
            FROM (
                SELECT created_at FROM period_logs
                UNION ALL
                SELECT created_at FROM mood_logs
                UNION ALL
                SELECT created_at FROM symptom_logs
                UNION ALL
                SELECT created_at FROM notes
            ) AS all_logs
            WHERE created_at >= NOW() - INTERVAL '14 days'
            GROUP BY date
            ORDER BY date
        `);

        // 8. Activity Breakdown
        const periodCount = await pool.query("SELECT COUNT(*) FROM period_logs");
        const moodCount = await pool.query("SELECT COUNT(*) FROM mood_logs");
        const symptomCount = await pool.query("SELECT COUNT(*) FROM symptom_logs");
        const noteCount = await pool.query("SELECT COUNT(*) FROM notes");

        const activityBreakdown = [
            { name: 'Periods', count: parseInt(periodCount.rows[0].count), color: '#8B5CF6' },
            { name: 'Moods', count: parseInt(moodCount.rows[0].count), color: '#EC4899' },
            { name: 'Symptoms', count: parseInt(symptomCount.rows[0].count), color: '#3B82F6' },
            { name: 'Notes', count: parseInt(noteCount.rows[0].count), color: '#10B981' }
        ];

        res.json({
            totalUsers,
            monthlySignups,
            avgCycle,
            activeUsers,
            newToday,
            userGrowth: userGrowthResult.rows.map(row => ({
                day: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                users: parseInt(row.users)
            })),
            dailyLogs: dailyLogsResult.rows.map(row => ({
                ...row,
                date: new Date(row.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            })),
            activityBreakdown
        });
    } catch (err) {
        console.error("Error fetching admin stats:", err.message);
        res.status(500).json({ message: "Server error fetching stats" });
    }
};

// Get recent user activity
const getRecentActivity = async (req, res) => {
    try {
        const query = `
            (SELECT u.name, u.email, 'Joined Cleo' as action, u.created_at as time, 'Active' as status FROM users u)
            UNION ALL
            (SELECT u.name, u.email, 'Logged a new period' as action, p.created_at as time, 'Active' as status FROM period_logs p JOIN users u ON p.user_id = u.id)
            UNION ALL
            (SELECT u.name, u.email, 'Added a mood entry' as action, m.created_at as time, 'Active' as status FROM mood_logs m JOIN users u ON m.user_id = u.id)
            UNION ALL
            (SELECT u.name, u.email, 'Logged symptoms' as action, s.created_at as time, 'Active' as status FROM symptom_logs s JOIN users u ON s.user_id = u.id)
            UNION ALL
            (SELECT u.name, u.email, 'Created a new note' as action, n.created_at as time, 'Active' as status FROM notes n JOIN users u ON n.user_id = u.id)
            ORDER BY time DESC
            LIMIT 10
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching recent activity:", err.message);
        res.status(500).json({ message: "Server error fetching activity" });
    }
};

// Get most active users
const getMostActiveUsers = async (req, res) => {
    try {
        const query = `
            SELECT u.id, u.name, COUNT(activity_pool.user_id) as activity_count
            FROM users u
            LEFT JOIN (
                SELECT user_id FROM period_logs
                UNION ALL
                SELECT user_id FROM mood_logs
                UNION ALL
                SELECT user_id FROM symptom_logs
                UNION ALL
                SELECT user_id FROM notes
            ) AS activity_pool ON u.id = activity_pool.user_id
            GROUP BY u.id, u.name
            ORDER BY activity_count DESC
            LIMIT 3
        `;
        
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        console.error("Error fetching most active users:", err.message);
        res.status(500).json({ message: "Server error fetching active users" });
    }
};

module.exports = {
    getDashboardStats,
    getRecentActivity,
    getMostActiveUsers
};
