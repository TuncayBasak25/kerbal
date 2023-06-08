global function accessors {
    parameter class, template.

    return dynamicFunction(list("allias", "path", "getters", "setters", "scalars"), execute@:bind(class, template)).
} 


local function execute {
    parameter class, template, options.

    local get is getValue:bind(options).

    local allias is get("allias", template:typename:tolower()).
    local accessPath is get("path", allias).
    local getterList is get("getters", getSuffixList(template)).
    local setterList is get("setters", list()).
    local scalarList is get("scalars", list()).

    local outputFile is newCacheFile().
    outputFile:writeln("parameter prototype.").

    for key in scalarList {
        outputFile:writeln("prototype:add(" + quoteAround(key) + ",lex(" + quoteAround("isScalar") + ", true,").
        outputFile:writeln(quoteAround("get") + ", {parameter this. return this():" + accessPath + ":" + key + ".},").
        outputFile:writeln(quoteAround("set") + ", {parameter this, value. set this():" + accessPath + ":" + key + " to resolve(value). return this().},").
        outputFile:writeln(quoteAround("inc") + ", {parameter this, value. set this():" + accessPath + ":" + key + " to this():" + accessPath + ":" + key + " + resolve(value). return this().},").
        outputFile:writeln(quoteAround("dec") + ", {parameter this, value. set this():" + accessPath + ":" + key + " to this():" + accessPath + ":" + key + " - resolve(value). return this().},").
        outputFile:writeln(quoteAround("mul") + ", {parameter this, value. set this():" + accessPath + ":" + key + " to this():" + accessPath + ":" + key + " * resolve(value). return this().},").
        outputFile:writeln(quoteAround("div") + ", {parameter this, value. set this():" + accessPath + ":" + key + " to this():" + accessPath + ":" + key + " / resolve(value). return this().},").
        outputFile:writeln(quoteAround("adjust") + ", {parameter this. return Adjuster(this():" + key + ").}").
        outputFile:writeln(")).").
    }

    for key in getterList {
        local getterName is key:tolower().
        local prefixName is allias + camelCase(key:tolower()).
    
        addGetter(outputFile, accessPath, key, getterName, prefixName).
    
        if (setterList:find(key) > 0) {
            outputFile:writeln("prototype:add(" + quoteAround("set" + camelCase(key)) + ", {parameter this, value. set this():" + accessPath + ":" + key + " to resolve(value).}).").
        }

    }

    runCacheFile(outputFile, class:prototype).
}

local function addGetter {
    parameter outputFile, accessPath, key, getterName, prefixName.

    outputFile:writeln("if (prototype:haskey(" + quoteAround(getterName) + ")) {").
    outputFile:writeln("prototype:add(" + quoteAround(prefixName) + ", {parameter this. return this():" + accessPath + ":" + key + ".}).").
    outputFile:writeln("}").
    outputFile:writeln("else {").
    outputFile:writeln("prototype:add(" + quoteAround(getterName) + ", {parameter this. return this():" + accessPath + ":" + key + ".}).").
    outputFile:writeln("}").
}