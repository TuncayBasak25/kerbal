wait until ship:unpacked.
clearscreen.

switch to 0.

runOncePath("0:/import.ks").

until (core:part:getmodule("KOSprocessor"):part:decoupledin = -1) {
    wait 1.
}

wait 5.

local targetPeriod is 1848.

if (abs(ship:obt:period - targetPeriod) > 0.002) {
    ship:partsnamed("ionEngine")[0]:activate().


    if (ship:obt:period > targetPeriod) {
        lock steering to retrograde.
        wait 5.
        until (abs(ship:obt:period - targetPeriod) < 0.001) {
            print ship:obt:period.
            setTwr(abs(ship:obt:period - targetPeriod) / 100).
        }
    }
    else {
        lock steering to prograde.
        wait 5.
        until (abs(ship:obt:period - targetPeriod) < 0.001) {
            print ship:obt:period.
            setTwr(abs(ship:obt:period - targetPeriod) / 100).
        }
    }

    setTwr(0).
}
