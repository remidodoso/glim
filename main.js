var images = [
    "SI_P_0008_001_20191222_140913.jpg",
    "SI_P_0008_001_20191222_141307.jpg",
    "SI_P_0008_002_20191222_141003.jpg",
    "SI_P_0008_002_20191222_143024.jpg",
    "SI_P_0008_003_20191222_141032.jpg",
    "SI_P_0008_005_20191222_142319.jpg",
    "SI_P_0008_006_20191222_142416.jpg",
    "SI_P_0008_007_20191222_141018.jpg",
    "SI_P_0008_008_20191222_140927.jpg",
    "SI_P_0017_001_20191202_192307.jpg",
    "SI_P_0017_002_20191202_192311.jpg",
    "SI_P_0017_003_20191202_192341.jpg",
    "SI_P_0017_005_20191202_193022.jpg",
    "SI_P_0017_006_20191202_193826.jpg",
    "SI_P_0017_007_20191202_194027.jpg",
    "SI_P_0017_009_20191202_194917.jpg",
    "SI_P_0017_010_20191202_194941.jpg",
    "SI_P_0017_014_20191202_201123.jpg",
    "SI_P_0017_015_20191202_201152.jpg",
    "SI_P_0017_017_20191202_201211.jpg",
];

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

var thumbs = [];

async function create_thumbnails() {
    var header_container = document.getElementById('header_container');
    for (let i = 0; i < images.length; i++) {
        var canvas = document.createElement("canvas");
        canvas.dataset.imageNumber = i;
        canvas.dataset.imageSrc = images[i];
        divbox = document.createElement('DIV');
        divbox.appendChild(canvas);
        header_container.appendChild(divbox);
        thumbs.push(canvas);
    }
    Array.from(header_container.getElementsByTagName('CANVAS')).forEach(canvas => {
        var image = new Image();
        var ctx = canvas.getContext('2d');
        image.onload = function () {
            var scale;
            scale = G_THUMBNAIL_HEIGHT / image.height;
//            scale = 160.0 / image.height;
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
    
    
    el = document.getElementById('photo');
    el.onwheel = wheel;
    document.onkeydown = keydown;

    //
    // Set up pointer/swipe/etc handlers
    //
    lobjet_pane = document.getElementById('lobjet_pane');
    lobjet_pane.addEventListener('pointerdown', lobjet_pointerdown, false);
    lobjet_pane.addEventListener('pointermove', lobjet_pointermove, false);
    lobjet_pane.addEventListener('pointerup', lobjet_pointerup, false);
    lobjet_pane.addEventListener('pointerout', lobjet_pointerout, false);

    create_thumbnails();
    set_current_index(0);
}

function advance() {
    i = 1 + current_index;
    if (i >= images.length) {
        i = 0;
    }
    set_current_index(i);
    draw();
}
function retreat() {
    i = -1 + current_index;
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

}
function torate() {

}
function steg(canvas) {
    var x = canvas.width / 2;
    var y = canvas.height / 2;
    var ctx = canvas.getContext('2d');
    var image_data = ctx.getImageData(x, y, 100, 1);
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
    var backing_canvas = document.getElementById('backing');
    var canvas = document.getElementById('photo');
    if (backing_canvas.getContext) {
        var backing_ctx = backing_canvas.getContext('2d');
    }
    photo_box = document.getElementById('lobjet_pane');
    backing_canvas.width = photo_box.clientWidth;
    backing_canvas.height = photo_box.clientHeight;
    var image = new Image();

    image.onload = function () {
        var scale = Math.min(backing_canvas.width / image.width, backing_canvas.height / image.height);
        var h_pad = (backing_canvas.width - image.width * scale) / 2.0;
        var v_pad = (backing_canvas.height - image.height * scale) / 2.0;

        size = document.getElementById('size');
        size.innerHTML = '' +
            image.width + ' x ' + image.height;
        filename = document.getElementById('filename');

        // Planning to use data URLs to create secure-ish links to stegged images.
        // This seems like it will work, but takes a few seconds or more to do so
        // it will have to be done on request for a download.
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
        if (canvas.getContext) {
            var ctx = canvas.getContext('2d');
        }
        canvas.width = photo_box.clientWidth;
        canvas.height = photo_box.clientHeight;
        ctx.drawImage(backing_canvas, 0, 0);
        steg(canvas);
    }
    image.crossOrigin = "";
    image.src = images[current_index];
}