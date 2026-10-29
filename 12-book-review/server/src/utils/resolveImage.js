// server/src/utils/resolveImage.js
// Resolves common webpage and media URLs into direct image URLs

/**
 * Fast synchronous transformation for well-known services
 * @param {string} rawUrl
 * @returns {string}
 */
export function normalizeImageUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();

  // Handle protocol-relative URLs
  if (url.startsWith('//')) {
    url = `https:${url}`;
  }

  try {
    // 1. Wikipedia / Wikimedia "File:" page URLs
    // e.g. https://en.wikipedia.org/wiki/File:Harry_Potter_and_the_Prisoner_of_Azkaban.jpg
    // or https://commons.wikimedia.org/wiki/File:Example.jpg#mediaviewer/...
    const wikiFileMatch = url.match(
      /^https?:\/\/([^/]+)\/wiki\/(?:File|file):([^?#]+)/i
    );
    if (wikiFileMatch) {
      const domain = wikiFileMatch[1];
      const filename = decodeURIComponent(wikiFileMatch[2]);
      return `https://${domain}/wiki/Special:FilePath/${encodeURIComponent(filename)}`;
    }

    // 2. Google Drive share links
    // e.g. https://drive.google.com/file/d/FILE_ID/view...
    const gDriveMatch = url.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/i);
    if (gDriveMatch) {
      return `https://lh3.googleusercontent.com/d/${gDriveMatch[1]}`;
    }
    const gDriveIdMatch = url.match(/drive\.google\.com\/(?:open|uc)\?(?:[^&]+&)*id=([a-zA-Z0-9_-]+)/i);
    if (gDriveIdMatch) {
      return `https://lh3.googleusercontent.com/d/${gDriveIdMatch[1]}`;
    }

    // 3. Dropbox share links
    if (url.includes('dropbox.com') && url.includes('dl=0')) {
      return url.replace('dl=0', 'raw=1');
    }

    // 4. Imgur page links
    const imgurMatch = url.match(/^https?:\/\/(?:i\.)?imgur\.com\/([a-zA-Z0-9]+)(?:\.[a-zA-Z]+)?$/i);
    if (imgurMatch && !url.includes('/a/') && !url.includes('/gallery/')) {
      return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
    }

    // 5. Open Library book or work links
    const openLibBookMatch = url.match(/openlibrary\.org\/books\/(OL[0-9A-Za-z]+M)/i);
    if (openLibBookMatch) {
      return `https://covers.openlibrary.org/b/olid/${openLibBookMatch[1]}-L.jpg`;
    }
    const openLibWorkMatch = url.match(/openlibrary\.org\/works\/(OL[0-9A-Za-z]+W)/i);
    if (openLibWorkMatch) {
      return `https://covers.openlibrary.org/b/olid/${openLibWorkMatch[1]}-L.jpg`;
    }
    const openLibIsbnMatch = url.match(/openlibrary\.org\/isbn\/([0-9Xx]+)/i);
    if (openLibIsbnMatch) {
      return `https://covers.openlibrary.org/b/isbn/${openLibIsbnMatch[1]}-L.jpg`;
    }

    // 6. Force https for http links where safe (e.g. google books)
    if (url.startsWith('http://books.google.com/')) {
      return url.replace('http://', 'https://');
    }
  } catch (err) {
    console.error('URL normalization error:', err.message);
  }

  return url;
}

/**
 * Resolves a URL to a direct image URL.
 * If the URL is a webpage, attempts to fetch og:image / twitter:image.
 * @param {string} url
 * @returns {Promise<string>}
 */
export async function resolveCoverUrl(url) {
  if (!url || typeof url !== 'string') return '';
  const normalized = normalizeImageUrl(url);

  // If already ends in typical image extension or is data URL, return immediately
  if (
    normalized.startsWith('data:image/') ||
    /\.(jpe?g|png|webp|gif|svg|avif)($|\?)/i.test(normalized) ||
    normalized.includes('Special:FilePath') ||
    normalized.includes('covers.openlibrary.org') ||
    normalized.includes('googleusercontent.com')
  ) {
    return normalized;
  }

  // If it's a webpage URL, attempt to scrape OpenGraph image
  if (/^https?:\/\//i.test(normalized)) {
    try {
      const res = await fetch(normalized, {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/*;q=0.8',
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(4000),
      });

      const contentType = res.headers.get('content-type') || '';
      // If the URL directly returned an image
      if (contentType.startsWith('image/')) {
        return res.url || normalized;
      }

      // If HTML was returned, parse metadata
      if (contentType.includes('text/html') || contentType.includes('xml')) {
        const html = await res.text();

        // Check OpenGraph and Twitter image meta tags
        const metaRegex =
          /<meta[^>]+(?:property|name)=["'](?:og:image|og:image:url|twitter:image|twitter:image:src)["'][^>]+content=["']([^"']+)["']/i;
        const altMetaRegex =
          /<meta[^>]+content=["']([^"']+)["'][^>]+(?:property|name)=["'](?:og:image|og:image:url|twitter:image|twitter:image:src)["']/i;

        const match = html.match(metaRegex) || html.match(altMetaRegex);
        if (match && match[1]) {
          let foundImg = match[1].replace(/&amp;/g, '&').trim();
          if (foundImg.startsWith('//')) {
            foundImg = `https:${foundImg}`;
          } else if (foundImg.startsWith('/')) {
            const urlObj = new URL(res.url || normalized);
            foundImg = `${urlObj.origin}${foundImg}`;
          }
          return foundImg;
        }
      }
    } catch {
      // On network timeout or parse failure, fall back to normalized URL
    }
  }

  return normalized;
}

