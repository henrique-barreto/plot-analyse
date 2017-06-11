function createCanvas(img, canvas) {

    var left = 122;
    var top = 142;
    var desiredWidth = 1147;
    var desiredHeight = 667;

    //create canvas to read pixels
    canvas.width = desiredWidth;
    canvas.height = desiredHeight;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, left, top, desiredWidth, desiredHeight, 0, 0, desiredWidth, desiredHeight);

    return ctx;
}

function isWhiteLine(pixelData) {

    if (pixelData[0] > 100 && pixelData[1] > 100 && pixelData[2] > 100) {
        return true;
    }
    return false;
}
function buildChart(datas) {
    var ctx = document.getElementById("myChart").getContext('2d');
    ctx.height = 200;
    ctx.width = 342;
    var scatterChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: 'Scatter Dataset',
                data: datas
            }]
        },
        options: {
            animation: false,
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });
}
var showImageCroped = function (canvas) {
    var src = document.getElementById("wrapper");
    while (src.firstChild) {
        src.removeChild(src.firstChild);
    }
    src.appendChild(canvas);
};
function isSafe(datas, x, y) {

    if (datas.length === 0)
        return true;

    var data = datas[datas.length - 1];
    var xDiff = checkDiff(data.x, x);
    var yDiff = checkDiff(data.y, y);

    if (xDiff > 50 || yDiff > 50)
        return false;

    return true;

}
function checkData(datas) {

    // if (datas.length === 0)
    //     return;
    //
    // var hour = new Date();
    // var alert = {mode: '5', x: 440, y: 434, Date:hour}
    //
    //
    // var lastX = datas[datas.length - 1].x;
    // var lastY = datas[datas.length - 1].y;
    //
    // var maxXvar = 400;
    // var minXvar = 200;
    //
    // var
    //
    // //no modo 5 min considerar variacoes de y no intervalo de 200 a 400
    //
    // for (var i = 0; i < datas.length; i++) {
    //     var x = datas[i].x;
    //     var y = datas[i].y;
    //
    //
    //     if (lastX - maxXvar > x) {
    //
    //     }
    //
    // }

    var spaceOnLx = 150;
    var maxXvariation = 300;

    var lx = datas[datas.length - 1].x;
    var ly = datas[datas.length - 1].y;
    console.log('last x: ' + lx);
    console.log('last x: ' + ly);
    var nx = lx - spaceOnLx;
    var mx = nx - maxXvariation;

    var playAlert =  false;

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


function analyzeImage(image64) {



    var img = document.createElement("img");
    img.src = image64;
    var imageWidth = img.width;
    var imageHeight = img.height;

    var left = 122;
    var top = 142;
    var desiredWidth = 1147;
    var desiredHeight = 667;

    //create canvas to read pixels
    var canvas = document.createElement('canvas');
    canvas.width = desiredWidth;
    canvas.height = desiredHeight;
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = "#FF0000";
    ctx.drawImage(img, left, top, desiredWidth, desiredHeight, 0, 0, desiredWidth, desiredHeight);


    var datas = [];
    for (var x = 0; x < desiredWidth; x = x + 1) {
        for (var y = desiredHeight; y > 0; y--) {

            var pixelData = ctx.getImageData(x, y, 1, 1).data;


            if (isWhiteLine(pixelData)) {

                var pixelDataY2 = ctx.getImageData(x, y - 1, 1, 1).data;
                var pixelDataY3 = ctx.getImageData(x, y - 2, 1, 1).data;

                if (isWhiteLine(pixelDataY2) && isWhiteLine(pixelDataY3)) {
                    //console.log('x: ' + x + ' y: ' + y + ' pixel> ' + pixelData);
                    //if (isSafe(datas, x, y))
                        datas.push({x: x, y: (y - desiredWidth) * (-1)});
                    ctx.fillRect(x, y, 5, 5);
                    break;
                }

            }

        }
    }

    //showImageCroped(canvas);

    buildChart(datas);

    checkData(datas);

}

function getImage(callback) {

    console.log('Taking ss');
    chrome.tabs.captureVisibleTab(null, {}, function (image) {
        console.log('capturanto imagem');
        callback(image);
    });

}

function start() {
    setTimeout(function () {

        getImage(analyzeImage);


        start();
    }, 5000);
}

document.addEventListener('DOMContentLoaded', function () {
    var link = document.getElementById('start');
    link.addEventListener('click', function () {
        start();
    });
});