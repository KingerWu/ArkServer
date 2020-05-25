/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
"use strict";

var $protobuf = require("protobufjs/minimal");

// Common aliases
var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;

// Exported root namespace
var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});

$root.protobuf = (function() {

    /**
     * Namespace protobuf.
     * @exports protobuf
     * @namespace
     */
    var protobuf = {};

    protobuf.Info = (function() {

        /**
         * Properties of an Info.
         * @memberof protobuf
         * @interface IInfo
         * @property {string|null} [a] Info a
         * @property {number|null} [b] Info b
         */

        /**
         * Constructs a new Info.
         * @memberof protobuf
         * @classdesc Represents an Info.
         * @implements IInfo
         * @constructor
         * @param {protobuf.IInfo=} [properties] Properties to set
         */
        function Info(properties) {
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Info a.
         * @member {string} a
         * @memberof protobuf.Info
         * @instance
         */
        Info.prototype.a = "";

        /**
         * Info b.
         * @member {number} b
         * @memberof protobuf.Info
         * @instance
         */
        Info.prototype.b = 0;

        /**
         * Creates a new Info instance using the specified properties.
         * @function create
         * @memberof protobuf.Info
         * @static
         * @param {protobuf.IInfo=} [properties] Properties to set
         * @returns {protobuf.Info} Info instance
         */
        Info.create = function create(properties) {
            return new Info(properties);
        };

        /**
         * Encodes the specified Info message. Does not implicitly {@link protobuf.Info.verify|verify} messages.
         * @function encode
         * @memberof protobuf.Info
         * @static
         * @param {protobuf.IInfo} message Info message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Info.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.a != null && Object.hasOwnProperty.call(message, "a"))
                writer.uint32(/* id 1, wireType 2 =*/10).string(message.a);
            if (message.b != null && Object.hasOwnProperty.call(message, "b"))
                writer.uint32(/* id 2, wireType 5 =*/21).float(message.b);
            return writer;
        };

        /**
         * Encodes the specified Info message, length delimited. Does not implicitly {@link protobuf.Info.verify|verify} messages.
         * @function encodeDelimited
         * @memberof protobuf.Info
         * @static
         * @param {protobuf.IInfo} message Info message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Info.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Info message from the specified reader or buffer.
         * @function decode
         * @memberof protobuf.Info
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protobuf.Info} Info
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Info.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protobuf.Info();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    message.a = reader.string();
                    break;
                case 2:
                    message.b = reader.float();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Info message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof protobuf.Info
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {protobuf.Info} Info
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Info.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Info message.
         * @function verify
         * @memberof protobuf.Info
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Info.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.a != null && message.hasOwnProperty("a"))
                if (!$util.isString(message.a))
                    return "a: string expected";
            if (message.b != null && message.hasOwnProperty("b"))
                if (typeof message.b !== "number")
                    return "b: number expected";
            return null;
        };

        /**
         * Creates an Info message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof protobuf.Info
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {protobuf.Info} Info
         */
        Info.fromObject = function fromObject(object) {
            if (object instanceof $root.protobuf.Info)
                return object;
            var message = new $root.protobuf.Info();
            if (object.a != null)
                message.a = String(object.a);
            if (object.b != null)
                message.b = Number(object.b);
            return message;
        };

        /**
         * Creates a plain object from an Info message. Also converts values to other types if specified.
         * @function toObject
         * @memberof protobuf.Info
         * @static
         * @param {protobuf.Info} message Info
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Info.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.defaults) {
                object.a = "";
                object.b = 0;
            }
            if (message.a != null && message.hasOwnProperty("a"))
                object.a = message.a;
            if (message.b != null && message.hasOwnProperty("b"))
                object.b = options.json && !isFinite(message.b) ? String(message.b) : message.b;
            return object;
        };

        /**
         * Converts this Info to JSON.
         * @function toJSON
         * @memberof protobuf.Info
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Info.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Info;
    })();

    protobuf.Item = (function() {

        /**
         * Properties of an Item.
         * @memberof protobuf
         * @interface IItem
         * @property {Array.<number>|null} [position] Item position
         * @property {number|null} [index] Item index
         * @property {protobuf.IInfo|null} [info] Item info
         */

        /**
         * Constructs a new Item.
         * @memberof protobuf
         * @classdesc Represents an Item.
         * @implements IItem
         * @constructor
         * @param {protobuf.IItem=} [properties] Properties to set
         */
        function Item(properties) {
            this.position = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Item position.
         * @member {Array.<number>} position
         * @memberof protobuf.Item
         * @instance
         */
        Item.prototype.position = $util.emptyArray;

        /**
         * Item index.
         * @member {number} index
         * @memberof protobuf.Item
         * @instance
         */
        Item.prototype.index = 0;

        /**
         * Item info.
         * @member {protobuf.IInfo|null|undefined} info
         * @memberof protobuf.Item
         * @instance
         */
        Item.prototype.info = null;

        /**
         * Creates a new Item instance using the specified properties.
         * @function create
         * @memberof protobuf.Item
         * @static
         * @param {protobuf.IItem=} [properties] Properties to set
         * @returns {protobuf.Item} Item instance
         */
        Item.create = function create(properties) {
            return new Item(properties);
        };

        /**
         * Encodes the specified Item message. Does not implicitly {@link protobuf.Item.verify|verify} messages.
         * @function encode
         * @memberof protobuf.Item
         * @static
         * @param {protobuf.IItem} message Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Item.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.position != null && message.position.length) {
                writer.uint32(/* id 1, wireType 2 =*/10).fork();
                for (var i = 0; i < message.position.length; ++i)
                    writer.float(message.position[i]);
                writer.ldelim();
            }
            if (message.index != null && Object.hasOwnProperty.call(message, "index"))
                writer.uint32(/* id 2, wireType 0 =*/16).int32(message.index);
            if (message.info != null && Object.hasOwnProperty.call(message, "info"))
                $root.protobuf.Info.encode(message.info, writer.uint32(/* id 3, wireType 2 =*/26).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Item message, length delimited. Does not implicitly {@link protobuf.Item.verify|verify} messages.
         * @function encodeDelimited
         * @memberof protobuf.Item
         * @static
         * @param {protobuf.IItem} message Item message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Item.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes an Item message from the specified reader or buffer.
         * @function decode
         * @memberof protobuf.Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protobuf.Item} Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Item.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protobuf.Item();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.position && message.position.length))
                        message.position = [];
                    if ((tag & 7) === 2) {
                        var end2 = reader.uint32() + reader.pos;
                        while (reader.pos < end2)
                            message.position.push(reader.float());
                    } else
                        message.position.push(reader.float());
                    break;
                case 2:
                    message.index = reader.int32();
                    break;
                case 3:
                    message.info = $root.protobuf.Info.decode(reader, reader.uint32());
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes an Item message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof protobuf.Item
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {protobuf.Item} Item
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Item.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies an Item message.
         * @function verify
         * @memberof protobuf.Item
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Item.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.position != null && message.hasOwnProperty("position")) {
                if (!Array.isArray(message.position))
                    return "position: array expected";
                for (var i = 0; i < message.position.length; ++i)
                    if (typeof message.position[i] !== "number")
                        return "position: number[] expected";
            }
            if (message.index != null && message.hasOwnProperty("index"))
                if (!$util.isInteger(message.index))
                    return "index: integer expected";
            if (message.info != null && message.hasOwnProperty("info")) {
                var error = $root.protobuf.Info.verify(message.info);
                if (error)
                    return "info." + error;
            }
            return null;
        };

        /**
         * Creates an Item message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof protobuf.Item
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {protobuf.Item} Item
         */
        Item.fromObject = function fromObject(object) {
            if (object instanceof $root.protobuf.Item)
                return object;
            var message = new $root.protobuf.Item();
            if (object.position) {
                if (!Array.isArray(object.position))
                    throw TypeError(".protobuf.Item.position: array expected");
                message.position = [];
                for (var i = 0; i < object.position.length; ++i)
                    message.position[i] = Number(object.position[i]);
            }
            if (object.index != null)
                message.index = object.index | 0;
            if (object.info != null) {
                if (typeof object.info !== "object")
                    throw TypeError(".protobuf.Item.info: object expected");
                message.info = $root.protobuf.Info.fromObject(object.info);
            }
            return message;
        };

        /**
         * Creates a plain object from an Item message. Also converts values to other types if specified.
         * @function toObject
         * @memberof protobuf.Item
         * @static
         * @param {protobuf.Item} message Item
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Item.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.position = [];
            if (options.defaults) {
                object.index = 0;
                object.info = null;
            }
            if (message.position && message.position.length) {
                object.position = [];
                for (var j = 0; j < message.position.length; ++j)
                    object.position[j] = options.json && !isFinite(message.position[j]) ? String(message.position[j]) : message.position[j];
            }
            if (message.index != null && message.hasOwnProperty("index"))
                object.index = message.index;
            if (message.info != null && message.hasOwnProperty("info"))
                object.info = $root.protobuf.Info.toObject(message.info, options);
            return object;
        };

        /**
         * Converts this Item to JSON.
         * @function toJSON
         * @memberof protobuf.Item
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Item.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Item;
    })();

    protobuf.Data = (function() {

        /**
         * Properties of a Data.
         * @memberof protobuf
         * @interface IData
         * @property {Array.<protobuf.IItem>|null} [items] Data items
         */

        /**
         * Constructs a new Data.
         * @memberof protobuf
         * @classdesc Represents a Data.
         * @implements IData
         * @constructor
         * @param {protobuf.IData=} [properties] Properties to set
         */
        function Data(properties) {
            this.items = [];
            if (properties)
                for (var keys = Object.keys(properties), i = 0; i < keys.length; ++i)
                    if (properties[keys[i]] != null)
                        this[keys[i]] = properties[keys[i]];
        }

        /**
         * Data items.
         * @member {Array.<protobuf.IItem>} items
         * @memberof protobuf.Data
         * @instance
         */
        Data.prototype.items = $util.emptyArray;

        /**
         * Creates a new Data instance using the specified properties.
         * @function create
         * @memberof protobuf.Data
         * @static
         * @param {protobuf.IData=} [properties] Properties to set
         * @returns {protobuf.Data} Data instance
         */
        Data.create = function create(properties) {
            return new Data(properties);
        };

        /**
         * Encodes the specified Data message. Does not implicitly {@link protobuf.Data.verify|verify} messages.
         * @function encode
         * @memberof protobuf.Data
         * @static
         * @param {protobuf.IData} message Data message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Data.encode = function encode(message, writer) {
            if (!writer)
                writer = $Writer.create();
            if (message.items != null && message.items.length)
                for (var i = 0; i < message.items.length; ++i)
                    $root.protobuf.Item.encode(message.items[i], writer.uint32(/* id 1, wireType 2 =*/10).fork()).ldelim();
            return writer;
        };

        /**
         * Encodes the specified Data message, length delimited. Does not implicitly {@link protobuf.Data.verify|verify} messages.
         * @function encodeDelimited
         * @memberof protobuf.Data
         * @static
         * @param {protobuf.IData} message Data message or plain object to encode
         * @param {$protobuf.Writer} [writer] Writer to encode to
         * @returns {$protobuf.Writer} Writer
         */
        Data.encodeDelimited = function encodeDelimited(message, writer) {
            return this.encode(message, writer).ldelim();
        };

        /**
         * Decodes a Data message from the specified reader or buffer.
         * @function decode
         * @memberof protobuf.Data
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @param {number} [length] Message length if known beforehand
         * @returns {protobuf.Data} Data
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Data.decode = function decode(reader, length) {
            if (!(reader instanceof $Reader))
                reader = $Reader.create(reader);
            var end = length === undefined ? reader.len : reader.pos + length, message = new $root.protobuf.Data();
            while (reader.pos < end) {
                var tag = reader.uint32();
                switch (tag >>> 3) {
                case 1:
                    if (!(message.items && message.items.length))
                        message.items = [];
                    message.items.push($root.protobuf.Item.decode(reader, reader.uint32()));
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
                }
            }
            return message;
        };

        /**
         * Decodes a Data message from the specified reader or buffer, length delimited.
         * @function decodeDelimited
         * @memberof protobuf.Data
         * @static
         * @param {$protobuf.Reader|Uint8Array} reader Reader or buffer to decode from
         * @returns {protobuf.Data} Data
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        Data.decodeDelimited = function decodeDelimited(reader) {
            if (!(reader instanceof $Reader))
                reader = new $Reader(reader);
            return this.decode(reader, reader.uint32());
        };

        /**
         * Verifies a Data message.
         * @function verify
         * @memberof protobuf.Data
         * @static
         * @param {Object.<string,*>} message Plain object to verify
         * @returns {string|null} `null` if valid, otherwise the reason why it is not
         */
        Data.verify = function verify(message) {
            if (typeof message !== "object" || message === null)
                return "object expected";
            if (message.items != null && message.hasOwnProperty("items")) {
                if (!Array.isArray(message.items))
                    return "items: array expected";
                for (var i = 0; i < message.items.length; ++i) {
                    var error = $root.protobuf.Item.verify(message.items[i]);
                    if (error)
                        return "items." + error;
                }
            }
            return null;
        };

        /**
         * Creates a Data message from a plain object. Also converts values to their respective internal types.
         * @function fromObject
         * @memberof protobuf.Data
         * @static
         * @param {Object.<string,*>} object Plain object
         * @returns {protobuf.Data} Data
         */
        Data.fromObject = function fromObject(object) {
            if (object instanceof $root.protobuf.Data)
                return object;
            var message = new $root.protobuf.Data();
            if (object.items) {
                if (!Array.isArray(object.items))
                    throw TypeError(".protobuf.Data.items: array expected");
                message.items = [];
                for (var i = 0; i < object.items.length; ++i) {
                    if (typeof object.items[i] !== "object")
                        throw TypeError(".protobuf.Data.items: object expected");
                    message.items[i] = $root.protobuf.Item.fromObject(object.items[i]);
                }
            }
            return message;
        };

        /**
         * Creates a plain object from a Data message. Also converts values to other types if specified.
         * @function toObject
         * @memberof protobuf.Data
         * @static
         * @param {protobuf.Data} message Data
         * @param {$protobuf.IConversionOptions} [options] Conversion options
         * @returns {Object.<string,*>} Plain object
         */
        Data.toObject = function toObject(message, options) {
            if (!options)
                options = {};
            var object = {};
            if (options.arrays || options.defaults)
                object.items = [];
            if (message.items && message.items.length) {
                object.items = [];
                for (var j = 0; j < message.items.length; ++j)
                    object.items[j] = $root.protobuf.Item.toObject(message.items[j], options);
            }
            return object;
        };

        /**
         * Converts this Data to JSON.
         * @function toJSON
         * @memberof protobuf.Data
         * @instance
         * @returns {Object.<string,*>} JSON object
         */
        Data.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };

        return Data;
    })();

    return protobuf;
})();

module.exports = $root;
