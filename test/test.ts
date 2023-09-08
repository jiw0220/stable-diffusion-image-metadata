import * as StableDiffusionMetadata from '../src/index';

async function main() {
  const [parameters, isParameters] = await StableDiffusionMetadata.extract(
    'https://s3.emchub.ai/hub-media/emc-hub-a63123cf/1/20230908/usercomment.jpeg'
  );
}
main();
