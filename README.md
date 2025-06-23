# 🍄 Super Mario - Single Level Pro

A complete, feature-rich Mario platformer game focused on one amazing level with all advanced features implemented!

## 🎮 **Live Demo**
🌐 **[Play Now on Netlify](https://mariogamesinglelevel.netlify.app/)** *(Will be available after deployment)*

## 🚀 **Quick Start**

### **Play Online**
Just visit the live demo link above - no installation required!

### **Run Locally**
```bash
# Clone the repository
git clone https://github.com/Sehrish-Saddique/MarioGameJs.git
cd MarioGameJs

# Start local server
python3 -m http.server 8080
# or
npm start

# Open browser
open http://localhost:8080
```

## 🎯 **Game Features**

### **🏃‍♂️ Advanced Player Mechanics**
- **Smooth Movement** - Acceleration, deceleration, and friction
- **Variable Jump Height** - Hold jump for higher jumps
- **Double Jump** - Unlocked with power-ups
- **Power-up System** - 4 different power-ups with unique abilities
- **Invincibility Frames** - Temporary invincibility after taking damage

### **👾 Smart Enemy AI**
- **Goombas** - Patrol platforms, turn around at edges
- **Flying Enemies** - Hover with sine wave motion
- **Boss Enemy** - Advanced AI with health bar and attacks
- **Collision Detection** - Jump on enemies to defeat them

### **🪙 Rich Collectibles**
- **Coins** - Animated with glow effects, extra life every 100
- **Power-ups** - Mushroom (grow), Fire Flower, Star (invincibility), 1-Up
- **Particle Effects** - Visual feedback for all interactions

### **🎨 Beautiful Graphics**
- **Parallax Background** - Clouds and hills for depth
- **Detailed Sprites** - Mario changes appearance with power level
- **Particle Systems** - Explosions, sparkles, and effects
- **Smooth Animations** - 60fps gameplay with smooth camera

### **🎵 Dynamic Audio**
- **Procedural Sound Effects** - Jump, coin, enemy defeat sounds
- **Web Audio API** - Real-time sound generation
- **Victory Fanfare** - Musical celebration on completion

### **📱 Cross-Platform Controls**
- **Desktop** - Arrow keys, WASD, Space, Shift
- **Mobile** - Touch controls with on-screen buttons
- **Responsive Design** - Adapts to different screen sizes

## 🎯 **Game Objectives**

Navigate through a large, varied level featuring:
- **Starting Area** - Learn the controls
- **Platform Challenges** - Jumping puzzles
- **Enemy Encounters** - Combat and avoidance
- **Underground Section** - Darker, more challenging area
- **Castle Area** - Final boss battle
- **Victory Platform** - Reach the golden platform to win!

## 🎮 **Controls**

### **Desktop**
- **Arrow Keys / WASD** - Move left/right
- **Space / Up Arrow / W** - Jump
- **Shift** - Run (faster movement)
- **P** - Pause/Resume

### **Mobile**
- **← →** - Move left/right
- **JUMP** - Jump button
- **RUN** - Run button (hold for speed boost)

## 🏆 **Scoring System**

- **Coins** - 100 points each
- **Enemy Defeat** - 200 points (1000 for boss)
- **Power-ups** - 1000 points
- **Time Bonus** - Remaining time × 10 at victory
- **Extra Life** - Every 100 coins collected

## 🎨 **Visual Features**

### **Power Level System**
- **Small Mario** - Red, vulnerable to one hit
- **Big Mario** - Green, can take one hit, wears hat
- **Fire Mario** - Orange, can shoot fireballs, fire effects

### **Environmental Details**
- **Animated Clouds** - Floating in background
- **Grass Details** - On top of ground platforms
- **Platform Variety** - Ground, floating, and victory platforms
- **Particle Effects** - For all interactions and defeats

## 🔧 **Technical Features**

- **Smooth Camera** - Follows player with interpolation
- **Collision Detection** - Precise platform and enemy collision
- **Physics Engine** - Gravity, friction, and momentum
- **State Management** - Playing, paused, game over, victory
- **Performance Optimized** - 60fps with efficient rendering

## 🚀 **How to Play**

1. **Start** - Open `index.html` in a web browser
2. **Move** - Use arrow keys or touch controls
3. **Jump** - Space bar or jump button
4. **Collect** - Gather coins and power-ups
5. **Defeat** - Jump on enemies to defeat them
6. **Survive** - Avoid falling or getting hit
7. **Win** - Reach the golden victory platform!

## 📁 **File Structure**

```
mario-single-level/
├── index.html          # Main game page
├── js/
│   ├── game.js         # Core game logic
│   └── game-render.js  # Rendering system
└── README.md           # This file
```

## 🎯 **Game Stats**

- **Level Size** - 3200×576 pixels (large single level)
- **Enemies** - 7 total (4 Goombas, 2 Flying, 1 Boss)
- **Coins** - 16 collectible coins
- **Power-ups** - 4 different types
- **Platforms** - 15 varied platforms
- **Time Limit** - 5 minutes (300 seconds)

## 🏅 **Achievements**

- **Speed Runner** - Complete in under 2 minutes
- **Coin Master** - Collect all 16 coins
- **Pacifist** - Complete without defeating enemies
- **Power Player** - Collect all 4 power-ups
- **Perfect Run** - Complete without taking damage

## 🌟 **Why This Game is Special**

1. **Complete Experience** - Full game in one focused level
2. **All Features** - Every advanced feature implemented
3. **Polished Graphics** - Beautiful pixel-perfect rendering
4. **Smooth Gameplay** - 60fps with professional feel
5. **Cross-Platform** - Works on desktop and mobile
6. **No Dependencies** - Pure HTML5/JavaScript
7. **Instant Play** - No loading, no setup required

---

## 🚀 **Deployment**

### **Deploy to Netlify (Recommended)**

1. **Fork this repository** on GitHub
2. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Choose GitHub and select your forked repository
   - Build settings are automatically configured via `netlify.toml`
   - Click "Deploy site"
3. **Custom Domain** (optional):
   - Go to Site settings → Domain management
   - Add your custom domain

### **Deploy to GitHub Pages**

1. **Go to repository Settings**
2. **Scroll to Pages section**
3. **Select source**: Deploy from a branch
4. **Choose branch**: main
5. **Folder**: / (root)
6. **Save** - your site will be available at `https://YOUR-USERNAME.github.io/mario-single-level-pro`

### **Deploy to Vercel**

1. **Import project** at [vercel.com](https://vercel.com)
2. **Connect GitHub** repository
3. **Deploy** - no configuration needed

### **Deploy to Surge.sh**

```bash
# Install surge
npm install -g surge

# Deploy
cd mario-single-level-pro
surge . mario-your-game-name.surge.sh
```

## 📁 **Project Structure**

```
mario-single-level-pro/
├── index.html              # Main game page
├── js/
│   ├── game.js             # Core game logic (7000+ lines)
│   ├── game-render.js      # Advanced rendering system
│   └── game-debug.js       # Debug features
├── netlify.toml            # Netlify deployment config
├── package.json            # Project metadata
├── LICENSE                 # MIT License
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

## 🛠️ **Development**

### **Local Development**
```bash
# Start development server
npm start
# or
python3 -m http.server 8080

# Open browser
open http://localhost:8080
```

### **Code Structure**
- **`index.html`** - Game UI and HTML structure
- **`js/game.js`** - Core game logic, physics, AI
- **`js/game-render.js`** - Rendering system and graphics
- **`js/game-debug.js`** - Debug features and collision visualization

### **Adding Features**
1. **New Enemies** - Add to `createEnemies()` method
2. **New Power-ups** - Add to `createPowerUps()` and `applyPowerUp()`
3. **New Platforms** - Add to `createLevel()` method
4. **Visual Effects** - Modify rendering methods in `game-render.js`

## 🤝 **Contributing**

1. **Fork** the repository
2. **Create** feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** changes (`git commit -m 'Add amazing feature'`)
4. **Push** to branch (`git push origin feature/amazing-feature`)
5. **Open** Pull Request

## 📄 **License**

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

## 🙏 **Acknowledgments**

- **Nintendo** - Original Super Mario Bros inspiration
- **HTML5 Canvas** - High-performance 2D rendering
- **Web Audio API** - Procedural sound generation
- **Modern JavaScript** - ES6+ features and APIs

**🎮 Ready to play? [Launch the game now!](https://mariogamesinglelevel.netlify.app/)**

*Built with ❤️ using pure HTML5 Canvas and JavaScript*
