"use client";

import { useState, useRef, useCallback } from "react";

/* ── Constants ── */

const MAX_PHOTOS = 8;
const MAX_SIZE_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ACCEPT_STRING = "image/jpeg,image/png,image/webp";

/* ── Types ── */

export interface PhotoEntry {
  id: string;
  data: string; // base64 data URL
  name: string;
  size_bytes: number;
  mime: string;
}

interface FileError {
  id: string;
  message: string;
}

interface Props {
  photos: PhotoEntry[];
  onPhotosChange: (photos: PhotoEntry[]) => void;
  disabled?: boolean;
  accessGated?: boolean;
  maxPhotos?: number;
}

/* ── Helpers ── */

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/* ── Client-side photo compression ── */

const COMPRESS_MAX_DIM = 1920; // px — longest side
const COMPRESS_QUALITY = 0.85; // JPEG quality

function compressImage(dataUrl: string, mime: string): Promise<{ data: string; mime: string }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;
      if (width > COMPRESS_MAX_DIM || height > COMPRESS_MAX_DIM) {
        const ratio = Math.min(COMPRESS_MAX_DIM / width, COMPRESS_MAX_DIM / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) { resolve({ data: dataUrl, mime }); return; }
      ctx.drawImage(img, 0, 0, width, height);
      const compressed = canvas.toDataURL("image/jpeg", COMPRESS_QUALITY);
      resolve({ data: compressed, mime: "image/jpeg" });
    };
    img.onerror = () => reject(new Error("Failed to load image for compression"));
    img.src = dataUrl;
  });
}

/* ── Component ── */

export function PhotoUpload({
  photos,
  onPhotosChange,
  disabled = false,
  accessGated = false,
  maxPhotos = MAX_PHOTOS,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<FileError[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const addError = useCallback((id: string, message: string) => {
    setErrors((prev) => [...prev, { id, message }]);
  }, []);

  const clearError = useCallback((id: string) => {
    setErrors((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const processFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = maxPhotos - photos.length;

      if (fileArray.length > remaining) {
        addError(generateId(), `Maximum ${maxPhotos} photos allowed. ${fileArray.length - remaining} skipped.`);
      }

      const batch = fileArray.slice(0, remaining);
      const newErrors: FileError[] = [];

      for (const file of batch) {
        const id = generateId();

        // Type check
        if (!ALLOWED_TYPES.includes(file.type)) {
          newErrors.push({ id, message: `${file.name}: unsupported format. Use JPEG, PNG, or WebP.` });
          continue;
        }

        // Size check
        if (file.size > MAX_SIZE_BYTES) {
          newErrors.push({
            id,
            message: `${file.name}: exceeds 8 MB (${formatSize(file.size)}).`,
          });
          continue;
        }

        // Read as data URL, then compress
        const reader = new FileReader();
        reader.onload = async (e) => {
          const data = e.target?.result as string;
          if (data) {
            try {
              const compressed = await compressImage(data, file.type);
              onPhotosChange([
                ...photos,
                {
                  id,
                  data: compressed.data,
                  name: file.name,
                  size_bytes: Math.round(data.length * 0.75),
                  mime: compressed.mime,
                },
              ]);
            } catch {
              // Fallback: use original if compression fails
              onPhotosChange([
                ...photos,
                { id, data, name: file.name, size_bytes: file.size, mime: file.type },
              ]);
            }
          }
        };
        reader.onerror = () => {
          newErrors.push({ id, message: `${file.name}: failed to read file.` });
        };
        reader.readAsDataURL(file);
      }

      if (newErrors.length > 0) {
        setErrors((prev) => [...prev, ...newErrors]);
      }
    },
    [photos, onPhotosChange, maxPhotos, addError],
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setErrors([]);
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
      }
      // Reset so same file can be re-selected
      e.target.value = "";
    },
    [processFiles],
  );

  const handleRemove = useCallback(
    (id: string) => {
      onPhotosChange(photos.filter((p) => p.id !== id));
      clearError(id);
    },
    [photos, onPhotosChange, clearError],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      setErrors([]);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles],
  );

  /* ── Access Gate ── */

  if (accessGated) {
    return (
      <div
        style={{
          padding: "1.5rem",
          backgroundColor: "#FFF0D6",
          border: "1px solid #E8D4A0",
          borderRadius: "8px",
          color: "#8A7A23",
          fontSize: "0.9rem",
          lineHeight: 1.5,
          textAlign: "center",
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: "0.5rem", fontSize: "1rem" }}>
          Diagnostic Credits Required
        </div>
        <p style={{ margin: 0, fontSize: "0.85rem" }}>
          Diagnostic Credits are required to generate a Full Engineering Diagnostic
          with photo-based AI interpretation.
        </p>
        <p style={{ margin: "0.5rem 0 0", fontSize: "0.85rem", color: "#6B6B68" }}>
          Preview analysis with text and measurements only is available without credits.
        </p>
      </div>
    );
  }

  /* ── Render ── */

  return (
    <div>
      {/* Section header */}
      <div style={{ marginBottom: "1rem" }}>
        <div
          style={{
            fontSize: "0.95rem",
            fontWeight: 600,
            color: "#1A1915",
            marginBottom: "0.3rem",
          }}
        >
          Photo Evidence
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "0.85rem",
            color: "#6B6B68",
            lineHeight: 1.5,
          }}
        >
          Use your phone camera or upload clear field photos. Include an overall
          view, a close-up of the issue, and a measurement reference when possible.
        </p>
      </div>

      {/* Drop zone / file input */}
      <div
        onClick={() => !disabled && fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          padding: "2rem 1.5rem",
          border: `2px dashed ${dragOver ? "#BD5D3A" : "#D6D4CC"}`,
          borderRadius: "10px",
          backgroundColor: dragOver ? "#FFF9F0" : "#F8F7F3",
          textAlign: "center",
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.13s",
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <div style={{ fontSize: "2rem", marginBottom: "0.5rem", color: "#BD5D3A" }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
        </div>
        <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#1A1915", marginBottom: "0.25rem" }}>
          {disabled ? "Upload unavailable" : "Tap to capture or choose photos"}
        </div>
        <div style={{ fontSize: "0.8rem", color: "#6B6B68" }}>
          {`JPEG, PNG, or WebP · Max ${maxPhotos} photos · 8 MB each`}
        </div>
        <div style={{ fontSize: "0.8rem", color: "#6B6B68", marginTop: "0.25rem" }}>
          {`${photos.length} / ${maxPhotos} selected`}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_STRING}
        capture="environment"
        multiple
        onChange={handleFileChange}
        style={{ display: "none" }}
        disabled={disabled}
      />

      {/* Inline errors */}
      {errors.length > 0 && (
        <div style={{ marginTop: "0.75rem" }}>
          {errors.map((err) => (
            <div
              key={err.id}
              style={{
                padding: "0.5rem 0.75rem",
                backgroundColor: "#F5D6D6",
                borderRadius: "6px",
                fontSize: "0.85rem",
                color: "#A12323",
                marginBottom: "0.4rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{err.message}</span>
              <button
                onClick={() => clearError(err.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#A12323",
                  cursor: "pointer",
                  fontSize: "1rem",
                  padding: "0 0.25rem",
                  lineHeight: 1,
                }}
                aria-label="Dismiss error"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Thumbnail grid */}
      {photos.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
            gap: "0.75rem",
            marginTop: "1rem",
          }}
        >
          {photos.map((photo) => (
            <div
              key={photo.id}
              style={{
                position: "relative",
                borderRadius: "8px",
                overflow: "hidden",
                border: "1px solid #D6D4CC",
                backgroundColor: "#F0EEE6",
                aspectRatio: "1",
              }}
            >
              <img
                src={photo.data}
                alt={photo.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <button
                onClick={() => handleRemove(photo.id)}
                disabled={disabled}
                style={{
                  position: "absolute",
                  top: "4px",
                  right: "4px",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "rgba(0,0,0,0.6)",
                  color: "#fff",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: disabled ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  lineHeight: 1,
                  padding: 0,
                }}
                aria-label={`Remove ${photo.name}`}
              >
                &times;
              </button>
              <div
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: "2px 6px",
                  backgroundColor: "rgba(0,0,0,0.5)",
                  fontSize: "0.65rem",
                  color: "#fff",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {formatSize(photo.size_bytes)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
