# Phrasal Template Word Game
This is a word game where the user can input word that will appear in a story, often resulting in silly or unusual phrases.

There are multiple versions.
* Simple: this is a project designed to be taught within about 30 minutes worth of coding (leaving up to an additional hour for explanations, questions, and troubleshooting).
* Intermediate: this one shows off some minor changes to the simple code that will enhance the programmer's skills and improve the user experience.
* Advanced: this version is a challenge version where the entire user experience is improved, greatly increasing the complexity of the code.

Getting from one version to the next requires increasingly greater understandings and skills.

Objectives:
* Don't worry about the nitty gritty of "good" javascript. Just write code that works and learn basic concepts.
* Try implementing some of the intermediate features on your own, without looking at the final version of the code.

# Simple Teaching Agenda
Try to touch on the following points of interest as you present the code and work the students through completing the project.

## Download and Setup
Ideally, the final story should be a surprise for the student. It's more fun that way. You can choose to provide the story in the initial download or give it to them at the end and use a dummy file for development.

This project can be completed with Notepad or some other basic text editor, but some students may wish to work in VS Code or Notepad++. The students can be encouraged to look into advanced text editors for programming and make a selection before the class. They can install the software ahead of time and learn to use it to create, edit, and save a basic text file.

Some students may struggle with saving files with a particular extension, should the need arise. The simple version of this project does not require creating any new files or documents, though in order to complete some of the more advanced features they may need help setting their operating system to display extensions, or at least learning to use their text editor to override the default filetype.

## Quick Overview
Talk the students through the existing code briefly. Introduce concept of "black box" code where we know how to use it, but don't really care how it works. It takes information in and spits information out predictably. Show off the structure of the data passed into main(), talk about commented-out code, comments, and console logging, and show how to open the project and look at console output and explore the data in the console.

## Write the Code
There are relatively few moving parts here. First the students should look at the data that we're starting with and figure out what might need to be done in order to get to the end goal. Define the goal.

### FOR loop
The inputs are stored in an indexed *array*. The most basic way to iterate through an indexed arrray is to use a FOR loop. Indexing nearly always begins with zero in programming (though there are baffling exceptions).
Go over setting up the loop and understanding how it "thinks" then have them think about how that will be useful for our program. Alternatively, before introducing the loop, talk about the indexed array and see if they can figure out how to describe what we can do with that information to accomplish our goal.

### Getting User Input
An antiquated but simple way to get user input is the javascript *prompt()*. We can store the value a user enters into a variable of our own.

### Altering the String
String manipulation is powerful but it can quickly get messy. We're not going to cover any best practices here, we're just going to get the job done. Talk about string concatenation for the prompt, then talk about *replace()* for inserting the user data into the original template string.

### Updating the DOM
Talk a bit about the DOM. Look back at the HTML and talk about how javascript needs a way to communicate with the web page, so it uses its own model to understand how the HTML is structured. We can directly manipulate the DOM from within javascript, and the browser will display those updates to us.
While we're looking at the HTML, does "Read File" accurately capture what we're doing? How about "Play Game"?

### Show Off "Bugs"
What happens when we don't select a file before hitting the "Play Game" button?
What happens when we select a file that isn't a proper template file?

# Intermediate Agenda

## Issues
* No file validation (file must have been selected). This is a "bug" in my "black box" code. Time to improve our understanding of it so we can update it.
* No user input validation. Introduction to the while and do/while loops.
* Now that accessing the element in the array has been typed out a few times, let's refactor it to only access the array once and save ourselves some typing.
* No file data validation (file must parse properly into a template).

## Aesthetic Upgrades
* Hide the output div before updating its inner HTML.
* Show the output div from javascript once it's been updated.
* Once again, typing out the code to access the main div has been repeated, let's refactor to make our lives easier.
* Style the input group by addig them to their own div and adding custom styling.
* Center the output div and the input group div.

# Advanced Ideas
The advanced version of this project could probably use a lot of refactoring, but for now let's stick with advanced features we could add:
* Some elements of randomization. Perhaps the order the user inputs things could be randomized. Perhaps the program could have pre-existing lists of elements to insert randomly so that we can bypass the user input stage and still get fun results.
* Better user experience. The built-in _prompt()_ and _alert()_ functions that we're using to interact with our user are antiquated, ugly, and considered bad practice. The proper way to do this would be to dynamically generate an HTML form to collect the data. This would be a lot of work, but it would be easier than you might think.
* Better styling. I am not a web designer. My CSS is ugly. Maybe some more customized input elements, better page styling, prettier text...
* More advanced template options. Could the templates automatically substitute in "a" or "an" properly? Could a validator be written or perhaps found that can determine if the user input is valid (not just present). For example, if prompting for a singular noun, are there any quick, easy checks we can make to determine the likelihood that the input is actually a singular noun?