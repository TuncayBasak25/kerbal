parameter target_altitude is 75_000.
parameter target_inclination is 1.
parameter abortCondition is false.

lock abortLaunch to resolve(abortCondition).

local program is lex().

program:add("main", list()).
program:add("abort", {
    lock throttleValue to 0.
    resetSteering().

    set warp to 0.
}).

lock waiter to true.

local secondAltitude is false.
lock speed to ship:velocity:surface:mag.

program:main:add({
    countDown(3).
}).

program:main:add({
    lock steeringRef to heading(90,90).
    activateSteering().

    lock throttleValue to 1.

    if (target_altitude > 200000) {
        set secondAltitude to target_altitude.
        set target_altitude to 75000.
    }

    lock waiter to speed > 50.
}).

program:main:add({
    lock pitch to min((speed - 50)/10, arcCos(ship:verticalspeed/speed) + 5).

    lock waiter to target_altitude/1000 < eta:apoapsis.
}).

program:main:add({
    lock pitch to 0.
    lock steeringRef to srfPrograde.
    maintainTimeToApoapsis(target_altitude/1000).

    lock waiter to ship:apoapsis > 50000.
}).

program:main:add({
    lock steeringRef to prograde.
    //lock throttleValue to ship:apoapsis / target_altitude / orbit:eccentricity.

    lock waiter to ship:apoapsis >= target_altitude.
}).

program:main:add({
    lock throttleValue to 0.
    resetSteering().

    set warp to 0.

    local t is time:seconds + 1.
    lock waiter to time:seconds >= t.
}).

program:main:add({
    if (secondAltitude) {
        NewNode:apoapsisTransfer(secondAltitude):execute().
        NewNode:apoapsisTransfer(secondAltitude):execute().
    }
    else {
        NewNode:apoapsisTransfer(target_altitude):execute().
    }
}).


local programStep is 0.

when (waiter or abortLaunch) then {
    if (abortLaunch) {
        program:abort().
    }
    else {
        program:main[programStep]().
        set programStep to programStep + 1.

        if (program:main:length > programStep) {
            preserve.
        }
    }
}