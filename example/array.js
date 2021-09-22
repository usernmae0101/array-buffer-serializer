const Serializer = require("./../lib/Serializer.js");

const data = [
    25,
    -255,
    [],
    [{ a: 1 }],
    [[], 155, [], 255],
    {},
    {
        a: 101,
        b: [
            102, 
            [
                103, 
                [
                    104, 
                    { 
                        c: 105,
                        d: 106,
                        e: [],
                        f: {}
                    }
                ]
            ], 
            107
        ]
    },
    undefined,
    true
];

console.log("Original length:", JSON.stringify(data).length); // 119

const buffer = Serializer.toBuffer(data);
console.log("Encoded length:", buffer.byteLength); // 54

const decoded = Serializer.fromBuffer(buffer);
console.log("Original object:", data);
console.log("Decoded object:", decoded);   
