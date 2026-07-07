import { PDFDocument, rgb, degrees, StandardFonts } from "pdf-lib";

const WATERMARK_TEXT = "PREVIEW — Sign up for full report";

export async function addWatermark(
  pdfBytes: Uint8Array | Buffer,
): Promise<Uint8Array> {
  const doc = await PDFDocument.load(pdfBytes);
  const font = await doc.embedFont(StandardFonts.HelveticaBold);
  const pages = doc.getPages();

  for (const page of pages) {
    const { width, height } = page.getSize();
    const textWidth = font.widthOfTextAtSize(WATERMARK_TEXT, 28);
    page.drawText(WATERMARK_TEXT, {
      x: width / 2 - textWidth / 2,
      y: height / 2,
      size: 28,
      opacity: 0.3,
      rotate: degrees(-30),
      color: rgb(0.74, 0.36, 0.23), // accent #BD5D3A
      font,
    });

    // Second stamp near bottom as fallback
    page.drawText("UNVERIFIED PREVIEW", {
      x: 40,
      y: 40,
      size: 10,
      opacity: 0.25,
      color: rgb(0.1, 0.1, 0.1),
      font,
    });
  }

  return doc.save();
}
