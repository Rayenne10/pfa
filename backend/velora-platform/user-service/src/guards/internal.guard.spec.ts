import { isInternal } from './internal.guard';
describe('internal API credential boundary', () => {
  beforeEach(() => { process.env.INTERNAL_API_TOKEN = 'a'.repeat(48); });
  it('accepts only the configured token', () => {
    expect(isInternal('a'.repeat(48))).toBe(true);
    expect(isInternal('b'.repeat(48))).toBe(false);
    expect(isInternal(undefined)).toBe(false);
    expect(isInternal(['a'.repeat(48)])).toBe(false);
  });
  it('fails closed when the credential is absent', () => {
    delete process.env.INTERNAL_API_TOKEN;
    expect(isInternal('a'.repeat(48))).toBe(false);
  });
});
