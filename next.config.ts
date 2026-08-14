import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Blog bodies are authored as MDX in content/blog. Pages stay .tsx. */
  pageExtensions: ["ts", "tsx", "mdx"],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // 301s from indexed Placester URLs go here once that site is retired.
      // See CLAUDE.md §11.
    ];
  },
};

/*
  No remark/rehype plugins, deliberately.

  Frontmatter would be the obvious one to add. It is not here because a post's
  metadata lives in lib/blog/data.ts as typed TypeScript rather than as untyped
  YAML inside the body — see the header of that file for why. The MDX file
  carries prose and nothing else.
*/
const withMDX = createMDX({});

export default withMDX(nextConfig);
