function debugLog(message){
  if(expt.debug){
    console.log(message);
  }
}

var exptPart = "practice";
var trialNumber = 0;
var trialData = [];
var Trial = 108; //set by length(stim) //108
var expt = {
    name: 'FruityStudy',
    maxTrials: 108,
    debug: false,
    rmse_threshold: 0.5,
    rmse_match: 'color',
    saveURL: 'submit.simple.php',
};
var client = parseClient();
var stimList = [];
var selectedBox = "";
var selectedTxt = "";
var boxOrder = [];
var sent = "";
var structureIndex = 0;
var structure = ["a","b","c","d"];
var structInd = sampleInd(0,structure.length - 1); //replace with set list?
var structInd2 = sampleInd(0,structure.length - 1);
var stimType = "";
var trialStim = [];
var startTime = 0;
var trialTime = 0;
var countStim = 0;
var countStim2 = 0;


function pageLoad(){
    document.getElementById('consent').style.display = 'block';
    $('#continueConsent').attr('disabled',true);
    $('input:radio[name="consent"]').change(
        function(){
            if($(this).is(':checked') && $(this).val()=="yes"){
                $('#continueConsent').attr('disabled',false);
            }
        });
}

function clickConsent(){
    document.getElementById('consent').style.display = 'none';
    document.getElementById('instructions').style.display = 'block';
}

function clickInstructions(){
    document.getElementById('instructions').style.display = 'none';
    stimList = shuffle(stim.slice(0));
    stimList2 = shuffle(stim2.slice(0));
    stimFillList = shuffle(stimFill.slice(0));
    trialStart();
}

function select(cell){
    $('#next').attr('disabled',false);
    if(cell == cellL){
        selectedBox = "left";
        selectedTxt = boxOrder[0];
        $('#cellR').css({'background-color':'white'}); //if cellR previously clicked, unhighlights it
        $('#cellL').css({'background-color':'yellow'});
    } else{
        selectedBox = "right";
        selectedTxt = boxOrder[1];
        $('#cellL').css({'background-color':'white'}); //if cellL previously clicked, unhighlights it
        $('#cellR').css({'background-color':'yellow'});
    }
}

function trialStart(){
    document.getElementById('trial').style.display = 'block';
    $('#next').attr('disabled',true);
    $('#round').html('Round ' + (trialNumber + 1) + " of " + Trial);
    $('.cell').css({'background-color':'white'});

    var sampledLists = []
    if(stimList.length > 0){
        sampledLists.push("stimList");
    } else {
		if (countStim < 4) {
			stimList = shuffle(stim.slice(0));
			sampledLists.push("stimList");
		}
	}
    if(stimList2.length > 0){
        sampledLists.push("stimList2");
    } else {
		if (countStim2 < 4) {
			stimList2 = shuffle(stim2.slice(0));
			sampledLists.push("stimList2");
		}
	}
    if(stimFillList.length > 0){
        sampledLists.push("stimFillList");
    }

    stimType = sample(sampledLists);

    if(stimType == "stimList"){
        trialStim = stimList[0];
        structureIndex = structInd;
        sent = sentence(stimList, 0, structure[structInd]);
        $('#stimTxt').html(sent['txt']);   
        stimList.splice(0,1);
        if(structInd == (structure.length - 1)){
            structInd = 0;
        } else{
            ++structInd;
        }
    } else if(stimType == "stimList2"){
        trialStim = stimList2[0];
        structureIndex = structInd2;
        sent = sentence(stimList2, 0, structure[structInd2]);
        $('#stimTxt').html(sent['txt']);
        stimList2.splice(0,1);
        if(structInd2 == (structure.length - 1)){
            structInd2 = 0;
        } else{
            ++structInd2;
        }
    } else{
        trialStim = stimFillList[0];
        structureIndex = 0;
        sent = fillerSent(stimFillList, 0);
        $('#stimTxt').html(sent['txt']);
        stimFillList.splice(0,1);
    }
	
    boxOrder = shuffle([trialStim['adj1'], trialStim['adj2']]);   
    $('#txtL').html(boxOrder[0]);
    $('#txtR').html(boxOrder[1]);

    startTime = new Date().getTime();
}

function trialDone(){
    document.getElementById('trial').style.display = 'none';
    trialTime = new Date().getTime() - startTime;

    // record what the subject said
    trialData.push({
        trialNumber: trialNumber, //{0:36}
        stimType: stimType, //{stimList, stimList2, stimFillList}
        structureIndex: structure[structureIndex], //{a, b, c, d}
        produce: trialStim['produce'],
        adjFirst: sent['adjFirst'], //1st adj in sentence
        adjSecond: sent['adjSecond'], //2nd adj in sentence
        nounPhrase: sent['txt'],
        fullSentence: $('#sentence').text(),
        boxLeft: boxOrder[0],
        boxRight: boxOrder[1],
        selectedBox: selectedBox,
        selectedTxt: selectedTxt,
        trialTime: trialTime
    });
    // increment the trialNumber
    ++trialNumber;
    
    // if we are done with all trials, then go to completed page
    if(trialNumber >= Trial){
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