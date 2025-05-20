export interface ImageKitUploadVersionInfo {
  id: string;
  name: string;
}

export interface ImageKitUploadResult {
  fileId: string;
  name: string;
  size: number;
  versionInfo: ImageKitUploadVersionInfo;
  filePath: string;
  url: string;
  fileType: string;
  height: number;
  width: number;
  orientation: number;
  thumbnailUrl: string;
  AITags?: any;
}

export interface ImageKitUploadResponse {
  result: ImageKitUploadResult;
}
