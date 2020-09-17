# Change Node.JS version in few repo files

Supports:

- `package.json`: `engines.node` key
- `Dockerfile`: `FROM node` image string
- and `.nvmrc`

Example:

```bash
$ cd projects/my

$ mad-tools-nchv 14.5
✓  .nvmrc        13 → 14.5
✓  package.json  14 → 14.5
✓  Dockerfile    13.1.0 → 14.5

$ mad-tools-nchv ">=14"
✓  .nvmrc        14.5 → 14
✓  package.json  14.5 → >=14
✓  Dockerfile    14.5 → 14
```
