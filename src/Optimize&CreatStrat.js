

function bonusPlanetInfo(){
  const loc = [[3,2],[4,3]] //Path and zone of Zeffo and Mandalore
  const unlock = [[2,1],[1,2]] // Path and zone of the planet unlocking the bonus planet
  const label = ["LB3","MB4"]
  return [loc,unlock,label]
}

function genStrats(minMaxArray,minMaxBonus){
  var strats = []

  // For each path create a binary representation of the strat. Each bit is a phase. 0 means preload and 1 means push. The first phase is the last bit
  // Bonus planet are added after the last bit as a "-ZM" where Z is the number of phases in Zeffo and M the number of phases in Mandalor
  for(var path=0;path<3;path++){
    strats.push([])
    let strat = [""]
    // Add all 6 zones
    for(var zone=0;zone<6;zone++){
      let zoneStrat = []
      //ignore zone
      if(minMaxArray[3*zone+path][0]==0){zoneStrat.push("")}
      //Add all the other options
      for(var minP=Math.max(1,minMaxArray[3*zone+path][0]);minP<=minMaxArray[3*zone+path][1];minP++){
        zoneStrat.push("1" + "0".repeat(minP-1))
      }
      strat = concatenateStrat(strat, zoneStrat,-1,zone)
    }
    // Add bonus zones
    for(var zone=0;zone<6;zone++){
      let zoneStrat = []
      //ignore zone
      if(minMaxBonus[3*zone+path][0]==0){zoneStrat.push("")}
      //Add all the other options
      for(var minP=Math.max(1,minMaxBonus[3*zone+path][0]);minP<=minMaxBonus[3*zone+path][1];minP++){
        zoneStrat.push("-" + minP.toString())
      }
      strat = concatenateStrat(strat, zoneStrat,zone,zone)
    }

    //Check if a strat is valid
    for(var n=strat.length-1;n>=0;n--){
      if(strat[n][0]=="1" && strat[n].split("-")[0].length == 6){
        strat[n] = parseInt(strat[n].slice(1,6),2).toString() + strat[n].slice(6)
      } else{
        strat.splice(n,1)
      }
    }
    // Add all the strat for a path    
    strats[path]= strat
  }
  var totalstrats = []
  for(var i=0;i<strats[0].length;i++){
    for(var j=0;j<strats[1].length;j++){
      for(var k=0;k<strats[2].length;k++){
        let id = parseInt(strats[0][i].split("-")[0])+2**5*parseInt(strats[1][j].split("-")[0])+2**10*parseInt(strats[2][k].split("-")[0])
        if(strats[2][k].split("-").length>1 || strats[1][j].split("-").length>1 || strats[0][i].split("-").length>1){
          let zeffo = "0"
          if(strats[2][k].split("-")[1]){zeffo = strats[2][k].split("-")[1]}
          id = id.toString().concat("-",zeffo)
          //Mandalore
          if(strats[1][j].split("-")[1]){id = id.concat(strats[1][j].split("-")[1])}
          totalstrats.push(id)
        } else{
          totalstrats.push(id.toString())
        } 
      }
    }
  }
  return totalstrats
}

function concatenateStrat(prevZones, newZone,bonus,zone) {
  //bonus = -1 if not a bonus zone
  let concatenated = [];
  for (let i = 0; i < prevZones.length; i++) {
    for (let j = 0; j < newZone.length; j++) {
    
      if(bonus == -1 || newZone[j]==""){
        let concatString = newZone[j] + prevZones[i]
        if (concatString.split("-")[0].length <= 6 && concatString.split("-")[0].length>=zone+1 && 
            (newZone[j]!="" || prevZones[i].split("-")[0].length==6)) {
          concatenated.push(concatString);
        }
      } else{
        let concatString = prevZones[i] + newZone[j] 
        let phasesPrev = 0
        let count = 0
        for(let k = prevZones[i].length-1;k>=0;k--){
          phasesPrev ++
          if(prevZones[i][k]=="1"){count ++}
          if(count==bonus){break}
        }
        if(count==bonus && phasesPrev+parseInt(newZone[j][newZone[j].length-1])<=6){
          concatenated.push(concatString);
        }
      }
    }
  }
  return concatenated;
}

function countStrats(minMaxArray,minMaxBonus){
  return genStrats(minMaxArray,minMaxBonus).length
}

function idStrat(phaseArray,bonusArray){
  var id = 0
  for(var path=0;path<3;path++){
    let strat = ""
    for(var phase=0;phase<=5;phase++){
      if(phaseArray[phase*3+path]>0){
        strat = "1".concat("0".repeat(Math.max(0,phaseArray[phase*3+path]-1)),strat)
      }
    }
    let n = strat.length
    id += parseInt(strat.substring(n-5,n),2)*2**(5*path)
  }
  id = id.toString()
  let zeffo = bonusArray[0]
  let mandalore = bonusArray[1]
  if(zeffo+mandalore>0){
    id = id.concat("-",zeffo.toString())
    if(mandalore>0){
      id = id.concat(mandalore.toString())
    }
  }
  return id
}

function strat2PreDaysArray(strat) {
  // From a strat id (ex: 3405-2) create an array with the rows representing paths and bonus planets and column representing phases (0-5). Each elements counts the number of days until a planet is pushed. For bonus planet when they are not open, fill it with "x"

  // Split the strat by "-"
  const parts = strat.split("-");

  // Extract the first part and convert it to a 15-bit binary string
  let binaryString = (+parts[0]).toString(2).padStart(15, '0');

  // Reverse the binary string because phase 0 is on the last bit currently
  binaryString = binaryString.split('').reverse().join('');

  // Split the reversed binary string into 3 segments of 5 bits representing each path and the 5 first phases. 0 means preload, 1 push
  const preDaysArray = [];
  for (let i = 0; i < 3; i++) {
    preDaysArray.push(binaryString.substr(i * 5, 5));
  }

  // Add a '1' to the right of each segment (phase 6 is always pushed)
  preDaysArray.forEach((segment, index, array) => {
    array[index] = segment + '1';
  });

  // Calculate the distances to the nearest '1' to the right (Count preload phases)
  preDaysArray.forEach((segment, index, array) => {
    array[index] = segment.split('').map((bit, i, segmentArray) => {
      if (bit === '1') {
        return 0;
      }
      let distance = 1;
      for (let j = i + 1; j < segmentArray.length; j++) {
        if (segmentArray[j] === '1') {
          break;
        }
        distance++;
      }
      return distance;
    });
  });

  // Process Bonus planets if they exists in the strategy
  if (parts[1]) {
    bonusPreDaysArray(parts[1],preDaysArray);
  }

  return preDaysArray;
}

function bonusPreDaysArray(bonusStrat,preDaysArray){
  //Update preDaysArray to include bonus planets

  let [_loc,bonusInfo,_label] = bonusPlanetInfo() // Array of path and zone of the planet that unlocks the bonus planet
  let bonusPhases = bonusStrat.split("")
  

  for(let i=0;i<bonusPhases.length;i++){
    let bonusPartArray = []
    // Calculate the number of phases the bonus planet is closed
    let phaseCount = 0;
    let pushCount = 0;
    for (let bit of preDaysArray[bonusInfo[i][0]]) {
      phaseCount ++
      if (bit == 0) {
        pushCount++;
        if (pushCount == bonusInfo[i][1]+1) {
          break;
        }
      }
    }

    // Add "x" characters to phases when bonus planet is not open
    while (bonusPartArray.length < phaseCount) {
      bonusPartArray.push('x');
    }

    // Process the number of days a bonus planet is open
    let bonusP = parseInt(bonusPhases[i])
    while (bonusP > 0) {
      bonusPartArray.push(bonusP - 1);
      bonusP--;
    }

    // Ensure the array is 6 phases long
    while (bonusPartArray.length < 6) {
      bonusPartArray.push('x');
    }
    preDaysArray.push(bonusPartArray)
  }

}

function getZonesArr(preDaysArray){
  //Obtain a 2d array of which zones are open on each path
  const [loc,_unlock,_label] = bonusPlanetInfo()
  let zonesArr = []

  for(let path=0;path<preDaysArray.length;path++){
    //Main planets start on 0 and bonus planets are not open on the first phase
    let zone = 0
    if(path>=3){zone = "x"}
    
    zonesArr.push([])
    for(let phase=0;phase<preDaysArray[0].length;phase++){
      zonesArr[path].push(zone)
      if (path<3 && preDaysArray[path][phase]==0){zone++}
      else if(path>=3 && preDaysArray[path][phase]!="x"){
        zone = loc[path-3][1]
        zonesArr[path][phase] = zone
      }
      else if(path>=3 && preDaysArray[path][phase]=="x"){
        zone = "x"
        zonesArr[path][phase] = zone
      }
    }
  }
  return zonesArr
}

function getLastPlanetArr(preDaysArray){
  //Return a 2d array of boolean value. True if it's one of last planet to be prioritized during a phase, false otherwise
  let lastPlanetArr = preDaysArray.map(row => row.map(ele => false))
  for(let phase=0;phase<preDaysArray[0].length;phase++){
    let maxDays = 0
    let lastPath = []
    //Search the last priority path for this phase (last priority = highest number in preDaysArr)
    for(let path=0;path<preDaysArray.length;path++){
      if(preDaysArray[path][phase]!="x"){
        if(preDaysArray[path][phase]>maxDays){
          maxDays = preDaysArray[path][phase]
          lastPath = [path]
        } else if(preDaysArray[path][phase]==maxDays){
          lastPath.push(path)
        }
      }
    }

    //Update lastPlanetArr
    for(let path of lastPath){
      lastPlanetArr[path][phase] = true
    }
  }
  return lastPlanetArr
}

function pDArray2queue3(pDArray,zonesArr) {
  // Queue of optimaztion it's an array in which order to do the optimization. The queue element (an operation) is of the form 
  // [phase,[path1,zone1,preDays1],...] for push optimization 

  const queue = [];

  for (let phase =0;phase < pDArray[0].length;phase++) {

    // Find paths with '0' in the current phase (push phase)
    const pathsWithZero = [];
    for (let path = 0; path < pDArray.length; path++) {
      if (pDArray[path][phase] === 0) {
        pathsWithZero.push(path);
      }
    }

    //A planet is pushed this phase
    if(pathsWithZero.length>0){
      //Build operation 
      let operation = [phase]
      for(let path of pathsWithZero) {
        
        //Count Preload days
        let preDays = 0
        for (var p = phase - 1; p >= 0; p--) {
          if(pDArray[path][p]!=0 && pDArray[path][p]!="x"){preDays ++}
          else{break}
        }

        //Update operation
        operation.push([path,zonesArr[path][phase],preDays])
      }
      //Push operation to queue
      queue.push(operation)
    }
  }

  return queue;
}

function rawData2PlanetInfo(rawdata,charaGP){
  let data = []
  //Platoons evaluator
  function platoonVal(zone){
    let value = 0
    switch(zone){
      case 0: value = 10; break;
      case 1: value = 11; break;
      case 2: value = 13.2; break;
      case 3: value = 18.48; break;
      case 4: value = 33.264; break;
      case 5: value = 86.4864; break;
    }
    return value
  }

  //Main planets
  for(var path=0;path<3;path++){
    data.push([])
    for(var zone=0;zone<6;zone++){
      data[path].push([])
      data[path][zone] = { 
        star1: rawdata[3*zone+path][0],
        star2: rawdata[3*zone+path][1],
        star3: rawdata[3*zone+path][2],
        maxPre: rawdata[3*zone+path][3],
        combat: rawdata[3*zone+path][4],
        deployC: rawdata[3*zone+path][5],
        platoon1: rawdata[3*zone+path][6]*platoonVal(zone),
        platoon2: rawdata[3*zone+path][7]*platoonVal(zone),
        platoon3: rawdata[3*zone+path][8]*platoonVal(zone),
        deployP1: rawdata[3*zone+path][6]*15*charaGP,
        deployP2: rawdata[3*zone+path][7]*15*charaGP,
        deployP3: rawdata[3*zone+path][8]*15*charaGP,
        asap: rawdata[3*zone+path][9],
        path: path
      }
    }
  }

  //Bonus planets (Zeffo and Mandalore)
  let bonusRow = 19
  let [bonusLoc,_unlock,_label] = bonusPlanetInfo()
  for(var i=0;i<bonusLoc.length;i++){
    let bonusPath = bonusLoc[i][0]
    let bonusZone = bonusLoc[i][1]
    data.push(new Array(bonusZone+1))
    data[bonusPath][bonusZone] = {
      star1: rawdata[bonusRow][0],
      star2: rawdata[bonusRow][1],
      star3: rawdata[bonusRow][2],
      maxPre: rawdata[bonusRow][3],
      combat: rawdata[bonusRow][4],
      deployC: rawdata[bonusRow][5],
      platoon1: rawdata[bonusRow][6]*platoonVal(bonusZone),
      platoon2: rawdata[bonusRow][7]*platoonVal(bonusZone),
      platoon3: rawdata[bonusRow][8]*platoonVal(bonusZone),
      deployP1: rawdata[bonusRow][6]*15*charaGP,
      deployP2: rawdata[bonusRow][7]*15*charaGP,
      deployP3: rawdata[bonusRow][8]*15*charaGP,
      asap: rawdata[bonusRow][9],
      path: bonusPath
    }
    bonusRow++
  }
  return data
}

function getPlatoonInfo(planetInfo,preDays){
  //Get platoon number depending on the number of preloaded phases
  let platoon = 0
  let deployP = 0
  switch(preDays){
    case 0: 
      platoon = planetInfo.platoon1
      deployP = planetInfo.deployP1
      break
    case 1:
      platoon = planetInfo.platoon2
      deployP = planetInfo.deployP2
      break
    default:
      platoon = planetInfo.platoon3
      deployP = planetInfo.deployP3
      break
  }
  return [platoon,deployP]
}

function evalPlatoon(planetInfo,currPhase,maxPhase,maxP){
  let [platoon,deployP] = [0,0]
  if(planetInfo.asap){
    [platoon,deployP] = getPlatoonInfo(planetInfo,currPhase-1)
    if(currPhase>1){
      let [prevPlatoon,prevDeployP] = getPlatoonInfo(planetInfo,currPhase-2)
      platoon -= prevPlatoon
      deployP -= prevDeployP
      }
  } else{
    [platoon,deployP] = getPlatoonInfo(planetInfo,maxPhase-1)

    // Push Phase after preload
    if(maxPhase!=1 && currPhase==maxPhase){
      deployP = (15-maxP)/15*deployP
    
    //Preload Phase
    } else if(currPhase<maxPhase){
      platoon = 0

      //First Preload
      if(currPhase==1){
        deployP = maxP/15*deployP

      //Not first Preload
      } else{
        deployP = 0
      }
    }
  }
  return [platoon,deployP]
}

function iniScoreTable(maxPath){
  let scoreTable = [];
  for(var path=0;path<maxPath;path++){
    scoreTable.push([])
    for(var phase=0;phase<6;phase++){
      scoreTable[path].push([])
      scoreTable[path][phase] = {
        total: 0,
        deployM: 0,
        deployC: 0,
        deployP: 0,
        combat: 0,
        platoons: 0,
        zone: 0,
      }
    }
  }
  return scoreTable
}

function preFillScore(scoreTable,allPlanetInfo,gpArray,preDaysArray,maxP,zonesArr){
  //Update the scoreTable and gpArray by prefilling combat score and platoon. Used for Algo#1

  //Main planets
  for(let path=0;path<preDaysArray.length;path++){
    let maxPrePhase = 0
    let currPhase = 0
    for(let phase=0;phase<6;phase++){
      let zone = zonesArr[path][phase]
      scoreTable[path][phase].zone = zone

      //Ignore if planet is not open
      if(preDaysArray[path][phase]=="x"){continue}

      //Update maxPrePhase and currPhase
      if(preDaysArray[path][phase]+1>maxPrePhase){maxPrePhase = preDaysArray[path][phase]+1}
      currPhase++

      //Update score from last phase if planet is preloaded
      if(phase>0 && scoreTable[path][phase-1].zone==zone){scoreTable[path][phase].total += scoreTable[path][phase-1].total}

      //Input platoons
      let [platoon,deployP] = evalPlatoon(allPlanetInfo[path][zone],currPhase,maxPrePhase,maxP)
      scoreTable[path][phase].total += platoon + deployP
      scoreTable[path][phase].platoons = platoon
      scoreTable[path][phase].deployP = deployP
      gpArray[phase] -= deployP
        

      //Input combats
      scoreTable[path][phase].total += allPlanetInfo[path][zone].deployC + allPlanetInfo[path][zone].combat
      scoreTable[path][phase].combat += allPlanetInfo[path][zone].combat
      scoreTable[path][phase].deployC += allPlanetInfo[path][zone].deployC
      gpArray[phase] -= allPlanetInfo[path][zone].deployC

      //Reset maxPrePhase and currPhase
      if(preDaysArray[path][phase]==0){
        maxPrePhase = 0
        currPhase = 0
      }
      
    }
  }
}

function getPushTable(planetInfoArr,final){
  //For the specified planets combo, build up a table containing star count, TP needed for each and total TP.

  //Put all the thresholds in one Array
  let objectiveArray = []
  for(let path=0;path<planetInfoArr.length;path++){
    objectiveArray.push([planetInfoArr[path].star3,planetInfoArr[path].star2,planetInfoArr[path].star1])
    if(final){objectiveArray[path].push(0)} //Only single 0 star allowed on last phase
  }

  //Recursive function
  let pushTable = []
  function objectiveCombiner(path,thresholdsArray,sumStar,sumTP){
    if(path == planetInfoArr.length){
      pushTable.push([...thresholdsArray,sumStar,sumTP])
      return
    }
    for(let star=0;star<objectiveArray[path].length;star++){
      thresholdsArray.push(objectiveArray[path][star])
      objectiveCombiner(path+1,thresholdsArray,sumStar+(3-star),sumTP+objectiveArray[path][star])
      thresholdsArray.pop() //remove the latest
    }
  }
  objectiveCombiner(0,[],0,0)

  //sort by points in descending order and stars in ascending order
  const idsum = pushTable[0].length - 1
  pushTable.sort((a,b) => a[idsum] - b[idsum])
  pushTable.sort((a,b) => b[idsum-1] - a[idsum-1])

  //Add a 0 score to mid push
  if(!final){
    const zeroArr = new Array(planetInfoArr.length).fill(0)
    pushTable.push([...zeroArr,0,0])
  }

  return pushTable
}

function getRewards(phase,score,planetInfo,stars,extra){
  for(let path=0;path<score.length;path++){
    //Main planets
    if(planetInfo[path].path<3){
      stars += getStar(score[path][phase].total,planetInfo[path])

    //Bonus planets  
    } else{
      let [tempExtra,tempStar] = getBonusReward(score[path][phase].total,planetInfo[path],planetInfo[path].path)
      extra = consolidateExtraRewards(extra,tempExtra)
      stars += tempStar
    }
  }
  return [stars,extra]
}

function getStar(score,planetInfo){
  let star = 0
  if(score>=planetInfo.star3){
    star = 3
  } else if(score>=planetInfo.star2){
    star = 2
  } else if(score>=planetInfo.star1){
    star = 1
  }
  return star
}

function getBonusReward(score,planetInfo,path){
  let extra = ""
  let star = 0
  //Zeffo
  if(path==3){
    if(score>=planetInfo.star3){
      extra = "300 GET3 & 40 Kyros"
      star = 1
    } else if(score>=planetInfo.star2){
      extra = "300 GET3 & 40 Kyros"
    } else if(score>=planetInfo.star1){
      extra = "150 GET3 & 20 Kyros"
    }
  // Mandalore
  } else if(path==4){
    if(score>=planetInfo.star3){
      extra = "525 GET3 & 100 Kyros"
      star = 1
    } else if(score>=planetInfo.star2){
      extra = "525 GET3 & 100 Kyros"
    } else if(score>=planetInfo.star1){
      extra = "175 GET3 & 50 Kyros"
    }
  }
  return [extra,star]
}

function consolidateExtraRewards(extra,tempExtra){
  let items = [" GET3"," Kyros"]
  let consolExtra = ""
  for(var i=0;i<items.length;i++){
    let item = items[i]
    let qty = 0
    if(extra.split(item).length>1){
      let strQty = extra.split(item)[0].split(" ")
      qty += parseInt(strQty[strQty.length-1])
    }
    if(tempExtra.split(item).length>1){
      let strQty = tempExtra.split(item)[0].split(" ")
      qty += parseInt(strQty[strQty.length-1])
    }
    if(qty>0){
      consolExtra = consolExtra.concat(qty.toString(),item,", ")
    }
  }
  return consolExtra.slice(0, -2)
}

function optimizeAlgo1(strat,dailyGP,maxP,charaGP,rawPlanet){
  const allPlanetInfo = rawData2PlanetInfo(rawPlanet,charaGP)
  var gpArray = new Array(6).fill(dailyGP)

  //create the queue
  let preDaysArray = strat2PreDaysArray(strat)
  let zonesArr = getZonesArr(preDaysArray)
  let lastPlanetArr = getLastPlanetArr(preDaysArray)
  let queue = pDArray2queue3(preDaysArray,zonesArr)

  //Create the scoreTable and prePopulate it
  let scoreTable = iniScoreTable(preDaysArray.length)
  preFillScore(scoreTable,allPlanetInfo,gpArray,preDaysArray,maxP,zonesArr)

  //Initialize final answer
  let stars = 0
  let extra = ""
  let nextStarRates = Array(6).fill([1e9,1]) //Daily GP needed for a new star
  let lastPhaseStars = 0

  for(let i=0;i<queue.length;i++){
    let operation = queue[i]
    let phase = operation[0]

    //For the puhsed planet of this phase, get their scoreTable, their planet info and their number of preload days and the last planet boolean
    let [pathScoreArr,planetInfoArr,pDaysArr,lastArr] = projectPushedPlanets(operation,allPlanetInfo,scoreTable,lastPlanetArr)

    //Get star thresholds for the pushed planets
    let pushTable = getPushTable(planetInfoArr,phase==5) 

    //Optimize the stars
    let [failPath,phaseNextStarGP] = optiAlgo1(gpArray,pathScoreArr,planetInfoArr,pushTable,phase,pDaysArr,lastArr)

    //Check for failed path. If yes reset strategy
    if(failPath!=-1){

      //Mid phase cancel
      if(phase!=5){
        //TODO how much GP would it takes for this to work?
        return [0,0,1e9,Array(6).fill(dailyGP),iniScoreTable(preDaysArray.length)]

      // Last phase a planet has a score of 0 so we need to remove if from the strat  
      } else{
        let [fPath, _fZone, fPreDays] = operation[failPath+1]
        for(let p=phase;p>=phase-fPreDays;p--){
          preDaysArray[fPath][p] = "x"
        }
        //Reset variables
        zonesArr = getZonesArr(preDaysArray)
        lastPlanetArr = getLastPlanetArr(preDaysArray)
        queue = pDArray2queue3(preDaysArray,zonesArr)
        gpArray = Array(6).fill(dailyGP)
        stars = 0
        extra = ""
        nextStarRates = Array(6).fill([1e9,1])
        lastPhaseStars = phaseNextStarGP.pop()
        nextStarRates[5] = phaseNextStarGP

        //Create the scoreTable and prePopulate it
        scoreTable = iniScoreTable(preDaysArray.length)
        preFillScore(scoreTable,allPlanetInfo,gpArray,preDaysArray,maxP,zonesArr)
        

        //Restart optimization
        i=-1
        continue
      }
  
    //Add rewards
    } else{
      [stars,extra] = getRewards(phase,pathScoreArr,planetInfoArr,stars,extra)
      if(phase!=5 || lastPhaseStars<stars || nextStarRates[phase][0]>=phaseNextStarGP[0]){nextStarRates[phase] = phaseNextStarGP}
    }
  }

  //Next star GP
  let nextStarGP = dailyGPNeededPreloadAdapted(gpArray,nextStarRates,preDaysArray,scoreTable)

  return [stars,extra,nextStarGP,gpArray,scoreTable]
}

function projectPushedPlanets(operation,allPlanetInfo,scoreTable,lastPlanetArr){
  let pathScoreArr = [] //ScoreTable projected for the pushed planets
  let planetInfoArr = [] //Planet info of the pushed planets
  let pDaysArr = []  //Preload days for the planets pushed
  let lastArr = [] //lastPlanetArr projected for the pushed planets

  for(var i=1;i<operation.length;i++){
    let [path, zone, pDays] = operation[i]
    planetInfoArr.push(allPlanetInfo[path][zone])
    pathScoreArr.push(scoreTable[path])
    pDaysArr.push(pDays)
    lastArr.push(lastPlanetArr[path])
  }
  return [pathScoreArr,planetInfoArr,pDaysArr,lastArr]
}

function optiAlgo1(gpArray,pathScoreArr,planetInfoArr,pushTable,phase,pDaysArr,lastArr){
  //Initializing variables
  const maxPreDays = Math.max(...pDaysArr) //Max number of preload days
  let achievedStar = 0 //Max stars possible
  let leftoverGP = 0 //LeftoverGP at max stars
  let savedRemovedDC = pathScoreArr.map(row => row.map(ele => 0)) //saved removed deployC for best row of the pushTable
  let savedRemovedP = pathScoreArr.map(row => row.map(ele => false)) //saved removed deployP for best row of the pushTable
  let savedDeployM = pathScoreArr.map(row => row.map(ele => 0)) //Saved deployM
  let savedPushRow = new Array(pathScoreArr.length).fill(0) // Saved final score at the end of push phase
  let nextStarGP = new Array(pathScoreArr.length*3+1).fill([1e9,1]) // GP needed for next star

  //Get preScore, preDeployM (available) and pushCAndP for each planet
  let [preScore,preDeployM,pushCAndP] = getPreOptiScore(phase,gpArray,planetInfoArr,pathScoreArr,pDaysArr)

  //Run over all sorted star thresholds of the planets
  for(let pushRow of pushTable){
    //Stop searching if less star
    if(achievedStar>pushRow[planetInfoArr.length]){break}

    //Find the idealPreScore
    let idealPreScore = getIdealPre(pushRow,planetInfoArr,preScore,preDeployM,pushCAndP)

    //Calculate realPreScore, adapt combat if necessary and redistribute the saved GP
    let realPreScore = [...preScore]

    //Remove combats and platoons if necessary and update realPreScore accordingly
    let extraGP = new Array(pathScoreArr[0].length).fill(0) //GP recovered from not needed deployC. Saved per phase
    let removedDC = pathScoreArr.map(row => row.map(ele => 0)) //GP recovered from not needed deployC. Saved in a 2d array
    let removedP = pathScoreArr.map(row => row.map(ele => false)) //Boolean 2d array to record if platoons were cancelled
    removeDCAndDP(phase,realPreScore,idealPreScore,pathScoreArr,pDaysArr,extraGP,removedDC,removedP)

    //Calculate deployM GP in preload phases and update realPreScore
    let deployMArr = getPreDeployM(phase,maxPreDays,pDaysArr,planetInfoArr,pathScoreArr,pushRow,idealPreScore,realPreScore,gpArray,extraGP,removedDC,lastArr,pushCAndP) //GP deployed in preload. Saved in a 2d array

    //Remove combats single phase planet with higher combat and platoons than objective or remove both C and P from single phase planet with 0 score
    removePushDCAndDP(phase,pushCAndP,pushRow,pathScoreArr,extraGP,removedDC,removedP)

    //Calculate pushDeployM
    evalPushDeployM(phase,planetInfoArr,pushRow,realPreScore,pushCAndP,deployMArr,removedDC,removedP)
    let totPushDM = 0
    deployMArr.map(pushGP => totPushDM += pushGP[phase])

    //If possible save strat
    if(gpArray[phase]+extraGP[phase]>=totPushDM && gpArray[phase]+extraGP[phase]-totPushDM > leftoverGP){
      achievedStar = pushRow[planetInfoArr.length] 
      leftoverGP = gpArray[phase]+extraGP[phase]-totPushDM
      savedRemovedDC = [...removedDC] 
      savedRemovedP = [...removedP]
      savedDeployM = [...deployMArr]
      savedPushRow = [...pushRow]

    //If not possible how much GP is missing for next star
    } else if(pushRow[planetInfoArr.length]>achievedStar && !pushRow.includes(0)){
      dailyGPNeededForNextStar(phase,gpArray,pDaysArr,pathScoreArr,planetInfoArr,pushRow,realPreScore,pushCAndP,removedDC,extraGP,nextStarGP)
    }
  }

  //If one planet is at 0 star, abort
  if(savedPushRow.includes(0)){
    let failPath = findPathToAbort(pDaysArr,planetInfoArr,preScore,pushCAndP,leftoverGP,savedPushRow)
    nextStarGP[achievedStar+1].push(achievedStar)
    return [failPath,nextStarGP[achievedStar+1]]
  }

  //Update scoreTable
  updateScoreTable(phase,gpArray,pathScoreArr,pDaysArr,savedDeployM,savedRemovedDC,savedRemovedP,savedPushRow)

  //Max score
  if(achievedStar==pathScoreArr.length*3){
    return [-1,[1e9,1]]
  
  //Not Max score
  } else{
    return [-1,nextStarGP[achievedStar+1]]
  }
}

function getPreOptiScore(phase,gpArray,planetInfoArr,pathScoreArr,pDaysArr){
  let preScore = new Array(planetInfoArr.length).fill(0) // Current score in preload if any
  let pushCAndP = [] //Push combat and platoon (including deployC and deployP)
  let preDeployM = new Array(planetInfoArr.length).fill(0) //Available deployM GP in preload

  for(let path=0;path<planetInfoArr.length;path++){
    if(pDaysArr[path]>0){preScore[path]=pathScoreArr[path][phase-1].total}
    pushCAndP.push(pathScoreArr[path][phase].total - preScore[path])
    for(let p=phase-pDaysArr[path];p<phase;p++){
      preDeployM[path] += gpArray[p]
    }
  }
  return [preScore,preDeployM,pushCAndP]
}

function getIdealPre(pushRow,planetInfoArr,preScore,preDeployM,pushCAndP){
  let idealPreScore = []
  for(let path=0;path<planetInfoArr.length;path++){
    //Find idealPreScore between:
    // - max planet allows
    // - max you should get given the objective and the combats and platoons on push phase
    // - max you can get in preload
    idealPreScore.push(Math.min(planetInfoArr[path].maxPre,Math.max(0,pushRow[path]-pushCAndP[path]),preDeployM[path]+preScore[path]))
  }
  return idealPreScore
}

function removeDCAndDP(phase,currentScore,idealScore,pathScoreArr,pDaysArr,extraGP,removedDC,removedP){
  for(let path=0;path<pathScoreArr.length;path++){
    //Only remove combats if currentScore is bigger than the ideal one
    if(currentScore[path]>idealScore[path]){
      let startPhase = phase - 1
      
      //If idealScore is 0 then cancel everything
      if(idealScore[path]==0){
        startPhase = phase
        currentScore[path] = pathScoreArr[path][phase].total //cancel push and pre score 
      }
      
      //Remove Combats starting from the latest phase
      for(let p=startPhase;p>=phase-pDaysArr[path];p--){
        //Remove Platoon only if score is 0
        if(idealScore[path]==0 && pDaysArr[path]>0){
          //Get platoons details
          let platoons =  pathScoreArr[path][p].platoons
          let deployP = pathScoreArr[path][p].deployP

          //Remove it and save that info in removedP
          removedP[path][p] = true
          extraGP[p] += deployP
          currentScore[path] -= platoons + deployP
        }

        //Get combat details
        let combat = pathScoreArr[path][p].combat
        let deployC = pathScoreArr[path][p].deployC

        //Skip if deployC is zero
        if(deployC==0){continue}

        //Remove the appropriate combat and deployC to match current score and ideal score
        let ratio = Math.min(1,(currentScore[path]-idealScore[path])/(combat + deployC))
        removedDC[path][p] = deployC*ratio
        extraGP[p] += deployC*ratio
        currentScore[path] -= (combat + deployC)*ratio
      }
    }
  }
  //currentScore, extraGP, removedDC and removedP is updated
}

function getPreDeployM(phase,maxPreDays,pDaysArr,planetInfoArr,pathScoreArr,pushRow,idealPreScore,realPreScore,gpArray,extraGP,removedDC,lastArr,pushCAndP){
  let deployMArr = pathScoreArr.map(row => row.map(ele => 0)) //GP deployed in preload. Saved in a 2d array

  //Iterate over all preload phases
  for(let p=phase-maxPreDays;p<phase;p++){
    //Get how much total deployM GP is needed on this preload phase
    let preDMneeded = 0
    let preloadPath = [] //path that need preload this phase
    let prePath = [] //path that can preload this phase

    for (let path=0;path<planetInfoArr.length;path++){
      if(p + pDaysArr[path]>=phase){prePath.push(path)}
      if(realPreScore[path]<idealPreScore[path] && p + pDaysArr[path]>=phase){
        preloadPath.push(path)
        preDMneeded += idealPreScore[path]- realPreScore[path]
      }
    }

    //Distribute deployM GP for this preload phase  
    for (let path of preloadPath){
      let gpUsed = (idealPreScore[path]-realPreScore[path]) * Math.min(1,(gpArray[p]+extraGP[p])/preDMneeded)
      realPreScore[path] += gpUsed
      deployMArr[path][p] += gpUsed
    }

    
    //If it's the last planet, remove future combat (preload and push (conditions apply) to put more deployM)
    if(lastArr[prePath[0]][p] && preDMneeded<gpArray[p]+extraGP[p]){
      let removedC = removeFutureDC(p,phase,pushRow,prePath,planetInfoArr,pathScoreArr,gpArray,preDMneeded,deployMArr,extraGP,removedDC,realPreScore,pushCAndP,idealPreScore)

      //update ideal preScore if more GP is available
      if(removedC && p+1<phase){
        let preDeployM = new Array(realPreScore.length).fill(0)
        let updatedCAndP = [...pushCAndP]
        for(let path=0;path<realPreScore.length;path++){
          //recalculate preDeployM
          for(let pp=p+1;pp<phase;pp++){
            if(phase-pp<=pDaysArr[path]){
              preDeployM[path] += extraGP[pp] + gpArray[pp]
            }
          }

          //Update pushCAndP if necessary
          if(removedDC[path][phase]!=0){
            updatedCAndP[path] -= removedDC[path][phase] + pathScoreArr[path][phase].combat/pathScoreArr[path][phase].deployC*removedDC[path][phase]
          }
        }
        let newIdealPreScore = getIdealPre(pushRow,planetInfoArr,realPreScore,preDeployM,updatedCAndP)
        idealPreScore = [...newIdealPreScore]
      }
    }
  }
  return deployMArr
}

function removeFutureDC(currentPhase,phase,pushRow,preloadPath,planetInfoArr,pathScoreArr,gpArray,preDMneeded,deployMArr,extraGP,removedDC,realPreScore,pushCAndP,idealPreScore){
  let p = currentPhase //easier on copy-paste
  let removedC = false

  // Sort preload paths based on their combat ratio (worse first)
  preloadPath.sort((a, b) => {
      let ratioA = 0
      if(pathScoreArr[a][p+1].deployC!=0){ratioA = pathScoreArr[a][p+1].combat / pathScoreArr[a][p+1].deployC}
      let ratioB = 0
      if(pathScoreArr[b][p+1].deployC!=0){ratioB = pathScoreArr[b][p+1].combat / pathScoreArr[b][p+1].deployC}
      return ratioA - ratioB;
  })

  //Replace future combats by current deployM
  let gpUsed = 0
  for(let path of preloadPath){ 
    for(let pp=p+1;pp<=phase;pp++){
      //Stop after enough deployM
      if(preDMneeded + gpUsed >= gpArray[p] + extraGP[p]){return removedC}

      //Combat details
      let deployC = pathScoreArr[path][pp].deployC - removedDC[path][pp]
      let combat = 0
      if(deployC!=0){combat = pathScoreArr[path][pp].combat - removedDC[path][pp]*(planetInfoArr[path].combat/planetInfoArr[path].deployC)}
      

      //Preload phase
      if(pp!=phase && deployC!=0){
        let ratio = Math.min(1,(gpArray[p] + extraGP[p] - preDMneeded - gpUsed)/(combat + deployC))
        removedDC[path][pp] += deployC*ratio
        extraGP[pp] += deployC*ratio
        gpUsed += (combat+deployC)*ratio
        deployMArr[path][p] += (combat+deployC)*ratio
        removedC = true
      
      //Push phase
      } else{
        let pushOnlyP = pushCAndP[path] - combat - deployC
        let newIdealPreScore = getIdealPre([pushRow[path]],[planetInfoArr[path]],[realPreScore[path]],[gpArray[p] + extraGP[p] - preDMneeded - gpUsed],[pushOnlyP])
        if(newIdealPreScore[0] > idealPreScore[path] && deployC!=0){
          let ratio = Math.min(1,Math.min(gpArray[p] + extraGP[p] - preDMneeded - gpUsed,newIdealPreScore[0] - idealPreScore[path])/(combat + deployC))
          removedDC[path][pp] += deployC*ratio
          extraGP[pp] += deployC*ratio
          gpUsed += (combat+deployC)*ratio
          deployMArr[path][p] += (combat+deployC)*ratio
          realPreScore[path] += (combat+deployC)*ratio
          idealPreScore[path] += (combat+deployC)*ratio
        }
      }
    } 
  }
  return removedC
}

function removePushDCAndDP(phase,pushCAndP,pushRow,pathScoreArr,extraGP,removedDC,removedP){
  for(let path=0;path<pushCAndP.length;path++){
    //Single phase planet is 0
    if(pushRow[path]==0){
      removedDC[path][phase] += pathScoreArr[path][phase].deployC
      removedP[path][phase] = true
      extraGP[path][phase] += pathScoreArr[path][phase].deployC + pathScoreArr[path][phase].deployP
    
    //Single phase planet has a score higher with C and P than 1 star (typically)
    } else{
      let removeC = pathScoreArr[path][phase].combat/pathScoreArr[path][phase].deployC*removedDC[path][phase]
      let deployC = pathScoreArr[path][phase].deployC - removedDC[path][phase]
      if(pushRow[path]<pushCAndP[path]- removeC - removedDC[path][phase] && deployC!=0){
        let combat = pathScoreArr[path][phase].combat - removeC
        let ratio = Math.min(1,(pushCAndP[path]- removeC - removedDC[path][phase] - pushRow[path])/(combat+deployC))
        removedDC[path][phase] += deployC*ratio
        extraGP[phase] += deployC*ratio
      }
    }
  }
}

function evalPushDeployM(phase,planetInfoArr,pushRow,realPreScore,pushCAndP,deployMArr,removedDC,removedP){
  for(let path=0;path<realPreScore.length;path++){
    if(pushRow[path]!=0){
      //Update pushCAndP with removed platoons and combats
      let updatedCAndP = pushCAndP[path]
      if(removedP[path][phase]){updatedCAndP = 0}
      else if(removedDC[path][phase]!=0){
        updatedCAndP -= removedDC[path][phase] + removedDC[path][phase]*planetInfoArr[path].combat/planetInfoArr[path].deployC
      }
      deployMArr[path][phase] = pushRow[path]-realPreScore[path]-updatedCAndP
    }
  }
}

function dailyGPNeededForNextStar(phase,gpArray,pDaysArr,pathScoreArr,planetInfoArr,pushRow,realPreScore,pushCAndP,removedDC,extraGP,nextStarGP){
  //sort paths in order of preload days in ascending order
  let filterPaths = pDaysArr.map((pDays,path) => [pDays,path]) 
  filterPaths = filterPaths.sort((a,b)=> a[0] - b[0]).map(pair => pair[1])

  //Get unconstrained by preload GP idealPreScore
  let fakePreGP = pDaysArr.map(pDays => pDays*1e9)
  let unconstrained = getIdealPre(pushRow,planetInfoArr,realPreScore,fakePreGP,pushCAndP)
  
  let totGPNeeded = 0
  let totRate = 0
  let phaseNeeded = 0
  let totPushGPNeeded = 0
  for(let path of filterPaths){
    //Update push combats and platoons
    let updatedCAndP = pushCAndP[path]
    if(removedDC[path][phase]!=0){updatedCAndP -= pathScoreArr[path][phase].combat/pathScoreArr[path][phase].deployC + removedDC[path][phase]}

    //Total GP needed for a planet
    let gpNeeded = pushRow[path] - realPreScore[path] - updatedCAndP
    totGPNeeded+= gpNeeded

    //Get current daily GP needed to meet all the goals
    let currRate = Math.max(0,(totGPNeeded-gpArray[phase]-extraGP[phase])/(pDaysArr[path]+1))
    if(currRate>totRate){
      totRate = currRate
      phaseNeeded = pDaysArr[path]+1
    }
    

    //Total push GP needed for a planet if ideal preloaad were to be reached
    let pushGPNeeded = pushRow[path] - unconstrained[path] - updatedCAndP
    totPushGPNeeded += pushGPNeeded
  }

  //Make sure that this rate can be used every Phase.
  //TODO

  //Compare rate if distributing GP over all preloading and push phases or just on the push phase
  let currRate =  Math.max(0,(totPushGPNeeded-gpArray[phase]-extraGP[phase])/(1))
  if(currRate>totRate){
    totRate = currRate
    phaseNeeded = 1 + unconstrained.reduce((totalPreGP, maxPreload, path) => totalPreGP + maxPreload - realPreScore[path], 0)/currRate
  }
  
  
  //Save the rate if it's better
  nextStarGP[pushRow[planetInfoArr.length]] = [Math.min(nextStarGP[pushRow[planetInfoArr.length]][0],totRate),phaseNeeded]
}

function findPathToAbort(pDaysArr,planetInfoArr,preScore,pushCAndP,leftoverGP,savedPushRow){
  let failPaths = []
  for(let path=0;path<pDaysArr.length;path++){
    if(savedPushRow[path]==0){failPaths.push(path)}
  }
  let failPath = failPaths[0]
  let gpNeeded = 0
  for(let path of failPaths){
    let nextGP = (planetInfoArr[path].star1 - (preScore[path] + pushCAndP[path] + leftoverGP))/(pDaysArr[path]+1)
    if(gpNeeded<nextGP){
      gpNeeded = nextGP
      failPath = path
    }
  }
  return failPath
}

function updateScoreTable(phase,gpArray,pathScoreArr,pDaysArr,savedDeployM,savedRemovedDC,savedRemovedP,savedPushRow){
  for(let path=0;path<pathScoreArr.length;path++){
    for(let p=phase-pDaysArr[path];p<=phase;p++){
      //Update platoons if needed
      if(savedRemovedP[path][p]){
        for(let pp=p;pp<=phase;pp++){
          pathScoreArr[path][pp].total -= pathScoreArr[path][p].platoons + pathScoreArr[path][p].deployP
        }
        pathScoreArr[path][p].platoons = 0
        gpArray[p] += pathScoreArr[path][p].deployP
        pathScoreArr[path][p].deployP = 0
      }

      //Update combats if needed
      if(savedRemovedDC[path][p]!=0){
        let removeC = pathScoreArr[path][p].combat/pathScoreArr[path][p].deployC * savedRemovedDC[path][p]
        for(let pp=p;pp<=phase;pp++){
          pathScoreArr[path][pp].total -= removeC + savedRemovedDC[path][p]
        }
        pathScoreArr[path][p].combat -= removeC
        pathScoreArr[path][p].deployC -= savedRemovedDC[path][p]
        gpArray[p] += savedRemovedDC[path][p]
      }

      //Update with deployM
      for(let pp=p;pp<=phase;pp++){
        pathScoreArr[path][pp].total += savedDeployM[path][p]
      }
      pathScoreArr[path][p].deployM += savedDeployM[path][p]
      gpArray[p] -= savedDeployM[path][p]
    }
    //Fix rounding errors
    pathScoreArr[path][phase].total = savedPushRow[path]
  }
}

function dailyGPNeededPreloadAdapted(gpArray,nextStarGP,preDaysArr,scoreTable){
  //Describe this function...
  //TODO unused combats

  let finalRate = 1e9

  //Write preload info in an array structure easy to access
  let preloadInfo = []
  let prePaths = gpArray.map(ele => [])
  let pushPaths = gpArray.map(ele => [])
  for(let path=0;path<preDaysArr.length;path++){
    preloadInfo.push([])
    let maxPre = 0
    for(let phase=0;phase<6;phase++){
      preloadInfo[path].push([])
      if(maxPre==0 || maxPre=="x"){maxPre=preDaysArr[path][phase]}
      preloadInfo[path][phase] = {
        preDays : preDaysArr[path][phase],
        maxPre : maxPre,
        preload : scoreTable[path][phase].deployM
      }

      //On push reset preload counter, no preload 
      if(preDaysArr[path][phase]==0){
        maxPre = 0
        preloadInfo[path][phase].preload = 0
        pushPaths[phase].push(path)
      //Add prePaths
      } else if(preDaysArr[path][phase]!="x"){
        prePaths[phase].push(path)
      }
    }
  }

  //Sort pushPaths in ascending order of maxPre
  for(let phase=0;phase<6;phase++){
    let zipArr = pushPaths[phase].map(path => [preloadInfo[path][phase].maxPre, path])
    pushPaths[phase] = zipArr.sort((a,b) => a[0]-b[0]).map(pairs => pairs[1])
  }

  //Evaluate the equivalent preload for each phase
  for(let phase=0;phase<6;phase++){

    //Ignore if the phase is already at max stars
    if(nextStarGP[phase][0]==1e9){continue}

    //Make a copy of the preload, to move preload in future for calculation
    let copyPreloadInfo = preloadInfo.map(path => path.slice())

    //Displace preload to future phase for first phase
    let n0 = nextStarGP[phase][1]
    for(let path of prePaths[phase]){
      let minPhase = phase - Math.min(n0,preloadInfo[path][phase].maxPre)
      for(let p=phase;p>minPhase;p--){
        if(preloadInfo[path][p].preDays !="x"){
          copyPreloadInfo[path][p+preloadInfo[path][p].preDays].preload += preloadInfo[path][p].preload
        }
      } 
    }

    //Calculate the equivalent preload GP needed to balance
    let rates = [nextStarGP[phase]] //Array where each element is 2D array [rate needed at phase p, number of days that rate is used]
    for(let p=phase+1;p<6;p++){

      //Calculate available preload GP in this phase 
      let preloadGP = 0
      for(let path of prePaths[p]){
        preloadGP += copyPreloadInfo[path][p].preload
      }

      //Calculate rate (pushPaths is sorted in ascending order of maxPre)
      let curRate = 0
      let curN = 0
      let gpNeeded = 0
      let preloadNeeded = false
      for(let path of pushPaths[p]){
        gpNeeded += copyPreloadInfo[path][p].preload
        
        //Calculate how many phases each rate is being used
        let prevGP = 0
        for(let i=0;i<rates.length;i++){
          let [ratei,ni] = rates[i]
          let start = Math.max(phase+i-Math.max(0,Math.ceil(ni-1)),p-preloadInfo[path][p].maxPre)
          let overlap = Math.max(0,phase+i - start + 1) 
          let nij = preloadInfo[path][p].maxPre + 1 - overlap
          prevGP += ratei*nij
        }

        //Calculate rate for this path and update phase rate if needed
        let thisRate = Math.max(0,(gpNeeded - gpArray[p] - prevGP - preloadGP)/(preloadInfo[path][p].maxPre+1))
        preloadNeeded = gpNeeded>gpArray[p]+prevGP
        if(thisRate>curRate){
          curRate = thisRate
          curN = preloadInfo[path][p].maxPre+1

        }
      }
      rates.push([curRate,curN])

      //Push used preload to future
      if(preloadNeeded){
        for(let path of prePaths[p]){
          if(preloadInfo[path][p].preDays !="x"){
            copyPreloadInfo[path][p+preloadInfo[path][p].preDays].preload += copyPreloadInfo[path][p].preload
          }
        }
      }
    }
    let totPhaseRate = rates.reduce((sum,rate)=>sum+=rate[0],0)
    finalRate = Math.min(finalRate,totPhaseRate)
  }

  return finalRate
}

function optimAllStrats(strats,dailyGP,maxP,charaGP,rawPlanet){
    resultArr = []
    for (let strat of strats){
      let extraGP = 0
      let[stars,extra,neededGP,gpArr,_scoreTable] = optimizeAlgo1(strat.toString(),dailyGP,maxP,charaGP,rawPlanet)
      gpArr.forEach(phaseGP => extraGP += phaseGP)
      resultArr.push([stars,extra,neededGP,extraGP])
    }
    return resultArr
}

function getPlanetSeq(strats){
  if(!Array.isArray(strats)){
    strats = [strats.toString()]
  }
  let planetSeqs = []
  for(let strat of strats){
    // Split the string by "-"
    const parts = strat.toString().split("-");

    // Extract the first part and convert it to a 15-bit binary string
    let binaryString = (+parts[0]).toString(2).padStart(15, '0');

    // Reverse the binary string
    binaryString = binaryString.split('').reverse().join('');

    // Split the reversed binary string into 3 segments of 5 bits each
    const preDaysArray = [];
    for (let path = 0; path < 3; path++) {
      preDaysArray.push(binaryString.substr(path * 5, 5));
    }

    let zones = [1,1,1]
    let planetSeq = []
    for (let phase=0;phase<5;phase++){
      planetSeq.push("D"+zones[0].toString()+"M"+zones[1].toString()+"L"+zones[2].toString())
      for (let path=0;path<3;path++){
        if(preDaysArray[path][phase]=="1"){zones[path] += 1}
      }
    }
    planetSeq.push("D"+zones[0].toString()+"M"+zones[1].toString()+"L"+zones[2].toString())

    //Second part (Bonus planet)
    if(parts.length>1){
      const [_loc,unlockInfo,label] = bonusPlanetInfo()//[[2,2,"LB3"],[1,3,"MB4"]]
      for(let bonus = 0;bonus<parts[1].length;bonus++){
        let phasePreBonus = 0
        let zonePushed = 0
        preDaysArray[unlockInfo[bonus][0]].split("").forEach(function (bit){
          if(zonePushed==unlockInfo[bonus][1]+1){return}
          if(bit=="1"){zonePushed++}
          phasePreBonus++
          
        })
        for(let phase=phasePreBonus;phase<=phasePreBonus+parseInt(parts[1][bonus])-1;phase++){
          if(planetSeq[phase].split("-").length==1){
            planetSeq[phase] = planetSeq[phase].concat("-")
          }
          planetSeq[phase] = planetSeq[phase].concat(label[bonus])
        }
      }
      
    }
    planetSeqs.push(planetSeq)
  }
  return planetSeqs
}

function getFullRewards(strat,dailyGP,maxP,charaGP,rawPlanet){
  let[stars,extra,_neededGP,_gpArr,_scoreTable] = optimizeAlgo1(strat.toString(),dailyGP,maxP,charaGP,rawPlanet)
  return[stars,extra]
}

function getShortScoreTable(strat,dailyGP,maxP,charaGP,rawPlanet){
  let[_stars,_extra,_neededGP,gpArr,scoreTable] = optimizeAlgo1(strat.toString(),dailyGP,maxP,charaGP,rawPlanet)
  let output = scoreTable.map(path => path.map(phase => phase.total))
  while(output.length<3+bonusPlanetInfo()[0].length){//main paths + bonus planets
    output.push(new Array(6).fill(0))
  }
  output.push(gpArr)
  return output
}

function getLongScoreTable(strat,dailyGP,maxP,charaGP,rawPlanet){
  let[_stars,_extra,_neededGP,_gpArr,scoreTable] = optimizeAlgo1(strat.toString(),dailyGP,maxP,charaGP,rawPlanet)
  let output = []
  for(path =0;path<3;path++){
    output.push(scoreTable[path].map(phase =>phase.total))
    output.push(scoreTable[path].map(phase =>phase.combat))
    output.push(scoreTable[path].map(phase =>phase.platoons))
    output.push(scoreTable[path].map(phase =>phase.deployC))
    output.push(scoreTable[path].map(phase =>phase.deployP))
    output.push(scoreTable[path].map(phase =>phase.deployM))
  }
  return output
}

function getBonusScoreTable(strat,dailyGP,maxP,charaGP,rawPlanet,bonusPath){
  let[_stars,_extra,_neededGP,_gpArr,scoreTable] = optimizeAlgo1(strat.toString(),dailyGP,maxP,charaGP,rawPlanet)
  let output = []
  if(scoreTable.length-1>=bonusPath){
    output.push(scoreTable[bonusPath].map(phase =>phase.total))
    output.push(scoreTable[bonusPath].map(phase =>phase.combat))
    output.push(scoreTable[bonusPath].map(phase =>phase.platoons))
    output.push(scoreTable[bonusPath].map(phase =>phase.deployC))
    output.push(scoreTable[bonusPath].map(phase =>phase.deployP))
    output.push(scoreTable[bonusPath].map(phase =>phase.deployM))
  } else{
    output = new Array(6).fill(new Array(6).fill(0))
  }
  return output
} 