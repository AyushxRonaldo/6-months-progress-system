/**
 * Tasks.js - Task Management
 * Handles task lifecycle and state transitions
 */

const Tasks = {
    /**
     * Get all tasks for a player on a given day
     */
    getTasksForDay(playerId, day) {
        return Storage.getTasks(playerId, day);
    },

    /**
     * Add a new task
     */
    addTask(playerId, day, taskName) {
        if (!taskName || taskName.trim() === '') return null;
        return Storage.addTask(playerId, day, taskName.trim());
    },

    /**
     * Cycle task status: white → blue → green → red → white
     */
    cycleTaskStatus(playerId, day, taskId) {
        const tasks = Storage.getTasks(playerId, day);
        const task = tasks.find(t => t.id === taskId);

        if (!task) return;

        const statusCycle = ['white', 'blue', 'green', 'red'];
        const currentIndex = statusCycle.indexOf(task.status);
        const nextIndex = (currentIndex + 1) % statusCycle.length;

        Storage.updateTask(playerId, day, taskId, {
            status: statusCycle[nextIndex]
        });

        // Recalculate player stats
        Players.updatePlayerStats(playerId, day);
    },

    /**
     * Update task name
     */
    editTask(playerId, day, taskId, newName) {
        if (!newName || newName.trim() === '') return;
        Storage.updateTask(playerId, day, taskId, {
            name: newName.trim()
        });
    },

    /**
     * Delete a task
     */
    deleteTask(playerId, day, taskId) {
        Storage.deleteTask(playerId, day, taskId);
        Players.updatePlayerStats(playerId, day);
    },

    /**
     * Get task status count for a day
     */
    getTaskStatusCount(playerId, day) {
        const tasks = Storage.getTasks(playerId, day);
        const counts = {
            white: 0,
            blue: 0,
            green: 0,
            red: 0
        };

        tasks.forEach(task => {
            counts[task.status]++;
        });

        return counts;
    },

    /**
     * Get total XP earned for the day
     */
    getDailyXP(playerId, day) {
        const tasks = Storage.getTasks(playerId, day);
        let totalXP = 0;

        tasks.forEach(task => {
            if (task.status === 'green') totalXP += 10;
            else if (task.status === 'blue') totalXP += 5;
        });

        return totalXP;
    }
};
