function tokenize(markdown) {
    let lastObjects = [];
    let inBlock = false;
    const output = [];

    const inlineSyntaxes = {
        bold: /\*\*(.*?)\*\*/g,
        italic: /\*(.*?)\*/g,
        strikethrough: /~~(.*?)~~/g,
        underline: /__(.*?)__/g,
    }

    const inlineEscape = {
        code: /`(.*?)`/g,
        link: /\[(.*?)\]\((.*?)\)/g,
        image: /!\[(.*?)\]\((.*?)\)/g,
        inlineMath: /\$(.*?)\$/g,
    }

    const blockSyntaxes = {
        blockCode: /^```/g,
        blockMath: /^\$\$/g
    }

    const lineSyntax = {
        h1: /^#\s(.*)/,
        h2: /^##\s(.*)/,
        h3: /^###\s(.*)/,
        h4: /^####\s(.*)/,
        h5: /^#####\s(.*)/,
        h6: /^######\s(.*)/,
        blockquote: /^>(.*)/
    };

    function getBlock(line, checkBlock = true) {
        const trimmedLine = line.trim();
        const syntaxes = checkBlock ? blockSyntaxes : lineSyntax;
        for (const [key, regex] of Object.entries(syntaxes)) {
            if (regex.test(trimmedLine)) {
                return key;
            }
        }
        return null;
    }

    const lines = markdown.split('\n');
    lines.forEach(line => {
        if (line){
            const key = getBlock(line)
            if (key){
                if (!inBlock){
                    const adapter = {blockCode:'language', blockMath:'global'};
                    const extension = line.trim().slice(blockSyntaxes[key].source.replace(/\\/g, '').length - 1);
                    output.push({
                        type: key,
                        content: [],
                        [adapter[key]]: extension,
                    });
                    inBlock = key;
                    return;
                } else if (inBlock === key){
                    inBlock = false;
                }
            }

            if (inBlock){
                output[output.length - 1].content+=`${line}\n`;
            } else {
                const key = getBlock(line, false) || 'paragraph';
                console.log(key)
                let content = [];
                // continue here
            }
        }
    });
    
    return output
};



const markdown = `
# Hello **world** *hello*
hello
__hello__
**__hello__**
`;

console.log(tokenize(markdown));