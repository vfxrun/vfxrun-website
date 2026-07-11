import { DOWNLOAD_ASSETS } from '../../src/config/site';

interface Env {
  DOWNLOADS?: R2Bucket;
}

async function buildDownloadResponse(context: EventContext<Env, string, Record<string, unknown>>) {
  const filename = context.params.filename;
  const asset = filename ? DOWNLOAD_ASSETS[filename] : undefined;
  if (!asset) {
    return new Response('Not found', { status: 404 });
  }

  if (context.env.DOWNLOADS) {
    const object = await context.env.DOWNLOADS.get(asset.r2Key);
    if (object) {
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Content-Disposition', `attachment; filename="${asset.fileName}"`);
      headers.set('Cache-Control', 'public, max-age=3600');
      return new Response(object.body, { headers });
    }
  }

  return Response.redirect(asset.fallbackUrl, 302);
}

export const onRequestGet: PagesFunction<Env> = async (context) => buildDownloadResponse(context);

export const onRequestHead: PagesFunction<Env> = async (context) => {
  const response = await buildDownloadResponse(context);
  return new Response(null, { status: response.status, headers: response.headers });
};
