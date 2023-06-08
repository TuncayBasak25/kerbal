local function test {
    this:prograde:adjust():for(this:apoapsis):to(minmus:orbit:apoapsis - minmus:soiradius / 2):exception({return this:apoapsis() < 0.}):loop().
}