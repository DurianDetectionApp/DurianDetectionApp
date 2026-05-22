"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runtimeDebugController = void 0;
const child_process_1 = require("child_process");
const env_1 = require("../config/env");
const runtimeDebugController = (_req, res) => {
    try {
        const attempts = {};
        const cmds = [
            {
                name: "env_python_bin",
                cmd: "echo",
                args: [env_1.env.pythonBin ?? "<unset>"],
            },
            { name: "which_python", cmd: "which", args: ["python"] },
            { name: "which_python3", cmd: "which", args: ["python3"] },
            { name: "which_py", cmd: "which", args: ["py"] },
            { name: "python_version", cmd: "python", args: ["--version"] },
        ];
        for (const c of cmds) {
            try {
                const r = (0, child_process_1.spawnSync)(c.cmd, c.args, {
                    encoding: "utf8",
                    timeout: 10000,
                });
                attempts[c.name] = {
                    command: `${c.cmd} ${c.args.join(" ")}`,
                    status: r.status,
                    stdout: (r.stdout || "").toString().trim(),
                    stderr: (r.stderr || "").toString().trim(),
                    error: (r.error && r.error.message) || null,
                };
            }
            catch (err) {
                attempts[c.name] = {
                    command: `${c.cmd} ${c.args.join(" ")}`,
                    error: err.message,
                };
            }
        }
        return res.json({ aiModelDir: env_1.env.aiModelDir, attempts });
    }
    catch (err) {
        return res
            .status(500)
            .json({ message: `debug failed: ${err.message}` });
    }
};
exports.runtimeDebugController = runtimeDebugController;
exports.default = exports.runtimeDebugController;
