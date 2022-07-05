function addOptions(select, text) {
    let option = document.createElement('option');
    option.innerHTML = text;
    select.appendChild(option);
}

//ДОБАВИТИ ОПЦІЇ ДЛЯ ВИБОРА
function addListOfOptions(selectorID, arr, propFunction) {
  let select = document.getElementById(selectorID);

  addOptions(select, "--Випадково--");

  for(let arrEl of arr) addOptions(select, propFunction(arrEl));
}

function addCheks(place) {
  let listOFSkillsNames = ["Акробатика","Аналіз","Атлетика","Уважність","Виживання","Виступ","Запугування",
  "Історія","Спритність рук","Магія","Медицина","Обман","Природа","Проникливість","Релігія","Скритність","Переконання","Догляд за тваринами"];
  for(let i = 0; i < 18; i++) {
    let div = document.createElement('div');
    let input = document.createElement('input');
    let p = document.createElement('p');;

    input.setAttribute('type', "checkbox");
    p.innerHTML =  listOFSkillsNames[i];
    input.disabled = true;

    div.appendChild(input);
    div.appendChild(p);
    place.appendChild(div);
  }

}

//СТВОРЕННЯ ЕЛЕЛЕМЕНТІВ
addCheks(document.querySelector(".listOfSkills"));

//НАПОВНЕННЯ ВИПАДАЙОК
addListOfOptions("race", listOfRaces,(el) => el.name);
addListOfOptions("class", listOfClasses, (el) => el.class);
addListOfOptions("background", listOfBackgrounds, (el) => el.background);
addListOfOptions("outlook", outlook, el => el);


