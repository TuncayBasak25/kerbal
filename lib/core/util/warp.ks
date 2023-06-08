global function warpFor {
    parameter t.

    if (t < 0) {
        return.
    }

    if (warp > 0) {
        return.
    }

    warpto(time:seconds + t).
}

global function physicWarp {
    parameter power is 4.

    set warpmode to "physics".
    set warp to power.
}