var stim = [
	{produce:"eggplant", adj1:"small", adj2:"big"},
	{produce:"banana", adj1:"cheap", adj2:"expensive"},
	{produce:"leek", adj1:"short", adj2:"long"},
	{produce:"zucchini", adj1:"ugly", adj2:"pretty"},
	{produce:"watermelon", adj1:"light", adj2:"heavy"},
	{produce:"clementine", adj1:"dark", adj2:"bright"},
	{produce:"potato", adj1:"stale", adj2:"fresh"},
	{produce:"pear", adj1:"tart", adj2:"sweet"},
	{produce:"turnip", adj1:"thin", adj2:"fat"},
	{produce:"apple", adj1:"mild", adj2:"flavorful"},
	{produce:"broccoli", adj1:"sparse", adj2:"dense"}, 
	{produce:"mushroom", adj1:"dirty", adj2:"clean"} 
]

var stim2 = [
	{produce:"peach", adj1:"cheap", adj2:"sweet"},
	{produce:"mango", adj1:"expensive", adj2:"juicy"},
	{produce:"grapefruit", adj1:"cheap", adj2:"tart"},
	{produce:"pumpkin", adj1:"expensive", adj2:"bright"},
	{produce:"pomegranate", adj1:"juicy", adj2:"fat"},
	{produce:"pineapple", adj1:"dry", adj2:"light"},
	{produce:"rhubarb", adj1:"long", adj2:"thin"},
	{produce:"onion", adj1:"juicy", adj2:"dense"},
	{produce:"cabbage", adj1:"dry", adj2:"big"},
	{produce:"lime", adj1:"weak", adj2:"bright"},
	{produce:"garlic", adj1:"strong", adj2:"fresh"},
	{produce:"ginger", adj1:"fragrant", adj2:"flavorful"}
]

var stimFill = [
	{produce:"tomato", adj1:"vegetable", adj2:"fruit"},
	{produce:"blueberry", adj1:"blue", adj2:"berry"},
	{produce:"black strawberry", adj1:"cold", adj2:"hot"},
	{produce:"blood orange", adj1:"juicy", adj2:"sour"},
	{produce:"spiky artichoke", adj1:"ripe", adj2:"spiky"},
	{produce:"sweet beet", adj1:"sweet", adj2:"cheap"},
	{produce:"salty plaintain", adj1:"savory", adj2:"salty"},
	{produce:"green grape", adj1:"green", adj2:"red"},
	{produce:"bright summer squash", adj1:"humid", adj2:"hot"},
	{produce:"round brussels sprout", adj1:"tasty", adj2:"yucky"},
	{produce:"dark ripe avocado", adj1:"ripe", adj2:"dry"},
	{produce:"bitter sweet okra", adj1:"bitter", adj2:"purple"}
]

function sentence(array, index, struct) {
	//a = small big eggplant
	//b = big small eggplant
	//c = eggplant that's small for a big eggplant
	//d = eggplant that's big for a small eggplant
	var vowels = ['a','e','i','o','u'];
	var txt = "";
	var adj1 = "";
	var adj2 = "";
	var noun = array[index]["produce"];
	var detAdj1 = "a";
	var detAdj2 = "a";
	var detNoun = "a"
	if(struct == "a" || struct == "c"){
		adj1 = array[index]["adj1"];
		adj2 = array[index]["adj2"];
	} else{
		adj1 = array[index]["adj2"];
		adj2 = array[index]["adj1"];
	}
	if(struct == "a" || struct == "b"){
		if(vowels.indexOf(adj1[0]) != -1){
			detAdj1 = "an";
		}
		txt = detAdj1 + " " + adj1 + " " + adj2 + " " + noun;
	} else{
		if(vowels.indexOf(noun[0]) != -1){
			detNoun = "an";
		}
		if(vowels.indexOf(adj2[0]) != -1){
			detAdj2 = "an";
		}
		txt = detNoun + " " + noun + " that's " + adj1 + " for " + detAdj2 + " " + adj2 + " " + noun;
	}
	return {'txt': txt, 'adjFirst': adj1, 'adjSecond': adj2};
}

function fillerSent(array, index) {
	var vowels = ['a','e','i','o','u'];
	var noun = array[index]["produce"];
	var det = "a";
	if(vowels.indexOf(noun[0]) != -1){
		det = "an";
	}
	return {'txt': det + " " + noun, 'adjFirst': 'NA', 'adjSecond': 'NA'};
}
