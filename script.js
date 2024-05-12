/**
 * Program to calculate average category grades on Gradescope
 *  
 * @author Arthur Zarins
 * @author Connor Zhang
 */

/**
 * Get input from textarea
 */
function getInput() {
    let input = document.getElementById("input").value;
    let map = parseInput(input);
    calculateAverage(map);
}

/**
 * @param input a string of the website's text
 * @returns a map that contains all the categories and how many points recieved out of points possible
 */
function parseInput(input) {
    const categories = new Map();
    // break input into seperate lines
    let lines = input.split("\n");
    for (let i = 0; i < lines.length; i++) {
        // search for lines with a slash
        if (isGradeLine(lines[i])) {
            // the i-1 line is the category line
            let category = lines[i - 1].split(" ")[0];
            let gradeLine = lines[i].split(" ");
            // check if the category exists
            if (categories.has(category)) {
                let current = categories.get(category);
                current[0] += Number(gradeLine[0]);
                current[1] += Number(gradeLine[2]);
                categories.set(category, current);
            } else {
                // initialize new category with grade numerator / denominator
                let current = [Number(gradeLine[0]), Number(gradeLine[2])];
                categories.set(category, current);
            }
        }
    }
    return categories;
}

/**
 * @returns true if a line is a grade, false otherwise
 */
function isGradeLine(line) {
    if (line.indexOf("/") == -1) {
        return false; // there is no slash
    }
    let words = line.split(" ");
    if (words.length > 3) {
        return false; // there should only be three words
    }
    if (isNaN(words[0]) || isNaN(words[2])) {
        return false; // either the first and last "word" are not a number
    }
    return true; // passed all checks
}

// round a number to 2 decimal places
function round(num) {
    const digits = Math.pow(10, 2);
    return Math.floor(num * digits) / digits;
}

/**
 * @param input a map with all the categories and scores
 * This will output all of the category averages to the HTML document
 */
function calculateAverage(categories) {
    let output = document.getElementById("output");
    let success = false;
    for (let [key, value] of categories) {
        let percent = round(value[0] * 100 / value[1]);
        let score = `${round(value[0])} / ${round(value[1])}`;

        // create a paragraph element to be added to output
        let p = document.createElement("p");
        p.innerHTML = `<b>${key}:</b> ${percent}% (${score})`;
        output.prepend(p);
        success = true; // we successfully added a category
    }
    if (success) {
        // display the output zone, hide the input
        document.getElementById("outputZone").classList.remove("hidden");
        document.getElementById("inputDivContainer").classList.add("hidden");
    } else {
        // show error message
        document.getElementById("invalidInput").classList.remove("hidden");
    }
}

function showInputZone() {
    document.getElementById("inputDivContainer").classList.remove("hidden");
    document.getElementById("input").value = ""; // reset input value
    // hide error message
    document.getElementById("invalidInput").classList.add("hidden");

    // hide output & delete previous output
    document.getElementById("outputZone").classList.add("hidden");
    document.getElementById("output").innerHTML = "";
}