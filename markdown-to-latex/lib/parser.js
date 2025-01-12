function tokenize(markdown) {
    let inBlock = false;
    const output = [];

    const inlineSyntaxes = [
        { type: 'bold', regex: /\*\*(.*?)\*\*/g, render: true },
        { type: 'italic', regex: /\*(.*?)\*/g, render: true },
        { type: 'strikethrough', regex: /~~(.*?)~~/g, render: true },
        { type: 'underline', regex: /__(.*?)__/g, render: true },
        { type: 'code', regex: /`(.*?)`/g, render: false },
        { type: 'link', regex: /\[(.*?)\]\((.*?)\)/g, render: false },
        { type: 'image', regex: /!\[(.*?)\]\((.*?)\)/g, render: false },
        { type: 'inlineMath', regex: /\$(.*?)\$/g, render: false }
    ]


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

    function tokenInline(content) {
        if (!content) return [];
        const output = [];
        let lastIdx = 0;
        for (const syntax of inlineSyntaxes) {
            const match = content.slice(lastIdx).matchAll(syntax.regex);
            const matches = [...match];
            if (matches.length){
                content.slice(lastIdx, matches[0].index) && output.push({key:'text',content:content.slice(lastIdx, matches[0].index)});
                matches.forEach((m) => {
                    const l =  (syntax.regex).source.replaceAll('\\', '').replaceAll('(.*?)','').length;
                    output.push({key:syntax.type,content:syntax.render ? tokenInline(m[1]) : {key:'text',content:m[1]}});
                    lastIdx = l+m.index+m[1].length;
                })
            }
        }
        content.slice(lastIdx) && output.push({key:'text',content:content.slice(lastIdx)});
        return output;
    }
    

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
                    return;
                }
            }

            if (inBlock){
                output[output.length - 1].content+=`${line}\n`;
            } else {
                const key = getBlock(line, false) || 'paragraph';
                output.push({
                    type: key,
                    content: tokenInline(line.split(' ').slice(1).join(' ')),
                })
            }
        }
    });

    return output
};



const markdown = `
# Hello **__test__ hello**
> Hello
`;

console.log(tokenize(markdown));