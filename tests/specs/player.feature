Feature: App Player

  Scenario: App is played
    Given that an app exists
    When the user opens the player for an app
    Then the app is loaded full-screen
     And begins running automatically
     And the app has Made with Kano branding

  Scenario: Visitor opens link to app
    Given the user has a URL to an app
     And the user is not logged in
    When the user opens the app URL
    Then the app is played
     And no authentication is required

  Scenario: Visitor opens bad link
    Given the user has a URL to an app
     And the app does not exist
    When the user opens the app URL
    Then there is an error message explaining the problem

  Scenario: Visitor tries to open root URL
    When the user tries to open the player root URL (e.g. app.kano.me) without an app specified
    Then the user is redirected to the Make Apps landing page

  Scenario: See the code
    Given the user is not logged in
    When the user clicks the See Code link
    Then the app is loaded in the editor

  Scenario: See related projects

  Scenario: Share via URL

  Scenario: Share via Social