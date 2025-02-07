class WimHofBreathing {
    constructor() {
        this.currentRound = 1;
        this.breathCount = 0;
        this.isBreathing = false;
        this.isPaused = false;
        this.retentionTime = 0;
        this.maxBreaths = 30;
        this.maxRounds = 3;

        // DOM Elements
        this.startBtn = document.getElementById('startBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.resetBtn = document.getElementById('resetBtn');
        this.instruction = document.getElementById('instruction');
        this.breathCounter = document.getElementById('breath-counter');
        this.currentRoundElement = document.getElementById('current-round');
        this.timer = document.getElementById('timer');
        this.breathingCircle = document.querySelector('.breathing-circle');
        this.progressBar = document.getElementById('progress-bar');

        // Audio setup
        this.breathInAudio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV');
        this.breathOutAudio = new Audio('data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV6urq6urq6urq6urq6urq6urq6urq6urq6v////////////////////////////////8AAAAATGF2YzU4LjU0AAAAAAAAAAAAAAAAJAAAAAAAAAAAASDs90hvAAAAAAAAAAAAAAAAAAAA//MUZAAAAAGkAAAAAAAAA0gAAAAATEFN//MUZAMAAAGkAAAAAAAAA0gAAAAARTMu//MUZAYAAAGkAAAAAAAAA0gAAAAAOTku//MUZAkAAAGkAAAAAAAAA0gAAAAANVVV');
        
        // Event listeners
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
    }

    async start() {
        if (this.isPaused) {
            this.isPaused = false;
            this.startBtn.disabled = true;
            this.pauseBtn.disabled = false;
            return;
        }

        this.isBreathing = true;
        this.startBtn.disabled = true;
        this.pauseBtn.disabled = false;
        this.resetBtn.disabled = false;

        while (this.currentRound <= this.maxRounds && this.isBreathing) {
            await this.performBreathingRound();
            if (this.currentRound < this.maxRounds) {
                this.currentRound++;
                this.currentRoundElement.textContent = this.currentRound;
            }
        }

        if (this.currentRound > this.maxRounds) {
            this.complete();
        }
    }

    async performBreathingRound() {
        this.breathCount = 0;
        
        // Perform 30 breaths
        while (this.breathCount < this.maxBreaths && this.isBreathing && !this.isPaused) {
            await this.breathingCycle();
            this.breathCount++;
            this.breathCounter.textContent = this.breathCount;
            this.updateProgress();
        }

        if (!this.isPaused && this.isBreathing) {
            // Final exhale and retention
            await this.performRetention();
        }
    }

    async breathingCycle() {
        return new Promise(resolve => {
            // Breath in
            this.instruction.textContent = "Breathe In";
            this.breathingCircle.classList.add('inhale');
            this.breathInAudio.play();
            
            setTimeout(() => {
                // Breath out
                this.instruction.textContent = "Breathe Out";
                this.breathingCircle.classList.remove('inhale');
                this.breathingCircle.classList.add('exhale');
                this.breathOutAudio.play();
                
                setTimeout(() => {
                    this.breathingCircle.classList.remove('exhale');
                    resolve();
                }, 1500);
            }, 1500);
        });
    }

    async performRetention() {
        this.instruction.textContent = "Exhale and Hold";
        this.breathingCircle.classList.remove('inhale', 'exhale');
        
        let seconds = 0;
        return new Promise(resolve => {
            const countInterval = setInterval(() => {
                if (this.isPaused) {
                    clearInterval(countInterval);
                    resolve();
                    return;
                }

                seconds++;
                this.timer.textContent = `${seconds} seconds`;
                
                if (seconds >= 15) {
                    clearInterval(countInterval);
                    this.instruction.textContent = "Take a deep breath and hold for 15 seconds";
                    setTimeout(() => {
                        this.timer.textContent = "Round Complete";
                        resolve();
                    }, 15000);
                }
            }, 1000);
        });
    }

    pause() {
        this.isPaused = true;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.instruction.textContent = "Paused";
    }

    reset() {
        this.isBreathing = false;
        this.isPaused = false;
        this.currentRound = 1;
        this.breathCount = 0;
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.resetBtn.disabled = true;
        this.instruction.textContent = "Press Start when ready";
        this.breathCounter.textContent = "0";
        this.currentRoundElement.textContent = "1";
        this.timer.textContent = "Get Ready";
        this.progressBar.style.width = "0%";
        this.breathingCircle.classList.remove('inhale', 'exhale');
    }

    complete() {
        this.instruction.textContent = "Exercise Complete!";
        this.timer.textContent = "Great Job!";
        this.startBtn.disabled = false;
        this.pauseBtn.disabled = true;
        this.isBreathing = false;
    }

    updateProgress() {
        const totalBreaths = this.maxBreaths * this.maxRounds;
        const completedBreaths = ((this.currentRound - 1) * this.maxBreaths) + this.breathCount;
        const progress = (completedBreaths / totalBreaths) * 100;
        this.progressBar.style.width = `${progress}%`;
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new WimHofBreathing();
}); 