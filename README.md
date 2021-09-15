# array-buffer-serializer

![CI](https://github.com/username0101010/array-buffer-serializer/actions/workflows/test.yml/badge.svg)
[![codecov](https://codecov.io/gh/username0101010/array-buffer-serializer/branch/main/graph/badge.svg?token=IZFQQP34H7)](https://codecov.io/gh/username0101010/array-buffer-serializer)

Allows to encode some data into bytes before transmission via WebRTC or WebSockets and decode it back when received.

## Installation

Using npm:

```bash
npm install array-buffer-serializer
```

Via yarn:

```bash
yarn add array-buffer-serializer
```

## Usage

1. **Import Serializer object**
    
    ```javascript
    // as CommonJS
    const Serializer = require("array-buffer-serializer");
    // or ES6
    import Serializer from "array-buffer-serializer";
    ```
    
2. **Encode some data (object or array) using "toBuffer" method**

    ```javascript
    // as object
    const data = { this: "way" };
    
    // as array
    const data = ["or", "that" "way"];
    
    const buffer = Serializer.toBuffer(data);
    ```

3. **Send the buffer (for example, over WebScoket)**     
    
    ```javascript
    ws.send(buffer);
    ```
    
4. **Receive the buffer and decode it using "fromBuffer" method**

    ```javascript
    ws.addEventListener("message", buffer => {
        const data = Serializer.fromBuffer(buffer);
    });
    ```

## Table

Type | Economy (bytes) 
--- | --- 
*undefined* | 9 
*true* | 4
*false* | 5
*null* | 4
*string* | 0
*int8_t* | up to 3
*int16_t* | up to 4
*int32_t* | up to 7
*int64_t* | up to 14
*float* | up to 4
*double* | up to 9

## Features

* No model is needed to describe the data structure;
* Uses type definition instead of object's key-value separator ":" and array items delimiter ",";
* Uses unsigned data representation by default (uint8_t, uint16_t...);
* Different marks for positive and negative numbers, so negative sign is for free.

## License

[MIT](./LICENSE)
