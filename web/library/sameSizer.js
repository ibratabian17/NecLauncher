
let initialWidth = 690;
let initialHeight = 690;

function adjustGameDimensions() {
    const gameElement = document.getElementById("Game");
    const aspectRatio = 16 / 9;
    const { clientWidth, clientHeight } = document.documentElement;

    if (clientWidth / clientHeight > aspectRatio) {
        const newHeight = clientHeight;
        const newWidth = newHeight * aspectRatio;
        adjustElementSize(newWidth, newHeight, gameElement);
    } else {
        const newWidth = clientWidth;
        const newHeight = newWidth / aspectRatio;
        adjustElementSize(newWidth, newHeight, gameElement);
    }
}

function adjustElementSize(newWidth, newHeight, element) {
    //element.style.width = `${newWidth}px`;
    element.style.height = `${newHeight}px`;

    const baseFontSize = 15; // Base font size in pixels
    const scaleFactor = Math.min(newWidth / initialWidth, newHeight / initialHeight);
    const fontSizeInPixels = baseFontSize * scaleFactor;
    element.style.fontSize = `${fontSizeInPixels}px`;
}

window.addEventListener("resize", adjustGameDimensions);
