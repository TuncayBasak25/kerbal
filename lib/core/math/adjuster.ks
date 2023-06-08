global function Adjuster {
    parameter property.

    local this is lex(
        "property", property,

        "minDiff", undefined,
        "lastFlip", 0,

        "init", {
            for key in this:keys {
                if (key[0] = "_") {
                    set this[key:remove(0, 1)] to this[key].
                }
            }

            set this:minDiff to this:diff().
            set this:perform to this:perform_base.
            set this:loop to this:loop_base.

            return this.
        },
        "perform", {this:init():perform().},
        "loop", {this:init():loop().},

        "perform_base", {    
            this:property:inc(this:step).
            set this:lastFlip to this:lastFlip + 1.

            if this:exception() {
                this:onException().
                this:property:dec(this:step).
                set this:step to this:step / 2.
            }
            else {
                set this:step to this:step * 1.1.
                set this:lastFlip to 0.
            }
            if this:flip() {
                set this:step to this:step / -2.
            }

            this:onLoop().
        },

        "loop_base", {
            until this:final() {
                this:perform().
            }
        }
    ).

    chainGetSet(this, lex(
        "for", 0,
        "to", 0,

        "precision", 1,
        "final", {return precisionCheck(this:for, this:to, this:precision).},

        "step", 10,

        "diff", {return diff(this:for, this:to).},
        "flip", {
            if (this:diff() <= this:mindiff) {
                set this:minDiff to this:diff().
                return false.
            }
            set this:minDiff to this:diff().
            return true.
        },

        "exception", {},
        "onException", {},

        "onLoop", {}
        
    )).
    

    return this.
}