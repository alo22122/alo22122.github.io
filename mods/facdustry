// ============================================================================
// INDUSTRIAL AUTOMATION & COMPLEX PRODUCTION TREE MOD FOR SANDBOXELS
// ============================================================================
console.log("Starte Laden der Industrial Automation Mod...");

// --- KATEGORIEN INITIALISIEREN (Falls nicht vorhanden) ---
if (!elements.ammonia_gas) {

    // ============================================================================
    // STUFE 1: DIE GASE & ZWISCHENPRODUKTE
    // ============================================================================
    elements.ammonia_gas = {
        color: "#e8f8f5",
        behavior: behaviors.GAS,
        category: "gases",
        state: "gas",
        density: 0.7,
    };

    elements.nitrous_oxide = {
        color: "#fcf3cf",
        behavior: behaviors.GAS,
        category: "gases",
        state: "gas",
        density: 1.2,
    };

    elements.ethylene_gas = {
        color: "#ebdef0",
        behavior: behaviors.GAS,
        category: "gases",
        state: "gas",
        density: 1.1,
    };

    // ============================================================================
    // STUFE 2: INDUSTRIE-SÄUREN, FLÜSSIG-KUNSTSTOFFE & PULVER
    // ============================================================================
    elements.industrial_nitric_acid = {
        color: "#f4d03f",
        behavior: behaviors.LIQUID,
        category: "liquids",
        state: "liquid",
        density: 1500,
        reactions: {
            // Synthetisches Schießpulver herstellen
            "sulfur": { elem1: "industrial_gunpowder", elem2: "ash", chance: 0.1 },
            "charcoal": { elem1: "industrial_gunpowder", elem2: "smoke", chance: 0.1 }
        }
    };

    elements.liquid_plastic = {
        color: "#eaeded",
        behavior: behaviors.LIQUID,
        category: "liquids",
        state: "liquid",
        density: 900,
        temp: 120,
        tick: function(pixel) {
            if (pixel.temp < 50) { 
                pixel.element = "factory_plastic"; // Härtet bei Abkühlung aus
            }
        }
    };

    elements.industrial_gunpowder = {
        color: "#566573",
        behavior: behaviors.POWDER,
        category: "powders",
        state: "solid",
        density: 1700,
        burn: 200,
        burnTime: 2,
        reactions: {
            // C4-Herstellung durch Kneten mit Flüssig-Plastik
            "liquid_plastic": { elem1: "c4_explosive", elem2: "air", chance: 0.2 }
        }
    };

    elements.graphene_dust = {
        color: "#212f3d",
        behavior: behaviors.POWDER,
        category: "powders",
        state: "solid",
        density: 2200,
    };

    // ============================================================================
    // STUFE 3: DIE FABRIK-BAUSTOFFE & HIGH-TECH ENDPRODUKTE
    // ============================================================================
    elements.factory_plastic = {
        color: "#bdc3c7",
        behavior: behaviors.WALL,
        category: "solids",
        state: "solid",
        density: 950,
        conduct: 0, // Perfekter elektrischer Isolator
        tempHigh: 250,
        vendingHigh: "liquid_plastic",
    };

    elements.c4_explosive = {
        color: "#f5b041",
        behavior: behaviors.WALL, // Stabil als Block platzierebar
        category: "solids",
        state: "solid",
        density: 1600,
        reactions: {
            // Explodiert NUR bei Hitze oder Feuer
            "fire": { elem1: "explosion", elem2: "explosion", chance: 1.0 },
            "plasma": { elem1: "explosion", elem2: "explosion", chance: 1.0 }
        },
        onCharge: function(pixel) { // Zündung per Stromimpuls!
            explode(pixel.x, pixel.y, 25);
        }
    };

    elements.polymer_composite = {
        color: "#1c2833",
        behavior: behaviors.WALL,
        category: "solids",
        state: "solid",
        density: 3000,
        heatInsulation: 1, // Hält Hitze perfekt auf
        hard: true,
        explosionResist: true // Hält C4-Explosionen stand
    };

    // ============================================================================
    // STUFE 4: KATALYSATOREN & SPECIAL REAKTOREN
    // ============================================================================
    elements.platinum_catalyst = {
        color: "#d5dbdb",
        behavior: behaviors.WALL,
        category: "solids",
        state: "solid",
        insulation: true,
        tick: function(pixel) {
            // Verwandelt Ammoniak + Sauerstoff in Stickstoffoxid
            let neighbors = [
                [pixel.x-1, pixel.y], [pixel.x+1, pixel.y],
                [pixel.x, pixel.y-1], [pixel.x, pixel.y+1]
            ];
            for (let n of neighbors) {
                if (isEmpty(n[0], n[1])) continue;
                let p = pixelMap[n[0]][n[1]];
                if (p.element === "ammonia_gas" && pixel.temp > 150) {
                    p.element = "nitrous_oxide"; // Transformation am heißen Platin!
                }
            }
        }
    };

    // ============================================================================
    // LOGISTIK, FÖRDERBÄNDER & FABRIK-ELEMENTE
    // ============================================================================
    
    // Förderband nach RECHTS
    elements.conveyor_right = {
        color: "#566573",
        behavior: behaviors.WALL,
        category: "machines",
        state: "solid",
        insulation: true,
        tick: function(pixel) {
            if (!isEmpty(pixel.x, pixel.y - 1)) {
                let target = pixelMap[pixel.x][pixel.y - 1];
                if (!elements[target.element].solid && isEmpty(pixel.x + 1, pixel.y - 1)) {
                    movePixel(target, pixel.x + 1, pixel.y - 1);
                }
            }
        }
    };

    // Förderband nach LINKS
    elements.conveyor_left = {
        color: "#5d6d7e",
        behavior: behaviors.WALL,
        category: "machines",
        state: "solid",
        insulation: true,
        tick: function(pixel) {
            if (!isEmpty(pixel.x, pixel.y - 1)) {
                let target = pixelMap[pixel.x][pixel.y - 1];
                if (!elements[target.element].solid && isEmpty(pixel.x - 1, pixel.y - 1)) {
                    movePixel(target, pixel.x - 1, pixel.y - 1);
                }
            }
        }
    };

    // Vertikaler Lift / Förderband nach OBEN
    elements.conveyor_up = {
        color: "#4d5656",
        behavior: behaviors.WALL,
        category: "machines",
        state: "solid",
        insulation: true,
        tick: function(pixel) {
            if (!isEmpty(pixel.x, pixel.y + 1)) {
                let target = pixelMap[pixel.x][pixel.y + 1];
                if (!elements[target.element].solid && isEmpty(pixel.x, pixel.y - 1)) {
                    movePixel(target, pixel.x, pixel.y - 1);
                }
            }
        }
    };

    // Die Flüssigkeits-Pumpe (Saugt von links, drückt nach rechts)
    elements.fluid_pump = {
        color: "#2e4053",
        behavior: behaviors.WALL,
        category: "machines",
        state: "solid",
        tick: function(pixel) {
            if (!isEmpty(pixel.x - 1, pixel.y)) {
                let target = pixelMap[pixel.x - 1][pixel.y];
                let state = elements[target.element].state;
                if ((state === "liquid" || state === "gas") && isEmpty(pixel.x + 1, pixel.y)) {
                    movePixel(target, pixel.x + 1, pixel.y);
                }
            }
        }
    };

    // Intelligenter Dichte-Sortierer (Filtert leichte Stoffe nach oben durch)
    elements.density_sorter = {
        color: "#7e5109",
        behavior: behaviors.WALL,
        category: "machines",
        state: "solid",
        tick: function(pixel) {
            if (!isEmpty(pixel.x, pixel.y + 1)) {
                let target = pixelMap[pixel.x][pixel.y + 1];
                let density = elements[target.element].density || 1000;
                if (density < 1000 && isEmpty(pixel.x, pixel.y - 1)) {
                    movePixel(target, pixel.x, pixel.y - 1);
                }
            }
        }
    };

    // ============================================================================
    // PRODUKTIONS-REAKTIONEN (Integration in Vanilla Sandboxels)
    // ============================================================================
    
    // Haber-Bosch-Prozess: Wasserstoff + Stickstoff an heißem Eisen = Ammoniak
    if (elements.hydrogen && elements.nitrogen) {
        elements.hydrogen.reactions = elements.hydrogen.reactions || {};
        elements.hydrogen.reactions["nitrogen"] = {
            elem1: "ammonia_gas",
            elem2: "air",
            chance: 0.1,
            tempMin: 200
        };
    }

    // Stickstoffoxid + Wasser = Salpetersäure
    elements.nitrous_oxide.reactions = {
        "water": { elem1: "industrial_nitric_acid", elem2: "water", chance: 0.2 }
    };

    // Kunststoff-Synthese: Öl + Säure = Ethylen-Gas
    if (elements.oil && elements.acid) {
        elements.oil.reactions = elements.oil.reactions || {};
        elements.oil.reactions["acid"] = { elem1: "ethylene_gas", elem2: "air", chance: 0.15 };
    }

    // Ethylen-Gas polymerisiert an heißem Kupfer zu Flüssig-Plastik
    elements.ethylene_gas.reactions = {
        "copper": { elem1: "liquid_plastic", elem2: "copper", chance: 0.2, tempMin: 120 }
    };

    // Sinter-Prozess für die unzerstörbare Wand: Plastik + Graphen-Staub bei hoher Temperatur
    elements.factory_plastic.reactions = {
        "graphene_dust": { elem1: "polymer_composite", elem2: "air", chance: 0.3, tempMin: 300 }
    };

}

console.log("Industrial Automation Mod erfolgreich geladen! Viel Spaß beim Fabrikbauen!");
