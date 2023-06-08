local function correctEta {
    if (this:eta:get() < 0) {
        this:eta:inc(this:period()).
    }

    return this.
}