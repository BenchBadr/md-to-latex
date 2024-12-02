const md = require('markdown-it')();

function markdownToLatex(mdText) {
    const tokens = md.parse(mdText, {});
    const ast = tokens.map(token => ({
        type: token.type,
        tag: token.tag,
        content: token.content,
        level: token.level
    }));
    console.log(ast);
    return ast;
}

markdownToLatex(`
# Hello world  

Ta mere *la* pute $5x$
`)

module.exports = markdownToLatex;