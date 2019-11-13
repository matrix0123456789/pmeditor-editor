import {Document} from "pmeditor-core"

export class Editor {
    constructor(document = null) {
        if (!document)
            document = new Document();
        this.document = document;
        this.html = document.createElement('div');
        this.input = document.createElement('input');
        this.html.append(this.input);
        this.html.onkeypress = this.keyPress.bind(this);
    }

    keyPress(e) {
        console.log(e);

    }
}