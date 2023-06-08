local function circularize {
    parameter altitude.

    set altitude to resolve(altitude).

    this:adjustApoapsis(altitude).
    this:next():adjustPeriapsis(altitude).

    return this.
}