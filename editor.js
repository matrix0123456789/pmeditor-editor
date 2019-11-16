import {Document, BlockAbstract, TextNode} from "pmeditor-core"

export class Editor {
    constructor(doc = null) {
        if (!doc)
            doc = new Document();
        this.doc = doc;
        this.html = document.createElement('div');
        this.input = document.createElement('input');
        this.html.append(this.input);
        this.html.onkeypress = this.keyPress.bind(this);
    }

    keyPress(e) {
        console.log(e);
        this.doc.appendText(e.key);
    }

    rerender() {
        Array.from(this.html.childNodes).filter(x => x != this.input).forEach(x => x.remove());
        for (let element of this.doc.content) {
            this.html.append(this.render(element))
        }
    }

    render(element) {
        if (element instanceof BlockAbstract) {
            let html = document.createElement('div');
            let contentArray = this.renderBlockContent(element.content);
            contentArray.forEach(x => html.append(x));
            return html;
        }
    }

    renderBlockContent(contentArray) {
        let ret = [];
        for (let element of contentArray) {
            if(element instanceof TextNode){
                ret.push(document.createTextNode(element.content))
            }
        }
        return ret;
    }
}