import LZString from "lz-string";

export function load({ cookies }) {
    const block = cookies.get("login_block");

    if (!!block) return { blocked: true };


    
    
    const gi = (str, itens=[]) => {
        return [str, ...itens].join("␟");
    }
    const gt = (str, link, tags=[]) => {
        if(link) str += "␜" + link;
        return [str, ...tags].join("␞");
    }

    let str = [
        gi("LhsMP", ["Slider de velocidade", "☑Slider de volume"]),
        gi(gt("LhsML", null, ["compiler", "html"]), ["Refactor tokenizer and parser"]),
        gi(gt("JAZZ", null, ["compiler", "styling"]), ["Elaborate synthax", "Build parser"]),
    ].join("␝");

    const compressed = LZString.compress(str);
    
    const decompressed = LZString.decompress(compressed);

    const parser = (src) => {

        const itens = src.split("␝");
        
        return itens.map((item) => {
            const composedTitle = item.split("␟")[0];
            const subitens = item.split("␟").slice(1).map((subitem) => {
                const status = subitem.startsWith("☑");
                return {
                    name: subitem.slice(status ? 1 : 0),
                    status
                }
            });
            let title;
            let link;
            let tags;
            
            if(composedTitle.includes("␜")) {
                title = composedTitle.split("␜")[0];
                
                link = composedTitle.split("␜")[1];
            }
            if(composedTitle.includes("␞")) {
                if(title == null){
                    title = composedTitle.split("␞")[0];
                }
                tags = composedTitle.split("␞").slice(1);
                
            }
            if(title == null) title = composedTitle;

            return {
                title,
                link,
                tags,
                subitens
            };
        });
    }

    const kvData = parser(decompressed);



    return {
        blocked: !!block,
        kvData
    };
}