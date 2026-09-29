/** Ambil ID video YouTube dari berbagai bentuk tautan (youtu.be, watch?v=, embed, shorts, live). */
export function parseYouTubeId(input: string): string | null {
  const value = input.trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\.|^m\./, "");
  let id: string | null = null;
  if (host === "youtu.be") id = url.pathname.split("/")[1] ?? null;
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    if (url.pathname === "/watch") id = url.searchParams.get("v");
    else {
      const [, kind, second] = url.pathname.split("/");
      if (["embed", "shorts", "live", "v"].includes(kind)) id = second ?? null;
    }
  }
  return id && /^[\w-]{11}$/.test(id) ? id : null;
}

/** Gambar mini otomatis dari YouTube (4:3 dengan pita hitam atas-bawah; dipotong lewat object-cover 16:9). */
export function youtubeThumbnail(id: string): string {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

export function youtubeEmbedUrl(id: string, autoplay = false): string {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1${autoplay ? "&autoplay=1" : ""}`;
}

export function youtubeWatchUrl(id: string): string {
  return `https://youtu.be/${id}`;
}
