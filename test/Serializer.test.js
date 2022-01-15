const Serializer = require("./../lib/Serializer.js");
const marks = require("./../lib/marks.js");

describe("Serializer", () => {
    const createArrayBuffer = () => {
        const view = new Uint8Array(19);

        let offset = 1;
        
        // set an object's mask
        view[0] = 1;
        view[offset++] = 's'.charCodeAt(0);
        view[offset++] = marks.DEFAULT_MARK_STR8;
        view[offset++] = 's'.charCodeAt(0);
        view[offset++] = 't'.charCodeAt(0);
        view[offset++] = 'r'.charCodeAt(0);
        view[offset++] = marks.DEFAULT_MARK_STR8;
        view[offset++] = 'i'.charCodeAt(0);
        view[offset++] = marks.DEFAULT_MARK_UINT8;
        view[offset++] = 15;
        view[offset++] = 'b'.charCodeAt(0);
        view[offset++] =  marks.DEFAULT_MARK_TBOOL;
        view[offset++] = 'a'.charCodeAt(0);
        view[offset++] = marks.DEFAULT_MARK_OBJ_OPEN + 1;
        view[offset++] = 'u'.charCodeAt(0);
        view[offset++] = marks.DEFAULT_MARK_UNDEF;
        view[offset++] = marks.DEFAULT_MARK_OBJ_CLOSE;
        view[offset++] = marks.DEFAULT_MARK_ARR_EMPTY;
        view[offset++] = marks.DEFAULT_MARK_ARR_CLOSE;

        return view.buffer;
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
