//init worker
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const isElectron = /Electron/i.test(navigator.userAgent);
const isRunAsLeanback = true
var hidingTime = new Date() / 1000
var platform = window.navigator.platform.toLowerCase() || "mobile"
console.log(platform)
let count = 0
var appList = {
}
if (isMobile) {
    setTimeout(function () {
        const myPromise = new Promise((resolve, reject) => {
            const BridgedAppList = JSON.parse(SysOS.getGameList())
            resolve(BridgedAppList);
        });
        const getAppIcon = (packageName) => {
            return new Promise((resolve, reject) => {
                const appIcon = `data:image/png;base64, ${SysOS.getAppIcon(packageName)}`
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
                    getAppIcon(key).then(base64 => {
                        document.querySelector(`.item[app-name="${key}"] img`).src = base64
                    })
                    document.querySelector('.games').innerHTML += `<a href="#" class="item focusable" app-name="${key}" data-attr="${app.name}" onclick="runApp('${key}')"><img src="${base64prop}"/></a>`;
                    SpatialNavigation.makeFocusable()
                }
            }
        })
    }, 200);
}
const audioFiles = {};
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

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
Promise.all([
    loadSound('assets/audio/home.wav', 'home'),
    loadSound('assets/audio/tick.wav', 'tick'),
    loadSound('assets/audio/popup+runtitle.wav', 'popup+runtitle')
]).then(() => {
    // Both audio files are loaded
    // For testing purposes, let's play each sound individually
    playSound('home');
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


const nav = {
    store: () => {
        if (isMobile) {
            runApp('com.android.vending')
        } else {

            if (platform == 'win32') LaunchSysApp('../assets/textures/prebuilt-app/shop-banner.png', 'url', 'ms-settings://')
            if (platform == 'unix') LaunchSysApp('../assets/textures/prebuilt-app/shop-banner.png', 'url', 'ms-settings://')
        }
    },
    close: () => {
        playSound('home');
        window.close()
    },
    settings: () => {
        LaunchSysApp('settings/app.html')
    },
    appMore: () => {
        LaunchSysApp('applist/app.html')
    }
}


function LaunchSysApp(url, banner = "", launchtype = "") {
    playSound('popup+runtitle');
    const encoded = {
        banner: encodeURIComponent(banner),
        launchtype: encodeURIComponent(launchtype),
        url: encodeURIComponent(url)
    }

    if (isMobile) {
        SysOSHome.openUI(url)
    } else {
        window.open(url, url, '', 'fullscreen=true,frame=false,transparent=true')
    }

}

window.addEventListener('load', function () {
    adjustGameDimensions()
    document.querySelector('.wrapper').classList.remove('hidden')
    SpatialNavigation.init();
    SpatialNavigation.add({
        selector: 'a, .focusable, .item'
    });
    SpatialNavigation.makeFocusable();
    SpatialNavigation.focus();
    playSound('home');
});
window.addEventListener("blur", function (event) {
}, false);
window.addEventListener("focus", function (event) {
    document.querySelector('.wrapper').classList.remove('hidden')


}, false);