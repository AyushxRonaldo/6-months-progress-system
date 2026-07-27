/**
 * Leaderboard.js - Leaderboard Display and Rendering
 * Handles rendering player cards with progress bars
 */

const Leaderboard = {
    /**
     * Render the home page leaderboard
     */
    render() {
        const leaderboardContainer = document.getElementById('leaderboard');
        leaderboardContainer.innerHTML = '';

        const rankedPlayers = Players.getRankedPlayers();
        const medals = ['🥇', '🥈', '🥉'];

        rankedPlayers.forEach((player, index) => {
            const card = document.createElement('div');
            card.className = 'player-card';
            card.onclick = () => app.showDashboard(player.id);

            const rank = index + 1;
            const medal = medals[index] || `${rank}️⃣`;

            card.innerHTML = `
                <div class="player-card-header">
                    <div class="player-card-icon">${player.icon}</div>
                    <div>
                        <div class="player-card-name">${player.name}</div>
                        <div class="player-card-rank">${medal} Rank #${rank}</div>
                    </div>
                </div>

                <div class="progress-bar-vertical">
                    <div class="progress-bar-vertical-fill" style="height: ${player.progress}%"></div>
                </div>

                <div class="player-card-stats">
                    <div class="stat-item">
                        <div class="stat-item-value">${player.progress}%</div>
                        <div class="stat-item-label">Progress</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-item-value">${player.xp}</div>
                        <div class="stat-item-label">XP</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-item-value">L${player.level}</div>
                        <div class="stat-item-label">Level</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-item-value">🔥${player.streak}</div>
                        <div class="stat-item-label">Streak</div>
                    </div>
                </div>

                <button class="player-card-button" onclick="event.stopPropagation(); app.showDashboard(${player.id})">
                    Dashboard
                </button>
            `;

            leaderboardContainer.appendChild(card);
        });
    },

    /**
     * Update a single player card
     */
    updatePlayerCard(playerId) {
        // Re-render the entire leaderboard for simplicity
        this.render();
    }
};
