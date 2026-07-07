export {
  validatePhotos,
  processPhotos,
  stripExif,
  MAX_PHOTOS,
  MAX_PHOTO_SIZE_BYTES,
  ALLOWED_MIME_TYPES,
} from "./photo-validator";
export type {
  PhotoValidationError,
  PhotoValidationResult,
  ProcessedPhoto,
} from "./photo-validator";
