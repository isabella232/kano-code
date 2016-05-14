Feature: Landing page

Scenario: Start new creation
  Given that a user is logged in
    And the landing page is opened
   When the user clicks the link to see all community created apps
   Then the community creations page is loaded
