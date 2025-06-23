// Debug version with console logging

// Add debug logging to the collision detection
const originalIsColliding = MarioGame.prototype.isColliding;
MarioGame.prototype.isColliding = function(obj1, obj2) {
    const result = originalIsColliding.call(this, obj1, obj2);
    if (result && Math.random() < 0.1) { // Log 10% of collisions to avoid spam
        console.log('Collision detected:', obj1, obj2);
    }
    return result;
};

// Add debug info to the game
MarioGame.prototype.renderDebugInfo = function() {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(10, 100, 300, 150);
    
    this.ctx.fillStyle = '#ffffff';
    this.ctx.font = '12px monospace';
    this.ctx.textAlign = 'left';
    
    const debugInfo = [
        `Player: ${Math.round(this.player.x)}, ${Math.round(this.player.y)}`,
        `Velocity: ${Math.round(this.player.vx)}, ${Math.round(this.player.vy)}`,
        `Grounded: ${this.player.grounded}`,
        `Power Level: ${this.player.powerLevel}`,
        `Coins: ${this.coinsCollected}`,
        `Score: ${this.score}`,
        `Lives: ${this.lives}`,
        `Time: ${Math.ceil(this.time)}`,
        `Enemies: ${this.enemies.length}`,
        `Particles: ${this.particles.length}`
    ];
    
    debugInfo.forEach((info, index) => {
        this.ctx.fillText(info, 15, 115 + index * 14);
    });
    
    this.ctx.restore();
};

// Override render to include debug info
const originalRender = MarioGame.prototype.render;
MarioGame.prototype.render = function() {
    originalRender.call(this);
    
    // Add debug info
    this.renderDebugInfo();
    
    // Show collision boxes
    this.ctx.save();
    this.ctx.translate(-this.camera.x, -this.camera.y);
    
    // Player collision box
    this.ctx.strokeStyle = '#ff0000';
    this.ctx.lineWidth = 2;
    this.ctx.strokeRect(this.player.x, this.player.y, this.player.width, this.player.height);
    
    // Coin collision boxes
    this.ctx.strokeStyle = '#ffff00';
    this.coins.forEach(coin => {
        if (!coin.collected) {
            this.ctx.strokeRect(coin.x, coin.y, 24, 24);
        }
    });
    
    // Enemy collision boxes
    this.ctx.strokeStyle = '#ff00ff';
    this.enemies.forEach(enemy => {
        this.ctx.strokeRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
    
    this.ctx.restore();
};

console.log('🐛 Debug mode enabled - collision boxes and info panel active');
