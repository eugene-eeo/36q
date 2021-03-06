(function(){
    "use strict";

    window.$ = nut;

    var seed = +atob(window.location.hash.substr(1));
    if (seed.toString() === "NaN" || window.location.hash.substr(1) === "") {
        // 2^10 possible states should keep everyone busy
        seed = Math.floor(1048576 * Math.random());
        window.location.hash = btoa("" + seed);
    }

    var storageKey = "5fb12e6a-36q-" + seed;
    var rng = xor128(seed);
    var deck = [];
    window.DECK_DATA.forEach(function(array, i) {
        shuffle(array, rng);
        deck = deck.concat(array.map(function(text) {
            return {set: i+1, text: text};
        }));
    });

    function getPointer() {
        var pointer = +window.localStorage.getItem(storageKey);
        if (pointer > 0 && pointer.toString() !== "NaN") {
            return pointer;
        }
        window.localStorage.setItem(storageKey, 0);
        return 0;
    }

    var pointer = getPointer();

    function prev() {
        if (pointer > 0) {
            pointer--;
            updateUI(pointer);
        }
    }

    function next() {
        if (pointer < deck.length - 1) {
            pointer++;
            updateUI(pointer);
        }
    }

    evee.on(document, 'keydown', function(ev) {
        switch (ev.keyCode) {
            case 37: prev(); ev.preventDefault(); break;
            case 39: next(); ev.preventDefault(); break;
        }
    });

    evee.on($.el('#prev'), 'click', prev);
    evee.on($.el('#next'), 'click', next);

    function updateUI(ptr) {
        var card = deck[ptr];
        var elem = $.el('#card');

        $.el('.num',  elem).textContent = ptr + 1;
        $.el('.text', elem).textContent = card.text;
        $.el('.set',  elem).textContent = card.set;

        var classList = elem.classList;
        classList.toggle('set1', card.set === 1);
        classList.toggle('set2', card.set === 2);
        classList.toggle('set3', card.set === 3);

        window.localStorage.setItem(storageKey, pointer);
    }

    updateUI(pointer);
})();
