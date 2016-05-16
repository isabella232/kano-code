Feature:

Scenario: Progress tracking updates each step
 Given the story test_tooltip page is opened
  When the user completes a step
  Then the progress meter updates
   And the next tooltip loads with the next step
