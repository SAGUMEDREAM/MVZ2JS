export class HTMLTool {
    static APP_DOC;

    constructor() {
        this.init();
    }

    init() {
        HTMLTool.APP_DOC = document.querySelector(".app");
        if (!HTMLTool.APP_DOC) {
            console.error("Element with class 'app' not found.");
        }
    }

    add(element) {
        if (HTMLTool.APP_DOC) {
            HTMLTool.APP_DOC.appendChild(element);
        } else {
            console.error("APP_DOC is not initialized. Call HTMLTool.init() first.");
        }
    }

    remove(element) {
        if (HTMLTool.APP_DOC && HTMLTool.APP_DOC.contains(element)) {
            HTMLTool.APP_DOC.removeChild(element);
        } else {
            console.error("Element not found in APP_DOC.");
        }
    }

    removeAll() {
        if (HTMLTool.APP_DOC) {
            while (HTMLTool.APP_DOC.firstChild) {
                HTMLTool.APP_DOC.removeChild(HTMLTool.APP_DOC.firstChild);
            }
        } else {
            console.error("APP_DOC is not initialized. Call HTMLTool.init() first.");
        }
    }

    display() {
        if (HTMLTool.APP_DOC) {
            HTMLTool.APP_DOC.style.display = "block";
            HTMLTool.APP_DOC.style.pointerEvents = "auto";
        } else {
            console.error("APP_DOC is not initialized. Call HTMLTool.init() first.");
        }
    }

    hidden() {
        if (HTMLTool.APP_DOC) {
            HTMLTool.APP_DOC.style.display = "none";
            HTMLTool.APP_DOC.style.pointerEvents = "none";
        } else {
            console.error("APP_DOC is not initialized. Call HTMLTool.init() first.");
        }
    }

    // Optional: Additional utility methods

    toggleDisplay() {
        if (HTMLTool.APP_DOC) {
            if (HTMLTool.APP_DOC.style.display === "none") {
                HTMLTool.APP_DOC.style.display = "block";
            } else {
                HTMLTool.APP_DOC.style.display = "none";
            }
        } else {
            console.error("APP_DOC is not initialized. Call HTMLTool.init() first.");
        }
    }

    setHTML(htmlContent) {
        if (HTMLTool.APP_DOC) {
            HTMLTool.APP_DOC.innerHTML = htmlContent;
        } else {
            console.error("APP_DOC is not initialized. Call HTMLTool.init() first.");
        }
    }

}
