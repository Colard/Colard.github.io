class Player {
	constructor(race, playerClass, background, outlookID) {
		this.race = race;
		this.class = playerClass;
		this.background = background;
		this.outlookID = outlookID;
		
		this.masterBonus = 2;

		this.stats = [0, 0, 0, 0, 0, 0];
		this.modifierStats = [];

		this.hits = this.class.hitDice[1];
		this.saveDice = this.class.saveDice;
		this.speed = this.race.speed; 

		this.skills = [];
  		this.cleanSkills();

  		this.featuresList = [];
  		this.KD = [0, 0];
	}

	addStats(arr) {
		for(let i = 0; i < 6 || i < arr.length; i++) {
			this.stats[i] = arr[i];
		}

  		this.addBonusesToStats(this.race.increaseCharacteristic);
		this.calcStatsModifier();

		return this;
	}

	addBonusesToStats(arr) {
		for(let i = 0; i < 6 || i < arr.length; i++)  {
		    this.stats[i] += arr[i];
		    if(this.stats[i] > 20) this.stats[i] = 20;
		}
		this.calcStatsModifier();
	}

	calcStatsModifier() {
		for(let i = 0; i < 6; i++) this.modifierStats[i] = -5+(Math.trunc((this.stats[i]) / 2));
		this.іnitiative = this.modifierStats[1];
	}

	cleanSkills() {
		for(let i = 0; i < 18; i++) this.skills[i] = 0;
	}
}
