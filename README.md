# array-buffer-serializer

![CI](https://github.com/username0101010/array-buffer-serializer/actions/workflows/test.yml/badge.svg)
[![codecov](https://codecov.io/gh/username0101010/array-buffer-serializer/branch/main/graph/badge.svg?token=IZFQQP34H7)](https://codecov.io/gh/username0101010/array-buffer-serializer)

## Usage

1. **Install module via NPM or yarn**
    
    ```bash
    $ npm install array-buffer-serializer
    ```

2. **Import Serializer object**
    
    ```javascript
    // as CommonJS
    const Serializer = require("array-buffer-serializer");
    // or ES6
    import Serializer from "array-buffer-serializer";
    ```
    
3. **Encode some data (object) using "toBuffer" method**

    ```javascript
    const buffer = Serializer.toBuffer({
        somethig: "here",
        and: true,
        here: 25
    });
    ```

4. **Send the buffer (for example, over WebScoket)**     
    
    ```javascript
    ws.send(buffer);
    ```
    
5. **Receive the buffer and decode it using "fromBuffer" method**

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
