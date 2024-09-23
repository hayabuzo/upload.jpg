let video;
let button;
let img;
let fit;

const imgSize = [480,640];
const screenScale = 0.75;

async function fetchEnvVariables() {
  fetch('https://upload-jpg.vercel.app/api/secrets')
  .then(response => response.json())
  .then(data => {
    console.log('secret is:', data.secret);
  })
  .catch(error => {
    console.error('Error fetching secret:', error);
  });

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
  sendToTelegram(img.canvas.toDataURL());
}

async function sendToTelegram(imageDataUrl) {

  const env = await fetchEnvVariables();
  const TELEGRAM_BOT_TOKEN = env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = env.CHAT_ID;

  // Преобразование DataURL в Blob
  fetch(imageDataUrl)
    .then(response => response.blob())
    .then(blob => {
      const formData = new FormData();
      formData.append('chat_id', CHAT_ID);
      formData.append('photo', blob, 'snapshot.png');

      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`, {
        method: 'POST',
        body: formData
      })
      .then(response => {
        if (response.ok) {
          console.log('Image sent successfully');
        } else {
          return response.text().then(errorText => {
            console.error('Failed to send image:', errorText);
          });
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
    })
    .catch(error => {
      console.error('Error converting image to Blob:', error);
    });
}

