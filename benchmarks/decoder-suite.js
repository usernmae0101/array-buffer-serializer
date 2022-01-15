const Benchmark = require("benchmark");
const BufferDecoder = require("./../lib/BufferDecoder");
const marks = require("./../lib/marks.js");

module.exports = function() {
    const suite = new Benchmark.Suite;
    
    let decoder, view;
    
    function resetBuffer() {
        view = new Uint8Array(64);
        view[0] = 0;
    }

    const opts = {
        onCycle: resetBuffer,
        onStart: resetBuffer
    };

    suite
        .add(
            "Decoder#Null", 
            function() {
                view[1] = marks.DEFAULT_MARK_NULL;
                decoder = new BufferDecoder(view.buffer);
                decoder.decode();
            },
            opts
        )
        .add(
            "Decoder#Array", 
            function() {
                view[1] = marks.DEFAULT_MARK_INT8 + 1;
                view[2] = 15;
                decoder = new BufferDecoder(view.buffer);
                decoder.decode();
            },
            opts
        )
        .add(
            "Decoder#Dict", 
            function() {
                view[1] = marks.DEFAULT_MARK_OBJ_OPEN;
                view[2] = 1;
                view[3] = marks.DEFAULT_MARK_UINT8;
                view[4] = 25;
                view[5] = marks.DEFAULT_MARK_OBJ_CLOSE;
                decoder = new BufferDecoder(view.buffer);
                for (let i = 0; i < 5; i++) decoder.decode();
            },
            opts
        )
        .add(
            "Decoder#String", 
            function() {
                view[1] =  marks.DEFAULT_MARK_STR8;
                view[2] =  1;
                view[3] =  2;
                view[4] =  3;
                view[5] =  marks.DEFAULT_MARK_STR8;
                decoder = new BufferDecoder(view.buffer);
                decoder.decode();
            },
            opts
        )
        .add(
            "Decoder#Boolean", 
            function() {
                view[1] = marks.DEFAULT_MARK_TBOOL;
                decoder = new BufferDecoder(view.buffer);
                decoder.decode();
            },
            opts
        )
        .add(
            "Decoder#Undefined", 
            function() {
                view[1] = marks.DEFAULT_MARK_UNDEF;
                decoder = new BufferDecoder(view.buffer);
                decoder.decode();
            },
            opts
        )
        .add(
            "Decoder#Bigint", 
            function() {
                view[1] = marks.DEFAULT_MARK_UBIGINT;
                view[2] = 0;
                view[3] = 0;
                view[4] = 0;
                view[5] = 0;
                view[6] = 0;
                view[7] = 0;
                view[8] = 0;
                view[9] = 25;
                decoder = new BufferDecoder(view.buffer);
                decoder.decode();
            },
            opts
        )
        .add(
            "Decoder#Number", 
            function() {
                view[1] = marks.DEFAULT_MARK_UINT16;
                view[2] = 15;
                view[3] = 255;
                decoder = new BufferDecoder(view.buffer);
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
