import {BlockAbstract, Document, TextNode} from "pmeditor-core"
import "./style.scss";

export class Editor {
    constructor(doc = null) {
        if (!doc)
            doc = new Document();
        this.doc = doc;
        doc.contentChanged(() => this.render());
        this.cursor = doc.getEndPointer();
        this.selectionCursor = null;
        this.html = document.createElement('div');
        this.html.classList.add('pmeditor')
        this.html.onclick = () => this.input.focus();
        this.docHtml = document.createElement('div');
        this.input = document.createElement('input');
        this.html.append(this.input);
        this.html.append(this.docHtml);
        this.html.onkeypress = this.keyPress.bind(this);
    }

    keyPress(e) {
        console.log(e);
        this.doc.addText(e.key, this.cursor);
    }

    rerender() {
        this.render();
    }

    render() {
        let next = this.doc.content.map(x => this.renderElement(x));
        this.replaceChildrens(this.docHtml, next);

    }

    replaceChildrens(element, next) {
        let current = Array.from(element.childNodes);
        for (let x of next) {
            element.append(x)
        }
        for (let x of current) {
            if (!next.includes(x)) {
                x.remove();
            }
        }
    }

    renderElement(element) {
        if (element instanceof BlockAbstract) {
            let html = document.createElement('div');
            let contentArray = this.renderBlockContent(element.content);
            contentArray.forEach(x => html.append(x));
            element.contentChanged(() => {
                let contentArray = this.renderBlockContent(element.content);
                this.replaceChildrens(html, contentArray);
            });
            return html;
        }
    }

    renderBlockContent(contentArray) {
        let ret = [];
        for (let element of contentArray) {
            if (element instanceof TextNode) {
                ret.push(document.createTextNode(element.content))
            }
        }
        return ret;
    }
}