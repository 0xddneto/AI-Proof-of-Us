import { Transform, type TransformCallback } from "node:stream";
/** Bound each JSON-RPC line before the SDK parses or validates it. */
export class BoundedStdioInput extends Transform {
  private bytes = 0;
  constructor(private readonly maxLineBytes = 1024 * 1024) {
    super();
  }
  override _transform(
    chunk: Buffer,
    _encoding: BufferEncoding,
    callback: TransformCallback,
  ): void {
    for (const byte of chunk) {
      if (byte === 10) this.bytes = 0;
      else if (++this.bytes > this.maxLineBytes) {
        callback(
          new Error("AIPOU_INPUT_TOO_LARGE: JSON-RPC line exceeds 1 MiB"),
        );
        return;
      }
    }
    callback(null, chunk);
  }
}
