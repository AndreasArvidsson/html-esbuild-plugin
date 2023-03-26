import { build } from "esbuild";

(async () => {
    await build({
        entryPoints: ["src/index.ts"],
        outdir: "lib",
        platform: "node",
        packages: "external",
        bundle: true,
        minify: true,
    });
})();
