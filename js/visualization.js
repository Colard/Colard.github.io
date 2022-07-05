//ЗАПОВНЕННЯ ЛИСТА 
function listCreater(player) {
  //ЛИСТ 1
  
  //раса
  tagFuller("playerRace", player.race.race);
  
  //клас
  tagFuller("playerClass", player.class.class + ", 1");
  
  //світогляд
  tagFuller("playerOutlook", outlook[player.outlookID]);

  //передісторія
  tryChangeBackgroundStyle(player);
  tagFuller("playerBackground", player.background.background);

  //характеристики і модифікатори
  statsFuller(player);

  //бонус майстерності
  tagFuller("masterBonus", "+"+player.masterBonus);

  //максимальні хіти
  hitFuller(player)
  
  //кубик хітів
  tagFuller("hitsDice", player.class.hitDice[0] + "к" + player.class.hitDice[1]);

  //спаскидки
  saveDiceFuller("saveThrows", player.saveDice, 6);

  //Швидкість
  tagFuller("speed",  player.speed +  " фт.");
  
  //Ініцітива 
  tagFuller("іnitiative", (player.іnitiative > 0) ? "+"+player.іnitiative : player.іnitiative);

  //навики
  skillsFuller("skills", player.skills);
  
  //назви уміннь
  featuresNamesCreator(player);

  //Володіння
  possessionWriter(player);

  //пасивна мудрість
  tagFuller("passiveWisdom", player.passWinsdom);

  //речі
  itemsWriter(player);
  countAmmo(player);

  //гроші
  visualisationMoney(player);


  //КД
  tagFuller("KD", player.KD[0]+player.KD[1]);

  //одягання
  dressedWeapon(player);

  //додаткова інформація
  tagFuller("age", player.age);
  tagFuller("eye", player.eye);
  tagFuller("growth", player.growth + " фт.");
  tagFuller("skin", player.skin);
  tagFuller("weight", player.weight + " фунтів" );
  tagFuller("hair", player.hair);


  tagFuller("featureOfCharacter", player.traits);
  tagFuller("ideal", player.ideal);
  tagFuller("favor", player.favor);
  tagFuller("weakness", player.weakness);

  //клас заклинателя
  tagFuller("spellcastClass", player.spellcastClass);

  //базова характеристика заклять
  tagFuller("baseSpellChar", WriteBaseSpellChar(player));

  tagFuller("spellDifficult", player.spellDifficult);
  
  //миодифікатор атаки заклинанням
  tagFuller("bonusSpellAtack", player.bonusSpellAtack);

  //доступні клітинки
  tagFuller("availableSpells", player.availableSpells);
  

  //Заговори
  complots(player);
  
  //заклинання
  AllSpells(player);

  //нформація про всяке таке
  detailInfo(player);

}

//ФУНКЦІЯ, ЩО ЗАПОВНЮЄ ТЕГИ З ІНФОРМАЦІЄЮ
function tagFuller(id, text) {
  //id - вказується який тег вставляти
  //text - текст тегу
  let tag = document.getElementById(id);
  tag.innerHTML = text;
}
  
//ПРОВІРКА НА ТЕ, ЧИ ПОТРІБНО РЕДАГУВАТИ МІСЦЕ ДЛЯ ПРЕДІСТОРІЇ
function tryChangeBackgroundStyle(player) {
  let backgroundPlace = document.getElementById("playerBackground");
  backgroundPlace.removeAttribute("style");
  if(player.background.background.length > 24) backgroundPlace.style.top = "-4%"; 
}

//ЗАПОВНЮЄ СПИСОК ХАРАКТЕРИСТИК І МОДИФІКАТОРІВ
function statsFuller(player) {

  let el = document.getElementById("characteristics");
  clearAllChild(el);

  for(let i = 0; i < 6; i++) {
    let div = document.createElement('div');

    let modifier = player.modifierStats[i];
    let stat = player.stats[i];
    modifier = modiferToString(modifier);

    div.innerHTML = `<p>${modifier}</p><p>${stat}</p>`
    el.appendChild(div);
  }
}

//ЗАПОВНЮЄ ХІТИ
function hitFuller(player) {
  tagFuller("maxHits", player.maxHits);
}

//ЗАПОВНЮЄ СПАСКИДКИ
function saveDiceFuller(tag, pinsList) {
  //tag - айді блоку спаскидків чи навиків
  //pinsList - список тих статів, що потрібно модифікувати.
  let parentEl = document.getElementById(tag);
  clearAllChild(parentEl);

  for(let i = 0; i < 6; i++) {
    let div = document.createElement('div');
    
    let modifier = player.modifierStats[i];

    if(player.saveDice[i]) {
      div.innerHTML = `<p>•</p><p>${modiferToString(modifier + player.masterBonus)}</p>`;
    } else {
      div.innerHTML = `<p></p><p>${modiferToString(modifier)}</p>`;
    }

    parentEl.appendChild(div);
  }
}

//ЗАПОВНЮЄ НАВИКИ
function skillsFuller(tag, pinsList) {
  //tag - айді блоку спаскидків чи навиків
  //pinsList - список тих статів, що потрібно модифікувати.
  let parentEl = document.getElementById(tag);
  let arrOfModifierType = [1, 3, 0, 4, 4, 5, 5, 3, 1, 3, 4, 5, 3, 4, 3, 1, 5, 4];
  
  clearAllChild(parentEl);
  for(let i = 0; i < 18; i++) {
    let div = document.createElement('div');
    
    let modifier = player.modifierStats[arrOfModifierType[i]];

    if(pinsList[i]) {
      div.innerHTML = `<p>•</p><p>${modiferToString(modifier + player.masterBonus)}</p>`;
    } else {
      div.innerHTML = `<p></p><p>${modiferToString(modifier)}</p>`;
    }

    parentEl.appendChild(div);
  }
}

//ГЕНЕРАТОР НАЗВ УМІНЬ
function featuresNamesCreator(player) {
  let str = "";
  for(let i = 0; i < player.featuresList.length; i+=2) {
    str+= `${(i/2)+1}. `;
    str+= player.featuresList[i].bold();
    str+= "<br>";
  }
  document.getElementById("featuresList").innerHTML = str;
}

//Володіння
function possessionWriter(player) {
  let possessionParts = "";

  possessionParts += possessionCorrector(player.languages, "Мови");
  possessionParts += possessionCorrector(player.armorAndWaponPossession, "Володіння зброєю і бронею");
  possessionParts += possessionCorrector(player.toolsPossession, "Володіння інструментами");

  tagFuller("languagesList", possessionParts);
}

function possessionCorrector(arr, text){
  let possessionParts = "";
  arr = arr.sort();

  if(arr.length>0) { 
    possessionParts += "<b>"+text+":</b><br>"
    for(let i = 0; i <arr.length-1; i++) {
      possessionParts += (arr[i].toLowerCase() + ", ");
    }
    possessionParts += (arr[arr.length-1].toLowerCase() + ".<br><br>");
  }

  return possessionParts;
}

//Речі
function itemsWriter(player) {
  let itemsCount = [], armorCount = [], weaponCount = [], shieldCount = [];
  let itemsParts = "";

  //Бронька
  let armorAndShied = player.armor.concat(player.shield);

  itemsParts += writeTextAboutItems("Броня", armorAndShied);
  itemsParts += writeTextAboutItems("Зброя", player.weapons);
  itemsParts += writeTextAboutItems("Інші предмети", player.items);

  tagFuller("items", itemsParts);
}

//ОПИСУЄ РЕЧІ ЯКІ МАЄ ПЕРСОНАЖ
function writeTextAboutItems(text, arr) {
  sortArrOfOjectsForProp(arr,"name");

  if(arr.length > 0) {
    let  itemsParts = "<b>"+text+":</b><br>";
    itemsCount = arrCounter(arr);
    for(let i = 0; i < itemsCount.length-1; i++) {
      itemsParts += itemsCount[i].toLowerCase() + ", ";
    }
    return itemsParts += (itemsCount[itemsCount.length-1].toLowerCase() + ".<br><br>");
  }

  return "";
}

//боєприпаси
function countAmmo(player) {
  let result = {};
  let string = "";
  for (var i = 0; i < player.ammo.length; ++i)
  {
      let a = player.ammo[i].name;
      if (result[a] != undefined) {
        ++result[a];
      } else {
        result[a] = 1;
      }
  }
  
  for (var key in result) {
    if(result[key] == 1) 
      string += "• " +key + "<br>";
    else
      string +=  "• " +key + ' x' + result[key] + "<br>";
  }
  tagFuller("ammunition", string);
}

//ВІЗУАЛІЗУЄ ГРОШІ
function visualisationMoney(player) {
  tagFuller("copperCoin", (player.money[0] == 0) ? "" : player.money[0]);
  tagFuller("silverCoin", (player.money[1] == 0) ? "" : player.money[1]);
  tagFuller("elctriumCoin", (player.money[2] == 0) ? "" : player.money[2]);
  tagFuller("goldCoin", (player.money[3] == 0) ? "" : player.money[3]);
  tagFuller("platinumCoin", (player.money[4] == 0) ? "" : player.money[4]);
}

function WriteBaseSpellChar(player) {
  let listOFCharacteristic = ["Сила","Спритність","Тіло","Інтелект","Мудрість","Харизма"]
  return (player.baseSpellChar != -1) ? listOFCharacteristic[player.baseSpellChar] : "";
}


//Одягання броні
function dressedWeapon(player) {
  let text;
  text =  
  ((player.handOne[0].hasOwnProperty('dist')) ? player.handOne[0].name + ` (${player.handOne[0].dist[0]}/${player.handOne[0].dist[1]})`
    : player.handOne[0].name);
  tagFuller("weaponName1", text || " ");
  tagFuller("bonusAtack1", player.handOne[1]);
  tagFuller("damage1", player.handOne[2]);

  text = 
  ((player.handTwo[0].hasOwnProperty('dist')) ? player.handTwo[0].name + ` (${player.handTwo[0].dist[0]}/${player.handTwo[0].dist[1]})`
    : player.handTwo[0].name);
  tagFuller("weaponName2", text || " ");
  tagFuller("bonusAtack2", player.handTwo[1]);
  tagFuller("damage2", player.handTwo[2]);

  text = 
  ((player.handThree[0].hasOwnProperty('dist')) ? player.handThree[0].name + ` (${player.handThree[0].dist[0]}/${player.handThree[0].dist[1]})`
    : player.handThree[0].name);
  tagFuller("weaponName3", text || " ");
  tagFuller("bonusAtack3", player.handThree[1]);
  tagFuller("damage3", player.handThree[2]);
}

//заговори
function complots(player) {
  let str = "";
  for(let i = 0; i < player.complot.length; i++) {
    str += (i+1) + ".<b> " + complot[ player.complot[i] ].name + "</b>"; 
    if(complot[ player.complot[i] ].components[0]) str += " &#128264";
    if(complot[ player.complot[i] ].components[1]) str += " &#129306";
    if(complot[ player.complot[i] ].components[2]) {
      str += " &#128230";
      str += "<br>" + complot[ player.complot[i] ].items;
    }

    str += "<br>";
  }
  tagFuller("complot", str);
}

//Магія
function AllSpells(player) {
  let str = "";
  for(let i = 0; i < player.spells.length; i++) {
    str += (i+1) + ".<b> " + spells[ player.spells[i] ].name + "</b>"; 
    if(spells[ player.spells[i] ].components[0]) str += " &#128264";
    if(spells[ player.spells[i] ].components[1]) str += " &#129306";
    if(spells[ player.spells[i] ].components[2]) {
      str += " &#128230";
      str += "<br>" + spells[ player.spells[i] ].items;
    }

    str += "<br>";
  }
  tagFuller("spells", str);
}

//інфа про все
function detailInfo(player) {
  let str;
  let counter = 0;
  let armorAndWeapon = [];
  let ietemsList = [];

  str = "<h2>БРОНЯ І ЗБРОЯ:</h2><br>";

  //Броня
  for(let i = 0; i < player.armor.length; i++) {
    let someText = "";

    player.armor[i].name = player.armor[i].name.replace('<i>','');
    player.armor[i].name = player.armor[i].name.replace('</i>','');

    someText += player.armor[i].name.toLowerCase();
    someText += ": <i>(" + player.armor[i].type + ")";
    someText += " (кд = " + player.armor[i].KD; 
    
    if(player.armor[i].type == "Легкий" ) {
      someText += " + Ловкість"    
    }
    if(player.armor[i].type == "Середній" ) {
      someText += " + Ловкість(макс. 2)"    
    }
    someText += ")</i>;"

    armorAndWeapon.push(someText);
  }

  //Зброя
  for(let i = 0; i < player.weapons.length; i++) {
    let someText = "";

    player.weapons[i].name = player.weapons[i].name.replace('<i>','');
    player.weapons[i].name = player.weapons[i].name.replace('</i>','');

    someText += player.weapons[i].name.toLowerCase();
    someText += "(" + player.weapons[i].damage[0] + "к" + player.weapons[i].damage[1]  + ")" + ": <i>";

    if(player.weapons[i].properties.length != 0) {
      someText += "("
      for(let j = 0; j < player.weapons[i].properties.length-1; j++) {
        someText += player.weapons[i].properties[j];
        someText += ", ";
      }
      someText += player.weapons[i].properties[player.weapons[i].properties.length-1] + ")";
    }

    if(player.weapons[i].category.length != 0) {
      someText += " (";
      for(let j = 0; j < player.weapons[i].category.length-1; j++) {
        someText += player.weapons[i].category[j] + ", ";
      }
      someText += player.weapons[i].category[player.weapons[i].category.length-1];
      someText += ")</i>;"
    }

    armorAndWeapon.push(someText);
  }

  //Щит
  for(let i = 0; i < player.shield.length; i++) {
    let someText = "";

    player.shield[i].name = player.shield[i].name.replace('<i>','');
    player.shield[i].name = player.shield[i].name.replace('</i>','');

    someText += player.shield[i].name.toLowerCase();
    someText += ";";

    armorAndWeapon.push(someText);
  }

  armorAndWeapon = arrStringCounter(armorAndWeapon);
  for(let i = 0; i < armorAndWeapon.length; i++) {
    str += armorAndWeapon[i];
  }

  str += "<br><h2>РЕЧІ:</h2><br>"

  //Речі
  for(let i = 0; i < player.items.length; i++) {
    if(player.items[i].hasOwnProperty("fullName")) {
      ietemsList.push(player.items[i].fullName);
    } else {
      ietemsList.push(player.items[i].name);
    }
  }

  ietemsList = arrStringCounter(ietemsList);
  for(let i = 0; i < ietemsList.length-1; i++) {
    ietemsList[i] = ietemsList[i].replace("<br>",", ")
    str += ietemsList[i].toLowerCase();
  }
  ietemsList[ietemsList.length-1] = ietemsList[ietemsList.length-1].replace(",","");
  ietemsList[ietemsList.length-1] = ietemsList[ietemsList.length-1].replace("<br>","");
  str +=  ietemsList[ietemsList.length-1].toLowerCase() + ".";

  //НАВИКИ
  str += "<br><br><h2>НАВИКИ:</h2><br>"

  for(let i = 0; i < player.featuresList.length; i++) {
    if(!(i % 2)) str += "<b>" + player.featuresList[i] + ":</b><br>";
    if(i % 2) str += player.featuresList[i] + "<br>";
  }


  tagFuller("textAboutAll", str);
}