print "Finding AN/DN..".

local shipV is ship:obt:velocity:orbit:normalized * 9000000000.
local tarV is target:obt:velocity:orbit:normalized * 9000000000.

//plane normals
local shipN is vcrs(shipV,ship:position - body:position):normalized * 9000000000.
local tarN is vcrs(tarV,target:position - body:position):normalized * 9000000000.
if target:name = body:name { set tarN to ship:north:vector. }

set intersectV to vcrs(shipN,tarN):normalized * (target:position - body:position):mag.
set mark_intersectV to VECDRAWARGS(body:position, intersectV, RGB(1.0,0,0), "intsctV", 1, true).

local shipVec is ship:position - body:position.
set mark_shipVec to VECDRAWARGS(body:position, shipVec, RGB(0,0,1), "", 1, true).
local done is false.
local time_mod is 100.
local increment is 100.
local last_angl is vang(shipVec,intersectV).
ag2 off.
until done or ag2{
	set shipVec to positionat(ship, time:seconds + time_mod) - body:position.
	set mark_shipVec:vec to shipVec.
	set mark_shipVec:start to body:position.
	
	set angl to vang(shipVec,intersectV).
	set spd to (last_angl-angl)/increment.
	//print "Angle to node: " + round(angl,3) + "      " at (0,terminal:height - 5).
	
	if increment = 1 or angl < 0.05 and angl > last_angl {
		// last iteration was closest to target
		set done to true.
		set time_mod to time_mod - increment.
		
	}
	else {
		set increment to max(min(angl/(spd*4),50000),1).
		set last_angl to angl.
		set time_mod to time_mod + increment.
		wait 0.01.
	}
}
global nd is node(time:seconds + time_mod, 0,0,0).
add nd.