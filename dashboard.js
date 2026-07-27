/**
 * Dashboard.js - Dashboard Rendering and Tab Management
 * Handles player dashboard display and tab switching
 */

const Dashboard = {
    currentPlayerId: null,

    /**
     * Initialize dashboard for a player
     */
    init(playerId) {
        this.currentPlayerId = playerId;
        this.renderPlayerInfo();
        this.renderTasks();
        this.renderStats();
        this.renderCalendar();
        this.renderAchievements();
        this.setupTabListeners();
    },

    /**
     * Render player information header
     */
    renderPlayerInfo() {
        const player = Storage.getPlayer(this.currentPlayerId);
        const rank = Players.getPlayerRank(this.currentPlayerId);
        const currentDay = Storage.getCurrentDay();

        document.getElementById('player-name').textContent = player.name;
        document.getElementById('profile-icon').textContent = player.icon;
        document.getElementById('rank-badge').textContent = `Rank #${rank}`;
        document.getElementById('progress-percent').textContent = `${player.progress}%`;
        document.getElementById('xp-value').textContent = player.xp;
        document.getElementById('level-value').textContent = player.level;
        document.getElementById('streak-value').textContent = `🔥${player.streak}`;
        document.getElementById('progress-fill').style.width = `${player.progress}%`;
    },

    /**
     * Render tasks for today
     */
    renderTasks() {
        const currentDay = Storage.getCurrentDay();
        const tasks = Tasks.getTasksForDay(this.currentPlayerId, currentDay);
        const tasksList = document.getElementById('tasks-list');

        tasksList.innerHTML = '';

        if (tasks.length === 0) {
            tasksList.innerHTML = '<p style="text-align: center; color: #8B949E; padding: 20px;">No tasks yet. Add one to get started!</p>';
            return;
        }

        tasks.forEach(task => {
            const taskElement = document.createElement('div');
            taskElement.className = `task-item ${task.status}`;

            const statusSymbols = { white: '○', blue: '◐', green: '●', red: '✕' };

            taskElement.innerHTML = `
                <span class="task-name">${task.name}</span>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <div class="task-status" onclick="app.cycleTaskStatus(${task.id})" title="Click to cycle status">
                        ${statusSymbols[task.status]}
                    </div>
                    <button class="task-edit-btn" onclick="app.openEditTaskModal(${task.id})">Edit</button>
                </div>
            `;

            tasksList.appendChild(taskElement);
        });
    },

    /**
     * Render statistics tab
     */
    renderStats() {
        const currentDay = Storage.getCurrentDay();
        const stats = Storage.getDailyStats(this.currentPlayerId, currentDay);
        const player = Storage.getPlayer(this.currentPlayerId);

        // Calculate totals across all days
        let totalTasks = 0;
        let totalCompleted = 0;
        let totalPartial = 0;
        let totalFailed = 0;

        for (let day = 1; day <= currentDay; day++) {
            const dayStats = Storage.getDailyStats(this.currentPlayerId, day);
            totalTasks += (dayStats.completed + dayStats.partial + dayStats.failed);
            totalCompleted += dayStats.completed;
            totalPartial += dayStats.partial;
            totalFailed += dayStats.failed;
        }

        const completionRate = totalTasks > 0 ? Math.round((totalCompleted / totalTasks) * 100) : 0;

        document.getElementById('completion-rate').textContent = `${completionRate}%`;
        document.getElementById('total-tasks').textContent = totalTasks;
        document.getElementById('completed-tasks').textContent = totalCompleted;
        document.getElementById('partial-tasks').textContent = totalPartial;
        document.getElementById('failed-tasks').textContent = totalFailed;
        document.getElementById('longest-streak').textContent = `${player.longestStreak || 0} days`;
    },

    /**
     * Render 180-day calendar
     */
    renderCalendar() {
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        for (let day = 1; day <= 180; day++) {
            const dayElement = document.createElement('div');
            const color = Storage.getCalendarData(this.currentPlayerId, day) || 'white';
            dayElement.className = `calendar-day ${color}`;
            dayElement.textContent = day;
            dayElement.title = `Day ${day}: ${color}`;

            calendar.appendChild(dayElement);
        }
    },

    /**
     * Render achievements
     */
    renderAchievements() {
        const achievementsContainer = document.getElementById('achievements');
        achievementsContainer.innerHTML = '';

        const unlockedAchievements = Storage.getAchievements(this.currentPlayerId);
        const unlockedIds = new Set(unlockedAchievements.map(a => a.id));

        const allAchievements = [
            { id: 'first_task', name: 'First Task', icon: '🏆', desc: 'Complete your first task' },
            { id: 'seven_day_streak', name: 'Week Warrior', icon: '🔥', desc: '7 Day Streak' },
            { id: 'fourteen_day_streak', name: 'Two Weeks Strong', icon: '🔥', desc: '14 Day Streak' },
            { id: 'hundred_xp', name: 'Century Mark', icon: '⚡', desc: '100 XP earned' },
            { id: 'level_five', name: 'Rising Star', icon: '⭐', desc: 'Reach Level 5' },
            { id: 'level_ten', name: 'Legend', icon: '👑', desc: 'Reach Level 10' },
            { id: 'perfect_day', name: 'Perfect Day', icon: '💯', desc: '100% completion' }
        ];

        allAchievements.forEach(achievement => {
            const isUnlocked = unlockedIds.has(achievement.id);
            const achievementElement = document.createElement('div');
            achievementElement.className = `achievement ${isUnlocked ? 'unlocked' : 'locked'}`;

            achievementElement.innerHTML = `
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-name">${achievement.name}</div>
                <div class="achievement-desc">${achievement.desc}</div>
            `;

            achievementsContainer.appendChild(achievementElement);
        });
    },

    /**
     * Setup tab switching
     */
    setupTabListeners() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabContents = document.querySelectorAll('.tab-content');

        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all
                tabButtons.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));

                // Add active class to clicked tab
                button.classList.add('active');
                const tabName = button.dataset.tab;
                document.getElementById(`${tabName}-tab`).classList.add('active');
            });
        });
    }
};
