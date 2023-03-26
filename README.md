# HTML esbuild plugin

HTML plugin for esbuild

```js
import { build } from "esbuild";
import htmlPlugin from "html-esbuild-plugin";

await build({
    entryPoints: ["src/index.ts"],
    outdir: "out",
    plugins: [
        htmlPlugin({
            template: "./src/index.html",
            title: "My title",
        }),
    ],
});
```
