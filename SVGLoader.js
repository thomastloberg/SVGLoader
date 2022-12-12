/**
 * TLoberg 2022
 *
 * @version 1.0.0
 * @summary Converts i-tags into svg data
 * @author Thomas Tufta Løberg <thomas@tloberg.net>
 *
 * Created at     : 2022-12-12 23:36:42 
 * Last modified  : 2022-12-12 23:36:42
 */


class SVGLoader {
    constructor() {
        // Contain an array of {filename, content}-objects to save network usage
        this.FilesLoaded = [];

        // <i>-elements with this classname is defined as SVGLoader-element
        this.SVGLoaderPrefix = 'lo-icon';

        // <i>-elements with classname starting with Prefix will be requested in this.getFileContent()
        this.Prefix = 'lo-';

        // Location of all SVG-files
        this.SVGPath = './src/img/';


        // Get all <i>-elements
        const DOMList = Array.from(document.body.getElementsByTagName("i"));

        // No files to replace
        if(!DOMList) return;
        

        // Find all lo-icon's
        DOMList.forEach(DOMElem => {
            if(DOMElem.classList.contains("lo-icon")) {
                DOMElem.classList.forEach(classname => {
                    if(classname.trim().toLowerCase() != this.SVGLoaderPrefix.trim().toLowerCase() 
                    && classname.trim().toLowerCase().startsWith(this.Prefix.trim().toLowerCase())) {
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
        const fileRequest = new Request(`${this.SVGPath}${Path}.svg`);

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
