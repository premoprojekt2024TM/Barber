import * as tf from '@tensorflow/tfjs-node';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import { createCanvas, loadImage } from 'canvas';

export async function detectFaces(imageBuffer: Buffer) {
  try {
    const model = await cocoSsd.load();

    
    const image = await loadImage(imageBuffer);
    const canvas = createCanvas(image.width, image.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(image, 0, 0);


    const imageData = ctx.getImageData(0, 0, image.width, image.height);
    const pixelData = imageData.data;

    
    const inputTensor = tf.tensor3d(new Uint8Array(pixelData.buffer), [image.height, image.width, 4]);
    const rgbTensor = inputTensor.slice([0, 0, 0], [-1, -1, 3]);
    const predictions = await model.detect(rgbTensor);

    const faces = predictions.filter(prediction => prediction.class === 'person');
    return faces; 

  } catch (error) {
    console.error('Error during face detection:', error);
    throw error;  
  }
}
