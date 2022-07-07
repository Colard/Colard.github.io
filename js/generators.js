'use strict'
let listOfRaces = sortArrOfOjectsForProp([...race], "name");
let listOfClasses = sortArrOfOjectsForProp([...classes],  "class");
let listOfBackgrounds = sortArrOfOjectsForProp([...backgrounds], "background");
let listOfStats = [15, 14, 13, 12, 10, 8];
let player;


//ЗАПОВНЕННЯ ХАРАКТЕРИСТИК
function generate() {

  //Вибір класу, раси та предісторії
  player = createPlayerUsedStarterInfo();

  //введення характеристик персонажа та модифікаторів
  player.addStats(statsGenerator());

  //хіти
  player.maxHits = player.hits + player.modifierStats[2]

  //навики
  skillsCreator(player);

  //Уміння
  featuresCreator(player);

  //володіння і мови
  possessionCreator(player);
  
  player.armorPossessionTypes  = player.class.armorPossessionTypes;
  player.armorPossessionItems  = player.class.armorPossessionItems;
  player.weaponPossessionTypes = player.class.weaponPossessionTypes;
  player.weaponPossessionItems = player.class.weaponPossessionItems;

  //пасивна мудрість
  player.passWinsdom = 10 + player.modifierStats[4] + (player.skills[3]?2:0);

  //предмети
  player.items = [];
  player.armor = [];
  player.weapons = [];
  player.shield = [];
  player.ammo = [];

  creatingItems(player);

  //гроші
  player.money = player.background.money;

  //додаткова інформація
  generateAdditionalInfo(player);

  //ідепли
  traits(player);

  //клас заклинателя
  player.spellcastClass = player.class.spellcastClass;

   //базова характеристика заклять
  player.baseSpellChar = player.class.baseSpellChar;

  //Важкість спаскидка
  player.spellDifficult =  spellDifficult(player);

  //миодифікатор атаки заклинанням
  player.bonusSpellAtack = bonusSpellAtack(player);

  //доступні клітинки
  player.availableComplots = (player.class.complotNum > 0) ? player.class.complotNum : "";
  player.availableSpells = (player.class.availableSpells > 0) ? player.class.availableSpells : "";

  generateComplotsAndSpells(player);

  //особливості
  player.class.speciallyClass(player);
  player. background.speciallyBackground(player);
  player.race.speciallyRace(player);

  //одягання гравця
  dressed();

  player.languages = Array.from(new Set(player.languages));
  player.ArmorAndWaponPossession = Array.from(new Set(player.ArmorAndWaponPossession));
  player.toolsPossession = Array.from(new Set(player.toolsPossession));
  
  //Заповнення листа
  listCreater(player);
  
}

//
//ГЕНЕРАТОРИ ГРАВЦЯ
//

//ВИЗНАЧАЄ ПОЧАТКОВІ ДАНІ, ТАКІ ЯК КЛАС РАСА І Т.Д.
function createPlayerUsedStarterInfo() {
  let race = deepClone( generateRace() );
  let pClass = deepClone( generateClass() );
  let background = deepClone(  generateBackground() );
  let outlookID = deepClone( generateOutlookID() );

  return new Player(race, pClass, background, outlookID);
}

//ВИЗНАЧИТИ РАСУ
function generateRace() {
  let selectedRaceID = document.getElementById("race").selectedIndex;
  let listOfSubRaces = getObjForSelectedID(selectedRaceID, listOfRaces);
  let selectedSubRaceID = document.getElementById("subrace").selectedIndex;
  return getObjForSelectedID(selectedSubRaceID, listOfSubRaces.subraces);
}

//ВИЗНАЧИТИ КЛАС
function generateClass() {
  let selectedClassID = document.getElementById("class").selectedIndex;
  return getObjForSelectedID(selectedClassID, listOfClasses);
}
//ВИЗНАЧИТИ ПРЕДІСТОРІЮ
function generateBackground() {
  let selectedBackgroundID = document.getElementById("background").selectedIndex;
  let background = getObjForSelectedID(selectedBackgroundID, listOfBackgrounds);
  background = deepClone(background);
  let selectedSubBackgroundID = document.getElementById("subbackround").selectedIndex;
  return fullBackground(background, selectedSubBackgroundID);
}
//ВИЗНАЧИТИ СВІТОГЛЯД
function generateOutlookID() {
  let selectedOutlookID = document.getElementById("outlook").selectedIndex;
  return (selectedOutlookID === 0) ? randomInteger(0, outlook.length-1) : selectedOutlookID-1;
}

//ДОПОВНЮЄ ПРЕДІСТОРІЮ 
function fullBackground(background, subbackgroundID) {
  let backgroundSpecialty = "";

  if(background.specialty.length > 0 ) {
     subbackgroundID = (subbackgroundID == 0) ? randomInteger(0, background.specialty.length-1) : subbackgroundID-1;

    backgroundSpecialty = "("+ background.specialty[subbackgroundID]+")";
   
    if( background.background.length + backgroundSpecialty.length > 24) {
      background.background += "<br>";
    }

    background.background += backgroundSpecialty;
  }

  return background;
}

//ГЕНЕРАЦІЯ ХАРАКТЕРИСТИКИ НА ОСНОВІ SELECT
function statsGenerator() {
  let arrFromSelect = getArrFromSelect(".additionalSettings .statsSettings .select select");
  let newListOfStats = shuffle(deepClone( listOfStats ));
  let arrOfStats = [];

  for(let i = 0; i < 6; i++) {
     arrOfStats.push( (arrFromSelect[i] == "R") ? newListOfStats.shift() : arrFromSelect[i]);
  }

  return arrOfStats;
}

//ГЕНЕРАТОР ХАРАКТЕРУ
function traits(player) {
  let selects = document.querySelectorAll(".additionalSettings .ideals select");
  let textareas  = document.querySelectorAll(".additionalSettings .ideals textarea");
  let randomedText;

  randomedText = player.background.featureOfCharacter[randomInteger(0, player.background.featureOfCharacter.length-1)];
  player.traits = chooseVariant(randomedText, textareas[0].value, !selects[0].selectedIndex);

  randomedText = generateIdeal(player.background.ideal, player.outlookID);
  player.ideal = chooseVariant(randomedText, textareas[1].value, !selects[1].selectedIndex);
  
  randomedText = player.background.favor[randomInteger(0, player.background.favor.length-1)];
  player.favor = chooseVariant(randomedText, textareas[2].value, !selects[2].selectedIndex);
  
  randomedText = player.background.weakness[randomInteger(0, player.background.weakness.length-1)];
  player.weakness= chooseVariant(randomedText, textareas[3].value, !selects[3].selectedIndex);
}

function chooseVariant(tetx1, text2, type) {
  let res;
  return (type) ? tetx1 : text2;
}

//ГЕНЕРУЄ ІДЕАЛ
function generateIdeal(list, outlookID) {
  let listOfIdelas = [];
  for(let i = 0; i < list.length; i++) {
    if(list[i][1].indexOf(outlookID) != -1) listOfIdelas.push(list[i][0]);
  }

  return listOfIdelas[randomInteger(0, listOfIdelas.length-1)];
}

//ГЕНЕРАТОР НАВИКІВ
function skillsCreator(player) {
  player.cleanSkills();
  addRandomSkills(player.skills, player.background.skills, player.background.skills.length);

  let notUsedSkillsCount = player.class.skillsNum - addChoosedSkils(player.skills);

  addRandomSkills(player.skills, player.class.skills, notUsedSkillsCount);

  return player.skills;
}

//ДОДАВАННЯ УМІНЬ
function featuresCreator(player) {
  player.featuresList = player.race.features.concat(player.class.features, player.background.features);
  return player;
}

function possessionCreator(player) {
  player.languages = player.race.languages;
  player.armorAndWaponPossession = player.class.weaponPossession.concat(player.class.armorPossession);
  player.toolsPossession = player.class.tools.concat(player.background.toolsPossession);
}

function creatingItems(player){
  takeSelectedItems(player);
  player.class.starterItems(player);
  player.background.starterItems(player); 
}

function takeSelectedItems(player) {
    let selects = document.querySelectorAll(".additionalSettings .swiperLists .swipeList3 .variantsOfItems div > select");

    let variants = player.class.itemsVariant(player);

    for(let i = 0; i < variants.length; i++) {
      if(selects[i] && selects[i].selectedIndex > 0) {
        variants[i][selects[i].selectedIndex-1].f();
      } else {
        variants[i][randomInteger(0,variants[i].length-1)].f();
      }
    }
}

//ГЕНЕРУЄ ЗОВНІШНІЙ ВИГЛЯД
function generateAdditionalInfo(player) {
  let selects = document.querySelectorAll(".additionalSettings .look .select select ");

  player.age = (selects[0].selectedIndex > 0) ? +selects[0].value : randomInteger(player.race.minAge - player.race.minAge*0.1, player.race.age+20);

  player.eye = (selects[1].selectedIndex > 0) ? selects[1].value : player.race.eye[randomInteger(0, player.race.eye.length-1)];

  player.growth = (selects[2].selectedIndex > 0) ? +selects[2].value : +(randomInteger(player.race.minSize -0.5,player.race.maxSize-0.5) + +Math.random().toFixed(2)).toFixed(2);

  player.skin = (selects[3].selectedIndex > 0) ? selects[3].value : player.race.skinColor[randomInteger(0, player.race.skinColor.length-1)];

  player.weight = (selects[4].selectedIndex > 0) ? +selects[4].value : +(randomInteger(player.race.minMass, player.race.maxMass-1) + +Math.random().toFixed(2)).toFixed(2);

  player.hair = (selects[5].selectedIndex > 0) ? selects[5].value : player.race.hair[randomInteger(0, player.race.hair.length-1)];

  return player;
}

//ОДЯГАННЯ ГРАВЦЯ
function dressed() {
  player.handOne = ["","",""];
  player.handTwo = ["","",""];
  player.handThree = ["","",""];
  player.chestplate = "";


  for(let i = 0; i < player.weapons.length; i++) {
    //Права рука
    if(player.handOne[0] === "" && player.weapons[i].category[1] == "Рукопашне" && 
        (player.weaponPossessionTypes.includes(player.weapons[i].category[0]) || 
         player.weaponPossessionTypes.includes(player.weapons[i].category[1]) ||
         player.weaponPossessionItems.includes(player.weapons[i].name))) {
         
        player.handOne[0] = {};
        Object.assign(player.handOne[0], player.weapons[i]);
        player.handOne[1] = (player.masterBonus + player.modifierStats[0] > 0)?"+"+(player.masterBonus + player.modifierStats[0]):(player.masterBonus + player.modifierStats[0]);
        player.handOne[2] = player.weapons[i].damage[0] + "к" + player.weapons[i].damage[1] +
        ((player.weapons[i].hasOwnProperty('twoHand')) ? `(${player.weapons[i].twoHand[0]}к${player.weapons[i].twoHand[1]})`: "")+
        ((player.modifierStats[0] >= 0) ? `+${player.modifierStats[0]}`: player.modifierStats[0])
        + ", "+player.weapons[i].damage[2];
        player.weapons[i].name = "<i>"+player.weapons[i].name+"</i>";
        continue;
     } 

    //Ліва рука
    if(player.handTwo[0] === "" && player.weapons[i].category[1] == "Рукопашне" &&
        (player.weaponPossessionTypes.includes(player.weapons[i].category[0]) || 
         player.weaponPossessionTypes.includes(player.weapons[i].category[1]) ||
         player.weaponPossessionItems.includes(player.weapons[i].name))) {
        
        player.handTwo[0] = {};
        Object.assign(player.handTwo[0], player.weapons[i]);
        player.handTwo[1] = (player.masterBonus + player.modifierStats[0] > 0)?"+"+(player.masterBonus + player.modifierStats[0]):(player.masterBonus + player.modifierStats[0]);
        player.handTwo[2] = player.weapons[i].damage[0]+"к"+player.weapons[i].damage[1]  +
        ((player.weapons[i].hasOwnProperty('twoHand')) ? `(${player.weapons[i].twoHand[0]}к${player.weapons[i].twoHand[1]})`: "") +
        ((player.modifierStats[0] >= 0) ? `+${player.modifierStats[0]}`: player.modifierStats[0])
        + ", "+player.weapons[i].damage[2];
        player.weapons[i].name = "<i>"+player.weapons[i].name+"</i>"; 
        continue;
     } 

    //Третя рука
    if(player.handThree[0] === "" && player.weapons[i].category[1] == "Далекобійне" &&
        (player.weaponPossessionTypes.includes(player.weapons[i].category[0]) || 
         player.weaponPossessionTypes.includes(player.weapons[i].category[1]) ||
         player.weaponPossessionItems.includes(player.weapons[i].name))) {
        
        player.handThree[0] = {};
        Object.assign(player.handThree[0], player.weapons[i]);
        player.handThree[1] = (player.masterBonus + player.modifierStats[0] > 0)?"+"+(player.masterBonus + player.modifierStats[1]):(player.masterBonus + player.modifierStats[1]);
        player.handThree[2] = player.weapons[i].damage[0]+"к"+player.weapons[i].damage[1]+
        ((player.modifierStats[1] >= 0) ? `+${player.modifierStats[1]}`: player.modifierStats[1])+
        ", "+player.weapons[i].damage[2];
        player.weapons[i].name = "<i>"+player.weapons[i].name+"</i>";        
        continue;
    }
  }


   //Щит
  if(player.shield.length > 0 && 
      (( player.handOne[0] === ""  || !player.handOne[0].properties.includes("Дворучне")) ||
      ( player.handTwo[0] === "" || !player.handTwo[0].properties.includes("Дворучне"))) &&
      player.armorPossessionTypes.includes("Щит") ) {
    player.KD[1] += 2;
    player.shield[0].name = "<i>"+player.shield[0].name+"</i>";
  }

  //Тіло
  for(let i = 0; i < player.armor.length; i++) {
    if(player.chestplate === "" &&
     (player.armorPossessionTypes.includes(player.armor[i].type) || 
     player.armorPossessionItems.includes(player.armor[i].name) ) ) {
        player.chestplate = Object.assign({},player.armor[i]);
        player.KD[0] = player.chestplate.KD;
        if (player.chestplate.bonusKD && (player.chestplate.type == "Легкий")) player.KD[0] += player.modifierStats[1];
        if (player.chestplate.bonusKD && (player.chestplate.type ==  "Середній")) {
          player.KD[0] += ((player.modifierStats[1] > 2 ) ? 2 : player.modifierStats[1]);
        }

        player.armor[i].name = "<i>"+player.armor[i].name+"</i>";
        break;
    }
  }
}

//ВАЖКІСТЬ СПАСКИДКА
function spellDifficult(player) {
  return (player.baseSpellChar != -1) ? 8 + player.masterBonus + player.modifierStats[player.baseSpellChar] : "";
}

//МОДИФІКАТОР АТАКИ ЗАКЛИНАННЯМ
function bonusSpellAtack(player) {
  return (player.baseSpellChar != -1) ? player.masterBonus + player.modifierStats[player.baseSpellChar] : "";
}

function generateComplotsAndSpells(player) {
  let availableComp = (player.availableComplots != "") ? player.availableComplots : 0;
  let availableSpells =player.class.allSpells;
  player.complot = [];
  player.spells = [];

  ganerateSpells(".additionalSettings .swiperLists .spellSelect .complotNum select", player.complot, player.class.complotList, availableComp);
  ganerateSpells(".additionalSettings .swiperLists .spellSelect .spellsNum select", player.spells, player.class.spellList, availableSpells);

}

function ganerateSpells(selector, place, list, n) {
  let selectors = document.querySelectorAll(selector);
  
  let complots = deepClone(list);

  for(let i = 0; i < selectors.length; i++) {
    let index = selectors[i].selectedIndex;
    if(index > 0) {
      if(contains(place, complots[index-1]) ) continue;
      place.push(complots[index-1]);
      n--;
    }
  }

  complots = shuffle(complots);
  for(let i = 0; i < complots.length && n > 0; i++) {
     if(contains(place, complots[i]) ) continue;
     place.push(complots[i]);
     n--;
  }

}