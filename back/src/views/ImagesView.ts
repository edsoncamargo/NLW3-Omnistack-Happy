import Image from "../models/Image";

export default {
    render(image: Image) {
        return {
            id: image.id,
            url: `http://192.168.15.33:3333/uploads/${image.path}`
        };
    },
    renderAll(images: Image[]) {
        return images.map(image => this.render(image));
    }
}