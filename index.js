/**
 * momentum plugin for OpenCode.
 *
 * Adds the core skills folder to OpenCode's skill paths. The ADHD add-on
 * skills (adhd/skills) are added only when MOMENTUM_ADHD=1 is set.
 * No dependencies. Makes no network calls and writes nothing.
 */
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const paths = [path.join(root, "skills")];
if (process.env.MOMENTUM_ADHD === "1") paths.push(path.join(root, "adhd", "skills"));

export const MomentumPlugin = async () => ({
  config: async (config) => {
    if (Array.isArray(config.skills)) return;
    config.skills = config.skills || {};
    config.skills.paths = config.skills.paths || [];
    for (const p of paths) {
      if (!config.skills.paths.includes(p)) config.skills.paths.push(p);
    }
  },
});
