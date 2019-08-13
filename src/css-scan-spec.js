const fs = require("fs");
const cssScan = require("./css-scan");
describe("css-scan", () => {
    describe("transform", () => {
        fit("should return correct data 1", () => {
            const input = fs.readFileSync('./examples/ex1.css');
            const output = cssScan.transform(input);
            fs.writeFile('./examples/grouped-ex1.css', output, "utf8", () => {

            });
        });
    });
    describe("groupingCSS", () => {
        it("should return correct data 1", () => {
            const input = `@media screen and (min-width:64em) and (max-width:75em){.w4{width:2rem}.w2{width:.5rem}.w3{width:1rem}.shadow-6{box-shadow:0 2px 4px 1px rgba(0,0,0,.1)}}`;
            const output = cssScan.groupingCSS(input);
            const expected = [
                {
                    media: '@media screen and (min-width:64em) and (max-width:75em)',
                    nodes:
                        [
                            {
                                selector: '.shadow-6',
                                attributes: 'box-shadow:0 2px 4px 1px rgba(0,0,0,.1)'
                            },
                            {
                                selector: '.w3',
                                attributes: 'width:1rem'
                            }
                        ]
                }
            ];
            console.log(output[0].nodes);
            expect(expected[0].nodes[0].selector).toEqual(output[0].nodes[0].selector);
        });
        it("should return correct data 2", () => {
            const input = fs.readFileSync('./examples/ex1.css');
            const output = cssScan.groupingCSS(input);
            fs.writeFile('./examples/grouping-ex1.json', JSON.stringify(output), "utf8", () => {

            });
            // expect(expected[0].nodes[0].selector).toEqual(output[0].nodes[0].selector);
        });
    });
    describe("getMediaBlock", () => {
        it("should return correct data 1", () => {
            const input = `@media screen and (min-width:64em) and (max-width:75em){.shadow-6{box-shadow:0 2px 4px 1px rgba(0,0,0,.1)}}`;
            const output = cssScan.getMediaBlocks(input);
            const expected = [
                {
                    media: "@media screen and (min-width:64em) and (max-width:75em)",
                }
            ];
            expect(expected[0].media).toEqual(output[0].media);
        });

        it("should return correct data 2", () => {
            const input = `.w2{width:.5rem}@media screen and (min-width:64em) and (max-width:75em){.shadow-6{box-shadow:0 2px 4px 1px rgba(0,0,0,.1)}}`;
            const output = cssScan.getMediaBlocks(input);
            const expected = [
                {
                    media: "",
                },
                {
                    media: "@media screen and (min-width:64em) and (max-width:75em)",
                }
            ];
            expect(expected[0].media).toEqual(output[0].media);
            expect(expected[1].media).toEqual(output[1].media);
        });

    });
    describe("getNodes", () => {
        it("should return correct data 1", () => {
            const input = `.shadow-6{box-shadow:0 2px 4px 1px rgba(0,0,0,.1)}`;
            const expected = [
                {
                    selector: '.shadow-6',
                    attributes: 'box-shadow:0 2px 4px 1px rgba(0,0,0,.1)'
                }
            ];
            expect(expected).toEqual(cssScan.getNodes(input));
        });

        it("should return correct data 2", () => {
            const input = `.shadow-6{box-shadow:0 2px 4px 1px rgba(0,0,0,.1)}.shadow-6{box-shadow:0 2px 4px 1px rgba(0,0,0,.1)}
            .shadow-6{box-shadow:0 2px 4px 1px rgba(0,0,0,.1)}`;
            const expected = 3;
            expect(expected).toEqual(cssScan.getNodes(input).length);
        });
    });
    describe("regexMatching", () => {
        it("should return correct data 1", () => {
            const str = `.shadow-6{box-shadow:0 2px 4px 1px rgba(0,0,0,.1)}`;
            const regexStr = /(.+?)({)(.+?)(})/sg;
            const nodeRegexMatching = cssScan.regexMatching(regexStr);
            let output = [];
            nodeRegexMatching(str, matches => {
                console.log(matches);
                output.push(matches);
            });
            expect(1).toEqual(output.length);
        });

    });
});
