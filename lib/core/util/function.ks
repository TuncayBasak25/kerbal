global function delegate {
    parameter base.

    if (base:typeName <> "UserDelegate") {
        return {return base.}.
    }
    return base.
}

global function resolve {
    parameter value.
    parameter default is undefined.
    
    if (value:typename = "UserDelegate") {
        return value().
    }
    else if (value:typeName = "Lexicon" and value:haskey("get")) {
        return value:get().
    }
    else if isUndefined(value) and isDefined(default) {
        return default.
    }
    return value.
}

global function counterCallBack {
    parameter callBack.
    parameter maxCount is 1.

    local counter is 0.

    return {
        set counter to counter +1.
        
        if (counter >= maxCount) {
            set counter to 0.

            callBack().
        }
    }.
}

global function dynamicFunction {
    parameter optionList.
    parameter func.

    local this is lex().

    chainGetSet(this, optionList).

    this:add("execute", {func(this).} ).

    return this.
}