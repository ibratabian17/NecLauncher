

//init worker
adjustGameDimensions()
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || false;
const isElectron = /Electron/i.test(navigator.userAgent);
const isRunAsLeanback = true
var hidingTime = new Date() / 1000
var platform = window.navigator.platform.toLowerCase() || "mobile"
var appList = {}
if (isMobile) {
    setTimeout(function () {
        const myPromise = new Promise((resolve, reject) => {
            const BridgedAppList = JSON.parse(SysOS.getAppList())
            resolve(BridgedAppList);
        });
        const getAppIcon = (packageName) => {
            return new Promise((resolve, reject) => {
                const appIcon = `data:image/png;base64,${SysOS.getAppIcon(packageName)}`
                resolve(appIcon)
            });
        };
        myPromise.then(tempList => {
            document.querySelector('.games').innerHTML = ""
            console.log('AppList Loaded')
            appList = tempList
            var base64prop = isMobile ? "data:image/png;base64, " : ""
            for (const key in tempList) {
                if (tempList.hasOwnProperty(key)) {
                    const app = tempList[key];
                    document.querySelector('.games').innerHTML += `<a href="#" class="item focusable" app-name="${key}" data-attr="${app.name}" onclick="runApp('${key}')"><img src="${base64prop},iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mMUrQcAAK8Alg3Vvv4AAAAASUVORK5CYII="/></a>`;
                    SpatialNavigation.makeFocusable()
                }
            }
            for (const key in tempList) {
                setTimeout(function () {
                    //load logo after the list loaded
                    getAppIcon(key).then(base64 => {
                        document.querySelector(`.item[app-name="${key}"] img`).src = base64
                    })
                }, 200)
            }
        })
    }, 200);
}


function loadSound(url, name) {
    if (isMobile) {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'arraybuffer';

            xhr.onload = function () {
                if (xhr.status === 200) {
                    audioContext.decodeAudioData(xhr.response, function (audioBuffer) {
                        audioFiles[name] = audioBuffer;
                        resolve();
                    }, function (error) {
                        console.error(`Error decoding audio ${name}:`, error);
                        reject(error);
                    });
                } else {
                    console.error(`Error loading audio ${name}:`, xhr.statusText);
                    reject(xhr.statusText);
                }
            };

            xhr.onerror = function () {
                console.error(`Error loading audio ${name}: Network Error`);
                document.querySelector('.btn').innerHTML = 'Network Error';
                reject(new Error('Network Error'));
            };

            xhr.send();
        });
    } else {
        return fetch(url)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                audioFiles[name] = audioBuffer;
            })
            .catch(error => {
                console.error(`Error loading audio ${name}:`, error);
            });
    }

}

// Load the audio files and store them in memory
const audioFiles = {};
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
Promise.all([
    loadSound('../assets/audio/home.wav', 'home'),
    loadSound('../assets/audio/tick.wav', 'tick'),
    loadSound('../assets/audio/popup+runtitle.wav', 'popup+runtitle')
]).then(() => {
    // Both audio files are loaded
    // For testing purposes, let's play each sound individually
});

// Function to play pre-loaded audio
function playPreloadedSound(buffer) {
    // Create an AudioBufferSourceNode
    const source = audioContext.createBufferSource();
    source.buffer = buffer;

    // Connect the AudioBufferSourceNode to the destination (speakers)
    source.connect(audioContext.destination);

    // Start playing the audio
    source.start();
}

// Function to play sound by name
function playSound(name) {
    if (audioFiles[name]) {
        playPreloadedSound(audioFiles[name]);
    } else {
        console.error('Audio file not pre-loaded:', name);
    }
}

console.log(platform)
let count = 0



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

window.addEventListener('load', function () {

    document.querySelector('.wrapper').classList.remove('hidden')
    SpatialNavigation.init();
    SpatialNavigation.add({
        selector: 'a, .focusable, .item'
    });
    SpatialNavigation.makeFocusable();
    SpatialNavigation.focus();
    setTimeout(adjustGameDimensions, 200)
});
adjustGameDimensions()