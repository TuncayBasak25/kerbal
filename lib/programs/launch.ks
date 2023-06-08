local this is programs:create("launch", lex("altitude", 75000, "inclination", 1, "highAltitude", false)).



local lock speed to ship:velocity:surface:mag.
local delayer is 0.
local koscenter is ship:geoposition.

local kiff is 0.

when (addons:tr:hasimpact) then {
    set kiff to ((addons:tr:impactpos:lat - koscenter:lat) ^ 2 + (addons:tr:impactpos:lng - koscenter:lng) ^ 2) ^ 0.5.

    preserve.
}

local apoapsis is Scalar():target({return this:altitude * 1.}).
local eccentricity is Scalar():target(1).

when (this:executing) then {
    apoapsis:set(ship:apoapsis).
    eccentricity:set(1 - orbit:eccentricity).

    preserve.
}

this:mainAbort({
    resetSteering().
    lock throttleValue to 0.
    unlock throttle.

    set warp to 0.
})
:do({
    lock steeringRef to heading(90 - this:inclination * 1.1, 90).
    activateSteering().
    lockThrottle().

    lock throttleValue to 1.

    if (this:altitude > 200000) {
        set this:highAltitude to this:altitude.
        set this:altitude to 75000.
    }
})
:await({
    return speed > 1.
})
:do({
    lock throttleFactor to 1.
    lock pitch to apoapsis:level() * 80.
    lock throttleValue to 1.
})
:await({
    if (koscenter = 0 and addons:tr:hasimpact) {
        set koscenter to addons:tr:impactpos:position.
    }
    return apoapsis:level() > 1.
})
:do({
    set delayer to time:seconds + 5.
    lock throttleValue to 0.
})
:await({
    return time:seconds > delayer.
})
:do({
    rcs on.
    lock pitch to max(-10,min(10, (addons:tr:impactpos:lat - koscenter:lat) * abs(addons:tr:impactpos:lat - koscenter:lat) * kiff)).
    local retroCache is srfRetrograde:vector.
    lock steeringRef to vxcl(up:vector, retroCache):direction.

    set delayer to time:seconds + 7.
})
:await({
    return time:seconds > delayer.
})
:do({
    lock throttleValue to kiff ^ 2.

    set delayer to time:seconds + 1.
})
:await({
    print(kiff).
    return kiff < 0.01.
})
// :do({
//     lock throttleFactor to 1.
//     lock pitch to apoapsis:level() ^ (2/twr ^ 2) * 90.
//     lock throttleValue to max(0.01, abs(1 - apoapsis:level()) ^ 0.7).
// })
// :await({
//     return ship:verticalSpeed/speed < 0.5.
// })
// :do({
//     lock pitch to 0.
//     lock steeringRef to srfPrograde.
// })
// :await({
//     return abs(orbit:inclination - abs(this:inclination)) < 0.01.
// })
// :do({
//     lock steeringRef to prograde.
//     rcs on.
//     setThrottleDelay(3).
// })
// :await({
//     return ship:apoapsis >= this:altitude.
// })
:do({
    resetSteering().
    lock throttleValue to 0.
    unlock throttle.

    set warp to 0.

    if (this:highAltitude) {
        NewNode:apoapsisTransfer(this:highAltitude):onAbort(this):execute().
        NewNode:apoapsisTransfer(this:highAltitude):onAbort(this):execute().
    }
    else {
        NewNode:apoapsisTransfer(this:altitude):onAbort(this):execute().
    }
})
:seal().