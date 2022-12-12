# Javascript SVGLoader    
    
### Why
No simple way of coloring an SVG file without putting the whole SVG data inside your HTML-rendered file.    
With this solution you can implement an small i-element and just as easily change icon by changing the class names.    
    
### How    
A way to implement FontAwesome logiq to all your existing svg files.    
    
### Configuration    
Modify SVGLoaderPrefix, Prefix and SVGPath to suit your project.    
All attributes provided into the i-element will be passed onto the SVG data.    

    
Include script in HTML header like this:    
`<script type="text/javascript" src="/src/js/SVGLoader.js?v=1.0.0" defer></script>`    
    
#### Example usage:    
`<i class="lo-icon lo-profile" title="Profile icon"></i>`
    
#### Output:    
`<!-- <i class="lo-icon lo-profile" title="Profile icon"></i> -->`    
`<svg class="lo-icon lo-profile" title="Profile icon"><path...></svg>`
