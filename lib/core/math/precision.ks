global function precisionCheck {
    parameter value.
    parameter target.
    parameter multiplier is 1.

    set value to resolve(value).
    set target to resolve(target).
    set multiplier to resolve(multiplier).

    if (value:typename = "List") {
        if (value:length = 0) {
            throwError("Precision check recived empty list!").
        }
        for val in value {
            return round(val * multiplier) / multiplier = round(target * multiplier) / multiplier.
        }

        return false.
    }
    return round(value * multiplier) / multiplier = round(target * multiplier) / multiplier.
}

global function diff {
    parameter a.
    parameter b.

    set a to resolve(a).
    set b to resolve(b).

    if (a:typename = "List") {
        if (a:length = 0) {
            throwError("Difference operation recived empty list!").
        }
        local min is a(0).
        for val in a {
            local d is abs(val - b).

            if (d < min) {
                set min to d.
            }
        }

        return min.
    }

    return abs(a - b).
}