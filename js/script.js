//////////////////////////////////////
//SECTION Import
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.127.0/build/three.module.js";

    // Scene setup
    let scene, camera, renderer, controls;
    let planets = {};
    let orbits = [];
    let labels = [];
    let animationSpeed = 1;
    let focusedPlanet = null;
    let showOrbits = true;
    let showLabels = true;
    let textureLoader;
    let loadingManager;
    let loadedTextures = {};

    // Scaling factors for visualization
    const SCALE_FACTOR = 0.00001; // Scale down for visualization
    const DISTANCE_SCALE = 0.01; // Scale distances
    const SIZE_SCALE = 0.0001; // Scale planet sizes

    init();
    animate();

            // STEP 3: Modified init() Function
    // ========================================
    function init() {
        // Create scene
        scene = new THREE.Scene();

        // Create camera with top-down slight angle view
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
        camera.position.set(0, 80, 50); // Higher Y value for "above", moderate Z for slight angle
        camera.lookAt(0, 0, 0); // Look at the center (sun)

        // Create renderer
        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000011, 1);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        document.getElementById('canvas-container').appendChild(renderer.domElement);

        // Initialize Loading Manager and Texture Loader
        loadingManager = new THREE.LoadingManager();
        textureLoader = new THREE.TextureLoader(loadingManager);
        
        // Setup loading callbacks
        loadingManager.onLoad = () => {
            console.log('All textures loaded!');
            hideLoadingScreen();
        };
        
        loadingManager.onProgress = (url, loaded, total) => {
            const progress = (loaded / total) * 100;
            updateLoadingProgress(progress, `Loading: ${url.split('/').pop()}`);
        };
        
        loadingManager.onError = (url) => {
            console.warn(`Failed to load texture: ${url}`);
        };

        // Add starfield background
        createStarfield();

        // Load textures then create planets
        loadTexturesAndCreatePlanets();

        // Add lighting
        createLighting();

        // Setup controls
        setupControls();

        // Setup event listeners
        setupEventListeners();
    }


    async function loadTexturesAndCreatePlanets() {
        console.log('Starting texture loading...');
        
        // Load all textures first
        for (const [planetKey, config] of Object.entries(planetTextureConfig)) {
            await loadPlanetTextures(planetKey, config);
        }
        
        // Then create planets with loaded textures
        createPlanetsWithTextures();
        
        // Start animation
        animate();
    }

    function loadPlanetTextures(planetKey, config) {
        return new Promise((resolve) => {
            const textures = {};
            let texturePromises = [];
            
            // Load main texture
            const mainTexturePromise = new Promise((resolveTexture) => {
                textureLoader.load(
                    config.texture,
                    (texture) => {
                        // Optimize texture
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.minFilter = THREE.LinearMipmapLinearFilter;
                        texture.magFilter = THREE.LinearFilter;
                        
                        textures.main = texture;
                        console.log(`✓ Loaded ${planetKey} texture`);
                        resolveTexture();
                    },
                    undefined,
                    (error) => {
                        console.warn(`✗ Failed to load ${planetKey} texture, using fallback`);
                        textures.main = null;
                        resolveTexture();
                    }
                );
            });
            texturePromises.push(mainTexturePromise);
            
            // Load ring texture if exists
            if (config.ringTexture) {
                const ringTexturePromise = new Promise((resolveTexture) => {
                    textureLoader.load(
                        config.ringTexture,
                        (texture) => {
                            texture.wrapS = THREE.RepeatWrapping;
                            texture.wrapT = THREE.RepeatWrapping;
                            textures.ring = texture;
                            console.log(`✓ Loaded ${planetKey} ring texture`);
                            resolveTexture();
                        },
                        undefined,
                        (error) => {
                            console.warn(`✗ Failed to load ${planetKey} ring texture`);
                            textures.ring = null;
                            resolveTexture();
                        }
                    );
                });
                texturePromises.push(ringTexturePromise);
            }
            
            // Load additional textures for Earth
            if (config.normalMap) {
                const normalMapPromise = new Promise((resolveTexture) => {
                    textureLoader.load(config.normalMap, 
                        (texture) => {
                            textures.normal = texture;
                            resolveTexture();
                        },
                        undefined,
                        () => {
                            textures.normal = null;
                            resolveTexture();
                        }
                    );
                });
                texturePromises.push(normalMapPromise);
            }
            
            if (config.specularMap) {
                const specularMapPromise = new Promise((resolveTexture) => {
                    textureLoader.load(config.specularMap,
                        (texture) => {
                            textures.specular = texture;
                            resolveTexture();
                        },
                        undefined,
                        () => {
                            textures.specular = null;
                            resolveTexture();
                        }
                    );
                });
                texturePromises.push(specularMapPromise);
            }
            
            // Wait for all textures to load (or fail)
            Promise.all(texturePromises).then(() => {
                loadedTextures[planetKey] = textures;
                resolve();
            });
        });
    }

    // STEP 5: Modified createPlanets Function
    // ========================================
    function createPlanetsWithTextures() {
        Object.entries(planetData).forEach(([key, data]) => {
            const planetGroup = new THREE.Group();
            const textureConfig = planetTextureConfig[key];
            const textures = loadedTextures[key] || {};
            
            // Create planet geometry and material
            let geometry, material;
            
            if (key === 'sun') {
                geometry = new THREE.SphereGeometry(data.radius * SIZE_SCALE * 10, 32, 32);
                
                if (textures.main) {
                    material = new THREE.MeshBasicMaterial({ 
                        map: textures.main,
                        emissive: new THREE.Color(0x444444),
                        emissiveMap: textures.main,
                        emissiveIntensity: 0.3
                    });
                } else {
                    material = new THREE.MeshBasicMaterial({ 
                        color: textureConfig.fallbackColor,
                        emissive: textureConfig.fallbackColor,
                        emissiveIntensity: 0.3
                    });
                }
            } else {
                geometry = new THREE.SphereGeometry(data.radius * SIZE_SCALE * 50, 32, 32);
                
                if (textures.main) {
                    // Enhanced Earth material
                    if (key === 'earth' && textures.normal && textures.specular) {
                        material = new THREE.MeshPhongMaterial({ 
                            map: textures.main,
                            normalMap: textures.normal,
                            specularMap: textures.specular,
                            shininess: 100
                        });
                    } else {
                        // Standard textured material
                        material = new THREE.MeshLambertMaterial({ 
                            map: textures.main 
                        });
                    }
                } else {
                    // Fallback to solid color
                    material = new THREE.MeshLambertMaterial({ 
                        color: textureConfig.fallbackColor
                    });
                }
            }

            const planet = new THREE.Mesh(geometry, material);
            planet.castShadow = true;
            planet.receiveShadow = true;
            planet.userData = { planetKey: key, planetData: data };

            // Position planet
            if (key !== 'sun') {
                const distance = data.distance * DISTANCE_SCALE;
                planet.position.x = distance;

                // Create orbit path
                createOrbitPath(distance);
            }

            planetGroup.add(planet);
            
            // Create planet label
            if (key !== 'sun') {
                createPlanetLabel(data.name, planet.position.clone());
            }

            // *** MODIFIED: Special handling for planets with rings ***
            if (textureConfig.hasRings) {
                createSaturnRingsWithTexture(planet, textures.ring, key);
            }

            // *** NEW: Add atmosphere for Earth ***
            if (textureConfig.hasAtmosphere) {
                createEarthAtmosphere(planet);
            }

            planets[key] = { 
                group: planetGroup, 
                planet: planet, 
                data: data, 
                material: material 
            };
            scene.add(planetGroup);
        });
    }

    function createStarfield() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 });

        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);
    }

    function createOrbitPath(radius) {
        const geometry = new THREE.BufferGeometry();
        const material = new THREE.LineBasicMaterial({ 
            color: 0x444444, 
            opacity: 0.3, 
            transparent: true 
        });

        const points = [];
        const segments = 100;
        for (let i = 0; i <= segments; i++) {
            const theta = (i / segments) * Math.PI * 2;
            points.push(
                Math.cos(theta) * radius,
                0,
                Math.sin(theta) * radius
            );
        }

        geometry.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
        const orbit = new THREE.Line(geometry, material);
        orbits.push(orbit);
        scene.add(orbit);
    }

    // ========================================
    // STEP 6: Enhanced Ring Creation
    // ========================================
    function createSaturnRingsWithTexture(planet, ringTexture, planetKey) {
        const planetRadius = planet.geometry.parameters.radius;
        let innerRadius, outerRadius;
        
        if (planetKey === 'saturn') {
            innerRadius = planetRadius * 1.2;
            outerRadius = planetRadius * 2.2;
        } else if (planetKey === 'uranus') {
            innerRadius = planetRadius * 1.5;
            outerRadius = planetRadius * 2.0;
        }

        const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 64);
        
        let ringMaterial;
        if (ringTexture) {
            ringMaterial = new THREE.MeshLambertMaterial({
                map: ringTexture,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.8
            });
        } else {
            // Fallback ring material
            ringMaterial = new THREE.MeshLambertMaterial({
                color: planetKey === 'saturn' ? 0xaaaaaa : 0x888888,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.6
            });
        }

        const rings = new THREE.Mesh(ringGeometry, ringMaterial);
        rings.rotation.x = Math.PI / 2;
        
        // Uranus rings are tilted
        if (planetKey === 'uranus') {
            rings.rotation.z = Math.PI / 4;
        }
        
        planet.add(rings);
    }

    // ========================================
    // STEP 7: Earth Atmosphere Effect
    // ========================================
    function createEarthAtmosphere(earthPlanet) {
        const atmosphereGeometry = new THREE.SphereGeometry(
            earthPlanet.geometry.parameters.radius * 1.05, 32, 32
        );
        
        const atmosphereMaterial = new THREE.ShaderMaterial({
            uniforms: {
                viewVector: { type: "v3", value: camera.position }
            },
            vertexShader: `
                uniform vec3 viewVector;
                varying float intensity;
                void main() {
                    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
                    vec3 actual_normal = vec3(modelMatrix * vec4(normal, 0.0));
                    intensity = pow(dot(normalize(viewVector), actual_normal), 2.0);
                }
            `,
            fragmentShader: `
                varying float intensity;
                void main() {
                    vec3 glow = vec3(0.3, 0.6, 1.0) * intensity;
                    gl_FragColor = vec4(glow, 0.3);
                }
            `,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
        earthPlanet.add(atmosphere);
    }

    function createPlanetLabel(name, position) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 32;
        
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        
        context.fillStyle = 'white';
        context.font = '16px Arial';
        context.textAlign = 'center';
        context.fillText(name, canvas.width / 2, 20);

        const texture = new THREE.CanvasTexture(canvas);
        const material = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(material);
        
        sprite.position.copy(position);
        sprite.position.y += 5;
        sprite.scale.set(8, 2, 1);
        
        labels.push(sprite);
        scene.add(sprite);
    }

    function createLighting() {
        // Sun light
        const sunLight = new THREE.PointLight(0xffffff, 2, 1000);
        sunLight.position.set(0, 0, 0);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        scene.add(sunLight);

        // Ambient light
        const ambientLight = new THREE.AmbientLight(0x404040, 0.1);
        scene.add(ambientLight);
    }

    function setupControls() {
        // Create custom orbit controls
        let mouseDown = false;
        let mouseX = 0;
        let mouseY = 0;
        
        // Set initial rotation for top-down view with slight angle
        let targetRotationY = Math.PI / 4; // 45 degrees rotation around Y axis
        let targetRotationX = -Math.PI / 6; // -30 degrees (looking slightly down)
        let rotationY = targetRotationY;
        let rotationX = targetRotationX;


        renderer.domElement.addEventListener('mousedown', (event) => {
            event.preventDefault();
            mouseDown = true;
            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        renderer.domElement.addEventListener('mousemove', (event) => {
            if (!mouseDown) return;
            
            const deltaX = event.clientX - mouseX;
            const deltaY = event.clientY - mouseY;
            
            targetRotationY += deltaX * 0.01;
            targetRotationX += deltaY * 0.01;
            targetRotationX = Math.max(-Math.PI/2, Math.min(Math.PI/2, targetRotationX));
            
            mouseX = event.clientX;
            mouseY = event.clientY;
        });

        renderer.domElement.addEventListener('mouseup', () => {
            mouseDown = false;
        });

        renderer.domElement.addEventListener('wheel', (event) => {
            const scale = event.deltaY > 0 ? 1.1 : 0.9;
            camera.position.multiplyScalar(scale);
        });

        // Smooth camera rotation
        function updateCamera() {
            rotationY += (targetRotationY - rotationY) * 0.1;
            rotationX += (targetRotationX - rotationX) * 0.1;
            
            if (focusedPlanet && planets[focusedPlanet]) {
                const planet = planets[focusedPlanet].planet;
                const distance = 20;
                camera.position.x = planet.position.x + Math.cos(rotationY) * Math.cos(rotationX) * distance;
                camera.position.y = Math.sin(rotationX) * distance;
                camera.position.z = planet.position.z + Math.sin(rotationY) * Math.cos(rotationX) * distance;
                camera.lookAt(planet.position);
            } else {
                const distance = camera.position.length();
                camera.position.x = Math.cos(rotationY) * Math.cos(rotationX) * distance;
                camera.position.y = Math.sin(rotationX) * distance;
                camera.position.z = Math.sin(rotationY) * Math.cos(rotationX) * distance;
                camera.lookAt(0, 0, 0);
            }
        }

        // Click detection for planets
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        renderer.domElement.addEventListener('click', (event) => {
            if (mouseDown) return;
            
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            
            const planetMeshes = Object.values(planets).map(p => p.planet);
            const intersects = raycaster.intersectObjects(planetMeshes);

            if (intersects.length > 0) {
                const clickedPlanet = intersects[0].object;
                showPlanetInfo(clickedPlanet.userData.planetKey, clickedPlanet.userData.planetData);
            }
        });

        // Update camera in animation loop
        this.updateCamera = updateCamera;
    }

    function setupEventListeners() {
        // Speed control
        document.getElementById('speed').addEventListener('input', (e) => {
            animationSpeed = parseFloat(e.target.value);
        });

        // Planet focus
        document.getElementById('focus-planet').addEventListener('change', (e) => {
            focusedPlanet = e.target.value === 'none' ? null : e.target.value;
        });

        // Toggle orbits
        document.getElementById('toggle-orbits').addEventListener('click', () => {
            showOrbits = !showOrbits;
            orbits.forEach(orbit => {
                orbit.visible = showOrbits;
            });
        });

        // Toggle labels
        document.getElementById('toggle-labels').addEventListener('click', () => {
            showLabels = !showLabels;
            labels.forEach(label => {
                label.visible = showLabels;
            });
        });

        // Window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    function showPlanetInfo(planetKey, planetData) {
        const infoPanel = document.getElementById('planet-info');
        const nameElement = document.getElementById('planet-name');
        const detailsElement = document.getElementById('planet-details');

        nameElement.textContent = planetData.name;
        
        let detailsHTML = '';
        Object.entries(planetData.info).forEach(([key, value]) => {
            detailsHTML += `<div class="info-item"><strong>${key}:</strong> ${value}</div>`;
        });
        
        detailsElement.innerHTML = detailsHTML;
        infoPanel.classList.add('active');

        // Hide after 10 seconds
        setTimeout(() => {
            infoPanel.classList.remove('active');
        }, 10000);
    }

    function animate() {
        requestAnimationFrame(animate);

        const time = Date.now() * 0.0005 * animationSpeed;

        // Rotate planets and move them in orbits
        Object.entries(planets).forEach(([key, planetObj]) => {
            const { planet, data } = planetObj;
            
            // Self rotation
            planet.rotation.y += data.rotationSpeed * animationSpeed * 0.1;

            // Orbital motion (except for sun)
            if (key !== 'sun') {
                const distance = data.distance * DISTANCE_SCALE;
                const angle = time * data.orbitSpeed;
                
                planet.position.x = Math.cos(angle) * distance;
                planet.position.z = Math.sin(angle) * distance;

                // Update label position
                const labelIndex = Object.keys(planets).indexOf(key) - 1; // -1 because sun doesn't have label
                if (labelIndex >= 0 && labels[labelIndex]) {
                    labels[labelIndex].position.copy(planet.position);
                    labels[labelIndex].position.y += 5;
                }
            }
        });

        // Update camera controls
        if (this.updateCamera) {
            this.updateCamera();
        }

        // Update loading progress (simulation)
        const progressBar = document.querySelector('.loading-progress');
        if (progressBar && !document.getElementById('loading-screen').classList.contains('hidden')) {
            const progress = Math.min(100, (Date.now() % 2000) / 20);
            progressBar.style.width = progress + '%';
        }

        renderer.render(scene, camera);
    }


    // Planet texture configuration
    const planetTextures = {
        sun: 'textures/sun.jpg',
        mercury: 'textures/mercury.jpg',
        venus: 'textures/venus.jpg',
        earth: 'textures/earth.jpg',
        mars: 'textures/mars.jpg',
        jupiter: 'textures/jupiter.jpg',
        saturn: 'textures/saturn.jpg',
        uranus: 'textures/uranus.jpg',
        neptune: 'textures/neptune.jpg'
    };

    // Load textures with error handling
    function loadPlanetTexture(planetName, texturePath, fallbackColor) {
        return new Promise((resolve) => {
            textureLoader.load(
                texturePath,
                // Success callback
                (texture) => {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    console.log(`✓ Loaded ${planetName} texture`);
                    resolve(texture);
                },
                // Progress callback
                (progress) => {
                    const percent = (progress.loaded / progress.total * 100).toFixed(0);
                    console.log(`Loading ${planetName}: ${percent}%`);
                },
                // Error callback
                (error) => {
                    console.warn(`✗ Failed to load ${planetName} texture, using fallback`);
                    resolve(null); // Return null to use fallback color
                }
            );
        });
    }        


    function createPlanetMaterial(planetName, texture, fallbackColor, options = {}) {
    let material;
    
    if (texture) {
        if (planetName === 'sun') {
            // Sun with emissive properties
            material = new THREE.MeshBasicMaterial({
                map: texture,
                emissive: new THREE.Color(0x444444),
                emissiveMap: texture,
                emissiveIntensity: 0.3
            });
        } else if (planetName === 'earth' && options.normalMap) {
            // Earth with enhanced materials
            material = new THREE.MeshPhongMaterial({
                map: texture,
                normalMap: options.normalMap,
                specularMap: options.specularMap,
                shininess: 100,
                transparent: true,
                opacity: 1.0
            });
        } else {
            // Standard planets
            material = new THREE.MeshLambertMaterial({
                map: texture
            });
        }
    } else {
        // Fallback to solid color if texture fails
        if (planetName === 'sun') {
            material = new THREE.MeshBasicMaterial({
                color: fallbackColor,
                emissive: fallbackColor,
                emissiveIntensity: 0.3
            });
        } else {
            material = new THREE.MeshLambertMaterial({
                color: fallbackColor
            });
        }
    }
    
    return material;
}

    function createEarthWithAtmosphere(earthMesh) {
    // Create atmosphere geometry (slightly larger than Earth)
    const atmosphereGeometry = new THREE.SphereGeometry(
        earthMesh.geometry.parameters.radius * 1.05, 32, 32
    );
    
    // Atmosphere shader material
    const atmosphereMaterial = new THREE.ShaderMaterial({
        uniforms: {
            viewVector: { type: "v3", value: camera.position }
        },
        vertexShader: `
            uniform vec3 viewVector;
            varying float intensity;
            void main() {
                gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
                vec3 actual_normal = vec3(modelMatrix * vec4(normal, 0.0));
                intensity = pow(dot(normalize(viewVector), actual_normal), 2.0);
            }
        `,
        fragmentShader: `
            varying float intensity;
            void main() {
                vec3 glow = vec3(0.3, 0.6, 1.0) * intensity;
                gl_FragColor = vec4(glow, 0.3);
            }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
    });

    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earthMesh.add(atmosphere);
    }

    function createSaturnRings(saturnMesh, ringTexture) {
    const planetRadius = saturnMesh.geometry.parameters.radius;
    const ringGeometry = new THREE.RingGeometry(
        planetRadius * 1.2,  // Inner radius
        planetRadius * 2.2,  // Outer radius
        64                   // Segments for smooth appearance
    );

    let ringMaterial;
    if (ringTexture) {
        ringMaterial = new THREE.MeshLambertMaterial({
            map: ringTexture,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.8
        });
    } else {
        // Fallback ring
        ringMaterial = new THREE.MeshLambertMaterial({
            color: 0xaaaaaa,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.6
        });
    }

    const rings = new THREE.Mesh(ringGeometry, ringMaterial);
    rings.rotation.x = Math.PI / 2; // Rotate to horizontal
    saturnMesh.add(rings);
    }



            // ========================================
    // STEP 8: Loading Progress Functions
    // ========================================
    function updateLoadingProgress(percentage, text) {
        const progressBar = document.querySelector('.loading-progress');
        const loadingText = document.getElementById('loading-text');
        
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
        
        if (loadingText && text) {
            loadingText.textContent = text;
        }
        
        console.log(`Loading progress: ${percentage.toFixed(0)}% - ${text}`);
    }

    function hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            if (loadingScreen) {
                loadingScreen.classList.add('hidden');
                console.log('Loading screen hidden - Solar System ready!');
            }
        }, 1000);
    }

    function optimizeTexture(texture) {
    // Enable mipmapping for better performance at distance
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;
    
    // Set wrapping mode
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    
    return texture;
    }
