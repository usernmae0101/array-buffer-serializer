const Serializer = require("./../lib/Serializer.js");
const marks = require("./../lib/marks.js");

describe("Serializer", () => {
    const createArrayBuffer = () => {
        const ab = new ArrayBuffer(19);
        const dv = new DataView(ab);

        let offset = 1;
        
        // set an object's mask
        dv.setUint8(0, 1);
        dv.setUint8(offset++, 's'.charCodeAt(0));
        dv.setUint8(offset++, marks.DEFAULT_MARK_STR8);
        dv.setUint8(offset++, 's'.charCodeAt(0));
        dv.setUint8(offset++, 't'.charCodeAt(0));
        dv.setUint8(offset++, 'r'.charCodeAt(0));
        dv.setUint8(offset++, marks.DEFAULT_MARK_STR8);
        dv.setUint8(offset++, 'i'.charCodeAt(0));
        dv.setUint8(offset++, marks.DEFAULT_MARK_UINT8);
        dv.setUint8(offset++, 15);
        dv.setUint8(offset++, 'b'.charCodeAt(0));
        dv.setUint8(offset++,  marks.DEFAULT_MARK_TBOOL);
        dv.setUint8(offset++, 'a'.charCodeAt(0));
        dv.setUint8(offset++, marks.DEFAULT_MARK_OBJ_OPEN + 1);
        dv.setUint8(offset++, 'u'.charCodeAt(0));
        dv.setUint8(offset++, marks.DEFAULT_MARK_UNDEF);
        dv.setUint8(offset++, marks.DEFAULT_MARK_OBJ_CLOSE);
        dv.setUint8(offset++, marks.DEFAULT_MARK_ARR_EMPTY);
        dv.setUint8(offset++, marks.DEFAULT_MARK_ARR_CLOSE);

        return ab;
    };

    const dataObject = { s: "str", i: 15, b: true, a: [{ u: undefined }, []] };

    it("serializes from buffer correctly", () => {
        const ab = createArrayBuffer();
        expect(Serializer.fromBuffer(ab)).toEqual(dataObject);
    });

    it("serializes to buffer correctly", () => {
        const buffer = Serializer.toBuffer(dataObject);
        expect(Serializer.fromBuffer(buffer)).toEqual(dataObject);
    });

    it("serializes array data correctly", () => {
        const data = [{a: 1, b: [2, [3]]}, 4, undefined];
        const buffer = Serializer.toBuffer(data);
        expect(Serializer.fromBuffer(buffer)).toEqual(data);
    });

    [null, "str", 1, false].forEach(data => {
        it("throws an error if data is not object", () => {
            const f = () => {
                Serializer.toBuffer(data);
            };
            expect(f).toThrow(Error);
        });
    });
});
