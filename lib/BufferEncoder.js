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

            // Dict: {}
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
    var valLen = val.toString().length;

    // Float.
    if (valLen <= 8) {
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

    // "uint64_t": Number.MAX_SAFE_INTEGER (2^53 - 1) 
    else if (absVal <= 9007199254740991) {
        this._setMark(val < 0 ? marks.DEFAULT_MARK_INT64 : marks.DEFAULT_MARK_UINT64, index);
        this._toInt64(val < 0 ? BigInt(-val) : BigInt(val));
    }
};

/** 
 * @public
 * @param {Number} mask
 */
BufferEncoder.prototype.pack = function(mask) {
    this.buffer = new ArrayBuffer(this._bytes + 1);
   
    var dv = new DataView(this.buffer);
    var offset = 1;
    
    // Set mask of data: [] - 0, {} - 1.
    dv.setUint8(0, mask);

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
