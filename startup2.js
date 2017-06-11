function isWhiteLine(pixelData) {

    if (pixelData[0] > 100 && pixelData[1] > 100 && pixelData[2] > 100) {
        return true;
    }
    return false;
}


function isBrightWhite(pixelBuyLine) {

    var r = pixelBuyLine[0];
    var g = pixelBuyLine[1];
    var b = pixelBuyLine[2];

    var whiter = 240;
    var whiteg = 240;
    var whiteb = 240;

    if (checkDiff(r, whiter) < 40 && checkDiff(g, whiteg) < 40 && checkDiff(b, whiteb) < 40) {
        return true;
    }
    return false;
}

function isRedLine(pixelData) {
    var r = pixelData[0];
    var g = pixelData[1];
    var b = pixelData[2];

    var redr = 209;
    var redg = 63;
    var redb = 46;

    if (checkDiff(r, redr) < 30 && checkDiff(g, redg) < 30 && checkDiff(b, redb) < 30) {
        return true;
    }

    var darkRedr = 86;
    var darkRedg = 16;
    var darkRedb = 18;

    if (checkDiff(r, darkRedr) < 30 && checkDiff(g, darkRedg) < 30 && checkDiff(b, darkRedb) < 30) {
        return true;
    }

    var lightRedr = 160;
    var lightRedg = 94;
    var lightRedb = 89;

    if (checkDiff(r, lightRedr) < 30 && checkDiff(g, lightRedg) < 30 && checkDiff(b, lightRedb) < 30) {
        return true;
    }

    return false;
}

function showImageCroped(canvas) {
    console.log('sending image');
    var port = chrome.runtime.connect({name: "cropedImage"});
    port.postMessage(canvas.toDataURL("image/png"));
}

function checkData(datas) {


    var spaceOnLx = 150;
    var maxXvariation = 300;

    var lx = datas[datas.length - 1].x;
    var ly = datas[datas.length - 1].y;
    console.log('last x: ' + lx);
    console.log('last x: ' + ly);
    var nx = lx - spaceOnLx;
    var mx = nx - maxXvariation;

    var playAlert = false;

    for (var i = 0; i < datas.length; i++) {
        var x = datas[i].x;
        var y = datas[i].y;

        if (x > mx && x < nx) {
            //esta dentro do intervalo
            //check y
            //console.log('dentro do intevalo: ' + x);

            if (checkDiff(y, ly) > 400) {
                console.log('Temos um campeao');
                playAlert = true;
            }
        }

    }

    if (playAlert) {
        var audio = new Audio('sound/alert.wav');
        audio.play();
    }

}

function checkDiff(num1, num2) {
    return (num1 > num2) ? num1 - num2 : num2 - num1;
}


function sendPlotData(datas, whiteLineXPosition, redLineXPosition) {

    var plotObj = {datas:datas, whiteLineXPosition: whiteLineXPosition, redLineXPosition: redLineXPosition};

    console.log('sendind data');
    var port = chrome.runtime.connect({name: "plotPort"});
    port.postMessage(plotObj);

}


function analyzeImage(image64) {

    var img = document.createElement("img");
    img.src = image64;

    //create canvas to read pixels
    var canvas = document.createElement('canvas');
    canvas.width = iqImagePlot.width;
    canvas.height = iqImagePlot.height;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "#001dff";
    ctx.drawImage(img, iqImagePlot.left, iqImagePlot.top, iqImagePlot.width, iqImagePlot.height, 0, 0, iqImagePlot.width, iqImagePlot.height);

    var datas = [];
    var redLineXPosition = 1;
    var whiteLineXPosition = 1;
    for (var x = 0; x < iqImagePlot.width; x = x + 1) {
        for (var y = iqImagePlot.height; y > 0; y--) {

            var pixelData = ctx.getImageData(x, y, 1, 1).data;


            if (isWhiteLine(pixelData)) {

                var pixelDataY2 = ctx.getImageData(x, y - 1, 1, 1).data;
                var pixelDataY3 = ctx.getImageData(x, y - 2, 1, 1).data;

                if (isWhiteLine(pixelDataY2) && isWhiteLine(pixelDataY3)) {
                    //console.log('x: ' + x + ' y: ' + y + ' pixel> ' + pixelData);
                    //if (isSafe(datas, x, y))
                    datas.push({x: x, y: (y - iqImagePlot.width) * (-1)});
                    //fill red square to test image
                    ctx.fillRect(x, y, 2, 2);
                    break;
                }
            } else if (isRedLine(pixelData)) {

                var pixelY2 = ctx.getImageData(x, y - 1, 1, 1).data;
                var pixelY3 = ctx.getImageData(x, y - 2, 1, 1).data;
                var pixelY4 = ctx.getImageData(x, y - 3, 1, 1).data;
                //check if next 3 pixels are red too
                if (isRedLine(pixelY2) && isRedLine(pixelY3) && isRedLine(pixelY4)) {
                    redLineXPosition = x;
                    for (var deltay2 = 0; deltay2 < iqImagePlot.height; deltay2++) {
                        ctx.fillRect(x, deltay2, 2, 2);
                    }

                    break;
                }
            }

            if (isBrightWhite(pixelData)) {
                //check buy limit line

                //get middle of screen
                var pixelBuyLine = ctx.getImageData(x, y, 1, 1).data;
                console.log('is white line');
                if (isBrightWhite(pixelBuyLine)) {


                    var pixelBuyLine2 = ctx.getImageData(x, y + 4, 1, 1).data;
                    var pixelBuyLine3 = ctx.getImageData(x, y + 8, 1, 1).data;
                    var pixelBuyLine4 = ctx.getImageData(x, y + 12, 1, 1).data;
                    var pixelBuyLine5 = ctx.getImageData(x, y + 16, 1, 1).data;

                    if (isBrightWhite(pixelBuyLine2) &&
                        isBrightWhite(pixelBuyLine3) &&
                        isBrightWhite(pixelBuyLine4) &&
                        isBrightWhite(pixelBuyLine5)) {

                        whiteLineXPosition = x;
                        for (var deltay = 0; deltay < iqImagePlot.height; deltay++) {
                            ctx.fillRect(x, deltay, 2, 2);
                        }
                        break;
                    }
                }

            }



        }
    }

    //showImageCroped(canvas);

    //checkData(datas);
    sendPlotData(datas, whiteLineXPosition, redLineXPosition);

}

function getImage(callback) {

    chrome.tabs.captureVisibleTab(null, {}, function (image) {
        console.log('capturanto imagem');
        callback(image);
    });

}

function start() {
    setTimeout(function () {

        getImage(analyzeImage);

        if (startBackground) {
            start();
        }
    }, 5000);
}

var iqImagePlot = {
    left: 198,
    top: 126,
    width: 1407,
    height: 713,
    secondsOn5mMode: (60 * 4) + 30 // 1407 width pixels = 04:30
};

var startBackground = false;

function handleAction(action) {

    if (action == 'start') {
        console.log('staring');
        startBackground = true;
        start();
        return {message: 'started'};
    } else {
        console.log('stoping');
        startBackground = false;
        return {message: 'stoped'};
    }

}

chrome.extension.onMessage.addListener(function (request, sender, sendResponse) {

    console.log('Receiving message:');
    var response = 'unhandled response';
    if (request.action) {
        response = handleAction(request.action);
    }
    sendResponse(response);
});
