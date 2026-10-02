// ==========================================
// 1. DIE ROHSTOFFE & FLÜSSIGKEITEN
// ==========================================

// --- Rohöl (Crude Oil) ---
elements.crude_oil = {
    color: "#1a130e",
    behavior: behaviors.LIQUID,
    category: "liquids",
    viscosity: 150,
    density: 500,
    state: "liquid",
    reactions: {
        // Ölpest-Mechanik: Wenn Rohöl Wasser oder Algen berührt, tötet es das Leben
        "water": { elem1: "crude_oil", elem2: "crude_oil", chance: 0.05 },
        "algae": { elem1: "crude_oil", elem2: "mud", chance: 0.3 },
        "sulfur": { elem1: "crude_oil", elem2: "sour_gas", chance: 0.1 } // Schwefel macht es zu saurem Gas
    }
};

// Fraktionierungs-Tick für das Rohöl
elements.crude_oil.tick = function(pixel) {
    if (Math.random() < 0.15) {
        if (isEmpty(pixel.x, pixel.y - 1)) {
            if (pixel.temp >= 350) {
                createPixel("diesel_vapor", pixel.x, pixel.y - 1);
                changePixel(pixel, "heavy_fuel_oil");
            } else if (pixel.temp >= 200) {
                createPixel("kerosene_vapor", pixel.x, pixel.y - 1);
                if (Math.random() < 0.3) changePixel(pixel, "heavy_fuel_oil");
            } else if (pixel.temp >= 120) {
                createPixel("gasoline_vapor", pixel.x, pixel.y - 1);
                if (Math.random() < 0.2) changePixel(pixel, "heavy_fuel_oil");
            } else if (pixel.temp >= 45) {
                createPixel("petroleum_gas", pixel.x, pixel.y - 1);
                if (Math.random() < 0.1) changePixel(pixel, "heavy_fuel_oil");
            }
        }
    }
};

// ==========================================
// 2. DIE DESTILLATE & IHRE VERBRENNUNG
// ==========================================

// --- Flüssiggas (Petroleum Gas) ---
elements.petroleum_gas = {
    color: "#f0f5da",
    behavior: behaviors.GAS,
    category: "gases",
    state: "gas",
    density: 1,
    cooldown: 5,
    tempHigh: 120,
    stateHigh: "gasoline_vapor",
    burn: 120,
    burnTime: 10,
    fireColor: "#0066ff", // Brennt heiß und blau!
    reactions: {
        "fire": { elem1: "fire", elem2: "carbon_dioxide", chance: 0.5 },
        "spark": { elem1: "fire", elem2: "carbon_dioxide", chance: 0.8 },
        "acid": { elem1: "plastic_slurry", elem2: "acid", chance: 0.08 }, // Plastik-Herstellung
        "chlorine": { elem1: "plastic_slurry", elem2: "hydrochloric_acid", chance: 0.08 }
    },
    noBreak: true
};

// --- Benzin (Gasoline) ---
elements.liquid_gasoline = {
    color: "#e6c963",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 10, // Extrem leicht, schwimmt auf ALLEM (Mayo-Trick)
    viscosity: 5,
    tempHigh: 120,
    stateHigh: "gasoline_vapor",
    burn: 150,
    burnTime: 15,
    fireColor: "#ff4400",
    reactions: {
        "fire": { elem1: "explosion", chance: 0.4 }, // Hochentzündliche Verpuffung!
        "spark": { elem1: "explosion", chance: 0.7 },
        "sulfur": { elem1: "petroleum_rubber", elem2: "petroleum_rubber", chance: 0.15 } // Gummi-Synthese
    }
};
elements.gasoline_vapor = {
    color: "#f2ebd5",
    behavior: behaviors.GAS,
    category: "gases",
    density: 5, 
    cooldown: 4,
    tempLow: 115, 
    stateLow: "liquid_gasoline",
    burn: 160,
    burnTime: 5,
    fireColor: "#ff3300",
    reactions: {
        "fire": { elem1: "explosion", chance: 0.8 },
        "spark": { elem1: "explosion", chance: 0.95 }
    },
    noBreak: true
};

// --- Kerosin (Flugtreibstoff) ---
elements.liquid_kerosene = {
    color: "#b0d4de",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 30,
    viscosity: 15,
    tempHigh: 200,
    stateHigh: "kerosene_vapor",
    burn: 110,
    burnTime: 45,
    fireColor: "#ffaa00",
    reactions: {
        // Erzeugt enorm viel heißen Dampf und Auftrieb beim Verbrennen!
        "fire": { elem1: "fire", elem2: "steam", chance: 0.3 }
    }
};
elements.kerosene_vapor = {
    color: "#cbdbe0",
    behavior: behaviors.GAS,
    category: "gases",
    density: 10,
    cooldown: 3,
    tempLow: 195, 
    stateLow: "liquid_kerosene",
    burn: 120,
    burnTime: 20,
    reactions: {
        "fire": { elem1: "fire", elem2: "steam", chance: 0.5 }
    },
    noBreak: true
};

// --- Diesel ---
elements.liquid_diesel = {
    color: "#7fa682",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 60,
    viscosity: 30,
    tempHigh: 350,
    stateHigh: "diesel_vapor",
    burn: 80,
    burnTime: 120, // Brennt sehr lange
    fireColor: "#ff7700",
    reactions: {
        // Ruß- und Abgas-Entwicklung
        "fire": { elem1: "smoke", elem2: "exhaust_fumes", chance: 0.25 }
    }
};
elements.diesel_vapor = {
    color: "#b0c2b2",
    behavior: behaviors.GAS,
    category: "gases",
    density: 15, 
    cooldown: 2,
    tempLow: 345, 
    stateLow: "liquid_diesel",
    noBreak: true
};

// ==========================================
// 3. SCHWERÖL, BITUMEN & ASPHALT
// ==========================================

elements.heavy_fuel_oil = {
    color: "#24201c",
    behavior: behaviors.LIQUID,
    category: "liquids",
    viscosity: 50,
    density: 200,
};

elements.heavy_fuel_oil.tick = function(pixel) {
    if (pixel.temp >= 450 && Math.random() < 0.1) {
        changePixel(pixel, "bitumen");
    }
};

elements.bitumen = {
    color: "#0a0908",
    behavior: behaviors.LIQUID, 
    category: "solids",
    viscosity: 5000,          
    density: 1000, 
    state: "liquid",
    reactions: {
        "sand": { elem1: "asphalt_pavement", elem2: "asphalt_pavement", chance: 0.2 }, // Straßenbau
        "gravel": { elem1: "asphalt_pavement", elem2: "asphalt_pavement", chance: 0.2 }
    }
};

elements.asphalt_pavement = {
    color: "#292929",
    behavior: behaviors.WALL,
    category: "solids",
    state: "solid"
};

// ==========================================
// 4. INDUSTRIE- & SYNTHETIK-ELEMENTE
// ==========================================

// --- Plastik ---
elements.plastic_slurry = {
    color: "#d9e3db",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 90,
    tempLow: 50,
    stateLow: "petroleum_plastic" // Härtet beim Abkühlen aus
};
elements.petroleum_plastic = {
    color: "#d9e3db",
    behavior: behaviors.WALL,
    category: "solids",
    state: "solid",
    tempHigh: 160,
    stateHigh: "plastic_slurry"
};

// --- Gummi ---
elements.petroleum_rubber = {
    color: "#403d39",
    behavior: behaviors.WALL,
    category: "solids",
    state: "solid",
    burn: 20,
    burnTime: 80
};

// --- Katalysator-Block (Cracking) ---
elements.cracking_catalyst = {
    color: "#9ca3af",
    behavior: behaviors.WALL,
    category: "solids",
    state: "solid",
    reactions: {
        // Spaltet schweren Diesel-Dampf in zwei leichte Benzin-Dämpfe auf!
        "diesel_vapor": { elem1: "cracking_catalyst", elem2: "gasoline_vapor", chance: 0.4 }
    }
};

// ==========================================
// 5. UMWELT- & UMWELTVERSCHMUTZUNGS-ELEMENTE
// ==========================================

// --- Abgase (Exhaust Fumes) ---
elements.exhaust_fumes = {
    color: "#6b7280",
    behavior: behaviors.GAS,
    category: "gases",
    state: "gas",
    density: 2,
    reactions: {
        // Tötet Pflanzen ab
        "plant": { elem1: "smoke", elem2: "dead_plant", chance: 0.1 },
        "grass": { elem1: "smoke", elem2: "dirt", chance: 0.1 },
        "wood": { elem1: "smoke", elem2: "ash", chance: 0.05 },
        // Kunstdünger-Synthese mit Wasser
        "water": { elem1: "ammonium_nitrate_fertilizer", elem2: "ammonium_nitrate_fertilizer", chance: 0.05 }
    },
    noBreak: true
};

// --- Kunstdünger (Fertilizer) ---
elements.ammonium_nitrate_fertilizer = {
    color: "#f3f4f6",
    behavior: behaviors.POWDER,
    category: "solids",
    state: "solid",
    reactions: {
        // Lässt Pflanzen bei Kontakt gigantisch wachsen/sprießen
        "soil": { elem1: "grass", elem2: "soil", chance: 0.5 },
        "dirt": { elem1: "grass", elem2: "dirt", chance: 0.5 }
    }
};

// --- Saures Gas (Sour Gas) ---
elements.sour_gas = {
    color: "#dbf2ad",
    behavior: behaviors.GAS,
    category: "gases",
    state: "gas",
    density: 1.5,
    reactions: {
        // Verwandelt sich mit Wasser/Regen in ätzenden sauren Regen!
        "water": { elem1: "acid", elem2: "acid", chance: 0.3 }
    },
    noBreak: true
};
