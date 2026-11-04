import fs from "fs";
import path from "path";

export default function generatePluginList(isEquicord = true) {
    let plugins = [] as string[];
    let dirs: string[];

    if (isEquicord) {
        dirs = ["src/plugins", "src/plugins/_core", "src/equicordplugins/_core", "src/equicordplugins", "src/fanplugins"];
    } else {
        dirs = ["src/plugins", "src/plugins/_core"];
    }

    for (const dir of dirs) {
        if (!fs.existsSync(dir)) continue;

        const files = fs.readdirSync(dir, { withFileTypes: true });
        for (const file of files) {
            if (file.isDirectory() && !file.name.startsWith("_")) {
                plugins.push(file.name);
            }
        }
    }

    plugins = [...new Set(plugins)].sort();

    const outputPath = path.join(__dirname, "../src/plugins/index.ts");
    // Ensure parent directory exists
    if (!fs.existsSync(path.dirname(outputPath))) {
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    }

    return plugins;
}