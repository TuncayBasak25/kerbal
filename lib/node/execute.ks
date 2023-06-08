local this is programs:create("executeNode", lex("mynode", null)).


local function deltaV {
    if (notnull(this:mynode)) {
        return this:mynode:deltaV.
    }
    return v(0,0,0).
}
local function burntime {
    return deltaV:mag / max(0.1, maxAcceleration).
}

local dvSave is null.

this:mainAbort({
    lock throttleValue to 0.
    resetSteering().
})
:do({
    sas off.
    rcs on.

    if (isnull(this:mynode)) {
        set this:mynode to nextNode.
    }

    warpFor(this:mynode:eta - burntime/2 - max(steeringManager:yawts, steeringManager:pitchts) - 20).
})
:await({
    return this:mynode:eta <= burntime/2 + max(steeringManager:yawts, steeringManager:pitchts) + 20.
})
:do({
    physicWarp().
    lock steeringRef to this:mynode:burnvector:direction.
    activateSteering().
})
:await({
    return this:mynode:eta <= burntime/2.
})
:do({
    set dvSave to deltaV.

    lock throttleValue to (deltaV:mag / max(0.1, maxAcceleration)) ^ 0.5.
})
:await({
    return vDot(deltaV, dvSave) < 0.5.
})
:do({
    lock throttleValue to 0.

    resetSteering().
    rcs off.

    remove this:mynode.
    set this:mynode to null.
})
:await({
    return true.
})
:seal().

