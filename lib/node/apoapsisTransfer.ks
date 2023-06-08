global function apoapsisTransfer {
    parameter this.
    parameter targetAltitude.

    set targetAltitude to resolve(targetAltitude).

    this:eta:set(this:etaApoapsis).


    local actualV is orbitalVelocity(this:body, this:periapsis, this:apoapsis, this:apoapsis).

    local targetV is orbitalVelocity(this:body, targetAltitude, this:apoapsis, this:apoapsis).

    this:prograde:set(targetV - actualV).

    return this.
}