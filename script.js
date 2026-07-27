/**
 * Script.js - Main Application Logic
 * Orchestrates the entire application
 */

const app = {
    currentView: 'home', // 'home' or 'dashboard'
    currentEditTaskId: null,

    /**
     * Initialize the application
     */
    init() {
        Storage.init();
        this.updateDayCounter();
        this.showHomePage();

        // Add event listeners for modals
        document.addEventListener('click', (e) => {
            if (e.target.id === 'add-task-modal' || e.target.id === 'edit-task-modal') {
                e.target.classList.remove('active');
            }
        });
    },

    /**
     * Update day counter
     */
    updateDayCounter() {
        const currentDay = Storage.getCurrentDay();
        document.getElementById('day-display').textContent = `Day ${currentDay} / 180`;
    },

    /**
     * Show home page with leaderboard
     */
    showHomePage() {
        document.getElementById('home-page').classList.add('active');
        document.getElementById('dashboard-page').classList.remove('active');
        this.currentView = 'home';
        Leaderboard.render();
    },

    /**
     * Show dashboard for a specific player
     */
    showDashboard(playerId) {
        document.getElementById('home-page').classList.remove('active');
        document.getElementById('dashboard-page').classList.add('active');
        this.currentView = 'dashboard';
        Dashboard.init(playerId);
    },

    /**
     * Open add task modal
     */
    openAddTaskModal() {
        const modal = document.getElementById('add-task-modal');
        modal.classList.add('active');
        document.getElementById('task-name-input').focus();
        document.getElementById('task-name-input').value = '';
    },

    /**
     * Close add task modal
     */
    closeAddTaskModal() {
        const modal = document.getElementById('add-task-modal');
        modal.classList.remove('active');
    },

    /**
     * Add a new task
     */
    addTask() {
        const input = document.getElementById('task-name-input');
        const taskName = input.value.trim();

        if (!taskName) {
            alert('Please enter a task name');
            return;
        }

        const currentDay = Storage.getCurrentDay();
        Tasks.addTask(Dashboard.currentPlayerId, currentDay, taskName);

        // Update dashboard and leaderboard
        Dashboard.renderTasks();
        Leaderboard.updatePlayerCard(Dashboard.currentPlayerId);

        this.closeAddTaskModal();
    },

    /**
     * Open edit task modal
     */
    openEditTaskModal(taskId) {
        this.currentEditTaskId = taskId;
        const currentDay = Storage.getCurrentDay();
        const tasks = Tasks.getTasksForDay(Dashboard.currentPlayerId, currentDay);
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            document.getElementById('task-edit-input').value = task.name;
            const modal = document.getElementById('edit-task-modal');
            modal.classList.add('active');
            document.getElementById('task-edit-input').focus();
        }
    },

    /**
     * Close edit task modal
     */
    closeEditTaskModal() {
        const modal = document.getElementById('edit-task-modal');
        modal.classList.remove('active');
        this.currentEditTaskId = null;
    },

    /**
     * Save edited task
     */
    saveEditTask() {
        const newName = document.getElementById('task-edit-input').value.trim();

        if (!newName) {
            alert('Please enter a task name');
            return;
        }

        const currentDay = Storage.getCurrentDay();
        Tasks.editTask(Dashboard.currentPlayerId, currentDay, this.currentEditTaskId, newName);

        Dashboard.renderTasks();
        this.closeEditTaskModal();
    },

    /**
     * Delete task
     */
    deleteTask() {
        if (!confirm('Are you sure you want to delete this task?')) {
            return;
        }

        const currentDay = Storage.getCurrentDay();
        Tasks.deleteTask(Dashboard.currentPlayerId, currentDay, this.currentEditTaskId);

        Dashboard.renderTasks();
        Leaderboard.updatePlayerCard(Dashboard.currentPlayerId);
        this.closeEditTaskModal();
    },

    /**
     * Cycle task status
     */
    cycleTaskStatus(taskId) {
        const currentDay = Storage.getCurrentDay();
        Tasks.cycleTaskStatus(Dashboard.currentPlayerId, currentDay, taskId);

        // Update all dashboard views
        Dashboard.renderTasks();
        Dashboard.renderPlayerInfo();
        Dashboard.renderStats();
        Dashboard.renderCalendar();
        Dashboard.renderAchievements();

        // Update leaderboard
        Leaderboard.updatePlayerCard(Dashboard.currentPlayerId);
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});