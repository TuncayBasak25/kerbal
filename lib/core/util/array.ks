global function Array {
    local new is lexicon(
        "list", list(),

        "push", {parameter value. new:list:add(value). return new.},
        "unshift", {parameter value. new:list:insert(0, value). return new.},
        "pop", {
            if (new:list:length = 0) {
                return null.
            }
            local value is new:list[new:list:length - 1].

            new:list:remove(new:list:length).

            return value.
        },
        "shift", {
            if (new:list:length = 0) {
                return null.
            }
            local value is new:list[0].

            new:list:remove(0).

            return value.
        },

        "sort", {
            parameter sortingFunction.

            local sortedList is list().

            for value in new:list {
                local addToEnd is value.
                for otherValue in sortedList {
                    if sortingFunction(value, otherValue) {
                        set addToEnd to null.
                        sortedList:insert(sortedList:find(otherValue), value).
                        break.
                    }
                }
                if (addToEnd <> null) {
                    sortedList:add(addToEnd).
                    print "test".
                }
            }

            set new:list to sortedList.
        },

        "print", {
            for val in new:list {
                print val.
            }
        }
    ).

    return new.
}