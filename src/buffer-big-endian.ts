/**
 * uint8array to string
 * from https://www.jianshu.com/p/4db4b2633dbe
 *
 */

interface UnicodeOk {
  unicode: number;
  ok: boolean;
}

interface UnicodeLen {
  unicode: number;
  len: number;
}

export class BufferBigEndian {
  buffer: number[]; //uint8array
  private readOffset: number;

  constructor() {
    this.buffer = [];
    this.readOffset = 0;
  }

  initWithUint8Array(array: ArrayLike<number>, len?: number) {
    len = len || array.length;
    this.buffer = [];
    for (let i = 0; i < len && i < array.length; i++) this.buffer[i] = array[i];
    this.readOffset = 0;
  }

  getUint8(): number {
    if (this.readOffset + 1 > this.buffer.length) return 0;
    return this.buffer[this.readOffset++];
  }

  pushUint8(value: number): void {
    if (value > 255) throw Error('BufferBigEndian pushUint8 value need <= 255');
    this.buffer.push(value);
  }

  getUint16(): number {
    if (this.readOffset + 2 > this.buffer.length) return 0;
    let uint1 = this.getUint8();
    let uint2 = this.getUint8();
    return (uint1 << 8) | uint2;
  }

  pushUint16(value: number): void {
    this.pushUint8((value >> 8) & 0xff);
    this.pushUint8(value & 0xff);
  }

  getUint32(): number {
    if (this.readOffset + 4 > this.buffer.length) return 0;
    let uint1 = this.getUint16();
    let uint2 = this.getUint16();
    return uint1 * 65536 + uint2;
  }

  pushUint32(value: number): void {
    this.pushUint16((value >> 16) & 0xffff);
    this.pushUint16(value & 0xffff);
  }

  getInt64(): number {
    let hi = this.getUint32();
    let lo = this.getUint32();
    if (hi >> 31 == 1) return -(hi * 4294967296 + lo);
    return hi * 4294967296 + lo;
  }

  pushUnicodeWithUtf8(value: number): void {
    if (value <= 0x7f) {
      this.pushUint8(value);
    } else if (value <= 0xff) {
      this.pushUint8((value >> 6) | 0xc0);
      this.pushUint8((value & 0x3f) | 0x80);
    } else if (value <= 0xffff) {
      this.pushUint8((value >> 12) | 0xe0);
      this.pushUint8(((value >> 6) & 0x3f) | 0x80);
      this.pushUint8((value & 0x3f) | 0x80);
    } else if (value <= 0x1fffff) {
      this.pushUint8((value >> 18) | 0xf0);
      this.pushUint8(((value >> 12) & 0x3f) | 0x80);
      this.pushUint8(((value >> 6) & 0x3f) | 0x80);
      this.pushUint8((value & 0x3f) | 0x80);
    } else if (value <= 0x3ffffff) {
      this.pushUint8((value >> 24) | 0xf8);
      this.pushUint8(((value >> 18) & 0x3f) | 0x80);
      this.pushUint8(((value >> 12) & 0x3f) | 0x80);
      this.pushUint8(((value >> 6) & 0x3f) | 0x80);
      this.pushUint8((value & 0x3f) | 0x80);
    } else {
      this.pushUint8(((value >> 30) & 0x1) | 0xfc);
      this.pushUint8(((value >> 24) & 0x3f) | 0x80);
      this.pushUint8(((value >> 18) & 0x3f) | 0x80);
      this.pushUint8(((value >> 12) & 0x3f) | 0x80);
      this.pushUint8(((value >> 6) & 0x3f) | 0x80);
      this.pushUint8((value & 0x3f) | 0x80);
    }
  }

  getUnicodeWithUtf8(): UnicodeLen | null {
    let result;
    let start = this.getUint8();
    if (start == null) return null;
    let n = 7;
    while (((start >> n) & 1) == 1) n--;
    n = 7 - n;
    if (n == 0) result = start;
    else result = start & (Math.pow(2, 7 - n) - 1);
    for (let i = 1; i < n; i++) {
      let follow = this.getUint8();
      if ((follow & 0x80) == 0x80) {
        result = (result << 6) | (follow & 0x3f);
      } else {
        result = start;
        this.changeReadOffset(1 - n);
        n = 0;
        break;
      }
    }
    return { unicode: result, len: n == 0 ? 1 : n };
  }

  parseUnicodeFromUtf16(ch1: number, ch2: number): UnicodeOk {
    if ((ch1 & 0xfc00) === 0xd800 && (ch2 & 0xfc00) === 0xdc00) {
      return { unicode: (((ch1 & 0x3ff) << 10) | (ch2 & 0x3ff)) + 0x10000, ok: true };
    }
    return { unicode: 0, ok: false };
  }

  pushStringWithUtf8(value: string): number {
    let oldlen = this.buffer.length;
    for (let i = 0; i < value.length; i++) {
      let ch1 = value.charCodeAt(i);
      if (ch1 < 128) this.pushUnicodeWithUtf8(ch1);
      else if (ch1 < 2048) {
        this.pushUnicodeWithUtf8(ch1);
      } else {
        let ch2 = value.charCodeAt(i + 1);
        let unicodeOk = this.parseUnicodeFromUtf16(ch1, ch2);
        if (unicodeOk.ok) {
          this.pushUnicodeWithUtf8(unicodeOk.unicode);
          i++;
        } else {
          this.pushUnicodeWithUtf8(ch1);
        }
      }
    }
    return this.buffer.length - oldlen;
  }

  getStringWithUtf8(len: number): string {
    if (len < 1) return '';
    if (this.readOffset + len > this.buffer.length) return '';
    let str = '';
    let read = 0;
    while (read < len) {
      let unicodeLen = this.getUnicodeWithUtf8();
      if (!unicodeLen) {
        break;
      }
      read += unicodeLen.len;
      if (unicodeLen.unicode < 0x10000) {
        str += String.fromCharCode(unicodeLen.unicode);
      } else {
        let minus = unicodeLen.unicode - 0x10000;
        let ch1 = (minus >> 10) | 0xd800;
        let ch2 = (minus & 0x3ff) | 0xdc00;
        str += String.fromCharCode(ch1, ch2);
      }
    }
    return str;
  }

  pushStringWithUtf16(value: string): number {
    let oldlen = this.buffer.length;
    for (let i = 0; i < value.length; i++) {
      let ch = value[i].charCodeAt(0);
      this.pushUint16(ch);
    }
    return this.buffer.length - oldlen;
  }

  getStringWithUtf16(len: number): string {
    if (len < 1) return '';
    if (this.readOffset + len > this.buffer.length || len % 2 != 0) return '';
    let str = '';
    for (let i = 0; i < len; i += 2) {
      let ch1 = this.getUint16();
      let ch2 = this.getUint16();
      str += String.fromCharCode(ch1, ch2);
    }
    return str;
  }

  pushUint8List(val: ArrayLike<number>) {
    for (let i = 0; i < val.length; i++) this.pushUint8(val[i]);
  }

  getUint8List(len?: number): Uint8Array {
    len = len || this.buffer.length;
    return new Uint8Array(this.buffer.slice(this.readOffset, this.readOffset + len));
  }

  tostring(): string {
    let result = '';
    for (let i = 0; i < this.buffer.length; i++) {
      let ch = this.buffer[i].toString(16);
      result += ch.length == 1 ? '0' + ch.toUpperCase() : ch.toUpperCase();
    }
    return result;
  }

  toUint8Array(): Uint8Array {
    let array = new Uint8Array(this.buffer.length);
    for (let i = 0; i < this.buffer.length; i++) array[i] = this.buffer[i];
    return array;
  }

  changeReadOffset(len: number) {
    this.readOffset = Math.max(0, Math.min(this.buffer.length, this.readOffset + len));
  }
}
