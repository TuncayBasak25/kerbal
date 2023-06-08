global function periapsisTransfer {
    parameter this.
    parameter targetAltitude.

    set targetAltitude to resolve(targetAltitude).

    this:eta:set(this:etaPeriapsis).


    local actualV is orbitalVelocity(this:body, this:periapsis, this:apoapsis, this:periapsis).

    local targetV is orbitalVelocity(this:body, this:periapsis, targetAltitude, this:periapsis).

    this:prograde:set(targetV - actualV).

    return this.
}