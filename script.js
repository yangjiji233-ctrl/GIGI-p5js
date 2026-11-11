let gigibutton;
let myvideo;
let myImg;
let frozen = false;
let frozenImage;
let num = 5;
let patternSeed;
let snapshots = [];
let maxBuffer = 100;
let frameDelay = 5;
let colorIndex = 0;

function setup() {
	createCanvas(windowWidth, windowHeight);
    gigibutton = createButton("click me");
    gigibutton.position(800, 30);
    gigibutton.size(100,50);
    gigibutton.id("gigi_css_button");
    gigibutton.mouseClicked(gibutton);
    imageMode(CENTER);

    myvideo = createCapture(VIDEO);
    myvideo.size(500,400);
    myvideo.hide();
    patternSeed = random(1000000);
}

function draw() {
    background(100);
    myImg = myvideo.get();
    randomSeed(patternSeed);
    snapshots.push(myImg);
    if (snapshots.length > maxBuffer) {
    snapshots.shift();
    }
    myImg.loadPixels();

    let contrast = 120;
    let factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

    for (let i = 0; i < myImg.pixels.length; i += 4) {
        let r = myImg.pixels[i];
        let g = myImg.pixels[i + 1];
        let b = myImg.pixels[i + 2];

        let gray = 0.299 * r + 0.587 * g + 0.114 * b;
        gray = factor * (gray - 128) + 128;
        gray = constrain(gray, 0, 255);

        myImg.pixels[i] = gray;
        myImg.pixels[i + 1] = gray;
        myImg.pixels[i + 2] = gray;
    }

    myImg.updatePixels();
    myPattern();

    if(frozen === false){
        push();
            blendMode(MULTIPLY);
            fill(230,0,0);
        pop();
    }
    
}

function gibutton(){
    if(frozen === false){
        redraw();
        frozenImage = get();
        frozen = true;
        noLoop();
        gigibutton.html("unfreeze");
    } 

    else {
        frozen = false;
        loop();
        gigibutton.html("freeze");
    }

}

function myPattern() {
    let layoutSeed = patternSeed;
    randomSeed(patternSeed);
    let colorSeed = 0;
    let glitchColors = [ 
        [255, 229, 0],
        [255, 22, 140],
        [0, 87, 255],
        [0, 229, 160],
        [255, 75, 31],
        [139, 0, 255],
        [0, 201, 216],
        [168, 230, 0],
        [217, 0, 112] 
    ];

    let gap = width * 0.001;
    let minWidth = width * 0.03;
    let maxWidth = width * 0.2;
    let yPos = 0;
    
    while (yPos < height) {
        let rectHeight = random(height * 0.15, height * 0.3);
        rectHeight = min(rectHeight, height - yPos);
        let xPos = 0;

        while (xPos < width) {
            let rectWidth = random(minWidth, maxWidth);
            rectWidth = min(rectWidth, width - xPos);
            let cropWidth = min(myImg.width, myImg.height * rectWidth / rectHeight);

            cropWidth = cropWidth * random(0.3, 0.9);
            let cropHeight = cropWidth * rectHeight / rectWidth;
            let x = random(myImg.width - cropWidth);
            let y = random(myImg.height - cropHeight);
            let delayIndex = floor((xPos / width) * 10) * frameDelay;
            let snapshotIndex = snapshots.length - 1 - delayIndex;
            snapshotIndex = constrain(snapshotIndex, 0, snapshots.length - 1);
            let rectImg = snapshots[snapshotIndex].get( x, y, cropWidth, cropHeight);

            image(rectImg, xPos + rectWidth / 2, yPos + rectHeight / 2, rectWidth, rectHeight);
                if (frozen === true) {
                    push();
                    noStroke();
                    blendMode(MULTIPLY);
                    
                    let chosenColor = glitchColors[colorIndex % glitchColors.length];
                    colorIndex++;
                    fill(chosenColor[0], chosenColor[1], chosenColor[2]);

                    let colorWidth = rectWidth * 1.5;
                    let colorHeight = rectHeight * 1.5;
                    rectMode(CENTER);
                    rect(xPos + rectWidth / 2, yPos + rectHeight / 2, rectWidth, rectHeight);
                    pop();
                }

            xPos = xPos + rectWidth;
        }

        yPos = yPos + rectHeight;
    }

}