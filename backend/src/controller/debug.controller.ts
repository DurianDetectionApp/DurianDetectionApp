import { spawnSync } from "child_process";
import { Request, Response } from "express";
import { env } from "../config/env";

export const runtimeDebugController = (_req: Request, res: Response) => {
  try {
    const attempts: Record<string, any> = {};

    const cmds = [
      {
        name: "env_python_bin",
        cmd: "echo",
        args: [env.pythonBin ?? "<unset>"],
      },
      { name: "which_python", cmd: "which", args: ["python"] },
      { name: "which_python3", cmd: "which", args: ["python3"] },
      { name: "which_py", cmd: "which", args: ["py"] },
      { name: "python_version", cmd: "python", args: ["--version"] },
    ];

    for (const c of cmds) {
      try {
        const r = spawnSync(c.cmd, c.args, {
          encoding: "utf8",
          timeout: 10000,
        });
        attempts[c.name] = {
          command: `${c.cmd} ${c.args.join(" ")}`,
          status: r.status,
          stdout: (r.stdout || "").toString().trim(),
          stderr: (r.stderr || "").toString().trim(),
          error: (r.error && (r.error as Error).message) || null,
        };
      } catch (err) {
        attempts[c.name] = {
          command: `${c.cmd} ${c.args.join(" ")}`,
          error: (err as Error).message,
        };
      }
    }

    return res.json({ aiModelDir: env.aiModelDir, attempts });
  } catch (err) {
    return res
      .status(500)
      .json({ message: `debug failed: ${(err as Error).message}` });
  }
};

export default runtimeDebugController;
