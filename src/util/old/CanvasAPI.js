export class CanvasAPI {
    static createCardImage(url1, url2, text, textOptions) {
        return new Promise((resolve, reject) => {
            const img1 = new Image();
            const img2 = new Image();

            img1.crossOrigin = "Anonymous";
            img2.crossOrigin = "Anonymous";

            let loaded = 0;
            const onLoad = () => {
                if (++loaded === 2) {
                    resolve(CanvasAPI.mergeImages(img1, img2, text, textOptions));
                }
            };

            img1.onload = onLoad;
            img2.onload = onLoad;

            img1.onerror = reject;
            img2.onerror = reject;

            img1.src = url1;
            img2.src = url2;
        });
    }
    static mergeImages(img1, img2, text, textOptions) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = img1.width;
        canvas.height = img1.height;

        context.drawImage(img1, 0, 0, img1.width, img1.height);

        const xMin = 3;
        const yMin = 36;
        const xMax = 140;
        const yMax = 179;
        const maxWidth = xMax - xMin;
        const maxHeight = yMax - yMin;

        const scale = Math.min(maxWidth / img2.width, maxHeight / img2.height);
        const newWidth = img2.width * scale;
        const newHeight = img2.height * scale;
        const offsetX = xMin + (maxWidth - newWidth) / 2;
        const offsetY = yMin + (maxHeight - newHeight) / 2;

        context.drawImage(img2, offsetX, offsetY, newWidth, newHeight);

        if (text) {
            const { font = '20px Arial', color = 'black', align = 'center', baseline = 'middle' } = textOptions || {};
            context.font = font;
            context.fillStyle = color;
            context.textAlign = align;
            context.textBaseline = baseline;

            const textX = xMin + maxWidth / 2;
            const textY = yMin + maxHeight + 20; // Adjust Y position based on your requirement
            context.fillText(text, textX, textY);
        }

        const dataUrl = canvas.toDataURL('image/png');
        const blob = CanvasAPI.dataURLToBlob(dataUrl);
        return URL.createObjectURL(blob);
    }
    static dataURLToBlob(dataUrl) {
        const arr = dataUrl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], { type: mime });
    }
    static createCardImage2(url1, url2, text, textOptions) {
        return new Promise((resolve, reject) => {
            const img1 = new Image();
            const img2 = new Image();

            img1.crossOrigin = "Anonymous";
            img2.crossOrigin = "Anonymous";

            let loaded = 0;
            const onLoad = () => {
                if (++loaded === 2) {
                    resolve(CanvasAPI.mergeImagesV2(img1, img2, text, textOptions));
                }
            };

            img1.onload = onLoad;
            img2.onload = onLoad;

            img1.onerror = reject;
            img2.onerror = reject;

            img1.src = url1;
            img2.src = url2;
        });
    }

    static mergeImagesV2(img1, img2, text, textOptions) {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');

        canvas.width = img1.width;
        canvas.height = img1.height;

        context.drawImage(img1, 0, 0, img1.width, img1.height);

        const contentXMin = 4;
        const contentYMin = 4;
        const contentXMax = 216;
        const contentYMax = 144;
        const contentMaxWidth = contentXMax - contentXMin;
        const contentMaxHeight = contentYMax - contentYMin;

        const scale = Math.min(contentMaxWidth / img2.width, contentMaxHeight / img2.height);
        const newWidth = img2.width * scale;
        const newHeight = img2.height * scale;
        const offsetX = contentXMin + (contentMaxWidth - newWidth) / 2;
        const offsetY = contentYMin + (contentMaxHeight - newHeight) / 2;

        context.drawImage(img2, offsetX, offsetY, newWidth, newHeight);

        if (text) {
            const { font = '20px Arial', color = 'black', align = 'center', baseline = 'middle' } = textOptions || {};
            context.font = font;
            context.fillStyle = color;
            context.textAlign = align;
            context.textBaseline = baseline;

            const textXMin = 152;
            const textYMin = 111;
            const textXMax = 211;
            const textYMax = 139;
            const textMaxWidth = textXMax - textXMin;
            const textMaxHeight = textYMax - textYMin;

            const textX = textXMin + textMaxWidth / 2;
            const textY = textYMin + textMaxHeight / 2;
            context.fillText(text, textX, textY, textMaxWidth);
        }

        const dataUrl = canvas.toDataURL('image/png');
        const blob = CanvasAPI.dataURLToBlob(dataUrl);
        return URL.createObjectURL(blob);
    }
}