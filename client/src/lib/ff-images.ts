export function sanitizeUid(raw: string): string {
  return (raw || '').replace(/\D+/g, '');
}

export function sanitizeRegion(raw: string): string {
  const r = (raw || '').toLowerCase();
  return /^[a-z]{2,5}$/.test(r) ? r : '';
}

export function outfitImageUrl(region: string, uid: string, bustCache = false): string {
  const sanitizedRegion = sanitizeRegion(region);
  const sanitizedUid = sanitizeUid(uid);
  
  if (!sanitizedRegion || !sanitizedUid) {
    return '';
  }
  
  const baseUrl = `/api/ff-image?type=outfit&region=${sanitizedRegion}&uid=${sanitizedUid}`;
  return bustCache ? `${baseUrl}&t=${Date.now()}` : baseUrl;
}

export function bannerImageUrl(region: string, uid: string, bustCache = false): string {
  const sanitizedRegion = sanitizeRegion(region);
  const sanitizedUid = sanitizeUid(uid);
  
  if (!sanitizedRegion || !sanitizedUid) {
    return '';
  }
  
  const baseUrl = `/api/ff-image?type=banner&region=${sanitizedRegion}&uid=${sanitizedUid}`;
  return bustCache ? `${baseUrl}&t=${Date.now()}` : baseUrl;
}
