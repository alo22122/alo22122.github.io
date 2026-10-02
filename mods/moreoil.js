// 1. THE MAIN MIXTURE
elements.crude_oil = {
    color: "#14110f",
    behavior: behaviors.LIQUID,
    category: "liquids",
    viscosity: 100,        // Niedrigere Viskosität im kalten Zustand für besseres Fließen
    density: 500,          // Basis-Dichte für den Mix
    state: "liquid",
};

// Logik zur Aufspaltung und zum physikalischen Verschwinden
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

// 2. THE FRACTIONS (GASES & LIQUIDS)

// --- Petroleum Gas ---
elements.petroleum_gas = {
    color: "#f0f5da",
    behavior: behaviors.GAS,
    category: "gases",
    state: "gas",
    density: 1,            // Extrem leicht, schießt nach oben
    cooldown: 5,
    tempHigh: 120,
    stateHigh: "gasoline_vapor"
};

// --- Gasoline ---
elements.liquid_gasoline = {
    color: "#e6c963",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 200,          // Sehr leicht, schwimmt auf JEDER anderen Flüssigkeit
    viscosity: 10,
    tempHigh: 120,
    stateHigh: "gasoline_vapor"
};
elements.gasoline_vapor = {
    color: "#f2ebd5",
    behavior: behaviors.GAS,
    category: "gases",
    density: 5, 
    cooldown: 4,
    tempLow: 115, 
    stateLow: "liquid_gasoline"
};

// --- Kerosene ---
elements.liquid_kerosene = {
    color: "#b0d4de",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 400,          // Mittelschwer, sinkt unter Benzin, schwimmt auf Diesel
    viscosity: 20,
    tempHigh: 200,
    stateHigh: "kerosene_vapor"
};
elements.kerosene_vapor = {
    color: "#cbdbe0",
    behavior: behaviors.GAS,
    category: "gases",
    density: 10,
    cooldown: 3,
    tempLow: 195, 
    stateLow: "liquid_kerosene"
};

// --- Diesel ---
elements.liquid_diesel = {
    color: "#7fa682",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 600,          // Schwerer als Kerosin, sinkt darunter ab
    viscosity: 40,
    tempHigh: 350,
    stateHigh: "diesel_vapor"
};
elements.diesel_vapor = {
    color: "#b0c2b2",
    behavior: behaviors.GAS,
    category: "gases",
    density: 15, 
    cooldown: 2,
    tempLow: 345, 
    stateLow: "liquid_diesel"
};

// --- Heavy Residues ---
elements.heavy_fuel_oil = {
    color: "#24201c",
    behavior: behaviors.LIQUID,
    category: "liquids",
    viscosity: 5,          // Extrem flüssig gemacht, damit es im heißen Turm sofort nach unten wegrutscht
    density: 800,          // Deutlich schwerer als Diesel, sinkt radikal nach unten
};

elements.heavy_fuel_oil.tick = function(pixel) {
    if (pixel.temp >= 450 && Math.random() < 0.1) {
        changePixel(pixel, "bitumen");
    }
};

// --- Bitumen ---
elements.bitumen = {
    color: "#0a0908",
    behavior: behaviors.LIQUID, 
    category: "solids",
    viscosity: 5000,          
    density: 1200,         // Der absolute Spitzenreiter: Sinkt unaufhaltsam durch alles hindurch an den Boden
    state: "liquid"
};
