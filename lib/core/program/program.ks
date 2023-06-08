global programs is lex().

programs:add("create", {
    parameter name.
    parameter arguments is lex().

    local public is lex().
    local private is lex().

    programs:add(name, public).

    public:add("executing", false).

    private:add("await", {return true.}).

    private:add("taskList", list()).
    private:add("taskNumber", -1).

    public:add("aborted", false).
    private:add("mainAbort", {}).
    private:add("onAbort", list()).

    public:add("do", {
        parameter task.

        private:taskList:add(task).

        return public.
    }).

    public:add("await", {
        parameter condition.

        private:taskList:add(lex("await", condition)).

        return public.
    }).

    public:add("mainAbort", {
        parameter task.

        set private:mainAbort to task.

        return public.
    }).

    public:add("onAbort", {
        parameter task.

        if (task:typename = "userDelegate") {
            private:onAbort:add(task).
        }
        else if (task:hasKey("abort")) {
            private:onAbort:add(task:abort).
            task:onAbort(public:abort).
        }


        return public.
    }).

    public:add("abort", {
        set public:aborted to true.

        return public.
    }).
    
    local function firstCallSetter {
        parameter argumentName.

        return {
                parameter argument is arguments[argumentName].

                set public[argumentName] to argument.

                return public.
            }.
    }.

    public:add("seal", {
        public:remove("do").
        public:remove("await").
        public:remove("mainAbort").
        public:remove("seal").

        for argumentName in arguments:keys {
            public:add(argumentName, firstCallSetter(argumentName)).
        }
    }).

    private:add("reset", {
        for argumentName in arguments:keys {
            set public[argumentName] to firstCallSetter(argumentName).
        }

        set private:taskNumber to -1.
        set public:executing to false.
        set private:await to {return true.}.
        set private:onAbort to list().

        set public:aborted to false.
    }).

    public:add("execute", {
        if (public:executing) {
            return.
        }
        else {
            set public:executing to true.

            for key in arguments:keys {
                resolve(public[key]).
            }
        }


        when (private:await() or public:aborted) then {
            if (public:aborted) {
                private:mainAbort().

                for task in private:onAbort {
                    task().
                }

                private:reset().
            }
            else {
                set private:taskNumber to private:taskNumber + 1.

                if (private:taskNumber < private:taskList:length) {
                    if (private:taskList[private:taskNumber]:typename = "userDelegate") {
                        private:taskList[private:taskNumber]().
                    }
                    else {
                        set private:await to private:taskList[private:taskNumber]:values[0].
                    }
                    
                    preserve.
                }
                else {
                    private:reset().
                }
            }
        }
    }).

    return public.
}).