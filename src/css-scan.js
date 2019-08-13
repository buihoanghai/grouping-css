const R = require("ramda");
const regexMatching = regexString => (str, cb) => {
    let matches;
    console.time("regexMatching" + str.length);
    console.log("regexString", regexString);
    while ((matches = regexString.exec(str))) {
        cb(matches);
    }
    console.timeEnd("regexMatching" + str.length);
};

const nodeRegexStr = /(.+?)({)(.+?)(})/sg;
const nodeRegexMatching = regexMatching(nodeRegexStr);
const getNodes = cssStr => {
    let result = [];
    nodeRegexMatching(cssStr, matches => {
        const nodeCss = {
            selector: matches[1],
            attributes: matches[3]
        };
        result.push(nodeCss);
    });
    return result;
};

const mediaRegexStr = /(@media)(.+?)({)(.+?)(}})/sg;
const mediaRegexMatching = regexMatching(mediaRegexStr);
const getMediaBlocks = cssStr => {
    let result = [];
    let firstMediaBlockIndex = cssStr.length;
    mediaRegexMatching(cssStr, matches => {
        if (firstMediaBlockIndex === cssStr.length) {
            firstMediaBlockIndex = matches.index;
        }
        const block = matches[4] + "}";
        result.push({
            media: matches[1] + matches[2],
            nodes: getNodes(block)
        });
    });
    if (firstMediaBlockIndex > 0) {
        const block = cssStr.slice(0, firstMediaBlockIndex);
        const noneMediaBlock = {
            media: "",
            nodes: getNodes(block)

        };
        result.unshift(noneMediaBlock);
    }
    return result;
};

const groupingCSS = cssStr => {
    let mediaBlocks = getMediaBlocks(cssStr);
    console.log("groupingCSS");
    mediaBlocks.map(block => {
        block.nodes.sort(function (a, b) {
            if (a.selector > b.selector)
                return 1;
            if (a.selector < b.selector)
                return -1;
            return 0;
        });
    });
    return mediaBlocks;
};
const transform = cssStr => {
    const groupedCSS = groupingCSS(cssStr);
    let result = "";
    groupedCSS.map(block => {
        result += block.media;
        block.nodes.map(node => {
            result += node.selector + "{";
            result += node.attributes + "}";
        });
        if (block.media) {
            result += "}";
        }
    });
    return result;
};
const revealed = {
    getNodes,
    groupingCSS,
    getMediaBlocks,
    regexMatching,
    transform
};

module.exports = revealed;
