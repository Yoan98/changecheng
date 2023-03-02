class TextureLoader {
  constructor() {}

  load(imgSrc) {
    const image = new Image()

    image.src = imgSrc

    image.onload = () => {}

    return image
  }
}

export { TextureLoader }
