Feature: Playground

Extends Editor

  Scenario: Logged out user loads editor
    Given that a user is logged out
    When the user arrives on /make
    Then a login message appears
    When they log in
    Then the editor is loaded

  Scenario: First load
    Given that the user is logged in
     And the user has never used the editor
    When they land on the editor (e.g. /make)
    Then they see the editor empty state

  Scenario: Resume editing saved app
    Given that the user is logged in
     And the user has used the editor before
    When they land on the editor (e.g. /make)
    Then the editor loads the app they were last building