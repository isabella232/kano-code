Feature: Renaming part

  Background:
    Given the loaded app is rename-part
      And the editor page is opened

  Scenario: I want to rename a part previously added
     When I click on the part 'button' in the part list
      And I type 'plus' in the part editor name input
      And I click on the done button in the part editor
      And I wait 500ms
     Then the part 'button' should not exist
      And the part 'buttonplus' should exist
      And the block 'buttonplus#set_background_colour' should exist
