// tests for the server
'use strict';

const expect = require('chai').expect;
const fetch = require("node-fetch");
const config = require('../server/config.json');

describe("Color Code Converter API", function() {
    describe("RGB to Hex conversion", function() {
        let url = `http://${config.network.domain}:${config.network.port}`;
        url += '/demo/rgbToHex?red=255&green=255&blue=255';

        it("returns status 200", async function() {
            const response = await fetch(url);
            expect(response.status == 200);
        });
        it("returns the color in hex", async function() {
            const response = await fetch(url);
            expect(response.text == 'ffffff');
        });
    });

    describe("Hex to RGB conversion", function() {
        let url = `http://${config.network.domain}:${config.network.port}`;
        url += '/demo/hexToRgb?hex=00ff00';

        it("returns status 200", async function() {
            const response = await fetch(url);
            expect(response.status == 200);
        });
        it("returns the color in RGB", async function() {
            const response = await fetch(url);
            expect(response.json = '[0,255,0]');
        });
    });
})