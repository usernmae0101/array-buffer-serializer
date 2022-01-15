const Benchmark = require("benchmark");
const Serializer = require("../lib/Serializer.js");
const map = require("../example/map.js");
const array = require("../example/array.js");

BigInt.prototype.toJSON = function() { return this.toString(); }

const encoded = {
    map: {
        JSON: JSON.stringify(map),
        raw: Serializer.toBuffer(map) 
    },
    array: {
        JSON: JSON.stringify(array),
        raw: Serializer.toBuffer(array)
    }
};

module.exports = function() {
    const suite = new Benchmark.Suite;    
    
    suite
        .add(
            "Decoder.map#JSON", 
            function() {
                JSON.parse(encoded.map.JSON);
            }
        )
        .add(
            "Decoder.array#JSON", 
            function() {
                JSON.parse(encoded.array.JSON);
            }
        )
        .add(
            "Decoder.map#Serializer",
            function() {
                Serializer.fromBuffer(encoded.map.raw);
            }
        )
        .add(
            "Decoder.array#Serializer",
            function() {
                Serializer.fromBuffer(encoded.array.raw);
            }
        )
        .add(
            "Encoder.map#JSON",
            function() {
                JSON.stringify(map);
            }
        )
        .add(
            "Encoder.array#JSON",
            function() {
                JSON.stringify(array);
            }
        )
        .add(
            "Encoder.map#Serializer",
            function() {
                Serializer.toBuffer(map);
            }
        )
        .add(
            "Encoder.array#Serializer",
            function() {
                Serializer.toBuffer(array);
            }
        )
        .on(
            "cycle", 
            function(event) {
                console.log(
                    String(event.target)
                );
            }
        );

    return suite;
};
