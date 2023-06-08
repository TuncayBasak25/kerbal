global null is lex("thisIsANullLexicon", true).


global function isNull {
    parameter object.

    if (object:typename = "Lexicon") and object:haskey("thisIsANullLexicon") {
        return true.
    }

    return false.
}

global function notNull {
    parameter object.

    return not isNull(object).
}