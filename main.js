var images = [
// BEGIN OBJET FILES
    "SI_P_0016_001_20050831_013448.jpg",
    "SI_P_0016_002_20050831_014300.jpg",
    "SI_P_0016_003_20050831_030212.jpg",
    "SI_P_0016_005_20050901_004742.jpg",
    "SI_P_0016_004_20050831_064300.jpg",
    "SI_P_0016_007_20050901_023232.jpg",
    "SI_P_0016_008_20050901_031232.jpg",
    "SI_P_0016_009_20050901_032102.jpg",
    "SI_P_0016_006_20050901_005712.jpg",
    "SI_P_0016_010_20050901_042512.jpg",
    "SI_P_0016_011_20050901_110532.jpg",
    "SI_P_0016_012_20050902_001618.jpg",
    "SI_P_0016_013_20050902_021316.jpg",
    "SI_P_0016_014_20050902_092920.jpg",
    "SI_P_0016_015_20050904_021808.jpg",
    "SI_P_0016_016_20050904_033208.jpg",
// END OBJET FILES
];
var gallery_title = 'Trip Snapshots';

//
// Thumbnail properties
//
const G_THUMBNAIL_HEIGHT = 160.0;
var G_THUMBNAIL_INACTIVE_STYLE = {
    'box-shadow':    '5px 5px 4px #888',
    'border':        '1px solid #bbb',
    'border-radius': '8px',
    'margin':        '4px',
    'opacity':       '100%',
    'filter':        '',
};
var G_THUMBNAIL_ACTIVE_STYLE = {
    'box-shadow':    '5px 5px 4px #888',
    'border':        '1px solid red',
    'border-radius': '8px',
    'margin':        '4px',
    'opacity':       '75%',
    'filter':        'brightness(75%)',
};

//
// It would be cleaner if this wasn't a global, but thread safety isn't an issue as
// it's initialized in a single loop and is read-only from there.
//
var thumbs = [];

//
// Nothing happening during this initialization depends on user interaction, so we
// run it asynchronously and let other stuff happen in the meanwhile.
//
async function create_thumbnails() {
    let carousel_container = document.getElementById('carousel-container');
    for (let i = 0; i < images.length; i++) {
        let canvas = document.createElement("canvas");
        canvas.dataset.imageNumber = i;
        canvas.dataset.imageSrc = images[i];
        let divbox = document.createElement('DIV');
        divbox.appendChild(canvas);
        carousel_container.appendChild(divbox);
        thumbs.push(canvas);
    }  
    Array.from(carousel_container.getElementsByTagName('CANVAS')).forEach(canvas => {
        let image = new Image();
        let ctx = canvas.getContext('2d');
        image.onload = function () {
            let scale = G_THUMBNAIL_HEIGHT / image.height;
            canvas.width = image.width * scale;
            canvas.height = image.height * scale;
            Object.keys(G_THUMBNAIL_INACTIVE_STYLE).forEach(attr => {
                canvas.style[attr] = G_THUMBNAIL_INACTIVE_STYLE[attr];
            });
            canvas.addEventListener('click', event => {
                set_current_index(parseInt(canvas.dataset.imageNumber));
                draw();
            })
            ctx.scale(scale, scale);
            ctx.drawImage(image, 0, 0);
            if (canvas.dataset.imageNumber == 0) {
                set_current_index(0);
            }

            return true;
        }
        image.src = canvas.dataset.imageSrc;
    })
}

var current_index = null;
var rotation = 0;

function set_current_index(new_index) {
    if (current_index !== null) {
        if (new_index == current_index) {
            return;
        }
        canvas = thumbs[current_index];
        Object.keys(G_THUMBNAIL_INACTIVE_STYLE).forEach(attr => {
            canvas.style[attr] = G_THUMBNAIL_INACTIVE_STYLE[attr];
        });
    }
    current_index = new_index;
    Object.keys(G_THUMBNAIL_ACTIVE_STYLE).forEach(attr => {
        thumbs[current_index].style[attr] = G_THUMBNAIL_ACTIVE_STYLE[attr];
    });
    thumbs[current_index].scrollIntoView({behavior: 'smooth'});
}

//
// "lobjet" -> "l'objet d'art"
// and now you know
//

function init() {

    let lobjet_down_x;
    let lobjet_pane;

    function lobjet_pointerdown(e) {
        if (!e.isPrimary) { returh; }
        if ((e.buttons & 1) == 1) {
            lobjet_down_x = e.clientX;
        }
        console.log(e);
    }
    
    function lobjet_pointermove(e) {
        if (!e.isPrimary) { returh; }
        if ((e.buttons & 1) == 1) {
            console.log(e.clientX - lobjet_down_x);
            lobjet_pane.style.left = e.clientX - lobjet_down_x + 'px';
        }
    }
    
    function lobjet_pointerup(e) {
        if (!e.isPrimary) { returh; }
        if ((e.buttons & 1) == 0) {
            lobjet_pane.style.left = '0px';
        }
        console.log(e);
    }
    
    function lobjet_pointerout(e) {
        if (!e.isPrimary) { returh; }
        if ((e.buttons & 1) == 1) {
            if (e.clientX - lobjet_down_x > 0) {
                advance();
            } else {
                retreat();
            }
            lobjet_pane.style.left = '0px';
        }
        console.log(e);
    }
    
    let photo_el = document.getElementById('photo');
    photo_el.onwheel = wheel;
    document.onkeydown = keydown;

    //
    // Set up pointer/swipe/etc handlers
    //
    lobjet_pane = document.getElementById('lobjet_pane');
    lobjet_pane.addEventListener('pointerdown', lobjet_pointerdown, false);
    lobjet_pane.addEventListener('pointermove', lobjet_pointermove, false);
    lobjet_pane.addEventListener('pointerup', lobjet_pointerup, false);
    lobjet_pane.addEventListener('pointerout', lobjet_pointerout, false);

    let gallery_title_el = document.getElementById('gallery-title');
    gallery_title_el.innerHTML =
        '<span style="font-size: larger">' + gallery_title + '</span>';
    create_thumbnails();
    set_current_index(0);
}

function advance() {
    let i = 1 + current_index;
    if (i >= images.length) {
        i = 0;
    }
    set_current_index(i);
    draw();
}
function retreat() {
    let i = -1 + current_index;
    if (i < 0) {
        i = images.length - 1;
    }
    set_current_index(i);
    draw();
}
function wheel(event) {
    if (event.deltaY > 0) {
        advance();
    } else {
        retreat();
    }
}
function keydown(event) {
    if (event.key == 'ArrowRight' || event.key == 'Right') {
        advance();
    } else if (event.key == 'ArrowLeft' || event.key == 'Left') {
        retreat();
    }
}
function rotate() {
    // NYI
}
function torate() {
    // NYI
}
//
// Current plan here is:
//   Assume that images will be saved directly and not resized or re-encoded etc
//   Data like IP address, datetime, etc., will be encoded as LSB in a central-ish area of the image
//   -- This could be varied by image!
//   The steg data will include a "leader" of LSBs with a particular signature that will identify
//     the start of the data
//   Possibly a user name could be recorded, if we can persuade the user to "log in" with a username 
//     and a password, thence stored on the browser
//
function steg(canvas) {
    let x = canvas.width / 2;
    let y = canvas.height / 2;
    let ctx = canvas.getContext('2d');
    let image_data = ctx.getImageData(x, y, 100, 1);
    for (let i = 0; i < 100; i++) {
        image_data.data[i * 4] &= 240;
        image_data.data[i * 4 + 1] &= 240;
        image_data.data[i * 4 + 2] &= 240;
        image_data.data[i * 4 + 3] = 255;
    }
    ctx.putImageData(image_data, x, y);
}

function draw(image_number = null) {
    //
    // Draw into a hidden canvas first to avoid flicker
    //
    let backing_canvas = document.getElementById('backing');
    let canvas = document.getElementById('photo');
    let backing_context;
    if (backing_canvas.getContext) {
        backing_ctx = backing_canvas.getContext('2d');
    }
    photo_box = document.getElementById('lobjet_pane');
    backing_canvas.width = photo_box.clientWidth;
    backing_canvas.height = photo_box.clientHeight;
    let image = new Image();

    image.onload = function () {
        let scale = Math.min(backing_canvas.width / image.width, backing_canvas.height / image.height);
        let h_pad = (backing_canvas.width - image.width * scale) / 2.0;
        let v_pad = (backing_canvas.height - image.height * scale) / 2.0;

        let size = document.getElementById('size');
        size.innerHTML = '' +
            image.width + ' x ' + image.height;
        filename = document.getElementById('filename');

        // Planning to use data URLs to create secure-ish links to stegged images.
        // This seems like it will work, but takes a few seconds or more to do so
        // it will have to be done on request for a download, or more likely, in the
        // background.
        //
        // data_url = canvas.toDataURL();

        filename.innerHTML =
            '<a target="_blank" href="' + images[current_index] + '">' +
            '<span style="font-size: smaller">view 👁️</span>' +
            '</a> ' +
            '<a download href="' + images[current_index] + '">' +
            '<span style="font-size: smaller">download ⤵️</span>' +
            '</a>';


        backing_ctx.save();
        backing_ctx.fillStyle = '#777';
        backing_ctx.fillRect(0, 0, backing_canvas.width, backing_canvas.height);
        backing_ctx.translate(h_pad, v_pad);
        backing_ctx.scale(scale, scale);
        backing_ctx.drawImage(image, 0, 0);
        backing_ctx.restore();
        let ctx;
        if (canvas.getContext) {
            ctx = canvas.getContext('2d');
        }
        canvas.width = photo_box.clientWidth;
        canvas.height = photo_box.clientHeight;
        ctx.drawImage(backing_canvas, 0, 0);
        steg(canvas);
    }
    image.crossOrigin = "";
    image.src = images[current_index];
}