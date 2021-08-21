module.exports = {
    /**
     * Mark for unsigned 8 bits integer: 0 to 255.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_UINT8: 200,
    /**
     * Mark for signed 8 bits integer: -255 to 0.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_INT8: 201,
    /**
     * Mark for unsigned 16 bits integer: 0 to 65535.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_UINT16: 202,
    /**
     * Mark for signed 16 bits integer: -65535 to 0.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_INT16: 203,
    /**
     * Mark for unsigned 32 bits integer: 0 to 4294967295.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_UINT32: 204,
    /**
     * Mark for signed 32 bits integer: -4294967295 to 0.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_INT32: 205,
    /**
     * Mark for unsigned 64 bits integer: 0 to 2^64 - 1.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_UINT64: 206,
    /**
     * Mark for signed 64 bits integer: -2^64 + 1 to 0.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_INT64: 207,
    /**
     * Mark for boolean value: false.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_FBOOL: 208,
    /**
     * Mark for boolean value: true.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_TBOOL: 209,
    /**
     * Mark for undefined value.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_UNDEF: 210,
    /**
     * Mark for null value.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_NULL: 211,
    /**
     * Mark for float: -3.4e38 to 3.4e38.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_FLOAT: 212,
    /**
     * Mark for double: -1.8e308 to 1.8e308.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_DOUBLE: 213,
    /**
     * Mark (pair) for string value: each symbol as 8 bits char.
     *
     * @example "
     * @constant
     * @default
     */
    DEFAULT_MARK_STR8: 34,
    /**
     * Mark (pair) for open object value.
     *
     * @example {
     * @constant
     * @default
     */
    DEFAULT_MARK_OBJ_OPEN: 123,
    /**
     * Mark (pair) for close object value.
     *
     * @example }
     * @constant
     * @default
     */
    DEFAULT_MARK_OBJ_CLOSE: 125,
    /**
     * Mark (pair) for close array value.
     *
     * @example ]
     * @constant
     * @default
     */
    DEFAULT_MARK_ARR_CLOSE: 93,
    /** Mark (pair) for open array value.
     *
     * @example [
     * @constant
     * @default
     */
    DEFAULT_MARK_ARR_OPEN: 91
};
