# rsync-source

[![styled with prettier](https://img.shields.io/badge/styled_with-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Greenkeeper badge](https://badges.greenkeeper.io/dan2dev/rsync-source.svg)](https://greenkeeper.io/)
[![Travis](https://img.shields.io/travis/dan2dev/rsync-source.svg)](https://travis-ci.org/dan2dev/rsync-source)
[![Coveralls](https://img.shields.io/coveralls/dan2dev/rsync-source.svg)](https://coveralls.io/github/dan2dev/rsync-source)
[![Dev Dependencies](https://david-dm.org/dan2dev/rsync-source/dev-status.svg)](https://david-dm.org/dan2dev/rsync-source?type=dev)
[![Donate](https://img.shields.io/badge/donate-paypal-blue.svg)](https://paypal.me/dan2dev)

A simple but efficient way to sync directories using 'rsync'.

### Installation

```bash
npm install rsync-source
```

### Usage

```typescript
// import
import { move, sync } from '../src/rsync-source'

// use
sync('./my-libs-source', './my-project/src/libs', 'my-lib')
```

### Attention

#### Files that don't exist in the source will be deleted from the destination directory.
