
class SVGLoader {
    constructor() {
        // Contain an array of {filename, content}-objects to save network usage
        this.FilesLoaded = [];

        // Get all <i>-elements
        const DOMList = Array.from(document.body.getElementsByTagName("i"));

        // No files to replace
        if(!DOMList) return;
        

        // Find all lo-icon's
        DOMList.forEach(DOMElem => {
            if(DOMElem.classList.contains("lo-icon")) {
                DOMElem.classList.forEach(classname => {
                    if(classname != "lo-icon" && classname.startsWith("lo-")) {
                        this.getFileContent(classname, DOMElem, this.insertDOM);
                        return;
                    }
                });
            }
        });
    }

    getFileContent (Path, DOMElement, Handler) {
        if(!Path || !DOMElement || !Handler) {
            throw('SVGLoader.getFile() missing one or more parameters');
        }
    
        // Look for file in storage / this.FilesLoaded
        if(this.FilesLoaded && Array.isArray(this.FilesLoaded) && this.FilesLoaded.length > 0) {
            const foundFileLoaded = this.FilesLoaded.find(file => { return (file.filename == img); });
    
            if(foundFileLoaded) {
                Handler(foundFileLoaded.content, DOMElement);
                return;
            }
        }
    
        // Create query
        const fileRequest = new Request(`./src/img/${Path}.svg`);

        // Fetch file content
        fetch(fileRequest)
            .then((response) => response.text())
            .then((FileContent) => {
                // Once more look for file in storage / this.FilesLoaded to prevent excess RAM usage
                const foundExistingFile = this.FilesLoaded.find(file => { return (file.filename == Path); });
    
                if(foundExistingFile) {
                    // Use existing file
                    Handler(foundExistingFile.content, DOMElement);
                }
                else {
                    // Store and use new file
                    this.FilesLoaded.push({ 
                        filename: Path, 
                        content: FileContent
                    });
        
                    Handler(FileContent, DOMElement);
                }
            })
            .catch(error => {
                throw(`SVGLoader.getFileContent() error: ${error}`);
            })
    }
    
    insertDOM (FileContent, DOMElement) {
        // show commented out old <i>-element
        DOMElement.insertAdjacentHTML('beforebegin', "<!-- " + DOMElement.outerHTML + " -->");

        // Get attributes from <i>-element
        let originalAttributes = [];
        for (const attribute of DOMElement.attributes) {
            originalAttributes.push(`${attribute.name}="${attribute.value}"`)
        }

        // Insert FileContent with attributes from <i>-element
        DOMElement.insertAdjacentHTML('beforebegin', FileContent.replace('<svg', '<svg ' + originalAttributes.join(' ')));

        // Remove original DOMElement
        DOMElement.remove();
    }
};


// initialize SVGLoader.
new SVGLoader();
