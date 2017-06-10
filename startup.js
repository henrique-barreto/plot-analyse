
function clickHandler() {
  console.log('Hello');


chrome.tabs.captureVisibleTab(null, {}, function (image) {
   	console.log(image);
	var img = document.createElement("img");
	img.src = image;


	var src = document.getElementById("wrapper");
	src.appendChild(img);

});

	//chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
	  //chrome.tabs.sendMessage(tabs[0].id, {greeting: "hello"}, function(response) {
	  //	console.log('recebeu reesposta');
	  //  console.log(response);
	 // });
	//}//);

}



document.addEventListener('DOMContentLoaded', function() {
    var link = document.getElementById('start');
    // onClick's logic below:
    link.addEventListener('click', function() {
        clickHandler('xxx');
    });
});