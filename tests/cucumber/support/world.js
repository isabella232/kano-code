'use strict';

let webdriver = require('selenium-webdriver'),
    url = require('url'),
    should = require('should'),
    user = null,
    capability = webdriver.Capabilities.chrome(),
    driver;

const DEFAULT_TIMEOUT = process.env.EXTERNAL_SERVER ? 20000 : 10000,
      // testing user creating in staging env
      USER = {
          token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAa2Fuby5tZSIsInVzZXJuYW1lIjoiYXV0b21hdGVkLXRlc3QiLCJpYXQiOjE0NjMyMjkxMDR9.-wowXt2oF7iCSuyxxfcJJoirsYsT0-dwbbe9FxhIusU'
      };

user = USER;

function buildDriver(capability) {
    return new webdriver.Builder()
        .withCapabilities(capability)
        .build();
}

if (process.env.CAPABILITY) {
    try {
        capability = JSON.parse(process.env.CAPABILITY);
    } catch (e) {
        capability = webdriver.Capabilities[process.env.CAPABILITY]();
    }
} else {
    capability = webdriver.Capabilities.chrome();
}

driver = buildDriver(capability);
if (capability.browserName !== 'safari') {
    driver.manage().timeouts().setScriptTimeout(DEFAULT_TIMEOUT);
    driver.manage().timeouts().pageLoadTimeout(DEFAULT_TIMEOUT);
    driver.manage().timeouts().implicitlyWait(DEFAULT_TIMEOUT);
}

function getDriver() {
    return driver;
}

function getPort() {
    return process.env.TEST_PORT || 4444;
}

function logoutUser() {
    user = null;
    return Promise.resolve();
}
function loginUser() {
    user = USER;
    return Promise.resolve();
}

class World {
    constructor (callback) {
        this.webdriver = webdriver;
        this.driver = driver;

        this.shadowEnabled = false;
        this.routeMap = {
            'landing': '/',
            'editor': '/make',
            'community creations': '/apps',
            'story': '/story'
        };
        this.viewMap = {
            'landing': 'kano-view-home',
            'editor': 'kano-view-workshop',
            'community creations': 'kano-view-apps',
            'story': 'kano-view-story kano-story-scene kano-view'
        };
        this.firstStory = 'background_color';
        this.uiMap = {
            'link to start the content': 'a#get-started',
            'new app button': 'kano-app-list a#new-app',
            'link to see all community created apps': 'a#see-all-community',
            'the user creations': 'kano-app-list[view="my"]',
            'Kano\-created projects': 'kano-projects'
        };
        this.stories = {
            test_tooltip: {
                scenes: [{
                    component: 'kano-scene-editor',
                    steps: [{
                        action: 'click',
                        target: 'kano-app-editor #add-part-button'
                    }]
                }]
            }
        };

        // Elements from the scene-editor
        this.elementMap = {};
        this.elementMap.editor = 'kano-app-editor';
        this.elementMap.challenge = 'kano-app-challenge';
        this.elementMap.progressIndicator = 'kano-challenge-progress';
        this.elementMap.progressCircle = `${this.elementMap.progressIndicator} kano-cirle-progress`;

        this.loginUser = loginUser;
        this.logoutUser = logoutUser;

        // Used to store state values during the test
        this.state = {};
    }
    loadStory (id) {
        this.currentStory = {
            id,
            sceneIndex: 0,
            stepIndex: 0
        };
    }
    getLogs () {
        return this.driver.manage().logs().get('browser');
    }
    /**
     * Wait for an element to be present on the page
     */
    waitFor (selector, node, timeout) {
        let lastError;
        timeout = timeout || DEFAULT_TIMEOUT;
        node = node || this.currentView;
        return driver.wait(() => {
            return this.getDeepElement(selector, node)
                .catch((e) => {
                    lastError = e.message || e;
                    return false;
                });
        }, timeout, `Could not find element ${selector}: ${lastError}`);
    }
    /**
     * Empty the localStorage
     */
    clearStorage () {
        return this.driver.executeScript(`
            localStorage.clear('KW_TOKEN', '${this.user}');
        `);
    }
    /**
     * Open the app to a speficied route
     */
    openApp (page, ext) {
        let route,
            viewPath;
        ext = ext || '';
        page = page || 'landing';
        route = this.routeMap[page];
        if (!route) {
            return Promise.reject(new Error(`Tried to open a non registered page: ${page}`));
        }
        viewPath = user ? `kano-app kano-routing ${this.viewMap[page]}` : 'kano-app';
        return this.driver.get(`http://localhost:${getPort()}${route}${ext}`)
            .then(() => this.clearStorage())
            .then(() => {
                if (user) {
                    return this.driver.executeScript(`
                        localStorage.setItem('KW_TOKEN', '${user.token}');
                        `);
                }
            })
            .then(() => this.waitFor(viewPath))
            .then((el) => this.waitForDisplayed(el))
            .then((el) => this.currentView = el);
    }
    getAttribute (el, attr) {
        return this.driver.executeScript(`
            return arguments[0][arguments[1]];
        `, el, attr);
    }
    openStory (storyId) {
        this.loadStory(storyId);
        return this.openApp('story', `/${storyId}`)
            .then(() => this.waitForScene())
            .then(() => this.waitFor(this.elementMap.progressIndicator, this.currentSceneEl))
            .then((el) => this.getAttribute(el, 'progress'))
            .then((attr) => {
                this.state.progress = attr;
            });
    }
    waitForScene () {
        let story = this.stories[this.currentStory.id],
            scene = story.scenes[this.currentStory.sceneIndex];
        return this.waitFor(scene.component)
            .then(el => this.currentSceneEl = el);
    }
    /**
     * Get an element using a css selector
     */
    getElement (selector, node) {
        node = node || this.driver;
        return this.driver.findElement({ css: selector });
    }
    /**
     * Look for an element in a tree of custom elements
     * @param  {String} selector A selector. the separator ' ' is used to dive in custom elements
     * @param  {WebElement} node The starting point of the lookup (optional)
     * @return {Promise}
     * TODO Detect real ShadowDOM and return shadowRoot if necessary
     */
    getDeepElement (selector, node) {
        return this.driver.executeScript(`
            var pieces = arguments[0].split(' '),
                element = arguments[1] || document,
                el;
            for (var i = 0, len = pieces.length; i < len; i++) {
                el = element.querySelector(pieces[i]);
                if (!el) {
                    var tagName = element.tagName ? element.tagName.toLowerCase() : '';
                    throw new Error('Could not find element ' + pieces[i] + ' from ' + tagName);
                }
                element = el;
            }
            return element;
        `, selector, node);
    }
    /**
     * Wait for an element to be displayed on the screen
     */
    waitForDisplayed (el, timeout) {
        timeout = timeout || DEFAULT_TIMEOUT;
        return driver.wait(() => {
            return el.isDisplayed();
        }, timeout, 'The element is not displayed on the page')
            .then(() => el);
    }
    /**
     * Get the first child of a node
     */
    getFirstChild (node) {
        return this.driver.executeScript(`
            return arguments[0].firstChild;
        `, node);
    }
    /**
     * Assert that the current view is the one expected
     */
    assertCurrentView (view) {
        let tagName = this.viewMap[view];
        if (!tagName) {
            throw new Error(`View ${view} doesn't exists`);
        }
        return this.currentView.getTagName()
            .then((viewTagName) => {
                viewTagName.should.be.eql(tagName);
            });
    }
    /**
     * utility function to not have to save the current view in the step definitions
     */
    getDeepElementInView (selector) {
        return this.getDeepElement(selector, this.currentView);
    }
    /**
     * Assert that the current URL is the one expected (Check the path name)
     */
    assertCurrentUrl (pathname) {
        return this.driver.getCurrentUrl()
            .then((urlString) => {
                let parsed = url.parse(urlString);
                parsed.pathname.should.be.eql(pathname);
            });
    }
    /**
     * Utility function on top of `assertCurrentUrl`. Will get the pathname from the page mapping
     */
    assertCurrentPage (page) {
        return this.assertCurrentUrl(this.routeMap[page]);
    }
    /**
     * Utility function on top of `assertCurrentUrl`. generate the pathname based on the storyId
     */
    assertCurrentStory (storyId) {
        return this.assertCurrentUrl(`/story/${storyId}`);
    }
    assertDisplayed (target) {
        let selector = this.uiMap[target];
        if (!selector) {
            throw new Error(`The target '${target}' is not registered in the test suite`);
        }
        return this.waitFor(selector)
            .then((el) => this.waitForDisplayed(el));
    }
    /**
     * Wait for an element to be visible and click on it. Uses `getDeepElementInView`
     */
    clickOnButton (target) {
        let selector = this.uiMap[target];
        return this.clickOn(selector);
    }
    clickOn (selector) {
        return this.getDeepElementInView(selector)
            .then((el) => this.waitForDisplayed(el))
            .then((el) => el.click());
    }
    // TODO detect next step and move indexes
    validateStep () {
        let story = this.stories[this.currentStory.id],
            scene = story.scenes[this.currentStory.sceneIndex],
            step = scene.steps[this.currentStory.stepIndex];
        if (step.action === 'click') {
            return this.clickOn(`${scene.component} ${step.target}`);
        }
    }
    assertChanged (oldVal, getNewVal, timeout) {
        timeout = timeout || DEFAULT_TIMEOUT;
        return driver.wait(() => {
            return getNewVal()
                .then((newVal) => {
                    newVal.should.not.be.eql(oldVal);
                })
                .then(() => true)
                .catch(() => false);
        }, timeout);
    }
}

module.exports.World = World;
module.exports.getDriver = getDriver;
module.exports.getPort = getPort;
module.exports.loginUser = loginUser;
module.exports.logoutUser = logoutUser;
