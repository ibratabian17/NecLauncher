
function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

function doStatsLoop() {
    try {
        var today = new Date();
        var h = today.getHours();
        var m = today.getMinutes();
        let batteryIsCharging = false;

        if (navigator.battery) {
            batteryIsCharging = navigator.battery.charging ? "charging" : "discharging"
            document.querySelector('.battery-level').innerHTML = Math.floor(navigator.battery.level * 100) + "%"
        }

        m = checkTime(m);
        document.querySelector('.time-txt').innerHTML = h + ":" + m;
    }
    catch (err) {
        //ignore when launcher not loaded yet
    }
    t = setTimeout(function () {
        doStatsLoop()
    }, 500);
}
doStatsLoop();


function runApp(appname) {
    playSound('popup+runtitle');
    if (isMobile) {
        if (appList[appname] && appList[appname].launchtype == "app-android") {
            console.log(`Opening ${appList[appname].launchparam.package} with leanback ${isRunAsLeanback}`)
            SysOS.openApp(appList[appname].launchparam.package, isRunAsLeanback)
        } else if (appList[appname] && appList[appname].launchtype == "web") {
            window.open(appList[appname].launchparam.url, 'web', appList[appname].launchparam.features)
         } else {
            console.log(`Unkown option, Opening ${appList[appname].launchparam.package} with leanback ${isRunAsLeanback}`)
            SysOS.openApp(appname, isRunAsLeanback)
        }
    } else {
        console.log(appList[appname].launchtype)
        if (appList[appname].launchtype == "web") {
            window.open(appList[appname].launchparam.url, 'web', appList[appname].launchparam.features)
        } else if (appList[appname].launchtype == "activity") {
            window.open(appList[appname].launchparam.url, appList[appname].launchparam.frameName, 'top=0,left=0,frame=false,nodeIntegration=no,fullscreen=true')
        } else {
            alert(`Invalid Launch`)
        }
    }

}