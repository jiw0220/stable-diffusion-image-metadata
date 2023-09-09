# stable-diffusion-image-metadata

#### This tool provides the capability to extract and parse metadata from images. It is inspired by the work of the [civitai][civitai] project and leverages some of their code for image metadata parses

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

_[1.0.10] - 2023-09-09_

- remove 'buffer-big-endian.ts'
- fixed function 'extract' chinese problem

[civitai]: https://github.com/civitai/civitai/blob/b367192a05a3ac0d9a064f978ba3077d8e0aab1b/src/utils/metadata/automatic.metadata.ts
