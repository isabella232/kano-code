Feature: Adding parts

  Background:
    Given the editor page is opened

  Scenario: I want to see blocks underneath a category
     When I click on the control category
     Then flyout should be visible
