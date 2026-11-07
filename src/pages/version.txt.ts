import type { APIRoute } from 'astro';
import { execSync } from 'node:child_process';

// /version.txt: the commit this build came from. The IndexNow workflow
// (.github/workflows/indexnow.yml) polls it to know when a push to main is live.
// Workers Builds sets WORKERS_CI_COMMIT_SHA; elsewhere the checkout's HEAD answers.
function commitSha(): string {
  if (process.env.WORKERS_CI_COMMIT_SHA) return process.env.WORKERS_CI_COMMIT_SHA;
  try {
    return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
  } catch {
    return 'unknown';
  }
}

export const GET: APIRoute = () =>
  new Response(`${commitSha()}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
