class namedFunction {
  constructor(name, f){
    this.name = name;
    this.f = f;
  }
}

function takeFromListOfAvilableItem(list, boolFuntion) {
  let listOfItems = [];

  for(let i = 0; i < list.length; i++) {
    if(boolFuntion(list[i])) listOfItems.push(list[i]);
  }

  return listOfItems[randomInteger(0, listOfItems.length-1)];
}

function pushCloneElement(place, ...item) {
  for(let i = 0; i < item.length; i++) place.push( deepClone(item[i]));
}

function pushCountedItemNumber(place, item, count) {
  for(let i = 0; i < count; i++) pushCloneElement(place, item);
}

function pushCloneElementWithEdit(place, item, text) {
  item =  deepClone(item);
  item.name += " " +text;
  place.push(item);
}

function takeLanguage(player, count) {
  item = deepClone(languages);
  item = shuffle(item);
  for(let i = 0, j = 0; j < item.length && i < 1; j++ ) {
    if(contains(player.languages, item[j])) continue;
    pushCloneElement(player.languages, item[j]);
    i++;
  }
}

function takeRandomObjects(place, arr , count) {
  item = deepClone(arr);
  item = shuffle(item);
  for(let i = 0, j = 0; j < item.length && i < 1; j++ ) {
    if(contains(place, item[j].name)) continue;
    pushCloneElement(place, item[j].name);
    i++;
  }
}