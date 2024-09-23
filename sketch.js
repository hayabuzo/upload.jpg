let video;
let button;
let img;
let fit;


let CID = '-1002425906440';
let TBT = undefined;

let state = 'init';
let camState = "🙄🔎📸";
let camStateSize = 1;

const imgSize = [480,640];
const screenScale = 1.0;

const tr = {
  y: 640,
  ySet: 640,
  s: 1,
  sSet: 1,
}

function setup() {

	pixelDensity(1); 
	const w = window.innerWidth;
	const h = window.innerHeight;
	if (w>h) {
    createCanvas(h*screenScale*imgSize[0]/imgSize[1],h*screenScale);
  }	else {
    createCanvas(w*screenScale,w*screenScale*imgSize[1]/imgSize[0]);
  }

  video = createCapture({ 
    audio: false, 
    video: { 
      height: {max: imgSize[1]}, 
      facingMode: "environment" 
    }
  },
  { flipped: false },
  () => {
    state = 'capture';
    fit = video.width>video.height*0.75 ? img.height/video.height : img.width/video.width;
  }
);
	video.hide(); 

	img = createGraphics(imgSize[0],imgSize[1]);
  img.imageMode(CENTER);

  textAlign(CENTER);
  textSize(h*0.1);



}

function drawImage() {
  imageMode(CENTER)
  image(img,0.5*width,0.5*height+tr.y,width*tr.s,height*tr.s);
}

function drawBorder() {
  push();
  noFill();
  stroke(255,(1-tr.s)*10*255);
  strokeWeight(8);
  rectMode(CENTER);
  rect(width/2, height/2, width*tr.s, height*tr.s);
  pop();
}

function drawCamState() {
  push();
    textSize(window.innerHeight*0.1*camStateSize);
    text(camState, width/2, height/2);
  pop();
}

function draw() {

  background(10);
  drawCamState();

  tr.y += (tr.ySet-tr.y)/15;
  tr.s += (tr.sSet-tr.s)/15;

  switch (state) {

    case 'init':
      break;
      
    case 'capture':
      img.image(video,imgSize[0]/2,imgSize[1]/2,video.width*fit,video.height*fit); 
      tr.ySet = 0;
      tr.sSet = 1;

      drawImage();
      drawBorder()
      text("📸", width/2, height*0.95);
      if (mouseIsPressed && mouseY>height*0.8) { 
        mouseIsPressed = false; 
        state = 'review'
      }
      break;

    case 'review':
      drawImage();
      drawBorder();
      text("🔁", width*0.25, height*0.85);
      text("✉️", width*0.75, height*0.85);
      tr.sSet = 0.9;
      if (mouseIsPressed && mouseY>height*0.6) { 
        mouseIsPressed = false; 
        if (mouseX<width*0.5) {
          state = 'capture';
        } else {
          takeSnapshot();
          state = 'sending';
        }
      }
      break;

    case 'sending':
      tr.ySet = height;
      push();
        camState = "💌"
        camStateSize = 2;
      pop();
      drawImage();
      text("🔁", width*0.5, height*0.95);
      if (mouseIsPressed) { 
        mouseIsPressed = false; 
        if (mouseY>height*0.8) {
          state = 'capture'
        } else {
          window.location.href = 'https://t.me/ff4651e9e031';
        }
      }
      break;

  }


}

function takeSnapshot() {
  runSequentially();
}

async function fetchEnvVariables() {
  try {
    const response = await fetch('https://upload-jpg.vercel.app/api/tbt');
    const data = await response.json();
    if (data.error) {
      console.error('Error:', data.error);
    } else {
      TBT = data.tbt;
    }
  } catch (error) {
    console.error('Error fetching:', error);
  }
}

async function sendToTelegram(imageDataUrl) {
  try {
    // Преобразование DataURL в Blob
    const response = await fetch(imageDataUrl);
    const blob = await response.blob();
    const formData = new FormData();
    formData.append('chat_id', CID);
    formData.append('photo', blob, 'snapshot.png');

    const telegramResponse = await fetch(`https://api.telegram.org/bot${TBT}/sendPhoto`, {
      method: 'POST',
      body: formData
    });

    if (telegramResponse.ok) {
      console.log('Image sent successfully');
    } else {
      console.error('Failed to send image');
    }
  } catch (error) {
    console.error('Error:', error.message);
  }
}

async function runSequentially() {
  await fetchEnvVariables();
  await sendToTelegram(img.canvas.toDataURL());
}

