// client/src/utils/resolveImage.js
// Normalizes and transforms various webpage/media URLs into direct image URLs

/**
 * Normalizes URLs from Wikipedia, Google Drive, Dropbox, Imgur, Open Library, etc.
 * @param {string} rawUrl
 * @returns {string}
 */
export function normalizeImageUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();

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

    // 4. Imgur direct image links
    const imgurMatch = url.match(/^https?:\/\/(?:i\.)?imgur\.com\/([a-zA-Z0-9]+)(?:\.[a-zA-Z]+)?$/i);
    if (imgurMatch && !url.includes('/a/') && !url.includes('/gallery/')) {
      return `https://i.imgur.com/${imgurMatch[1]}.jpg`;
    }

    // 5. Open Library book / work / ISBN links
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

    // 6. Force https for http links where safe
    if (url.startsWith('http://books.google.com/')) {
      return url.replace('http://', 'https://');
    }
  } catch (err) {
    console.error('URL normalization error:', err.message);
  }

  return url;
}

