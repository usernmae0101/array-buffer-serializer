const BufferDecoder = require("./../lib/BufferDecoder.js");
const marks = require("./../lib/marks.js");

describe("BufferDecoder", () => {
    let bufferDecoder, ab, dv;
   
    const decodeAndExpect = (off, val, enr, ptr = [0]) => {
        bufferDecoder.decode();
        expect(bufferDecoder.offset).toBe(off + 1);
        expect(bufferDecoder._entries[enr]).toEqual({
            value: val,
            path: ptr 
        });
    };

    const setNegAndPosIntAtOnce = exp => {
        let offset = exp / 8;
        let method = exp < 64 ? `setUint${exp}` : `setBigUint${exp}`;
        let number = exp < 64 ? Math.pow(2, exp) - 1 :  BigInt(Math.pow(2, 42)); 

        // set positive
        dv.setUint8(1, marks[`DEFAULT_MARK_UINT${exp}`]);
        dv[method](2, number);
        // set negative
        dv.setUint8(2 + offset, marks[`DEFAULT_MARK_INT${exp}`]);
        dv[method](3 + offset, number);
        decodeAndExpect(1 + offset, exp < 64 ? number : Number(number), 0, [0]);
        decodeAndExpect((1 + offset) * 2, exp < 64 ? -number : -(Number(number)), 1, [1]);
    };

    beforeEach(() => {
        ab = new ArrayBuffer(64);
        dv = new DataView(ab);
        dv.setUint8(0, 0);
        bufferDecoder = new BufferDecoder(dv);
    });

    it("decodes 2^8 and -2^8 correctly", () => {
        setNegAndPosIntAtOnce(8);
    });

    it("decodes 2^16 and -2^16 correctly", () => {
        setNegAndPosIntAtOnce(16);
    });

    it("decodes 2^32 and -2^32 correctly", () => {
        setNegAndPosIntAtOnce(32);
    });

    it("decodes 2^64 and -2^64 correctly", () => {
        setNegAndPosIntAtOnce(64);
    });

    [1.234567, 1.23456, 1.2345].forEach(float => {
        it("decodes float correctly", () => {
            dv.setUint8(1, marks.DEFAULT_MARK_FLOAT);
            dv.setFloat32(2, float);
            decodeAndExpect(5, float, 0);
        });
    });

    it("decodes double correctly", () => {
        dv.setUint8(1, marks.DEFAULT_MARK_DOUBLE);
        dv.setFloat64(2, 1.23456789012);
        decodeAndExpect(9, 1.23456789012, 0);
    });

    it("decodes bigint correctly", () => {
        dv.setUint8(1, marks.DEFAULT_MARK_BIGINT);
        dv.setBigUint64(2, 2n);
        decodeAndExpect(9, -2n, 0);
    });

    it("decodes ubigint correctly", () => {
        dv.setUint8(1, marks.DEFAULT_MARK_UBIGINT);
        dv.setBigUint64(2, 2n);
        decodeAndExpect(9, 2n, 0);
    });

    it("decodes boolean (both: true and false) correctly", () => {
        dv.setUint8(1, marks.DEFAULT_MARK_FBOOL);
        dv.setUint8(2, marks.DEFAULT_MARK_TBOOL);
        decodeAndExpect(1, false, 0, [0]);
        decodeAndExpect(2, true, 1, [1]);
    });

    it("decodes undefined corecctly", () => {
        dv.setUint8(1, marks.DEFAULT_MARK_UNDEF);
        decodeAndExpect(1, undefined, 0);
    });

    it("decodes null correctly", () => {
        dv.setUint8(1, marks.DEFAULT_MARK_NULL);
        decodeAndExpect(1, null, 0);
    });

    it("creates an empty array and add index", () => {
        dv.setUint8(1, marks.DEFAULT_MARK_ARR_OPEN);
        decodeAndExpect(1, [], 0);
        expect(bufferDecoder._pointer).toEqual([0]); 
    });

    it("creates an empty object", () => {
        dv.setUint8(1, marks.DEFAULT_MARK_OBJ_OPEN);
        decodeAndExpect(1, {}, 0);
    });

    it("deletes pointer key when close object", () => {
        bufferDecoder._pointer.push("one", "two");
        dv.setUint8(1, marks.DEFAULT_MARK_OBJ_CLOSE);
        bufferDecoder.decode();
        expect(bufferDecoder._pointer).toEqual(["one"]);
    });

    it("deletes pointer index when close an array", () => {
        bufferDecoder._pointer.push(1, 4, 3);
        dv.setUint8(1, marks.DEFAULT_MARK_ARR_CLOSE);
        bufferDecoder.decode();
        expect(bufferDecoder._pointer).toEqual([1, 4]);
    });

    it("decodes string correctly", () => {
        let str = "test works";
        dv.setUint8(1, marks.DEFAULT_MARK_STR8);
        Array.from(str).forEach((char, index) => {
            dv.setUint8(index + 2, char.charCodeAt(0));
        });
        dv.setUint8(str.length + 2, marks.DEFAULT_MARK_STR8);
        decodeAndExpect(str.length + 2, str, 0);
    });
});
