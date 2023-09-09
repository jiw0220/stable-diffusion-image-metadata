# stable-diffusion-image-metadata

#### This tool provides the capability to extract and parse metadata from images. It is inspired by the work of the [civitai][civitai] project and leverages some of their code for image metadata parses

#### About for the processing of parameters, there are two steps.

- (1) Preprocessing, which extracts special attributes in a 'RegExp'
- (2) Extracting the primary attributes whit 'split(': ') and split(', ')'

## Installation

`npm install --save stable-diffusion-image-metadata`

## Dependencies

```json
{
  "exifreader": "^4.13.0"
}
```

## Usage

```typescript
export { extract, parse, stringify } from 'stable-diffusion-image-metadata';

const image = 'https://image.png'; // or File | base64

const [parameters, isParameters] = await extract(image);

const metadata = parse(parameters);

const metadataStr = stringify(metadata);
```

## Changelog

_[1.0.11] - 2023-09-09_

- fixed parse: make preprocess config, there will already be more preprocessing configs in the future.

```typescript
const preproccessConfigs = [
  { reg: /(ControlNet \d+): "([^"]+)"/g },
  { reg: /(Lora hashes): "([^"]+)"/g },
  { reg: /(Hashes): ({[^}]+})/g, key: 'hashes', value: preproccessFormatJSONValueFn },
  //...There should be many configs that need to be preprocessed in the future
];
```

_[1.0.10] - 2023-09-09_

- remove 'buffer-big-endian.ts'
- fixed function 'extract' chinese problem

[civitai]: https://github.com/civitai/civitai/blob/b367192a05a3ac0d9a064f978ba3077d8e0aab1b/src/utils/metadata/automatic.metadata.ts
