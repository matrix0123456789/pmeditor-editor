import {BlockAbstract, Document, Paragraph, TextNode} from "pmeditor-core"
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
        this.html.onkeydown = this.keyDown.bind(this);
        this.cursorHtml = document.createElement('div');
        this.cursorHtml.classList.add('cursor');
    }

    keyDown(e) {
        console.log(e);
        if (e.code === "ArrowLeft") {
            this.cursor = this.doc.movePointerLeft(this.cursor);
            this.render();
        } else if (e.code === "ArrowRight") {
            this.cursor = this.doc.movePointerRight(this.cursor);
            this.render();
        } else if (e.code === "Backspace") {
            this.cursor = this.doc.deleteOnce(this.cursor);
            this.render();
        } else if (e.code === "Delete") {
            this.cursor = this.doc.deleteOnceRight(this.cursor);
            this.render();
        } else if (e.code === "Enter") {
            this.cursor = this.doc.addBlock(new Paragraph(), this.cursor);
            this.render();
        } else if (e.key.length === 1) {
            this.cursor = this.doc.addText(e.key, this.cursor);
            this.render();
        }
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
                const cursorNode = this.cursor[this.cursor.length - 2];
                if (cursorNode == element) {
                    const cursorOffset = this.cursor[this.cursor.length - 1] || 0;
                    ret.push(document.createTextNode(element.content.substr(0, cursorOffset + 1)))
                    ret.push(this.cursorHtml);
                    ret.push(document.createTextNode(element.content.substr(cursorOffset + 1)))

                } else {
                    ret.push(document.createTextNode(element.content))

                }
            }
        }
        return ret;
    }
}