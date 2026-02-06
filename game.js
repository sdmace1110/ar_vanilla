// Game State
let gameState = {
    round: 1,
    player: {
        hp: 100,
        maxHp: 100,
        attack: 20,
        defending: false,
        specialCooldown: 0
    },
    enemy: {
        hp: 100,
        maxHp: 100,
        attack: 15
    },
    gameOver: false
};

// DOM Elements
const elements = {
    playerHp: document.getElementById('player-hp'),
    playerHealth: document.getElementById('player-health'),
    playerAttack: document.getElementById('player-attack'),
    enemyHp: document.getElementById('enemy-hp'),
    enemyHealth: document.getElementById('enemy-health'),
    enemyAttack: document.getElementById('enemy-attack'),
    roundNumber: document.getElementById('round-number'),
    gameStatus: document.getElementById('game-status'),
    logContent: document.getElementById('log-content'),
    attackBtn: document.getElementById('attack-btn'),
    defendBtn: document.getElementById('defend-btn'),
    specialBtn: document.getElementById('special-btn'),
    resetBtn: document.getElementById('reset-btn')
};

// Initialize game
function initGame() {
    gameState = {
        round: 1,
        player: {
            hp: 100,
            maxHp: 100,
            attack: 20,
            defending: false,
            specialCooldown: 0
        },
        enemy: {
            hp: 100,
            maxHp: 100,
            attack: 15
        },
        gameOver: false
    };
    
    updateUI();
    elements.logContent.innerHTML = '';
    addLog('Game started! Choose your action wisely.', 'system');
    enableActionButtons();
}

// Update UI
function updateUI() {
    // Player
    elements.playerHp.textContent = Math.max(0, gameState.player.hp);
    elements.playerHealth.style.width = `${(gameState.player.hp / gameState.player.maxHp) * 100}%`;
    elements.playerAttack.textContent = gameState.player.attack;
    
    // Enemy
    elements.enemyHp.textContent = Math.max(0, gameState.enemy.hp);
    elements.enemyHealth.style.width = `${(gameState.enemy.hp / gameState.enemy.maxHp) * 100}%`;
    elements.enemyAttack.textContent = gameState.enemy.attack;
    
    // Round
    elements.roundNumber.textContent = gameState.round;
    
    // Special button cooldown
    if (gameState.player.specialCooldown > 0) {
        elements.specialBtn.textContent = `✨ Special (${gameState.player.specialCooldown})`;
        elements.specialBtn.disabled = true;
    } else {
        elements.specialBtn.textContent = '✨ Special Attack';
        elements.specialBtn.disabled = false;
    }
}

// Add log entry
function addLog(message, type = 'system') {
    const logEntry = document.createElement('div');
    logEntry.className = `log-entry ${type}`;
    logEntry.textContent = message;
    elements.logContent.insertBefore(logEntry, elements.logContent.firstChild);
}

// Disable action buttons
function disableActionButtons() {
    elements.attackBtn.disabled = true;
    elements.defendBtn.disabled = true;
    elements.specialBtn.disabled = true;
}

// Enable action buttons
function enableActionButtons() {
    if (!gameState.gameOver) {
        elements.attackBtn.disabled = false;
        elements.defendBtn.disabled = false;
        elements.specialBtn.disabled = gameState.player.specialCooldown > 0;
    }
}

// Player attack
function playerAttack() {
    if (gameState.gameOver) return;
    
    disableActionButtons();
    gameState.player.defending = false;
    
    const damage = gameState.player.attack + Math.floor(Math.random() * 10);
    gameState.enemy.hp -= damage;
    
    addLog(`You dealt ${damage} damage to the enemy!`, 'player-action');
    elements.gameStatus.textContent = `You attacked for ${damage} damage!`;
    
    updateUI();
    
    setTimeout(() => {
        if (checkGameOver()) return;
        enemyTurn();
    }, 1000);
}

// Player defend
function playerDefend() {
    if (gameState.gameOver) return;
    
    disableActionButtons();
    gameState.player.defending = true;
    
    addLog('You prepare to defend against the next attack!', 'player-action');
    elements.gameStatus.textContent = 'You are defending...';
    
    updateUI();
    
    setTimeout(() => {
        if (checkGameOver()) return;
        enemyTurn();
    }, 1000);
}

// Player special attack
function playerSpecialAttack() {
    if (gameState.gameOver || gameState.player.specialCooldown > 0) return;
    
    disableActionButtons();
    gameState.player.defending = false;
    gameState.player.specialCooldown = 3;
    
    const damage = gameState.player.attack * 2 + Math.floor(Math.random() * 15);
    gameState.enemy.hp -= damage;
    
    addLog(`You unleashed a SPECIAL ATTACK for ${damage} damage!`, 'player-action');
    elements.gameStatus.textContent = `Special Attack! ${damage} damage!`;
    
    updateUI();
    
    setTimeout(() => {
        if (checkGameOver()) return;
        enemyTurn();
    }, 1000);
}

// Enemy turn
function enemyTurn() {
    if (gameState.gameOver) return;
    
    const action = Math.random();
    
    if (action > 0.7) {
        // Enemy special attack
        const damage = Math.floor(gameState.enemy.attack * 1.5 + Math.random() * 10);
        const actualDamage = gameState.player.defending ? Math.floor(damage * 0.3) : damage;
        gameState.player.hp -= actualDamage;
        
        addLog(`Enemy used a powerful attack for ${actualDamage} damage!`, 'enemy-action');
        elements.gameStatus.textContent = `Enemy's powerful attack dealt ${actualDamage} damage!`;
    } else {
        // Normal enemy attack
        const damage = gameState.enemy.attack + Math.floor(Math.random() * 8);
        const actualDamage = gameState.player.defending ? Math.floor(damage * 0.5) : damage;
        gameState.player.hp -= actualDamage;
        
        const defendText = gameState.player.defending ? ' (reduced by defense)' : '';
        addLog(`Enemy attacked for ${actualDamage} damage${defendText}!`, 'enemy-action');
        elements.gameStatus.textContent = `Enemy dealt ${actualDamage} damage!`;
    }
    
    gameState.player.defending = false;
    
    if (gameState.player.specialCooldown > 0) {
        gameState.player.specialCooldown--;
    }
    
    updateUI();
    
    setTimeout(() => {
        if (checkGameOver()) return;
        nextRound();
    }, 1000);
}

// Next round
function nextRound() {
    gameState.round++;
    updateUI();
    elements.gameStatus.textContent = 'Choose your action!';
    enableActionButtons();
}

// Check game over
function checkGameOver() {
    if (gameState.enemy.hp <= 0) {
        gameState.gameOver = true;
        elements.gameStatus.textContent = '🎉 Victory! You defeated the enemy!';
        addLog('You won the battle!', 'system');
        disableActionButtons();
        return true;
    }
    
    if (gameState.player.hp <= 0) {
        gameState.gameOver = true;
        elements.gameStatus.textContent = '💀 Defeat! You were defeated...';
        addLog('You were defeated. Try again!', 'system');
        disableActionButtons();
        return true;
    }
    
    return false;
}

// Event listeners
elements.attackBtn.addEventListener('click', playerAttack);
elements.defendBtn.addEventListener('click', playerDefend);
elements.specialBtn.addEventListener('click', playerSpecialAttack);
elements.resetBtn.addEventListener('click', initGame);

// Initialize on load
initGame();
