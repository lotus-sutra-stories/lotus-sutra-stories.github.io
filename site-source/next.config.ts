import type { NextConfig } from "next";

/**
 * Two-mode build configuration for Lotus Sutra Stories（法華感應錄）.
 *
 * Mode A — live development preview:
 *   `npm run dev` / `bun run dev` (default; no DEPLOY_TARGET set)
 *
 * Mode B — GitHub Pages static export:
 *   `bun run build:static`
 *   Produces a fully static `out/` directory. No route handlers, no
 *   middleware, no SSR-dependent views, no runtime database.
 *
 * The official repository is an *organization root* repository
 * (`lotus-sutra-stories.github.io`), which GitHub Pages serves at the
 * site root (https://lotus-sutra-stories.github.io/), so no basePath is
 * required. If the deployment target ever changes to a project
 * repository or sub-path, set `basePath` accordingly.
 */
const isGithubPages = process.env.DEPLOY_TARGET === "github-pages";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Static hosting (GitHub Pages) serves directory URLs; trailing slashes
  // keep every internal link directly resolvable as a file on disk.
  trailingSlash: true,
  ...(isGithubPages
    ? {
        output: "export" as const,
        images: { unoptimized: true },
      }
    : {}),
};

export default nextConfig;
