function tokenize(markdown) {
    let lastObjects = [];
    let inBlock = false;
    const output = [];

    const inlineSyntaxes = {
        bold: /\*\*(.*?)\*\*/g,
        italic: /\*(.*?)\*/g,
        strikethrough: /~~(.*?)~~/g,
        code: /`(.*?)`/g,
        link: /\[(.*?)\]\((.*?)\)/g,
        image: /!\[(.*?)\]\((.*?)\)/g,
        inlineMath: /\$(.*?)\$/g,
        heading: /^(#{1,6})\s(.*)/g,
    }
    const blockSyntaxes = {
        blockCode: /^```/g,
        blockMath: /^\$\$/g
    }

    const lineSyntax = {
        heading: /^(#{1,6})\s(.*)/g,
        blockquote: /^>(.*)/g,
    }

    function getBlock(line) {
        const trimmedLine = line.trim();
        for (const [key, regex] of Object.entries(blockSyntaxes)) {
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
                    output.push({
                        type: key,
                        content: []
                    });
                    inBlock = key;
                    return;
                } else if (inBlock === key){
                    inBlock = false;
                }
            }
        }
        if (inBlock){
            output[output.length - 1].content+=`${line}\n`;
        }
    });
    
    return output
};



const markdown = `
$$
5x + \frac{1}{2}
5+3


\`\`\`
print("Hello World")

`;

console.log(tokenize(markdown));