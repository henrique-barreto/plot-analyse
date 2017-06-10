function getImage(callback) {

    chrome.tabs.captureVisibleTab(null, {}, function (image) {
        console.log('capturanto imagem');
        callback(image);
    });

}

function createElementOnScreen(imageUrl64) {

    var img = document.createElement("img");
    img.src = imageUrl64;

    var src = document.getElementById("wrapper");
    src.appendChild(img);
}

function drawCanvas(img) {

    console.log('drawing canvas');
    var canvas = document.createElement('myCanvas');
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
    var src = document.getElementById("wrapper");
    src.appendChild(canvas);
}

function teste(image) {
    console.log('teste');
    console.log(image);
}


function clickHandler() {
    console.log('Hello');

    getImage(teste);

    console.log('image: \n' + imageUrl64);

    createElementOnScreen(imageUrl64);

    // chrome.tabs.captureVisibleTab(null, {}, function (image) {
    //     console.log(image);
    //     var img = document.createElement("img");
    //     img.src = image;
    //
    //     var src = document.getElementById("wrapper");
    //     src.appendChild(img);
    //
    // });


    // var img = document.createElement("img");
    // img.src = imageUrl64;

    //test if image is correct
    // createElementOnScreen(imageUrl64);
    //
    // //test if generated canvas is correct
    // drawCanvas(img);

    // img = new Image();
    // img.src = imageUrl64;


    // var imageWidth = img.width;
    // var imageHeight = img.height;
    //
    // console.log('width: ' + imageWidth);
    // console.log('Height: ' + imageHeight);


    //create canvas
    // var canvas = document.createElement('canvas');
    // canvas.width = img.width;
    // canvas.height = img.height;
    // var ctx = canvas.getContext('2d');
    // ctx.fillStyle = "blue";
    // ctx.fillRect(0, 0, canvas.width, canvas.height);
    // ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    //
    // var pixelData = ctx.getImageData(10, 10, 1, 1);
    // console.log(pixelData);

    // for (var x = 0; x < imageWidth; x = x + 10) {
    //     for (var y = 0; y < imageHeight; y++) {
    //
    //         console.log('[' + x + ', ' + y + ']');
    //
    //         var pixelData = ctx.getImageData(x, y, 1, 1).data;
    //
    //         if (pixelData[0] > 200 || pixelData[1] > 200 || pixelData[2] > 200) {
    //             // console.log(pixelData);
    //             console.log('x: ' + x + ' y: ' + y);
    //             //break;
    //         }
    //     }
    // }

//     var pixelX = 100;
//     var pixelY = 159;
//
//
//     var pixelData = ctx.getImageData(pixelX, pixelY, 1, 1).data;
//     console.log('rgb: ' + pixelData);
// console.log('Hex: ' + rgba2hex(pixelData[0], pixelData[1], pixelData[2], pixelData[3]))
    console.log('terminou');

}

document.addEventListener('DOMContentLoaded', function () {
    var link = document.getElementById('start');
    // onClick's logic below:
    link.addEventListener('click', function () {
        clickHandler('xxx');
    });
});