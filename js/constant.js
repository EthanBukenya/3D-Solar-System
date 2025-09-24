        // Planet data with realistic information
        const planetData = {
            sun: {
                name: 'Sun',
                radius: 696340,
                distance: 0,
                color: 0xfdb813,
                rotationSpeed: 0.004,
                orbitSpeed: 0,
                info: {
                    type: 'Star',
                    diameter: '1.39 million km',
                    temperature: '5,778 K (surface)',
                    composition: '73% Hydrogen, 25% Helium',
                    age: '4.6 billion years'
                }
            },
            mercury: {
                name: 'Mercury',
                radius: 2440,
                distance: 57.9,
                color: 0x8c7853,
                rotationSpeed: 0.01,
                orbitSpeed: 0.04,
                info: {
                    type: 'Terrestrial Planet',
                    diameter: '4,879 km',
                    temperature: '-173°C to 427°C',
                    dayLength: '58.6 Earth days',
                    yearLength: '88 Earth days'
                }
            },
            venus: {
                name: 'Venus',
                radius: 6052,
                distance: 108.2,
                color: 0xffc649,
                rotationSpeed: 0.007,
                orbitSpeed: 0.035,
                info: {
                    type: 'Terrestrial Planet',
                    diameter: '12,104 km',
                    temperature: '462°C (hottest planet)',
                    dayLength: '243 Earth days',
                    yearLength: '225 Earth days'
                }
            },
            earth: {
                name: 'Earth',
                radius: 6371,
                distance: 149.6,
                color: 0x6b93d6,
                rotationSpeed: 0.02,
                orbitSpeed: 0.03,
                info: {
                    type: 'Terrestrial Planet',
                    diameter: '12,742 km',
                    temperature: '-88°C to 58°C',
                    dayLength: '24 hours',
                    yearLength: '365.25 days'
                }
            },
            mars: {
                name: 'Mars',
                radius: 3390,
                distance: 227.9,
                color: 0xcd5c5c,
                rotationSpeed: 0.018,
                orbitSpeed: 0.024,
                info: {
                    type: 'Terrestrial Planet',
                    diameter: '6,779 km',
                    temperature: '-140°C to 20°C',
                    dayLength: '24.6 hours',
                    yearLength: '687 Earth days'
                }
            },
            jupiter: {
                name: 'Jupiter',
                radius: 69911,
                distance: 778.5,
                color: 0xd8ca9d,
                rotationSpeed: 0.04,
                orbitSpeed: 0.013,
                info: {
                    type: 'Gas Giant',
                    diameter: '139,820 km',
                    temperature: '-145°C',
                    dayLength: '9.9 hours',
                    yearLength: '11.9 Earth years'
                }
            },
            saturn: {
                name: 'Saturn',
                radius: 58232,
                distance: 1432,
                color: 0xfad5a5,
                rotationSpeed: 0.038,
                orbitSpeed: 0.0096,
                info: {
                    type: 'Gas Giant',
                    diameter: '116,460 km',
                    temperature: '-178°C',
                    dayLength: '10.7 hours',
                    yearLength: '29.5 Earth years'
                }
            },
            uranus: {
                name: 'Uranus',
                radius: 25362,
                distance: 2867,
                color: 0x4fd0e3,
                rotationSpeed: 0.03,
                orbitSpeed: 0.0068,
                info: {
                    type: 'Ice Giant',
                    diameter: '50,724 km',
                    temperature: '-224°C',
                    dayLength: '17.2 hours',
                    yearLength: '84 Earth years'
                }
            },
            neptune: {
                name: 'Neptune',
                radius: 24622,
                distance: 4515,
                color: 0x4b70dd,
                rotationSpeed: 0.032,
                orbitSpeed: 0.0054,
                info: {
                    type: 'Ice Giant',
                    diameter: '49,244 km',
                    temperature: '-214°C',
                    dayLength: '16.1 hours',
                    yearLength: '164.8 Earth years'
                }
            }
        };

        const planetTextureConfig = {
            sun: {
                texture: 'textures/sun.jpg',
                fallbackColor: 0xfdb813,
                emissive: true
            },
            mercury: {
                texture: 'textures/mercury.jpg',
                fallbackColor: 0x8c7853
            },
            venus: {
                texture: 'textures/venus.jpg',
                fallbackColor: 0xffc649
            },
            earth: {
                texture: 'textures/earth.jpg',
                normalMap: 'textures/earth-normal.jpg', // optional
                specularMap: 'textures/earth-specular.jpg', // optional
                fallbackColor: 0x6b93d6,
                hasAtmosphere: true
            },
            mars: {
                texture: 'textures/mars.jpg',
                fallbackColor: 0xcd5c5c
            },
            jupiter: {
                texture: 'textures/jupiter.jpg',
                fallbackColor: 0xd8ca9d
            },
            saturn: {
                texture: 'textures/saturn.jpg',
                ringTexture: 'textures/saturn-ring.png',
                fallbackColor: 0xfad5a5,
                hasRings: true
            },
            uranus: {
                texture: 'textures/uranus.jpg',
                ringTexture: 'textures/uranus-ring.png',
                fallbackColor: 0x4fd0e3,
                hasRings: true
            },
            neptune: {
                texture: 'textures/neptune.jpg',
                fallbackColor: 0x4b70dd
            }
        };
