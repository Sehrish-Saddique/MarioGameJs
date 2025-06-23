// Rendering methods for Mario Game

MarioGame.prototype.render = function() {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Save context
    this.ctx.save();
    
    // Apply camera transform
    this.ctx.translate(-this.camera.x, -this.camera.y);
    
    // Render background
    this.renderBackground();
    
    // Render platforms
    this.renderPlatforms();
    
    // Render coins
    this.renderCoins();
    
    // Render power-ups
    this.renderPowerUps();
    
    // Render enemies
    this.renderEnemies();
    
    // Render player
    this.renderPlayer();
    
    // Render particles
    this.renderParticles();
    
    // Restore context
    this.ctx.restore();
    
    // Render UI (not affected by camera)
    this.renderUI();
};

MarioGame.prototype.renderBackground = function() {
    // Sky gradient
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.worldHeight);
    gradient.addColorStop(0, '#87CEEB');
    gradient.addColorStop(0.7, '#98FB98');
    gradient.addColorStop(1, '#228B22');
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.worldWidth, this.worldHeight);
    
    // Clouds
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 10; i++) {
        const x = (i * 400) + 100;
        const y = 50 + (i % 3) * 30;
        this.renderCloud(x, y);
    }
    
    // Hills in background
    this.ctx.fillStyle = 'rgba(34, 139, 34, 0.6)';
    for (let i = 0; i < 8; i++) {
        const x = i * 400;
        const y = 300;
        this.ctx.beginPath();
        this.ctx.arc(x, y, 100, 0, Math.PI);
        this.ctx.fill();
    }
};

MarioGame.prototype.renderCloud = function(x, y) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, 20, 0, Math.PI * 2);
    this.ctx.arc(x + 25, y, 25, 0, Math.PI * 2);
    this.ctx.arc(x + 50, y, 20, 0, Math.PI * 2);
    this.ctx.arc(x + 25, y - 15, 15, 0, Math.PI * 2);
    this.ctx.fill();
};

MarioGame.prototype.renderPlatforms = function() {
    this.platforms.forEach(platform => {
        // Platform color based on type
        switch (platform.type) {
            case 'ground':
                this.ctx.fillStyle = '#8B4513';
                break;
            case 'platform':
                this.ctx.fillStyle = '#D2691E';
                break;
            case 'victory':
                this.ctx.fillStyle = '#FFD700';
                break;
        }
        
        this.ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
        
        // Platform border
        this.ctx.strokeStyle = '#654321';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
        
        // Grass on top of ground platforms
        if (platform.type === 'ground') {
            this.ctx.fillStyle = '#228B22';
            this.ctx.fillRect(platform.x, platform.y - 8, platform.width, 8);
            
            // Grass details
            this.ctx.fillStyle = '#32CD32';
            for (let i = 0; i < platform.width; i += 8) {
                this.ctx.fillRect(platform.x + i, platform.y - 8, 2, 8);
                this.ctx.fillRect(platform.x + i + 4, platform.y - 6, 2, 6);
            }
        }
    });
};

MarioGame.prototype.renderCoins = function() {
    this.coins.forEach(coin => {
        if (!coin.collected) {
            this.ctx.save();
            
            // Glow effect
            this.ctx.shadowColor = '#FFD700';
            this.ctx.shadowBlur = 10;
            
            // Coin body
            this.ctx.fillStyle = '#FFD700';
            this.ctx.beginPath();
            this.ctx.arc(coin.x + 12, coin.y + 12, 10, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Inner circle
            this.ctx.fillStyle = '#FFA500';
            this.ctx.beginPath();
            this.ctx.arc(coin.x + 12, coin.y + 12, 6, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Star or dollar sign
            this.ctx.fillStyle = '#FFD700';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('★', coin.x + 12, coin.y + 16);
            
            this.ctx.restore();
        }
    });
};

MarioGame.prototype.renderPowerUps = function() {
    this.powerUps.forEach(powerUp => {
        if (!powerUp.collected) {
            this.ctx.save();
            
            const x = powerUp.x;
            const y = powerUp.y;
            
            switch (powerUp.type) {
                case 'mushroom':
                    // Mushroom
                    this.ctx.fillStyle = '#FF0000';
                    this.ctx.fillRect(x, y, 32, 20);
                    this.ctx.fillStyle = '#FFEEAA';
                    this.ctx.fillRect(x + 10, y + 15, 12, 12);
                    // Spots
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.fillRect(x + 6, y + 4, 6, 6);
                    this.ctx.fillRect(x + 20, y + 6, 6, 6);
                    break;
                    
                case 'fire':
                    // Fire flower
                    this.ctx.fillStyle = '#FF4500';
                    for (let i = 0; i < 6; i++) {
                        const angle = (i / 6) * Math.PI * 2;
                        const px = x + 16 + Math.cos(angle) * 12;
                        const py = y + 16 + Math.sin(angle) * 12;
                        this.ctx.fillRect(px - 3, py - 3, 6, 6);
                    }
                    this.ctx.fillStyle = '#FFFF00';
                    this.ctx.fillRect(x + 13, y + 13, 6, 6);
                    break;
                    
                case 'star':
                    // Star
                    this.ctx.fillStyle = '#FFD700';
                    this.renderStar(x + 16, y + 16, 12, 5);
                    break;
                    
                case 'life':
                    // 1-Up mushroom
                    this.ctx.fillStyle = '#00FF00';
                    this.ctx.fillRect(x, y, 32, 20);
                    this.ctx.fillStyle = '#FFEEAA';
                    this.ctx.fillRect(x + 10, y + 15, 12, 12);
                    // "1UP" text
                    this.ctx.fillStyle = '#FFFFFF';
                    this.ctx.font = '8px Arial';
                    this.ctx.textAlign = 'center';
                    this.ctx.fillText('1UP', x + 16, y + 12);
                    break;
            }
            
            this.ctx.restore();
        }
    });
};

MarioGame.prototype.renderStar = function(x, y, radius, points) {
    this.ctx.beginPath();
    for (let i = 0; i < points * 2; i++) {
        const angle = (i / (points * 2)) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? radius : radius / 2;
        const px = x + Math.cos(angle) * r;
        const py = y + Math.sin(angle) * r;
        
        if (i === 0) {
            this.ctx.moveTo(px, py);
        } else {
            this.ctx.lineTo(px, py);
        }
    }
    this.ctx.closePath();
    this.ctx.fill();
};

MarioGame.prototype.renderEnemies = function() {
    this.enemies.forEach(enemy => {
        this.ctx.save();
        
        switch (enemy.type) {
            case 'goomba':
                // Goomba
                this.ctx.fillStyle = '#8B4513';
                this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                
                // Eyes
                this.ctx.fillStyle = '#000000';
                this.ctx.fillRect(enemy.x + 6, enemy.y + 8, 4, 4);
                this.ctx.fillRect(enemy.x + 22, enemy.y + 8, 4, 4);
                
                // Eyebrows
                this.ctx.strokeStyle = '#000000';
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(enemy.x + 4, enemy.y + 6);
                this.ctx.lineTo(enemy.x + 12, enemy.y + 8);
                this.ctx.moveTo(enemy.x + 20, enemy.y + 8);
                this.ctx.lineTo(enemy.x + 28, enemy.y + 6);
                this.ctx.stroke();
                
                // Feet
                this.ctx.fillStyle = '#654321';
                this.ctx.fillRect(enemy.x + 4, enemy.y + 28, 8, 4);
                this.ctx.fillRect(enemy.x + 20, enemy.y + 28, 8, 4);
                break;
                
            case 'fly':
                // Flying enemy
                this.ctx.fillStyle = '#800080';
                this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                
                // Wings
                this.ctx.fillStyle = '#FFFFFF';
                this.ctx.fillRect(enemy.x - 4, enemy.y + 8, 8, 4);
                this.ctx.fillRect(enemy.x + 28, enemy.y + 8, 8, 4);
                
                // Eyes
                this.ctx.fillStyle = '#FF0000';
                this.ctx.fillRect(enemy.x + 8, enemy.y + 8, 4, 4);
                this.ctx.fillRect(enemy.x + 20, enemy.y + 8, 4, 4);
                break;
                
            case 'boss':
                // Boss enemy
                this.ctx.fillStyle = '#FF0000';
                this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
                
                // Crown
                this.ctx.fillStyle = '#FFD700';
                this.ctx.fillRect(enemy.x + 4, enemy.y - 8, 40, 8);
                for (let i = 0; i < 4; i++) {
                    this.ctx.fillRect(enemy.x + 6 + i * 9, enemy.y - 12, 6, 4);
                }
                
                // Eyes
                this.ctx.fillStyle = '#000000';
                this.ctx.fillRect(enemy.x + 10, enemy.y + 12, 6, 6);
                this.ctx.fillRect(enemy.x + 32, enemy.y + 12, 6, 6);
                
                // Mouth
                this.ctx.fillRect(enemy.x + 16, enemy.y + 28, 16, 4);
                
                // Health bar
                const healthPercent = enemy.health / enemy.maxHealth;
                this.ctx.fillStyle = '#000000';
                this.ctx.fillRect(enemy.x, enemy.y - 20, 48, 8);
                this.ctx.fillStyle = '#FF0000';
                this.ctx.fillRect(enemy.x + 2, enemy.y - 18, 44 * healthPercent, 4);
                break;
        }
        
        this.ctx.restore();
    });
};

MarioGame.prototype.renderPlayer = function() {
    const player = this.player;
    
    this.ctx.save();
    
    // Invincibility flashing
    if (player.isInvincible && Math.floor(player.invincibleTimer / 5) % 2) {
        this.ctx.globalAlpha = 0.5;
    }
    
    // Player color based on power level
    let playerColor = '#FF0000'; // Small Mario - red
    if (player.powerLevel === 1) playerColor = '#00FF00'; // Big Mario - green
    if (player.powerLevel === 2) playerColor = '#FF8800'; // Fire Mario - orange
    
    this.ctx.fillStyle = playerColor;
    this.ctx.fillRect(player.x, player.y, player.width, player.height);
    
    // Mario's face
    this.ctx.fillStyle = '#000000';
    // Eyes
    this.ctx.fillRect(player.x + 6, player.y + 8, 4, 4);
    this.ctx.fillRect(player.x + 22, player.y + 8, 4, 4);
    
    // Mustache
    this.ctx.fillRect(player.x + 10, player.y + 16, 12, 3);
    
    // Hat (if big or fire mario)
    if (player.powerLevel > 0) {
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(player.x + 4, player.y - 8, 24, 8);
        // "M" on hat
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '8px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('M', player.x + 16, player.y - 2);
    }
    
    // Overalls (if big mario)
    if (player.powerLevel > 0) {
        this.ctx.fillStyle = '#0000FF';
        this.ctx.fillRect(player.x + 8, player.y + 20, 16, player.height - 20);
    }
    
    // Fire effect (if fire mario)
    if (player.powerLevel === 2) {
        this.ctx.fillStyle = '#FF4500';
        for (let i = 0; i < 3; i++) {
            const fx = player.x + 4 + i * 8;
            const fy = player.y - 4;
            this.ctx.fillRect(fx, fy, 4, 8);
        }
    }
    
    this.ctx.restore();
};

MarioGame.prototype.renderParticles = function() {
    this.particles.forEach(particle => {
        this.ctx.save();
        this.ctx.globalAlpha = particle.alpha;
        this.ctx.fillStyle = particle.color;
        this.ctx.fillRect(particle.x - 2, particle.y - 2, 4, 4);
        this.ctx.restore();
    });
};

MarioGame.prototype.renderUI = function() {
    // Pause indicator
    if (this.gameState === 'paused') {
        this.ctx.save();
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.font = '48px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
        this.ctx.restore();
    }
};
