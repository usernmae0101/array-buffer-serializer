const Benchmark = require("benchmark");
const Serializer = require("../lib/Serializer.js");
const dictionary = require("../example/dictionary.js");
const array = require("../example/array.js");

BigInt.prototype.toJSON = function() { return this.toString(); }

const encoded = {
    dict: {
        JSON: JSON.stringify(dictionary),
        raw: Serializer.toBuffer(dictionary) 
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
            "Decoder.dict#JSON", 
            function() {
                JSON.parse(encoded.dict.JSON);
            }
        )
        .add(
            "Decoder.array#JSON", 
            function() {
                JSON.parse(encoded.array.JSON);
            }
        )
        .add(
            "Decoder.dict#Serializer",
            function() {
                Serializer.fromBuffer(encoded.dict.raw);
            }
        )
        .add(
            "Decoder.array#Serializer",
            function() {
                Serializer.fromBuffer(encoded.array.raw);
            }
        )
        .add(
            "Encoder.dict#JSON",
            function() {
                JSON.stringify(dictionary);
            }
        )
        .add(
            "Encoder.array#JSON",
            function() {
                JSON.stringify(array);
            }
        )
        .add(
            "Encoder.dict#Serializer",
            function() {
                Serializer.toBuffer(dictionary);
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
