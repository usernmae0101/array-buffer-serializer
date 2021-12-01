const Benchmark = require("benchmark");
const BufferEncoder = require("./../lib/BufferEncoder");

module.exports = function() {
    const suite = new Benchmark.Suite;
    const u = undefined;
    
    let encoder = new BufferEncoder;
    
    const opts = {
        onCycle: function() {
            encoder = new BufferEncoder;
        }
    };

    suite
        .add(
            "Encoder#Null", 
            function() {
                encoder.encode(u, null);
            }, 
            opts
        )
        .add(
            "Encoder#Array", 
            function() {
                encoder.encode(u, [1, 2, 3]);
            },
            opts
        )
        .add(
            "Encoder#Dict", 
            function() {
                encoder.encode(u, { a: 1 });
            },
            opts
        )
        .add(
            "Encoder#String", 
            function() {
                encoder.encode(u, "string");
            },
            opts
        )
        .add(
            "Encoder#Boolean", 
            function() {
                encoder.encode(u, true);
            },
            opts
        )
        .add(
            "Encoder#Undefined", 
            function() {
                encoder.encode(u, undefined);
            },
            opts
        )
        .add(
            "Encoder#Bigint", 
            function() {
                encoder.encode(u, 100n);
            },
            opts
        )
        .add(
            "Encoder#Number", 
            function() {
                encoder.encode(u, 100);
            },
            opts
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
