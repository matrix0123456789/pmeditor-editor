import {Document} from "pmeditor-core"

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
}