parameter target_altitude is 100_000.
parameter target_inclination is 30.

lock throttle to 1.

countDown(3).

stageWhenNoFuel().


stage.

local inclinationDiff is {
    return abs(target_inclination) - orbit:inclination.
}.


local apoapsisLevel is {
    if (ship:apoapsis < target_altitude) {
        return ship:apoapsis / target_altitude.
    }
    else {
        return 1.
    }
}.

local velocityLevel is {
    return orbitalVelocity(kerbin, ship:periapsis, target_altitude) / orbitalVelocity(body, target_altitude).
}.

local apoapsis is lex(
    "last", ship:apoapsis,
    "delta", 0,

    "update", {
        set apoapsis:delta to ship:apoapsis - apoapsis:last.

        set apoapsis:last to ship:apoapsis.
    }
).

local maxApoapsisChange is 0.
local apoapsisChange is {

    if (apoapsis:delta <= 0 or target_altitude - ship:apoapsis <= 0) {
        return 0.
    }

    local val is apoapsis:delta / (target_altitude - ship:apoapsis) * 100.

    if (val > maxApoapsisChange) {
        set maxApoapsisChange to val.
    }

    return val.
}.

local velocity is lex(
    "last", orbitalVelocity(kerbin, ship:periapsis, target_altitude),
    "delta", 0,

    "update", {
        set velocity:delta to orbitalVelocity(kerbin, ship:periapsis, target_altitude) - velocity:last.

        set velocity:last to orbitalVelocity(kerbin, ship:periapsis, target_altitude).
    }
).

local deltav is {
    return orbitalVelocity(kerbin, target_altitude) - orbitalVelocity(kerbin, ship:periapsis, target_altitude).
}.

local velocityChange is {
    if (velocity:delta <= 0 or deltav() <= 0) {
        return 0.
    }
    return velocity:delta / deltav() * 100.
}.

local lasttwr is twr().
local pitch is {
    if (twr() > 0) {
        set lasttwr to twr().
    }
    return min(90, 90 - (ship:altitude / 50000) ^ (1/lasttwr) * 90).
}.


when (ship:altitude > 10000) then {
    set pitch to 0.
    set yaw to 0.
    set steeringReference to {return srfPrograde.}.
}

local yaw is {
    return 90 + target_inclination * 1.1.
}.

local steeringReference is undefined.


when (abs(inclinationDiff()) < 0.01) then {
    setTwr(0).
    set pitch to 0.
    set yaw to 0.
    set steeringReference to {return prograde.}.

    setSteering(pitch, yaw, 0, steeringReference).
    wait 3.
}

until (ship:apoapsis >= target_altitude) {
    apoapsis:update().
    velocity:update().

    local apo is apoapsisChange().
    if ((eta:apoapsis > 70 or orbit:eccentricity < 0.5)) {
        if (apo > 0) {
            setAcceleration(10 * (velocityChange()/apo) ^ 3 + 50/deltav()).
        }
    }
    else {
        maintainTimeToApoapsis(70).
    }

    if (target_altitude - ship:apoapsis > 100) {
        set warpmode to "physics".
        set warp to 4.
    }
    else {
        set warp to 0.
    }

    setSteering(pitch, yaw, 0, steeringReference).
}

setAcceleration(0).
set warp to 0.
wait 1.

NewNode(eta:apoapsis):adjustPeriapsis(target_altitude):execute({return ship:periapsis >= target_altitude.}).


setTwr(0).