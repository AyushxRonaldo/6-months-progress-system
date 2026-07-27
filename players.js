/**
 * Players.js - Player Management and Calculations
 * Handles player data, stats calculation, and progression
 */

const Players = {
    /**
     * Calculate level based on XP using progressive difficulty
     */
    calculateLevel(xp) {
        // Each level requires 50 XP more than previous
        // Level 1: 0 XP, Level 2: 100 XP, Level 3: 250 XP, etc.
        let level = 1;
        let requiredXP = 100;
        let currentXP = xp;

        while (currentXP >= requiredXP) {
            currentXP -= requiredXP;
            level++;
            requiredXP += 50; // Each level requires 50 more XP
        }
        return level;
    },

    /**
     * Get XP needed for next level
     */
    getXPForNextLevel(currentXP) {
        let level = this.calculateLevel(currentXP);
        let requiredXP = 100;
        for (let i = 2; i <= level; i++) {
            requiredXP += 50;
        }
        return requiredXP;
    },

    /**
     * Calculate overall progress for a player
     * Progress = Average of all days' completion percentages
     */
    calculateProgress(playerId) {
        const currentDay = Storage.getCurrentDay();
        let totalProgress = 0;
        let daysWithData = 0;

        for (let day = 1; day <= currentDay; day++) {
            const stats = Storage.getDailyStats(playerId, day);
            if (stats.progress > 0) {
                totalProgress += stats.progress;
                daysWithData++;
            }
        }

        return daysWithData > 0 ? Math.round(totalProgress / daysWithData) : 0;
    },

    /**
     * Calculate daily progress based on tasks
     * Green = 100%, Blue = 50%, Red/White = 0%
     */
    calculateDailyProgress(tasks) {
        if (tasks.length === 0) return 0;

        let totalScore = 0;
        tasks.forEach(task => {
            if (task.status === 'green') totalScore += 100;
            else if (task.status === 'blue') totalScore += 50;
        });

        return Math.round(totalScore / tasks.length);
    },

    /**
     * Award XP based on task completion
     */
    calculateXPReward(taskStatus) {
        switch (taskStatus) {
            case 'green': return 10;
            case 'blue': return 5;
            case 'red': return 0;
            case 'white': return 0;
            default: return 0;
        }
    },

    /**
     * Update player stats after task change
     */
    updatePlayerStats(playerId, day) {
        const tasks = Storage.getTasks(playerId, day);
        const dailyProgress = this.calculateDailyProgress(tasks);

        // Calculate XP earned today
        let xpEarned = 0;
        let completed = 0;
        let partial = 0;
        let failed = 0;

        tasks.forEach(task => {
            xpEarned += this.calculateXPReward(task.status);
            if (task.status === 'green') completed++;
            else if (task.status === 'blue') partial++;
            else if (task.status === 'red') failed++;
        });

        // Save daily stats
        Storage.setDailyStats(playerId, day, {
            progress: dailyProgress,
            xpEarned: xpEarned,
            completed: completed,
            partial: partial,
            failed: failed
        });

        // Update player XP and level
        const player = Storage.getPlayer(playerId);
        const newXP = player.xp + xpEarned;
        const newLevel = this.calculateLevel(newXP);

        // Update streak based on daily progress
        const requiredStreak = 50; // 50% completion required for streak
        let newStreak = player.streak;
        if (dailyProgress >= requiredStreak) {
            newStreak++;
        } else {
            newStreak = 0; // Reset streak if didn't meet requirement
        }

        // Track longest streak
        const longestStreak = Math.max(player.longestStreak || 0, newStreak);

        // Calculate overall progress
        const overallProgress = this.calculateProgress(playerId);

        // Save calendar color
        let calendarColor = 'white';
        if (dailyProgress >= 75) calendarColor = 'green';
        else if (dailyProgress >= 50) calendarColor = 'blue';
        else if (dailyProgress > 0) calendarColor = 'blue';
        else calendarColor = 'red';

        Storage.setCalendarData(playerId, day, calendarColor);

        // Update player
        Storage.updatePlayer(playerId, {
            xp: newXP,
            level: newLevel,
            streak: newStreak,
            progress: overallProgress,
            longestStreak: longestStreak
        });

        // Check achievements
        this.checkAchievements(playerId, newXP, newLevel, newStreak, completed);
    },

    /**
     * Check and unlock achievements
     */
    checkAchievements(playerId, xp, level, streak, completedTasks) {
        const achievements = [
            { id: 'first_task', name: '🏆 First Task', desc: 'Complete your first task', condition: completedTasks >= 1 },
            { id: 'seven_day_streak', name: '🔥 Week Warrior', desc: '7 Day Streak', condition: streak >= 7 },
            { id: 'fourteen_day_streak', name: '🔥 Two Weeks Strong', desc: '14 Day Streak', condition: streak >= 14 },
            { id: 'hundred_xp', name: '⚡ Century Mark', desc: '100 XP earned', condition: xp >= 100 },
            { id: 'level_five', name: '⭐ Level 5', desc: 'Reach Level 5', condition: level >= 5 },
            { id: 'level_ten', name: '👑 Level 10', desc: 'Reach Level 10', condition: level >= 10 },
            { id: 'perfect_day', name: '💯 Perfect Day', desc: '100% completion', condition: false } // This is set separately
        ];

        achievements.forEach(achievement => {
            if (achievement.condition) {
                Storage.unlockAchievement(playerId, achievement.id);
            }
        });
    },

    /**
     * Get player rank among all players
     */
    getPlayerRank(playerId) {
        const players = Storage.getPlayers();
        const sorted = [...players].sort((a, b) => {
            if (b.progress !== a.progress) return b.progress - a.progress;
            if (b.xp !== a.xp) return b.xp - a.xp;
            return b.streak - a.streak;
        });

        return sorted.findIndex(p => p.id === playerId) + 1;
    },

    /**
     * Get all players sorted by rank
     */
    getRankedPlayers() {
        const players = Storage.getPlayers();
        return [...players].sort((a, b) => {
            if (b.progress !== a.progress) return b.progress - a.progress;
            if (b.xp !== a.xp) return b.xp - a.xp;
            return b.streak - a.streak;
        });
    }
};
