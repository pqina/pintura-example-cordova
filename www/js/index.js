/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

// Wait for the deviceready event before using any of Cordova's device APIs.
// See https://cordova.apache.org/docs/en/latest/cordova/events/events.html#deviceready
document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // Cordova is now initialized. Have fun!

    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);

    document.getElementById('deviceready').classList.add('ready');

    console.log('Logging native PQINA File API backup vs Cordova File API');

    console.log(window.__pqina_webapi__ && window.__pqina_webapi__.File, File);

    setupEventHandlers();
}

function toJPEGDataURI(base64Str) {
    return 'data:image/jpeg;base64,' + base64Str;
}

// https://stackoverflow.com/questions/12168909/blob-from-dataurl
function dataURIToBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);

    // create a view into the buffer
    var ia = new Uint8Array(ab);

    // set the bytes of the buffer to the correct values
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    return new Blob([ab], { type: mimeString });
}

function setupEventHandlers() {
    console.log('Setting up event handlers');

    // cordova.plugins.diagnostic.isCameraAvailable((res) => {
    //     console.log('isCameraAvailable', res);
    // });

    // cordova.plugins.diagnostic.isCameraAuthorized((res) => {
    //     console.log('isCameraAuthorized', res);
    // });

    // cordova.plugins.diagnostic.getCameraAuthorizationStatus((res) => {
    //     console.log('getCameraAuthorizationStatus', res);
    // });

    // cordova.plugins.diagnostic.isCameraRollAuthorized((res) => {
    //     console.log('isCameraRollAuthorized', res);
    // });

    // cordova.plugins.diagnostic.getCameraRollAuthorizationStatus((res) => {
    //     console.log('getCameraRollAuthorizationStatus', res);
    // });

    // cordova.plugins.diagnostic.getCameraRollAuthorizationStatus((res) => {
    //     console.log('getCameraRollAuthorizationStatus', res);
    // });

    document.querySelector('.library-image').addEventListener('click', () => {
        // cordova.plugins.diagnostic.requestCameraRollAuthorization(
        //     () => {
        //         console.log('requestCameraRollAuthorization success');
        //     },
        //     () => {
        //         console.log('requestCameraRollAuthorization error');
        //     }
        // );

        console.log('Select image from photo library');

        navigator.camera.getPicture(
            (base64Str) => {
                console.log('success base64Str', base64Str.substring(0, 40));

                const dataURI = toJPEGDataURI(base64Str);

                console.log('success dataURI', dataURI.substring(0, 40));

                const blob = dataURIToBlob(dataURI);

                console.log('success blob', blob);

                editImage(blob);
            },
            (err) => {
                console.log('error', err);
            },
            {
                quality: 50,
                mediaType: Camera.MediaType.PICTURE,
                encodingType: Camera.EncodingType.JPEG,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
            }
        );
    });

    document.querySelector('.camera-image').addEventListener('click', () => {
        console.log('Select image from camera');

        // cordova.plugins.diagnostic.requestCameraAuthorization(
        //     () => {
        //         console.log('requestCameraAuthorization success');
        //     },
        //     () => {
        //         console.log('requestCameraAuthorization error');
        //     }
        // );

        navigator.camera.getPicture(
            (base64Str) => {
                console.log('success base64Str', base64Str.substring(0, 40));

                const dataURI = toJPEGDataURI(base64Str);

                console.log('success dataURI', dataURI.substring(0, 40));

                const blob = dataURIToBlob(dataURI);

                console.log('success blob', blob);

                editImage(blob);
            },
            (err) => {
                console.log('error', err);
            },
            {
                quality: 50,
                mediaType: Camera.MediaType.PICTURE,
                encodingType: Camera.EncodingType.JPEG,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.CAMERA,
            }
        );
    });

    document.querySelector('.local-image').addEventListener('click', () => {
        editImage('./image.jpeg');
    });

    console.log('Awaiting interaction');

    // Example using processImage
    // window.pintura
    //     .processImage('./image.jpeg', {
    //         imageReader: window.pintura.createDefaultImageReader(),
    //         imageWriter: window.pintura.createDefaultImageWriter({
    //             mimeType: 'image/jpeg',
    //             targetSize: { width: 3000, height: 3000 },
    //             upscale: false,
    //         }),
    //     })
    //     .then((res) => {
    //         console.log('dest', res);
    //         document.querySelector('.result').setAttribute('src', URL.createObjectURL(res.dest));
    //     });
}

const editImage = (src) => {
    const { openDefaultEditor } = window.pintura;

    console.log('Opening editor');

    const editor = openDefaultEditor({
        src,

        // set these to false as only needed in Safari browser
        preventScrollBodyIfNeeded: false,
        preventFooterOverlapIfNeeded: false,
    });

    editor.on('loaderror', console.log);

    editor.on('load', (res) => {
        console.log('load', res);
    });

    editor.on('process', (res) => {
        document.querySelector('.result').setAttribute('src', URL.createObjectURL(res.dest));
    });
};
