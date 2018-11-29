function debugLog(message){
  if(expt.debug){
    console.log(message);
  }
}

var trialData = [];
var expt = {
    name: 'FruityStudy',
    maxTrials: 144,
    maxBlocks: 4,
    structure: ["a","b","c","d"],
    debug: false,
    rmse_threshold: 0.5,
    rmse_match: 'color',
    saveURL: 'submit.simple.php',
};

var trial = {
    block: 0,
    trialNumber: 0,
    stimType: "",
    structureIndex: 0,
    sent: "",
    boxOrder: [],
    selectedBox: "",
    selectedTxt: "",
    startTime: 0,
    trialTime: 0
};

var client = parseClient();
var stimFinal = [];
var stimFinal2 = [];
var stimList = [];
var stimList2 = [];
var stimFillList = []
var countStim = 0;
var countStim2 = 0;
var countStimFill = 0;
var structInd = sampleInd(0,expt.structure.length - 1); //replace with set list?
var structInd2 = sampleInd(0,expt.structure.length - 1);
var trialStim = [];



function pageLoad(){
    document.getElementById('consent').style.display = 'block';
    $('#continueConsent').attr('disabled',true);
    $('input:radio[name="consent"]').change(
        function(){
            if($(this).is(':checked') && $(this).val()=="yes"){
                $('#continueConsent').attr('disabled',false);
            }
        });
    $('#maxTrials').html(expt.maxTrials);
}

function clickConsent(){
    document.getElementById('consent').style.display = 'none';
    document.getElementById('instructions').style.display = 'block';
}

function clickInstructions(){
    document.getElementById('instructions').style.display = 'none';
    stimList = shuffle(stim.slice(0));
	stimFinal = stimList.slice(0);
    stimList2 = shuffle(stim2.slice(0));
	stimFinal2 = stimList2.slice(0);
    stimFillList = shuffle(stimFill.slice(0));
    trialStart();
}

function select(cell){
    $('#next').attr('disabled',false);
    if(cell == cellL){
        trial.selectedBox = "left";
        trial.selectedTxt = trial.boxOrder[0];
        $('#cellR').css({'background-color':'white'}); //if cellR previously clicked, unhighlights it
        $('#cellL').css({'background-color':'yellow'});
    } else{
        trial.selectedBox = "right";
        trial.selectedTxt = trial.boxOrder[1];
        $('#cellL').css({'background-color':'white'}); //if cellL previously clicked, unhighlights it
        $('#cellR').css({'background-color':'yellow'});
    }
}

function trialStart(){
    document.getElementById('trial').style.display = 'block';
    $('#next').attr('disabled',true);
    $('#round').html('Round ' + (trial.trialNumber + 1) + " of " + expt.maxTrials);
    $('.cell').css({'background-color':'gray', 'pointer-events':'none'});

    var sampledLists = [];
    if(stimList.length > 0){
        sampledLists.push("stimList");
    } else if (countStim < expt.maxBlocks) {
		stimList = stimFinal.slice(0);
		sampledLists.push("stimList");
		++countStim;
		if(structInd == (expt.structure.length - 1)){
			structInd = 0;
		} else {
			++structInd;
		}
	}
    if(stimList2.length > 0){
        sampledLists.push("stimList2");
    } else if (countStim2 < expt.maxBlocks) {
		stimList2 = stimFinal2.slice(0);
		sampledLists.push("stimList2");
		++countStim2;
		if(structInd2 == (expt.structure.length - 1)){
			structInd2 = 0;
		} else {
			++structInd2;
		}
	}
    if(stimFillList.length > 0){
        sampledLists.push("stimFillList");
    } else if (countStimFill < expt.maxBlocks) {
		stimFillList = shuffle(stimFill.slice(0));
		sampledLists.push("stimFillList");
		++countStimFill;
	}

    trial.stimType = sample(sampledLists);

    if(trial.stimType == "stimList"){
        trialStim = stimList[0];
        trial.structureIndex = structInd;
        trial.sent = sentence(stimList, 0, expt.structure[trial.structureIndex]);
        $('#stimTxt').html(trial.sent['txt']);   
        stimList.splice(0,1);
        if(structInd == (expt.structure.length - 1)){
            structInd = 0;
        } else{
            ++structInd;
        }
    } else if(trial.stimType == "stimList2"){
        trialStim = stimList2[0];
        trial.structureIndex = structInd2;
        trial.sent = sentence(stimList2, 0, expt.structure[trial.structureIndex]);
        $('#stimTxt').html(trial.sent['txt']);
        stimList2.splice(0,1);
        if(structInd2 == (expt.structure.length - 1)){
            structInd2 = 0;
        } else{
            ++structInd2;
        }
    } else{
        trialStim = stimFillList[0];
        trial.structureIndex = 0;
        trial.sent = fillerSent(stimFillList, 0);
        $('#stimTxt').html(trial.sent['txt']);
        stimFillList.splice(0,1);
    }
	
    trial.boxOrder = shuffle([trialStim['adj1'], trialStim['adj2']]);   
    $('#txtL').html(trial.boxOrder[0]);
    $('#txtR').html(trial.boxOrder[1]);

    trial.startTime = new Date().getTime();
}

function trialDone(){
    document.getElementById('trial').style.display = 'none';
    trial.trialTime = new Date().getTime() - trial.startTime;

    // record what the subject said
    trialData.push({
        trialNumber: trial.trialNumber, //{0:108}
        stimType: trial.stimType, //{stimList, stimList2, stimFillList}
        structureIndex: expt.structure[trial.structureIndex], //{a, b, c, d}
        produce: trialStim['produce'],
        adjFirst: trial.sent['adjFirst'], //1st adj in sentence
        adjSecond: trial.sent['adjSecond'], //2nd adj in sentence
        nounPhrase: trial.sent['txt'],
        fullSentence: $('#sentence').text(),
        boxLeft: trial.boxOrder[0],
        boxRight: trial.boxOrder[1],
        selectedBox: trial.selectedBox,
        selectedTxt: trial.selectedTxt,
        trialTime: trial.trialTime
    });
    // increment the trialNumber
    ++trial.trialNumber;
    
    // if we are done with all trials, then go to completed page
    if(trial.trialNumber >= expt.maxTrials){
        // these lines write to server
        debugLog(trialData);
        debugLog(client);
        data = {client: client, trials: trialData};
        writeServer(data);
        document.getElementById('trial').style.display = 'none';
        document.getElementById('completed').style.display = 'block';
    }
    else {
        trialStart();
    }
}

function experimentDone(){
    submitExternal(client);
}


function shuffle(array){
 	var tornado = array.slice(0);
  	var return_array = [];
  	for(var i=0; i<array.length; i++){
		var randomIndex = Math.floor(Math.random()*tornado.length);
    	return_array.push(tornado.splice(randomIndex, 1)[0]);
	}
  	return return_array;   
}

function sample(array){
    return(array[Math.floor(Math.random() * array.length)]);
}

function sampleInd(min, max){
    return(Math.floor(Math.random() * (max - min)) + min);
}