const Serializer = require("./../lib/Serializer.js");
const marks = require("./../lib/marks.js");

describe("Serializer", () => {
    const createArrayBuffer = () => {
        const ab = new ArrayBuffer(18);
        const dv = new DataView(ab);

        let offset = 0;

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
        dv.setUint8(offset++, marks.DEFAULT_MARK_ARR_OPEN);
        dv.setUint8(offset++, marks.DEFAULT_MARK_OBJ_OPEN);
        dv.setUint8(offset++, 'u'.charCodeAt(0));
        dv.setUint8(offset++, marks.DEFAULT_MARK_UNDEF);
        dv.setUint8(offset++, marks.DEFAULT_MARK_OBJ_CLOSE);
        dv.setUint8(offset++, marks.DEFAULT_MARK_ARR_CLOSE);

        return ab;
    };

    const data = { s: "str", i: 15, b: true, a: [{ u: undefined }] };

    it("serializes from buffer correctly", () => {
        const ab = createArrayBuffer();
        expect(Serializer.fromBuffer(ab)).toEqual(data);
    });

    it("serializes to buffer correctly", () => {
        const buffer = Serializer.toBuffer(data);
        expect(Serializer.fromBuffer(buffer)).toEqual(data);
    });

    [null, [], "str", 1, false].forEach(data => {
        it("throws an error if data is not object", () => {
            const f = () => {
                Serializer.toBuffer(data);
            };
            expect(f).toThrow(Error);
        });
    });
});
