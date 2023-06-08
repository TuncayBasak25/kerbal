global function staticLog {
    parameter message.
    parameter line is 0.

    clearScreen.

    print message at(0, line).
}

global function countDown {
    parameter counter is 10.

    CLEARSCREEN.

    PRINT "Counting down:".

    UNTIL (counter = 0) {
        PRINT "..." + counter.

        SET counter to counter - 1.
        WAIT 1. // pauses the script here for 1 second
    }
}

global function printSuffixnames {
    parameter object, offset is 0, limit is 30.

    clearScreen.

    local suffixList is object:suffixnames.

    local current is suffixList:iterator.

    until (offset < 1) and (not current:next) or (offset < -limit) {
        set offset to offset - 1.
        local name is current:value.

        if (false:suffixnames:find(name) = -1) {
            print name.
        }
    }
}


global function getSuffixList {
    parameter object.

    local suffixList is list().

    for suffixName in object:suffixnames {
        if (false:suffixnames:find(suffixName) = -1) {
            suffixList:add(suffixname).
        }
    }

    return suffixList.
}

global function transformToLexicon {
    parameter object.

    local cacheFile is newCacheFile().

    cacheFile:writeln("parameter object. set interceptor to lex().").

    local suffixList is getSuffixList(object).
    for key in SuffixList {
        cacheFile:writeln("interceptor:add(" + quoteAround(key:tolower()) + ", {return object:" + key + ".}).").
    }


    global interceptor is false.
    runCacheFile(cacheFile, object).
    return interceptor.
}

global getValue is {
    parameter object, key, default is undefined.

    local value is undefined.
    if (object:haskey(key)) {
        if (object[key]:typename = "UserDelegate") {
            set value to object[key]().
        }
        else {
            set value to object[key].
        }
    }

    if (isDefined(value)) {
        return value.
    }

    if (isUndefined(default)) {.
        throwError("The parameter " + key + " is required!").
    }

    return default.
}.