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
                point:{
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
function analyzeImage(image64) {

    console.log('analyzing image');

    var img = document.createElement("img");
    img.src = image64;
    var imageWidth = img.width;
    var imageHeight = img.height;
    console.log('width: ' + imageWidth);
    console.log('Height: ' + imageHeight);

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
                    datas.push({x: x, y: (y - desiredWidth) * (-1)});
                    ctx.fillRect(x, y, 5, 5);
                    break;
                }

            }

        }
    }

    //showImageCroped(canvas);

    console.log(datas);
    buildChart(datas);
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

        console.log('working...');

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