Feature: App Player

  Scenario: App is played
    Given that an app exists
    When the user opens the player for an app
    Then the app is loaded full-screen
     And begins running automatically
     And parts outside the background part are invisible
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

  Scenario: Player menu loads
    Given the app has loaded
    When the user hovers over the bottom of the player
    Then the player menu appears
     And it contains a link to see the code
     And it has sharing links
     And it contains the app's URL
     And it shows related apps
     And it shows who created the app

  Scenario: See the code
    Given the menu has loaded
    When the user clicks the See Code link
    Then the app is loaded in the editor

  Scenario: Share via Social Links
    Given the menu has loaded
    When the user clicks the sharing links 
    Then a sharing form from the relevant network is loaded
     And the metadata from the app is populated

  Scenario: Share via URL
    Given the menu has loaded
    When the user clicks the URL
    Then it is copied to the clipboard

  Scenario: Open a related app
    Given the menu has loaded
    When the user clicks on a related app
    Then the app opens in the player

  Scenario: Learn more about the author
    Given the menu has loaded
    When the user clicks on the author of the app
    Then the author's Kano World profile is loaded
