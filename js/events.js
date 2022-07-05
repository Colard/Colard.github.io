//ВВОДИТЬТ ДАНІ ПІДРЕЧЕЙ В ОДНУ ВИПАДАКЙ В ЗАЛЕЖНОСТІ ВІД ІНШОЇ
function addSubItemsFromSelecter(toS, list, takeFunction) {
  return (e) => {
  	let select = document.getElementById(toS);
    if(e.currentTarget.selectedIndex > 0) {
      clearAllChild(select);
      let arrOfElements = takeFunction(list[e.currentTarget.selectedIndex-1]);
      addListOfOptions(toS, arrOfElements, (el)=>el);
    } else {
      clearAllChild(select);
      addOptions(select, "--Випадково--");
    }
  }
}

//ВВОДИТЬТ ДАНІ РАСИ В ВИПАДАЙКУ ПІДРАС В ЗАЛЕЖНОСТІ ВІД ІНШОЇ
function addSubRaceFromSelecter(list, takeFunction) {
  return (e) => {
  	let select = document.getElementById("subrace");
    if(e.currentTarget.selectedIndex > 0) {
      clearAllChild(select);
      let arrOfElements = takeFunction(list[e.currentTarget.selectedIndex-1]);
      addListOfOptions("subrace", arrOfElements, (el)=>el);

      if(arrOfElements.length == 1) {
      	select.selectedIndex = 1;
      }
      settingOfLook();

    } else {
      clearAllChild(select);
      addOptions(select, "--Випадково--");
    }
  }
}

//СТВОРЮЄ БЛОКИ З ВИПАДАЙКАМИ
function createSelectInPlace(text, parent, size) {
	let div = document.createElement('div');
	let p = document.createElement('p');
	let select = document.createElement('select');

	p.innerHTML = text;

	div.classList.add("select");
	div.appendChild(p);
  div.appendChild(select);

	parent.appendChild(div);

  selectEventerForOneSelect(select, size);
	return select;
}

//CТВОРЮЄ ВИПАДАЙКИ ДЛЯ ПРЕДМЕТІВ
function createSelectFromItems(e) {
	let parent = document.querySelector(".additionalSettings .swiperLists .swipeList3 .variantsOfItems");

	clearAllChild(parent);

	if(e.currentTarget.selectedIndex > 0) {
		let variants = listOfClasses[e.currentTarget.selectedIndex-1].itemsVariant();

		for(let i = 0; i < variants.length; i++) {
			let select = createSelectInPlace("Вибір " + (i+1), parent, 4);

		  addOptions(select, "--Випадково--");
		  for(let arrEl of variants[i]) addOptions(select, arrEl.name);
		  
		}
	}
}

//НАЛАШТОВУЭ ВИПАДАЙКИ ВИГЛЯДУ
function settingOfLook() {
	let selects = document.querySelectorAll(".additionalSettings .look .select select ");
	let subraceSelect = document.getElementById("subrace");
	let raceindex = document.getElementById("race").selectedIndex-1;; 

	for(let i = 0; i < selects.length; i++) {
		clearAllChild(selects[i]);
		addOptions(selects[i], "--Випадково--"); ;
	}

	if(subraceSelect.selectedIndex > 0) {
		let thisRace = listOfRaces[raceindex].subraces[subraceSelect.selectedIndex-1];
		
		//вік
		let minAge = Math.round(thisRace.minAge- thisRace.minAge*0.1);
		let maxAge = thisRace.age + 20;

		for(let i = minAge; i <= maxAge; i++) {
			addOptions(selects[0], i);
		}

		//очі 
		thisRace.eye.sort();
		for(let i = 0; i < thisRace.eye.length; i++) {
			addOptions(selects[1], thisRace.eye[i]);
		}

		//ріст
		for(let i = thisRace.minSize-0.5; i < thisRace.maxSize+0.5; i+=0.1) {
			addOptions(selects[2], i.toFixed(1));
		}

		//шкіра
		thisRace.skinColor.sort();
		for(let i = 0; i < thisRace.skinColor.length; i++) {
			addOptions(selects[3], thisRace.skinColor[i]);
		}

		//вага
		for(let i = thisRace.minMass; i < thisRace.maxMass; i++) {
			addOptions(selects[4], i);
		}

		//волосся
		thisRace.hair.sort();
		for(let i = 0; i < thisRace.hair.length; i++) {
			addOptions(selects[5], thisRace.hair[i]);
		}

	}
}

//НАЛАШТОВУЭ ВИПАДАЙКИ РИС ХАРАКТЕРУ
function settingOfCharacter() {
	let selects = document.querySelectorAll(".additionalSettings .ideals select");
	let textareas  = document.querySelectorAll(".additionalSettings .ideals textarea");

	for(let i = 0; i < selects.length; i++) {
		let event = 
		(e) => {
				textareas[i].disabled = true;
				if(e.currentTarget.selectedIndex == 1) {
					textareas[i].disabled = false;
				}
			}

		selects[i].addEventListener("change", event);
	}
}

//КЕРУВАННЯ ЧЕКБОКСАМИ ВИПАДАЙКАМИ 
function chekboxForSelection(type, list) {
	chekboxForSelection.constant = [];
	chekboxForSelection.toChoose = [];
	chekboxForSelection.availabletoChoose = 0;

	let checkboxs = document.querySelectorAll(".additionalSettings .swiperLists .swipeList2 .listOfSkills > div > input");

	if(type == "background") {
		return chekboxForSelectionBackground(list, checkboxs);
	}

	if(type == "class") {
		return chekboxForSelectionClass(list, checkboxs);
	}
}

//СТВОРЕННЯ ВИПАДАЙОК ЗАКЛИНАНЬ
function createSelectsForSpells(e) {
	let parent = document.querySelector(".additionalSettings .swiperLists .spellSelect");

	clearAllChild(parent);

	if(e.currentTarget.selectedIndex > 0) {
		let pClass = listOfClasses[e.currentTarget.selectedIndex-1];

		sortSpellsFromID(pClass.complotList, complot);
		sortSpellsFromID(pClass.spellList, spells);

		createSpellSelector(pClass.complotList, complot, pClass.complotNum, parent,"complotNum", "Заговори");
		createSpellSelector(pClass.spellList, spells, pClass.allSpells, parent,"spellsNum", "Заклинання");
	}

}

function sortSpellsFromID(list, fullList) {
	let PspellsID = deepClone(list);
	let listOfNames = [];
	
	return list.sort( (a,b) => {
      let prop1=fullList[a].name.toLowerCase();
      let prop2=fullList[b].name.toLowerCase();

      if (prop1 < prop2) return -1;
      if (prop1 > prop2) return 1;
      return 0;
	});
}

function createSpellSelector(listOfAvilable, listForTake, count, parent, className,text) {
	if(count > 0) {
			let div = document.createElement("div");
			div.classList.add(className);

			let p = document.createElement("p");
			p.innerHTML = text;

			for(let i = 0; i < count; i++) {
				let select = createSelectInPlace("Вибір " + (i+1), div, 10);
			  addOptions(select, "--Випадково--");
			  for(let arrEl of listOfAvilable) addOptions(select, listForTake[arrEl].name);
			 }

			parent.appendChild(p);
			parent.appendChild(div);

		}
}

function chekboxForSelectionBackground(list, checkboxs) {
	return (e) => {
		for(let i = 0; i < chekboxForSelection.constant.length; i++) {
			checkboxs[chekboxForSelection.constant[i]].checked = false;

			if(contains(chekboxForSelection.toChoose, chekboxForSelection.constant[i]) && chekboxForSelection.availabletoChoose) {
				checkboxs[chekboxForSelection.constant[i]].disabled = false;
			}
		}

  	if(e.currentTarget.selectedIndex > 0) {

  		chekboxForSelection.constant = deepClone( list[e.currentTarget.selectedIndex-1].skills );

			for(let i = 0; i < chekboxForSelection.constant.length; i++) {
				if(checkboxs[chekboxForSelection.constant[i]].checked && !checkboxs[chekboxForSelection.constant[i]].disabled) {
					chekboxForSelection.availabletoChoose++;

					turnOnAvilibleCheckboxs(checkboxs)
	      	changeSkillsCounter();
				}

				checkboxs[chekboxForSelection.constant[i]].checked = true;
				checkboxs[chekboxForSelection.constant[i]].disabled = true;
			}
  	}

  	if(e.currentTarget.selectedIndex <= 0) {
  		for(let i = 0; i < chekboxForSelection.constant.length; i++) {
				checkboxs[chekboxForSelection.constant[i]].checked = false;
			}	
			chekboxForSelection.constant = [];
  	}

	}
}

function chekboxForSelectionClass(list, checkboxs) {
	return (e) => {
	  let classes = document.getElementById("class");
	  if(classes.selectedIndex > 0) {
	    
	    let checkboxs = document.querySelectorAll(".additionalSettings .swiperLists .swipeList2 .listOfSkills > div > input");
	    
	    for(let i = 0; i < chekboxForSelection.toChoose.length; i++) {
	      if(checkboxs[chekboxForSelection.toChoose[i]].disabled == false) {
	        checkboxs[chekboxForSelection.toChoose[i]].checked = false;
	        checkboxs[chekboxForSelection.toChoose[i]].disabled = true;
	      }
	    }

	    chekboxForSelection.toChoose = deepClone( list[e.currentTarget.selectedIndex-1].skills );
	    chekboxForSelection.availabletoChoose = list[e.currentTarget.selectedIndex-1].skillsNum;

		turnOnAvilibleCheckboxs(checkboxs)
  	}

  	if(classes.selectedIndex <= 0) {
  		for(let i = 0; i < chekboxForSelection.toChoose.length; i++) {
	      if(checkboxs[chekboxForSelection.toChoose[i]].disabled == false) {
	        checkboxs[chekboxForSelection.toChoose[i]].checked = false;
	        checkboxs[chekboxForSelection.toChoose[i]].disabled = true;
	      }
	    }
	    chekboxForSelection.availabletoChoose = 0;
	    chekboxForSelection.toChoose = [];
  	}

  	changeSkillsCounter();

	}
}

//ВКЛЮЧАЄ ДОСТУПНІ ЧЕКБОКСИ
function turnOnAvilibleCheckboxs(checkboxs) {
  for(let i = 0; i < chekboxForSelection.toChoose.length; i++) {
    if(checkboxs[chekboxForSelection.toChoose[i]].disabled == true && !checkboxs[chekboxForSelection.toChoose[i]].checked) {

      checkboxs[chekboxForSelection.toChoose[i]].disabled = false;
    }
  }
}

//Змінити лічильник доступних скілів
function changeSkillsCounter(){
	document.querySelector(".swiperLists .swipeList2 .canChoose").innerHTML = `Можливо вибрати: ${chekboxForSelection.availabletoChoose}`;
}


//МОЖЛИВІСТЬ ВВОДИТИ ЛИШЕ ПЕВНУ КІЛЬКІСТЬ ЧЕКБОКСІВ
function checkBoxChecked(e) {
	let checkboxs = document.querySelectorAll(".additionalSettings .swiperLists .swipeList2 .listOfSkills > div > input");

	if(e.currentTarget.checked) {
		chekboxForSelection.availabletoChoose--;

		if(chekboxForSelection.availabletoChoose == 0) {
	    for(let i = 0; i < chekboxForSelection.toChoose.length; i++) {
	      if(!checkboxs[chekboxForSelection.toChoose[i]].disabled && !checkboxs[chekboxForSelection.toChoose[i]].checked) {
	        checkboxs[chekboxForSelection.toChoose[i]].checked = false;
	        checkboxs[chekboxForSelection.toChoose[i]].disabled = true;
	      }
	    }
		}
	}

	if(!e.currentTarget.checked) {
	chekboxForSelection.availabletoChoose++;

    for(let i = 0; i < chekboxForSelection.toChoose.length; i++) {
      if(checkboxs[chekboxForSelection.toChoose[i]].disabled == true && !checkboxs[chekboxForSelection.toChoose[i]].checked) {
        checkboxs[chekboxForSelection.toChoose[i]].disabled = false;
      }
    }
	}

	document.querySelector(".swiperLists .swipeList2 .canChoose").innerHTML = `Можливо вибрати: ${chekboxForSelection.availabletoChoose}`;
}

function addEventToCheckBoxes(selector, event) {
	let arrOfEl = document.querySelectorAll(selector);
	for(let i = 0; i < arrOfEl.length; i++) {
		arrOfEl[i].addEventListener("change", event);
	}
}

//НАЛАШТУВАННЯ ВИПАДАЙОК
function selectEventer(selector, size) { 
	let arrOfSelect = document.querySelectorAll(selector);
	for(let i = 0; i < arrOfSelect.length; i++) {
		selectEventerForOneSelect(arrOfSelect[i], size);
	}
}

//НАЛАШТУВАННЯ ВИПАДАЙОК
function selectEventerForOneSelect(selector, size) { 
		selector.addEventListener("focus", (e) => {e.currentTarget.size = size; e.currentTarget.style.zIndex = 100});
		selector.addEventListener("blur", (e) => {e.currentTarget.size = 1; e.currentTarget.style.zIndex = 1});
		selector.addEventListener("change", (e) => {e.currentTarget.size=1; e.currentTarget.blur(); e.currentTarget.style.zIndex = 1});
	
}

//ПРИВ`ЯЗУВАННЯ ХАРАКТЕРИСТИК 
function linkSelectToStats(selector) {
	let arrOfSelect = document.querySelectorAll(selector);

	let focus = (e) => {
		if(e.currentTarget.selectedIndex) {
			listOfStats.push(+e.currentTarget.value);
			listOfStats.sort((a,b) => b-a);
		}
		clearAllChild(e.currentTarget);

		addOptions(e.currentTarget, "R");
		for(let i = 0; i < listOfStats.length; i++) {
			addOptions(e.currentTarget, listOfStats[i])
		}
	}; 

	let change = (e) => {
		let index = e.currentTarget.selectedIndex;

		if(index == 0) {
			return;	
		}

		if(index > 0) {
			listOfStats.splice(index-1, 1);
		}
	}; 

	for(let i = 0; i < arrOfSelect.length; i++) {
		arrOfSelect[i].addEventListener("focus", focus);
		arrOfSelect[i].addEventListener("change", change);
	}
}

//КНОПКИ ЗАГРУЗКИ ЗОБРАЖЕННЯ
function submit()  {
    let f = document.getElementById("pic").files[0];
    if (f) {
       document.getElementById("imgWithPlayer").src = URL.createObjectURL(f);
    }
}

//КНОПКИ


//НАЛАШТУВАННЯ ВИПАДАЙОК
selectEventer("header .panel .buttons .select select", 16);
selectEventer(".additionalSettings .starterPropsSettings .select select ", 10);
selectEventer(".additionalSettings .statsSettings .select select ", 7);
selectEventer(".additionalSettings .look .select select", 10);
selectEventer(".additionalSettings .ideals .select select", 2);
linkSelectToStats(".additionalSettings .statsSettings .select select ");
//ВКУЛЮЧАЄ/ВИКЛЮЧАЄ БОКОВУ ПАНЕЛЬ
document.querySelector("header .settingsIco").onclick = () => {
  let panel = document.querySelector(".additionalSettings");

  if(!panel.classList.contains("active")) {
    panel.classList.add("active");
  } else {
    panel.classList.remove("active");
  }
}

//ВИПАДАЙКА ПІДРАС
document.getElementById("race").addEventListener("change", 
  addSubRaceFromSelecter(listOfRaces, 
    el=>el.subraces.map(
      a=>a.race
    )
  )
);

//ВИПАДАЙКА РИС ХАРАКТЕРУ
settingOfCharacter();

//ВИПАДАЙКА РИС ХАКТЕРУ
//document.getElementById("subrace").addEventListener("change",  settingOfLook);

//ВИПАДАЙКА ВИГЛЯДУ
document.getElementById("subrace").addEventListener("change",  settingOfLook);

//ВИПАДАЙКА ПРЕДІСТОРІЙ
document.getElementById("background").addEventListener("change", 
  addSubItemsFromSelecter("subbackround", listOfBackgrounds, 
    el=>el.specialty
  )
);

//ВИПАДАЙКА КЛАСІВ 
document.getElementById("class").addEventListener("change", createSelectFromItems);
document.getElementById("class").addEventListener("change", createSelectsForSpells);

//ЧЕКБОКСИ
document.getElementById("background")
.addEventListener("change", chekboxForSelection("background", listOfBackgrounds));

document.getElementById("class")
.addEventListener("change", chekboxForSelection("class", listOfClasses));

addEventToCheckBoxes(".swiperLists .swipeList2 .listOfSkills input", checkBoxChecked);