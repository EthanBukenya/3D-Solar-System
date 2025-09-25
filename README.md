# 3D Interactive Solar System

A realistic, interactive 3D solar system simulation built with Three.js, featuring all planets from Mercury to Pluto with accurate orbital mechanics and immersive visual effects.

## Features

## Screenshots

![Usage video](textures/3D-solar-system-gif.gif)

### Core Functionality
- **Complete Solar System**: All 9 celestial bodies including Mercury through Neptune plus Pluto
- **Realistic Orbital Mechanics**: Planets orbit at scaled distances with accurate relative speeds
- **Interactive 3D Controls**: Mouse-controlled camera with rotation, panning, and zoom
- **Planet Information System**: Click any planet to view detailed astronomical data
- **Texture Support**: High-resolution planet textures with fallback color system

### User Interface
- **Animation Speed Control**: Adjustable time acceleration (0-5x speed)
- **Camera Focus System**: Lock camera to any planet or free roam
- **Toggle Controls**: Show/hide orbit paths and planet labels
- **Loading System**: Progress bar with texture loading feedback
- **Responsive Design**: Adaptive UI for desktop and mobile devices

## Technology Stack

- **Three.js r128**: 3D graphics rendering and scene management
- **WebGL**: Hardware-accelerated graphics
- **HTML5 Canvas**: 2D label generation
- **CSS3**: Modern styling with glassmorphism effects
- **JavaScript ES6+**: Modern JavaScript features and async/await

## Installation & Setup

### Basic Setup
1. Clone or download the project files
2. Serve the files through a local web server (required for texture loading)
3. Open `index.html` in a modern web browser

### Using Python (recommended)
```bash
# Python 3
python -m http.server 8000

# Python 2
python -M SimpleHTTPServer 8000
```

### Using Node.js
```bash
npx serve .
# or
npm install -g http-server
http-server
```

### Using PHP
```bash
php -S localhost:8000
```

## Usage

### Controls
- **Mouse Drag**: Rotate camera around the solar system
- **Mouse Wheel**: Zoom in/out
- **Right Click + Drag**: Pan camera position
- **Planet Click**: Display detailed planet information

### Interface Controls
- **Animation Speed Slider**: Control orbital and rotation speeds
- **Focus Planet Dropdown**: Lock camera to specific planets
- **Toggle Orbits Button**: Show/hide orbital path lines
- **Toggle Labels Button**: Show/hide planet name labels

### Planet Information
Click any planet to view:
- Planet type and classification
- Physical dimensions
- Temperature ranges
- Rotation and orbital periods
- Atmospheric composition (where applicable)

## Customization

### Scaling Factors
Modify these constants in the code to adjust the solar system scale:
```javascript
const DISTANCE_SCALE = 0.3;  // Planetary orbital distances
const SIZE_SCALE = 0.0001;   // Planet physical sizes
```

### Adding Textures
1. Create a `textures/` directory
2. Add planet texture images following the naming convention
3. Textures will load automatically with color fallbacks

### Camera Positioning
Adjust initial camera position for different views:
```javascript
camera.position.set(0, 2000, 6500);  // x, y, z coordinates
```

## Contributing

To contribute to this project:
1. Fork the repository
2. Create a feature branch
3. Test changes thoroughly
4. Submit a pull request with detailed description

## Future Enhancements

- [ ] Major moons (Luna, Europa, Titan, etc.)
- [ ] Asteroid belt visualization
- [ ] Planetary axial tilt representation
- [ ] Elliptical orbit implementation
- [ ] Spacecraft trajectory visualization
- [ ] VR/AR support
- [ ] Educational quiz integration


## Credits

- **Three.js**: 3D graphics library
- **Planet Textures**: NASA/JPL planetary imagery
- **Astronomical Data**: International Astronomical Union
- **Design Inspiration**: NASA Jet Propulsion Laboratory

## Support

For issues, questions, or contributions, please open an issue in the project repository or contact the development team.

---

**Note**: This simulation is designed for educational and demonstration purposes. While astronomically inspired, some aspects are scaled and simplified for optimal visualization and performance.