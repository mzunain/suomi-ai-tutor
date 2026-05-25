// Real PrismaClient when DATABASE_URL is set; stub otherwise.
// Once DATABASE_URL is added to Vercel, re-add `npx prisma generate &&`
// to the buildCommand in vercel.json.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeStub(): any {
  return new Proxy(
    {},
    {
      get: () =>
        new Proxy(
          {},
          { get: (_, key) => async () => (key === "findMany" ? [] : null) }
        ),
    }
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _prisma: any;

if (process.env.DATABASE_URL) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { PrismaClient } = require("@prisma/client");
    const g = globalThis as { _p?: typeof _prisma };
    _prisma = g._p ?? new PrismaClient();
    if (process.env.NODE_ENV !== "production") g._p = _prisma;
  } catch {
    _prisma = makeStub();
  }
} else {
  _prisma = makeStub();
}

export const prisma = _prisma;
