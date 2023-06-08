local function adjustPeriapsis {
    parameter altitude.

    set altitude to resolve(altitude).


    this:eta:set(eta:apoapsis).
    print this:node:orbit:eta:apoapsis.

    local mybody is this:orbit():body.

    local actualV is orbitalVelocity(mybody, this:periapsis, this:apoapsis, this:apoapsis).

    local targetV is orbitalVelocity(mybody, this:apoapsis, altitude, this:apoapsis).

    this:prograde:set(targetV - actualV).

    return this.
}