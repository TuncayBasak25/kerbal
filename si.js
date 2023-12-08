(async function() {

async function getMenuWindow() {
    while (!document.getElementsByTagName("iframe")[3]) await sleep();
    return document.getElementsByTagName("iframe")[3].contentWindow;
}
async function getMenuWindow() {
    while (!document.getElementsByTagName("iframe"))
    return document.getElementsByTagName("iframe")[3].contentWindow
}

Object.defineProperty(window, 'sideBarDocument', {
    get: function () { return document.getElementById("F_Navi").contentDocument }
});

Object.defineProperty(window, 'sideBarWindow', {
    get: function () { return document.getElementById("F_Navi").contentWindow }
});

Object.defineProperty(window, 'centerDocument', {
    get: function () { return document.getElementById("F_Hauptframe").contentDocument }
});

Object.defineProperty(window, 'centerWindow', {
    get: function () { return document.getElementById("F_Hauptframe").contentWindow }
});

Object.defineProperty(window, 'dataDocument', {
    get: function () { return document.getElementById("F_planets").contentDocument }
});

Object.defineProperty(window, 'dataWindow', {
    get: function () { return document.getElementById("F_planets").contentWindow }
});

async function getInfos() {
    const url = `https://spaceinvasion.bitmeup.com/indexInternal.es?action=internalPlanetsOverview&${sid}`;

    const infoPage = await getPage(url);

    const jsonText = infoPage.split(`_json_string = `)[1].split(";")[0];

    return JSON.parse(jsonText);
}

async function build(buildingID) {
    const url = `https://spaceinvasion.bitmeup.com/indexInternal.es?${sid}&action=internalBuildItem&buildingID=${buildingID}`

    await getPage(url);


}

async function downgrade(buildingID) {
    const url = `https://spaceinvasion.bitmeup.com/indexInternal.es?${sid}&action=internalBuildItem&destructableID=${buildingID}`

    await getPage(url);


}


async function buildAll(buildingList) {
    while (buildingList.length > 0) {
        const text = await getPage(`https://spaceinvasion.bitmeup.com/indexInternal.es?${sid}&action=internalBuildings`);

        if (!text.match(/counter/ig)) {
            await build(buildingList.shift());
        }

        await sleep(1000);
    }
}
function getEmptyPlanetListCache() {
    return JSON.parse(localStorage.getItem("empty-planet-list-cache"));
}

function pushToEmptyPlanetList(planet) {
    const newList = getEmptyPlanetListCache();
    newList.push(planet);

    localStorage.setItem("empty-planet-list-cache", JSON.stringify(newList));
}


async function scanEmptyPlanet(gal) {
    localStorage.setItem("empty-planet-list-cache", JSON.stringify([]));

    for (let sun = 1; sun <= 50; sun++) {
        console.log(sun);
        getPlanetList(gal, sun + 50).then(a => a.forEach(planet => !planet.user && planet.temperature < -100 && pushToEmptyPlanetList({ ...planet })));
        getPlanetList(gal, sun + 100).then(a => a.forEach(planet => !planet.user && planet.temperature < -100 && pushToEmptyPlanetList({ ...planet })));
        getPlanetList(gal, sun + 150).then(a => a.forEach(planet => !planet.user && planet.temperature < -100 && pushToEmptyPlanetList({ ...planet })));
        getPlanetList(gal, sun + 200).then(a => a.forEach(planet => !planet.user && planet.temperature < -100 && pushToEmptyPlanetList({ ...planet })));
        getPlanetList(gal, sun + 250).then(a => a.forEach(planet => !planet.user && planet.temperature < -100 && pushToEmptyPlanetList({ ...planet })));
        getPlanetList(gal, sun + 300).then(a => a.forEach(planet => !planet.user && planet.temperature < -100 && pushToEmptyPlanetList({ ...planet })));
        getPlanetList(gal, sun + 350).then(a => a.forEach(planet => !planet.user && planet.temperature < -100 && pushToEmptyPlanetList({ ...planet })));
        (await getPlanetList(gal, sun)).forEach(planet => !planet.user && planet.temperature < -100 && pushToEmptyPlanetList({ ...planet }));
    }
}
class FleetComposer {
    ships = {}
    capacity = 0;
    available = 0;
    filled = 0;
    hasSlot = false;
    slots = 0;

    static window = null;

    get document() {
        return this.window.document;
    }

    async setup(coordinate) {
        if (!FleetComposer.window) {
            FleetComposer.window = open(Array.from(sideBarDocument.getElementsByTagName("a")).filter(el => el.href?.match(/internalFleet/i))[0].href, "Fleet", { popup: true });
        }
        this.window = FleetComposer.window;

        await sleep(1);

        let startTime = Date.now();
        
        this.window.location.href = Array.from(sideBarDocument.getElementsByTagName("a")).filter(el => el.href?.match(/internalFleet/i))[0].href;
        while (!Array.from(this.window.document.getElementsByTagName("b")).filter(el => el?.textContent.match(/Fleet bases/))[0]) {
            if (Date.now() - startTime > 2000){
                this.window.location.href = Array.from(sideBarDocument.getElementsByTagName("a")).filter(el => el.href?.match(/internalFleet/i))[0].href;
            }
            await sleep(1);
        }

        let el;

        while (!el) {
            el = Array.from(this.window.document.getElementsByTagName("b")).filter(el => el.textContent.match(/Fleet bases/))[0];
            await sleep(1);
        };
        this.capacity = el.parentElement.textContent.split(",").map(el => parseInt(el.replace(/[^0-9]/ig, "")))[0];
        this.filled = el.parentElement.textContent.split(",").map(el => parseInt(el.replace(/[^0-9]/ig, "")))[1];
        this.available = this.capacity - this.filled;

        if (this.available < 1) {
            return false;
        }
        
        await sleep(500);
        this.setCoordinate(coordinate);

        const fleetForm = this.window.document.getElementsByName("fleet")[0];

        const shipRowList = Array.from(fleetForm.lastElementChild.firstElementChild.firstElementChild.children);

        shipRowList.shift();


        for (let { children } of shipRowList) {
            const shipAmountElement = children[0];
            const shipNameElement = children[1];

            const maxSetElement = children[4].firstElementChild;
            const amountSetElement = children[5].children[1];

            this.ships[shipNameElement.textContent.replace(/[^a-z0-9]/gi, '').toLowerCase()] = {
                available: parseInt(shipAmountElement.lastElementChild.textContent),
                setToMax: () => maxSetElement.click(),
                setTo: amount => amountSetElement.value = `${amount}`
            }
        }

        return true;
    }

    setCoordinate({ gal, sun, pla }) {
        if (gal) this.window.document.all["fleet"].gal.value = gal;
        if (sun) this.window.document.all["fleet"].sun.value = sun;
        if (pla) this.window.document.all["fleet"].pla.value = pla;
    }

    hasSlot() {
        const l = Array.from(this.window.document.getElementsByTagName("td")).filter(el => el.textContent.match(/filled/))[0].textContent.split(",")

        const available = l[0].replace(/^0-9/gi, "");
        const filled = l[1].replace(/^0-9/gi, "");

        return available !== filled;
    }

    setToMax() {
        for (let ship of Object.values(this.ships)) {
            ship.setToMax();
        }
    }

    async continue() {
        Array.from(this.window.document.getElementsByTagName("input")).filter(el => el.value === "continue")[0].click();

        let timeOut = 0;
        while (this.window.location.href.match(/internalFleet/)) {
            timeOut++;
            if (timeOut > 2000) {
                console.log("retry status!");
                this.status = "failed";
            }
            if (Array.from(this.window.document.getElementsByTagName("th")).filter(el => el.textContent.match(/You\sneed\s/))[0]) {
                return { noslot: true };
            }
            await sleep(1);
        }
    }

    async mission(missionName) {
        await this.continue();

        if (this.status === "failed") {
            return { failed: true };
        }

        const mission = new FleetSender();
        mission.window = this.window;

        if (missionName === "TRANSPORT") return mission;
        
        if (await mission.selectMission(missionName)) {
            await mission.send();
            this.status = mission.status;
            return true;
        }

        return false;
    }
}

class FleetSender {
    async missionCheck() {
        let timeOut = 0;
        while (!Array.from(this.window.document.getElementsByTagName("input")).filter(el => el.value === "SAVE")[0]) {
            timeOut++;
            if (timeOut > 2000) {
                console.log("retry status!");
                this.status = "retry";
            }
            await sleep(1);
        }
    }

    async selectMission(missionName) {
        await this.missionCheck();

        if (this.status === "retry") {
            return true;
        }

        const el = Array.from(this.window.document.getElementsByTagName("input")).filter(el => el.value === missionName)[0];
        if (el) {
            el.click();
            return true;
        }
        
        return false;
    }

    async send() {
        this.window.startFleet();

        let timeOut = 0;
        while (!Array.from(this.window.document.getElementsByTagName("th")).filter(el => el.textContent.match(/Your\sfleet\swas\ssent|This\suser/))[0]) {
            timeOut++;
            if (timeOut > 2000) {
                console.log("retry status!");
                this.status = "retry";
                break;
            }
            await sleep(1);
        }

        return true;
    }
}


async function requestFleetContract( gal, sun, pla, transmitter) {
    const url = "https://spaceinvasion.bitmeup.com/indexInternal.es?action=internalSendFleet&" + sid;

    const data = new FormData();

    data.append("sid", sid.split("=")[1]);

    data.append("ship_3", transmitter);

    data.append("gal", gal);
    data.append("sun", sun);
    data.append("pla", pla);

    data.append("sendFleet", 1);

    const text = await getPage(url,  { method: "POST", body: data });

    const sendForm = new FormData();

    if (text === "") return false;

    sendForm.append("sid", sid.split("=")[1]);

    sendForm.append("targetPlanetID", idFromCoordinate(gal, sun, pla));

    sendForm.append("fc", text.split('name="fc" value="').pop().split('">')[0]);
    sendForm.append("distance", parseInt(text.split('<td class="nachricht" width="120">')[1].split('</td>')[0]));
    sendForm.append("lowestSpeed", parseInt(text.split('<div id="speed1">')[1].split('</div>')[0]));
    sendForm.append("capacity", parseInt(text.split('<div id="laderaum">')[1].split('</div>')[0]));

    sendForm.append("longmode", "0");

    sendForm.append("ship_3", transmitter);

    return sendForm;
}

async function sendFleet(gal, sun, pla, transmitter) {
    const url = "https://spaceinvasion.bitmeup.com/indexInternal.es?action=internalSendFleetFinish&" + sid;

    const data = await requestFleetContract(gal, sun, pla, transmitter);

    if (!data) return "retry";

    data.append("destinationType", "PLANET");

    data.append("todo", "ATTACK");

    data.append("fleet_roh", "");
    data.append("fleet_met", "");
    data.append("fleet_kry", "");
    data.append("fleet_spi", "");

    data.append("speed", "100");

    const text = await getPage(url, { method: "POST", body: data });

    if (text.match(/Your fleet/ig)) {
        console.log("Your fleet was sent!");
        return true;
    }

    if (text.match(/This user/ig)) {
        console.log("This user can't be attacked!");
        return false;
    }

    console.log("May retry this!");
    return "retry";
}

async function requestMissionContract(missionInfos) {
    const url = "https://spaceinvasion.bitmeup.com/indexInternal.es?action=internalSendFleet&" + sid;
    
    const data = new FormData();
    
    data.append("sid", sid.split("=")[1]);
    
    if (missionInfos.transmitter) data.append("ship_3", missionInfos.transmitter);
    if (missionInfos.spyprobe) data.append("ship_10", missionInfos.spyprobe);
    if (missionInfos.recycler) data.append("ship_11", missionInfos.recycler);
    
    const { gal, sun, pla } = missionInfos;

    if (!gal || !sun || !pla) {
        console.log(gal, sun, pla);
        throw new Error("Coordinate missing!");
    }

    data.append("gal", gal);
    data.append("sun", sun);
    data.append("pla", pla);

    data.append("sendFleet", 1);

    const text = await getPage(url, { method: "POST", body: data });

    if (text.match(/The coordinates are invalid!/ig)) {
        console.log("Invalid coordinates!");
        return "No planet";
    }
    else if (text.match(/No fleet was selected!/ig)) {
        console.log(missionInfos);
        throw new Error("No Fleet was selected: ");
    }

    const sendForm = new FormData();

    if (text === "") return false;

    sendForm.append("sid", sid.split("=")[1]);

    sendForm.append("targetPlanetID", idFromCoordinate(gal, sun, pla));

    let part = text.split('name="fc" value="').pop();
    part && sendForm.append("fc", part.split('">')[0]);
    part = text.split('<td class="nachricht" width="120">')[1];
    part && sendForm.append("distance", parseInt(part.split('</td>')[0]));
    part = text.split('<div id="speed1">')[1];
    part && sendForm.append("lowestSpeed", parseInt(part.split('</div>')[0]));
    part = text.split('<div id="laderaum">')[1];
    part && sendForm.append("capacity", parseInt(part.split('</div>')[0]));

    sendForm.append("longmode", "0");

    if (missionInfos.transmitter) sendForm.append("ship_3", missionInfos.transmitter);
    if (missionInfos.spyprobe) sendForm.append("ship_10", missionInfos.spyprobe);
    if (missionInfos.recycler) sendForm.append("ship_11", missionInfos.recycler);

    return sendForm;
}

async function sendMission(missionInfos) {
    
    const url = "https://spaceinvasion.bitmeup.com/indexInternal.es?action=internalSendFleetFinish&" + sid;

    const missionContract = await requestMissionContract(missionInfos);

    if (!missionContract) return "retry";

    if (missionContract === "No planet") return missionContract;

    const { destinationType = "PLANET", todo, iron = 0, metal = 0, kryptonit = 0, spice = 0, speed = 100 } = missionInfos;

    missionContract.append("destinationType", destinationType);

    if (!todo) throw new Error("No todo!");

    missionContract.append("todo", todo);

    missionContract.append("fleet_roh", iron);
    missionContract.append("fleet_met", metal);
    missionContract.append("fleet_kry", kryptonit);
    missionContract.append("fleet_spi", spice);


    missionContract.append("speed", speed);

    const text = await getPage(url, { method: "POST", body: missionContract });

    if (text.match(/Your fleet/ig)) {
        console.log("Your fleet was sent!");
        return true;
    }

    if (text.match(/This user/ig)) {
        console.log("This user can't be attacked!");
        return false;
    }

    console.log(`May retry this! COORDS: ${missionInfos.gal}:${missionInfos.sun}:${missionInfos.pla}`);
    return "retry";
}

function coordinateFromId(planetID) {
    var id = planetID * 1;
    var g = Math.ceil(id / 6400);
    id -= ((g - 1) * 6400);
    var s = Math.ceil(id / 16);
    var p = id - ((s - 1) * 16);
    return g + ":" + s + ":" + p;
}

function idFromCoordinate(gal, sun, pla) {
    return `${pla + ((sun - 1) * 16) + ((gal - 1) * 6400) }`;
}

function getTravelTimeConstant() {
    return parseInt(localStorage.getItem("travelTimeConstant"));
}


function transmitterSpeed() {
    return 21000;
}


async function recallAllMission() {
    await navigator.fleet();

    await sleep(1000);

    Array.from(centerDocument.getElementsByTagName("input")).filter(a => a.value.match(/recall/ig)).map(a => a.click());
}


let json;
async function getPlanetList(gal, sun) {

    if (!json) {
        json = "fetching";

        const firstPageText = await getPage(`https://spaceinvasion.bitmeup.com/indexInternal.es?action=internalGalaxy&g=${gal}&s=${sun}&${sid}`);

        if (firstPageText) {
            json = firstPageText.split("si.json = ")[1];
    
            json = JSON.parse(json.split(";")[0]);
        }
    }
    else if (json === "fetching") {
        await async(() => json !== "fetching");
    }

    const url = `https://spaceinvasion.bitmeup.com/indexInternal.es?action=internalGalaxy&get=1&g=${gal}&s=${sun}&${json.b.k}=${json.b.v}&${sid}`;

    const data = await getPage(url);

    if (!data) {
        await sleep(1000);

        return await getPlanetList(gal, sun, json);
    }

    const result = JSON.parse(data);

    if (result.result === "error") {
        if (result.type === "pageview") {
            console.log("Awaiting timeout " + result.left);
            await sleep(result.left * 1000 + 1);
            
            return await getPlanetList(gal, sun, json);
        }
        else {
            console.log(result);

            throw new Error("Unknow galaxy result error!");
        }
    }

    return result.planets.filter(a => a.user?.status !== "admin");
}
const playerNameList = [new RegExp("Bongsko"),
    new RegExp("TigerPanther"),
    new RegExp("PR3DATOR"),
    new RegExp("Artur825"),
    new RegExp("LennoxBLN"),
    new RegExp("Magustrio"),
    new RegExp("Stroyner"),
    new RegExp("Natix798"),
    new RegExp("styna12_2"),
    new RegExp("Darkknight"),
    new RegExp("Gege"),
    new RegExp("mampf27"),
    new RegExp("xDeadStone"),
    new RegExp("DViper"),
    new RegExp("Niels"),
    new RegExp("DanimK"),
    new RegExp("0efect"),
    new RegExp("Janni"),
    new RegExp("Bombhead1987"),
    new RegExp("Jogi"),
    // new RegExp("Belator"),
    //new RegExp("bossy"),
    new RegExp("Paul Muad"),
    new RegExp("TUSMUELAS"),
    new RegExp("infer"),
    new RegExp("Fliege2612"),
    new RegExp("melon"),
    new RegExp("Poliascobius"),
    new RegExp("Aurora13"),
    new RegExp("Grummel"),
    new RegExp("killforme"),
    new RegExp("[ATV]MrKizzl"),
    new RegExp("cikuta"),
    new RegExp("AndreyK89"),
    new RegExp("Demonarokden_1"),
    new RegExp("authentiks"),
    new RegExp("Bertoglio_1"),
    new RegExp("BIT_FAIL"),
    new RegExp("Bangkokbetty_1"),
    new RegExp("Gouldart_2"),
    new RegExp("Justchillin9125"),
    new RegExp("tomaszl199"),
    new RegExp("WORUS"),
    new RegExp("Junno-IV"),
    new RegExp("Eddy1"),
    new RegExp("TEMISTOCLES"),
    new RegExp("Joh90"),
    new RegExp("Spacia")
];

const oneAttackPlayerNameList = [
    //new RegExp("killforme"),
    //new RegExp("cikuta"),
    //new RegExp("Belator"),
    new RegExp("Spacia")
]

class Galaxy {

    window = null

    gal = 1;
    sun = 1;
    pla = 1;

    get document() {
        return this.window.document;
    }

    async setup() {
        while (!sideBarWindow) await sleep(1);

        eval("let {breite, hoehe, xpos, ypos} = sideBarWindow; sideBarWindow.openGalaxy =" + sideBarWindow.p_galaxy.toString().replace(/"Galaxy"/, `"${Date.now()}"`).replace(/galaxy/, "const galaxy").replace(/galaxy.focus\(\)/, "return galaxy"));


        this.window = sideBarWindow.openGalaxy();

        await async(() => this.document.readyState === "complete");

        await async(() => this.document.getElementById("fa-gal")?.value);

        this.gal = parseInt(this.galInput.value);
        this.sun = parseInt(this.sunInput.value);
    }

    get galInput() {
        return this.document.getElementById("fa-gal");
    }
    get sunInput() {
        return this.document.getElementById("fa-sun");
    }
    get plaInput() {
        return this.document.getElementById("fa-pla");
    }

    async getSPaciaList() {
        const spaciaList = Array.from(this.document.getElementsByTagName('b')).filter(el => {
            for (let playerName of playerNameList) {
                if (el.parentElement.textContent.match(playerName)) {
                    return true;
                }
            }
        });

        return spaciaList;
    }

    async navigate(gal, sun, pla, force) {
        if(gal < 1 || gal > 8) {
            throw new Error("Galthisaxy range out.");
        }
        if (sun < 1 || sun > 400) {
            throw new Error("Sun range out.");
        }

        await async(() => this.window.si);

        const systemChanged = this.gal !== gal && this.sun !== sun;

        this.gal = gal;
        this.sun = sun;
        
        if (force || systemChanged) {
            sleep(1);
            this.window.si.navigate(gal, sun);
        }
        while (parseInt(this.sunInput?.value) !== sun || parseInt(this.galInput?.value) !== gal) {
            this.window.si.navigate(gal, sun);
            await sleep(1000);
        }

        if (pla) {
            this.plaInput.value = pla;
        }
    }

    async refresh() {
        await this.navigate(this.gal, this.sun, this.pla, true);
    }

    sendSpy(treasurehunt) {
        this.window.si.startFlight(treasurehunt ? "event" : "spy");
    }

    async getSlots() {
        let slotElement;

        while (!slotElement) {
            slotElement = this.document.getElementById("planet-slots");

            await sleep(1);
        }

        const [used, max] = slotElement.textContent.split(" / ");

        return max - used;
    }

    close() {
        this.window.close();
    }
}

const galaxy = {
    ready: null,
    onReady: () => {},
    window: null,
    document: null,

    openedWindow: null,

    setup: async () => {
        galaxy.window = open("", "Galaxy");

        galaxy.document = galaxy.window.document;

        await async(() => galaxy.document.readyState === "complete");

        await async(() => galaxy.document.getElementById("fa-gal"));

        galaxy.galInput = galaxy.document.getElementById("fa-gal");
        galaxy.sunInput = galaxy.document.getElementById("fa-sun");
        galaxy.plaInput = galaxy.document.getElementById("fa-pla");

        galaxy.gal = parseInt(galaxy.galInput.value);
        galaxy.sun = parseInt(galaxy.sunInput.value);

        galaxy.ready = true;
        galaxy.onReady();
    },

    gal: 0,
    sun: 0,
    pla: 0,


    sendSpy: () => {
        galaxy.window.si.startFlight("spy");
    },

    clickOnSpacia: async () => {
        console.log("In click on spacia");

        const spaciaList = Array.from(galaxy.document.getElementsByTagName('b')).filter(el => {
            for (let playerName of playerNameList) {
                if (el.parentElement.textContent.match(playerName)) {
                    return true;
                }
            }
        });

        for (let spacia of spaciaList) {
            while (!planetHasSlots) {
                console.log("No solts waiting spaceia");
                await new Promise(res => setTimeout(() => res(), 100));
            }
            
            spacia.parentElement.nextElementSibling.click();

            galaxy.sendSpy();

            await new Promise(res => setTimeout(() => res(), 1000));
        }
    },

    getSPaciaList: async (sun) => {

        while (parseInt(galaxy.document.getElementById("fa-sun")?.value) !== sun) {
            await sleep(1);   
        }

        const spaciaList = Array.from(galaxy.document.getElementsByTagName('b')).filter(el => {
            for (let playerName of playerNameList) {
                if (el.parentElement.textContent.match(playerName)) {
                    return true;
                }
            }
        });

        return spaciaList;
    },

    nextGalaxy: () => {
        if (galaxy.gal < 6) galaxy.gal++;
        else galaxy.gal = 1;

        galaxy.window.si.navigate(galaxy.gal, galaxy.sun);
    },

    previousGalaxy: () => {
        if (galaxy.gal > 1) galaxy.gal--;
        else galaxy.gal = 6;

        galaxy.window.si.navigate(galaxy.gal, galaxy.sun);
    },

    nextSystem: () => {
        if (galaxy.sun < 400) galaxy.sun++;
        else galaxy.sun = 1;

        galaxy.window.si.navigate(galaxy.gal, galaxy.sun);
    },

    previousSystem: () => {
        if (galaxy.sun > 1) galaxy.sun--;
        else galaxy.sun = 400;

        galaxy.window.si.navigate(galaxy.gal, galaxy.sun);
    },

    navigate: (gal, sun) => {
        if (gal < 1 || gal > 6) {
            throw new Error("Galaxy range out.");
        }
        if (sun < 1 || sun > 400) {
            throw new Error("Sun range out.");
        }

        galaxy.gal = gal;
        galaxy.sun = sun;

        galaxy.window.si.navigate(gal, sun);
    },

    refresh: () => galaxy.navigate(galaxy.gal, galaxy.sun)
}


const galaxyList = {
    1: 1,
    2: 1,
    3: 1,
    4: 1,
    5: 1,
    6: 1,

    actual: 1
}

class Report {
    gal = 0;
    sun = 0;
    pla = 0;

    constructor(gal, sun, pla) {
        this.gal = gal;
        this.sun = sun; 
        this.pla = pla;
    }

    done = false;
    planetList = [];

    remove() {
        this.done = true;
        Planet.list.forEach(planet => {
            planet.sypyReportList.splice(planet.sypyReportList.indexOf(this), planet.sypyReportList.indexOf(this));
        });
    }
}

async function inactifFinder() {

    const galaxy = new Galaxy();
    console.log("Opening galaxy");
    await galaxy.setup();



    while (Object.values(galaxyList).length !== 1) {
        const gal = galaxyList.actual;
        const sun = galaxyList[gal];

        await galaxy.navigate(gal, sun);
        await sleep(400);
        const planetNumberList = [];
        Array.from(galaxy.document.getElementsByTagName('b')).filter(el => {
            for (let playerName of playerNameList) {
                if (el.parentElement.textContent.match(playerName)) {
                    planetNumberList.push(el.parentElement.parentElement.parentElement.parentElement.parentElement.nextElementSibling.textContent)
                    return true;
                }
            }
        });


        for (let pla of planetNumberList) {
            console.log(`[${gal}:${sun}:${pla}]`);
            inactifCoordinateList.push(new Report(gal, sun, parseInt(pla)));
        }

        galaxyList[galaxyList.actual]++;

        
        if (galaxyList[galaxyList.actual] === 401) {
            delete galaxyList[galaxyList.actual];
            
            galaxyList.actual = Object.keys(galaxyList).shift();
        }
        else if (galaxyList[galaxyList.actual] % 100 === 0) {
            galaxyList.actual++;
            if (galaxyList.actual > 6) {
                galaxyList.actual = 1;
            }
        }
    }

    localStorage.setItem("inactifCoordinateList", JSON.stringify(inactifCoordinateList));

    scan = false;
}

async function spyParalel() {
    await Planet.loadPlanetSlots();

    while (scan || Planet.list.reduce((acc, cur) => acc || cur.sypyReportList.length)) {

        while (inactifCoordinateList.length > 0) associateSpyMission(inactifCoordinateList.shift());
        

        for (let planet of Planet.list) {
            planet.sypyReportList = planet.sypyReportList.filter(report => !report.done);
            if (planet.sypyReportList.length > 0) {
                await planet.activate();
                
                while (planet.sypyReportList.length > 0) {
                    const report = planet.sypyReportList.shift();
                    const status = await sendSpy(report);
                    if (status) {
                        if (status.noslot) {
                            console.log("NO SLOT");
                            break;
                        }
                        else {
                            report.remove();
                            spyedReport.push(report);
                        }
                    }
                    else {
                        report.remove();
                        failedReporList.push(report);
                    }
                }
            }
        }
        await sleep(1000);
    }
}

async function associateSpyMission(report) {
    const { gal, sun } = report;

    Planet.list.forEach(planet => {
        const sameGal = planet.gal === gal && Math.abs(planet.sun - sun) <= 60;
        const CloseGal = Math.abs(planet.gal - gal) === 5 || Math.abs(planet.gal - gal === 1);

        if (sameGal || CloseGal) {
            planet.sypyReportList.push(report);
            report.planetList.push(planet);
        }
    })
}
navigator;

const data = {};
async function getJson() {
    await Spionage.loadReports();

    for (let i = 0; i < Spionage.spionageList.length; i++) {
        data[i] = Spionage.spionageList[i].data;
    }
}

async function isResearchBusy() {
    const url = `https://spaceinvasion.bitmeup.com/indexInternal.es?action=internalResearch&${sid}`;

    const pageHTML = await (await fetch(url)).text();

    if (pageHTML.match(/counter/i)) {
        return true;
    }

    return false;
}

async function autoResearchLoop(researchIDList) {

    for (const researchID of researchIDList) {
        while (await isResearchBusy()) await sleep(10000);

        const researchUrl = `https://spaceinvasion.bitmeup.com/indexInternal.es?action=internalBuildItem&researchID=${researchID}&${sid}`

        await fetch(researchUrl);

        await sleep(10000);
    }
}

async function allSlotsRecovered() {

    while (true) {
        console.log("Awaiting planet slots");
        await sleep(10000);

        let breaking = true;
        for (const planet of Planet.list) {
            const slots = await planet.getSlots();

            if (planet.max - slots > 1) {
                breaking = false;
                break;
            }
        }

        if (breaking) break;
    }

    return true;
}

async function raidSequence(delaySecond = 0) {
    await sleep(delaySecond * 1000);

    await spyInactifCoordinate();

    await allSlotsRecovered();

    await fetchLoadReports();

    await raidData();

    await save(2, 26);

    await sleep((2 * 3600 + 27 * 60) * 1000);

    saveGarantie();
}

async function finalRaid(delaySecond = 0) {
    await sleep(delaySecond * 1000);

    await spyInactifCoordinate();

    await allSlotsRecovered();

    await fetchLoadReports();

    await raidData();

    await save(6);
}

async function recycleSequence(delaySecond = 0) {
    await sleep(delaySecond * 1000);

    await scanAll([]);
    await allSlotsRecovered();

    await Planet.nahkent.refreshInfos();


    //assignCloseRubbleField(25);
    assignFarRubbleField();
    //assignRubbleField();

    for (let planet of Planet.list) {
        await planet.fetchActivate();
        for (const rubblefield of planet.rubberList) await sendRecycler(rubblefield);

        planet.rubberList = [];
    }

    await save(5, 16);

    await sleep((5 * 3600 + 16 * 60) * 1000 + 10);

    saveGarantie();
}


async function buildLambda() {
    for (let i=4; i<Planet.list.length; i++) {
        await Planet.list[i].fetchActivate()
        for (let x=11; x<15; x++) await build(x);
    }
}

async function treasureHunt(cooldownInMinute = 8) {
    let eventPlanetList = [];
    console.log("New scan");
    await scanAllEventPlanet();
    
    eventPlanetList = getEventPlanetList().filter(a => a[3] !== undefined);
    console.log(`S: ${eventPlanetList.filter(a => a[3] === 4).length}  A: ${eventPlanetList.filter(a => a[3] === 3).length}  B: ${eventPlanetList.filter(a => a[3] === 2).length}  C: ${eventPlanetList.filter(a => a[3] === 1).length}`);
    
    while (true) {
        for (const planet of Planet.list) {
            if (eventPlanetList.length === 0) {
                console.log("Awaiting new scan");
                await sleep(60000 * cooldownInMinute);
                console.log("New scan");
                await scanAllEventPlanet();
                
                eventPlanetList = getEventPlanetList().filter(a => a[3] !== undefined);
                console.log(`S: ${eventPlanetList.filter(a => a[3] === 4).length}  A: ${eventPlanetList.filter(a => a[3] === 3).length}  B: ${eventPlanetList.filter(a => a[3] === 2).length}  C: ${eventPlanetList.filter(a => a[3] === 1).length}`);
            }

            let slots = await planet.getSlots();
            
            if (slots > 0) {
                eventPlanetList.sort((a, b) => {
                    const distanceA = planetDistance([planet.gal, planet.sun], a)
                    const distanceB = planetDistance([planet.gal, planet.sun], b)
                    const value = ((distanceB <= 5000 ? b[3] : 0) - (distanceA <= 5000 ? a[3] : 0)) * 1000000;

                    return distanceA - distanceB + value;
                });

                while (slots > 0 && eventPlanetList.length > 0) {
                    const target = eventPlanetList.shift();

                    if (planetDistance([planet.gal, planet.sun], target) > 5000) {
                        eventPlanetList.push(target);
                        break;
                    }

                    const mission = await sendMission({ todo: "EVENT", gal: target[0], sun: target[1], pla: target[2], spyprobe: 1 });

                    if (mission === true) slots--;
                    else if (mission === "retry") {
                        eventPlanetList.push(target);
                        break;
                    }
                }
            }
        }
    }
}


function planetDistance(a, b) {
    let galDistance = Math.abs(a[0] - b[0]);

    if (galDistance > 3) galDistance = 6 - galDistance;

    let sunDistance = Math.abs(a[1] - b[1]);

    if (sunDistance > 200) sunDistance = 400 - sunDistance;

    return galDistance * 5000 + (galDistance === 0 ? sunDistance * 50 + (sunDistance > 0 ? 850 : 0) : 0);
}
async function getReturningMissionList() {
    
    while (!centerWindow.location.href.match(/internalHome/)) {
        await navigator.commands();
        await sleep(1);
    }
    
    const pageChecker = () => Array.from(centerDocument.getElementsByTagName("b")).filter(el => el.textContent.match(/Planet\sdescription/i))[0];
    
    while (!pageChecker()) await sleep(1);
    
    const returningFleetElement = Array.from(centerDocument.getElementsByTagName("b")).filter(el => el.textContent.match(/returning\sfleets/i))[0];

    const missionList = [];

    if (!returningFleetElement) {
        return missionList;
    }

    let missionRow = returningFleetElement.parentElement.parentElement.nextElementSibling;

    while (missionRow) {
        for (let planet of Planet.list) {
            if (missionRow.children[3].textContent.match(new RegExp(planet.name))) {
                missionList.push(planet);
            }
        }

        missionRow = missionRow.nextElementSibling;
    }

    return missionList;
}
//Declaration
Object.defineProperty(window, 'navigator', {
    get: function () {
        const menuItemList = {
            commands: "Command central",
            buildings: "Buildings",
            industry: "Industry",
            research: "Research",
            weapons: "Weapons factory",
            fleet: "Fleet commands",
            messages: "Messages",
            galaxy: "Galaxy",
        };

        const navigator = {}

        const el_list = sideBarDocument.getElementsByTagName("a");

        for (let [key, name] of Object.entries(menuItemList)) {
            for (let el of el_list) {
                if (el.textContent.match(new RegExp(name))) {
                    if (Array.from(centerDocument.getElementsByTagName("a")).filter(el => el.href.match(/spio/))[0]) {
                        navigator.spying = () => Array.from(centerDocument.getElementsByTagName("a")).filter(el => el.href.match(/spio/))[0].click();
                    }
                    if (key !== "galaxy") {
                        navigator[key] = async () => {
                            navigator.actual = key;
                            el.click();
                        }
                    }
                    else {
                        galaxy.open = () => {
                            if (!sideBarWindow.galaxySetting) {
                                sideBarWindow.galaxySetting = true;

                                const real_open_window = sideBarWindow.open;

                                sideBarWindow.open = (...paramList) => {
                                    const openedWindow = real_open_window(...paramList);

                                    return openedWindow;
                                }
                            }

                            el.click();

                            return new Promise((r, j) => setTimeout(() => r(galaxy.setup()), 1000));
                        }
                    }
                }
            }
        }


        return navigator;
    }
});



navigator;
class Planet {
    static actual = new Planet();

    static all = {};
    static list = [];

    name = "";

    gal = 0;
    sun = 0;
    pla = 0;

    resources = {
        iron: 0,
        metal: 0,
        kryptonit: 0,
        spice: 0
    }

    availableSlot = 0;
    filledSlot = 0;
    maxSlot = 0;

    reportList = [];
    rubberList = [];

    constructor(name, gal, sun, pla) {
        this.name = name;
        this.gal = gal;
        this.sun = sun;
        this.pla = pla;
    }

    async activate() {
        
        if (Planet.actual !== this) {
            const planetElementList = await getPlanetElementList();

            centerWindow.location.href = planetElementList.filter(el => el.textContent.includes(this.name))[0].value;

            await sleep(2000);
        }

        Planet.actual = this;
    }

    async fetchActivate() {
        await fetch(planetElementList.filter(el => el.textContent.includes(this.name))[0].value);
    }

    slotGettedRecently = false;
    async getSlots() {
        if (this.slotGettedRecently) {
            await sleep();
            return 0;
        }

        await this.fetchActivate();

        const url = "https://spaceinvasion.bitmeup.com/indexInternal.es?action=internalFleet&" + sid;

        const fleetPage = await getPage(url);

        const used = parseInt(fleetPage.split("filled: ")[1].split(")")[0]);
   
        if (this.max - used === 0) {
            setTimeout(() => this.slotGettedRecently = false, 1000);

            this.slotGettedRecently = true;
        }

        return this.max - used;
    }

    async activateTeleport() {
        await this.fetchActivate();

        const url = "https://spaceinvasion.bitmeup.com/indexInternal.es?action=internalFleet&teleport=activate&" + sid;

        await getPage(url);
    }

    async refreshInfos() {
        const infos = await getInfos();

        for (let planetInfo of infos.planets) {
            for (let planet of Planet.list) {
                if (planet.name === planetInfo.name) {
                    planet.slot = planetInfo.buildings.b10.level;
                    planet.max = planet.slot;

                    planet.infos = planetInfo;

                    if (planetInfo.astro) {
                        planet.asteroid.infos = planetInfo.astro;
                        planet.asteroid.slot = planetInfo.astro.buildings.b10.level;
                        planet.asteroid.max = planet.asteroid.slot;
                    }
                }
            }
        }

        await sleep();
    }

    async getInfos() {
        await this.refreshInfos();
        
        return this.infos;
    }

    get id() {
        return `${this.pla + ((this.sun - 1) * 16) + ((this.gal - 1) * 6400)}`;
    }
}




//Init

const planetElementList = await getPlanetElementList();

planetElementList.forEach(planetElement => {
    const [name, coordText] = planetElement.textContent.split(" ");

    const [gal, sun, pla] = coordText.split(":").map(el => parseInt(el.replace(/[^0-9]/ig, "")));

    Planet.list.push(new Planet(planetElement.textContent.match(/asteroid/i) ? planetElement.textContent : name, gal, sun, pla));
});

for (let planet of Planet.list) {
    if (planet.name.match(/asteroid/i)) {
        for (parent of Planet.list) {
            if (!parent.name.match(/asteroid/i) && parent.gal === planet.gal && parent.sun === planet.sun && parent.pla === planet.pla) {
                parent.asteroid = planet;
                planet.parent = parent;

                planet.astroId = 1820;
            }
        }
    }
}

for (let planet of Planet.list) {
    Planet[planet.name.toLowerCase()] = planet;

    planet.refreshInfos();
}


//Html query

async function getPlanetElementList() {
    let planetElementList = [];

    while (planetElementList.length === 0) {
        const planetOptgroup = Array.from(centerDocument.getElementsByTagName("optgroup")).filter(el => el.label === "Planets")[0] || [];

        planetElementList = Array.from(planetOptgroup.children || []);

        await sleep(1);
    }

    const asteroidOptgroup = Array.from(centerDocument.getElementsByTagName("optgroup")).filter(el => el.label === "Asteroids")[0] || [];

    let asteroidElementList = Array.from(asteroidOptgroup.children || []);

    return planetElementList.concat(asteroidElementList);
}


if (!localStorage.getItem("playerList")) {
    localStorage.setItem("playerList", JSON.stringify([]));
}

function resetPlayerList() {
    localStorage.setItem("playerList", JSON.stringify([]));
}

function getPlayerList() {
    return JSON.parse(localStorage.getItem("playerList"));
}

async function getPlayer(playerNameOrplayerInfo) {
    const playerList = getPlayerList();

    if (typeof playerNameOrplayerInfo === "string") {
        return playerList.find(player => player.nickname === playerNameOrplayerInfo);
    }
    
    if (typeof playerNameOrplayerInfo.nickname === "string") {
        let player = playerList.find(player => player.nickname === playerNameOrplayerInfo.nickname);

        if (!player) {
            player = await addPlayer(playerNameOrplayerInfo);
        }

        return player;
    }

    throw new Error("Player getting error: " + playerNameOrplayerInfo);
}

async function getPlayerFleetPoint(userID) {
    const url = `https://spaceinvasion.bitmeup.com/indexInternal.es?action=internalProfile&get=1&userID=${userID}&${sid}`;

    let page = await getPage(url);

    while (!page.split(`>Fleet</td>`)[1]) {
        console.log("Get Fleet ranking error");
        console.log(page);
        
        page = await getPage(url);
        await sleep(1);
    }

    return parseInt(page.split(`>Fleet</td>`)[1].split(">")[1].split("<")[0].replace(".", ""));
}

async function addPlayer({ id, nickname, status, ranking, spec }) {
    const player = {};

    player.id = id;
    player.nickname = nickname;
    player.status = status;
    player.ranking = ranking;
    player.spec = spec;

    player.fleetRank = await getPlayerFleetPoint(player.id);

    player.planetList = [];

    const list = getPlayerList();

    list.push(player);

    localStorage.setItem("playerList", JSON.stringify(list));

    return player;
}


function addPlanetToPlayer(playerName ,coords) {
    const list = getPlayerList();

    list.find(player => player.nickname === playerName).planetList.push(coords);

    localStorage.setItem("playerList", JSON.stringify(list));
}


const programs = {
    spyScan: (gal, from = 1, to = 400) => {
        if (!galaxy.ready) {
            galaxy.onReady = programs.scanFunction(gal, from, to);
        }
        else {
            programs.scanFunction(gal, from, to);
        }
    },

    scanFunction: (gal, from, to) => {
        galaxy.navigate(gal, from);

        setTimeout(() => {
            if (galaxy.clickOnSpacia()) {
                galaxy.sendSpy();
                setTimeout(() => galaxy.nextSystem(), 200);
            }
            else {
                galaxy.nextSystem();
            }


            if (galaxy.sun <= to) setTimeout(scan, 1000);
        }, 1000);
    },

    galaxyScan: async gal => {
        await galaxy.open();

        galaxy.navigate(gal, 1);

        let planetCycle = new PlanetCycle();

        planetCycle.cycleOnGalaxy(gal);

        let scanning = true;
        
        planetCycle.cycleWhile(() => scanning);

        let goon = true;
        while (goon) {
            console.log("In galaxyscan loop");
            await galaxy.clickOnSpacia();

            if (galaxy.sun === 400) goon = false;
            
            galaxy.nextSystem();

            await new Promise(res => setTimeout(() => res(), 1000));
        }

        scanning = false;
    },

    startRaid: async () => {
        await Spionage.loadReports();

        Spionage.spionageList.sort((a, b) => b.resourceValue - a.resourceValue);
        
        const reportList = [];
        
        Spionage.spionageList.map(report => {
            reportList.push({...report});

            if (report.report.planet.name !== "Spacia Planet") {
                reportList.push({...report,
                    resourceValue: report.resourceValue * 0.35,
                    resourceTotal: report.resourceTotal * 0.35
                });
            }
        });

        reportList.sort((a, b) => b.resourceValue - a.resourceValue);

        Spionage.spionageList = [];

        if (reportList.length > 50) {
            reportList.splice(50);
        }


        for (let i=1; i<=6; i++) {
            await programs.raidReportList(reportList.filter(a => a.gal === i), i);
        }
    },




    raidReportList: async (reportList, gal) => {
        if (reportList.length === 0) return;

        const planetCycle = new PlanetCycle();

        await planetCycle.cycleOnGalaxy(gal);

        for (let report of reportList) {

            let fleet = new FleetComposer();
            
            while (fleet.available < 2) {
                while (!await fleet.setup(report)) {
                    await sleep(1);
                    fleet = new FleetComposer();
                }
                
                if (fleet.available >= 2) {
                    break;
                }

                planetCycle.next();
                await sleep(2000);
            }


            fleet.ships.transmitter.setTo(Math.ceil(report.resourceTotal / 300000));
            console.log(report.resourceValue / 6);

            await fleet.attack();
            await sleep(2000);
        }
    }
}
function async(checker, object) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (checker()) {
                clearInterval(interval);

                resolve(object);
            } 
        }, 10);
    }
    )
}

function callback(checker, callback) {
    return new Promise((resolve, reject) => {
        const interval = setInterval(() => {
            if (checker()) {
                clearInterval(interval);

                callback();
                resolve();
            }
        }, 10);
    }
    )
}

function sleep(time = 0) {
    return new Promise(res => setTimeout(() => res(), time));
}

async function getPage(url, data) {
    try {
        const res = await fetch(url, data);
    
        const text = await res.text();

        if (text.match(/SpaceInvasion detects multiple accesses to sites/ig)) {
            console.log("Multiple accesses detect!!");
            await sleep(10);

            return await getPage(url, data);
        }

        return text;
    }
    catch {
        await sleep(10);
        return await getPage(url, data);
    }
}
async function raidReport(report) {
    if (!report) return;

    let retry = true;
    while (retry) {
        console.log(report.value / 6);

        const success = await sendFleet(report.gal, report.sun, report.pla, report.transmitter);
        
        if (success !== "retry") {
            return success;
        }
    }
}
async function oldRaidReport(report) {
    if (!report) return;

    let retry = true;
    while (retry) {
        const fleet = new FleetComposer();

        while (pause) await sleep(1);

        await fleet.setup(report)

        fleet.ships.transmitter.setTo(report.transmitter);
        console.log(report.value / 6);

        
        const success = await fleet.mission("ATTACK");
        if (fleet.status !== "retry") {
            return success;
        }
    }
}

let pause = false;
async function raidData(spaciaValueRatio = 1) {
    const reportList = [];

    getLoadedReportList().map(report => {
        if (report.value > 6000 && (!report.player.match(/Spacia/ig) || report.value > report.report.planet.buildings.b1.level ** 6 / 300 * spaciaValueRatio)) {
            reportList.push({ ...report });
        }
    });


    reportList.sort((a, b) => b.value - a.value);
    
    localStorage.setItem("raid-list", JSON.stringify(reportList));

    await Planet.nahkent.refreshInfos();
    Planet.cuivienen.slot--;
    const max = reportList.length;
    for (let i=0; i<max ; i++) {
        const report = reportList.shift();

        const { gal, sun } = report;

        const sameGalPlanet = Planet.list.filter(pla => pla.gal === gal && Math.abs(pla.sun - sun) <= 84 && pla.slot > 1).shift();

        if (sameGalPlanet) {
            sameGalPlanet.reportList.push(report);
            sameGalPlanet.slot--;
        }
        else {
            const closeGalPlanet = Planet.list.filter(pla => (Math.abs(pla.gal - gal) === 5 || Math.abs(pla.gal - gal) === 1) && pla.slot > 1).pop();
            if (closeGalPlanet) {
                closeGalPlanet.reportList.push(report);
                closeGalPlanet.slot--;
            }
            else {
                reportList.push(report);
            }
        }
    }
    let ignore = 0;
    for (let planet of Planet.list) {
        await planet.fetchActivate();
        for (let report of planet.reportList) {
            if (ignore < 1) {
                if (!await raidReport(report)) await raidNewTarget(planet, reportList);
            }
            ignore--;
        }
    }

}

async function raidNewTarget(planet, reportList) {
    const reappendList = [];
    while (reportList.length > 0) {
        const newReport = reportList.shift();

        if (newReport.gal === planet.gal && Math.abs(newReport.sun - planet.sun) <= 60 || Math.abs(newReport.gal - planet.gal) === 1) {
            if (await raidReport(newReport)) {
                break;
            }
        }
        else {
            reappendList.push(newReport);
        }
    }
    reportList.unshift(...reappendList);

    return false;
}






async function loadReports(pageLimit) {
    if (!pageLimit) throw new Error("Precise pageLimit");

    const reportList = [];

    await navigator.messages();

    while (!navigator.spying) {
        await sleep(1);
    }

    await navigator.spying();

    for (let i = 0; i < pageLimit; i++) {
        await async(() => centerWindow.location.href.match(/spio/) && Array.from(centerDocument.getElementsByTagName("img")).filter(el => el.src.match(/mail.gif/)).length);

        const unreadList = Array.from(centerDocument.getElementsByTagName("img")).filter(el => el.src.match(/mail.gif/));

        for (let mail of unreadList) {

            const id = mail.parentElement.parentElement.getElementsByTagName("a")[0].onclick.toString().replace(/[^0-9]/gi, "");

            const win = centerWindow.open("indexInternal.es?action=internalSpionageReport&reportID=" + id + '&' + centerWindow.sid, "", "scrollbars=yes,statusbar=no,toolbar=no,location=no,directories=no,resizable=no,menubar=no,width=800,height=400,screenX=0,screenY=0,top=0,left=0");

            reportList.push(await loadReport(win));
        }

        Array.from(centerDocument.getElementsByTagName("a")).filter(a => a.href.match(/limit_ignore/)).pop().click();
        await sleep(1000);
    }

    //const a = [...JSON.parse(localStorage.getItem("loaded-report-list")), ...reportList ];
    

    localStorage.setItem("loaded-report-list", JSON.stringify(reportList));
}

async function loadReport(spionageWindow) {
    await async(() => spionageWindow.document.getElementById("json-element")?.textContent);

    const report = JSON.parse(spionageWindow.document.getElementById("json-element").textContent);

    const gal = parseInt(report.planet.coords.split(":")[0]);
    const sun = parseInt(report.planet.coords.split(":")[1]);
    const pla = parseInt(report.planet.coords.split(":")[2]);

    const resourceTotal = report.planet.resources[0] + report.planet.resources[1] + report.planet.resources[2] + report.planet.resources[3];
    const resourceValue = report.planet.resources[0] + report.planet.resources[1] * 2.4 + report.planet.resources[2] * 2 + report.planet.resources[3] * 6;

    const data = {
        gal: gal,
        sun: sun,
        pla: pla,

        report: report,

        player: report.planet.name,

        transmitter: Math.max(10, Math.ceil(resourceTotal * 1.3/ 250000)),
        value: resourceValue
    }


    spionageWindow.close();

    return data;
}


function getLastReportID() {
    return parseInt(localStorage.getItem("last-report-id"));
}

function setLastReportID(id) {
    localStorage.setItem("last-report-id", id);
}

async function fetchLoadReports() {
    const reportList = [];
    
    const spionageMessagePage = await getPage(`https://spaceinvasion.bitmeup.com/indexInternal.es?action=internalMessages&type=spio&${sid}`);


    let reportAmount = 470//parseInt(spionageMessagePage.split(" Message(s)")[0].split("<b>").pop());
    let reportID = parseInt(spionageMessagePage.split(`onclick="showSpionageReport('`)[1].split("')")[0]);

    console.log(reportAmount, reportID);

    let lastReportID = reportID;

    while (reportAmount > 0) {
        const res = await fetchLoadReport(reportID);

        if (res.report) {
            reportList.push(res);
            reportAmount--;

            lastReportID = reportID;

            console.log(`${stringifyCoordinate(res)}: value: ${res.value/6}`);

            localStorage.setItem("loaded-report-list", JSON.stringify(reportList));
        }
        else if (lastReportID - reportID > 50) {
            console.log("Ended reports");
            break;
            //throw new Error("Too many report load try");
        }

        reportID--;
    }
}

async function fetchLoadReport(reportID) {
    const pageHTML = await (await fetch(`indexInternal.es?action=internalSpionageReport&reportID=${reportID}&${centerWindow.sid}`)).text();

    const firstPart = pageHTML.split("func.f(")[1];

    if (!firstPart) {
        return false;
    }

    const report = JSON.parse(firstPart.split(");")[0]);

    const gal = parseInt(report.planet.coords.split(":")[0]);
    const sun = parseInt(report.planet.coords.split(":")[1]);
    const pla = parseInt(report.planet.coords.split(":")[2]);

    const resourceTotal = report.planet.resources[0] + report.planet.resources[1] + report.planet.resources[2] + report.planet.resources[3];
    const resourceValue = report.planet.resources[0] + report.planet.resources[1] * 2.4 + report.planet.resources[2] * 2 + report.planet.resources[3] * 6;

    const data = {
        gal: gal,
        sun: sun,
        pla: pla,

        report: report,

        player: report.planet.name,

        transmitter: Math.max(10, Math.ceil(resourceTotal * 1.3/ 250000)),
        value: resourceValue
    }

    return data;
}

function getLoadedReportList() {
    return JSON.parse(localStorage.getItem("loaded-report-list"));
}

function setLoadedReportList(list) {
    return localStorage.setItem("loaded-report-list", JSON.stringify(list));
}
function getRubbleFieldList() {
    return JSON.parse(localStorage.getItem("rubblefield-list"));
}

function setRubbleFieldList(list) {
    localStorage.setItem("rubblefield-list", JSON.stringify(list));
}

function pushToRubbleFieldLIst(rubblefield) {
    const list = getRubbleFieldList();

    list.push(rubblefield);

    setRubbleFieldList(list);
}

function getEventPlanetList() {
    return JSON.parse(localStorage.getItem("eventPlanetList-list"));
}

function setEventPlanetList(list) {
    localStorage.setItem("eventPlanetList-list", JSON.stringify(list));
}

function pushToEventPlanetList(eventPlanetList) {
    const list = getEventPlanetList();

    list.push(eventPlanetList);

    setEventPlanetList(list);
}

async function handleRubberFields(planetList) {
    for ({ rubblefield: { i, m, k, s }, id } of planetList.filter(p => p.rubblefield)) {
        const ironValue = i + m * 2.4 + k * 2 + s * 6;
        const transportValue = i + m + k + s;
        
        if (transportValue / 25000 > 5000) {
            setInterval(() => console.log("BIG RUBBLE!!!!! " + coordinateFromId(id)), 1000);
        }
        else if (ironValue > 1000000) pushToRubbleFieldLIst({ coordinate: coordinateFromId(id).split(":").map(a => parseInt(a)), ironValue: ironValue, recycler: Math.ceil(transportValue / 25000) });
    }
}



function assignFarRubbleField() {
    for (const rubblefield of getRubbleFieldList().sort((a, b) => b.ironValue - a.ironValue)) {
        const [gal] = rubblefield.coordinate;

        const closeGalPlanet = Planet.list.filter(pla => (Math.abs(pla.gal - gal) === 5 || Math.abs(pla.gal - gal) === 1) && pla.slot > 1).pop();
        if (closeGalPlanet) {
            closeGalPlanet.rubberList.push(rubblefield);
            closeGalPlanet.slot--;
        }
    }
}

function assignRubbleField() {
    for (const rubblefield of getRubbleFieldList().sort((a, b) => b.ironValue - a.ironValue)) {
        const [gal, sun] = rubblefield.coordinate;

        const sameGalPlanet = Planet.list.filter(pla => pla.gal === gal && Math.abs(pla.sun - sun) <= 84 && pla.slot > 1).shift();
    
        if (sameGalPlanet) {
            sameGalPlanet.rubberList.push(rubblefield);
            sameGalPlanet.slot--;
        }
        else {
            const closeGalPlanet = Planet.list.filter(pla => (Math.abs(pla.gal - gal) === 5 || Math.abs(pla.gal - gal) === 1) && pla.slot > 1).pop();
            if (closeGalPlanet) {
                closeGalPlanet.rubberList.push(rubblefield);
                closeGalPlanet.slot--;
            }
        }
    }
    
}

function assignCloseRubbleField(minDistance, maxDistance) {
    if (isNaN(minDistance)) {
        throw new Error("Min distance error");
    }

    if (!maxDistance) {
        maxDistance = minDistance;
        minDistance = 0;
    }

    
    for (const rubblefield of getRubbleFieldList().sort((a, b) => b.ironValue - a.ironValue)) {
        const [gal, sun] = rubblefield.coordinate;
        
        const sameGalPlanet = Planet.list.filter(planet => planet.gal === gal && Math.abs(planet.sun - sun) >= minDistance && Math.abs(planet.sun - sun) <= maxDistance && planet.slot > 1).shift();

        if (sameGalPlanet) {
            sameGalPlanet.rubberList.push(rubblefield);
            sameGalPlanet.slot--;
        }
    }
}


async function sendRecycler(rubblefield) {
    if (!rubblefield) return;
    
     const [gal, sun, pla] = rubblefield.coordinate;

    let retry = true;
    while (retry) {
        console.log(rubblefield.ironValue / 6);

        const success = await sendMission({ gal: gal, sun: sun, pla: pla, todo: "RECYCLE", recycler: rubblefield.recycler });

        if (success !== "retry") {
            return success;
        }
    }
}
async function saveAll(speed = 100, distance = 1) {
    for (const planet of Planet.list) {
        const infos = await planet.getInfos();

        const ships = {};

        for (const { name, level } of Object.values(infos.ships)) {
            if (!name.match(/Solar/ig)) {
                ships[name.replaceAll(" ", "").toLowerCase()] = level;
            }
        }

        let capacity = ships.transmitter * 250000;

        let [iron, metal, kryptonit, spice] = infos.resources;
        
        if (capacity > spice) capacity -= spice;
        else {
            spice = capacity;
            capacity = 0;
        }

        if (capacity > metal) capacity -= metal;
        else {
            metal = capacity;
            capacity = 0;
        }

        if (capacity > kryptonit) capacity -= kryptonit;
        else {
            kryptonit = capacity;
            capacity = 0;
        }

        if (capacity > iron) capacity -= iron;
        else iron = capacity;

        await planet.activate();

        let pla = 1;
        while (pla) {
            const success = await sendMission({ todo: "SAVE", gal: planet.gal, sun: planet.sun + distance, pla: pla, speed: speed, iron: iron, metal: metal, kryptonit: kryptonit, spice: spice, ...ships });

            if (success === "No planet" || !success) {
                pla++;
            }
            else {
                pla = 0;
            }
        }
    }
}


async function transportAll() {
    for (const [start, target] of [ [Planet.nahkentpool, Planet.nahkent], [Planet.toldianpool, Planet.toldian], [Planet.cuivienenpool, Planet.cuivienen], [Planet.gondor.asteroid, Planet.gondor] ]) {
        const infos = await start.getInfos();

        const transmitter = infos.ships.s3.level;

        let capacity = transmitter * 250000;

        let [iron, metal, kryptonit, spice] = infos.resources;

        if (spice > 350000) {
            spice -= 300000;
            
            if (capacity > spice) capacity -= spice
            else {
                spice = capacity;
                capacity = 0;
            }
    
            if (capacity > metal) capacity -= metal;
            else {
                metal = capacity;
                capacity = 0;
            }
    
            if (capacity > kryptonit) capacity -= kryptonit;
            else {
                kryptonit = capacity;
                capacity = 0;
            }
    
            if (capacity > iron) capacity -= iron;
            else iron = capacity;
    
            await start.fetchActivate();
    
            await sendMission({ todo: "TRANSPORT", gal: target.gal, sun: target.sun, pla: target.pla, iron: iron, metal: metal, kryptonit: kryptonit, spice: spice, transmitter: transmitter });
        }

    }
}


async function save(hours = 1, minutes = 0, seconds = 0) {

    const time = Math.ceil(hours * 3600 + minutes * 60 + seconds);

    if (time < 3600) time = 3600;

    for (const planet of Planet.list) {

        const url = "https://spaceinvasion.bitmeup.com/indexInternal.es?action=internalSave&" + sid;

        await fetch(url + "&startPlanet=" + (planet.parent ? planet.parent.id + "&moon=" + planet.astroId : planet.id) + "&duration=" + time);

        const data = new FormData();

        data.append("sid", sid.split("=")[1]);

        data.append("sub", "sendFleet");
        data.append("duration", time);

        
        if (planet.astroId) {
            data.append("startPlanet", planet.parent.id);
            data.append("moon", planet.astroId);
        }
        else {
            data.append("moon", "");
            data.append("startPlanet", planet.id);
        }

        const res = await fetch(url, { method: "POST", body: data });

        const text = await res.text();
    }
}

let saveGarantiLoop = true;
async function saveGarantie() {
    saveGarantiLoop = true;

    let startTime = Date.now();

    while (startTime + 3610000 > Date.now() && saveGarantiLoop) {
        await sleep(10000);
        console.log("Looping save garantie. Remaining for next save: " + Math.ceil((3610000 + startTime - Date.now()) / 1000) + " seconds");

        if (startTime + 3610000 >= Date.now()) {
            await save();

            startTime = Date.now();
        }
    }

    console.log("Breaking savegarantiloop");
}

async function transportAllTo(target) {
    for (const start of Planet.list.filter(a => a !== target)) {
        await handleTransportAll(start, target);
    }
}

async function handleTransportAll(start, target) {
    const infos = await start.getInfos();

    const transmitter = infos.ships.s3.level;

    if (!transmitter) {
        console.log("No transmitter at planet " + start.name);
        return;
    }

    let capacity = transmitter * 250000;

    let [iron, metal, kryptonit, spice] = infos.resources;

    spice -= 50000;

    if (capacity > spice) capacity -= spice
    else {
        spice = capacity;
        capacity = 0;
    }

    if (capacity > metal) capacity -= metal;
    else {
        metal = capacity;
        capacity = 0;
    }

    if (capacity > kryptonit) capacity -= kryptonit;
    else {
        kryptonit = capacity;
        capacity = 0;
    }

    if (capacity > iron) capacity -= iron;
    else iron = capacity;

    await start.fetchActivate();

    await sendMission({ todo: "TRANSPORT", gal: target.gal, sun: target.sun, pla: target.pla, iron: iron, metal: metal, kryptonit: kryptonit, spice: spice, transmitter: transmitter });
}
class GalaxyScanner {

    static working;
    static awaiting = [];

    static async scanAll() {
        await galaxy.open();

        for (let gal = 1; gal < 7; gal++) {
            const scanner = new GalaxyScanner();
            scanner.scan(gal);

            GalaxyScanner.awaiting.push(scanner);
        }

        await Planet.list[0].activate();

        await sleep(1000);
        
        GalaxyScanner.working = GalaxyScanner.awaiting.shift();
        GalaxyScanner.working.scanning = true;


        while (GalaxyScanner.awaiting.length > 0) {
            await sleep(1000);
        }
    }

    scanning = false;


    async scan(gal) {
        let planetCycle = new PlanetCycle();

        planetCycle.cycleOnGalaxy(gal);

        while (!this.scanning) {
            //console.log("Awaiting to start gal " + gal);
            await sleep(1000);
        }

        await planetCycle.start();

        let slots = await getSlots();

        for (let sun = 1; sun < 401; sun++) {
            galaxy.navigate(gal, sun);

            console.log("In galaxyscan loop");
            let spaciaList = await galaxy.getSPaciaList(sun);
            console.log("getted spacia");


            for (let i=0; i<spaciaList.length; i++) {
                let spacia = spaciaList[i];

                console.log(slots);
                while (slots < 2) {
                    console.log("No solts waiting spa");
                    if (planetCycle.actual === planetCycle.planetList.length - 1) {
                        this.scanning = false;
                        GalaxyScanner.working = GalaxyScanner.awaiting.shift();
                        GalaxyScanner.awaiting.push(this);

                        GalaxyScanner.working.scanning = true;

                        while (!this.scanning) {
                            await sleep(1);
                        }
                    }
                    await planetCycle.next();
                    await sleep(1);
                    galaxy.navigate(gal, sun);
                    await sleep(1);
                    slots = await getSlots();

                    if (slots >= 2) {
                        spaciaList = await galaxy.getSPaciaList(sun);
                        spacia = spaciaList[i];
                    }
                }
                
                
                spacia.parentElement.nextElementSibling.click();
                
                galaxy.sendSpy();
                await sleep(1);

                slots--;
            }
        }

        GalaxyScanner.working = GalaxyScanner.awaiting.shift();
        GalaxyScanner.working.scanning = true;
    }
}

async function getSlots() {
    let slotElement;

    while(!slotElement) {
        slotElement = galaxy.document.getElementById("planet-slots");

        await sleep(1);
    }

    const [used, max] = slotElement.textContent.split(" / ");

    return max - used;
}

async function singleThreadSpy() {

}
class Spionage {
    static spionageList = [];

    static async open(openedWindow) {
        const win = await openedWindow;

        new Spionage(win);
    }

    static async loadReports(keep = true) {
        await navigator.messages();

        while (!navigator.spying) {
            await sleep(1);
        }

        await navigator.spying();

        for (let i=0; i<1; i++) {
            await async(() => centerWindow.location.href.match(/spio/) && Array.from(centerDocument.getElementsByTagName("img")).filter(el => el.src.match(/mail.gif/)).length);
    
            const unreadList = Array.from(centerDocument.getElementsByTagName("img")).filter(el => el.src.match(/mail.gif/));
    
            for (let mail of unreadList) {
                
                const id = mail.parentElement.parentElement.getElementsByTagName("a")[0].onclick.toString().replace(/[^0-9]/gi, "");
    
                const win = centerWindow.open("indexInternal.es?action=internalSpionageReport&reportID=" + id + '&' + centerWindow.sid, "", "scrollbars=yes,statusbar=no,toolbar=no,location=no,directories=no,resizable=no,menubar=no,width=800,height=400,screenX=0,screenY=0,top=0,left=0");
    
                new Spionage(win);
    
                await new Promise(res => setTimeout(() => res(), 100));
            }

            Array.from(centerDocument.getElementsByTagName("a")).filter(a => a.href.match(/limit_ignore/)).pop().click();
            await sleep(1000);
        }


        await async(() => Spionage.spionageList.filter(el => !el.report).length === 0);

        const loadedReportList = getLoadedReportList();

        let max = Spionage.spionageList.length;
        for (let i=0; i<max; i++) {
            const readedReport = Spionage.spionageList.shift();
            
            readedReport.isNew = true;
            for (let oldReport of loadedReportList) {
                if (oldReport.gal === readedReport.gal && oldReport.sun === readedReport.sun && oldReport.pla === readedReport.pla) {
                    for (let key of Object.keys(oldReport)) oldReport[key] = readedReport[key];
                    readedReport.isNew = false;
                    break;
                }
            }

            if (readedReport.isNew) {
                delete readedReport.isNew;
                Spionage.newReports.push(readedReport);
            }
        }

        loadedReportList.push(...Spionage.spionageList);

        return loadedReportList;

        //localStorage.setItem("loadedReports", JSON.stringify(loadedReports));
    }

    window = null;
    document = null;

    
    report = null;
    
    resourceTotal = 0;
    resourceValue = 0;
    
    gal = 0;
    sun = 0;
    pla = 0;
    
    constructor(spionageWindow) {
        Spionage.spionageList.push(this);
        
        setTimeout(() => this.setup(spionageWindow), 1);
    }
    
    static newReports = [];

    async setup(spionageWindow) {
        await async(() => spionageWindow.document.getElementById("json-element"));

        this.report = JSON.parse(spionageWindow.document.getElementById("json-element").textContent);

        this.gal = parseInt(this.report.planet.coords.split(":")[0]);
        this.sun = parseInt(this.report.planet.coords.split(":")[1]);
        this.pla = parseInt(this.report.planet.coords.split(":")[2]);

        this.resourceTotal = this.report.planet.resources[0] + this.report.planet.resources[1] + this.report.planet.resources[2] + this.report.planet.resources[3];
        this.resourceValue = this.report.planet.resources[0] + this.report.planet.resources[1] * 2.4 + this.report.planet.resources[2] * 2 + this.report.planet.resources[3] * 6;

        const data = {
            gal: this.gal,
            sun: this.sun,
            pla: this.pla,

            report: this.report,

            player: this.report.planet.name,

            transmitter: Math.ceil(this.resourceTotal * 0.8 / 250000),
            value: this.resourceValue
        }
        

        spionageWindow.close();

        Spionage.newReports.push({...data});
    }
}


// function neighborsGalaxy(gal) {
//     if (gal > 1 && gal < 6) {
//         return [gal - 1, gal + 1];
//     }
    
//     if (gal === 1) {
//         return [6, 2];
//     }

//     if (gal === 6) {
//         return  [5, 1];
//     }

//     return [];
// }

// function canSpyThis(planet, [gal, sun]) {
//     return gal === planet.gal && Math.abs(sun - planet.sun) <= 70 || neighborsGalaxy(planet.gal).includes(gal);
// }


// function getInactifPlayerCoordinateList() {
//     return JSON.parse(localStorage.getItem("inactif-player-coordinate-list") || "[]");
// }

// let breakSpying = false;
// async function spyInactifCoordinate() {
//     const inactifCoordinateList = [];

//     let scanning = true;
//     scanAll(inactifCoordinateList).then(() => scanning = false);

//     while (inactifCoordinateList.length > 0 || scanning) {
//         for (let planet of Planet.list) {
//             const notHandeledList = [];

//             if (inactifCoordinateList.length === 0) {
//                 inactifCoordinateList.unshift(...notHandeledList);
//                 await sleep();

//                 break;
//             }
// ;
//             let slots = await planet.getSlots();

//             while (slots > 0 && inactifCoordinateList.length > 0) {
//                 const coordinate = inactifCoordinateList.shift();

//                 if (canSpyThis(planet, coordinate)) {
//                     console.log(`${coordinate} remaining: ${notHandeledList.length + inactifCoordinateList.length}`);
//                     inactifCoordinateList.splice(inactifCoordinateList.indexOf(coordinate), inactifCoordinateList.indexOf(coordinate));

//                     slots--;
//                     if (await sendMission({ gal: coordinate[0], sun: coordinate[1], pla: coordinate[2], todo: "SPIONAGE", spyprobe: 1 }) === "retry") notHandeledList.push(coordinate);
//                 }
//                 else {
//                     notHandeledList.push(coordinate);
//                 }
//             }
//             inactifCoordinateList.unshift(...notHandeledList);
//         }
//     }
// }


// function getPriorityPlanetList() {
//     return JSON.parse(localStorage.getItem("priority-planet-list"));
// }

// function setPriorityPlanetList(list) {
//     localStorage.setItem("priority-planet-list", JSON.stringify(list));
// }

// let breakScanning = false;
// async function scanAll(coordinateList) {
//     resetPlayerList();
//     const allSunSystemList = [];

//     for (let gal = 1; gal < 7; gal++) {
//         for (let sun = 1; sun < 401; sun++) {
//             allSunSystemList.push([gal, sun]);
//         }
//     }

//     allSunSystemList.sort(() => 0.5 - Math.random());

//     allSunSystemList.unshift(...prioritySystemList);
    
//     for (const [gal, sun] of allSunSystemList) {
//         if (breakScanning) return;

//         await scanSystem(gal, sun, coordinateList);
//     }
// }

// async function scanSystem(gal, sun, coordinateList) {
//     const planetList = await getPlanetList(gal, sun);

//     for (const planet of planetList.filter(planet => planet.user)) {
//         const player = await getPlayer(planet.user);

//         const planetCoordinate = [gal, sun, pla] = planet.coords.split(":").map(a => parseInt(a));

//         if (player.planetList.map(coord => JSON.stringify(coord)).includes(JSON.stringify(planetCoordinate))) return;

//         addPlanetToPlayer(player.name, planetCoordinate);

//         const inactive = player.status === "inactive" && planet.isRaid === "0";
//         const weak = player.ranking > 200000 && player.fleetRank < 20;
//         const target = getExtraCoordinateList().map(coord => stringifyCoordinate(coord)).includes(stringifyCoordinate([gal, sun, pla]));
//         const spacia = player.nickname === "Spacia";

//         if (inactive && (weak || target || spacia)) {
//             console.log(`[${gal}:${sun}:${pla}]`);

//             coordinateList.push([gal, sun, pla]);
//         }

//     };
// }


// function addToCoordinateList(coord) {
//     const list = JSON.parse(localStorage.getItem("coordinate-to-add"));
//     list.push(coord);
//     localStorage.setItem("coordinate-to-add", JSON.stringify(list));
// }

// function getExtraCoordinateList() {
//     return JSON.parse(localStorage.getItem("coordinate-to-add") || "[]");
// }


// function stringifyCoordinate(params) {
//     if (params.length === 3) {
//         const [ gal, sun, pla ] = params;
//         return `${gal}:${sun}:${pla}`;        
//     }

//     if (params.gal && params.sun && params.pla) {
//         const { gal, sun, pla } = params;
//         return `${gal}:${sun}:${pla}`;
//     }

//     throw new Error("Paramaeter");
// }

// function getIgnoreList() {
//     return JSON.parse(localStorage.getItem("ignore-list"));
// }

// function setIgnoreList(list) {
//     localStorage.setItem("ignore-list", JSON.stringify(list));
// }






function neighborsGalaxy(gal) {
    return (gal > 1 && gal < 6) && [gal - 1, gal + 1] || (gal === 1) && [6, 2] || (gal === 6) && [5, 1] || [];
}

function canSpyThis(planet, [gal, sun]) {
    return gal === planet.gal && Math.abs(sun - planet.sun) <= 70 || neighborsGalaxy(planet.gal).includes(gal);
}


function getInactifPlayerCoordinateList() {
    return JSON.parse(localStorage.getItem("inactif-player-coordinate-list") || "[]");
}

let breakSpying = false;
async function spyInactifCoordinate(all = true, treasurehunt) {
    const inactifCoordinateList = []; //getInactifPlayerCoordinateList().sort((a, b) => a[0] - b[0] || a[1] - b[1]);

    await scanAll(inactifCoordinateList, treasurehunt);

    await spyCoordinateList(inactifCoordinateList);
}

async function eventSpy(gal, sun, pla) {
    const url = `https://spaceinvasion.bitmeup.com/indexInternal.es?startFleet=1&fleets=1&startFleetAction=event&gal=${gal}&sun=${sun}&p=${pla}`;

    await getPage(url);
}

async function spyCoordinateList(coordinateList) {
    while (coordinateList.length > 0) {
        for (let planet of Planet.list) {
            let slots = await planet.getSlots();

            const notHandeledList = [];
            while (slots > 0 && coordinateList.length > 0) {
                const coordinate = coordinateList.shift();

                if (coordinate && canSpyThis(planet, coordinate)) {
                    console.log(`${coordinate} remaining: ${notHandeledList.length + coordinateList.length}`);
                    coordinateList.splice(coordinateList.indexOf(coordinate), coordinateList.indexOf(coordinate));

                    slots--;
                    if (await sendMission({ gal: coordinate[0], sun: coordinate[1], pla: coordinate[2], todo: "SPIONAGE", spyprobe: 1 }) === "retry") notHandeledList.push(coordinate);
                }
                else {
                    notHandeledList.push(coordinate);
                }
            }
            coordinateList.unshift(...notHandeledList);
        }
    }
}

async function scanAll(coordinateList, treasurehunt) {
    resetPlayerList();
    setRubbleFieldList([]);
    setEventPlanetList([]);

    const scannerList = [];

    const sunSlice = 16;

    for (let gal=1; gal<=6; gal++) {
        for (let sun=0; sun<sunSlice; sun++) {
            scannerList.push(scanSector(coordinateList, { galStart: gal, galEnd: gal, sunStart: sun * 400 / sunSlice + 1, sunEnd: 400 / sunSlice * (sun + 1) }, treasurehunt));
        }
    }

    await Promise.all(scannerList);
}

async function scanAllEventPlanet(coordinateList, treasurehunt) {
    setEventPlanetList([]);

    const scannerList = [];

    const sunSlice = 16;

    for (let gal=1; gal<=6; gal++) {
        for (let sun=0; sun<sunSlice; sun++) {
            scannerList.push(scanEventPlanet(coordinateList, { galStart: gal, galEnd: gal, sunStart: sun * 400 / sunSlice + 1, sunEnd: 400 / sunSlice * (sun + 1) }, treasurehunt));
        }
    }

    await Promise.all(scannerList);
}



let breakScanning = false;
async function scanSector(coordinateList, { galStart = 1, galEnd = 6, sunStart = 1, sunEnd = 400 }) {
    scanning:
    
    for (let gal = galStart; gal <= galEnd; gal++) {
        for (let sun = sunStart; sun <= sunEnd; sun++) {
            if (breakScanning) break scanning;
            
            const planetList = await getPlanetList(gal, sun);
            
            handleRubberFields(planetList);

            planetList.filter(planet => planet.isEventPlanet).forEach(planet => {
                const planetCoordinate = planet.coords.split(":").map(a => parseInt(a));

                if (planet.image.match(/71|72|73|74/ig)) {
                    if (planet.image.match(/71/ig)) planetCoordinate.push(1);
                    if (planet.image.match(/72/ig)) planetCoordinate.push(2);
                    if (planet.image.match(/73/ig)) planetCoordinate.push(3);
                    if (planet.image.match(/74/ig)) planetCoordinate.push(4);
                }
                pushToEventPlanetList(planetCoordinate);
            });
            
            await handleInactivePlanets(planetList, coordinateList);
        }
    }
}
async function scanEventPlanet(coordinateList, { galStart = 1, galEnd = 6, sunStart = 1, sunEnd = 400 }) {
    scanning:
    
    for (let gal = galStart; gal <= galEnd; gal++) {
        for (let sun = sunStart; sun <= sunEnd; sun++) {
            if (breakScanning) break scanning;
            
            const planetList = await getPlanetList(gal, sun);

            planetList.filter(planet => planet.isEventPlanet).forEach(planet => {
                const planetCoordinate = planet.coords.split(":").map(a => parseInt(a));

                if (planet.image.match(/71|72|73|74/ig)) {
                    if (planet.image.match(/71/ig)) planetCoordinate.push(1);
                    if (planet.image.match(/72/ig)) planetCoordinate.push(2);
                    if (planet.image.match(/73/ig)) planetCoordinate.push(3);
                    if (planet.image.match(/74/ig)) planetCoordinate.push(4);
                }
                pushToEventPlanetList(planetCoordinate);
            });
        }
    }
}

async function handleInactivePlanets(planetList, coordinateList) {

    for (const planet of planetList.filter(planet => planet.user)) {
        const player = await getPlayer(planet.user);

        const planetCoordinate = [gal, sun, pla] = planet.coords.split(":").map(a => parseInt(a));

        if (player.planetList.map(coord => JSON.stringify(coord)).includes(JSON.stringify(planetCoordinate))) return;

        addPlanetToPlayer(player.nickname, planetCoordinate);

        const inactive = player.status === "inactive" && planet.isRaid === "0";
        const weak = player.ranking > 200000 && player.fleetRank < 20;
        const target = getExtraCoordinateList().map(coord => stringifyCoordinate(coord)).includes(stringifyCoordinate([gal, sun, pla]));
        const spacia = player.nickname === "Spacia";

        if (target) console.log(`[${gal}:${sun}:${pla}]       is a TARGET`);


        if (inactive && (weak || target || spacia)) {
            console.log(`[${gal}:${sun}:${pla}]`);

            coordinateList.push([gal, sun, pla]);
        }
    };
}

function addToCoordinateList(coord) {
    const list = JSON.parse(localStorage.getItem("coordinate-to-add"));
    list.push(coord);
    localStorage.setItem("coordinate-to-add", JSON.stringify(list));
}

function getExtraCoordinateList() {
    return JSON.parse(localStorage.getItem("coordinate-to-add") || "[]");
}


function stringifyCoordinate(params) {
    if (params.length === 3) {
        const [ gal, sun, pla ] = params;
        return `${gal}:${sun}:${pla}`;        
    }

    if (params.gal && params.sun && params.pla) {
        const { gal, sun, pla } = params;
        return `${gal}:${sun}:${pla}`;
    }

    throw new Error("Paramaeter");
}

function getIgnoreList() {
    return JSON.parse(localStorage.getItem("ignore-list"));
}

function setIgnoreList(list) {
    localStorage.setItem("ignore-list", JSON.stringify(list));
}





async function deleteAllReportMessages() {
    const url = `https://spaceinvasion.bitmeup.com/indexInternal.es?action=internalMessages&type=fleet&start=0&${sid}`

    const data = new FormData();

    data.append("sid", sid.split("=")[1]);

    data.append("limit_friends", "");
    data.append("limit_ignore", "");
    
    data.append("todo", "ALLDELETED");

    await fetch(url, { method: "POST", body: data });
}
async function transport(startPlanet, targetPlanet, resources = []) {
    const [iron = 0, metal = 0, kryptonit = 0, spice = 0] = resources;
    await startPlanet.activate();

    let trying = true;
    while (trying) {
        const fleet = new FleetComposer();

        await fleet.setup(targetPlanet);

        fleet.ships.transmitter.setTo(Math.ceil((iron + metal + kryptonit + spice) / 250000));

        const mission = await fleet.mission("TRANSPORT");

        while (mission.window.document.getElementById("fleet_roh")?.value !== '') await sleep();

        mission.window.document.getElementById("fleet_roh").value = iron;
        mission.window.document.getElementById("fleet_met").value = metal;
        mission.window.document.getElementById("fleet_kry").value = kryptonit;
        mission.window.document.getElementById("fleet_spi").value = spice;

        await mission.selectMission("TRANSPORT");

        await mission.send();
        
        await sleep(1000);

        while (mission.status !== "retry" || !Array.from(this.window.document.getElementsByTagName("th")).filter(el => el.textContent.match(/Your\sfleet\swas\ssent/))[0]) await sleep();

        if (mission.status !== retry) {
            trying = false;
        }
    }
}

async function teleportAccumulate(accPlanet, transmitter) {
    if (isNaN(transmitter)) throw new Error("Not enough transmitter.");

    Planet.list.splice(Planet.list.indexOf(accPlanet), 1);

    let start = accPlanet;
    for (const target of Planet.list) {
        await target.activateTeleport();
        await start.activateTeleport();

        const infos = await start.getInfos();

        const [iron, metal, kryptonit, spice] = infos.resources;

        await sendMission({ todo: "TELEPORT", transmitter: transmitter, iron: iron, metal: metal, kryptonit: kryptonit, spice: spice, gal: target.gal, sun: target.sun, pla: target.pla });

        start = target;
    }

    await accPlanet.activateTeleport();
    await start.activateTeleport();

    const infos = await start.getInfos();

    const [iron, metal, kryptonit, spice] = infos.resources;

    await sendMission({ todo: "TELEPORT", transmitter: transmitter, iron: iron, metal: metal, kryptonit: kryptonit, spice: spice, gal: accPlanet.gal, sun: accPlanet.sun, pla: accPlanet.pla });
}

async function teleportTransport(start, target, transmitter) {
    await target.activateTeleport();
    await start.activateTeleport();

    const infos = await start.getInfos();

    const [iron, metal, kryptonit, spice] = infos.resources;

    await sendMission({ todo: "TELEPORT", transmitter: transmitter, iron: iron, metal: metal, kryptonit: kryptonit, spice: spice, gal: target.gal, sun: target.sun, pla: target.pla });
}})()
