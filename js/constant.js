
// constant.js - Enhanced with more realistic data
export const basicInformation = {
    sun: {
    description:
      "The Sun is the star at the center of our Solar System. It is a nearly perfect sphere of hot plasma, with internal convective motion that generates a magnetic field via a dynamo process.",
    radius: "696,340 km",
    distanceFromSun: "0 km",
    mass: "333,000 Earth masses",
    temperatureRange: "5500°C - 15 million°C",
    dayLength: "25 days (at the equator)",
    yearLength: "365.25 Earth days",
    missions: 0,
  },
  mercury: {
    description:
      "Mercury is the smallest and innermost planet in the Solar System. It is named after the Roman deity Mercury, the messenger of the gods.",
    radius: "2439.7 km",
    distanceFromSun: "57.9 million km",
    mass: "0.330 Earth masses",
    temperatureRange: "-173°C to 427°C",
    dayLength: "4222.6 hours",
    yearLength: "88 Earth days",
    missions: 4,
  },
  venus: {
    description:
      "Venus is the second planet from the Sun. It is named after the Roman goddess of love and beauty.",
    radius: "6051.8 km",
    distanceFromSun: "108.2 million km",
    mass: "4.87 Earth masses",
    temperatureRange: "462°C",
    dayLength: "2802 hours",
    yearLength: "225 Earth days",
    missions: 43,
  },
  earth: {
    description:
      "Earth is the third planet from the Sun and the only astronomical object known to harbor life.",
    radius: "6371 km",
    distanceFromSun: "149.6 million km",
    mass: "1 Earth mass",
    temperatureRange: "-88°C to 58°C",
    dayLength: "24 hours",
    yearLength: "365.25 days",
    missions: 0,
  },
  mars: {
    description:
      "Mars is the fourth planet from the Sun. It is often referred to as the 'Red Planet' because of its reddish appearance.",
    radius: "3389.5 km",
    distanceFromSun: "227.9 million km",
    mass: "0.107 Earth masses",
    temperatureRange: "-140°C to 20°C",
    dayLength: "24.6 hours",
    yearLength: "687 Earth days",
    missions: 60,
  },
  jupiter: {
    description:
      "Jupiter is the largest planet in the Solar System. It is a gas giant with a strong magnetic field.",
    radius: "69911 km",
    distanceFromSun: "778.5 million km",
    mass: "318 Earth masses",
    temperatureRange: "-145°C",
    dayLength: "9.9 hours",
    yearLength: "11.9 Earth years",
    missions: 9,
  },
  saturn: {
    description:
      "Saturn is the sixth planet from the Sun. It is known for its prominent ring system, which is made up of ice particles and dust.",
    radius: "58232 km",
    distanceFromSun: "1433.5 million km",
    mass: "95 Earth masses",
    temperatureRange: "-178°C",
    dayLength: "10.7 hours",
    yearLength: "29.5 Earth years",
    missions: 7,
  },
  uranus: {
    description:
      "Uranus is the seventh planet from the Sun. It is an ice giant and is unique among the planets in the Solar System because it rotates on its side.",
    radius: "25362 km",
    distanceFromSun: "2872.5 million km",
    mass: "14 Earth masses",
    temperatureRange: "-224°C",
    dayLength: "17.2 hours",
    yearLength: "84 Earth years",
    missions: 2,
  },
  neptune: {
    description:
      "Neptune is the eighth and farthest planet from the Sun in the Solar System. It is similar in composition to Uranus.",
    radius: "24622 km",
    distanceFromSun: "4495.1 million km",
    mass: "17 Earth masses",
    temperatureRange: "-214°C",
    dayLength: "16.1 hours",
    yearLength: "164.8 Earth years",
    missions: 1,
  },
  pluto: {
    description:
      "Pluto is a dwarf planet in our Solar System and was formerly considered the ninth planet. It was reclassified as a dwarf planet by the International Astronomical Union (IAU) in 2006.",
    radius: "1186 km",
    distanceFromSun: "5906 million km",
    mass: "0.0025 Earth masses",
    temperatureRange: "-233°C to -223°C",
    dayLength: "153.3 hours",
    yearLength: "248 Earth years",
    missions: 1,
  },
};

export const constant = {
  approx: {
    sizeConst: 1,
    distanceConst: 1,
    selfRotateConst: 1,
    rotaingSpeedAroundSunConst: 1,
    max_view: 1000,
    max_speed: 20,
    min_speed: -2,
    point_light_limit: 300,
  },
  real: {
    sizeConst: 0.0005, // Much smaller scale for realistic sizes
    distanceConst: 0.0001, // Much smaller scale for realistic distances
    selfRotateConst: 0.01,
    rotaingSpeedAroundSunConst: 0.000075, // Slower for realistic orbits
    max_view: 10000000,
    max_speed: 100000,
    min_speed: -5000,
    point_light_limit: 15000000,
  },
};

export const sunData = {
  approx: 15,
  real: 0.696, // Real sun radius in 1000km units
};

// Enhanced planet data with realistic values
export const realisticPlanetData = {
  real: [
    {
      radius: 2.4397, // in 1000km
      distance: 57.9, // in million km
      eccentricity: 0.2056,
      inclination: 7.0,
      tilt: 0.034,
      planet_name: "mercury",
      rsas: 0.00043,
      srs: 0.01083,
    },
    {
      radius: 6.0518,
      distance: 108.2,
      eccentricity: 0.0067,
      inclination: 3.39,
      tilt: 177.4,
      planet_name: "venus",
      rsas: 0.00035,
      srs: -0.24302,
    },
    {
      radius: 6.371,
      distance: 149.6,
      eccentricity: 0.0167,
      inclination: 0.0,
      tilt: 23.44,
      planet_name: "earth",
      rsas: 0.00029,
      srs: 1.0,
    },
    {
      radius: 3.3895,
      distance: 227.9,
      eccentricity: 0.0935,
      inclination: 1.85,
      tilt: 25.19,
      planet_name: "mars",
      rsas: 0.00024,
      srs: 1.03,
    },
    {
      radius: 69.911,
      distance: 778.3,
      eccentricity: 0.0489,
      inclination: 1.31,
      tilt: 3.13,
      planet_name: "jupiter",
      rsas: 0.00002,
      srs: 0.04,
    },
    {
      radius: 58.232,
      distance: 1427,
      eccentricity: 0.0565,
      inclination: 2.49,
      tilt: 26.73,
      planet_name: "saturn",
      ring: {
        innerRadius: 74.658,
        outerRadius: 136.780,
        ringmat: saturnRingTexture,
      },
      rsas: 0.000009,
      srs: 0.038,
    },
    {
      radius: 25.362,
      distance: 2870,
      eccentricity: 0.0457,
      inclination: 0.77,
      tilt: 97.77,
      planet_name: "uranus",
      ring: {
        innerRadius: 38.226,
        outerRadius: 51.149,
        ringmat: uranusRingTexture,
      },
      rsas: 0.000004,
      srs: 0.03,
    },
    {
      radius: 24.622,
      distance: 4496,
      eccentricity: 0.0113,
      inclination: 1.77,
      tilt: 28.32,
      planet_name: "neptune",
      rsas: 0.000001,
      srs: 0.032,
    },
    {
      radius: 1.186,
      distance: 5906,
      eccentricity: 0.2488,
      inclination: 17.16,
      tilt: 122.53,
      planet_name: "pluto",
      rsas: 0.000007,
      srs: 0.008,
    },
  ]
};

export const select = (selector) => document.querySelector(selector);

export const showInfo = (name) => {
  const temp = basicInformation[name];
  Object.keys(temp).forEach((key) => {
    select(`.info-value.${key}`).innerText = temp[key];
  });
};