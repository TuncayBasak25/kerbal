global function adjustApoapsis {
    parameter altitude.
    parameter eta is undefined.

    set altitude to resolve(altitude).
    set eta to resolve(eta, this:etaPeriapsis).

    this:eta:set(eta).


    local mybody is this:orbit():body.

    local actualV is orbitalVelocity(mybody, this:periapsis, this:apoapsis, this:periapsis).

    local targetV is orbitalVelocity(mybody, this:periapsis, altitude, this:periapsis).

    this:prograde:set(targetV - actualV).

    return this.
}