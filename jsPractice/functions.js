var userName = "World";

function displayHTML(name){
	var myHeading = "<h1>Hello, " +name+"</h1>",
		myText = "<p>While it is nice to know you world, there are only some things that I am comfortable sharing in a global context. You can't alter the variable that holds this text outside of the function that contains it! Ha!</p>";

	document.write(myHeading + myText);
	countBot(15);
}

document.onclick = function(){
	userName = window.prompt("What is your name?");
	displayHTML(userName);
}

function countBot(countTo){
	document.write("<p>Look "+userName+", I can count to "+ countTo+"</p>");
	for (var count = 1; count <= countTo; count++){
		document.write(count+"<br>");
	}
}


displayHTML(userName);




