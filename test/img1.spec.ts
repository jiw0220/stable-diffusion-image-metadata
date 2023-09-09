import * as tape from 'tape';
import * as StableDiffusionMetadata from '../src/index';

const _result_parameters = `deconstruction of self, Neon futurism, hyperrealistic surrealism, dreamscape, award winning masterpiece with incredible details, liminal space, highly detailed,Cleveland Ohio, cinematic ,rim lighting ,octane render, wvebg1, bganidusk
Negative prompt: (low quality, worst quality:1.4), (bad anatomy), (inaccurate limb:1.2), bad composition, inaccurate eyes, extra digit, fewer digits, (extra arms:1.2)
Steps: 30, Sampler: DPM++ 2M Karras, CFG scale: 7, Seed: 1674451477, Size: 512x682, Model hash: 68f02c23ce, Model: 7-Wonderland, Clip skip: 2, Version: v1.3.2`;

const _result_metadata = `{"steps":"30","sampler":"DPM++ 2M Karras","cfgScale":"7","seed":"1674451477","size":"512x682","Model hash":"68f02c23ce","Model":"7-Wonderland","clipSkip":"2","Version":"v1.3.2","prompt":"deconstruction of self, Neon futurism, hyperrealistic surrealism, dreamscape, award winning masterpiece with incredible details, liminal space, highly detailed,Cleveland Ohio, cinematic ,rim lighting ,octane render, wvebg1, bganidusk","negativePrompt":"(low quality, worst quality:1.4), (bad anatomy), (inaccurate limb:1.2), bad composition, inaccurate eyes, extra digit, fewer digits, (extra arms:1.2)","width":512,"height":682,"hashes":{"model":"68f02c23ce"},"resources":[{"type":"model","name":"7-Wonderland","hash":"68f02c23ce"}]}`;

tape('img1', function (t) {
  t.test('test extract', async function (st) {
    const [parameters, isParameters] = await StableDiffusionMetadata.extract(
      'https://res.emchub.ai/emcbucket/2023/07/24/%5B1690193608795%5D7-1.png'
    );
    st.equal(parameters, _result_parameters, 'success');
    st.end();
  });

  t.test('test parse', async function (st) {
    const metadata = StableDiffusionMetadata.parse(_result_parameters);
    st.equal(JSON.stringify(metadata), _result_metadata, 'success');
    st.end();
  });
  t.test('test stringify', async function (st) {
    const parameters = StableDiffusionMetadata.stringify(JSON.parse(_result_metadata));
    st.equal(parameters, _result_parameters, 'success');
    st.end();
  });
});
