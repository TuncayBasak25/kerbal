parameter targetAltitude is 80000.

countDown(3).

setSteering().

stageWhenNoFuel().


stage.

until (ship:velocity:surface:mag > 50) {
    setTwr(10).
}

setSteering(0, -4, 0).

wait 5.


local fuelLevel is {
    local a is ship:partstagged("maintank")[0]:resources[0]:amount.
    local c is ship:partstagged("maintank")[0]:resources[0]:capacity.

    local val is 0.

    if (c <> 0) {
        set val to a / c.
    }
    
    print val.

    return val.
}.

until (fuelLevel() < 0.3) {
    setSteering(0, 0, 0, srfPrograde).
}

setTwr(0).

stage.
wait 2.
stage.
setSteering(0, 90, 0).

wait 20.
until (fuelLevel() < 0.20) {
    setTwr(10).
}
