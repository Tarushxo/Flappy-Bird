document.addEventListener('DOMContentLoaded', () => {
    const bird = document.getElementById('bird');
    const ground = document.querySelector('.ground');
    const pipe = document.querySelector('.pipe');
    const pipeTop = document.querySelector('.pipe-top');
    const gameOverOverlay = document.getElementById('game-over-overlay');
    const restartButton = document.getElementById('restart-button');
    const pipeBottom = document.querySelector('.pipe-bottom');
    const scoreDisplay = document.getElementById('score-display');
    const finalScore = document.getElementById('final-score');
    const dropSound = new Audio('audio/dropSound.mp3');
    const flapSound = new Audio('audio/flapSound2.mp3');
    const levelEnd = new Audio('audio/levelEnd.mp3');
    const reward = new Audio('audio/reward2.mp3');

    let birdLeft = 50;
    let birdBottom = 300;
    let velocityY = 0;
    const gravity = 0.5 ;
    const jumpHeight = 10;
    let pipeLeft = 400;
    let isGameOver = false;
    let gameTimerId = null; 
    let score = 0;
    let scored = false;

    function gameLoop() {
        velocityY -= gravity;
        birdBottom += velocityY;
        bird.style.bottom = birdBottom + 'px';
        bird.style.left = birdLeft + 'px';

        pipeLeft -= 3;
        pipe.style.left = pipeLeft + 'px';
        

        if (pipeLeft < -60) {
            pipeLeft = 400;
            let randomTopHeight = Math.random() * 200 + 150;
            pipeTop.style.height = randomTopHeight + 'px';
            scored = false;
        }

         if (pipeLeft < birdLeft && !scored) {
            score++;
            scoreDisplay.textContent = score;
            reward.play();
            scored = true; 
        }

        const birdBox = bird.getBoundingClientRect();
        const topPipeBox = pipeTop.getBoundingClientRect();
        const bottomPipeBox = pipeBottom.getBoundingClientRect();
        const groundBox = ground.getBoundingClientRect();

        const topPipeCollision = (birdBox.right > topPipeBox.left && birdBox.left < topPipeBox.right && birdBox.bottom > topPipeBox.top && birdBox.top < topPipeBox.bottom);
        const bottomPipeCollision = (birdBox.right > bottomPipeBox.left && birdBox.left < bottomPipeBox.right && birdBox.bottom > bottomPipeBox.top && birdBox.top < bottomPipeBox.bottom);
        const groundCollision = birdBox.bottom >= groundBox.top;

        if (topPipeCollision || bottomPipeCollision || groundCollision) {
            endGame();
        }
    }

    function startGame() {
        resetGame();
        dropSound.play();
        gameTimerId = setInterval(gameLoop, 20);
    }

    function endGame() {
        clearInterval(gameTimerId);
        gameTimerId = null; 
        isGameOver = true;
        levelEnd.play();
        gameOverOverlay.classList.add('visible'); 
        finalScore.textContent = score;
    }

    function resetGame() {
        gameOverOverlay.classList.remove('visible');
        isGameOver = false;
        birdBottom = 300;
        velocityY = 0;
        pipeLeft = 400;
        pipeTop.style.height = '250px'; 

        bird.style.bottom = birdBottom + 'px';
        pipe.style.left = pipeLeft + 'px';

        score = 0;
        scoreDisplay.textContent = score;
        scored = false;

        restartButton.disabled = false;
        restartButton.textContent = 'Restart';
    }

    function flap() {
        if (isGameOver) return;
        flapSound.play();
        flapSound.currentTime = 0;
        velocityY = jumpHeight;
        

    }

    document.addEventListener('keydown', (e) => {
        if (isGameOver) return; 
        if (e.code === 'Space') {
            if (!gameTimerId) { 
                startGame();
            }
            flap();
            e.preventDefault();
        }
    });

    document.addEventListener('touchstart', () => {
        if (isGameOver) return; 
        if (!gameTimerId) { 
        startGame();
    }
    flap();
});
    restartButton.addEventListener('click', () =>{
        restartButton.disabled = true;
        restartButton.textContent = 'Restarting...';
        setTimeout(startGame , 4000);
    });

});
            
        