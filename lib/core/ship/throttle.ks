global lock throttleValue to 0.
global lock throttleFactor to 1.


local throttleDelayTime is 0.

global function setThrottleDelay {
    parameter t.

    set throttleDelayTime to time:seconds + t.
}



global function lockThrottle {
    lock throttle to min(1, throttleValue) * throttleFactor * min(1, max(0, time:seconds - throttleDelayTime)).
}

lock timeToApoapsis to -1.
global function maintainTimeToApoapsis {
    parameter t is -1.

    lock timeToApoapsis to t.

    lock throttleValue to (g + (timeToApoapsis - eta:apoapsis) * g) / maxAcceleration.
}

lock timeToPeriapsis to -1.
global function maintainTimeToPeriapsis {
    parameter t is -1.

    lock timeToPeriapsis to t.

    lock throttleValue to (g + (timeToPeriapsis - eta:periapsis) * g) / maxAcceleration.
}


global function setTwr {
    parameter amount.

    lock throttleValue to amount/twr.
}

global function setAcceleration {
    parameter amount.

    lock throttleValue to amount/maxAcceleration.
}