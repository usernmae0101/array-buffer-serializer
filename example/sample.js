const Serializer = require("./../lib/Serializer.js");

const data = {
    int8: 255,
    int16: -65535,
    int32: 4294967295,
    bigint: -18446744073709551615n,
    str8: "some text",
    nested_array: [[1, 2, [3]], 4, 5, { a: true, b: { c: false } }],
    nested_object: {
        a: {
            b: {
                c: -255,
                d: [1, [2]],
                e: null
            }
        }
    },
    undef: undefined,
    null: null,
    float: 1.234567,
    double: 1.23456789012,
    bool_t: true,
    bool_f: false,
    numbers: [
        115, 225, -45, -220, [1.23444, 25, 88, 1.23452],
        [-55555, 230, -145], [2.3456, 123, -1534354]
    ],
    conditions: {
        a: true,
        b: false,
        c: false,
        d: true,
        e: undefined,
        f: null
    }
};

// NOTE: JSON.stringify() can't convert bigint
// just to show length of all data, it was converted to a string
const temp = { ...data };
temp.bigint = data.bigint.toString();
console.log("Original length:", JSON.stringify(temp).length - 1); // 451 

const buffer = Serializer.toBuffer(data);
console.log("Encoded length:", buffer.byteLength); // 256

const decoded = Serializer.fromBuffer(buffer);
console.log("Original object:", data);
console.log("Decoded object:", decoded);
