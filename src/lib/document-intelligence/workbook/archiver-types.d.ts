/**
 * Archiver module augmentation
 *
 * The installed @types/archiver package declares only classes (Archiver,
 * ZipArchive etc.) but omits the module's default export — the factory
 * function `archiver(format, options)`.
 *
 * This augmentation adds the missing default export so client code can
 * use `import archiver from "archiver"`.
 */
import { Archiver, type CoreOptions, type TransformOptions, type ZipOptions } from "archiver";

declare module "archiver" {
  interface ArchiverFactory {
    (format: "zip", options?: CoreOptions & TransformOptions & ZipOptions): Archiver;
    (format: "tar", options?: CoreOptions & TransformOptions): Archiver;
    (format: "json", options?: CoreOptions & TransformOptions): Archiver;
    create(format: string, options?: Record<string, unknown>): Archiver;
  }

  const _default: ArchiverFactory;
  export default _default;
}
