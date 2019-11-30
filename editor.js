import {BlockAbstract, Document, Paragraph, TextNode} from "pmeditor-core"
import "./style.scss";

export class Editor {
    constructor(doc = null) {
        if (!doc)
            doc = new Document();
        this.doc = doc;
        this.doc.contentChanged(() => this.render());
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
        this.html.oncopy = this.copy.bind(this);
        this.html.onpaste = this.paste.bind(this);
        this.cursorHtml = document.createElement('div');
        this.cursorHtml.classList.add('cursor');
        this.selectionCursorHtml = document.createElement('div');
        this.selectionCursorHtml.classList.add('cursor');
    }

    keyDown(e) {
        if (e.code === "ArrowLeft") {
            if (e.shiftKey) {
                if (!this.selectionCursor)
                    this.selectionCursor = this.cursor;
            } else {
                this.selectionCursor = null;
            }
            this.cursor = this.doc.movePointerLeft(this.cursor);
            this.render();
        } else if (e.code === "ArrowRight") {
            if (e.shiftKey) {
                if (!this.selectionCursor)
                    this.selectionCursor = this.cursor;
            } else {
                this.selectionCursor = null;
            }
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
            if (e.ctrlKey) {
                if (e.key === "a") {
                    this.selectionCursor = [];
                    this.cursor = this.doc.getEndPointer();
                }
            } else
                this.cursor = this.doc.addText(e.key, this.cursor);
            this.render();
        }
    }

    rerender() {
        this.render();
    }

    render() {
        let next = this.doc.content.map(x => this.renderElement(x));
        this.replaceChildren(this.docHtml, next);
    }

    replaceChildren(element, next) {
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
                this.replaceChildren(html, contentArray);
            });
            return html;
        }
    }

    renderBlockContent(contentArray) {
        let cursors = [{path: this.cursor, element: this.cursorHtml}];
        if (this.selectionCursor)
            cursors.push({path: this.selectionCursor, element: this.selectionCursorHtml});

        let ret = [];
        for (let element of contentArray) {
            if (element instanceof TextNode) {
                let part = "";
                for (let i = 0; i <= element.content.length; i++) {
                    for (const cursor of cursors) {
                        const cursorNode = cursor.path[this.cursor.length - 2];
                        const cursorOffset = cursor.path[this.cursor.length - 1] || 0;
                        if (cursorNode === element && cursorOffset === i) {
                            if (part.length > 0)
                                ret.push(document.createTextNode(part));
                            part = '';
                            ret.push(cursor.element);
                        }
                    }
                    if (i < element.content.length)
                        part += element.content[i];
                }
                if (part.length > 0)
                    ret.push(document.createTextNode(part));
            }
        }
        return ret;
    }

    copy(e) {
        if (this.selectionCursor != null) {
            const fragment = this.doc.getFragment(this.selectionCursor, this.cursor);
            e.clipboardData.setData('text/pmeditor', fragment.serialize());
            e.clipboardData.setData('text/plain', fragment.toText());
        }
        e.preventDefault();
    }

    paste(e) {
        let pastePMEditor = e.clipboardData.getData('text/pmeditor');
        let paste = e.clipboardData.getData('text');
        console.log(pastePMEditor, paste);
    }
}