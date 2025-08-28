// (async () => {
// const mp3Response = await fetch('https://api.murf.ai/v1/speech/generate', {
//     method: 'POST',
//     headers: {
//       'api-key': 'ap2_70e9eee3-587c-40c1-81d9-5f6af24dae02',
//       'Content-Type': 'application/json',
//       'Accept': 'application/json',
//     },
//     body: JSON.stringify({
//       text: 'hello my name is alan, im such a skibidi tralalero tralalal sigma',
//       voiceId: 'en-US-natalie',
//     }),
//   });

// console.log(mp3Response);
// console.log(await mp3Response.json());

// })()
const fs = require('fs');
const path = require('path');

(async () => {
    const audioResponse = await fetch("https://murf.ai/user-upload/one-day-temp/57a2cad3-f402-4e83-aa52-b5ee7a4ed587.wav?response-cache-control=max-age%3D604801&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Date=20250827T000000Z&X-Amz-SignedHeaders=host&X-Amz-Expires=259200&X-Amz-Credential=AKIA27M5532DYKBCJICE%2F20250827%2Fus-east-2%2Fs3%2Faws4_request&X-Amz-Signature=7e260cc4412acff7cf61f354830f0c9c9df7c632de2d659feefe3d56239329c1");
    if (!audioResponse.ok) {
      throw new Error(`Failed to download audio: ${audioResponse.status} ${audioResponse.statusText}`);
    }

    // Save new audio file
    const audioDir = path.join(process.cwd());
    const newFileName = `test.mp3`;
    const newFilePath = path.join(audioDir, newFileName);
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    fs.writeFileSync(newFilePath, audioBuffer);
})()