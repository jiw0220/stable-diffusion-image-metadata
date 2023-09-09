import * as tape from 'tape';
import * as StableDiffusionMetadata from '../src/index';

const _result_parameters = `masterpiece,best quality,
RAW photo,*subject*,8k uhd,dslr,soft lighting,high quality,film grain,Fujifilm XT3,
megastructure,simple background,(no humans:1.2),
perspective,daylight,outdoorrs,huge,(sculpture:1.1),standing at the top of the mountain,curved,stretched,concrete sculpture,
fog,cloudy,depth of field, 
<lora:gaint build-V1:0.88>,
Negative prompt: lowres, bad anatomy, bad hands, text, error, missing fingers, extra digit, fewer digits, cropped, worst quality, low quality, normal quality, jpeg artifacts, signature, watermark, username, blurry
Steps: 36, Sampler: DPM++ 2M SDE, CFG scale: 7, Seed: 2806335496, Size: 680x1024, Model hash: 9aba26abdf, Model: 真实模型_deliberate_v2, ControlNet 0: "preprocessor: lineart_coarse, model: control_v11p_sd15_lineart [43d4be0d], weight: 0.6, starting/ending: (0.1, 0.8), resize mode: Crop and Resize, pixel perfect: True, control mode: ControlNet is more important, preprocessor params: (512, 32, 64)", Lora hashes: "gaint build-V1: fe6d7d9c9881", Version: v1.4.0, Hashes: {"vae": "c6a580b13a", "model": "9aba26abdf"}`;

tape('img2', function (t) {
  t.test('test extract', async function (st) {
    const [parameters, isParameters] = await StableDiffusionMetadata.extract(
      'https://s3.emchub.ai/hub-media/emc-hub-a63123cf/1/20230908/usercomment.jpeg'
    );
    st.equal(parameters, _result_parameters, 'success');
    st.end();
  });
});
