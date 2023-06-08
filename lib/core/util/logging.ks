global function printValueTarget {
    parameter value.
    parameter target.

    print "value: " + value + " target: " + target.
}

global function fileLog {
    parameter arg.

    log arg to output.ks.
}

local error is {parameter error.}.
global function throwError {
    parameter message.

    fileLog(message).

    error().
}

global function logVar {
    parameter varName.
    return {
        parameter var.

        print varName + " : " + var.
    }.
}

global function typeError {
    parameter object.
    parameter type.
    parameter location.

    fileLog(object:typename + " has provided instead of " + type + " at " + location).
    error().
}