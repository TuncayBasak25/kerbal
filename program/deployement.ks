local targetPeriod is 1848.

until (ship:obt:period > targetPeriod - 10) {
    lock steering to prograde.
    setTwr(0.1).
}

until (ship:obt:period > targetPeriod) {
    lock steering to prograde.
    setTwr(0.01).
}

setTwr(0).
wait 3.
stage.
wait 3.

local repeat is 12.
local decale is targetPeriod / repeat.

until (repeat = 0) {
    set repeat to repeat - 1.

    until (ship:obt:period >= targetPeriod + decale) {

        if (ship:obt:period > targetPeriod + decale - 1) {
            setTwr(0.01).
        }
        else if (ship:obt:period > targetPeriod + decale - 10) {
            setTwr(0.1).
        }
        else {
            setTwr(1).
        }
    }

    setTwr(0).

    lock steering to retrograde.
    wait 20.

    until (eta:periapsis < 15) {
        warpFor(eta:periapsis - 15).
    }

    wait 5.

    until (ship:obt:period <= targetPeriod) {
        if (eta:periapsis > 15 and eta:periapsis < 30) {
            setTwr(0).
        }
        else if (ship:obt:period < targetPeriod + 1) {
            setTwr(0.01).
        }
        else if (ship:obt:period < targetPeriod + 0.01) {
            setTwr(0.1).
        }
        else {
            setTwr(1).
        }
    }

    setTwr(0).

    lock steering to prograde.
    wait 20.

    stage.
    wait 3.
}

setTwr(0).