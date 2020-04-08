const gConfigGeneral = {
    background:0xffffff,
    gameLength:45,
    gameStartDelay:-5000,
    debug:false,
};

const gConfigNeighbourhood = {
    spawnedPrecent:0.75
};

const gNeighbour ={
    relScale:0.025,
    tint:0x000000,
    velocityRange: { min: 50, max: 100 },
};

const debugColors ={
    player: 0x00ff00,
    healthy: 0xffffff,
    sick: 0x00ffff,
    dead: 0x555555,
    text: 0x0000ff
};

const gConfigPlayer ={
    spawnLocation: { x: 0.5, y: 0.5 },
    relScale: 0.025,
    isControlled: true,
    respondSpeed: 75,
    respondThres: 20,
    tint:0xffffff,
    infectionRate:0.8,
};

const gConfigTrail ={
    tint:0x000000,
    startingScale: 0.6,
    lifespan: 0.125,
    frequency: 450,
    limit: 100,
    colisionCheck: 30,
    collisonRadius: 16,
    infectionRate: 0.2,
    deathRate: 0.2,
    deathCall:{min:3,max:7}
};

export { gConfigGeneral, gConfigNeighbourhood, gNeighbour, debugColors, gConfigPlayer, gConfigTrail };
