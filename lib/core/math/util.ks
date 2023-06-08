global function groundLevel {
    return altitude - max(0, ship:geoposition:terrainheight).
}

global function g {
    return body:mass * constant:g / (body:radius + ship:altitude)^2.
}


local lastMaxAcceleration is -1.
global function maxAcceleration {
    if (ship:availableThrust > 0) {
        set lastMaxAcceleration to ship:availablethrust / ship:mass.
    }

    return lastMaxAcceleration.
} 


local lastMaxTwr is -1.
global function maxTwr {
    if (ship:availableThrust > 0) {
        set lastMaxTwr to ship:availablethrust / ship:mass / g.
    }

    return lastMaxTwr.
} 

global function twr {
    if (throttle > 0) {
        return maxTwr * throttle.
    }

    return 0.
}