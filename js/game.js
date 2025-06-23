/**
 * Super Mario Single Level Pro - Complete Game
 */

class MarioGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Disable image smoothing for pixel art
        this.ctx.imageSmoothingEnabled = false;
        
        // Game state
        this.gameState = 'playing'; // playing, paused, gameOver, victory
        this.score = 0;
        this.coinsCollected = 0; // Separate counter for collected coins
        this.lives = 3;
        this.time = 300;
        this.gameSpeed = 1;
        
        // World settings
        this.gravity = 0.8;
        this.friction = 0.85;
        this.worldWidth = 3200; // Large single level
        this.worldHeight = 576;
        
        // Camera
        this.camera = {
            x: 0,
            y: 0,
            target: null,
            smoothing: 0.1
        };
        
        // Input
        this.keys = {};
        this.mobileControls = {
            left: false,
            right: false,
            jump: false,
            run: false
        };
        
        // Game objects
        this.player = null;
        this.enemies = [];
        this.coins = [];
        this.powerUps = [];
        this.particles = [];
        this.platforms = [];
        
        // Audio (simple beep sounds)
        this.audioContext = null;
        this.sounds = {};
        
        this.init();
    }
    
    init() {
        this.setupInput();
        this.setupAudio();
        this.createLevel();
        this.createPlayer();
        this.gameLoop();
        
        console.log('🍄 Mario Single Level Pro - Game Started!');
    }
    
    setupInput() {
        // Keyboard
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            if (e.code === 'KeyP') this.togglePause();
            e.preventDefault();
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Mobile controls
        const setupMobileBtn = (id, action) => {
            const btn = document.getElementById(id);
            if (btn) {
                btn.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.mobileControls[action] = true;
                });
                btn.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    this.mobileControls[action] = false;
                });
                btn.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    this.mobileControls[action] = true;
                });
                btn.addEventListener('mouseup', (e) => {
                    e.preventDefault();
                    this.mobileControls[action] = false;
                });
            }
        };
        
        setupMobileBtn('leftBtn', 'left');
        setupMobileBtn('rightBtn', 'right');
        setupMobileBtn('jumpBtn', 'jump');
        setupMobileBtn('runBtn', 'run');
    }
    
    setupAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            console.warn('Audio not supported');
        }
    }
    
    playSound(frequency, duration = 0.1, type = 'square') {
        if (!this.audioContext) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = type;
        
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    }
    
    createLevel() {
        // Platforms - creating a rich, varied level
        this.platforms = [
            // Starting area
            { x: 0, y: 500, width: 300, height: 76, type: 'ground' },
            { x: 400, y: 450, width: 128, height: 32, type: 'platform' },
            { x: 600, y: 400, width: 96, height: 32, type: 'platform' },
            
            // Mid section with gaps
            { x: 800, y: 500, width: 200, height: 76, type: 'ground' },
            { x: 1100, y: 400, width: 128, height: 32, type: 'platform' },
            { x: 1300, y: 350, width: 96, height: 32, type: 'platform' },
            { x: 1500, y: 300, width: 128, height: 32, type: 'platform' },
            
            // Underground section
            { x: 1700, y: 500, width: 400, height: 76, type: 'ground' },
            { x: 1800, y: 400, width: 64, height: 32, type: 'platform' },
            { x: 1950, y: 350, width: 64, height: 32, type: 'platform' },
            
            // Final castle area
            { x: 2200, y: 500, width: 600, height: 76, type: 'ground' },
            { x: 2300, y: 400, width: 96, height: 32, type: 'platform' },
            { x: 2500, y: 350, width: 128, height: 32, type: 'platform' },
            { x: 2700, y: 300, width: 96, height: 32, type: 'platform' },
            
            // Victory platform
            { x: 2900, y: 200, width: 200, height: 32, type: 'victory' }
        ];
        
        this.createEnemies();
        this.createCoins();
        this.createPowerUps();
    }
    
    createEnemies() {
        this.enemies = [
            // Goombas
            { x: 450, y: 418, width: 32, height: 32, type: 'goomba', vx: -1, health: 1, direction: -1 },
            { x: 650, y: 368, width: 32, height: 32, type: 'goomba', vx: -1, health: 1, direction: -1 },
            { x: 850, y: 468, width: 32, height: 32, type: 'goomba', vx: 1, health: 1, direction: 1 },
            { x: 1150, y: 368, width: 32, height: 32, type: 'goomba', vx: -1, health: 1, direction: -1 },
            
            // Flying enemies
            { x: 1400, y: 200, width: 32, height: 32, type: 'fly', vx: -2, vy: 0, health: 1, hoverY: 200, hoverRange: 50, hoverTimer: 0 },
            { x: 1600, y: 150, width: 32, height: 32, type: 'fly', vx: 2, vy: 0, health: 1, hoverY: 150, hoverRange: 40, hoverTimer: Math.PI },
            
            // Boss enemy
            { x: 2400, y: 368, width: 48, height: 48, type: 'boss', vx: 0, health: 3, maxHealth: 3, attackTimer: 0, direction: 1 }
        ];
    }
    
    createCoins() {
        this.coins = [
            // Coin trails
            { x: 420, y: 400, collected: false, bobTimer: 0 },
            { x: 450, y: 380, collected: false, bobTimer: 0.5 },
            { x: 480, y: 400, collected: false, bobTimer: 1 },
            
            { x: 620, y: 350, collected: false, bobTimer: 0 },
            { x: 650, y: 330, collected: false, bobTimer: 0.3 },
            { x: 680, y: 350, collected: false, bobTimer: 0.6 },
            
            // Hidden coins
            { x: 1120, y: 350, collected: false, bobTimer: 0 },
            { x: 1150, y: 330, collected: false, bobTimer: 0.2 },
            { x: 1180, y: 350, collected: false, bobTimer: 0.4 },
            
            // High value coins
            { x: 1320, y: 300, collected: false, bobTimer: 0 },
            { x: 1520, y: 250, collected: false, bobTimer: 0.1 },
            
            // Final area coins
            { x: 2320, y: 350, collected: false, bobTimer: 0 },
            { x: 2520, y: 300, collected: false, bobTimer: 0.3 },
            { x: 2720, y: 250, collected: false, bobTimer: 0.6 },
            
            // Victory coins
            { x: 2950, y: 150, collected: false, bobTimer: 0 },
            { x: 2980, y: 130, collected: false, bobTimer: 0.2 },
            { x: 3010, y: 150, collected: false, bobTimer: 0.4 }
        ];
    }
    
    createPowerUps() {
        this.powerUps = [
            { x: 500, y: 400, type: 'mushroom', collected: false, bobTimer: 0 },
            { x: 1200, y: 350, type: 'fire', collected: false, bobTimer: 0 },
            { x: 1800, y: 450, type: 'star', collected: false, bobTimer: 0 },
            { x: 2600, y: 300, type: 'life', collected: false, bobTimer: 0 }
        ];
    }
    
    createPlayer() {
        this.player = {
            x: 50,
            y: 400,
            width: 32,
            height: 32,
            vx: 0,
            vy: 0,
            grounded: false,
            direction: 1,
            
            // Abilities
            canDoubleJump: false,
            hasDoubleJump: false,
            canShootFire: false,
            isInvincible: false,
            invincibleTimer: 0,
            
            // Animation
            animFrame: 0,
            animTimer: 0,
            animSpeed: 0.2,
            
            // Power level
            powerLevel: 0, // 0: small, 1: big, 2: fire
            
            // Health
            health: 1,
            
            // Movement properties
            speed: 5,
            jumpPower: 15,
            maxSpeed: 8
        };
        
        this.camera.target = this.player;
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.updateTimer();
        this.updatePlayer();
        this.updateEnemies();
        this.updateCoins();
        this.updatePowerUps();
        this.updateParticles();
        this.updateCamera();
        this.checkCollisions();
        this.checkVictory();
    }
    
    updateTimer() {
        this.time -= 1/60; // Assuming 60 FPS
        if (this.time <= 0) {
            this.time = 0;
            this.gameOver('Time Up!');
        }
    }
    
    updatePlayer() {
        const player = this.player;
        
        // Input handling
        let moveLeft = this.keys['ArrowLeft'] || this.keys['KeyA'] || this.mobileControls.left;
        let moveRight = this.keys['ArrowRight'] || this.keys['KeyD'] || this.mobileControls.right;
        let jump = this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW'] || this.mobileControls.jump;
        let run = this.keys['ShiftLeft'] || this.keys['ShiftRight'] || this.mobileControls.run;
        
        // Horizontal movement
        if (moveLeft) {
            player.vx -= player.speed * 0.1;
            player.direction = -1;
        }
        if (moveRight) {
            player.vx += player.speed * 0.1;
            player.direction = 1;
        }
        
        // Apply friction
        player.vx *= this.friction;
        
        // Speed limit
        let maxSpeed = run ? player.maxSpeed * 1.5 : player.maxSpeed;
        player.vx = Math.max(-maxSpeed, Math.min(maxSpeed, player.vx));
        
        // Jumping
        if (jump && player.grounded) {
            player.vy = -player.jumpPower;
            player.grounded = false;
            this.playSound(440, 0.1); // Jump sound
        } else if (jump && player.canDoubleJump && player.hasDoubleJump) {
            player.vy = -player.jumpPower * 0.8;
            player.hasDoubleJump = false;
            this.playSound(550, 0.1); // Double jump sound
        }
        
        // Gravity
        if (!player.grounded) {
            player.vy += this.gravity;
        }
        
        // Update position
        player.x += player.vx;
        player.y += player.vy;
        
        // World boundaries
        if (player.x < 0) player.x = 0;
        if (player.x > this.worldWidth - player.width) player.x = this.worldWidth - player.width;
        
        // Fall death
        if (player.y > this.worldHeight) {
            this.playerDeath();
        }
        
        // Platform collision
        this.checkPlayerPlatformCollision();
        
        // Update invincibility
        if (player.isInvincible) {
            player.invincibleTimer--;
            if (player.invincibleTimer <= 0) {
                player.isInvincible = false;
            }
        }
        
        // Animation
        player.animTimer += 0.1;
        if (Math.abs(player.vx) > 0.1) {
            player.animFrame = Math.floor(player.animTimer * 10) % 3;
        } else {
            player.animFrame = 0;
        }
    }
    
    checkPlayerPlatformCollision() {
        const player = this.player;
        player.grounded = false;
        
        this.platforms.forEach(platform => {
            // Check collision
            if (player.x + player.width > platform.x &&
                player.x < platform.x + platform.width &&
                player.y + player.height > platform.y &&
                player.y < platform.y + platform.height) {
                
                // Landing on top
                if (player.vy > 0 && player.y < platform.y) {
                    player.y = platform.y - player.height;
                    player.vy = 0;
                    player.grounded = true;
                    player.hasDoubleJump = player.canDoubleJump;
                }
                // Hitting from below
                else if (player.vy < 0 && player.y > platform.y) {
                    player.y = platform.y + platform.height;
                    player.vy = 0;
                }
                // Side collision
                else if (player.vx > 0) {
                    player.x = platform.x - player.width;
                    player.vx = 0;
                } else if (player.vx < 0) {
                    player.x = platform.x + platform.width;
                    player.vx = 0;
                }
            }
        });
    }
    
    updateEnemies() {
        this.enemies.forEach((enemy, index) => {
            if (enemy.health <= 0) {
                this.enemies.splice(index, 1);
                this.addScore(enemy.type === 'boss' ? 1000 : 200);
                this.createParticles(enemy.x + enemy.width/2, enemy.y + enemy.height/2, '#ff0000', 8);
                return;
            }
            
            switch (enemy.type) {
                case 'goomba':
                    this.updateGoomba(enemy);
                    break;
                case 'fly':
                    this.updateFlyingEnemy(enemy);
                    break;
                case 'boss':
                    this.updateBoss(enemy);
                    break;
            }
        });
    }
    
    updateGoomba(enemy) {
        // Simple AI - move back and forth
        enemy.x += enemy.vx;
        
        // Check platform edges
        let onPlatform = false;
        this.platforms.forEach(platform => {
            if (enemy.x + enemy.width > platform.x &&
                enemy.x < platform.x + platform.width &&
                enemy.y + enemy.height >= platform.y &&
                enemy.y + enemy.height <= platform.y + platform.height + 10) {
                onPlatform = true;
                enemy.y = platform.y - enemy.height;
            }
        });
        
        // Turn around at edges
        if (!onPlatform || enemy.x <= 0 || enemy.x >= this.worldWidth - enemy.width) {
            enemy.vx *= -1;
            enemy.direction *= -1;
        }
    }
    
    updateFlyingEnemy(enemy) {
        enemy.x += enemy.vx;
        enemy.hoverTimer += 0.1;
        enemy.y = enemy.hoverY + Math.sin(enemy.hoverTimer) * enemy.hoverRange;
        
        // Turn around at boundaries
        if (enemy.x <= 0 || enemy.x >= this.worldWidth - enemy.width) {
            enemy.vx *= -1;
        }
    }
    
    updateBoss(enemy) {
        enemy.attackTimer++;
        
        // Simple boss AI
        if (enemy.attackTimer > 120) { // 2 seconds at 60fps
            enemy.attackTimer = 0;
            
            // Move towards player
            if (this.player.x < enemy.x) {
                enemy.vx = -2;
                enemy.direction = -1;
            } else {
                enemy.vx = 2;
                enemy.direction = 1;
            }
        }
        
        enemy.x += enemy.vx;
        enemy.vx *= 0.95; // Slow down
        
        // Keep boss on platform
        if (enemy.x < 2200) enemy.x = 2200;
        if (enemy.x > 2750) enemy.x = 2750;
    }
    
    updateCoins() {
        this.coins.forEach(coin => {
            if (!coin.collected) {
                coin.bobTimer += 0.1;
                coin.y += Math.sin(coin.bobTimer * 3) * 0.5;
            }
        });
    }
    
    updatePowerUps() {
        this.powerUps.forEach(powerUp => {
            if (!powerUp.collected) {
                powerUp.bobTimer += 0.05;
                powerUp.y += Math.sin(powerUp.bobTimer * 2) * 0.3;
            }
        });
    }
    
    updateParticles() {
        this.particles = this.particles.filter(particle => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += 0.2; // Gravity
            particle.life--;
            particle.alpha = particle.life / particle.maxLife;
            return particle.life > 0;
        });
    }
    
    updateCamera() {
        if (this.camera.target) {
            const targetX = this.camera.target.x - this.canvas.width / 2;
            const targetY = this.camera.target.y - this.canvas.height / 2;
            
            this.camera.x += (targetX - this.camera.x) * this.camera.smoothing;
            this.camera.y += (targetY - this.camera.y) * this.camera.smoothing;
            
            // Camera boundaries
            this.camera.x = Math.max(0, Math.min(this.worldWidth - this.canvas.width, this.camera.x));
            this.camera.y = Math.max(0, Math.min(this.worldHeight - this.canvas.height, this.camera.y));
        }
    }
    
    checkCollisions() {
        const player = this.player;
        
        // Player vs Enemies
        this.enemies.forEach(enemy => {
            if (this.isColliding(player, enemy)) {
                if (!player.isInvincible) {
                    // Check if player jumped on enemy
                    if (player.vy > 0 && player.y < enemy.y) {
                        // Player stomped enemy
                        enemy.health--;
                        player.vy = -8; // Bounce
                        this.playSound(330, 0.15);
                        this.createParticles(enemy.x + enemy.width/2, enemy.y, '#ffff00', 5);
                    } else {
                        // Player hit by enemy
                        this.playerHit();
                    }
                }
            }
        });
        
        // Player vs Coins
        this.coins.forEach(coin => {
            if (!coin.collected && this.isColliding(player, {x: coin.x, y: coin.y, width: 24, height: 24})) {
                coin.collected = true;
                this.coinsCollected++;
                this.addScore(100);
                this.playSound(660, 0.1);
                this.createParticles(coin.x + 12, coin.y + 12, '#ffd700', 6);
                
                // Extra life every 100 coins
                if (this.coinsCollected % 100 === 0) {
                    this.lives++;
                    this.playSound(880, 0.3);
                }
            }
        });
        
        // Player vs PowerUps
        this.powerUps.forEach(powerUp => {
            if (!powerUp.collected && this.isColliding(player, {x: powerUp.x, y: powerUp.y, width: 32, height: 32})) {
                powerUp.collected = true;
                this.applyPowerUp(powerUp.type);
                this.playSound(523, 0.2);
                this.createParticles(powerUp.x + 16, powerUp.y + 16, '#00ff00', 8);
            }
        });
    }
    
    isColliding(obj1, obj2) {
        return obj1.x < obj2.x + obj2.width &&
               obj1.x + obj1.width > obj2.x &&
               obj1.y < obj2.y + obj2.height &&
               obj1.y + obj1.height > obj2.y;
    }
    
    applyPowerUp(type) {
        const player = this.player;
        
        switch (type) {
            case 'mushroom':
                if (player.powerLevel === 0) {
                    player.powerLevel = 1;
                    player.height = 48;
                    player.health = 2;
                }
                break;
            case 'fire':
                player.powerLevel = 2;
                player.canShootFire = true;
                player.health = 2;
                break;
            case 'star':
                player.isInvincible = true;
                player.invincibleTimer = 600; // 10 seconds at 60fps
                break;
            case 'life':
                this.lives++;
                break;
        }
        
        this.addScore(1000);
    }
    
    playerHit() {
        const player = this.player;
        
        if (player.powerLevel > 0) {
            // Power down
            player.powerLevel--;
            if (player.powerLevel === 0) {
                player.height = 32;
                player.health = 1;
                player.canShootFire = false;
            }
            player.isInvincible = true;
            player.invincibleTimer = 120; // 2 seconds
            this.playSound(220, 0.3);
        } else {
            // Death
            this.playerDeath();
        }
    }
    
    playerDeath() {
        this.lives--;
        this.playSound(165, 0.5);
        this.createParticles(this.player.x + 16, this.player.y + 16, '#ff0000', 12);
        
        if (this.lives <= 0) {
            this.gameOver('Game Over!');
        } else {
            this.respawnPlayer();
        }
    }
    
    respawnPlayer() {
        this.player.x = 50;
        this.player.y = 400;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.powerLevel = 0;
        this.player.height = 32;
        this.player.health = 1;
        this.player.isInvincible = true;
        this.player.invincibleTimer = 180; // 3 seconds
    }
    
    checkVictory() {
        // Check if player reached the victory platform
        if (this.player.x > 2900 && this.player.y < 250) {
            this.victory();
        }
    }
    
    victory() {
        this.gameState = 'victory';
        this.addScore(Math.floor(this.time) * 10); // Time bonus
        this.playSound(523, 0.1);
        this.playSound(659, 0.1);
        this.playSound(784, 0.1);
        
        document.getElementById('gameOverTitle').textContent = '🎉 VICTORY! 🎉';
        document.getElementById('gameOverText').textContent = `Final Score: ${this.score}`;
        document.getElementById('gameOver').classList.add('show');
    }
    
    gameOver(message) {
        this.gameState = 'gameOver';
        document.getElementById('gameOverTitle').textContent = message;
        document.getElementById('gameOverText').textContent = `Score: ${this.score}`;
        document.getElementById('gameOver').classList.add('show');
    }
    
    addScore(points) {
        this.score += points;
        this.updateUI();
    }
    
    createParticles(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 8,
                vy: (Math.random() - 0.5) * 8 - 2,
                color: color,
                life: 30,
                maxLife: 30,
                alpha: 1
            });
        }
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
        }
    }
    
    restart() {
        // Reset game state
        this.gameState = 'playing';
        this.score = 0;
        this.coinsCollected = 0;
        this.lives = 3;
        this.time = 300;
        
        // Reset player
        this.createPlayer();
        
        // Reset level
        this.createLevel();
        
        // Hide game over screen
        document.getElementById('gameOver').classList.remove('show');
        
        this.updateUI();
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score.toString().padStart(6, '0');
        document.getElementById('coins').textContent = this.coinsCollected.toString().padStart(2, '0');
        document.getElementById('lives').textContent = this.lives.toString();
        document.getElementById('time').textContent = Math.ceil(this.time).toString();
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Load rendering methods
const script = document.createElement('script');
script.src = 'js/game-render.js';
script.onload = () => {
    // Start the game when everything is loaded
    const game = new MarioGame();
    window.game = game; // Make it globally accessible for restart button
};
document.head.appendChild(script);
