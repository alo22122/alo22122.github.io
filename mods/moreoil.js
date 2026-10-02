// 1. THE MAIN MIXTURE
elements.crude_oil = {
    color: "#14110f",
    behavior: behaviors.LIQUID,
    category: "liquids",
    viscosity: 800,
    density: 880,
    state: "liquid",
};

// Diese Logik verbraucht das Rohöl langsam und teilt es auf
elements.crude_oil.tick = function(pixel) {
    if (Math.random() < 0.15) {
        // Wir prüfen, ob direkt über dem Öl-Pixel Platz für Gas ist
        if (isEmpty(pixel.x, pixel.y - 1)) {
            if (pixel.temp >= 350) {
                // Bei extremer Hitze spaltet sich das Rohöl auf:
                // Der Dampf entweicht nach oben, und das Öl-Pixel selbst WIRD zu Schweröl!
                createPixel("diesel_vapor", pixel.x, pixel.y - 1);
                changePixel(pixel, "heavy_fuel_oil");
            } else if (pixel.temp >= 200) {
                createPixel("kerosene_vapor", pixel.x, pixel.y - 1);
                // Um das Rohöl zu verbrauchen, wandeln wir es leicht in Schweröl um (Fraktionierung)
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
    density: 1,
    cooldown: 5,
    tempHigh: 120,
    stateHigh: "gasoline_vapor"
};

// --- Gasoline ---
elements.liquid_gasoline = {
    color: "#e6c963",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 740,
    viscosity: 100,
    tempHigh: 120,
    stateHigh: "gasoline_vapor"
};
elements.gasoline_vapor = {
    color: "#f2ebd5",
    behavior: behaviors.GAS,
    category: "gases",
    density: 8, 
    cooldown: 4,
    tempLow: 115, 
    stateLow: "liquid_gasoline"
};

// --- Kerosene ---
elements.liquid_kerosene = {
    color: "#b0d4de",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 810,
    viscosity: 200,
    tempHigh: 200,
    stateHigh: "kerosene_vapor"
};
elements.kerosene_vapor = {
    color: "#cbdbe0",
    behavior: behaviors.GAS,
    category: "gases",
    density: 15,
    cooldown: 3,
    tempLow: 195, 
    stateLow: "liquid_kerosene"
};

// --- Diesel ---
elements.liquid_diesel = {
    color: "#7fa682",
    behavior: behaviors.LIQUID,
    category: "liquids",
    density: 850,
    viscosity: 400,
    tempHigh: 350,
    stateHigh: "diesel_vapor"
};
elements.diesel_vapor = {
    color: "#b0c2b2",
    behavior: behaviors.GAS,
    category: "gases",
    density: 25, 
    cooldown: 2,
    tempLow: 345, 
    stateLow: "liquid_diesel"
};

// --- Heavy Residues ---
elements.heavy_fuel_oil = {
    color: "#24201c",
    behavior: behaviors.LIQUID,
    category: "liquids",
    viscosity: 3000,
    density: 920,
};

// Das Schweröl kocht am Boden weiter, bis es zu festem Bitumen austrocknet
elements.heavy_fuel_oil.tick = function(pixel) {
    if (pixel.temp >= 450 && Math.random() < 0.1) {
        changePixel(pixel, "bitumen");
    }
};

elements.bitumen = {
    color: "#0a0908",
    behavior: behaviors.LIQUID, 
    category: "solids",
    viscosity: 10000,          
    density: 1100, 
    state: "liquid"
};
