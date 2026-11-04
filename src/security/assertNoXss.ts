import { expect, type Page } from '@playwright/test';

/**
 * Installs a dialog listener that fails the test if any alert/confirm/prompt fires.
 * Returns a disposer that removes the listener.
 */
export function watchForXssDialogs(page: Page): () => void {
  const onDialog = (dialog: { type: () => string; message: () => string; dismiss: () => Promise<void> }) => {
    const message = `Unexpected ${dialog.type()} dialog (possible XSS): ${dialog.message()}`;
    void dialog.dismiss();
    throw new Error(message);
  };
  page.on('dialog', onDialog);
  return () => page.off('dialog', onDialog);
}

/** Asserts a search/filter payload is not executed as HTML/JS in the document. */
export async function assertPayloadNotExecuted(page: Page, payload: string): Promise<void> {
  const executed = await page.evaluate((needle) => {
    const html = document.documentElement.innerHTML;
    // Raw script tags or event-handler attributes with our payload indicate reflection as HTML.
    if (needle.includes('<script') && /<script[\s>]/i.test(html) && html.includes(needle)) {
      return 'raw-script-in-dom';
    }
    if (/onerror\s*=/i.test(needle) && /<img[^>]+onerror\s*=/i.test(html) && html.includes('onerror')) {
      // Allow escaped text content; fail only if an img with onerror attribute exists containing alert.
      const imgs = Array.from(document.querySelectorAll('img[onerror]'));
      if (imgs.some((img) => (img.getAttribute('onerror') || '').includes('alert'))) {
        return 'img-onerror-executed';
      }
    }
    return null;
  }, payload);

  expect(executed, `XSS payload appears executed in DOM: ${payload}`).toBeNull();
}
