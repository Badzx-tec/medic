import {
  buildPublicPageViewModel,
  renderPublicFaviconSvg,
  renderPublicSocialCardSvg
} from './public-data.js';
import type { PublicPageType, PublicRenderOptions } from './public-data.js';
import { renderPublicHtml, renderPublicNotFoundHtml } from './public-render.js';

export type { PublicPageType, PublicRenderOptions } from './public-data.js';

export function renderPublicPage(type: PublicPageType, draft: any, options: PublicRenderOptions) {
  return renderPublicHtml(buildPublicPageViewModel(type, draft, options));
}

export function renderPublicNotFoundPage() {
  return renderPublicNotFoundHtml();
}

export { renderPublicFaviconSvg, renderPublicSocialCardSvg };
