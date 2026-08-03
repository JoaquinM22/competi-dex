//** src\utils\competidexImgCache.js

const imageProbeCache = new Map();
const imagePreloadCache = new Map();

function normalizeUrl(input)
{
  return String(input || "").trim();
}

function makeImage()
{
  const img = new Image();
  img.decoding = "async";
  img.loading = "eager";
  return img;
}

export function probeCachedImage(url)
{
  const key = normalizeUrl(url);
  if(!key) return Promise.resolve(false);

  const cached = imageProbeCache.get(key);
  if(cached)
  {
    if(typeof cached.ok === "boolean")
    {
      return Promise.resolve(cached.ok);
    }

    if(cached.promise)
    {
      return cached.promise;
    }
  }

  const promise = new Promise((resolve) =>
  {
    const img = makeImage();

    img.onload = () =>
    {
      imageProbeCache.set(key, { ok: true, promise: Promise.resolve(true) });
      imagePreloadCache.set(key, img);
      resolve(true);
    };

    img.onerror = () =>
    {
      imageProbeCache.set(key, { ok: false, promise: Promise.resolve(false) });
      imagePreloadCache.delete(key);
      resolve(false);
    };

    img.src = key;
  });

  imageProbeCache.set(key, { promise });
  return promise;
}

export function preloadCachedImage(url)
{
  const key = normalizeUrl(url);
  if(!key) return Promise.resolve(null);

  const cachedImage = imagePreloadCache.get(key);
  if(cachedImage)
  {
    return Promise.resolve(cachedImage);
  }

  const cachedProbe = imageProbeCache.get(key);
  if(cachedProbe?.ok === false)
  {
    return Promise.resolve(null);
  }

  if(cachedProbe?.promise && !cachedProbe.imagePromise)
  {
    const promise = cachedProbe.promise.then((ok) =>
    {
      if(!ok) return null;
      return imagePreloadCache.get(key) || null;
    });

    cachedProbe.imagePromise = promise;
    return promise;
  }

  const promise = new Promise((resolve) =>
  {
    const img = makeImage();

    img.onload = () =>
    {
      imageProbeCache.set(key, {
        ok: true,
        promise: Promise.resolve(true),
        imagePromise: Promise.resolve(img)
      });
      imagePreloadCache.set(key, img);
      resolve(img);
    };

    img.onerror = () =>
    {
      imageProbeCache.set(key, {
        ok: false,
        promise: Promise.resolve(false),
        imagePromise: Promise.resolve(null)
      });
      imagePreloadCache.delete(key);
      resolve(null);
    };

    img.src = key;
  });

  imageProbeCache.set(key, { promise, imagePromise: promise });
  return promise;
}

export function clearCachedImages()
{
  imageProbeCache.clear();
  imagePreloadCache.clear();
}

export function hasCachedImage(url)
{
  const key = normalizeUrl(url);
  if(!key) return false;

  return imagePreloadCache.has(key) || imageProbeCache.get(key)?.ok === true;
}