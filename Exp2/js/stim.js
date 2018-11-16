var stim = [
	{produce:"eggplant", adj1:"small", adj2:"big", origiIndex:"00", list:"stim"},
	{produce:"banana", adj1:"cheap", adj2:"expensive", origiIndex:"01", list:"stim"},
	{produce:"leek", adj1:"short", adj2:"long", origiIndex:"02", list:"stim"},
	{produce:"zucchini", adj1:"ugly", adj2:"pretty", origiIndex:"03", list:"stim"},
	{produce:"watermelon", adj1:"light", adj2:"heavy", origiIndex:"04", list:"stim"},
	{produce:"clementine", adj1:"dark", adj2:"bright", origiIndex:"05", list:"stim"},
	{produce:"potato", adj1:"stale", adj2:"fresh", origiIndex:"06", list:"stim"},
	{produce:"pear", adj1:"tart", adj2:"sweet", origiIndex:"07", list:"stim"},
	{produce:"turnip", adj1:"thin", adj2:"fat", origiIndex:"08", list:"stim"},
	{produce:"apple", adj1:"mild", adj2:"flavorful", origiIndex:"09", list:"stim"},
	{produce:"broccoli", adj1:"sparse", adj2:"dense", origiIndex:"10", list:"stim"}, 
	{produce:"mushroom", adj1:"dirty", adj2:"clean", origiIndex:"11", list:"stim"} 
]

var stim2 = [
	{produce:"peach", adj1:"cheap", adj2:"juicy", origiIndex:"00", list:"stim2"},
	{produce:"mango", adj1:"expensive", adj2:"juicy", origiIndex:"01", list:"stim2"},
	{produce:"grapefruit", adj1:"cheap", adj2:"dry", origiIndex:"02", list:"stim2"},
	{produce:"pumpkin", adj1:"expensive", adj2:"dry", origiIndex:"03", list:"stim2"},
	{produce:"lime", adj1:"cheap", adj2:"weak", origiIndex:"04", list:"stim2"},
	{produce:"garlic", adj1:"expensive", adj2:"weak", origiIndex:"05", list:"stim2"},
	{produce:"ginger", adj1:"cheap", adj2:"strong", origiIndex:"06", list:"stim2"},
	{produce:"rhubarb", adj1:"expensive", adj2:"strong", origiIndex:"07", list:"stim2"},
	{produce:"pomegranate", adj1:"juicy", adj2:"weak", origiIndex:"08", list:"stim2"},
	{produce:"pineapple", adj1:"dry", adj2:"weak", origiIndex:"09", list:"stim2"},
	{produce:"onion", adj1:"juicy", adj2:"strong", origiIndex:"10", list:"stim2"},
	{produce:"cabbage", adj1:"dry", adj2:"strong", origiIndex:"11", list:"stim2"}
]

var stimFill = [
	{produce:"tomato", adj1:"vegetable", adj2:"fruit", origiIndex:"00", list:"stimFill"},
	{produce:"blueberry", adj1:"blue", adj2:"berry", origiIndex:"01", list:"stimFill"},
	{produce:"black strawberry", adj1:"cold", adj2:"hot", origiIndex:"02", list:"stimFill"},
	{produce:"blood orange", adj1:"juicy", adj2:"sour", origiIndex:"03", list:"stimFill"},
	{produce:"spiky artichoke", adj1:"ripe", adj2:"spiky", origiIndex:"04", list:"stimFill"},
	{produce:"sweet beet", adj1:"sweet", adj2:"cheap", origiIndex:"05", list:"stimFill"},
	{produce:"salty plaintain", adj1:"savory", adj2:"salty", origiIndex:"06", list:"stimFill"},
	{produce:"green grape", adj1:"green", adj2:"red", origiIndex:"07", list:"stimFill"},
	{produce:"bright summer squash", adj1:"humid", adj2:"hot", origiIndex:"08", list:"stimFill"},
	{produce:"round brussels sprout", adj1:"tasty", adj2:"yucky", origiIndex:"09", list:"stimFill"},
	{produce:"dark ripe avocado", adj1:"ripe", adj2:"dry", origiIndex:"10", list:"stimFill"},
	{produce:"bitter sweet okra", adj1:"bitter", adj2:"purple", origiIndex:"11", list:"stimFill"}
]

function sentence(array, index, struct) {
	// order1 = adj1 appears first
	// order2 = adj2 appears first
	// pros1 = first adjective is emphasized
	// pros2 = second adjective is emphasized
	// a = order1_pros1
	// b = order1_pros2
	// c = order2_pros1
	// d = order2_pros2
	var vowels = ['a','e','i','o','u'];
	var txt = "";
	var adj1 = "";
	var adj2 = "";
	var adjFirst = array[index]["adj1"];
	var adjSecond = array[index]["adj2"];
	var noun = array[index]["produce"];
	var detAdj1 = "a";
	var order = 0;
	var pros = 0;
	
	// assign sequence of adj
	if(struct == "a" || struct == "b"){
		adj1 = array[index]["adj1"];
		adj2 = array[index]["adj2"];
	} else{
		adj1 = array[index]["adj2"];
		adj2 = array[index]["adj1"];
	}
	
	// change determinant
	if(vowels.indexOf(adj1[0]) != -1){
		detAdj1 = "an";
	}
	
	// assign order and prosody
	if(struct == "a"){
		order = 1;
		pros = 1;
	} else if (struct == "b"){
		order = 1;
		pros = 2;
	} else if (struct == "c"){
		order = 2;
		pros = 1;
	} else {
		order = 2;
		pros = 2;
	}

	// compose text
	txt = detAdj1 + " " + adj1 + " " + adj2 + " " + noun;
	
	// play audio
	insertAudio(array, index, adjFirst, adjSecond, order, pros);
	
	return {'txt': txt, 'adjFirst': adj1, 'adjSecond': adj2};
}

function fillerSent(array, index) {
	var vowels = ['a','e','i','o','u'];
	var noun = array[index]["produce"];
	var det = "a";
	if(vowels.indexOf(noun[0]) != -1){
		det = "an";
	}
	
	// play audio
	insertFillerAudio(array, index);
	
	return {'txt': det + " " + noun, 'adjFirst': 'NA', 'adjSecond': 'NA'};
}

function insertAudio(array, index, adj1, adj2, order, prosody) {
	var stimType = array[index]["list"];
	var ind = array[index]["origiIndex"];
	var prod = array[index]["produce"].charAt(0).toUpperCase() + array[index]["produce"].slice(1);
	var adjFirst = adj1.charAt(0).toUpperCase() + adj1.slice(1);
	var adjSecond = adj2.charAt(0).toUpperCase() + adj2.slice(1);
	var audio = new Audio();
	
	// assign audio directory
	var audioDir = "audio/Audio_" + stimType + "_" + ind + "_prod" + prod + "-adj1" + adjFirst + "-adj2" + adjSecond + "_order" + order.toString() + "_pros" + prosody.toString() + ".wav";
	var playList = [audioDir, "audio/Audio_question.wav"];
	
	var i = 1;
	audio.src = playList[0];
	audio.play();

	audio.onended = function() {
    if(i < playList.length){
        audio.src= playList[i];
        audio.play();
        i++;
    }
};
}

function insertFillerAudio(array, index) {
	var stimType = array[index]["list"];
	var ind = array[index]["origiIndex"];
	var prod = capWordsInitialLetter(array[index]["produce"]);
	var adjFirst = array[index]["adj1"].charAt(0).toUpperCase() + array[index]["adj1"].slice(1);
	var adjSecond = array[index]["adj2"].charAt(0).toUpperCase() + array[index]["adj2"].slice(1);
	var audio = new Audio();

	// assign audio directory
	var audioDir = "audio/Audio_" + stimType + "_" + ind + "_prod" + prod + "-adj1" + adjFirst + "-adj2" + adjSecond + "_order0_pros0.wav";
	var playList = [audioDir, "audio/Audio_question.wav"];
	
	var i = 1;
	audio.src = playList[0];
	audio.play();

	audio.onended = function() {
    if(i < playList.length){
        audio.src= playList[i];
        audio.play();
        i++;
    }
};
	
}

function capWordsInitialLetter(string) {
	var splitString = string.split(' ');
	var resultStr = "";
	for (var i = 0; i< splitString.length; i++) {
		splitString[i] = splitString[i].charAt(0).toUpperCase() + splitString[i].slice(1);
		resultStr = resultStr + splitString[i];
	}
	return resultStr;
}
