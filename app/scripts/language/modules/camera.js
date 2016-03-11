let camera;

navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

function onStreamReady(stream) {
    let streaming = false,
        vendorURL = window.URL || window.webkitURL;
    camera.stream = stream;
    if (!camera.video) {
        camera.video = document.createElement('video');
        camera.video.style.display = 'none';
    }
    if (!camera.canvas) {
        camera.canvas = document.createElement('canvas');
        camera.canvas.style.display = 'none';
    }
    if (navigator.mozGetUserMedia) {
        camera.video.mozSrcObject = this.stream;
    } else {
        camera.video.src = vendorURL.createObjectURL(camera.stream);
    }
    camera.video.play();
    camera.video.addEventListener('canplay', (ev) => {
        if (!streaming) {
            camera.height = camera.video.videoHeight /
                            (camera.video.videoWidth / camera.width);

            // Firefox currently has a bug where the height can't be read from
            // the video, so we will make assumptions if this happens.

            if (isNaN(camera.height)) {
                camera.height = camera.width / (4 / 3);
            }

            camera.video.setAttribute('width', camera.width);
            camera.video.setAttribute('height', camera.height);
            camera.canvas.setAttribute('width', camera.width);
            camera.canvas.setAttribute('height', camera.height);
            streaming = true;
        }
    }, false);
}

function onStreamError(e) {
    console.error(e);
}

export default camera = {
    video: null,
    canvas: null,
    stream: null,
    width: 300,
    height: 0,
    methods: {
        takePicture () {
            let context = camera.canvas.getContext('2d'),
                picture;
            context.drawImage(camera.video, 0, 0, camera.width, camera.height);
            picture = camera.canvas.toDataURL();
            return Promise.resolve(picture);
        },
        getVideoStream () {
            return Promise.resolve(camera.stream);
        }
    },
    lifecycle: {
        stop () {
            camera.video.pause();
            camera.stream.getVideoTracks()[0].stop();
        },
        start () {
            navigator.getUserMedia.call(navigator, {
                    video: true
                }, onStreamReady, onStreamError);
        }
    }
};
