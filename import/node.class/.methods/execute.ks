local function execute {
    parameter stopCondition is {return false.}.
    parameter forcedSteering is false.
    sas off.

    local function burntime {
        return this:deltav():mag / maxAcceleration().
    }

    print this:eta:get().
    until (this:eta:get() <= burntime()/2) {
        warpFor(this:eta:get() - burntime()/2 - max(steeringManager:yawts, steeringManager:pitchts) - 20).
        staticLog("Waiting maneuver node " + this:eta:get()).
        setSteering(0, 0, 0, this:burnvector():direction).
    }

    local save is true.
    local dir is this:burnvector():direction.
    local dv is this:deltav().
    until (vDot(this:deltav(), dv) < 0.5 or stopCondition()) {
        if (this:deltav():mag / maxAcceleration() < 0.1) {
            lock throttle to this:deltav():mag / maxAcceleration() * 2.

            if (save) {
                set dir to this:burnvector():direction.
                set save to false.
            }
        }
        else {
            lock throttle to 1.
        }
        if (forcedSteering:typename = "userDelegate") {
            forcedSteering().
        }
        if (save) {
            setSteering(0, 0, 0, this:burnvector():direction).
        }
        else {
            setSteering(0, 0, 0, dir).
        }
    }

    lock throttle to 0.
    wait 0.5.

    unlock throttle.
    unlock steering.

    remove this:node.
}