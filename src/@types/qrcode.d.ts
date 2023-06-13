declare module 'qrcode' {
  export function toDataURL(
    text: string | Buffer,
    options?: import('qrcode').QRCodeToDataURLOptions,
  ): Promise<string>;
}
