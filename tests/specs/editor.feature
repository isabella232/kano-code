Feature: Editor

  Feature: App running

    Scenario: App starts running
      Given the user has added parts
       And the user has added code
      When the play button is clicked
      Then the code starts executing
       And the user can no longer add parts to the appspace
       And the user can no longer move parts in the appspace
       And the user can no longer configure a part's settings
       And the user can no longer delete a part

    Scenario: Running app responds to UI events
      Given the user has added a UI part
       And the user has added code that is triggered by a click event on this UI part
       And the app is running
      When the UI part is clicked
      Then the code triggered by the click event executes

    Scenario: Running app loads data
      Given the user has added a data part
       And the part is configured to refresh every 5 seconds
       And the user has added a text part
       And the user has set the text to update with data when it is updated
       And the app is running
      When the app first starts
       And each time 5 seconds has elapsed
      Then the data is refreshed
       And the UI part reflects the latest data

    Scenario: App stops running
      Given the user has built an app
       And the app is running
      When the stop button is clicked
      Then the app stops running
       And UI parts no longer respond to mouse events
       And parts can be moved
       And parts can be configured
       And parts can be deleted
       And parts can be added

  Feature: Menu

    Scenario: Open menu
      When the user tries to open the menu
      Then the menu appears

    Scenario: Logged out user opens menu
      Given that a user is logged out
      When they click the menu
      Then a login link appears

    Scenario: Logged in user opens menu
      Given that a user is logged in
      When they click the menu
      Then their profile information appears in the menu

  Feature: Sharing
  
    Scenario: Sharing popup
      Given the user has created an app
       And the user is logged in
      When the user clicks share
      Then a sharing popup opens
       And it contains a shareable representation of the app
       And it contains a way for the user to describe their app
       And it contains a way for users to go back to editing
       And it contains a way for users to publish their app

    Scenario: Visitor attempts to share
      Given the user has created an app
       And the user is logged out
      When the user clicks share
      Then the user is asked to log in or register

    Scenario: Sharing form completed
      Given the user has opened the sharing popup
       And the user has completed all the fields
      When they submit the form
      Then a message appears notifying the user that it is being published

    Scenario: Sharing completed
      Given the user has submitted the sharing form
      When it is done publishing
      Then the app is published on Kano World
       And a popup appears
       And it contains a live version of the app
       And it contains a url to the player
       And it contains sharing links to share on social networks

  Feature: Parts

    Scenario: Add Parts
      When the Add Parts button is clicked
      Then the parts tray opens
       And it contains all available parts organized by category

    Scenario: Drag part into app
      Given the parts tray is open
      When the user drags a part into the appspace
      Then the part stays where it was dropped
       And the code for that part appears in a new tab in the codespace
       And the events for that part can now be added

    Scenario: Part tooltip
      Given a part is on the appspace
       And the app is not running
      When the part is clicked
      Then a tooltip appears
       And it contains a way to delete the part
       And it contains a way to configure the part's settings

    Scenario: Delete an unused part
      Given a part tooltip is open
       And the part is not the background part
       And no code referencing that part exists
      When the user clicks to delete the part
      Then the part is removed from appspace
       And its blocks are removed from the codespace

    Scenario: Delete a used part
      Given a part tooltip is open
       And the part is not the background part
       And code referencing that part exists
      When the user clicks to delete the part
      Then the user is notified that they must remove references before it can be deleted

    Scenario: Configure a part
      Given a part tooltip is open
       And the part is not the speaker part
      When the user clicks to configure its settings
      Then the part configuration tray appears

    Scenario: Move a part
      Given a part exists in the appspace
       And the app is not running
      When the user drags the part
      Then the part is moved around the appspace
       And can be moved on both the background and around it

    Scenario: Make part invisible
      Given a part exists in the appspace
       And it is not positioned to be on the background part
      When the app appears in the player
      Then the part is invisible

  Feature: Data Parts

    Scenario: Manually load data
      Given a data part has been selected
       And its configuration tray is open
      When the user clicks the refresh button
      Then data is loaded
       And it appears in the data playground

  Feature: UI Parts

    Scenario: Add an image
      Given an image part has been added to the appspace
       And its configuration tray is open
      When the user clicks to change the image
      Then a menu of Kano-approved images appears

    Scenario: Change size of a part
      Given a UI part is selected
       And its configuration tray is open
      When the user changes the height or width sliders
      Then the part's size is updated on the appspace
