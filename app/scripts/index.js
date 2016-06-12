/**
* Conditionally loads webcomponents polyfill if needed.
* Credit: Glen Maddern (geelen on GitHub)
*/
var webComponentsSupported = ('registerElement' in document &&
    'import' in document.createElement('link') &&
    'content' in document.createElement('template')),
    msg = 'Loading',
    started,
    timeout,
    wcPoly;

/**
 * Makes the transition between the loader and the app itself
 * Makes sure that the loader is displayed at least 1.5s to prevent flashing
 */
function onElementsLoaded() {
    var duration = new Date() - started,
        loader,
        app;
    if (duration < 1500) {
        timeout = setTimeout(onElementsLoaded, 1500 - duration);
        return;
    }
    loader = document.getElementById('loader');
    app = document.createElement('kano-app');
    document.body.insertBefore(app, loader);
    loader.className += ' animate-out';
    setTimeout(function () {
        loader.parentNode.removeChild(loader);
    }, 300);
}

/**
 * Imports the elements bundle
 */
function lazyLoadElements() {
    var elements = [
        '/elements/elements.html'
    ];

    elements.forEach(function (elementURL) {
        var elImport = document.createElement('link');
        elImport.rel = 'import';
        elImport.href = elementURL;
        elImport.addEventListener('load', onElementsLoaded);
        document.head.appendChild(elImport);
    });
}

/**
 * Optionally load the webcomponents polyfill and then load the elements bundle
 */
function deferLoading() {
    // Animate the loader to keep the user chill
    animateLoader();
    if (!webComponentsSupported) {
        wcPoly = document.createElement('script');
        wcPoly.src = '/assets/vendor/webcomponentsjs/webcomponents-lite.min.js';
        wcPoly.onload = lazyLoadElements;
        document.head.appendChild(wcPoly);
    } else {
        lazyLoadElements();
    }
}

/**
 * Display a random fact about coding, and shows a binary to text loading message
 */
function animateLoader() {
    var messageBoard = document.getElementById('message-board'),
        funFacts = [
            'Code is a set of instructions (or rules) that computers can understand',
            'People write code, code powers computers and computers power many everyday objects like phones, watches, microwaves and cars',
            'Almost anything powered by electricity uses code',
            'There are many names for people who code: coders, programmers, developers, computer scientists, software engineers, etc.',
            'Computers run on binary code—written in 1s and 0s—which is very difficult for humans to work with',
            'Computers can understand different languages (like Python, C, C++, Javascript, Lua...) which translate our instructions into binary',
            'Learning to code is like learning a new language (learning to construct sentences, etc.)',
            'A text file written in a particular language is called a program',
            'Ada Lovelace is the first computer programmer. She created the first program ever',
            'The first game was created in 1961'
        ],
        rndIndex = Math.floor(Math.random() * funFacts.length),
        title = document.getElementById('title'),
        letters = [],
        msgCopy = msg,
        updateLetter,
        len,
        i;

    updateLetter = function (i) {
        setTimeout(function () {
            var l = msgCopy.split('');
            l[i] = letters[i].shift();
            msgCopy = l.join('');
            title.innerText = msgCopy;
            if (!letters[i].length) {
                l = msgCopy.split('');
                l[i] = msg[i];
                msgCopy = l.join('');
                title.innerText = msgCopy;
                return;
            }
            updateLetter(i);
        }, (Math.random() * 100) + 50);
    };

    for (i = 0, len = msgCopy.length; i < len; i++) {
        letters.push(msgCopy[i].charCodeAt(0).toString(2).split(''));
        updateLetter(i);
    }
    started = new Date();
    messageBoard.innerText = funFacts[rndIndex];
}


// Attach the loading of the dependencies when the page is loaded
if (window.addEventListener) {
    window.addEventListener("load", deferLoading, false);
} else if (window.attachEvent) {
    window.attachEvent("onload", deferLoading);
} else {
    window.onload = deferLoading;
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(function (registration) {}).catch(function (err) {});
}
