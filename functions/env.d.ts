/// <reference types="@cloudflare/workers-types" />

interface Env {
  DB?: D1Database;
  DOWNLOADS?: R2Bucket;
}

type PagesFunction<Env = unknown> = (context: {
  request: Request;
  env: Env;
  params: Record<string, string>;
  waitUntil: (promise: Promise<unknown>) => void;
  next: () => Promise<Response>;
  data: Record<string, unknown>;
}) => Response | Promise<Response>;
