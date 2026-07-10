import { WINDOWS_DOWNLOAD } from '../../src/config/site';

interface Env {
  DOWNLOADS?: R2Bucket;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const asset = context.params.asset;
  if (asset !== WINDOWS_DOWNLOAD.fileName) {
    return new Response('Not found', { status: 404 });
  }

  if (context.env.DOWNLOADS) {
    const object = await context.env.DOWNLOADS.get(WINDOWS_DOWNLOAD.r2Key);
    if (object) {
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Content-Disposition', `attachment; filename="${WINDOWS_DOWNLOAD.fileName}"`);
      headers.set('Cache-Control', 'public, max-age=3600');
      return new Response(object.body, { headers });
    }
  }

  return Response.redirect(WINDOWS_DOWNLOAD.fallbackUrl, 302);
};
