# rsync-source

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Dev Dependencies](https://david-dm.org/dan2dev/rsync-source/dev-status.svg)](https://david-dm.org/dan2dev/rsync-source?type=dev)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/dan2dev)

A library that helps you reuse files in multiples projects without using symlink.

### Installation

```bash
npm install rsync-source
```

### Usage

```typescript
// import
import { copyFolderTo } from '../src/rsync-source'

// use
copyFolderTo("./some-folder", "./some-other-folder", false);
```

### Attention

#### Files that don't exist in the source will be deleted from the destination directory.
