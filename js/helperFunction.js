function sortArrOfOjectsForProp(arr, prop) {

  function sortRule(a, b) {
      let prop1=a[prop].toLowerCase(), prop2=b[prop].toLowerCase()
      if (prop1 < prop2) return -1;
      if (prop1 > prop2) return 1;
      return 0;
    }

  return arr.sort(sortRule);
}

function tryAddNewSkill(player, skillN) {
  if(player.skills[skillN] == 1) {
    if(contains(player.background.skills, skillN)) return false;

    let skills = deepClone(player.class.skills);
    for(let i = 0; i < skills.length; i++) {
      if(player.skills[skills[i]]) {
        skills.splice(i,1);
        i--;
      }
    }

    if(skills.length > 0) {
      skills = shuffle(skills);
      player.skills[skills[0]] = 1;
      return true;
    } 

    return false;
  }

  player.skills[skillN] = 1;
  return true;
}


function contains(arr, elem) {
   return arr.indexOf(elem) != -1;
}

function modiferToString(modifier) {
  return (modifier > 0)  ?  "+" + modifier : "" + modifier;
}

function addRandomSkills(playerSkills, listForAdd, number) {
  listForAdd = deepClone(listForAdd);
  for(let i = 0; i < listForAdd.length; i++) {
    if(playerSkills[listForAdd[i]]) {
      listForAdd.splice(i,1);
      i--;
    }
  }

  if(listForAdd.length <= number) {
    for(let i = 0; i < listForAdd.length; i++) {
      playerSkills[listForAdd[i]] = 1;
    }
    return playerSkills;
  }

  for(; number > 0; number--) {
    let index = randomInteger(0, listForAdd.length-1);
    
    playerSkills[listForAdd[index]] = 1;

    listForAdd.splice(index,1);
  }

  return playerSkills;

}

function addChoosedSkils(playerSkills) {
  let checkboxs = document.querySelectorAll(".additionalSettings .swiperLists .swipeList2 .listOfSkills > div > input");
  let counter = 0;

  for(let i = 0; i < checkboxs.length; i++) {
    if(checkboxs[i].checked && !checkboxs[i].disabled) {
      counter++;
      if(playerSkills[i]) counter--;
      playerSkills[i] = 1;

    }
  }
  return counter;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

//КУБИКИ
function D6() {
  return randomInteger(1, 6);
}


function clearAllChild(el) {
  while(el.firstChild) el.removeChild(el.firstChild);
  return el;
}

//РАХУЄ КІЛЬКІСТЬ ЕЛЕМЕНТІВ В МАСИВІ
function arrCounter (arr) {
  let result = {};
  let string = [];
  for (var i = 0; i < arr.length; ++i)
  {
      let a = arr[i].name;
      if (result[a] != undefined) {
        ++result[a];
      } else {
        result[a] = 1;
      }
  }
  
  for (var key in result) {
    if(result[key] == 1) 
      string.push(key)
    else
      string.push(key + ' x' + result[key])
  }
  
  return string;
}

//РАХУЄ КІЛЬКІСТЬ СТРОК В МАСИВІ ДЛЯ ВИВОВДУ В СТОВБЕЦЬ
function arrStringCounter (arr) {
  let result = {};
  let string = [];
  for (var i = 0; i < arr.length; ++i)
  {
      let a = arr[i];
      if (result[a] != undefined) {
        ++result[a];
      } else {
        result[a] = 1;
      }
  }
  
  for (var key in result) {
    if(result[key] == 1) 
      string.push(key + "<br>");
    else

      string.push( key + '<b> x' + result[key] + "</b><br>")
  }
  
  return string;
}

function deepClone (obj) {
    if (obj == null || typeof obj !== 'object') {
        return obj;
    }
 
    if (obj instanceof Date) { return new Date(obj); }
    if (obj instanceof String) { return new String(obj); }
    if (obj instanceof Number) { return new Number(obj); }
    if (obj instanceof Boolean) { return new Boolean(obj); }
    if (obj instanceof RegExp) { return new RegExp(obj); }

    let clone = {};
    if (obj instanceof Array) clone = new Array(obj.length);

    for (let key in obj) clone[key] = deepClone(obj[key]);

    return clone;
};


//Повертає З МАСИВУ ЕЛЕМЕНТ, ВІДПОВІДНО ОБРАНОГО ІНДЕКСУ ВИПАДАЙКИ
function getObjForSelectedID(selectedId, list) {
  return  list[ (selectedId < 1) ? randomInteger(0, list.length-1) : selectedId-1] ;
}

//ОТРИМАТИ МАСИВ З SELECTів
function getArrFromSelect(selector) {
    let arrOfSelect = document.querySelectorAll(selector);
    let arr = [];

    for(let i = 0; i < arrOfSelect.length; i++) {
      let thisValue = +arrOfSelect[i].value;
      arr.push( (Number.isFinite(thisValue)) ? thisValue : "R");
    }

    return arr;
}