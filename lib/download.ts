import androidDownloadManifest from "@/public/download/android-latest.json";

type AndroidDownloadManifest = {
  available?: boolean;
  versionName?: string;
  versionCode?: number;
  tag?: string;
  commitSha?: string;
  apkSha256?: string;
  apkBytes?: number;
  publishedAt?: string;
  minSdk?: number;
  downloadRequiresAccount?: boolean;
  downloadApiPath?: string;
};

export type AndroidDownload =
  | {
      available: true;
      versionName: string;
      versionCode: number;
      tag: string;
      commitSha: string;
      shortCommitSha: string;
      apkSha256: string;
      apkBytes: number;
      publishedAt: string;
      minSdk: number;
      downloadRequiresAccount: true;
      downloadApiPath: string;
    }
  | {
      available: false;
      reason: string;
    };

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && Number(value) > 0;
}

function isLocalApiPath(value: unknown): value is string {
  return value === "/api/download/android";
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

export function formatBytes(value: number): string {
  return new Intl.NumberFormat("en", {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(value / (1024 * 1024)) + " MB";
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
  const apkSha256 = manifest.apkSha256;
  const apkBytes = manifest.apkBytes;
  const publishedAt = manifest.publishedAt;
  const minSdk = manifest.minSdk;
  const downloadRequiresAccount = manifest.downloadRequiresAccount;
  const downloadApiPath = manifest.downloadApiPath;

  if (
    !hasText(versionName) ||
    !isPositiveInteger(versionCode) ||
    !hasText(tag) ||
    !hasText(commitSha) ||
    !hasText(apkSha256) ||
    !isPositiveInteger(apkBytes) ||
    !hasText(publishedAt) ||
    Number.isNaN(Date.parse(publishedAt)) ||
    !isPositiveInteger(minSdk) ||
    downloadRequiresAccount !== true ||
    !isLocalApiPath(downloadApiPath)
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
    apkSha256,
    apkBytes,
    publishedAt,
    minSdk,
    downloadRequiresAccount,
    downloadApiPath,
  };
}
