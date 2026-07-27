/**
 * Storage.js - Local Storage Management
 * Handles all data persistence and retrieval
 */

const Storage = {
    // Keys
    PLAYERS_KEY: 'ascend_players',
    TASKS_KEY: 'ascend_tasks',
    ACHIEVEMENTS_KEY: 'ascend_achievements',
    CURRENT_DAY_KEY: 'ascend_current_day',
    START_DATE_KEY: 'ascend_start_date',

    /**
     * Initialize storage with default data
     */
    init() {
        if (!this.getPlayers()) {
            this.initializePlayers();
        }
        if (!this.getStartDate()) {
            localStorage.setItem(this.START_DATE_KEY, new Date().toISOString());
        }
        if (!this.getCurrentDay()) {
            localStorage.setItem(this.CURRENT_DAY_KEY, '1');
        }
    },

    /**
     * Initialize default players
     */
    initializePlayers() {
        const defaultPlayers = [
            { id: 1, name: 'Shadowborn', icon: '🌙', progress: 0, xp: 0, level: 1, streak: 0, daysCompleted: 0, longestStreak: 0 },
            { id: 2, name: 'Harsh', icon: '⚡', progress: 0, xp: 0, level: 1, streak: 0, daysCompleted: 0, longestStreak: 0 },
            { id: 3, name: 'Lucky', icon: '🍀', progress: 0, xp: 0, level: 1, streak: 0, daysCompleted: 0, longestStreak: 0 },
            { id: 4, name: 'Atharva', icon: '🎯', progress: 0, xp: 0, level: 1, streak: 0, daysCompleted: 0, longestStreak: 0 }
        ];
        localStorage.setItem(this.PLAYERS_KEY, JSON.stringify(defaultPlayers));
    },

    // Player operations
    getPlayers() {
        const data = localStorage.getItem(this.PLAYERS_KEY);
        return data ? JSON.parse(data) : null;
    },

    setPlayers(players) {
        localStorage.setItem(this.PLAYERS_KEY, JSON.stringify(players));
    },

    getPlayer(playerId) {
        const players = this.getPlayers();
        return players.find(p => p.id === playerId);
    },

    updatePlayer(playerId, updates) {
        const players = this.getPlayers();
        const playerIndex = players.findIndex(p => p.id === playerId);
        if (playerIndex !== -1) {
            players[playerIndex] = { ...players[playerIndex], ...updates };
            this.setPlayers(players);
        }
    },

    // Task operations
    getTasks(playerId, day) {
        const key = `${this.TASKS_KEY}_${playerId}_${day}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    setTasks(playerId, day, tasks) {
        const key = `${this.TASKS_KEY}_${playerId}_${day}`;
        localStorage.setItem(key, JSON.stringify(tasks));
    },

    addTask(playerId, day, taskName) {
        const tasks = this.getTasks(playerId, day);
        const newTask = {
            id: Date.now(),
            name: taskName,
            status: 'white' // white, blue, green, red
        };
        tasks.push(newTask);
        this.setTasks(playerId, day, tasks);
        return newTask;
    },

    updateTask(playerId, day, taskId, updates) {
        const tasks = this.getTasks(playerId, day);
        const taskIndex = tasks.findIndex(t => t.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
            this.setTasks(playerId, day, tasks);
        }
    },

    deleteTask(playerId, day, taskId) {
        const tasks = this.getTasks(playerId, day);
        const filtered = tasks.filter(t => t.id !== taskId);
        this.setTasks(playerId, day, filtered);
    },

    // Day operations
    getCurrentDay() {
        const day = localStorage.getItem(this.CURRENT_DAY_KEY);
        return day ? parseInt(day) : null;
    },

    setCurrentDay(day) {
        localStorage.setItem(this.CURRENT_DAY_KEY, day.toString());
    },

    getStartDate() {
        return localStorage.getItem(this.START_DATE_KEY);
    },

    // Daily stats
    getDailyStats(playerId, day) {
        const key = `ascend_stats_${playerId}_${day}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : { progress: 0, xpEarned: 0, completed: 0, partial: 0, failed: 0 };
    },

    setDailyStats(playerId, day, stats) {
        const key = `ascend_stats_${playerId}_${day}`;
        localStorage.setItem(key, JSON.stringify(stats));
    },

    // Calendar data
    getCalendarData(playerId, day) {
        const key = `ascend_calendar_${playerId}_${day}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    },

    setCalendarData(playerId, day, color) {
        const key = `ascend_calendar_${playerId}_${day}`;
        localStorage.setItem(key, JSON.stringify(color));
    },

    // Achievements
    getAchievements(playerId) {
        const key = `${this.ACHIEVEMENTS_KEY}_${playerId}`;
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : [];
    },

    setAchievements(playerId, achievements) {
        const key = `${this.ACHIEVEMENTS_KEY}_${playerId}`;
        localStorage.setItem(key, JSON.stringify(achievements));
    },

    unlockAchievement(playerId, achievementId) {
        const achievements = this.getAchievements(playerId);
        if (!achievements.find(a => a.id === achievementId)) {
            achievements.push({ id: achievementId, unlockedAt: new Date().toISOString() });
            this.setAchievements(playerId, achievements);
        }
    },

    // Clear all data (for testing)
    clearAll() {
        localStorage.clear();
        this.init();
    }
};

// Initialize storage on load
Storage.init();
