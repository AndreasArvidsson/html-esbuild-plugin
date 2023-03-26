import { build, BuildOptions, Metafile, Plugin } from "esbuild";
import fs from "node:fs";
import path from "node:path";

interface Options {
    template: string;
    title?: string;
}

export default (options: Options): Plugin => {
    return {
        name: "htmlEsbuildPlugin",
        setup(build) {
            build.initialOptions.metafile = true;
            const outdir = path.resolve(build.initialOptions.outdir ?? "");

            let template = fs.readFileSync(path.resolve(options.template), {
                encoding: "utf8",
            });

            template = applyOptions(template, options);

            build.onEnd((result) => {
                if (result.metafile) {
                    template = applyOutputs(template, outdir, result.metafile);
                }

                const fullPath = path.join(outdir, "index.html");
                fs.writeFileSync(fullPath, template);
            });
        },
    };
};

function applyOptions(template: string, options: Options): string {
    for (const [key, val] of Object.entries(options)) {
        if (key !== "template") {
            template = replace(template, `option.${key}`, val);
        }
    }
    return template;
}

function applyOutputs(
    template: string,
    outdir: string,
    metafile: Metafile
): string {
    const files = Object.keys(metafile.outputs).map((f) =>
        outdir ? path.relative(outdir, f) : f
    );
    const js = files
        .filter((f) => f.endsWith(".js"))
        .map((f) => `<script src="${f}"></script>`)
        .join("\n");
    const css = files
        .filter((f) => f.endsWith(".css"))
        .map((f) => `<link rel="stylesheet" href="${f}">`)
        .join("\n");

    template = replace(template, "output.js", js);
    template = replace(template, "output.css", css);

    return template;
}

function replace(template: string, path: string, content: string): string {
    return content
        ? template.replace(`<%= htmlEsbuildPlugin.${path} %>`, content)
        : content;
}
