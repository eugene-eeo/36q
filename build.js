!function() {
  var mouseEvents = /^click|mouse(down|up|move)$/;
  var keybdEvents = /^key(down|up|press)$/;

  evee = {
    on: function(el, type, fn) {
      el.addEventListener(type, fn);
      return fn;
    },

    off: function(el, type, fn) {
      el.removeEventListener(type, fn);
    },

    fire: function(el, type, config) {
      config = config || {
        bubbles: true,
        cancelable: true,
      };
      var cons = mouseEvents.test(type)
        ? MouseEvent
        : (keybdEvents.test(type) ? KeyboardEvent : Event);
      el.dispatchEvent(new cons(type, config));
    },
  };
}();
nut = function(s, ctx) {
  ctx = nut.el(ctx);
  return [].slice.call(
    /^\.[\w\-]+$/.test(s)
      ? ctx.getElementsByClassName(s.slice(1))
      : ctx.querySelectorAll(s));
};

nut.el = function(s, ctx) {
  if (typeof s != 'string') {
    return s || document;
  }
  ctx = nut.el(ctx);
  return /^#[\w\-]+$/.test(s) && ctx.getElementById
    ? ctx.getElementById(s.slice(1))
    : ctx.querySelector(s);
};
/**
 * Randomize the order of the elements in a given array.
 * @param {Array} arr - The given array.
 * @param {Function} rng - Specifies a custom random number generator.
 * @returns {Array}
 */
function shuffle(arr, rng) {
  var len = arr.length,
      random,
      temp;

  while (len) {
    random = Math.floor(rng() * len);
    len -= 1;
    temp = arr[len];
    arr[len] = arr[random];
    arr[random] = temp;
  }

  return arr;
}
// A Javascript implementaion of the "xor128" prng algorithm by
// George Marsaglia.  See http://www.jstatsoft.org/v08/i14/paper

(function(global, module, define) {

function XorGen(seed) {
  var me = this;

  // Set up generator function.
  me.next = function() {
    var t = me.x ^ (me.x << 11);
    me.x = me.y;
    me.y = me.z;
    me.z = me.w;
    return me.w ^= (me.w >> 19) ^ t ^ (t >> 8);
  };

  function init(me, seed) {
    me.x = seed;
    me.y = 0;
    me.z = 0;
    me.w = 0;
    // Discard an initial batch of 64 values.
    for (var k = 64; k > 0; --k) {
      me.next();
    }
  }

  init(me, seed);
}

function impl(seed, opts) {
  if (!seed) seed = +(new Date);
  var xg = new XorGen(seed),
      state = opts && opts.state,
      prng = function() { return (xg.next() >>> 0) / ((1 << 30) * 4); };
  prng.double = function() {
    do {
      var top = xg.next() >>> 11,
          bot = (xg.next() >>> 0) / ((1 << 30) * 4),
          result = (top + bot) / (1 << 21);
    } while (result === 0);
    return result;
  };
  prng.int32 = xg.next;
  if (state) {
    if (state.X) copy(state, xg);
    prng.state = function() { return copy(xg, {}); }
  }
  return prng;
}

if (module && module.exports) {
  module.exports = impl;
} else if (define && define.amd) {
  define(function() { return impl; });
} else {
  this.xor128 = impl;
}

})(
  this,
  (typeof module) == 'object' && module,    // present in node.js
  (typeof define) == 'function' && define   // present with an AMD loader
);

(function(){
    "use strict";

    window.$ = nut;

    var appUid = "5fb12e6a";
    var seed = +atob(window.location.hash.substr(1));

    if (seed.toString() === "NaN" || window.location.hash.substr(1) === "") {
        // 2^10 possible states should keep everyone busy
        seed = Math.floor(1048576 * Math.random());
        window.location.hash = btoa("" + seed);
    }

    var deck = [
        {set: 1, text: 'Given the choice of anyone in the world, whom would you want as a dinner guest?'},
        {set: 1, text: 'Would you like to be famous? In what way?'},
        {set: 1, text: 'Before making a telephone call, do you ever rehearse what you are going to say? Why?'},
        {set: 1, text: 'What would constitute a “perfect” day for you?'},
        {set: 1, text: 'When did you last sing to yourself? To someone else?'},
        {set: 1, text: 'If you were able to live to the age of 90 and retain either the mind or body of a 30-year-old for the last 60 years of your life, which would you want?'},
        {set: 1, text: 'Do you have a secret hunch about how you will die?'},
        {set: 1, text: 'Name three things you and your partner appear to have in common.'},
        {set: 1, text: 'For what in your life do you feel most grateful?'},
        {set: 1, text: 'If you could change anything about the way you were raised, what would it be?'},
        {set: 1, text: 'Take four minutes and tell your partner your life story in as much detail as possible.'},
        {set: 1, text: 'If you could wake up tomorrow having gained any one quality or ability, what would it be?'},

        {set: 2, text: 'If a crystal ball could tell you the truth about yourself, your life, the future or anything else, what would you want to know?'},
        {set: 2, text: 'Is there something that you’ve dreamed of doing for a long time? Why haven’t you done it?'},
        {set: 2, text: 'What is the greatest accomplishment of your life?'},
        {set: 2, text: 'What do you value most in a friendship?'},
        {set: 2, text: 'What is your most treasured memory?'},
        {set: 2, text: 'What is your most terrible memory?'},
        {set: 2, text: 'If you knew that in one year you would die suddenly, would you change anything about the way you are now living? Why?'},
        {set: 2, text: 'What does friendship mean to you?'},
        {set: 2, text: 'What roles do love and affection play in your life?'},
        {set: 2, text: 'Alternate sharing something you consider a positive characteristic of your partner. Share a total of 5 items.'},
        {set: 2, text: 'How close and warm is your family? Do you feel your childhood was happier than most other people’s?'},
        {set: 2, text: 'How do you feel about your relationship with your mother?'},

        {set: 3, text: 'Make three true “we” statements each. For instance, “We are both in this room feeling…”'},
        {set: 3, text: 'Complete this sentence: “I wish I had someone with whom I could share …”'},
        {set: 3, text: 'If you were going to become a close friend with your partner, please share what would be important for him or her to know.'},
        {set: 3, text: 'Tell your partner what you like about them; be very honest this time, saying things that you might not say to someone you’ve just met.'},
        {set: 3, text: 'Share with your partner an embarrassing moment in your life.'},
        {set: 3, text: 'When did you last cry in front of another person? By yourself?'},
        {set: 3, text: 'Tell your partner something that you like about them already.'},
        {set: 3, text: 'What, if anything, is too serious to be joked about?'},
        {set: 3, text: 'If you were to die this evening with no opportunity to communicate with anyone, what would you most regret not having told someone? Why haven’t you told them yet?'},
        {set: 3, text: 'Your house, containing everything you own, catches fire. After saving your loved ones and pets, you have time to safely make a final dash to save any one item. What would it be? Why?'},
        {set: 3, text: 'Of all the people in your family, whose death would you find most disturbing? Why?'},
        {set: 3, text: 'Share a personal problem and ask your partner’s advice on how he or she might handle it. Also, ask your partner to reflect back to you how you seem to be feeling about the problem you have chosen.'},
    ];
    shuffle(deck, xor128(seed));

    function getPointer() {
        var pointer = +window.localStorage.getItem(appUid);
        if (pointer > 0 && pointer.toString() !== "NaN") {
            return pointer;
        }
        window.localStorage.setItem(appUid, 0);
        return 0;
    }

    var pointer = getPointer();
    var setDescriptions = {
        1: 'Half deep questions, but not too personal.',
        2: 'About dreams and relationships. Might escalate and be quite emotional. It’s your choice what to talk about and what to not.',
        3: 'D E E P',
    };

    evee.on(document, 'keydown', function(ev) {
        switch (ev.keyCode) {
            case 37: prev(); ev.preventDefault(); break;
            case 39: next(); ev.preventDefault(); break;
        }
    });

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

    evee.on($.el('#prev'), 'click', prev);
    evee.on($.el('#next'), 'click', next);

    function updateUI(ptr) {
        var card = deck[ptr];
        var elem = $.el('#card');

        $.el('.num',  elem).textContent = ptr + 1;
        $.el('.text', elem).textContent = card.text;
        $.el('.set',  elem).textContent = card.set;
        $.el('.right', elem).setAttribute('title', setDescriptions[card.set]);

        var classList = elem.classList;
        classList.toggle('set1', card.set === 1);
        classList.toggle('set2', card.set === 2);
        classList.toggle('set3', card.set === 3);

        window.localStorage.setItem(appUid, pointer);
    }

    updateUI(pointer);
})();
