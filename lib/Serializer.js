"use strict";

var BufferEncoder = require("./BufferEncoder.js");
var BufferDecoder = require("./BufferDecoder.js");

/** @constructor */
var Serializer = function() {};

/**
 * Decodes data from a buffer into an object.
 *
 * @static
 * @param {ArrayBuffer} buffer
 * @returns {Object|Array<any>}
 */
Serializer.fromBuffer = function(buffer) {
    var dv = new DataView(buffer);
    var decoder = new BufferDecoder(dv);
    
    while (decoder.offset < dv.byteLength) 
        decoder.decode();
    
    decoder.unpack();

    return decoder.data;
};

/**
 * Encodes data from an object into a buffer.
 *
 * @static
 * @throws Will throw an error if data is not an object.
 * @param {Object|Array<any>} data
 * @returns {ArrayBuffer}
 */
Serializer.toBuffer = function(data) {
    if (typeof data !== "object" || data === null)
        throw new Error("Data should be an object and can not be a null.");

    var encoder = new BufferEncoder;

    // The data is an array: [].
    if (Array.isArray(data)) 
        for (var val of data) 
            encoder.encode(undefined, val);

    // The data is an object: {}.
    else {
        var entries = Object.entries(data);
        for (var i = 0; i < entries.length; i++) {
            var key = entries[i][0];
            var val = entries[i][1];

            encoder.encode(key, val);
        }
    }

    encoder.pack(
        Array.isArray(data) ? 0 : 1
    );

    return encoder.buffer;
};

module.exports = Serializer;
