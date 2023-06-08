parameter target_altitude is 80_000.
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

local inclined is false.
when (abs(inclinationDiff()) < 0.01) then {
    setTwr(0).
    set pitch to 0.
    set yaw to 0.
    set steeringReference to {return prograde.}.

    set inclined to true.
    setSteering(pitch, yaw, 0, steeringReference).
    wait 3.
}

local circularize is false.
until (ship:apoapsis >= target_altitude) {
    apoapsis:update().
    velocity:update().

    print velocityChange() at(0, 8).
    print apoapsisChange() at(0, 9).

    local apo is apoapsisChange().
    if ((eta:apoapsis > 70 or orbit:eccentricity < 0.3) and ship:apoapsis < target_altitude) {
        if (apo > 0) {
            setAcceleration(10 * (velocityChange()/apo) ^ 3 + 10/deltav()).
        }
    }
    // else if (circularize) {
    //     if (eta:apoapsis < 20 / maxAcceleration()) {
    //         setAcceleration((20 / maxAcceleration()) * (10/eta:apoapsis) ^ 2 * orbit:eccentricity).
    //     }
    //     else if (ship:apoapsis >= target_altitude) {
    //         setAcceleration(0).
    //         if (eta:apoapsis > 20 / maxAcceleration()) {
    //             warpFor(eta:apoapsis - 20/maxAcceleration() - 10).
    //         }
    //     }
    // }
    else {
        maintainTimeToApoapsis(70).
    }

    if (ship:apoapsis - target_altitude < 1000) {
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



local tta is 0.
until (ship:apoapsis >= target_altitude and ship:altitude > 70000) {
    if (ship:apoapsis >= target_altitude * 0.8 and ship:apoapsis < target_altitude) {
        if (eta:apoapsis > 60) {
            setTwr(ship:apoapsis / target_altitude).
        }
        else {
            maintainTimeToApoapsis(60).
        }
    }
    else if (ship:apoapsis >= target_altitude) {
        setTwr(0).
    }
    else {
        lock throttle to 1.
    }
    
    if (ship:altitude > 70000) {
        setSteering(0, 0, 0, vxcl(up:vector, steeringReference():vector):direction).
    }
    else {
        setSteering(pitch, yaw, 0, steeringReference).
    }
}

warpFor(eta:apoapsis - (deltav() / twr() * 2) * orbit:eccentricity - 10).
until (ship:periapsis >= target_altitude) {
    if (eta:apoapsis < (deltav() / twr() * 2) * orbit:eccentricity) {
        lock throttle to (deltav() / twr() * 2) * orbit:eccentricity / eta:apoapsis.
    }
    else {
        setTwr(0).
    }
    setSteering(0, 0, 0, vxcl(up:vector, steeringReference():vector):direction).
}

local min_throttle is -1.
until (apoapsisLevel() >= 1) {
    apoapsis:update().

    if (apoapsisLevel() > (1 - 1000 / target_altitude) and min_throttle < 0) {
        set min_throttle to 1 - apoapsisLevel().
        set warp to 0.
    }

    setTwr(3 * max(min_throttle, (1 - apoapsisLevel()) ^ (0.5 + orbit:eccentricity) ^ 2 )).

    setSteering(pitch, yaw, 0, steeringReference).
}

lock throttle to 0.

local waiter is deltav()/10.

until (ship:periapsis >= target_altitude) {
    if (eta:apoapsis < waiter) {
        setTwr((waiter/eta:apoapsis) ^ 2 * orbit:eccentricity).
    }
    else {
        warpFor(eta:apoapsis - waiter - 10).
    }

    lock steering to vxcl(up:vector, prograde:vector):direction.
}

// until (apoapsisLevel() > 1) {
//     apoapsis:update().
//     velocity:update().

//     local apo is apoapsisChange().

//     if (apo > 0) {
//         lock throttle to (velocityChange()/apo) ^ 3.
//     }
//     else {
//         lock throttle to 0.001.
//     }

//     setSteering(pitch, yaw, 0, vxcl(up:vector, prograde:vector):direction).
// }

setTwr(0).
// set warp to 0.
// setTwr(0).

// NewNode(eta:apoapsis):adjustPeriapsis(target_altitude):execute().

// setTwr(0).

local inclinationLayout is launchLayout:addhlayout().

local launchInclinationTitle is inclinationLayout:addlabel("Inclination").
set launchInclinationTitle:style:align to "right".
local launchInclination is inclinationLayout:addtextfield().
set launchInclination:text to "1".

local lunarInjection is window:addbutton("Lunar injection").
set lunarInjection:onclick to {
    local mynode is NewNode().

    mynode:periapsisTransfer(mun:altitude).
    mynode:eta:set(0).
    mynode:eta:adjust():final(mynode:hasnextpatch):loop().
    mynode:execute().

    until (body = mun) {
        warpfor(orbit:eta:transition).
    }

    Newnode():periapsisTransfer(10000):execute().
    Newnode():periapsisTransfer(10000):execute().
}.


local lunarLand is window:addbutton("Lunar Landing").
set lunarLand:onclick to {

    until (ship:periapsis < 1000) {
        setAcceleration(10).
        setSteering(0,0,0, vxcl(up:vector, srfretrograde:vector):direction).
    }
    setAcceleration(0).
    wait 1.

    set warp to 5.
    until (groundLevel < 2000) {

    }
    physicWarp(0).

    setSteering(0,0,0, vxcl(up:vector, srfretrograde:vector):direction).
    wait 10.

    until (abs(ship:velocity:surface:mag - abs(ship:verticalSpeed)) < 0.1) {
        setAcceleration(abs(ship:velocity:surface:mag - abs(ship:verticalSpeed))).
        setSteering(0,0,0, srfretrograde).
    }

    setAcceleration(0).

    until (ship:verticalspeed > -1) {        
        print g().
        local maxAcc is 18.
        local t is abs(ship:verticalSpeed/(maxAcc - g())).

        if (0.5 * (maxAcc - g()) * t^2 + ship:verticalSpeed * t + groundLevel < 11) {
            local a is (-ship:verticalspeed * t - groundLevel + 11) / t ^ 2 * 2 + g().
            setAcceleration(a).
        }
        else if (groundLevel > 1000) {
            physicWarp().
        }
        else {
            set warp to 0.
        }


        setSteering(0,0,0, srfretrograde).
    }

    setAcceleration(0).
}.