'use strict';

let webdriver = require('selenium-webdriver'),
    url = require('url'),
    should = require('should'),
    user = null,
    capability = webdriver.Capabilities.chrome(),
    driver;

const DEFAULT_TIMEOUT = 5000,
      // testing user creating in staging env
      USER = {
          token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6InRlc3RAa2Fuby5tZSIsInVzZXJuYW1lIjoiYXV0b21hdGVkLXRlc3QiLCJpYXQiOjE0NjMyMjkxMDR9.-wowXt2oF7iCSuyxxfcJJoirsYsT0-dwbbe9FxhIusU'
      },
      PORT_MAP = {
          'chrome': 3333,
          'firefox': 4444,
          'safari': 5555
      };

user = USER;

function buildDriver(capability) {
    return new webdriver.Builder()
        .withCapabilities(capability)
        .build();
}

if (process.env.TARGET_BROWSER === 'firefox') {
    capability = webdriver.Capabilities.firefox();
} else if (process.env.TARGET_BROWSER === 'safari') {
    capability = webdriver.Capabilities.safari();
}

driver = buildDriver(capability);
driver.manage().timeouts().setScriptTimeout(DEFAULT_TIMEOUT);
driver.manage().timeouts().pageLoadTimeout(DEFAULT_TIMEOUT);
driver.manage().timeouts().implicitlyWait(DEFAULT_TIMEOUT);

function getDriver() {
    return driver;
}

function getBrowserName() {
    return capability.get('browserName');
}

function getPort() {
    return PORT_MAP[getBrowserName()];
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
            'community creations': '/apps'
        };
        this.viewMap = {
            'landing': 'kano-view-home',
            'editor': 'kano-view-workshop',
            'community creations': 'kano-view-apps'
        };
        this.firstStory = 'background_color';
        this.buttonMap = {
            'link to start the content': 'a#get-started',
            'new app button': 'kano-app-list a#new-app',
            'link to see all community created apps': 'a#see-all-community'
        };
        this.loginUser = loginUser;
        this.logoutUser = logoutUser;
    }
    /**
     * Wait for an element to be present on the page
     */
    waitFor (selector, timeout) {
        timeout = timeout || DEFAULT_TIMEOUT;
        return driver.wait(function () {
            return driver.isElementPresent({ css: selector });
        }, timeout);
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
    openApp (page) {
        let route;
        page = page || 'landing';
        route = this.routeMap[page];
        if (!route) {
            return Promise.reject(new Error(`Tried to open a non registered page: ${page}`));
        }
        return this.driver.get(`http://localhost:${getPort()}${route}`)
            .then(() => this.clearStorage())
            .then(() => {
                this.currentView = page;
                if (user) {
                    return this.driver.executeScript(`
                        localStorage.setItem('KW_TOKEN', '${user.token}');
                    `);
                }
            });
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
                element = arguments[1] || document;
            for (var i = 0, len = pieces.length; i < len; i++) {
                element = element.querySelector(pieces[i]);
                if (!element) {
                    throw new Error('Could not find element ' + pieces[i]);
                }
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
        }, timeout)
            .then(() => {
                return el;
            })
            .catch(() => {
                throw new Error('The element is not displayed on the page');
            });
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
     * Assert that the current view s th one expected
     */
    assertCurrentView (view) {
        let tagName = this.viewMap[view];
        if (!tagName) {
            throw new Error(`View ${view} doesn't exists`);
        }
        return this.getDeepElement(`kano-app kano-routing kano-view`)
            .then((el) => this.getFirstChild(el))
            .then((el) => el.getTagName(el))
            .then((viewTagName) => {
                viewTagName.should.be.eql(tagName);
                this.currentView = view;
            });
    }
    /**
     * utility function to not have to save the current view in the step definitions
     */
    getDeepElementInView (selector) {
        let viewTagName = this.viewMap[this.currentView];
        if (!viewTagName) {
            throw new Error(`No view is currently displayed`);
        }
        return this.getDeepElement(`kano-app kano-view ${viewTagName} ${selector}`);
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
    /**
     * Wait for an element to be visible and click on it. Uses `getDeepElementInView`
     */
    clickOn (target) {
        let selector = this.buttonMap[target];
        return this.getDeepElementInView(selector)
            .then((el) => this.waitForDisplayed(el))
            .then((el) => el.click());
    }
}

module.exports.World = World;
module.exports.getDriver = getDriver;
module.exports.getPort = getPort;
module.exports.loginUser = loginUser;
module.exports.logoutUser = logoutUser;
