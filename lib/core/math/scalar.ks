global function Scalar {
    parameter getter is 0.
    parameter setter is null.

    local this is lex().
    
    if (getter:typename = "scalar") {
        this:add("local", getter).
        this:add("get", {return this:local.}).

        this:add("setter", {parameter val. set this:local to val.}).
    }
    else if (getter:typename = "userDelegate") {
        this:add("get", getter).

        if (isNull(setter)) {
            typeError(setter, "userdelegate", "Scalar.ks line 17").
        }
        else {
            this:add("setter", setter).
        }
    }
    else {
        typeError(getter, "scalar or userdelegate", "Scalar.ks line 24").
    }

    this:add("delta", 0).
    this:add("target", {
        parameter target.

        set this:target to target.

        this:add("level", {
            return this:get() / resolve(this:target).
        }).

        this:add("evolution", {
            return this:delta / this:level().
        }).

        return this.
    }).

    this:add("set", {
        parameter val.

        set val to resolve(val).

        set this:delta to val - this:get().
        this:setter(val).

        return this:get().
    }).

    this:add("inc", {
        parameter val is 1.

        set val to resolve(val).

        set this:delta to val.
        this:setter(this:get() + val).

        return this:get().
    }).

    this:add("dec", {
        parameter val is 1.

        return this:inc(-val).
    }).

    this:add("mul", {
        parameter val.

        set val to resolve(val).

        set this:delta to this:get() * (val - 1).
        this:setter(this:get() + this:delta).

        return this:get().
    }).

    this:add("div", {
        parameter val.

        return this:mul(1/val).
    }).

    this:add("pow", {
        parameter val.

        set val to resolve(val).

        set this:delta to this:get() ^ val - this:get().
        this:setter(this:get() + this:delta).
    }).

    this:add("adjust", {
        return Adjuster(this).
    }).

    return this.
}