local warpWindow is gui(150).
set warpWindow:x to 1124.
set warpWindow:y to 0.

set warpWindow:draggable to false.

warpWindow:show().

local warpTitle is warpWindow:addlabel("Physic Warp").
set warpTitle:style:align to "center".

local warpLayout is warpWindow:addhlayout().


local buttonList is list().
for i in range(4) {
  buttonList:add(warpLayout:addbutton(i:tostring())).
}

for i in range(4) {
    set buttonList[i]:style:align to "center".
    local warpNumber is i.
    set buttonList[i]:onclick to {
        physicWarp(warpNumber).
    }.
}