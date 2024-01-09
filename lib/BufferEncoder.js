"use strict";

var marks = require("./marks.js");
var ieee754 = require("ieee754");

/** @constructor */
var BufferEncoder = function() {
    /** @public **/
    this.view = undefined;
    /** @private */
    this._offset = 0;
    /** @private */
    this._alloc = [];
};

/**
 * Encodes arbitrary object data into bytes.
 * @public
 * @throws if the value is a NaN
 * @throws if the value is a function
 * @param {String|undefined} key - Object's key (may be undefined if the value is array)
 * @param {any} val - Object's value
 * @param {Number|undefined} index - Array index (in case that the value is array)
 */
BufferEncoder.prototype.encode = function(key, val, index) {
    key && this._asString8(key);

    switch (typeof val) {
        case "object":
            if (val === null)
                this._setMark(marks.DEFAULT_MARK_NULL, index);
			
            // Array: []
            else if (Array.isArray(val)) {
                index === 0 && this._toInt8(marks.DEFAULT_MARK_ARR_OPEN);
               
                if (val.length === 0) {
                    this._toInt8(marks.DEFAULT_MARK_ARR_EMPTY);
                    return;
                }

                for (var i = 0; i < val.length; i++) 
                    this.encode(undefined, val[i], i);

                this._toInt8(marks.DEFAULT_MARK_ARR_CLOSE);
            }

            // Map: {}
            else {
                this._setMark(marks.DEFAULT_MARK_OBJ_OPEN, index);

                var entries = Object.entries(val);
                for (var i = 0; i < entries.length; i++) {
                    var skey = entries[i][0];
                    var sval = entries[i][1];

                    this.encode(skey, sval);
                }

                this._toInt8(marks.DEFAULT_MARK_OBJ_CLOSE);
            }
            break;
        case "string":
            this._setMark(marks.DEFAULT_MARK_STR8, index);
            this._asString8(val);
            this._toInt8(marks.DEFAULT_MARK_STR8);
            break;
        case "boolean":
            this._setMark(val ? marks.DEFAULT_MARK_TBOOL : marks.DEFAULT_MARK_FBOOL, index);
            break;
        case "undefined":
            this._setMark(marks.DEFAULT_MARK_UNDEF, index); 
            break;
        case "bigint":
            this._setMark(val < 0 ? marks.DEFAULT_MARK_BIGINT : marks.DEFAULT_MARK_UBIGINT, index);
            this._toInt64(val < 0 ? -val : val);
            break;
        case "number":
            if (Number.isNaN(val)) 
                throw new Error("The value can not be a NaN."); 

            (val % 1 === 0) ? this._asInteger(val, index) : this._asFloat(val, index);
            break;    
        case "function":
            throw new Error("The value can not be a function.");
    }    
};

/**
 * @private
 * @param {Number} val
 * @param {Number} index
 */
BufferEncoder.prototype._asFloat = function(val, index) {
    var isFloat32 = (Math.fround(val) === val);

    // Float.
    if (isFloat32) {
        this._setMark(marks.DEFAULT_MARK_FLOAT, index);
        this._toFloat32(val);
    }

    // Double.
    else {
        this._setMark(marks.DEFAULT_MARK_DOUBLE, index);
        this._toFloat64(val);
    }
};

/**
 * @private
 * @param {String} val
 */
BufferEncoder.prototype._asString8 = function(val) {
    for (var l = 0; l < val.length; l++)
        this._toInt8(val[l].charCodeAt(0));
};

/**
 * @private
 * @param {Number} mark
 * @param {Number} index
 */
BufferEncoder.prototype._setMark = function(mark, index) {
    this._toInt8(mark + (index === 0 ? 1 : 0));	
};

/**
 * @private
 * @param {Number} val
 * @param {Number} index
 */
BufferEncoder.prototype._asInteger = function(val, index) {
    var absVal = Math.abs(val);
    
    // uint8_t
    if (absVal <= 255) {
        this._setMark(val < 0 ? marks.DEFAULT_MARK_INT8 : marks.DEFAULT_MARK_UINT8, index);
        this._toInt8(absVal);
    }
    
    // uint16_t
    else if (absVal <= 65535) {
        this._setMark(val < 0 ? marks.DEFAULT_MARK_INT16 : marks.DEFAULT_MARK_UINT16, index);
        this._toInt16(absVal);
    }

    // uint32_t
    else if (absVal <= 4294967295) {
        this._setMark(val < 0 ? marks.DEFAULT_MARK_INT32 : marks.DEFAULT_MARK_UINT32, index);
        this._toInt32(absVal);
    }

    // "uint53_t": Number.MAX_SAFE_INTEGER (2^53 - 1) 
    else if (absVal <= 9007199254740991) {
        this._setMark(val < 0 ? marks.DEFAULT_MARK_INT53 : marks.DEFAULT_MARK_UINT53, index);
        this._toInt53(absVal);
    }
};

/** 
 * @public
 * @param {Number} mask
 */
BufferEncoder.prototype.pack = function(mask) {
    this.view = new Uint8Array(this._alloc.length + 1);

    // Set mask of data: [] - 0, {} - 1.
    this.view[0] = mask;

    for (var i = 1; i <= this._alloc.length; i++) {
        this.view[i] = this._alloc[i - 1] & 0xff;
    }
};

/** 
 * @private
 * @param {Number} value
 */
BufferEncoder.prototype._toInt8 = function(value) {
    this._alloc[this._offset++] = value;
};

/** 
 * @private
 * @param {Number} value
 */
BufferEncoder.prototype._toInt16 = function(value) {
    this._alloc[this._offset++] = value >> 8;
    this._alloc[this._offset++] = value;
};

/** 
 * @private
 * @param {Number} value
 */
BufferEncoder.prototype._toInt32 = function(value) {
    this._alloc[this._offset++] = value >> 24;
    this._alloc[this._offset++] = value >> 16;
    this._alloc[this._offset++] = value >> 8;
    this._alloc[this._offset++] = value;
};

/** 
 * @private
 * @param {Number} value
 */
BufferEncoder.prototype._toInt53 = function(value) {
    for (var i = 0; i < 7; i++) {
        var byte = value & 0xff;
        this._alloc[this._offset++] = byte;
        value = (value - byte) / 256;
    }
};

/** 
 * @private
 * @param {Number} value
 */
BufferEncoder.prototype._toInt64 = function(value) {
    var lo = Number(value & BigInt(0xffffffff));
    this._alloc[this._offset + 7] = lo;
    lo = lo >> 8;
    this._alloc[this._offset + 6] = lo;
    lo = lo >> 8;
    this._alloc[this._offset + 5] = lo;
    lo = lo >> 8;
    this._alloc[this._offset + 4] = lo;

    var hi = Number(value >> BigInt(32) & BigInt(0xffffffff));
    this._alloc[this._offset + 3] = hi;
    hi = hi >> 8;
    this._alloc[this._offset + 2] = hi;
    hi = hi >> 8;
    this._alloc[this._offset + 1] = hi;
    hi = hi >> 8;
    this._alloc[this._offset] = hi;
    
    this._offset += 8;
};

/** 
 * @private
 * @param {Number} value
 */
BufferEncoder.prototype._toFloat32 = function(value) {
    ieee754.write(this._alloc, value, this._offset, false, 23, 4); 
    this._offset += 4;
};

/** 
 * @private
 * @param {Number} value
 */
BufferEncoder.prototype._toFloat64 = function(value) {
    ieee754.write(this._alloc, value, this._offset, false, 52, 8); 
    this._offset += 8;
};

module.exports = BufferEncoder;
