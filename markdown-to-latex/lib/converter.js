const {tokenize, nodeHandlers} = require('./parser');

function markdownToLatex(mdText) {
    const tokens = tokenize(mdText);
    console.log(tokens)
    // return tokens.map(token => {
    //     const handler = nodeHandlers[token.type][token.nodeType];
    //     return handler ? handler(token) : '';
    // }).join('');
}

const out = markdownToLatex(`
# Hello world  

Ta mere *la* pute $5x$
`)

console.log(out)

module.exports = markdownToLatex;
