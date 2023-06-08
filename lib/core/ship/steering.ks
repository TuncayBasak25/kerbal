global lock pitch to 0.
global lock yaw to 0.
global lock roll to 0.
global lock steeringRef to heading(90, 90).


global function activateSteering {
    lock steering to steeringRef * R(pitch, yaw, roll - 90).
}

global function resetSteering {
    unlock steering.
    
    lock pitch to 0.
    lock yaw to 0.
    lock roll to 0.
    lock steeringRef to heading(90, 90).
}