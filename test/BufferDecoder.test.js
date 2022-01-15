const BufferDecoder = require("./../lib/BufferDecoder.js");
const marks = require("./../lib/marks.js");
const ieee754 = require("ieee754");

describe("BufferDecoder", () => {
    let bufferDecoder, view;
   
    const decodeAndExpect = (off, val, enr, ptr = [0]) => {
        bufferDecoder.decode();
        expect(bufferDecoder.offset).toBe(off + 1);
        expect(bufferDecoder._entries[enr]).toEqual({
            value: val,
            path: ptr 
        });
    };

    beforeEach(() => {
        view = new Uint8Array(64);
        view[0] = 0;
        bufferDecoder = new BufferDecoder(view);
    });

    it("decodes 2^8 and -2^8 correctly", () => {
        view[1] = marks.DEFAULT_MARK_UINT8;
        view[2] = 255;
        decodeAndExpect(2, 2 ** 8 - 1, 0);
        
        view[3] = marks.DEFAULT_MARK_INT8;
        view[4] = 255;
        decodeAndExpect(4, -(2 ** 8 - 1), 1, [1]);
    });
    
    it("decodes 2^16 and -2^16 correctly", () => {
        view[1] = marks.DEFAULT_MARK_UINT16;
        view[2] = 255;
        view[3] = 255;
        decodeAndExpect(3, 2 ** 16 - 1, 0);
        
        view[4] = marks.DEFAULT_MARK_INT16;
        view[5] = 255;
        view[6] = 255;
        decodeAndExpect(6, -(2 ** 16  - 1), 1, [1]);
    });
    
    it("decodes 2^32 and -2^32 correctly", () => {
        view[1] = marks.DEFAULT_MARK_UINT32;
        view[2] = 255;
        view[3] = 255;
        view[4] = 255;
        view[5] = 255;
        decodeAndExpect(5, 2 ** 32 - 1, 0);
        
        view[6] = marks.DEFAULT_MARK_INT32;
        view[7] = 255;
        view[8] = 255;
        view[9] = 255;
        view[10] = 255;
        decodeAndExpect(10, -(2 ** 32 - 1), 1, [1]);
    });

    it("decodes 2^53 and -2^53 correctly", () => {
        view[1] = marks.DEFAULT_MARK_UINT53;
        view[2] = 255;
        view[3] = 255;
        view[4] = 255;
        view[5] = 255;
        view[6] = 255;
        view[7] = 255;
        view[8] = 31;
        decodeAndExpect(8, 2 ** 53 - 1, 0);
        
        view[9] = marks.DEFAULT_MARK_INT53;
        view[10] = 255;
        view[11] = 255;
        view[12] = 255;
        view[13] = 255;
        view[14] = 255;
        view[15] = 255;
        view[16] = 31;
        decodeAndExpect(16, -(2 ** 53 - 1), 1, [1]);
    });

    it("decodes 2^64 and -2^64 correctly", () => {
        view[1] = marks.DEFAULT_MARK_UBIGINT;
        view[2] = 255;
        view[3] = 255;
        view[4] = 255;
        view[5] = 255;
        view[6] = 255;
        view[7] = 255;
        view[8] = 255;
        view[9] = 255;
        decodeAndExpect(9, 2n ** 64n - 1n, 0);
        
        view[10] = marks.DEFAULT_MARK_BIGINT;
        view[11] = 255;
        view[12] = 255;
        view[13] = 255;
        view[14] = 255;
        view[15] = 255;
        view[16] = 255;
        view[17] = 255;
        view[18] = 255;
        decodeAndExpect(18, -(2n ** 64n - 1n), 1, [1]);
    });

    [1.234567, 1.23456, 1.2345].forEach(float => {
        it("decodes float correctly", () => {
            view[1] =  marks.DEFAULT_MARK_FLOAT;
            ieee754.write(view, float, 2, false, 23, 4);
            decodeAndExpect(5, float, 0);
        });
    });

    it("decodes double correctly", () => {
        view[1] = marks.DEFAULT_MARK_DOUBLE;
        ieee754.write(view, 1.23456789012, 2, false, 52, 8);
        decodeAndExpect(9, 1.23456789012, 0);
    });

    it("decodes boolean (both: true and false) correctly", () => {
        view[1] = marks.DEFAULT_MARK_FBOOL;
        view[2] = marks.DEFAULT_MARK_TBOOL;
        decodeAndExpect(1, false, 0, [0]);
        decodeAndExpect(2, true, 1, [1]);
    });
    
    it("decodes undefined corecctly", () => {
        view[1] = marks.DEFAULT_MARK_UNDEF;
        decodeAndExpect(1, undefined, 0);
    });

    it("decodes null correctly", () => {
        view[1] = marks.DEFAULT_MARK_NULL;
        decodeAndExpect(1, null, 0);
    });

    it("creates an empty array and add index", () => {
        view[1] = marks.DEFAULT_MARK_ARR_OPEN;
        decodeAndExpect(1, [], 0);
        expect(bufferDecoder._pointer).toEqual([0]); 
    });

    it("creates an empty object", () => {
        view[1] = marks.DEFAULT_MARK_OBJ_OPEN;
        decodeAndExpect(1, {}, 0);
    });

    it("deletes pointer key when close object", () => {
        bufferDecoder._pointer.push("one", "two");
        view[1] = marks.DEFAULT_MARK_OBJ_CLOSE;
        bufferDecoder.decode();
        expect(bufferDecoder._pointer).toEqual(["one"]);
    });

    it("deletes pointer index when close an array", () => {
        bufferDecoder._pointer.push(1, 4, 3);
        view[1] = marks.DEFAULT_MARK_ARR_CLOSE;
        bufferDecoder.decode();
        expect(bufferDecoder._pointer).toEqual([1, 4]);
    });

    it("decodes string correctly", () => {
        let str = "test works";
        view[1] = marks.DEFAULT_MARK_STR8;
        Array.from(str).forEach((char, index) => {
            view[index + 2] = char.charCodeAt(0);
        });
        view[str.length + 2] = marks.DEFAULT_MARK_STR8;
        decodeAndExpect(str.length + 2, str, 0);
    });
});
