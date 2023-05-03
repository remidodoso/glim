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

    // I can't quite believe that it's this complex to implement a smooth scroll
    // for the carousel, and even this doesn't have the expected behavior. So I'm
    // going with the simple version and no smooth scroll until I've had time to
    // ponder.
    // I'm going to commit then delete this and come back to it :)   

    /*
    carousel_container.addEventListener('wheel', carousel_wheel, false);

    let calls = 0;
    let in_animation = false;
    let target_scroll_left = carousel_container.scrollLeft;

    function carousel_wheel(e) {
        if (!in_animation) {
            in_animation = true;
            requestAnimationFrame(animate_scroll);
        }

        const delta = e.deltaY;
        target_scroll_left += delta;
        console.log('delta: ' + delta);
        console.log('wheel');
        console.log('target_scroll_left: ' + target_scroll_left);
        const max_scroll_left = carousel_container.scrollWidth - carousel_container.clientWidth;
        if (target_scroll_left < 0) {
            target_scroll_left = 0;
        } else if (target_scroll_left >= max_scroll_left) {
            target_scroll_left = max_scroll_left;
        }
        console.log('target_scroll_left: ' + target_scroll_left);
            

        function animate_scroll(current_time) {
            calls += 1;
            console.log('animate ' + calls);
            const start_scroll_left = carousel_container.scrollLeft;
            p_now = performance.now();
            console.log('current time: ' + current_time + ' p_now: ' + p_now);
            const time_elapsed = p_now - Math.floor(current_time);
            console.log('elapsed: ' + time_elapsed);
            const scroll_distance = target_scroll_left - start_scroll_left;
            console.log('animate: start_scroll_left: '+ start_scroll_left + ' scroll_distance: ' + scroll_distance);
            const duration = Math.abs(scroll_distance) / 5;

            // this function creates a smooth scroll
            const easing = t => 
                t < .5 ?
                    2 * t * t :
                    -1 + (4 - 2 * t);

            console.log('elapsed: ' + time_elapsed + ' duration: ' + duration);
            if (time_elapsed < duration) {
                const t = time_elapsed / duration;
                console.log('easing: ' + easing(t));
                const scroll_left = start_scroll_left + (Math.abs(scroll_distance / 5) < 1 ? Math.sign(scroll_distance) : scroll_distance / 20);
                console.log('scroll_left: ' + scroll_left);
                carousel_container.scrollLeft = scroll_left;
                requestAnimationFrame(animate_scroll);
            } else {
                carousel_container.scrollLeft = target_scroll_left;
                in_animation = false;
            }

        }
    }    
    */

    for (let i = 0; i < images.length; i++) {
        const canvas = document.createElement("canvas");
        canvas.dataset.imageNumber = i;
        canvas.dataset.imageSrc = images[i];
        const divbox = document.createElement('DIV');
        divbox.appendChild(canvas);
        carousel_container.appendChild(divbox);
        thumbs.push(canvas);
    }  
    Array.from(carousel_container.getElementsByTagName('CANVAS')).forEach(canvas => {
        const image = new Image();
        const ctx = canvas.getContext('2d');
        image.onload = function () {
            //
            // TBD add some kind of provision for extreme aspect ratios
            // Probably restrict to 3:1 or something like that (whatever
            // 35mm pano is), lop off the extra bits symmetrically, and make the
            // thumbnail from the remaining portion.
            // 
            const scale = G_THUMBNAIL_HEIGHT / image.height;
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
        const canvas = thumbs[current_index];
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
// called from <body onload ...
//
function init() {

    //
    // "lobjet" -> "l'objet d'art"
    // and now you know
    //
    let lobjet_down_x;
    let lobjet_pane;

    //
    // Handlers ...
    // I should just ignore mobile for the most part, for now, as swipe is a pain,
    // or at least painful for me to understand ...
    //
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

    function lobjet_wheel(e) {
        if (e.deltaY > 0) {
            advance();
        } else {
            retreat();
        }
    }
    
    const photo_el = document.getElementById('photo');
    photo_el.onwheel = lobjet_wheel;
    document.onkeydown = keydown;

    //
    // Set up pointer/swipe/etc handlers
    //
    lobjet_pane = document.getElementById('lobjet_pane');
    lobjet_pane.addEventListener('pointerdown', lobjet_pointerdown, false);
    lobjet_pane.addEventListener('pointermove', lobjet_pointermove, false);
    lobjet_pane.addEventListener('pointerup', lobjet_pointerup, false);
    lobjet_pane.addEventListener('pointerout', lobjet_pointerout, false);

    const gallery_title_el = document.getElementById('gallery-title');
    gallery_title_el.innerHTML =
        '<span style="font-size: larger">' + gallery_title + '</span>';
    create_thumbnails(); // is async
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
    const x = canvas.width / 2;
    const y = canvas.height / 2;
    const ctx = canvas.getContext('2d');
    const image_data = ctx.getImageData(x, y, 100, 1);
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
    const backing_canvas = document.getElementById('backing');
    const canvas = document.getElementById('photo');
    let backing_ctx;
    if (backing_canvas.getContext) {
        backing_ctx = backing_canvas.getContext('2d');
    }
    photo_box = document.getElementById('lobjet_pane');
    backing_canvas.width = photo_box.clientWidth;
    backing_canvas.height = photo_box.clientHeight;
    const image = new Image();

    image.onload = function () {
        let scale = Math.min(backing_canvas.width / image.width, backing_canvas.height / image.height);
        let h_pad = (backing_canvas.width - image.width * scale) / 2.0;
        let v_pad = (backing_canvas.height - image.height * scale) / 2.0;

        let size = document.getElementById('size');
        size.innerHTML = '' +
            image.width + ' x ' + image.height;
        const filename = document.getElementById('filename');

        //
        // Update: Nope to this below, blob URLs seem like the right way
        //
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
 
        //
        // TBD
        // So this is the outline of a way to do this, which works as a way to efficiently
        // provide a download link to a canvas that has its size and attributes controlled.
        // Obvious shortcomings: Both backing_canvas and canvas are padded with fill :)
        //   so we need another canvas with the proper scaled and stegged image
        // Needs a proper filename for the save file
        // Maybe innerHTML is crude, maybe not, probably makes no difference, definitely
        // easier to read
        //
        // Ultimately, this is much more like what we need, and it's already written in
        // Rust ....
        // https://github.com/iwanders/spread_spectrum_watermarking
        /* 
        canvas.toBlob((blob) => {
            const blob_url  = URL.createObjectURL(blob);
            filename.innerHTML =
                '<a target="_blank" href="' + images[current_index] + '">' +
                '<span style="font-size: smaller">view 👁️</span>' +
                '</a> ' +
                '<a download href="' + images[current_index] + '">' +
                '<span style="font-size: smaller">download ⤵️</span>' +
                '</a> ' +
                '<a download href="' + blob_url + '">' +
                '<span style="font-size: smaller">download ⤵️</span>' +
                '</a>';
        })
        */
    }
    image.crossOrigin = "";
    image.src = images[current_index];
}