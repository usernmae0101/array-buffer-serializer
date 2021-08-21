"use strict";

var marks = require("./marks.js");

/** @constructor */
var BufferEncoder = function() {
    /** @public **/
    this.buffer = undefined;
    /** @private */
    this._bytes = 0;
    /** @private */
    this._alloc = [];
};

/**
 * Encodes arbitrary object data to bytes.
 *
 * @public
 * @throws Will throw an error if the value is a NaN.
 * @throws Will throw an error if the value is a function. 
 * @param {String} key - An object's key that should be encoded.
 * @param {any} val - An object's value that should be encoded.
 * @returns {ArrayBuffer}
 */
BufferEncoder.prototype.encode = function(key, val) {
    // Encode key string as the 8-bit chars.
    if (key) {
        for (let l = 0; l < key.length; l++) 
            this._toInt8(key[l].charCodeAt(0));
    }

    switch (typeof val) {
        case "object":
            // Null.
	    if (val === null)
                this._toInt8(marks.DEFAULT_MARK_NULL);	
			
            // Array.
            else if (Array.isArray(val)) {
                // Open array bracket: [.
                this._toInt8(marks.DEFAULT_MARK_ARR_OPEN);

                for (var i = 0; i < val.length; i++) 
                    this.encode(undefined, val[i]);

                // Close array bracket: ].
                this._toInt8(marks.DEFAULT_MARK_ARR_CLOSE);
            }

            // Object.
            else {
                // Open object bracket: {.
                this._toInt8(marks.DEFAULT_MARK_OBJ_OPEN);

                var entries = Object.entries(val);
                for (var i = 0; i < entries.length; i++) {
                    var skey = entries[i][0];
                    var sval = entries[i][1];

                    this.encode(skey, sval);
                }

                // Close object by bracket: }.
                this._toInt8(marks.DEFAULT_MARK_OBJ_CLOSE);
            }
            break;
        case "string":
            // Open string: ".
            this._toInt8(marks.DEFAULT_MARK_STR8);

            for (var l = 0; l < val.length; l++)
                this._toInt8(val[l].charCodeAt(0));

            // Close string: ".
            this._toInt8(marks.DEFAULT_MARK_STR8);
            break;
        case "boolean":
            if (val)
                this._toInt8(marks.DEFAULT_MARK_TBOOL);
            else 
                this._toInt8(marks.DEFAULT_MARK_FBOOL);
            break;
        case "undefined":
            this._toInt8(marks.DEFAULT_MARK_UNDEF); 
            break;
        case "bigint":
            this._toInt8(val < 0 ? marks.DEFAULT_MARK_INT64 : marks.DEFAULT_MARK_UINT64);
            this._toInt64(val < 0 ? -val : val);
            break;
        case "number":
	    // NaN.
	    if (Number.isNaN(val)) 
	        throw new Error("The value can not be a NaN."); 

            // Integer.
            else if (val % 1 === 0) {
                var absVal = Math.abs(val);
                
                // uint8_t
                if (absVal <= 255) {
                    this._toInt8(val < 0 ? marks.DEFAULT_MARK_INT8 : marks.DEFAULT_MARK_UINT8);
                    this._toInt8(absVal);
                }
                
                // uint16_t
                else if (absVal <= 65535) {
                    this._toInt8(val < 0 ? marks.DEFAULT_MARK_INT16 : marks.DEFAULT_MARK_UINT16);
                    this._toInt16(absVal);
                }

                // uint32_t
                else if (absVal <= 4294967295) {
                    this._toInt8(val < 0 ? marks.DEFAULT_MARK_INT32 : marks.DEFAULT_MARK_UINT32);
                    this._toInt32(absVal);
                }
            }
        	
            // Floating-point.
            else {
                var valLen = val.toString().length;

                // Float.
                if (valLen <= 8) {
                    this._toInt8(marks.DEFAULT_MARK_FLOAT);
                    this._toFloat32(val);
                }

                // Double.
                else {
                    this._toInt8(marks.DEFAULT_MARK_DOUBLE);
                    this._toFloat64(val);
                }
            }
            break;    
        case "function":
            throw new Error("The value can not be a function.");
    }    
};

/** @public */
BufferEncoder.prototype.pack = function() {
    this.buffer = new ArrayBuffer(this._bytes);
   
    var dv = new DataView(this.buffer);
    var offset = 0;

    for (var i = 0; i < this._alloc.length; i++) {
        dv[this._alloc[i].method](offset, this._alloc[i].value);
        offset += this._alloc[i].offset;
    }
};

/** 
 * @private
 * @param {Number} value
 */
BufferEncoder.prototype._toInt8 = function(value) {
    this._bytes += 1;
    this._alloc.push({
        method: "setUint8",
        value: value,
        offset: 1
    });
};

/** 
 * @private
 * @param {Number} value
 */
BufferEncoder.prototype._toInt16 = function(value) {
    this._bytes += 2;
    this._alloc.push({
        method: "setUint16",
        value: value,
        offset: 2
    });
};

/** 
 * @private
 * @param {Number} value
 */
BufferEncoder.prototype._toInt32 = function(value) {
    this._bytes += 4;
    this._alloc.push({
        method: "setUint32",
        value: value,
        offset: 4
    });
};

/** 
 * @private
 * @param {Number} value
 */
BufferEncoder.prototype._toInt64 = function(value) {
    this._bytes += 8;
    this._alloc.push({
        method: "setBigUint64",
        value: value,
        offset: 8
    });
};

/** 
 * @private
 * @param {Number} value
 */
BufferEncoder.prototype._toFloat32 = function(value) {
    this._bytes += 4;
    this._alloc.push({
        method: "setFloat32",
        value: value,
        offset: 4
    });
};

/** 
 * @private
 * @param {Number} value
 */
BufferEncoder.prototype._toFloat64 = function(value) {
    this._bytes += 8;
    this._alloc.push({
        method: "setFloat64",
        value: value,
        offset: 8
    });
};

module.exports = BufferEncoder;
