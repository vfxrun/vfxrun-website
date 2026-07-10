import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest';

/**
 * Ensures wishlist analytics never includes the voter email in the PostHog payload.
 */
describe('wishlist analytics payload', () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    fetchMock.mockResolvedValue(new Response('{}', { status: 200 }));
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('window', {
      location: {
        pathname: '/vfxrun/pro',
        origin: 'http://localhost:4321',
        host: 'localhost:4321',
      },
    });
    vi.stubGlobal('document', {
      documentElement: { dataset: { locale: 'en' }, lang: 'en' },
      querySelectorAll: () => [],
    });
    vi.stubGlobal('localStorage', {
      getItem: () => null,
      setItem: vi.fn(),
    });
    vi.stubGlobal('navigator', { userAgent: 'vitest' });
    vi.stubEnv('PUBLIC_POSTHOG_KEY', 'phc_test_key');
    vi.stubEnv('PUBLIC_POSTHOG_HOST', 'https://us.i.posthog.com');
    vi.stubEnv('DEV', 'true');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('sends comma-joined feature_name and feature_count for multiple selections', async () => {
    const { proVoteSubmittedProperties, track } = await import('../src/scripts/analytics');

    track('pro_vote_submitted', proVoteSubmittedProperties(['timeline', 'color']));

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    const body = JSON.parse(String(init.body)) as {
      event: string;
      properties: Record<string, unknown>;
    };

    expect(body.event).toBe('pro_vote_submitted');
    expect(body.properties.feature_name).toBe('timeline,color');
    expect(body.properties.feature_count).toBe(2);
    expect(body.properties.email).toBeUndefined();
    expect(JSON.stringify(body)).not.toContain('user@example.com');
  });

  it('proVoteSubmittedProperties joins all selected feature ids', async () => {
    const { proVoteSubmittedProperties } = await import('../src/scripts/analytics');

    expect(proVoteSubmittedProperties(['timeline', 'color'])).toEqual({
      feature_name: 'timeline,color',
      feature_count: 2,
    });
  });
});
