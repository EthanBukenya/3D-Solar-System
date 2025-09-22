//////////////////////////////////////
//SECTION Import
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
import {
  basicInformation,
  constant,
  sunData,
  showInfo,
  select,
  realisticPlanetData
} from "./constant.js";
//////////////////////////////////////

//////////////////////////////////////
//SECTION texture loader
const textureLoader = new THREE.TextureLoader();
//////////////////////////////////////

//////////////////////////////////////
//SECTION import all texture
const getTexture = (name) => textureLoader.load(`./image/${name}`);
const starTexture = getTexture("stars.jpg");
const sunTexture = getTexture("sun.jpg");
const mercuryTexture = getTexture("mercury.jpg");
const venusTexture = getTexture("venus.jpg");
const earthTexture = getTexture("earth.jpg");
const marsTexture = getTexture("mars.jpg");
const jupiterTexture = getTexture("jupiter.jpg");
const saturnTexture = getTexture("saturn.jpg");
const uranusTexture = getTexture("uranus.jpg");
const neptuneTexture = getTexture("neptune.jpg");
const plutoTexture = getTexture("pluto.jpg");
const saturnRingTexture = getTexture("saturn_ring.png");
const uranusRingTexture = getTexture("uranus_ring.png");

// Add normal maps for better 3D effect
const earthNormalMap = getTexture("earth_normal.jpg");
const moonTexture = getTexture("moon.jpg");
//////////////////////////////////////

//////////////////////////////////////
//SECTION planet information - Enhanced
const planetData = {
  approx: [
    // ... existing approx data
  ],
  real: realisticPlanetData.real,
  store: {
    approx: {},
    real: {},
  },
};
//////////////////////////////////////

//////////////////////////////////////
//SECTION create scene - Enhanced with realistic features
const createScene = (view, isshow) => {
  // ... existing constants

  // Enhanced camera with better starting position
  const camera = new THREE.PerspectiveCamera(
    45, // Wider field of view
    window.innerWidth / window.innerHeight,
    0.1,
    max_view
  );
  camera.position.set(-500, 300, 800); // Better starting view

  // Enhanced orbit controls
  const orbit = new OrbitControls(camera, renderer.domElement);
  orbit.zoomSpeed = 1.5;
  orbit.rotateSpeed = 0.5;
  orbit.enableDamping = true; // Smooth camera movement
  orbit.dampingFactor = 0.05;

  // Enhanced sun with glow effect
  const sungeo = new THREE.SphereGeometry(sunData[view], 64, 64);
  const sunMaterial = new THREE.MeshBasicMaterial({
    map: sunTexture,
    emissive: 0xffff00,
    emissiveIntensity: 0.5
  });
  const sun = new THREE.Mesh(sungeo, sunMaterial);
  scene.add(sun);

  // Sun glow effect
  const sunGlowGeometry = new THREE.SphereGeometry(sunData[view] * 1.2, 32, 32);
  const sunGlowMaterial = new THREE.ShaderMaterial({
    uniforms: {
      glowColor: { value: new THREE.Color(0xffff00) },
      viewVector: { value: camera.position }
    },
    vertexShader: `
      uniform vec3 viewVector;
      varying float intensity;
      void main() {
        vec3 vNormal = normalize(normalMatrix * normal);
        vec3 vNormel = normalize(normalMatrix * viewVector);
        intensity = pow(0.6 - dot(vNormal, vNormel), 2.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 glowColor;
      varying float intensity;
      void main() {
        vec3 glow = glowColor * intensity;
        gl_FragColor = vec4(glow, 1.0);
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true
  });
  const sunGlow = new THREE.Mesh(sunGlowGeometry, sunGlowMaterial);
  sun.add(sunGlow);

  // Enhanced lighting
  const sunLight = new THREE.PointLight(0xffffff, 2, point_light_limit);
  scene.add(sunLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
  scene.add(ambientLight);

  // Add directional light for better shadows
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.3);
  directionalLight.position.set(50, 50, 50);
  scene.add(directionalLight);

  // Enhanced planet generation with realistic features
  const genratePlanet = (dplanet) => {
    const size = sizeConst * dplanet.radius;
    const planetTexture = dplanet.name;
    const distance = distanceConst * dplanet.distance;
    
    // Elliptical orbit calculation
    const eccentricity = dplanet.eccentricity || 0;
    const semiMajorAxis = distance;
    const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
    
    const planetGeometry = new THREE.SphereGeometry(size, 64, 64);
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: planetTexture,
      roughness: 0.8,
      metalness: 0.2,
    });

    // Special treatment for Earth with normal map
    if (dplanet.planet_name === "earth") {
      planetMaterial.normalMap = earthNormalMap;
      planetMaterial.normalScale = new THREE.Vector2(0.5, 0.5);
    }

    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    
    // Apply planetary tilt
    planet.rotation.z = THREE.MathUtils.degToRad(dplanet.tilt || 0);

    const planetObj = new THREE.Object3D();
    
    // Set initial position with eccentricity
    const initialAngle = Math.random() * Math.PI * 2;
    const x = semiMajorAxis * Math.cos(initialAngle);
    const z = semiMinorAxis * Math.sin(initialAngle);
    
    planet.position.set(x, 0, z);

    if (dplanet.ring) {
      const ringGeo = new THREE.RingGeometry(
        sizeConst * dplanet.ring.innerRadius,
        sizeConst * dplanet.ring.outerRadius,
        64
      );
      const ringMat = new THREE.MeshBasicMaterial({
        map: dplanet.ring.ringmat,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.8
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      planetObj.add(ringMesh);
      ringMesh.position.set(x, 0, 0);
      ringMesh.rotation.x = -0.5 * Math.PI;
    }

    scene.add(planetObj);
    planetObj.add(planet);

    // Create elliptical orbit path
    createEllipticalOrbit(semiMajorAxis, eccentricity, 0x666666, 1);
    
    return {
      planetObj: planetObj,
      planet: planet,
      semiMajorAxis: semiMajorAxis,
      semiMinorAxis: semiMinorAxis,
      eccentricity: eccentricity,
      currentAngle: initialAngle
    };
  };

  // Enhanced orbit path creation
  function createEllipticalOrbit(semiMajorAxis, eccentricity, color, width) {
    const material = new THREE.LineBasicMaterial({ color: color, linewidth: width });
    const geometry = new THREE.BufferGeometry();
    const points = [];

    const semiMinorAxis = semiMajorAxis * Math.sqrt(1 - eccentricity * eccentricity);
    const numSegments = 200;

    for (let i = 0; i <= numSegments; i++) {
      const angle = (i / numSegments) * Math.PI * 2;
      const x = semiMajorAxis * Math.cos(angle);
      const z = semiMinorAxis * Math.sin(angle);
      points.push(new THREE.Vector3(x, 0, z));
    }

    geometry.setFromPoints(points);
    const orbitPath = new THREE.LineLoop(geometry, material);
    scene.add(orbitPath);
    path_of_planets.push(orbitPath);
  }

  // Generate planets with enhanced data
  planetData[view].forEach((dplanet) => {
    const planetData = genratePlanet(dplanet);
    Object.assign(dplanet, planetData);
    planetData.store[view][dplanet.planet_name] = planetData.planet;
  });

  // Enhanced GUI options
  const gui = new dat.GUI();
  const options = {
    "Natural Lighting": true,
    "Show Orbits": true,
    "Show Planet Labels": false,
    "Realistic Speed": true,
    "Camera Follow": true,
    speed: view === "real" ? 1000 : 1,
    timeScale: 1,
    focus: "sun",
    "Auto-Rotate Camera": false
  };

  // Enhanced GUI controllers
  gui.add(options, "Natural Lighting").onChange((e) => {
    ambientLight.intensity = e ? 0.1 : 0.5;
    sunLight.intensity = e ? 2 : 1;
    directionalLight.intensity = e ? 0.3 : 0.1;
  });

  gui.add(options, "Show Orbits").onChange((e) => {
    path_of_planets.forEach(path => path.visible = e);
  });

  gui.add(options, "Realistic Speed").onChange((e) => {
    options.speed = e ? (view === "real" ? 1000 : 1) : 1;
  });

  gui.add(options, "speed", min_speed, max_speed);
  gui.add(options, "timeScale", 0.1, 10);
  gui.add(options, "Auto-Rotate Camera");
  
  const focusController = gui.add(options, "focus", Object.keys(basicInformation));
  focusController.onChange(() => {
    showInfo(options.focus);
    if (options["Camera Follow"]) {
      // Camera will follow in animate function
    }
  });

  // Enhanced animation with elliptical orbits
  function animate() {
    if (cview === view) {
      orbit.update(); // Required when damping is enabled
      
      sun.rotateY(options.speed * 0.004 * options.timeScale);
      
      planetData[view].forEach((planet) => {
        // Update elliptical orbit position
        planet.currentAngle += options.speed * planet.rsas * rotaingSpeedAroundSunConst * options.timeScale;
        const x = planet.semiMajorAxis * Math.cos(planet.currentAngle);
        const z = planet.semiMinorAxis * Math.sin(planet.currentAngle);
        
        planet.planetObj.position.set(x, 0, z);
        planet.planet.rotateY(options.speed * planet.srs * selfRotateConst * options.timeScale);
      });

      // Camera follow with smooth transition
      if (options["Camera Follow"]) {
        const targetPlanet = planetData.store[view][options.focus];
        if (targetPlanet) {
          const targetPosition = new THREE.Vector3();
          targetPlanet.getWorldPosition(targetPosition);
          
          // Smooth camera transition
          orbit.target.lerp(targetPosition, 0.05);
        }
      }

      // Auto-rotate camera
      if (options["Auto-Rotate Camera"]) {
        orbit.autoRotate = true;
        orbit.autoRotateSpeed = 0.5;
      } else {
        orbit.autoRotate = false;
      }
    }
    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop(animate);
  return { gui, renderer, camera, makeFocus: () => showInfo(options.focus) };
};