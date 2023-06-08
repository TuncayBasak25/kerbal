global function chainGetSet {
    parameter this.
    parameter arg.
    parameter default is undefined.

    local propMap is lex().

    if (arg:typename = "String") {
        propMap:add(arg, default).
    }
    else if (arg:typename = "List") {
        for key in arg {
            propMap:add(key, undefined).
        }
    }
    else {
        set propMap to arg.
    }

    for key in propMap:keys {
        local referencePath is "_" + key.

        this:add(referencePath, propMap[key]).

        this:add(key, {
            parameter value is undefined.
            parameter p0 is undefined.
            parameter p1 is undefined.
            parameter p2 is undefined.
            parameter p3 is undefined.
            parameter p4 is undefined.
            parameter p5 is undefined.
            parameter p6 is undefined.
            parameter p7 is undefined.
            parameter p8 is undefined.

            if isUndefined(value) {
                return this[referencePath].
            }
            else if (isUndefined(p0)) {
                set this[referencePath] to value.
            }
            else if (isUndefined(p1)) {
                set this[referencePath] to list(value, p0).
            }
            else if (isUndefined(p2)) {
                set this[referencePath] to list(value, p0, p1).
            }
            else if (isUndefined(p3)) {
                set this[referencePath] to list(value, p0, p1, p2).
            }
            else if (isUndefined(p4)) {
                set this[referencePath] to list(value, p0, p1, p2, p3).
            }
            else if (isUndefined(p5)) {
                set this[referencePath] to list(value, p0, p1, p2, p3, p4).
            }
            else if (isUndefined(p6)) {
                set this[referencePath] to list(value, p0, p1, p2, p3, p4, p5).
            }
            else if (isUndefined(p7)) {
                set this[referencePath] to list(value, p0, p1, p2, p3, p4, p5, p6).
            }
            else if (isUndefined(p8)) {
                set this[referencePath] to list(value, p0, p1, p2, p3, p4, p5, p6, p7).
            }
            else {
                set this[referencePath] to list(value, p0, p1, p2, p3, p4, p5, p6, p7, p8).
            }
    
            return this.
        }).
    }
}
