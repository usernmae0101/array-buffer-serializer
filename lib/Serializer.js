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
 * @returns {Object}
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
 * @param {Object} data
 * @returns {ArrayBuffer}
 */
Serializer.toBuffer = function(data) {
    if (typeof data !== "object" || data === null || Array.isArray(data))
        throw new Error("Data should be an object.");

    var encoder = new BufferEncoder;

    var entries = Object.entries(data);
    for (var i = 0; i < entries.length; i++) {
        var key = entries[i][0];
        var val = entries[i][1];

        encoder.encode(key, val);
    }

    encoder.pack();

    return encoder.buffer;
};

module.exports = Serializer;
