function buildChart(plotObj) {
    var ctx = document.getElementById("myChart").getContext('2d');
    ctx.height = 200;
    ctx.width = 342;

    //plotObj {datas:datas, whiteLineXPosition: whiteLineXPosition, redLineXPosition: redLineXPosition};

    var config = {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: 'Scatter Dataset',
                    data: plotObj.datas
                }

            ]
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
    };

    var scatterChart = new Chart(ctx, config);
}

function appendCropedImage(canvas) {


    document.getElementById('img').setAttribute('src', canvas);
}

/**
 * {action: 'start'} - starts
 * {action: 'stop'} - stops
 * @param param
 */
function sendMessageToBackground(param) {
    chrome.extension.sendMessage(param,
        function (response) {

            var helloMessage = response.message;
            document.getElementById('msgContainer').innerText = helloMessage;
        });
}

chrome.runtime.onConnect.addListener(function (port) {
    console.log('conectou');

    if (port.name != "plotPort")
        return;

    port.onMessage.addListener(function (plotObj) {
        console.log('recebendo array de datas');
        buildChart(plotObj);
    });
});

chrome.runtime.onConnect.addListener(function (port) {
    console.log('conectou recebendo canvas');
    if (port.name != "cropedImage")
        return;

    port.onMessage.addListener(function (canvas) {
        appendCropedImage(canvas);
    });
});

document.addEventListener('DOMContentLoaded', function () {
    var buttonStart = document.getElementById('start');
    buttonStart.addEventListener('click', function () {

        if (buttonStart.innerText == 'Start') {
            sendMessageToBackground({action: 'start'});
            buttonStart.innerText = 'Stop';
        } else {
            sendMessageToBackground({action: 'stop'});
            buttonStart.innerText = 'Start';
        }

    });
});

