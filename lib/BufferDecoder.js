"use strict";

var marks = require("./marks.js");
var ieee754 = require("ieee754");

/** @constructor */
var BufferDecoder = function(view) {
    /** @public */
    this.offset = 1;
    /** @public */
    this.data = undefined;
    /** @private */
    this._view = view;
    /** @private */
    this._entries = [];
    /** @private */
    this._key = [];
    /** @private */
    this._mask = this._view[0];
    /** @private */
    this._indices = this._mask === 0 ? [0] : [];
    /** @private */
    this._value = undefined;
    /** @private */
    this._pointer = [];
};

/**
 * Decodes each byte of data from given buffer.
 * @public
 */
BufferDecoder.prototype.decode = function() {
    var code = this._fromInt8();

    // map open
    if (code === marks.DEFAULT_MARK_OBJ_OPEN) { 
        this._value = {};
        this._updatePointer();
        this._updateEntries(this._pointer);
        return;
    }
    
    else if (0x00C0 <= code && code <= 0x00E3) {
        this._parseValue(code - (code % 2 === 1 ? 1 : 0));

        // parse value as 1st array element
        if (code % 2 === 1) {
            this._value = [this._value];
            this._updatePointer();
            this._updateEntries(this._pointer);
            
            if (this._isObject(this._value[0]))
                this._pointer.push(0);
            
            this._indices.push(1);
            return;
        }
    }

    // array open
    else if (code === marks.DEFAULT_MARK_ARR_OPEN) {
        this._value = [];
        this._updatePointer();
        this._updateEntries(this._pointer);
        this._indices.push(0);
        return;
    }
   
    // array close
    else if (code === marks.DEFAULT_MARK_ARR_CLOSE) {
        this._pointer.pop();
        this._indices.pop();
        return;
    }

    // map close
    else if (code === marks.DEFAULT_MARK_OBJ_CLOSE) { 
        this._pointer.pop();
        return;
    }
    
    // empty array
    else if (code === marks.DEFAULT_MARK_ARR_EMPTY)
        this._value = [];

    // parse key
    else {
        this._key.push(
            String.fromCharCode(code)
    	);
    	return;
    }

    var ptr = this._pointer.slice();
    this._updatePointer(ptr);
    this._updateEntries(ptr);
};

/**
 * @private
 * @param {Number} code
 */
BufferDecoder.prototype._parseValue = function(code) {
    // -uint8_t
    if (code === marks.DEFAULT_MARK_INT8) 
        this._value = -this._fromInt8(); 

    // uint8_t
    else if (code === marks.DEFAULT_MARK_UINT8)
        this._value = this._fromInt8(); 

    // -uint16_t
    else if (code === marks.DEFAULT_MARK_INT16)
        this._value = -this._fromInt16(); 

    // uint16_t
    else if (code === marks.DEFAULT_MARK_UINT16)
        this._value = this._fromInt16(); 
        
    // -uint32_t
    else if (code === marks.DEFAULT_MARK_INT32)
        this._value = -this._fromInt32();

    // uint32_t
    else if (code === marks.DEFAULT_MARK_UINT32)
        this._value = this._fromInt32(); 

    // -uint64_t
    else if (code === marks.DEFAULT_MARK_INT53)
        this._value = -this._fromInt53();

    // uint64_t
    else if (code === marks.DEFAULT_MARK_UINT53)
        this._value = this._fromInt53(); 

    // -bigint
    else if (code === marks.DEFAULT_MARK_BIGINT)
        this._value = -this._fromInt64();

    // bigint
    else if (code === marks.DEFAULT_MARK_UBIGINT) 
        this._value = this._fromInt64();

    // float
    else if (code === marks.DEFAULT_MARK_FLOAT)
        this._value = parseFloat(this._fromFloat32().toFixed(6)); 
    
    // double
    else if (code === marks.DEFAULT_MARK_DOUBLE)
        this._value = this._fromFloat64();

    // boolean (false)
    else if (code === marks.DEFAULT_MARK_FBOOL)
        this._value = false; 
    
    // boolean (true)
    else if (code === marks.DEFAULT_MARK_TBOOL)
        this._value = true; 
    
    // undefined 
    else if (code === marks.DEFAULT_MARK_UNDEF)
        this._value = undefined;

    // null
    else if (code === marks.DEFAULT_MARK_NULL)
        this._value = null; 
   
    // object
    else if (code === marks.DEFAULT_MARK_OBJ_OPEN)
        this._value = {};

    // string
    else if (code === marks.DEFAULT_MARK_STR8) {
        this._value = [];

        do {
            this._value.push(
                String.fromCharCode(
                    code = this._fromInt8()
                )
            );
        } while (code !== marks.DEFAULT_MARK_STR8)
        
        this._value.pop();
        this._value = this._value.join(new String);
    }
};

/** 
 * @private 
 * @param {Array} ptr
 */
BufferDecoder.prototype._updateEntries = function(ptr) {    
    this._entries.push({
        path: ptr.slice(),
        value: this._value
    });
};

/**
 * @private
 * @param {Array} ptr
 */
BufferDecoder.prototype._updatePointer = function(ptr) {
    if (this._key.length) 
        this._joinKey(ptr);
    else {
        this._joinIndex(ptr);
        this._increaseArrayIndex();
    }
};

/** @private */
BufferDecoder.prototype._increaseArrayIndex = function() {
    this._indices[this._indices.length - 1]++;
};

/**
 * @private
 * @param {any} val
 * @returns {Boolean}
 */
BufferDecoder.prototype._isObject = function(val) {
    return typeof val === "object" && val !== null;
};

/** 
 * @private 
 * @param {Array} ptr
 */
BufferDecoder.prototype._joinKey = function(ptr) {
    (ptr ? ptr : this._pointer).push(
        this._key.join(new String)
    );

    this._key = [];
};

/** 
 * @private
 * @param {Array} ptr
 */
BufferDecoder.prototype._joinIndex = function(ptr) {
    !this._indices.length && this._indices.push(0);

    (ptr ? ptr : this._pointer).push(
        this._indices[
            this._indices.length - 1
        ] 
    );
};

/** @public */
BufferDecoder.prototype.unpack = function() {
    this.data = this._mask === 0 ? [] : {};

    for (var i = 0; i < this._entries.length; i++) {
        var entry = this._entries[i];
        var target = this.data;    
        
        if (entry.path.length > 1)
            for (var j = 0; j < entry.path.length - 1; j++)
                target = target[entry.path[j]];
        
        target[entry.path[entry.path.length - 1]] = entry.value;
    }
};

/** 
 * @private 
 * @returns {Number} 
 */
BufferDecoder.prototype._fromInt8 = function() {
    return this._view[this.offset++];
};

/** 
 * @private 
 * @returns {Number} 
 */
BufferDecoder.prototype._fromInt16 = function() {
    return (
        (this._view[this.offset++] << 8) |
        this._view[this.offset++]
    ) >>> 0;  
};

/** 
 * @private 
 * @returns {number} 
 */
BufferDecoder.prototype._fromInt32 = function() {
    return (
        (this._view[this.offset++] << 24) |
        (this._view[this.offset++] << 16) |
        (this._view[this.offset++] << 8)  |
        this._view[this.offset++]
    ) >>> 0;  
};

/** 
 * @private 
 * @returns {Number} 
 */
BufferDecoder.prototype._fromInt53 = function() {
    var value = 0;
    for (var i = 6; i >= 0; i--) {
        value = (value * 256) + this._view[this.offset + i];
    }

    this.offset += 7;
    
    return value;
};

/** 
 * @private 
 * @returns {Number} 
 */
BufferDecoder.prototype._fromInt64 = function() {
    var hi = (
        this._view[this.offset]     * 2 ** 24 +
        this._view[this.offset + 1] * 2 ** 16 +
        this._view[this.offset + 2] * 2 ** 8  +
        this._view[this.offset + 3] 
    );

    var lo = (
        this._view[this.offset + 4]  * 2 ** 24 +
        this._view[this.offset + 5]  * 2 ** 16 +
        this._view[this.offset + 6]  * 2 ** 8  +
        this._view[this.offset + 7]
    );
    
    this.offset += 8;

    return (BigInt(hi) << BigInt(32)) + BigInt(lo);
};

/** 
 * @private 
 * @returns {Number} 
 */
BufferDecoder.prototype._fromFloat32 = function() {
    var val = ieee754.read(this._view, this.offset, false, 23, 4);
    this.offset += 4;
    return val;
};

/** 
 * @private 
 * @returns {Number} 
 */
BufferDecoder.prototype._fromFloat64 = function() {
    var val = ieee754.read(this._view, this.offset, false, 52, 8);
    this.offset += 8;
    return val;
};

module.exports = BufferDecoder;
