export interface ISerializer {
	/**
	 * Decodes data from a buffer into an object.
	 *
	 * @static
	 * @param {ArrayBuffer} - buffer
	 * @returns {object}
	 */
	fromBuffer<T>(buffer: ArrayBuffer): T;
	/**
	 * Encodes data from an object into a buffer.
	 *
	 * @static
	 * @param {object} - data
	 * @returns {ArrayBuffer}
	 */
	toBuffer<T>(data: T): ArrayBuffer;
}

declare const Serializer: ISerializer;

export default Serializer;
