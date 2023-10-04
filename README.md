# glim

## Client-side photo gallery proof of concept

"glim" is a proof of concept photo gallery that I work on from time to time. I have the following goal, and assorted others, in mind:

* Uses only plain JS with no external dependencies, if possible
* Client-side only, static HTML deployment
* Web (desktop and mobile)
* "Creator/client" and "subscriber" modes
* Casual right-click save is prevented
* Less casual saving from developer tools is complicated, as displayed images are canvas objects
* Displayed images are watermarked/stegonagraphed individually

The overall goal is to create a simple gallery that is easy to navigate, 
looks reasonable, adds some degree of difficulty to unauthorized duplication, and adds some abiilty to 
determine where an unauthorized copy came from.

The current version validates the canvas concept and is functional.

There are many things that need to be addressed. A very non-inclusive list is:

* Proper obfuscation. I don't want to use a JS obfuscator. I plan to rewrite in Rust/Webasm at some point,
  but not until I have a good JS prototype that does all the important things.
* Obfuscation of filenames. I don't think it will be necessary or useful to mangle the jpegs (or whatever
  the sources are), but randomized filenames would be helpful.
* "Authentication" -- there are some client side only options I've considered for this. I believe I'll find
  something satisfactory. This would choose between "creator/client" mode (allowed to download the files
  and a gallery zip directly) and "subscriber" (restricted to canvas viewing and downloading).
* Durable watermarking -- There is a technique that uses "spread spectrum watermarking" that is
  durable across resizing and changes in general. See: https://github.com/iwanders/spread_spectrum_watermarking
  This has to be adapted into steganography, but that seems to be doable.
* Expected navigation behavior. I have found it surprisingly hard to animate mouse wheel scrolling! (!!!)
  Still working on that. I don't think I will worry about swiping on mobile but maybe at some point.

Anyway, the release does contain some sample images.

## How to try

Download the zip or tarball and unpack it.
Start a web server that will serve the files. A file:// URL will not work, due to some JS and security limitations.
For example you could:

<code>$ python -m http.server</code>

in the directory with the files, then go to  http://localhost:8000/.

Happy viewing and thinking!
