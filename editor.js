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
        this.html.onkeydown = this.keyDown.bind(this);
        this.cursorHtml = document.createElement('div');
        this.cursorHtml.classList.add('cursor');
    }

    keyDown(e) {
        console.log(e);
        if (e.code == "ArrowLeft") {
            this.cursor = this.doc.movePointerLeft(this.cursor);
            this.render();
        } else if (e.code == "ArrowRight") {
            this.cursor = this.doc.movePointerRight(this.cursor);
            this.render();
        }
    }

    keyPress(e) {
        console.log(e);
this.doc.appendText(e.key);
    }
}