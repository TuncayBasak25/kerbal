local function sync {
    parameter period is undefined.

    set period to resolve(period, this:body():rotationPeriod).

    this:prograde:adjust():for(this:period):to(period):precision(100):loop().

    return this.
}
