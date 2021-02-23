// demo for mocha and chai local module functions
// tested functions need to be exported
'use strict';

const expect = require("chai").expect;
// acquire local modules to be tested
const converter = require("../client/converter"); 

describe("Color Code Converter", function() {
    // header of test section
    describe("RGB to Hex conversion", function() {
        // sub heading 1 of test section
        // specification for RGB to HEX converter
        it("converts the basic colors", function() {
            // individual test case
            const redHex   = converter.rgbToHex(255, 0, 0);
            const greenHex = converter.rgbToHex(0, 255, 0);
            const blueHex  = converter.rgbToHex(0, 0, 255);

            expect(redHex).to.equal("ff0000");
            expect(greenHex).to.equal("00ff00");
            expect(blueHex).to.equal("0000ff");
        });
    });

    describe("Hex to RGB conversion", function() {
        // sub heading 2 of test sections
        // specification for HEX to RGB converter
        it("converts the basic colors", function() {
            // individual test case
            const red   = converter.hexToRgb("ff0000");
            const green = converter.hexToRgb("00ff00");
            const blue  = converter.hexToRgb("0000ff");

            expect(red).to.deep.equal([255, 0, 0]);
            expect(green).to.deep.equal([0, 255, 0]);
            expect(blue).to.deep.equal([0, 0, 255]);
        });
    });
})