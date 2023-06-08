global function getFile {
    parameter filePath.

    if (not exists(filePath)) {
        return create(filePath).
    }
    return open(filePath).
}

global function clearFile {
    parameter path.
    open(path):clear().
}