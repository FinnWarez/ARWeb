import androidDownloadManifest from "@/public/download/android-latest.json";

type AndroidDownloadManifest = {
  available?: boolean;
  versionName?: string;
  versionCode?: number;
  tag?: string;
  commitSha?: string;
  apkUrl?: string;
  apkSha256?: string;
  publishedAt?: string;
  minSdk?: number;
  releaseNotesUrl?: string;
};

export type AndroidDownload =
  | {
      available: true;
      versionName: string;
      versionCode: number;
      tag: string;
      commitSha: string;
      shortCommitSha: string;
      apkUrl: string;
      apkSha256: string;
      publishedAt: string;
      minSdk: number;
      releaseNotesUrl: string;
    }
  | {
      available: false;
      reason: string;
    };

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isHttpsUrl(value: unknown): value is string {
  if (!hasText(value)) {
    return false;
  }

  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) > 0;
}

export function androidRequirement(minSdk: number): string {
  if (minSdk >= 33) {
    return "Android 13 or newer";
  }

  return `Android API ${minSdk} or newer`;
}

export function formatDownloadDate(value: string): string {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function getAndroidDownload(): AndroidDownload {
  const manifest = androidDownloadManifest as AndroidDownloadManifest;

  if (manifest.available !== true) {
    return { available: false, reason: "The Android beta download is not published yet." };
  }

  const versionName = manifest.versionName;
  const versionCode = manifest.versionCode;
  const tag = manifest.tag;
  const commitSha = manifest.commitSha;
  const apkUrl = manifest.apkUrl;
  const apkSha256 = manifest.apkSha256;
  const publishedAt = manifest.publishedAt;
  const minSdk = manifest.minSdk;
  const releaseNotesUrl = manifest.releaseNotesUrl;

  if (
    !hasText(versionName) ||
    !isPositiveInteger(versionCode) ||
    !hasText(tag) ||
    !hasText(commitSha) ||
    !isHttpsUrl(apkUrl) ||
    !hasText(apkSha256) ||
    !hasText(publishedAt) ||
    Number.isNaN(Date.parse(publishedAt)) ||
    !isPositiveInteger(minSdk) ||
    !isHttpsUrl(releaseNotesUrl)
  ) {
    return { available: false, reason: "The Android beta download metadata is incomplete." };
  }

  return {
    available: true,
    versionName,
    versionCode,
    tag,
    commitSha,
    shortCommitSha: commitSha.slice(0, 7),
    apkUrl,
    apkSha256,
    publishedAt,
    minSdk,
    releaseNotesUrl,
  };
}
