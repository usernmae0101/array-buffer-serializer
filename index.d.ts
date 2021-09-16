export interface ISerializer {
	/**
	 * Decodes data from a buffer into an object.
	 *
	 * @static
	 * @param buffer
	 * @returns Structed object.
	 */
	fromBuffer<T>(buffer: ArrayBuffer): T;
	/**
	 * Encodes data from an object into a buffer.
	 *
	 * @static
	 * @param data - [] or {}.
	 * @returns Array buffer.
	 */
	toBuffer<T>(data: T): ArrayBuffer;
}

declare const Serializer: ISerializer;

export default Serializer;
