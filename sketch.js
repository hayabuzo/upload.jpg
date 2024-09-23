let video;
let button;
let img;
let fit;

let CID = '-1002425906440';
let TBT = undefined;

const imgSize = [480,640];
const screenScale = 0.75;

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
  });
	video.hide(); 

  button = createButton('📸');
  button.id('snapshotButton');
  button.mousePressed(takeSnapshot);

	img = createGraphics(imgSize[0],imgSize[1]);

}

function draw() {
  fit = video.width>video.height*0.75 ? img.height/video.height : img.width/video.width;
	img.imageMode(CENTER);
	img.image(video,imgSize[0]/2,imgSize[1]/2,video.width*fit,video.height*fit); 
	image(img,0,0,width,height);
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

