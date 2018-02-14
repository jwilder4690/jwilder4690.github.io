var headingText = "<h1>A Page of JavaScript</h1>";
var myIntro = "Hello, welcome to my JavaScript page!";
var linkTag = "<a href=\"http://www.scripttheweb.com\">Link to a Site</a>";
var redText = "<span style=\"color:red\">I am so colorful today!</span>";
var beginEffect = "<em>";
var endEffect = "</em>";
var beginPara = "<p>";
var endPara = "</p>";
var payCheck = 1200;

function sendAlert(){
	window.alert("This came from a function!");
}

document.onclick = function(){
	window.alert("Do not click!");
}



document.write(headingText);
document.write(beginEffect+myIntro+endEffect);
document.write(beginPara+linkTag+endPara);
document.write(beginPara+redText+endPara);

sendAlert();



//aint no thing

/*
aint
many
thangs
*/