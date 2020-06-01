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

## Introduction
Does anyone already have any experience with programming? Let's hear about it.

Touch on objectives (above). This lesson will be excruciatingly simple, but there will be some challenges at the end, and I'll be happy to follow up with anyone who would like to learn more or tackle the challenges. My email address and a link to the GitHub page will be provided at the end, as well as an overview of the GitHub project.

## Download and Setup
Ideally, the final story should be a surprise for the student. It's more fun that way. You can choose to provide the story in the initial download or give it to them at the end and use a dummy file for development.

This project can be completed with Notepad or some other basic text editor, but some students may wish to work in VS Code or Notepad++. The students can be encouraged to look into advanced text editors for programming and make a selection before the class. They can install the software ahead of time and learn to use it to create, edit, and save a basic text file.

Some students may struggle with saving files with a particular extension, should the need arise. The simple version of this project does not require creating any new files or documents, though in order to complete some of the more advanced features they may need help setting their operating system to display extensions, or at least learning to use their text editor to override the default filetype.

## Quick Overview
Briefly talk the students through the existing code in the sample project.

### `index.html`
Talk about how HTML is a markup language for formatting elements on a page. Go over the elements and how they are structured by the HTML. Show the links to the style sheet and the scripts.

### `style.css`
Show off the initial CSS and talk about what role the style sheet plays.

### `fileReader.js`
Introduce the concept of "black box" code where we learn how to use it, but don't need to care how it works. It takes information in and spits information out predictably. Talk about comments and a few other features of the code. Most importantly, examine the `PhrasalTemplate` data structure and what that `match()` call will put in the `inputs` property. Touch very briefly on the REGEX, but be sure to mention that we won't be using REGEX at all for the simple project. Talk a little abou types and typing, and explain that javascript doesn't really care about types and so it's important that we keep track of what kind of data we expect to find where.

Show where this file takes the processed file data and passes it into `main()`.

### `sample_story.txt`
Before getting to `main.js`, open the sample template file and just show what it contains. Talk about the role the square brackets play and how that relates to the mysterious REGEX in the black box code.

### `main.js`
Talk about the function and the commented-out code, then show off console logging and how to examine the output in the browser console. Explain that all of our code today will be written in `main()`.

## Write the Code
There are relatively few moving parts here. First the students should look at the data that we're starting with and figure out what might need to be done in order to get to the end goal. Define the goal.

Touch briefly on the concept of containers or elements or objects that can contain something else. An HTML tag is a container (usually) with attributes. In code the curly braces denote code snippets or data that are contained within something. In fact, a container in javascript is called an object, and literally everything in javascript is an object. Talk about nesting and be sure to point out examples of nesting in the code.

Also talk about white space and how (with the exception of the pre tags) white space never means anything to to the computer in the HTML, CSS, or script files. It's only to help us visually understand what is on the screen.

### FOR loop
The inputs are stored in an indexed **array**. The most basic way to iterate through an indexed arrray is to use a FOR loop. Indexing nearly always begins with zero in programming (though there are baffling exceptions).

Go over setting up the loop and understanding how it "thinks" then have them think about how that will be useful for our program. Alternatively, before introducing the loop, talk about the indexed array and see if they can figure out how to describe what we can do with that information to accomplish our goal.

### Getting User Input
An antiquated but simple way to get user input is the javascript **prompt()**. We can store the value a user enters into a variable of our own.

### Altering the String
String manipulation is powerful but it can quickly get messy. We're not going to cover any best practices here, we're just going to get the job done. Talk about string concatenation for the prompt, then talk about **replace()** for inserting the user data into the original template string.

Touch on the way **replace()** works, replacing only the first found instance when not using a regular expression. Show the regular expression (regex) in the "black box" code and explain that it took two days to get that regex working properly. Regex is powerful, but it can be a pain in the rear to get it working in any given context. I'm frankly not even sure if that regex will always work the way I want it to, it just worked fine for what I needed here for now so I went with it.

### Updating the DOM
Talk a bit about the DOM (Document Object Model). Look back at the HTML and talk about how javascript needs a way to communicate with the web page, so it uses its own "object" model to understand how the HTML is structured. We can directly manipulate the DOM from within javascript, and the browser will display those updates to us.

While we're looking at the HTML, does "Read File" accurately capture what we're doing? How about "Play Game"?

### Show Off "Bugs"
What happens when we don't select a file before hitting the "Play Game" button?

What happens when we select a file that isn't a proper template file?

## Conclusion
* Show off completed Intermediate project and highlight the parts of the Intermediate Agenda below.
* Show the GitHub project in an incognito window and teach how to navigate it.
* Send out link to GitHub project as well as personal email address.
* Give them the final story templates to play with.

# Intermediate Agenda

## Issues
* No file validation (file must have been selected). This is a "bug" in my "black box" code. Time to improve our understanding of it so we can update it.
* No user input validation. Introduction to the while and do/while loops.
* Now that accessing the element in the array has been typed out a few times, let's refactor it to only access the array once and save ourselves some typing.
* No file data validation (file must parse properly into a template).

## Aesthetic Upgrades
* Hide the output element before updating its inner HTML.
* Show the output element from javascript once it's been updated.
* Once again, typing out the code to access the main element has been repeated, let's refactor to make our lives easier.
* Style the input group by addig them to their own div group and adding custom styling.
* Center the output element and the input div group.
* Add a way to know how many total items are needed and which one you're being asked about.

# Advanced Ideas
The advanced version of this project could probably use a lot of refactoring, but for now let's stick with advanced features we could add:
* Can we get it working with multiple files at once? Hint: the file picker isn't currently configured to allow selecting multiple files. That might be something we can configure in the HTML. You'll need to nest all of the code in `main()` in an outer loop. As we did in the Aesthetic Upgrades above, we'll want to give the user some indication of their progress through the stories.
* Better output. For now we're using a pre tag, but the text could be easily manipulated into HTML for cleaner, better formatting. We could put it in paragraph tags, style our paragraphs, and generally present it better. With our `replace()` method, we could even put the inserted words in span tags to give them separate formatting as well so they stand out.
* Some elements of randomization. Perhaps the order the user inputs things could be randomized. Perhaps the program could have pre-existing lists of elements to insert randomly so that we can bypass the user input stage and still get fun results.
* Better user experience. The built-in `prompt()` and `alert()` functions that we're using to interact with our user are antiquated, ugly, and considered bad practice. The proper way to do this would be to dynamically generate an HTML form to collect the data. This would be a lot of work, but it would be easier than you might think.
* Better styling. I am not a web designer. My CSS is ugly. Maybe some more customized input elements, better page styling, prettier text... There are frameworks out there that represent a pretty good starting point. I like MVP.css: http://andybrewer.github.io/mvp/

## Additional Challenges:
* Animate the story reveal as though the letters are being typed on a typewriter. Randomize the length of time between "key presses" to simulate someone typing on a keyboard. Use a single variable to control the overall speed of the reveal (maybe even store the value in the standard "words per minute" or WPM unit).
* Make some of the internal options (like `scramblePromptOrder` and `highlightUserWords`) into option the user can turn on and off with checkboxes. You'll need to look into the `<input type="checkbox />` element and learn to read its value from the code. Here's a great resource to get started: https://www.w3schools.com/jsref/prop_checkbox_checked.asp
* More advanced template options.
    * Could the templates automatically substitute in "a" or "an" properly? Could a validator be written or perhaps found that can determine if the user input is valid (not just present). For example, if prompting for a singular noun, are there any quick, easy checks we can make to determine the likelihood that the input is actually a singular noun?
    * What would it take to allow the template writer to reuse one input multiple times? Could the input be given an identifier perhaps, then that identifier could be reused in curly braces instead of sqaure brackets?