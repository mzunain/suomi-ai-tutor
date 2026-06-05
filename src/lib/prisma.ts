// Real PrismaClient when DATABASE_URL is set; stub otherwise.
// Once DATABASE_URL is added to Vercel, re-add `npx prisma generate &&`
// to the buildCommand in vercel.json.

type PrismaClientCtor = new () => unknown;

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

function loadPrismaClient(): PrismaClientCtor | null {
  try {
    const loadModule = new Function("moduleName", "return require(moduleName)") as (
      moduleName: string
    ) => { PrismaClient?: PrismaClientCtor };
    return loadModule("@prisma/client").PrismaClient ?? null;
  } catch {
    return null;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _prisma: any;

if (process.env.DATABASE_URL) {
  try {
    const PrismaClient = loadPrismaClient();
    if (!PrismaClient) throw new Error("Prisma client is unavailable");
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
