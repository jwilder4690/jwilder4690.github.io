var computerParts = [["Monitors", "LCD Screens", "Vibrant Colors"],
					 ["Motherboards", "Fast"],
					 ["Chips","Pentium","Very Fast"],
					 ["Hard Drives","100-500 GB","Fast Reading"],
					 ["DVD-ROMs","Burn CDs","Burn DVDs", "Listen to both!"],
					 ["Cases","All Sizes","Choice of Colors"],
					 ["Power Supplies","We can get one for any computer!"]];



for (var i = 0; i < computerParts.length; i++){
	document.write((i+1) + ". ")
	for(var j = 0; j < computerParts[i].length; j++){
		if(j == 0){
			document.write(computerParts[i][j]+": ");
		}
		else if (j != 0 && j < computerParts[i].length-1){
			document.write(computerParts[i][j]+", ");
		}
		else {
			document.write(computerParts[i][j]+"<br>");	
		}
	}
}



