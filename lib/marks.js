module.exports = {
    /**
     * Mark for unsigned 8 bits integer: 0 to 255.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_UINT8: 0x00C0,
    /**
     * Mark for signed 8 bits integer: -255 to 0.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_INT8: 0x00C2,
    /**
     * Mark for unsigned 16 bits integer: 0 to 65535.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_UINT16: 0x00C4,
    /**
     * Mark for signed 16 bits integer: -65535 to 0.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_INT16: 0x00C6,
    /**
     * Mark for unsigned 32 bits integer: 0 to 4294967295.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_UINT32: 0x00C8,
    /**
     * Mark for signed 32 bits integer: -4294967295 to 0.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_INT32: 0x00CA,
    /**
     * Mark for unsigned 64 bits integer: 0 to 2^53 - 1.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_UINT64: 0x00CC,
    /**
     * Mark for signed 64 bits integer: -(2^53 - 1) to 0.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_INT64: 0x00CE,
    /**
     * Mark for boolean value: false.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_FBOOL: 0x00D0,
    /**
     * Mark for boolean value: true.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_TBOOL: 0x00D2,
    /**
     * Mark for undefined value.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_UNDEF: 0x00D4,
    /**
     * Mark for null value.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_NULL: 0x00D6,
    /**
     * Mark for float: -3.4e38 to 3.4e38.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_FLOAT: 0x00D8,
    /**
     * Mark for double: -1.8e308 to 1.8e308.
     *
     * @constant
     * @default
     */
    DEFAULT_MARK_DOUBLE: 0x00DA,
    /**
     * Mark (pair) for string value: each symbol as 8 bits char.
     *
     * @example "
     * @constant
     * @default
     */
    DEFAULT_MARK_STR8: 0x00DC,
    /**
     * Mark for open object value.
     *
     * @example {
     * @constant
     * @default
     */
    DEFAULT_MARK_OBJ_OPEN: 0x00DE,
    /**
     * Mark for unsigned bigint.
     *
     * @example 25n
     * @constant
     * @default
     */
    DEFAULT_MARK_UBIGINT: 0x00E0,
    /**
     * Mark for signed bigint.
     *
     * @example -25n
     * @constant
     * @default
     */
    DEFAULT_MARK_BIGINT: 0x00E2,
    /**
     * Mark for close object value.
     *
     * @example }
     * @constant
     * @default
     */
    DEFAULT_MARK_OBJ_CLOSE: 0x00E4,
    /**
     * Mark for close array value.
     *
     * @example ]
     * @constant
     * @default
     */
    DEFAULT_MARK_ARR_CLOSE: 0x00E5,
    /** Mark for open array value.
     *
     * @example [
     * @constant
     * @default
     */
    DEFAULT_MARK_ARR_OPEN: 0x00E6,
    /** Mark for empty array value.
     *
     * @example []
     * @constant
     * @default
     */
    DEFAULT_MARK_ARR_EMPTY: 0x00E7
};
