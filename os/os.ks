clearGuis().


local window is gui(250).
window:show().

local launchLayout is window:addhlayout().

local launchButton is launchLayout:addbutton("Launch").
set launchButton:style:vstretch to true.


set launchButton:onclick to {
    if (launchButton:text = "Launch") {
        set launchButton:text to "Abort".

        programs:launch
            :altitude(launchAltitude:text:tonumber() * altitudeUnit:value:factor)
            :inclination(launchInclination:text:tonumber())
            :onAbort({
                set launchButton:text to "Launch".
            })
            :execute().
    }
    else {
        set launchButton:text to "Launch".
        programs:launch:abort().
    }
}.

local parameterLayout is launchLayout:addvlayout().

local altitudeLayout is parameterLayout:addhlayout().

local launchAltitudeTitle is altitudeLayout:addlabel("ALT").
set launchAltitudeTitle:style:padding:v to 7.
set launchAltitudeTitle:style:align to "left".
set launchAltitudeTitle:style:width to 34.

local launchAltitude is altitudeLayout:addtextfield().
set launchAltitude:style:padding:v to 7.
set launchAltitude:text to "75000".
set launchAltitude:style:hstretch to true.

local altitudeUnit is altitudeLayout:addpopupmenu().
set altitudeUnit:optionsuffix to "unit".
set altitudeUnit:style:width to 50.

local base is lex("unit", "m", "factor", 1).
altitudeUnit:addoption(base).
altitudeUnit:addoption(lex("unit", "km", "factor", 1_000)).
altitudeUnit:addoption(lex("unit", "Mm", "factor", 1_000_000)).
altitudeUnit:addoption(lex("unit", "Gm", "factor", 1_000_000_000)).

set altitudeUnit:value to base.


local inclinationLayout is parameterLayout:addhlayout().

local launchInclinationTitle is inclinationLayout:addlabel("INC").
set launchInclinationTitle:style:align to "left".
set launchInclinationTitle:style:width to 34.
set launchInclinationTitle:style:padding:v to 7.



local launchInclination is inclinationLayout:addtextfield().
set launchInclination:style:padding:v to 7.
set launchInclination:text to "1".
//set launchInclination:style:height to 100.


local testLayout is window:addhlayout().


local ksc is ship:geoposition.
lock tr to addons:tr.


local landButton is testLayout:addbutton("Land").
set landButton:style:hstretch to true.

set landButton:onclick to {
    if (landButton:text = "Land") {
        set landButton:text to "Abort Landing".

        programs:land
            :onAbort({
                set landButton:text to "Land".
            })
            :execute().
    }
    else {
        set landButton:text to "Land".
        programs:land:abort().
    }
}.
