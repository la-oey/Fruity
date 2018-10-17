// experiment settings
var expt = {
	name: 'FruityStudy',
	maxTrials: 36,
    debug: true,
    rmse_threshold: 0.5,
    rmse_match: 'color',
    saveURL: 'http://quiz.ucsd.edu/lcl/FruityStudy/submit.simple.php',
};


function debugLog(message){
	if(expt.debug){
		console.log(message);
	}
}