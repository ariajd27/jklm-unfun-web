

var usedLetters = new Set();

function getSyllable() {
  var syllable = document.getElementsByClassName("syllable")[0].innerHTML;
  return syllable;
}


function wordScore(str) {
	let s = new Set();
	for (let i = 0; i < str.length; i++) {
		s.add(str[i]);
	}
	let x = 0;
	for (const el of s) {
		if (usedLetters.has(el)) {
			continue;
		}
		x += 1;
		if (el == 'F' || el == 'V') {
			x += 1;
			continue;
		}
		if (el == 'J' || el == 'Q') {
			x += 2;
		}
	}
	return x / s.size;
}

function useWord() {
	dictionary.splice(dictionary.indexOf(bestWord), 1);
	for (var i = 0; i < bestWord.length; i++) {
		if (usedLetters.has(bestWord[i])) {
			continue;
		}
		usedLetters.add(bestWord[i]);
	}
	if (usedLetters.size == 26) {
		usedLetters = new Set();
	}
}

var bestWord;

function giveHint() {
  currentSyllable = getSyllable();
  var potentialWords = [];
  if(currentSyllable != lastSyllable) {
    var word = "Can't find matching word!";
    for (var j = 0; j < dictionary.length; j++) {
      if (dictionary[j].toLowerCase().includes(currentSyllable)){
        potentialWords.push(dictionary[j]);
      }
    }
    if (potentialWords.length > 0) {
      potentialWords.sort(function(a, b){return wordScore(a) - wordScore(b)});
	  bestWord = potentialWords[potentialWords.length - 1];
      document.getElementById("hintHolder").innerText = "PLAY: " + bestWord;
	      } else {
      document.getElementById("hintHolder").innerText = "No words found!";
    }
    lastSyllable = currentSyllable;
  }
}



function main() {
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      var syllable = document.getElementsByClassName("syllable")[0], syllableExists;
      if(typeof(syllable) == 'undefined' && syllable == null){
        syllableExists = false;
      } else {
        syllableExists = true;
      }
      if(syllableExists){
        const syllable = getSyllable(), top = document.querySelector('.quickRules');
        if(document.getElementById("hintHolder") == null){
          var hintHolder = document.createElement("p");
          hintHolder.id = "hintHolder";
          top.append(hintHolder);
        }
		document.addEventListener("keydown", function (event) {
      		if (event.key === '1') {
        		giveHint();
      		}
			if (event.key === '2') {
				useWord();
			}
    	});
	  }
    }
  );
}

var hintInterval, toggle = false, currentSyllable, lastSyllable;

window.addEventListener("load", function () {
  main();
});