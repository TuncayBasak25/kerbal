local this is programs:create("land").



local airbrakeList is list().

for airbrake in ship:partsnamed("airbrake1") {
    airbrakeList:add(airbrake:getmodulebyindex(0)).
}

local lastAngle is 0.
local angle is 0.

when (lastAngle <> angle) then {
    for airbrake in airbrakeList {
        airbrake:setfield(airbrake:allfieldnames[1], angle).
    }

    preserve.
}

local myAcc is 0.

this:mainAbort({
    lock throttleValue to 0.
    lockThrottle().
    resetSteering().

    set warp to 0.
})
:do({
    if (periapsis > 50000) {
        local mynode is newNode().

        mynode:prograde:adjust():for(mynode:periapsis):to(50000):loop().

        mynode:onAbort(this):execute().
    }
})
:await({
    return periapsis < 50000.
})
:do({
    rcs on.
    lock steeringRef to srfRetrograde.
    activateSteering().
    lockThrottle().
    
    set brakes to true.
    set angle to 90.

    set myAcc to min(30, maxAcceleration * 0.7).
})
:await({
    if (ship:velocity:surface:mag - abs(ship:verticalspeed) < 1) {
        lock steeringRef to heading(0,90).
    }

    if (myAcc <= g) {
        HUDTEXT("Warning: Not enough thrust to fight gravity!", 5, 2, 15, red, false).
    }
    else if (myAcc <= g * 1.5) {
        HUDTEXT("Warning: Very inneficient landing burn!", 5, 2, 15, red, false).
    }


    if (ship:altitude < 5000) {
        local t is ship:velocity:surface:mag / (myAcc - g).
        local value is 0.5 * (myAcc * abs(ship:verticalspeed)/ship:velocity:surface:mag - g) * t^2 + ship:verticalSpeed * t + groundLevel - 7.5.
        if (value < 0) {
            set myAcc to myAcc * 1.01.
            setAcceleration(myAcc).
        }
        else if (value < 0.1) {
            setAcceleration(myAcc).
        }
        else if (myAcc > 2 * g and throttleValue > 0 and value < 100) {
            set myAcc to myAcc * 0.99.
            setAcceleration(myAcc).
        }
        else {
            //setAcceleration(0).
        }
    }

    return ship:verticalspeed > -1 and ship:altitude < 100.
})
:do({
    setAcceleration(0).
})
:seal().