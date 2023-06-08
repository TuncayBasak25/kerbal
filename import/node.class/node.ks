global NodeClass is lex(
    "prototype", lex("node", null, "previousNode", null, "nextNode", null)
).

accessors(NodeClass, node(0,0,0,0)):scalars("eta", "normal", "radialout", "prograde"):execute().

accessors(NodeClass, orbit):path("node:orbit"):execute().

accessors(NodeClass, orbit:eta):allias("eta"):path("node:orbit:eta"):execute().


importPrototypes(NodeClass:prototype, scriptPath()).

global function NewNode {
    parameter eta is time:seconds + 60, normal is 0, radialout is 0, prograde is 0.

    local mynode is undefined.

    if (eta:typename = "Node") {
        set mynode to eta.
    }
    else {
        set mynode to node(eta, normal, radialout, prograde).
        add mynode.
    }

    local this is lex().

    implement(this, NodeClass).

    set this:node to mynode.

    return this.
}