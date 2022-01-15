const BufferEncoder = require("./../lib/BufferEncoder.js");

describe("BufferEncoder", () => {
    let bufferEncoder;

    beforeEach(() => {
        bufferEncoder = new BufferEncoder;
    });

    it("encodes to uint8 correctly", () => {
        bufferEncoder._toInt8(255);
        expect(bufferEncoder._offset).toBe(1);
    });

    it("encodes to uint16 correctly", () => {
        bufferEncoder._toInt16(65535);
        expect(bufferEncoder._offset).toBe(2);
    });

    it("encodes to uint32 correctly", () => {
        bufferEncoder._toInt32(4294967295);
        expect(bufferEncoder._offset).toBe(4);
    });

    it("encodes to ubigint correctly", () => {
        bufferEncoder._toInt64(2n ** 64n - 1n);
        expect(bufferEncoder._offset).toBe(8);
    });

    it("encodes to float32 correctly", () => {
        bufferEncoder._toFloat32(1.234567);
        expect(bufferEncoder._offset).toBe(4);
    });

    it("encodes to float64 correctly", () => {
        bufferEncoder._toFloat64(1.234567890);
        expect(bufferEncoder._offset).toBe(8);
    });
    
    it("encodes null as 1 byte", () => {
        bufferEncoder.encode(undefined, null);
        expect(bufferEncoder._offset).toBe(1);
    });

    it("encodes [155] as 3 bytes", () => {
        bufferEncoder.encode(undefined, [155]);
        expect(bufferEncoder._offset).toBe(3);
    });
    
    it ("encodes [] (empty array) as 1 byte", () => {
        bufferEncoder.encode(undefined, []);
        expect(bufferEncoder._offset).toBe(1);
    });

    it("encodes {a:155} as 5 bytes", () => {
        bufferEncoder.encode(undefined, {a: 155});
        expect(bufferEncoder._offset).toBe(5);
    });   

    it("encodes 'hello' as 7 bytes", () => {
        bufferEncoder.encode(undefined, "hello");
        expect(bufferEncoder._offset).toBe(7);
    });

    it("encodes true as 1 byte", () => {
        bufferEncoder.encode(undefined, true);
        expect(bufferEncoder._offset).toBe(1);
    });

    it("encodes false as 1 byte", () => {
        bufferEncoder.encode(undefined, false);
        expect(bufferEncoder._offset).toBe(1);
    });

    it("encodes undefined as 1 byte", () => {
        bufferEncoder.encode(undefined, undefined);
        expect(bufferEncoder._offset).toBe(1);
    });

    it("throws an error if value is NaN", () => {
        const f = () => {
            bufferEncoder.encode(undefined, NaN);
        };
        expect(f).toThrow(Error);
    });

    it("encodes 2^8 and -2^8 as 4 bytes (with marks)", () => {
        bufferEncoder.encode(undefined, Math.pow(2, 8) - 1);
        bufferEncoder.encode(undefined, -(Math.pow(2, 8) - 1));
        expect(bufferEncoder._offset).toBe(4);
    });

    it("encodes 2^16 and -2^16 as 6 bytes (with marks)", () => {
        bufferEncoder.encode(undefined, Math.pow(2, 16) - 1);
        bufferEncoder.encode(undefined, -(Math.pow(2, 16) - 1));
        expect(bufferEncoder._offset).toBe(6);
    });
    
    it("encodes 2^32 and -2^32 as 10 bytes (with marks)", () => {
        bufferEncoder.encode(undefined, Math.pow(2, 32) - 1);
        bufferEncoder.encode(undefined, -(Math.pow(2, 32) - 1));
        expect(bufferEncoder._offset).toBe(10);
    });

    it("encodes 2^64 and -2^64 (bigint) as 18 bytes (with marks)", () => {
        bufferEncoder.encode(undefined, 2n ** 64n - 1n);
        bufferEncoder.encode(undefined, -(2n ** 64n - 1n));
        expect(bufferEncoder._offset).toBe(18);
    });

    it("encodes 2^53 - 1 and -(2^53 - 1) (integer) as 16 bytes (with marks)", () => {
        bufferEncoder.encode(undefined, 2 ** 53 - 1);
        bufferEncoder.encode(undefined, -(2 ** 53 - 1));
        expect(bufferEncoder._offset).toBe(16);
    });

    it("encodes 1.234567 as 5 bytes (float with mark)", () => {
        bufferEncoder.encode(undefined, 1.234567);
        expect(bufferEncoder._offset).toBe(5);
    });

    it("encodes 1.2345678901 as 9 bytes (double with mark)", () => {
        bufferEncoder.encode(undefined, 1.2345678901);
        expect(bufferEncoder._offset).toBe(9);
    });

    it("throws an error if value is function", () => {
        const f = () => {
            bufferEncoder.encode(undefined, function() {});
        };
        expect(f).toThrow(Error);
    });
});
