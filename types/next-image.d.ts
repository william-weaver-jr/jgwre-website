/// <reference types="next/image-types/global" />

/*
  Declares the static image modules that `import photo from "@/assets/..."`
  relies on, so `tsc --noEmit` resolves them.

  Next.js normally supplies this through the generated next-env.d.ts, but that
  file is gitignored (create-next-app's default) and is only written when
  `next dev` or `next build` runs. CI runs Typecheck before Build, so on a fresh
  checkout the declarations did not exist yet and lib/images.ts failed with
  TS2307 — while passing locally, where next-env.d.ts lingers from earlier runs.

  Committing next-env.d.ts instead would not work: it also carries a
  `<reference path="./.next/types/routes.d.ts" />` pointing inside the ignored
  build directory, which is absent on a fresh checkout.

  Keep this file committed. Deleting it re-breaks CI without breaking any local
  machine that has run the dev server, which is the hardest kind of failure to
  spot.
*/
