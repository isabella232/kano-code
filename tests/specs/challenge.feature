Feature: Challenge

Extends Editor

  Scenario: Progress tracking updates each step
    When a user completes a step
    Then the progress meter updates
     And the next tooltip loads with the next step

  Scenario: No way out
    Given that a user is in the middle of a project
    When they look for a way to share or go to the next challenge
    Then they find nothing because they are trapped mwahahahahahaha

  Scenario: Tooltips with next buttons work
    Given a tooltip with a next button is open
    When the user clicks next
    Then the next step is loaded

  Scenario: User can play with creation when done
    When the user has finished building their creation
    Then they are given a chance to press play and play with their app

  Scenario: User completes last step
    When the user completes the last step
    Then a modal appears
     And it encourages the user to share
     And it contains remix options
     And the user can move to the next challenge

  Scenario: User can move to the next challenge
    Given that a challenge has been completed
    When the user clicks the next challenge link
    Then the next challenge is loaded

  Scenario: Remix
    Given that the completed modal is open
    When the user clicks the remix button
    Then they are returned to the editor
     And they can remix for as long as they like
     And links to share and go to the next challenge appear in the UI
