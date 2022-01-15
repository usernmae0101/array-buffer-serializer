const Serializer = require("./../lib/Serializer.js");

const data = {
    int8: 255,
    int16: -65535,
    int32: 4294967295,
    bigint: -18446744073709551615n,
    str8: "some text",
    nested_array: [[1, 2, [3]], 4, 5, {a: true, b: {c: false}}],
    nested_object: {a: { b: { c: -255, d: [1, [2]], e: null }}},
    undef: undefined,
    null: null,
    float: 1.234567,
    double: 1.23456789012,
    bool_t: true,
    bool_f: false,
    numbers: [115, 225, -45, -220, [1.23444, 25, 88, 1.23452], [-55555, 230, -145], [2.3456, 123, -1534354]],
    conditions: {a: true, b: false, c: false, d: true, e: undefined, f: null}
};

module.exprots = data;

if (module.parent === null) {
    BigInt.prototype.toJSON = function() { return this.toString(); }

    const buffer = Serializer.toBuffer(data);
    const decoded = Serializer.fromBuffer(buffer);

    console.log(
        "Original length:", 
        JSON.stringify(data).length - 1
    ); // 451 

    console.log(
        "Encoded length:", 
        buffer.byteLength
    ); // 249

    /// expect(data).toEqual(decoded); <--- true
}
