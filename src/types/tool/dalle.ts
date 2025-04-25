export type DallEImageQuality = 'high' | 'medium' | 'low';
export type DallEImageSize = '1536x1024' | '1024x1024' | '1024x1536';

export interface DallEImageItem {
  base64?: string;
  imageId?: string;
  previewUrl?: string;
  prompt: string;
  quality: DallEImageQuality;
  size: DallEImageSize;
}
