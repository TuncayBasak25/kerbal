local function next {
    if isNull(this:nextNode) {
        set this:nextNode to newNode(time:seconds + this:eta:get() + 60, 0, 0, 0).
        set this:nextNode:previousNode to this.

        return this:nextNode.
    }
    else {
        throwError("This node has already a next node!").
    }
}