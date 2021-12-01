const prepareDecoderSuite = require("./decoder-suite");
const prepareEncoderSuite = require("./encoder-suite");
const prepareMonolithSuite = require("./monolith-suite");

const separator = "--".repeat(15);
const suites = [
  prepareMonolithSuite,
  prepareDecoderSuite,
  prepareEncoderSuite
];

async function run() {
  for (let suite of suites) {
    console.log(separator);

    await new Promise(resolve => {
      suite()
        .on("complete", resolve)
        .run({async: true});
    });
  }
}

run();
