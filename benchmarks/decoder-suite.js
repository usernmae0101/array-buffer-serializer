const Benchmark = require("benchmark");
const BufferDecoder = require("./../lib/BufferDecoder");
const marks = require("./../lib/marks.js");

module.exports = function() {
    const suite = new Benchmark.Suite;
    
    let decoder, dv, ab;
    
    function resetBuffer() {
        ab = new ArrayBuffer(64);
        dv = new DataView(ab);
        dv.setUint8(0, 0);
    }

    const opts = {
        onCycle: resetBuffer,
        onStart: resetBuffer
    };

    suite
        .add(
            "Decoder#Null", 
            function() {
                dv.setUint8(1, marks.DEFAULT_MARK_NULL);
                decoder = new BufferDecoder(dv);
                decoder.decode();
            },
            opts
        )
        .add(
            "Decoder#Array", 
            function() {
                dv.setUint8(1, marks.DEFAULT_MARK_INT8 + 1);
                dv.setUint8(2, 15);
                decoder = new BufferDecoder(dv);
                decoder.decode();
            },
            opts
        )
        .add(
            "Decoder#Dict", 
            function() {
                dv.setUint8(1, marks.DEFAULT_MARK_OBJ_OPEN);
                dv.setUint8(2, 1);
                dv.setUint8(3, marks.DEFAULT_MARK_UINT8);
                dv.setUint8(4, 25);
                dv.setUint8(5, marks.DEFAULT_MARK_OBJ_CLOSE)
                decoder = new BufferDecoder(dv);
                for (let i = 0; i < 5; i++) decoder.decode();
            },
            opts
        )
        .add(
            "Decoder#String", 
            function() {
                dv.setUint8(1, marks.DEFAULT_MARK_STR8);
                dv.setUint8(2, 1);
                dv.setUint8(3, 2);
                dv.setUint8(4, 3);
                dv.setUint8(5, marks.DEFAULT_MARK_STR8);
                decoder = new BufferDecoder(dv);
                decoder.decode();
            },
            opts
        )
        .add(
            "Decoder#Boolean", 
            function() {
                dv.setUint8(1, marks.DEFAULT_MARK_TBOOL);
                decoder = new BufferDecoder(dv);
                decoder.decode();
            },
            opts
        )
        .add(
            "Decoder#Undefined", 
            function() {
                dv.setUint8(1, marks.DEFAULT_MARK_UNDEF);
                decoder = new BufferDecoder(dv);
                decoder.decode();
            },
            opts
        )
        .add(
            "Decoder#Bigint", 
            function() {
                dv.setUint8(1, marks.DEFAULT_MARK_UBIGINT);
                dv.setBigUint64(2, 25n);
                decoder = new BufferDecoder(dv);
                decoder.decode();
            },
            opts
        )
        .add(
            "Decoder#Number", 
            function() {
                dv.setUint8(1, marks.DEFAULT_MARK_UINT16);
                dv.setUint16(2, 305);
                decoder = new BufferDecoder(dv);
                decoder.decode();
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
