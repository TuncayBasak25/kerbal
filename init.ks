when (groundLevel < 500 and not gear) then {
    set gear to true.
    preserve.
}

when (groundLevel > 500 and gear) then {
    set gear to false.
    preserve.
}


when (maxThrust = 0 and stage:ready) then {

    unlock steering.

    stage.

    activateSteering().

    preserve.
}