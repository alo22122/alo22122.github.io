// ==========================================
// 1. DIE ÖLQUELLE & BERGBAU-ELEMENTE
// ==========================================

elements.oil_shale = {
    color: "#374151",
    behavior: behaviors.WALL,
    category: "solids",
    state: "solid",
    tempHigh: 500,
    stateHigh: "ash"
};

elements.oil_shale.tick = function(pixel) {
    if (pixel.temp >= 20 && Math.random() < 0.2) {
        var randomDirX = Math.floor(Math.random() * 3) - 1;
        var randomDirY = Math.floor(Math.random() * 2);
        var tx = pixel.x + randomDirX;
        var ty = pixel.y + randomDirY;
        if (isEmpty(tx, ty)) {
            createPixel("crude_oil", tx, ty);
        }
    }
};

// ==========================================
// 2. DAS ROHGEMISCH & DIE EXTRAKTION
// ==========================================

elements.crude_oil = {
    color: "#14110f",
    behavior: behaviors.LIQUID,
    category: "liquids",
    viscosity: 10,
    density: 500,
    state: "liquid",
    reactions: {
        "water": { elem1: "crude_oil", elem2: "crude_oil", chance: 0.05 },
        "algae": { elem1: "crude_oil", elem2: "mud", chance: 0.3 },
        "sulfur": { elem1: "crude_oil", elem2: "sour_gas", chance: 0.1 }
    }
};

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
// 3. DIE SPEZIAL-SÄURE & PLASTIK-SYNTHESE
// ==========================================

elements.hydrofluoric_acid = {
    color: "#4ade80",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 450,
    viscosity: 5,
    state: "liquid",
    reactions: {
        "plant": { elem1: "fire", elem2: "ash", chance: 0.3 },
        "wood": { elem1: "fire", elem2: "ash", chance: 0.2 }
    }
};

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
    fireColor: "#0066ff",
    noBreak: true,
    reactions: {
        "fire": { elem1: "fire", elem2: "carbon_dioxide", chance: 0.5 },
        "spark": { elem1: "fire", elem2: "carbon_dioxide", chance: 0.8 },
        "hydrofluoric_acid": { elem1: "plastic_slurry", elem2: "hydrofluoric_acid", chance: 0.12 }
    }
};

// ==========================================
// 4. SYNTHETISCHE & ALTERNATIVE TREIBSTOFFE
// ==========================================

elements.synthetic_gas = {
    color: "#cbd5e1",
    behavior: behaviors.GAS,
    category: "gases",
    state: "gas",
    density: 2,
    burn: 100,
    burnTime: 8,
    fireColor: "#38bdf8",
    noBreak: true
};

if (elements.coal) {
    if (!elements.coal.reactions) elements.coal.reactions = {};
    elements.coal.reactions.steam = { elem1: "ash", elem2: "synthetic_gas", chance: 0.15 };
}
if (elements.charcoal) {
    if (!elements.charcoal.reactions) elements.charcoal.reactions = {};
    elements.charcoal.reactions.steam = { elem1: "ash", elem2: "synthetic_gas", chance: 0.15 };
}

elements.liquid_biodiesel = {
    color: "#facc15",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 250,
    viscosity: 2,
    burn: 90,
    burnTime: 100,
    fireColor: "#fbbf24",
    state: "liquid",
    reactions: {
        "fire": { elem1: "fire", elem2: "steam", chance: 0.2 }
    }
};

if (elements.vegetable_oil) {
    if (!elements.vegetable_oil.reactions) elements.vegetable_oil.reactions = {};
    elements.vegetable_oil.reactions.alcohol = { 
        elem1: "liquid_biodiesel", 
        elem2: "liquid_biodiesel", 
        chance: 0.2,
        requires: "hydrofluoric_acid"
    };
}

// ==========================================
// 5. STANDARD-TREIBSTOFFE & HYDROCRACKING
// ==========================================

elements.liquid_gasoline = {
    color: "#e6c963",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 100,
    viscosity: 1,
    tempHigh: 120,
    stateHigh: "gasoline_vapor",
    burn: 150,
    burnTime: 15,
    fireColor: "#ff4400",
    state: "liquid",
    reactions: {
        "fire": { elem1: "explosion", chance: 0.4 },
        "spark": { elem1: "explosion", chance: 0.7 },
        "sulfur": { elem1: "petroleum_rubber", elem2: "petroleum_rubber", chance: 0.15 }
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

elements.liquid_kerosene = {
    color: "#b0d4de",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 200,
    viscosity: 1,
    tempHigh: 200,
    stateHigh: "kerosene_vapor",
    burn: 110,
    burnTime: 45,
    fireColor: "#ffaa00",
    state: "liquid",
    reactions: {
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
    noBreak: true,
    reactions: {
        "fire": { elem1: "fire", elem2: "steam", chance: 0.5 }
    }
};

elements.liquid_diesel = {
    color: "#7fa682",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 300,
    viscosity: 2,
    tempHigh: 350,
    stateHigh: "diesel_vapor",
    burn: 80,
    burnTime: 120,
    fireColor: "#ff7700",
    state: "liquid",
    reactions: {
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
    noBreak: true,
    reactions: {
        "steam": { elem1: "gasoline_vapor", elem2: "gasoline_vapor", chance: 0.35 }
    }
};

// ==========================================
// 6. SCHWERÖLE, PETROKOKS & LÖSUNGSMITTEL
// ==========================================

elements.heavy_fuel_oil = {
    color: "#24201c",
    behavior: behaviors.LIQUID,
    category: "liquids",
    viscosity: 2,
    density: 700,
    reactions: {
        "sulfur": { elem1: "bunker_fuel", elem2: "bunker_fuel", chance: 0.15 }
    }
};

elements.heavy_fuel_oil.tick = function(pixel) {
    if (pixel.temp >= 450 && Math.random() < 0.1) {
        changePixel(pixel, "bitumen");
    }
};

elements.bunker_fuel = {
    color: "#1c1816",
    behavior: behaviors.LIQUID,
    category: "liquids",
    viscosity: 5,
    density: 850,
    burn: 50,
    burnTime: 400,
    fireColor: "#9a3412",
    reactions: {
        "fire": { elem1: "smoke", elem2: "exhaust_fumes", chance: 0.4 }
    }
};

elements.bitumen = {
    color: "#0a0908",
    behavior: behaviors.LIQUID, 
    category: "solids",
    viscosity: 10,          
    density: 1200,
    state: "liquid",
    tempHigh: 500,
    stateHigh: "petroleum_coke",
    reactions: {
        "sand": { elem1: "asphalt_pavement", elem2: "asphalt_pavement", chance: 0.2 },
        "gravel": { elem1: "asphalt_pavement", elem2: "asphalt_pavement", chance: 0.2 },
        "solvent_naphtha": { elem1: "heavy_fuel_oil", elem2: "heavy_fuel_oil", chance: 0.8 }
    }
};

elements.asphalt_pavement = {
    color: "#292929",
    behavior: behaviors.WALL,
    category: "solids",
    state: "solid"
};

elements.petroleum_coke = {
    color: "#1e293b",
    behavior: behaviors.POWDER,
    category: "solids",
    state: "solid",
    density: 900,
    burn: 110,
    burnTime: 250,
    fireColor: "#e11d48"
};

elements.solvent_naphtha = {
    color: "#e2e8f0",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 400,
    viscosity: 1,
    state: "liquid"
};

// ==========================================
// 7. INDUSTRIE- & INDUSTRIEGASE
// ==========================================

elements.plastic_slurry = {
    color: "#d9e3db",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 350,
    tempLow: 50,
    stateLow: "petroleum_plastic"
};
elements.petroleum_plastic = {
    color: "#d9e3db",
    behavior: behaviors.WALL,
    category: "solids",
    state: "solid",
    tempHigh: 160,
    stateHigh: "plastic_slurry"
};

elements.petroleum_rubber = {
    color: "#403d39",
    behavior: behaviors.WALL,
    category: "solids",
    state: "solid",
    burn: 20,
    burnTime: 80
};

elements.exhaust_fumes = {
    color: "#6b7280",
    behavior: behaviors.GAS,
    category: "gases",
    state: "gas",
    density: 2,
    noBreak: true,
    reactions: {
        "plant": { elem1: "smoke", elem2: "dead_plant", chance: 0.1 },
        "grass": { elem1: "smoke", elem2: "dirt", chance: 0.1 },
        "wood": { elem1: "smoke", elem2: "ash", chance: 0.05 },
        "water": { elem1: "ammonium_nitrate_fertilizer", elem2: "ammonium_nitrate_fertilizer", chance: 0.05 }
    }
};

elements.ammonium_nitrate_fertilizer = {
    color: "#f3f4f6",
    behavior: behaviors.POWDER,
    category: "solids",
    state: "solid",
reactions: {
"soil": { elem1: "grass", elem2: "soil", chance: 0.5 },
"dirt": { elem1: "grass", elem2: "dirt", chance: 0.5 }
}
};
elements.sour_gas = {
color: "#dbf2ad",
behavior: behaviors.GAS,
category: "gases",
state: "gas",
density: 1.5,
noBreak: true,
reactions: {
"water": { elem1: "hydrofluoric_acid", elem2: "hydrofluoric_acid", chance: 0.3 }
}
};
