global function newNode {
    parameter mynode is null.

    if (isnull(mynode)) {
        set mynode to node(time:seconds + 60, 0, 0, 0).
        add mynode.
    }

    local this is lex("node", mynode).

    this:add("eta", scalar({return mynode:eta.}, {parameter val. set mynode:eta to val.})).
    this:add("prograde", scalar({return mynode:prograde.}, {parameter val. set mynode:prograde to val.})).
    this:add("radialout", scalar({return mynode:radialout.}, {parameter val. set mynode:radialout to val.})).
    this:add("normal", scalar({return mynode:normal.}, {parameter val. set mynode:normal to val.})).
    

    this:add("periapsis", {return mynode:orbit:periapsis.}).
    this:add("apoapsis", {return mynode:orbit:apoapsis.}).

    this:add("body", {return mynode:orbit:body.}).
    this:add("hasNextPatch", {return mynode:orbit:hasNextPatch.}).

    this:add("etaApoapsis", {return mynode:orbit:eta:apoapsis.}).
    this:add("etaPeriapsis", {return mynode:orbit:eta:periapsis.}).


    this:add("onAbort", {
        parameter task.

        set this:onAbort to task.

        return this.
    }).
    this:add("execute", {programs:executeNode:mynode():onAbort(this:onAbort):execute().}).
    this:add("abort", false).



    this:add("periapsisTransfer", {parameter targetAltitude. return periapsisTransfer(this, targetAltitude).}).
    this:add("apoapsisTransfer", {parameter targetAltitude. return apoapsisTransfer(this, targetAltitude).}).

    return this.
}