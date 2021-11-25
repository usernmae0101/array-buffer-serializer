const prepareDecoderSuite = require("./decoder-suite");
const prepareEncoderSuite = require("./encoder-suite");

prepareDecoderSuite()
  .on("complete", function() {
    prepareEncoderSuite().run({ async: true });
  })
  .run({ async: true });
