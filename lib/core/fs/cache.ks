global null is lex().
global cacheFolder is "0:import/cache/".

global function newCacheFile {
    local id is cacheFolder + "cache_" + round(random() * 10_000) + ".ks".
    local cacheFile is open(id).

    until (cacheFile:typename <> "VolumeFile") {
        set id to cacheFolder + "cache_" + round(random() * 10_000) + ".ks".
        set cacheFile to open(id).
    }

    return create(id).
}

global function runCacheFile {
    parameter file.
    parameter p0 is null.
    parameter p1 is null.
    parameter p2 is null.
    parameter p3 is null.
    parameter p4 is null.
    parameter p5 is null.
    parameter p6 is null.

    local filePath is cacheFolder + file:name.

    if (p6 <> null) {
        runPath(filePath, p0, p1, p2, p3, p4, p5, p6).
    }
    else if (p5 <> null) {
        runPath(filePath, p0, p1, p2, p3, p4, p5).
    }
    else if (p4 <> null) {
        runPath(filePath, p0, p1, p2, p3, p4).
    }
    else if (p3 <> null) {
        runPath(filePath, p0, p1, p2, p3).
    }
    else if (p2 <> null) {
        runPath(filePath, p0, p1, p2).
    }
    else if (p1 <> null) {
        runPath(filePath, p0, p1).
    }
    else if (p0 <> null) {
        runPath(filePath, p0).
    }
    else {
        runPath(filePath).
    }
}

global function clearCache {
    cd(cacheFolder).
    list files in fileList.

    for file in fileList {
        deletePath(file:name).
    }

    cd("0:").
}