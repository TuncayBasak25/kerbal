global function speedAtAltitude {
    parameter altitude.
    parameter targetBody.

    local distanceToCenter is targetBody:radius + altitude.

    return (constant:g * targetBody:mass / distanceToCenter)^0.5.
}

global function periodAtAltitude {
    parameter altitude.
    parameter targetBody.

    local distanceToCenter is targetBody:radius + altitude.

    return 2 * constant:pi * distanceToCenter / (constant:g * targetBody:mass / distanceToCenter)^0.5.
}

global function altitudeForSpeed {
    parameter speed.
    parameter targetBody.

    return constant:g * targetBody:mass / speed^2 - targetBody:radius.
}

global function altitudeForPeriod {
    parameter period.
    parameter targetBody.

    return (period * (constant:g * targetBody:mass)^0.5 / 2 / constant:pi)^(2/3) - targetBody:radius.
}

global function orbitalVelocity {
    parameter orbit_body is undefined.
    parameter orbit_periapsis is undefined.
    parameter orbit_apoapsis is undefined.
    parameter orbit_altitude is undefined.

    set orbit_body to resolve(orbit_body, kerbin).
    set orbit_periapsis to resolve(orbit_periapsis, 80_000).
    set orbit_apoapsis to resolve(orbit_apoapsis, orbit_periapsis).
    set orbit_altitude to resolve(orbit_altitude, orbit_apoapsis).

    local GM is constant:g * orbit_body:mass.
    local r is orbit_body:radius + orbit_altitude.
    local SMA is (orbit_apoapsis + orbit_periapsis) / 2 + orbit_body:radius.

    return (GM * (2/r - 1/SMA))^0.5.
}