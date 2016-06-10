Feature: Landing page

  Background:
    Given the landing page is opened

  Scenario: Logged in visitor loads page
     Then the user creations are displayed

  Scenario: Get started with content
     When the user clicks the link to start the content
     Then the first story is loaded

  Scenario: Browse Kano-created projects
    Then Kano-created projects are displayed
     And projects that haven't been completed are locked

#  Scenario: See completed projects
#    Given that a user has completed a project
#     And these projects have an indication that they are complete
#    When the user clicks the link to it
#    Then the project is loaded from the beginning

#  Scenario: Open next project
#    Given that a user has completed several projects
#     And these projects have an indication that they are complete
#    When the user clicks the link of the next project without such indications
#    Then the project is loaded from the beginning

#  Scenario: Can't open locked projects
#    Given that the user has not completed all projects
#    When the user clicks the link to a locked project
#    Then nothing happens

  Scenario: Start new creation
     When the user clicks the new app button
     Then the editor page is loaded

#  Scenario: View my old creation
#    Given that a user is logged in
#      And the user has already created an app
#    When they click a link to it
#    Then the app loads in the player

#  Scenario: See all my creations
#    Given that a user is logged in
#      And the user has already created an app
#    When they click the link to see all their creations
#    Then a page showing all of their creations is loaded

#  Scenario: Open community creation
#    When a user clicks the link to a community created app
#    Then the app loads in the player

  Scenario: Start new creation
     When the user clicks the link to see all community created apps
     Then the community creations page is loaded
