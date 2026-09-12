import { execFile } from "node:child_process";
import { chmod, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const expectedFingerprint = "SHA256:I3OjKQYSDx2RSqalZOhKM7vO+Gw/pVy77u6rpHgIFLI";
const privateKeyBase64 = process.env.SSDD_CHERRY_SSH_PRIVATE_KEY_B64?.trim();
const passphrase = process.env.SSDD_CHERRY_SSH_PASSPHRASE;

describe("SSDD Cherry SSH credential", () => {
  it.skipIf(!privateKeyBase64 || !passphrase)("is parseable and matches the owner-selected public key", async () => {
    const directory = await mkdtemp(join(tmpdir(), "ssdd-cherry-key-"));
    const keyPath = join(directory, "id_ed25519");
    const publicKeyPath = `${keyPath}.pub`;

    try {
      const transferredKey = Buffer.from(privateKeyBase64!, "base64");
      const transferredText = transferredKey.toString("utf8");
      expect(transferredText.startsWith("-----BEGIN OPENSSH PRIVATE KEY-----\n")).toBe(true);
      expect(transferredText.endsWith("-----END OPENSSH PRIVATE KEY-----\n")).toBe(true);
      await writeFile(keyPath, transferredKey, { mode: 0o600 });
      await chmod(keyPath, 0o600);
      await execFileAsync("ssh-keygen", ["-p", "-P", passphrase!, "-N", "", "-f", keyPath]);
      const { stdout: derivedPublicKey } = await execFileAsync("ssh-keygen", ["-y", "-f", keyPath]);
      await writeFile(publicKeyPath, derivedPublicKey, { mode: 0o600 });
      const { stdout } = await execFileAsync("ssh-keygen", ["-lf", publicKeyPath]);
      expect(stdout).toContain(expectedFingerprint);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
});
