global function implement {
    parameter subject, class.

    for key in class:prototype:keys {
        if (subject:haskey(key)) {
            if (class:prototype[key]:typename = "UserDelegate") {
                set subject[key] to class:prototype[key]:bind({return subject.}).
            }
            else {
                set subject[key] to class:prototype[key].
            }
        }
        else {
            if (class:prototype[key]:typeName = "Lexicon" and class:prototype[key]:hasKey("isScalar")) {
                subject:add(key, lex()).
                for subKey in class:prototype[key]:keys {
                    if (subKey <> "isScalar") {
                        subject[key]:add(subKey, class:prototype[key][subKey]:bind({return subject.})).
                    }
                }
            } 
            else if (class:prototype[key]:typename = "UserDelegate") {
                subject:add(key, class:prototype[key]:bind({return subject.})).
            }
            else {
                subject:add(key, class:prototype[key]).
            }
        }
    }
}

global function importPrototypes {
    parameter prototype, methodsPath.

    set methodsPath to methodsPath:tostring:split("/").
    methodsPath:remove(methodsPath:length-1).
    cd(methodsPath:join("/") + "/.methods").

    list files in methodFiles.

    for method in methodFiles {
        local methodNameList is method:name:split(".").
        methodNameList:remove(methodNameList:length-1).

        local methodName is methodNameList[0].
        methodNameList:remove(0).

        for name in methodNameList {
            set methodName to methodName + camelCase(name).
        }
        local importFile is newCacheFile().

        importFile:writeln("parameter prototype.").
        importFile:writeln(method:readall:string:insert(method:readall:string:find("{") + 1, " parameter this. set this to this().")).
        importFile:writeln("prototype:add(" + quoteAround(methodName) +", " + methodName + "@).").

        runCacheFile(importFile, prototype).

        //runPath(methodsPath:join("/") + "/.methods/" + method:name, prototype).
    }

    cd("0:").
}
