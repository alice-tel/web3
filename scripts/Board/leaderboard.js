import { API_BASE_URL } from '../config.js';

class Leaderboard {
    constructor() {
        this.scoreListElement = document.querySelector('.score__list');
        this.playtimeElement = document.querySelector('.playtime__time');
        this.init();
    }

    async init() {
        await this.loadLeaderboardData();
        // refresh the leaderboard every 30 seconds, change if needed
        setInterval(() => this.loadLeaderboardData(), 30000);
    }

    async loadLeaderboardData() {
        try {
            const [topScoresResponse, allScoresResponse] = await Promise.all([
                fetch(`${API_BASE_URL}/memory/top-scores`),
                fetch(`${API_BASE_URL}/memory/scores`)
            ]);

            if (!topScoresResponse.ok || !allScoresResponse.ok) {
                throw new Error('Failed to fetch leaderboard data');
            }

            const topScoresData = await topScoresResponse.json();
            const allScoresData = await allScoresResponse.json();

            this.updateTopFive(topScoresData);
            this.updateAveragePlaytime(allScoresData);

        } catch (error) {
            console.error('Error loading leaderboard data:', error);
            this.showError();
        }
    }

    updateTopFive(topScoresData) {
        if (!this.scoreListElement) return;

        this.scoreListElement.innerHTML = '';

        const top5 = topScoresData.slice(0, 5);

        for (let i = 0; i < 5; i++) {
            const listItem = document.createElement('li');
            listItem.className = 'score__item';

            if (i < top5.length && top5[i]) {
                const player = top5[i];   
                // if user scores can be added when not logged in, they will be rendered as anonymous.              
                const username = player.username || 'Anonymous';
                const scoreTime = player.score || player.bestScore || player.best_score || player.time || 0;
                const formattedTime = this.formatTime(scoreTime);
                
                listItem.textContent = `${i + 1}. ${username} - ${formattedTime}`;
                
                if (i === 0) {
                    listItem.style.backgroundColor = '#FFD700'; 
                    listItem.style.color = '#000';
                    listItem.style.padding = '5px';
                    listItem.style.borderRadius = '3px';
                } else if (i === 1) {
                    listItem.style.backgroundColor = '#C0C0C0'; 
                    listItem.style.color = '#000';
                    listItem.style.padding = '5px';
                    listItem.style.borderRadius = '3px';
                } else if (i === 2) {
                    listItem.style.backgroundColor = '#CD7F32'; 
                    listItem.style.color = '#000';
                    listItem.style.padding = '5px';
                    listItem.style.borderRadius = '3px';
                }
                
            } else {
                listItem.textContent = `${i + 1}. -`;
                listItem.style.color = '#666';
            }

            this.scoreListElement.appendChild(listItem);
        }
    }

    updateAveragePlaytime(allScoresData) {
        if (!this.playtimeElement) return;

        try {
            let totalTime = 0;
            let totalGames = 0;


            allScoresData.forEach(player => {
                
                const avgScore = player.averageScore || player.average_score || player.avgScore || player.score;
                const gameCount = player.gameCount || player.game_count || player.games || 1;
                
                
                if (avgScore && typeof avgScore === 'number' && avgScore > 0) {
                    totalTime += avgScore * gameCount;
                    totalGames += gameCount;
                }
            });


            const averageTime = totalGames > 0 ? totalTime / totalGames : 0;
            const formattedAverage = this.formatTime(averageTime);
            
            
            this.playtimeElement.textContent = formattedAverage;

        } catch (error) {
            console.error('Error calculating average playtime:', error);
            this.playtimeElement.textContent = 'Error loading data';
        }
    }

    formatTime(seconds) {
        
        if (seconds === null || seconds === undefined) {
            return '0s';
        }
        
        const numSeconds = parseFloat(seconds);
        
        if (isNaN(numSeconds) || numSeconds <= 0) {
            return '0s';
        }
        
        const roundedSeconds = Math.round(numSeconds);
        
        if (roundedSeconds < 60) {
            return `${roundedSeconds}s`;
        } else {
            const mins = Math.floor(roundedSeconds / 60);
            const secs = roundedSeconds % 60;
            return `${mins}m ${secs}s`;
        }
    }

    showError() {
        if (this.scoreListElement) {
            this.scoreListElement.innerHTML = '<li class="score__item">Error loading scores</li>';
        }
        if (this.playtimeElement) {
            this.playtimeElement.textContent = 'Error loading data';
        }
    }

    async refresh() {
        await this.loadLeaderboardData();
    }
}

export default Leaderboard;

document.addEventListener('DOMContentLoaded', () => {
    window.leaderboard = new Leaderboard();
});