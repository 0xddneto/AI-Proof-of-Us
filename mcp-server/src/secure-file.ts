import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

// mode 0o600 is a no-op on NTFS, so Windows also needs an explicit ACL.
// A false result is surfaced by onboarding; existing receipt collection keeps
// its historical best-effort behavior.
export async function restrictToCurrentUser(filePath: string): Promise<boolean> {
  if (process.platform !== "win32") return true;
  const user = process.env.USERNAME;
  if (!user) return false;
  const principal = process.env.USERDOMAIN ? `${process.env.USERDOMAIN}\\${user}` : user;
  try {
    await execFileAsync("icacls", [filePath, "/inheritance:r", "/grant:r", `${principal}:F`]);
    return true;
  } catch {
    return false;
  }
}
