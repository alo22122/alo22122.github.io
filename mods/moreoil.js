// ==========================================
// 1. DIE REAKTIONSLOSE WAND (DESTRUCTION PROTECTION)
// ==========================================
// Gase in Sandboxels können durch Hitze Ziegelsteine zerstören. 
// Wir fügen allen neuen Gasen die Eigenschaft "noBreak: true" hinzu.
// Dadurch steigen die Dämpfe friedlich auf, ohne deine Turmwände zu sprengen!

// ==========================================
// 2. DAS ROHGEMISCH & DIE VERDAMPFUNG
// ==========================================

elements.crude_oil = {
    color: "#14110f",
    behavior: behaviors.LIQUID,
    category: "liquids",
    viscosity: 100,
    density: 500, // Mittlere Dichte, damit Rückstände perfekt nach unten sinken
    state: "liquid",
};

// Ultrastabile Verdampfungs-Logik: Das Öl verschwindet langsam Pixel für Pixel
// und hinterlässt am Boden schweres Schweröl
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
// 3. DIE TREIBSTOFFE & DIE NATIVE SORTIERUNG
// ==========================================
// Wir nutzen extrem weit gestaffelte Dichten (density).
// Dadurch rutschen leichte Flüssigkeiten sofort nach oben durch (Mayo-Trick)
// und schwere Stoffe sinken unaufhaltsam nach unten ab!

// --- Petroleum Gas (Flüssiggas precursor) ---
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
    fireColor: "#0066ff", // Brennt heiß und blau
    noBreak: true,
    reactions: {
        "fire": { elem1: "fire", elem2: "carbon_dioxide", chance: 0.5 },
        "spark": { elem1: "fire", elem2: "carbon_dioxide", chance: 0.8 },
        "acid": { elem1: "plastic_slurry", elem2: "acid", chance: 0.08 }, // Plastik-Synthese
        "chlorine": { elem1: "plastic_slurry", elem2: "hydrochloric_acid", chance: 0.08 }
    }
};

// --- Benzin (Liquid Gasoline) ---
elements.liquid_gasoline = {
    color: "#e6c963",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 10,  // Extrem leicht, schwimmt auf absolut ALLEM
    viscosity: 5,
    tempHigh: 120,
    stateHigh: "gasoline_vapor",
    burn: 150,
    burnTime: 15,
    fireColor: "#ff4400",
    reactions: {
        "fire": { elem1: "explosion", chance: 0.4 }, // Löst heftige Verpuffungen aus!
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
    noBreak: true,
    reactions: {
        "fire": { elem1: "explosion", chance: 0.8 },
        "spark": { elem1: "explosion", chance: 0.95 }
    }
};

// --- Kerosin (Flugtreibstoff) ---
elements.liquid_kerosene = {
    color: "#b0d4de",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 30, // Sinkt unter Benzin, schwimmt auf Diesel
    viscosity: 15,
    tempHigh: 200,
    stateHigh: "kerosene_vapor",
    burn: 110,
    burnTime: 45,
    fireColor: "#ffaa00",
    reactions: {
        "fire": { elem1: "fire", elem2: "steam", chance: 0.3 } // Erzeugt extrem viel Dampf/Auftrieb
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
    noBreak: true,
    reactions: {
        "fire": { elem1: "fire", elem2: "steam", chance: 0.5 }
    }
};

// --- Diesel ---
elements.liquid_diesel = {
    color: "#7fa682",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 60, // Sinkt unter Kerosin, schwimmt auf Schweröl
    viscosity: 30,
    tempHigh: 350,
    stateHigh: "diesel_vapor",
    burn: 80,
    burnTime: 120, // Brennt sehr lange
    fireColor: "#ff7700",
    reactions: {
        "fire": { elem1: "smoke", elem2: "exhaust_fumes", chance: 0.25 } // Erzeugt Ruß und Abgas
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
// 4. DIE SCHWEREN RÜCKSTÄNDE, ASPHALT & SINKEN
// ==========================================

elements.heavy_fuel_oil = {
    color: "#24201c",
    behavior: behaviors.LIQUID,
    category: "liquids",
    viscosity: 50,
    density: 200, // Schwerer als alle Treibstoffe, rutscht nach unten weg
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
    density: 1000, // Der absolute Bodenwert – sinkt unaufhaltsam durch alles hindurch
    state: "liquid",
    reactions: {
        "sand": { elem1: "asphalt_pavement", elem2: "asphalt_pavement", chance: 0.2 }, // Straßenbau-Asphalt
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
// 5. INDUSTRIELLE CHEMIEREPZEPTE & FILTRATION
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

// --- Katalysator-Block zum Cracken ---
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
// 6. DÜNGER, SOUR GAS & EFFEKTE
// ==========================================

// --- Giftige Industrieabgase ---
elements.exhaust_fumes = {
    color: "#6b7280",
    behavior: behaviors.GAS,
    category: "gases",
    state: "gas",
    density: 2,
    noBreak: true,
    reactions: {
        // Zerstört die Umwelt / Pflanzenwelt
        "plant": { elem1: "smoke", elem2: "dead_plant", chance: 0.1 },
        "grass": { elem1: "smoke", elem2: "dirt", chance: 0.1 },
        "wood": { elem1: "smoke", elem2: "ash", chance: 0.05 },
        // Kunstdünger-Herstellung bei Kontakt mit Wasser
        "water": { elem1: "ammonium_nitrate_fertilizer", elem2: "ammonium_nitrate_fertilizer", chance: 0.05 }
    }
};

// --- Kunstdünger ---
elements.ammonium_nitrate_fertilizer = {
    color: "#f3f4f6",
    behavior: behaviors.POWDER,
    category: "solids",
    state: "solid",
    reactions: {
        // Lässt den Boden rasant zu grünem Gras sprießen!
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
    noBreak: true,
    reactions: {
        // Wenn sauberes Gas mit Wasser/Regen reagiert, entsteht verätzende Säure!
        "water": { elem1: "acid", elem2: "acid", chance: 0.3 }
    }
};
