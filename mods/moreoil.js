// 1. THE MAIN MIXTURE
elements.crude_oil = {
    color: "#14110f",
    behavior: behaviors.LIQUID,
    category: "liquids",
    viscosity: 100,
    density: 500, // Mittlere Dichte für das Rohgemisch
    state: "liquid",
};

// Reines, stabiles Verdampfen ohne Sortier-Spaghetti
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
// Wir nutzen hier exakt dieselbe Physik-Konfiguration wie das Basisspiel für Mayonnaise/Wasser!

// --- Petroleum Gas ---
elements.petroleum_gas = {
    color: "#f0f5da",
    behavior: behaviors.GAS,
    category: "gases",
    state: "gas",
    density: 1,
    cooldown: 5,
    tempHigh: 120,
    stateHigh: "gasoline_vapor"
};

// --- Gasoline ---
elements.liquid_gasoline = {
    color: "#e6c963",
    behavior: behaviors.LIQUID, // Nutzt das native flüssige Verhalten wie Mayonnaise
    category: "liquids",
    density: 10,  // Extrem niedrig! Schwimmt dadurch radikal auf ALLEM
    viscosity: 5,
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
    density: 30,  // Höher als Benzin, sinkt darunter, schwimmt auf Diesel
    viscosity: 15,
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
    density: 60,  // Höher als Kerosin
    viscosity: 30,
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
    viscosity: 50,
    density: 200, // Sinkt unter alle Treibstoffe
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
    density: 1000, // Der absolute Bodenwert – sinkt wie ein Stein durch jede Flüssigkeit
    state: "liquid"
};
