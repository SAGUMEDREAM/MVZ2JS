import fs from "fs";
import os from "os";
import nwbuild from "nw-builder";
import options from "./options.js";

const { name, version } = JSON.parse(
    fs.readFileSync("./package.json").toString()
);
const buildName = [name, version, os.platform(), os.arch()].join("-");

nwbuild({
    ...options,
    mode: "build",
    flavor: "normal",
    outDir: `../output/${buildName}`,
    zip: false,
    app: {
        icon: "./favicon.ico",
    },
});