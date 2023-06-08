global undefined is lex("thisisanundefinedlexicon", true).


global function isUndefined {
    parameter object.

    if (object:typename = "Lexicon") and object:haskey("thisisanundefinedlexicon") {
        return true.
    }

    return false.
}

global function isDefined {
    parameter object.

    return not isUndefined(object).
}