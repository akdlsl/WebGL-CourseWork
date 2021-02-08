export class Texture {

    private loadImage(url: string) {
        return await new Promise((resolve, reject) => {
            var image = new Image()
            image.src = url
            image.onload = () => resolve(image)
            image.onerror = () => reject(new Error('could not load image'))
        })
    }
}
