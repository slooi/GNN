/*
Credits:
https://stackoverflow.com/questions/13937782/calculating-the-point-of-intersection-of-two-lines

https://stackoverflow.com/questions/14895287/how-to-print-object-array-in-javascript
*/
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = 1000;//window.innerWidth;
canvas.height = 500;//window.innerHeight;

//##################################
// 		VARIABLES & CONSTANTS
//##################################

// Variables
var blobArray = [];
var i;	// index
var drawingMap = false;
var mouseDown = false;
var drawingCheckpoints = false;

var populationSize = 30;
var newPopulationSize = populationSize;

var numOfDead = 0;		// If numOfDead === populationSize then make next pop

var highestCheckpointReached = 0;
var numOfGenStuckOnCheckpoint = 0;	// Remember to code it so it doesn't introduce new individual if has reached the very highest checkpoint(cus you can't get any better)
var numOfGenStuckOnCheckpoint2 = 0;
var highestCheckpointReached2 = 0;

var numberOfGenerations = 1;

var lineArray = [
	[[0,0],[10,0]],		// line 1
	[[0,10],[5,5]]		// line 2
];

var lineMap = [ [ [ 26, 14 ], [ 125, 15 ] ], [ [ 125, 15 ], [ 224, 15 ] ], [ [ 224, 15 ], [ 322, 16 ] ], [ [ 322, 16 ], [ 354, 110 ] ], [ [ 354, 110 ], [ 325, 199 ] ], [ [ 325, 199 ], [ 230, 206 ] ], [ [ 27, 15 ], [ 28, 97 ] ], [ [ 28, 97 ], [ 103, 92 ] ], [ [ 103, 92 ], [ 200, 79 ] ], [ [ 200, 79 ], [ 270, 115 ] ], [ [ 270, 115 ], [ 202, 164 ] ], [ [ 202, 164 ], [ 162, 239 ] ], [ [ 162, 239 ], [ 204, 320 ] ], [ [ 204, 320 ], [ 296, 347 ] ], [ [ 231, 207 ], [ 255, 281 ] ], [ [ 255, 282 ], [ 342, 250 ] ], [ [ 342, 250 ], [ 391, 165 ] ], [ [ 391, 165 ], [ 443, 103 ] ], [ [ 443, 103 ], [ 533, 70 ] ], [ [ 533, 70 ], [ 624, 43 ] ], [ [ 624, 43 ], [ 720, 55 ] ], [ [ 720, 55 ], [ 816, 60 ] ], [ [ 816, 60 ], [ 877, 137 ] ], [ [ 877, 137 ], [ 894, 232 ] ], [ [ 894, 232 ], [ 886, 326 ] ], [ [ 886, 326 ], [ 904, 422 ] ], [ [ 295, 348 ], [ 369, 297 ] ], [ [ 369, 297 ], [ 439, 249 ] ], [ [ 439, 249 ], [ 455, 155 ] ], [ [ 455, 156 ], [ 527, 108 ] ], [ [ 527, 108 ], [ 621, 80 ] ], [ [ 619, 81 ], [ 714, 95 ] ], [ [ 714, 95 ], [ 786, 160 ] ], [ [ 786, 160 ], [ 852, 219 ] ], [ [ 852, 219 ], [ 818, 308 ] ], [ [ 818, 308 ], [ 837, 401 ] ], [ [ 905, 422 ], [ 819, 466 ] ], [ [ 819, 466 ], [ 720, 467 ] ], [ [ 720, 467 ], [ 670, 389 ] ], [ [ 670, 389 ], [ 678, 291 ] ], [ [ 837, 401 ], [ 746, 420 ] ], [ [ 746, 420 ], [ 724, 327 ] ], [ [ 724, 327 ], [ 702, 230 ] ], [ [ 702, 230 ], [ 614, 242 ] ], [ [ 614, 242 ], [ 533, 293 ] ], [ [ 679, 292 ], [ 589, 299 ] ], [ [ 589, 299 ], [ 525, 359 ] ], [ [ 525, 359 ], [ 499, 454 ] ], [ [ 533, 293 ], [ 463, 362 ] ], [ [ 463, 362 ], [ 441, 454 ] ] ];
var tempLine = [];
var checkpointMap = [ [ [ 369, 222 ], [ 369, 222 ] ], [ [ 254, 17 ], [ 235, 97 ] ], [ [ 233, 143 ], [ 246, 205 ] ], [ [ 185, 283 ], [ 249, 261 ] ], [ [ 305, 264 ], [ 329, 325 ] ], [ [ 371, 200 ], [ 441, 237 ] ], [ [ 472, 94 ], [ 493, 134 ] ], [ [ 582, 57 ], [ 589, 90 ] ], [ [ 693, 53 ], [ 686, 91 ] ], [ [ 849, 102 ], [ 787, 160 ] ], [ [ 840, 253 ], [ 892, 263 ] ], [ [ 830, 362 ], [ 893, 361 ] ], [ [ 793, 411 ], [ 804, 465 ] ], [ [ 684, 410 ], [ 740, 394 ] ], [ [ 677, 310 ], [ 719, 306 ] ], [ [ 626, 241 ], [ 627, 296 ] ], [ [ 520, 307 ], [ 550, 337 ] ], [ [ 452, 412 ], [ 510, 411 ] ], [ [ 441, 454 ], [ 499, 454 ] ] ];

// Constants
const mPI = Math.PI;
const mPI4 = mPI/4;

const fWidth = canvas.width;
const fHeight = canvas.height;

//Blob Components
const eAngle = 2 * Math.PI;
const blobRadius = 10;
const blobSpeed = 1;

const sensorLength = 150;

//##################################
//			 FUNCTIONS
//##################################

function getDistance(x1,y1,x2,y2){
	return Math.sqrt((x2-x1)**2+(y2-y1)**2);
}

function withinSensorRange(thisx1,thisy1, x2,y2,x3,y3){
	let aDis = Math.sqrt((x2-thisx1)**2+(y2-thisy1)**2);
	let bDis = Math.sqrt((x3-thisx1)**2+(y3-thisy1)**2);

	if (aDis <= sensorLength || bDis <= sensorLength){
		return true;
	}else{
		return false;
	}
}

// LINE/LINE
function lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {

  // calculate the distance to intersection point
  let uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
  let uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

  // if uA and uB are between 0-1, lines are colliding
  if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {

    // optionally, draw a circle where the lines meet
    let intersectionX = x1 + (uA * (x2-x1));
    let intersectionY = y1 + (uA * (y2-y1));   

	return {
		x: intersectionX,
		y: intersectionY,
		collision: true
	};
  }
  return {
  	collision: false
  };
}




// Synax of line argument = [[x0,y0][x1,y1]];
function drawLine(line,num){
	c.beginPath();
	if (num === 0){
		c.strokeStyle = "rgba(0,0,0,1)";
	}else{
		c.strokeStyle = "rgba(100,200,100,1)";
	}
	c.lineWidth = 1;
	c.moveTo(line[0][0],line[0][1]);
	c.lineTo(line[1][0],line[1][1]);
	c.stroke();
}




// Creates blobs
// Assumes that checkpoints aren't 40 ticks next to each other
// Assumes that blob can't hit two checkpoints at same time
function newBlob(x,y,dir,syn0,syn1){
	this.x = x;
	this.y = y;
	this.dir = dir;
	this.sensors = [];
	this.alive = true;
	this.checkpointsReached = 0;	// BUT REM THAT arrays are zero indexed

	this.syn0 = syn0;
	this.syn1 = syn1;
	let touchCheckpointTimer = 0;
	// 20*7
	let timeWithoutCheckpoint = 0;
	// console.log(this.syn0);
	// console.log(this.syn1);

	this.draw = function(){
		// Draws blob
		c.beginPath();
		c.arc(this.x,this.y,blobRadius,0,eAngle);
		c.strokeStyle = "rgba(0,0,200,1)";
		c.lineWidth = 1;
		c.stroke();
	}
	this.update = function(){
		if (this.alive){
			timeWithoutCheckpoint++;
			if (timeWithoutCheckpoint>=550){
				this.alive = false;
			}

			// Update Sensors
			this.updateSensors();

			// Determine Direction
			this.dir += this.forwardPropagation();//*eAngle;
			//console.log(this.dir/mPI*180);//*eAngle)

			// Update Position
			this.x += blobSpeed * Math.cos(this.dir);
			this.y += blobSpeed * Math.sin(this.dir);
		}


		// Draw Blob
		this.draw();
	}

	this.updateSensors = function(){
		if (touchCheckpointTimer !== 0){
			touchCheckpointTimer--;
		}
		// Optimisation 
		let tempLineMap = [];		// Stores all lines that are within(inclusive) sensorLength
		let lineMapLength = lineMap.length;
		for (let i=0;i<lineMapLength;i++){
			if ( withinSensorRange(this.x,this.y, lineMap[i][0][0],lineMap[i][0][1],lineMap[i][1][0],lineMap[i][1][1]) ){
				tempLineMap[tempLineMap.length] = $.extend(true, [], lineMap[i]);
			}
		}
		
		let tempCheckpointMap = [];		// Stores all lines that are within(inclusive) sensorLength
		let tempCheckpointMapIndex = [];		// Stores tempCheckpointMap elements their respective checkpointMap indexs
		if (touchCheckpointTimer === 0){
			// Optimisation 
			let checkpointMapLength = checkpointMap.length;
			for (let i=0;i<checkpointMapLength;i++){
				let checkpointMapI = checkpointMap[i];
				if ( withinSensorRange(this.x,this.y, checkpointMapI[0][0],checkpointMapI[0][1],checkpointMapI[1][0],checkpointMapI[1][1]) ){
					tempCheckpointMap[tempCheckpointMap.length] = $.extend(true, [], checkpointMap[i]);
					tempCheckpointMapIndex[tempCheckpointMapIndex.length] = i;
				}
			}
		}

		for (let i=0;i<5;i++){
			// Update Sensor Positions (end positions)
			let senDir = this.dir+mPI4*(i-2);
			let senIX = this.x+Math.cos(senDir)*sensorLength;
			let senIY = this.y+Math.sin(senDir)*sensorLength;

			// Draw Sensor
			c.beginPath();
			c.strokeStyle = "rgba(200,0,0,1)";
			c.lineWidth = 0.4;
			c.moveTo(this.x,this.y);
			c.lineTo(senIX,senIY);
			c.stroke();

			// Calculate closest distance and asign to this.sensors
			let closestDistance = sensorLength;
			let closestInfo;
			let tempLineMapLength = tempLineMap.length;

			for (let j=0;j<tempLineMapLength;j++){
				let tempLineMapJ = tempLineMap[j];
				let info = lineLine(this.x,this.y,senIX,senIY, tempLineMapJ[0][0],tempLineMapJ[0][1],tempLineMapJ[1][0],tempLineMapJ[1][1]);			//line_intersect(temp,lineMap[j]);
				// if (drawingMap === false){
				// 	console.log('tempLineMap[j]',tempLineMap[j]);
				// 	console.log('info:',info);
				// }
				//console.log('info:',info);
				if (info.collision === true){
					let distance = getDistance(this.x,this.y,info.x,info.y);
					if (distance<closestDistance){
						closestDistance = distance;
						closestInfo = info;
					}
				}
			}

			// Checkpoint stuff
			if (touchCheckpointTimer === 0){
				let tempCheckpointMapLength = tempCheckpointMap.length;

				for (let j=0;j<tempCheckpointMapLength;j++){
					let tempCheckpointMapJ = tempCheckpointMap[j];
					let info = lineLine(this.x,this.y,senIX,senIY, tempCheckpointMapJ[0][0],tempCheckpointMapJ[0][1],tempCheckpointMapJ[1][0],tempCheckpointMapJ[1][1]);			//line_intersect(temp,lineMap[j]);
					
					if (info.collision === true){
						let distance = getDistance(this.x,this.y,info.x,info.y);
						if (distance <= blobRadius){

							// Checking if the checkpoint reached is better (a.k.a has higher fitness)
							if (tempCheckpointMapIndex[j] > this.checkpointsReached){
								timeWithoutCheckpoint = 0;
							}

							this.checkpointsReached = tempCheckpointMapIndex[j];

							console.log('this.checkpointsReached',this.checkpointsReached);
							touchCheckpointTimer = 20;		//12 is quite safe

							if (this.checkpointsReached > highestCheckpointReached){
								highestCheckpointReached = this.checkpointsReached;
								numOfGenStuckOnCheckpoint = 0;
								if (highestCheckpointReached > highestCheckpointReached2){
									highestCheckpointReached2 = highestCheckpointReached;
									numOfGenStuckOnCheckpoint2 = 0;
								}
							}
							break;		// Cus if hit no need to sense others (assuming that blob can't hit two at same time)
						}
					}
				}
			}


			if (closestInfo){
				// Draw sensor collision with wall
			    c.beginPath();
			   	c.strokeStyle = "rgba(0,255,0,1)";
				c.lineWidth = 3;
			    c.arc(closestInfo.x,closestInfo.y, 5, 0, eAngle);
			    c.stroke();
			}
			// Blob to wall Collision Dectection
			if (closestDistance <= blobRadius){
				this.alive = false;
			}
			this.sensors[i] = [closestDistance];//sensorLength];		// Feed into NN
		}
		if (!this.alive){
			numOfDead++;
		}
		//console.log(this.sensors);

		//console.log(this.sensors);
	}

	this.forwardPropagation = function(){
		let z0 = mDot(this.syn0,this.sensors);
		
		let l1 = mSigmoid(z0);
		
		let z1 = mDot(this.syn1,l1);
		
		let l2 = mSigmoid(z1);
		// console.log('this.syn0,',this.syn0);
		// console.log('this.sensors,',this.sensors);
		// console.log('z0,',z0);
		// console.log('this.syn1',this.syn1);
		// console.log('l1',l1);
		// console.log('z1',z1);
		// console.log('l2',l2);
		// console.log('this.sensors',this.sensors);

		// console.log('l2',l2);
		// console.log('l2[0]',l2[0][0]);
		// console.log('l2[0][0]',l2[0][0]-0.5)
		return l2[0][0]-0.5;
	}
}



// var temp2 = [];
// temp2[0] = [120, 50];
// temp2[1] = [120, -50];

// var temp3 = [];
// temp3[0] = [11003, 526];
// temp3[1] = [0, 563];
// console.log();
// console.log('asdasdasdasadsasdasasdasasddasdasdasd');
// let info = lineLine(temp2,temp3);
// console.log(info)
// if (info.collision){

// }

function copyText(array){
	document.getElementById("whereToPrint").innerHTML = JSON.stringify(array, null, 4);
}


// Genetic Algorithm Functions:

function getFitness(blob){
	return blob.checkpointsReached;
}

function crossover(){

}

// Assuming that there are not multiple indexies with equal values
function bubblesort(array2){
	let array = array2;
	let numOfMoved = -1;
	let tries = 0

	while(numOfMoved!==0 && tries<100){
		numOfMoved = 0;
		tries++;

		let highestValueGroup = array[0];
		let highestValueIndex = 0;

		for (i=1;i<array.length;i++){
			if (highestValueGroup[0]>array[i][0]){
				array.splice(i+1,0,highestValueGroup);		// Create a duplicate next to next highest num
				array.splice(highestValueIndex,1);	// Delete duplicate's original

				highestValueGroup = array[i];
				highestValueIndex = i;
				numOfMoved++;
			}else{	// Assuming that there's no equal values
				highestValueGroup = array[i];
				highestValueIndex = i;
			}
		}
	}
	// console.log('# of tries, max # of tries',tries,100);
	return array;
}





//##################################
// 			 EVENT LISTENERS
//##################################

document.addEventListener('mousedown',function(event){
	tempLine[0] = [event.x,event.y];
	mouseDown = true;
	// bubblesort2(ttarray);
});

document.addEventListener('mousemove',function(event){
	if (mouseDown){
		tempLine[1] = [event.x,event.y];
	}
});


document.addEventListener('mouseup',function(event){
	mouseDown = false;

	if (drawingMap === true){
		if (event.x <= fWidth){
			if (event.y <= fHeight){
				if (getDistance(tempLine[0][0],tempLine[0][1],event.x,event.y)>=3){
					tempLine[1] = [event.x,event.y];
					lineMap[lineMap.length] = $.extend(true, [], tempLine);
				}
			}
		}
	}
	if (drawingCheckpoints === true){
		if (event.x <= fWidth){
			if (event.y <= fHeight){
				if (getDistance(tempLine[0][0],tempLine[0][1],event.x,event.y)>=3){
					tempLine[1] = [event.x,event.y];
					checkpointMap[checkpointMap.length] = $.extend(true, [], tempLine);
				}
			}
		}
	}

	tempLine.splice(1,1);
});
document.addEventListener('keyup',function(event){
	if (event.key === 'q'){
		console.log('lineMap:',lineMap);
	}
	if (event.key === 'e'){
		copyText(lineMap);
	}

	// To make map
	if (event.key === 'p'){
		if (drawingMap === true){
			drawingMap = false;
		}else{
			drawingMap = true;
		}
		console.log('drawingMap:',drawingMap);
	}
	// To delete last map element
	if (event.key === 'i'){
		lineMap.splice(lineMap.length-1,1);
	}

	// To make map checkpoints
	if (event.key === 'l'){
		if (drawingCheckpoints === true){
			drawingCheckpoints = false;
		}else{
			drawingCheckpoints = true;
		}
		console.log('drawingCheckpoints:',drawingCheckpoints);
	}
	// To delete last checkpointMap element
	if (event.key === 'j'){
		checkpointMap.splice(checkpointMap.length-1,1);
	}
	if (event.key === 'h'){
		copyText(checkpointMap);
	}


	if (event.key === 'm'){
		console.log(blobArray[0].x);
	}

	// console.log(event.key)
});


//##################################
// 			   MAIN CODE
//##################################


// for (i=0;i<lineArray.length;i++){
// 	drawLine(lineArray[i]);
// }


var ran = 0

function tick(){
	c.clearRect(0,0,fWidth,fHeight);

	let blobArrayLength = blobArray.length;
	for (i=0;i<blobArrayLength;i++){
		blobArray[i].update();
	}

	let lineMapLength = lineMap.length;
	for (i=0;i<lineMap.length;i++){
		drawLine(lineMap[i],0);
	}


	let checkpointMapLength = checkpointMap.length;
	for (i=0;i<checkpointMap.length;i++){
		drawLine(checkpointMap[i],1);
	}

	// Draw Preview Lines
	if (mouseDown && typeof tempLine[1]!='undefined'){
		if ( getDistance(tempLine[0][0],tempLine[0][1],tempLine[1][0],tempLine[1][1])<=sensorLength && getDistance(tempLine[0][0],tempLine[0][1],tempLine[1][0],tempLine[1][1])>=3){
			c.strokeStyle = "rgba(100,255,0,1)";
		}else{
			c.strokeStyle = "rgba(255,100,0,1)";
		}
		c.lineWidth = 3;
		c.beginPath();
		c.moveTo(tempLine[0][0],tempLine[0][1]);
		c.lineTo(tempLine[1][0],tempLine[1][1]);
		c.stroke();	

	}

	
	// Check 		//blobArray
	if (numOfDead >= populationSize && ran === 0){
			populationSize = newPopulationSize;

		ran = 1;

		// Finding the fitness(checkpointsReached) and its frequency. Also assigning index of blobArray to its respective fitness.
		let populationFitness = [];
		for (i=0;i<blobArrayLength;i++){
			let blobICheckpoints = blobArray[i].checkpointsReached;
			let match = false;		// True if populationFitness[j][0] === blobICheckpoints
			let j;

			for (j=0;j<populationFitness.length;j++){
				if (populationFitness[j][0] === blobICheckpoints){
					match = true;
					break;
				}		
			}

			if (match === true){
				populationFitness[j][1]++;
				populationFitness[j][2][populationFitness[j][2].length] = i;
			}else{
				populationFitness[populationFitness.length] = [blobICheckpoints,1,[i]];
			}
		}
		// console.log('populationFitness');
		// console.table(populationFitness);


		// Organising Groups (using bubblesort)
		// console.log(bubblesort(populationFitness));
		bubblesort(populationFitness);


		// Finding the fitness(checkpointsReached) of the lowest top (25)% group of the population
		var numOfBlobsCounted = 0;
		var localFitnessTotal = 0;

		for (i=populationFitness.length-1;i>-1;i--){
			// console.log('FOR i',i)
			numOfBlobsCounted+=populationFitness[i][1];
			localFitnessTotal+=populationFitness[i][0];
			if (numOfBlobsCounted>=populationSize*(100/100)){
				break;
			}
		}


		// console.log('numOfBlobsCounted',numOfBlobsCounted)
		// console.log('i',i)

		// Creating new population

		// Assuming that (highestCheckpointReached !== checkpointMap.length-1), so that checkpointMap.length>0
		var newBlobArray = [];
		if (numOfGenStuckOnCheckpoint >= 5 && highestCheckpointReached !== checkpointMap.length-1){
			if (numOfGenStuckOnCheckpoint2 >= 5){
				for (i=0;i<populationSize*(90/100);i++){
					newBlobArray[newBlobArray.length] = new newBlob(120, 50, 0, mRan(5,5,-0.1,0.1), mRan(1,5,-0.1,0.1));
					console.log('ALMOST COMPLETELY NEW GENETICS',i);
				}
				numOfGenStuckOnCheckpoint2 = 0;
			}else{
				for (i=0;i<populationSize*(10/100)*(numOfGenStuckOnCheckpoint2+1);i++){	// NEW CODE
					newBlobArray[newBlobArray.length] = new newBlob(120, 50, 0, mRan(5,5,-0.1,0.1), mRan(1,5,-0.1,0.1));
					console.log('Added new genetics. i,',i);
				}
				numOfGenStuckOnCheckpoint2++;
			}
			numOfGenStuckOnCheckpoint = -1;		// Cus at end of create population numOfGenStuckOnCheckpoint is increased by one
			highestCheckpointReached = 0;
		}
		for (i=newBlobArray.length;i<populationSize;i++){
			console.log('Breeding Parents');
			// Function
			function selectFitnessIndex(){
				let ran = Math.floor(Math.random()*(localFitnessTotal+1));
				let fitnessSum = 0;
				let j;

				for (j=populationFitness.length-1;j>-1;j--){
					fitnessSum += populationFitness[j][0];
					if (ran <= fitnessSum){
						break;
					}
				}

				return j;
			}
			// console.log('selectFitnessIndex',selectFitnessIndex());

			// Selecting parents (by index)
			let randomIndexRel = selectFitnessIndex();
			let randomIndexRel2 = selectFitnessIndex();

			let randomParentOne = Math.floor(Math.random()*populationFitness[randomIndexRel][2].length);
			let randomParentTwo = Math.floor(Math.random()*populationFitness[randomIndexRel2][2].length);

			let parentOne = blobArray[populationFitness[randomIndexRel][2][randomParentOne]];
			let parentTwo = blobArray[populationFitness[randomIndexRel2][2][randomParentTwo]];

			// Crossover
			let parentOneSynapse = {
				syn0: parentOne.syn0,
				syn1: parentOne.syn1
			}
			let parentTwoSynapse = {
				syn0: parentTwo.syn0,
				syn1: parentTwo.syn1
			}
			let childSynapse = {}
			if (highestCheckpointReached !== checkpointMap.length-1){
				// Cus we don't want to increase mutation if they're doing the right thing
				childSynapse.syn0 = m2Cross(parentOneSynapse.syn0, parentTwoSynapse.syn0, 0.05, 0.1*(numOfGenStuckOnCheckpoint+1)),
				childSynapse.syn1 = m2Cross(parentOneSynapse.syn1, parentTwoSynapse.syn1, 0.05, 0.1*(numOfGenStuckOnCheckpoint+1))
			}else{
				childSynapse.syn0 = m2Cross(parentOneSynapse.syn0, parentTwoSynapse.syn0, 0.05, 0.1),
				childSynapse.syn1 = m2Cross(parentOneSynapse.syn1, parentTwoSynapse.syn1, 0.05, 0.1)
			}		
			

			// Create newBlob
			newBlobArray[newBlobArray.length] = new newBlob(120, 50, 0, childSynapse.syn0,childSynapse.syn1);

			//ran = 0;
		}
		blobArray.length = 0;
		numOfDead = 0;
		ran = 0;
		blobArray = $.extend(true, [], newBlobArray);

		//blobArray.length = 0

		numOfGenStuckOnCheckpoint++;
		numberOfGenerations++;
	    numOfGenDisplay.innerHTML = numberOfGenerations;
	}


	requestAnimationFrame(tick);
}
function init(){
	for (i=0;i<populationSize;i++){
		blobArray[blobArray.length] = new newBlob(120, 50, 0, mRan(5,5,-0.1,0.1), mRan(1,5,-0.1,0.1));
	}

	tick();
}
init();



// #####################################
// 			window.onload	FUNCTIONS
// #####################################
function killAll(){
	numOfDead = populationSize;
}

function updatePop(){
	var setPopulationSizeTextfield = document.getElementById("setPopulationSizeTextfield").value;

	if (setPopulationSizeTextfield<1){
		setPopulationSizeTextfield = 1;
	}else{
		newPopulationSize = setPopulationSizeTextfield;
	}
}

window.onload = function() {
    var killAllButton = document.getElementById("killAllButton");
    killAllButton.onclick = killAll;

	var numOfGenDisplay = document.getElementById("numOfGenDisplay");
	numOfGenDisplay.innerHTML = numberOfGenerations;

	var setPopulationSizeButton = document.getElementById("setPopulationSizeButton");
	setPopulationSizeButton.onclick = updatePop;
}



// #####################################
// 			MATHY	FUNCTIONS
// #####################################


// mRan (matrix random)
// Description: Creates specified matrix, all values will be between certain range
// Note: Exclusive of max value
function mRan(numOfRows,numOfColumns, minNum, maxNum){
	var tempM = [];
	//console.log('numOfColumns',numOfColumns);
	for (let i=0;i<numOfRows;i++){
		tempM[i] = [];
		for (let j=0;j<numOfColumns;j++){
			tempM[i][j] = Math.random()*(maxNum-minNum)+minNum;
		}
	}

	return $.extend(true, [], tempM);//tempM;
}

// mDot (matrix dot)
// Note: second matrix must only have ONE column 
// Note: 1st Matrix #ofColumns must === 2nd Matrix #ofRows 
function mDot(m1,m2){

	if (m1[0].length === m2.length){
		var tempM = [];
	
		for (let i=0; i<m1.length; i++){
			tempM[i] = [];
			var sum=0;
			for (let j=0; j<m1[0].length; j++){
				sum += m1[i][j] * m2[j][0];
				// console.log('i:',i,'j:',j);
			}
			tempM[i][0] = sum;
			// console.log(sum);
		}
	
		return $.extend(true, [], tempM);//tempM;
	}else{
		console.log('### ERROR ### - m1 colum /= m2 rows');
	}
}



// mAdd
// Description: Adds a certain amount from all values in matrix
function mAdd(m1, value){
	var tempM = [];

	for (let i=0;i<m1.length;i++){
		tempM[i] = []; 
		for (let j=0;j<m1[0].length;j++){
			tempM[i][j] = m1[i][j] + value;
		}
	}
	return $.extend(true, [], tempM);//tempM;
}


function mSigmoid(m1){
	var tempM = [];

	for (let i=0;i<m1.length;i++){
		tempM[i] = []; 
		for (let j=0;j<m1[0].length;j++){
			tempM[i][j] = 1/(1+Math.exp(-m1[i][j]));		//BRACKETS AROUND '(1+Math.exp(-m1[i][j]))' is important
		}
	}
	return $.extend(true, [], tempM);//tempM;
}









// m2Cross
// Description: Does 50% crossover  and mutation
function m2Cross(p1, p2, mChance, mMaxAmount){
	var tempM = [];

	for (let i=0;i<p1.length;i++){
		tempM[i] = []; 
		for (let j=0;j<p1[0].length;j++){
			if (Math.random()<0.5){
				tempM[i][j] = p1[i][j];
			}else{
				tempM[i][j] = p2[i][j];
			}
			if (Math.random()<mChance){
				tempM[i][j] += Math.random()*2*mMaxAmount-mMaxAmount;
			}
		}
	}
	return $.extend(true, [], tempM);//tempM;
}