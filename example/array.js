const Serializer = require("./../lib/Serializer.js");

const data = [
    25,
    -255,
    [],
    [{a: 1}],
    [[], 155, [], 255],
    {},
    {a: 101,b: [102, [103, [104, {c: 105, d: 106, e: [], f: {}}]], 107]}, 
    undefined, 
    true
];

module.exprots = data;

if (module.parent === null) {
    const buffer = Serializer.toBuffer(data);
    const decoded = Serializer.fromBuffer(buffer);

    console.log(
        "Original length:", 
        JSON.stringify(data).length
    ); // 119

    console.log(
        "Encoded length:", 
        buffer.byteLength
    ); // 54

    /// expect(data).toEqual(decoded); <--- true
}
