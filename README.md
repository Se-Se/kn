# sysAuditor-frontend

## tnpm

Just use tencent mirror npm:

```
alias tnpm='npm --registry https://mirrors.tencent.com/npm/'
```

or set npm's registry to https://mirrors.tencent.com/npm/

## How to debug locally

1. Install whistle.

https://github.com/avwo/whistle#install-whistle

2. Start whistle

```sh
w2 start
```

3. Add rule.

Open whistle panel at http://localhost:8899

Add rule to whistle:

```sh
# Only need to run once `.whistle.js` is changed.
w2 add
```

4. Install root CA of whistle

Follow the guidance:

https://wproxy.org/whistle/webui/https.html

5. Set whistle as browser proxy.

6. Profit!

After doing these, you are able to open https://dev.sysauditor.woa.com/ with `npm start` running.
