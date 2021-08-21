"use strict";

var marks = require("./marks.js");

/** @constructor */
var BufferDecoder = function(view) {
    /** @public */
    this.offset = 0;
    /** @public */
    this.data = {};
    /** @private */
    this._view = view;
    /** @private */
    this._entries = [];
    /** @private */
    this._key = [];
    /** @private */
    this._value = undefined;
    /** @private */
    this._pointer = [];
};

/**
 * Decodes each byte of data from given buffer.
 * 
 * @public
 */
BufferDecoder.prototype.decode = function() {
    var code = this._fromInt8();

    // -uint8_t
    if (code === marks.DEFAULT_MARK_INT8) 
        this._value = -(this._fromInt8()); 

    // uint8_t
    else if (code === marks.DEFAULT_MARK_UINT8)
        this._value = this._fromInt8(); 

    // -uint16_t
    else if (code === marks.DEFAULT_MARK_INT16)
        this._value = -(this._fromInt16()); 

    // uint16_t
    else if (code === marks.DEFAULT_MARK_UINT16)
        this._value = this._fromInt16(); 
        
    // -uint32_t
    else if (code === marks.DEFAULT_MARK_INT32)
        this._value = -(this._fromInt32());

    // uint32_t
    else if (code === marks.DEFAULT_MARK_UINT32)
        this._value = this._fromInt32(); 

    // -uint64_t
    else if (code === marks.DEFAULT_MARK_INT64)
        this._value = -(this._fromInt64());

    // uint64_t
    else if (code === marks.DEFAULT_MARK_UINT64)
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

    // array open
    else if (code === marks.DEFAULT_MARK_ARR_OPEN) {
        this._value = [];
        this._joinKey(this._pointer);
        this._updateEntries();
        this._pointer.push(0);
        return;
    }

    // object open
    else if (code === marks.DEFAULT_MARK_OBJ_OPEN) { 
        this._value = {}; 
        this._joinKey(this._pointer);
        this._updateEntries();
        return;
    }
   
    // array close
    else if (code === marks.DEFAULT_MARK_ARR_CLOSE) {
        this._pointer.pop();
        
        // to remove key as well when array is property
        if (Number.isInteger(this._pointer[this._pointer.length - 1]))
            this._increaseIndex();
        else
            this._pointer.pop();

        return;
    }

    // object close
    else if (code === marks.DEFAULT_MARK_OBJ_CLOSE) { 
        this._pointer.pop();
        return;
    }

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

    // parse key
    else {
        this._key.push(
            String.fromCharCode(code)
    	);
    	return;
    }
   
    this._updateEntries();
};

BufferDecoder.prototype._increaseIndex = function() {
    if (Number.isInteger(this._pointer[this._pointer.length - 1]))
        ++this._pointer[this._pointer.length - 1];
};
        
/** @private */
BufferDecoder.prototype._updateEntries = function() {
    var path = this._pointer.slice();
   
    this._joinKey(path);
   
    this._entries.push({
        path: path,
        value: this._value
    });
};

/** 
  * @private 
  * @param {Array} target
  */
BufferDecoder.prototype._joinKey = function(target) {
    if (this._key.length) {
        target.push(
            this._key.join(new String)
        );
        this._key = [];
    }

    else if (!(typeof this._value === "object" && this._value !== null)) 
        this._increaseIndex();
};

/** @public */
BufferDecoder.prototype.unpack = function() {
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
    var val = this._view.getUint8(this.offset);
    this.offset += 1;
    return val;
};

/** 
 * @private 
 * @returns {Number} 
 */
BufferDecoder.prototype._fromInt16 = function() {
    var val = this._view.getUint16(this.offset);
    this.offset += 2;
    return val;
};

/** 
 * @private 
 * @returns {number} 
 */
BufferDecoder.prototype._fromInt32 = function() {
    var val = this._view.getUint32(this.offset);
    this.offset += 4;
    return val;
};

/** 
 * @private 
 * @returns {Number} 
 */
BufferDecoder.prototype._fromInt64 = function() {
    var val = this._view.getBigUint64(this.offset);
    this.offset += 8;
    return val;
};

/** 
 * @private 
 * @returns {Number} 
 */
BufferDecoder.prototype._fromFloat32 = function() {
    var val = this._view.getFloat32(this.offset);
    this.offset += 4;
    return val;
};

/** 
 * @private 
 * @returns {Number} 
 */
BufferDecoder.prototype._fromFloat64 = function() {
    var val = this._view.getFloat64(this.offset);
    this.offset += 8;
    return val;
};

module.exports = BufferDecoder;
