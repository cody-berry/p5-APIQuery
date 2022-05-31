/**
 *  @author Cody
 *  @date 2022.05.30
 *  ☒ Load a single json file. If it's loaded, print the data to make sure
 *  that it's working.
 *  ☒ Make the call of loadJSON() have a callback function, gotData. Store the
 *  data in a variable and print it out.
 *  If the data's has_next is true, call loadJSON with a callback function of
 *  gotData itself with the url of next_page.
 *  Concatenate the json files and print it out.
 *  Create a function that will check the data, iterate through all the
 *  cards and print their names.
 */

let font
let instructions
let debugCorner /* output debug text in the bottom left corner of the canvas */
let jsonData /* the json data that we retrieve from the scryfall API */

// api.scryfall.com/cards/search?q=set:snc   is the link to the first page
// of the cards in Streets of New Capenna (snc)


function preload() {
    font = loadFont('data/consola.ttf')
}


function setup() {
    let cnv = createCanvas(600, 300)
    cnv.parent('#canvas')
    colorMode(HSB, 360, 100, 100, 100)
    textFont(font, 14)

    /* initialize instruction div */
    instructions = select('#ins')
    instructions.html(`<pre>
        numpad 1 → freeze sketch</pre>`)

    debugCorner = new CanvasDebugCorner(5)

    loadJSON('https://api.scryfall.com/cards/search?q=set:snc', gotData)
    loadJSON('https://api.scryfall.com/cards/search?q=set:neo', gotData)
}


// called when we've retrieved the data from loadJSON. The first argument is
// the data that we retrieved from the loadJSON call.
function gotData(data) {
    jsonData = data
    console.log(jsonData)

    // but if the data's hasNext property is true, we should use the next
    // page's url and recursively call this function!
    if (data['has_more']) {
        loadJSON(data['next_page'], gotData)
    }
}


function draw() {
    background(234, 34, 24)


    /* debugCorner needs to be last so its z-index is highest */
    debugCorner.setText(`frameCount: ${frameCount}`, 2)
    debugCorner.setText(`fps: ${frameRate().toFixed(0)}`, 1)
    debugCorner.show()

    if (frameCount > 3000)
        noLoop()
}


function keyPressed() {
    /* stop sketch */
    if (keyCode === 97) { /* numpad 1 */
        noLoop()
        instructions.html(`<pre>
            sketch stopped</pre>`)
    }
}


/** 🧹 shows debugging info using text() 🧹 */
class CanvasDebugCorner {
    constructor(lines) {
        this.size = lines
        this.debugMsgList = [] /* initialize all elements to empty string */
        for (let i in lines)
            this.debugMsgList[i] = ''
    }

    setText(text, index) {
        if (index >= this.size) {
            this.debugMsgList[0] = `${index} ← index>${this.size} not supported`
        } else this.debugMsgList[index] = text
    }

    show() {
        textFont(font, 14)
        strokeWeight(1)

        const LEFT_MARGIN = 10
        const DEBUG_Y_OFFSET = height - 10 /* floor of debug corner */
        const LINE_SPACING = 2
        const LINE_HEIGHT = textAscent() + textDescent() + LINE_SPACING
        fill(0, 0, 100, 100) /* white */
        strokeWeight(0)

        for (let index in this.debugMsgList) {
            const msg = this.debugMsgList[index]
            text(msg, LEFT_MARGIN, DEBUG_Y_OFFSET - LINE_HEIGHT * index)
        }
    }
}