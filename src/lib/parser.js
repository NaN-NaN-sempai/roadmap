export const strToObj = (src) => {
    const itens = src.split("␝");
    
    return itens.map((item) => {
        const composedTitle = item.split("␟")[0];
        const subitens = item.split("␟").slice(1).map((subitem) => {
            const done = subitem.startsWith("☑");
            return {
                name: subitem.slice(done ? 1 : 0),
                done
            }
        });
        let title;
        let link;
        let tags;
        let done;
        
        if(composedTitle.includes("␜")) {
            [title, link] = composedTitle.split("␜");
            if (link) link = link.split("␞")[0];
        }
        if(composedTitle.includes("␞")) {
            if (!title) title = composedTitle.split("␞")[0];
            tags = composedTitle.split("␞").slice(1);
            
        }
        if(title == null) title = composedTitle;

        if(title.startsWith("☑")) {
            title = title.slice(1);
            done = true;
        }

        return {
            title,
            link,
            tags,
            subitens,
            done
        };
    });
}

export const objToStr = (obj) => {
    return obj.filter(item => item.title?.trim() && !item.delete).map((item) => {
        const subitens = item.subitens.filter(subitem => subitem.name?.trim() && !item.delete);

        return [
            (item.done? "☑": "") + item.title +
            (item.link ? "␜" + item.link : "") +
            (item.tags ? "␞" + item.tags.join("␞") : ""),
            ...subitens.map((subitem) => (subitem.done? "☑": "") + subitem.name)
        ].join("␟");
    }).join("␝");
}