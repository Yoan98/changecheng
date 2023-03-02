class WebglTexture {
  constructor(gl) {
    this._gl = gl

    this.textureWeakMap = new WeakMap()
  }

  loadTexture(meshObject) {
    let glTexture = this.textureWeakMap.get(meshObject)

    if (glTexture) {
      return
    }

    glTexture = this._gl.createTexture()
    if (!glTexture) {
      console.log('Failed to create the texture object')
      return null
    }

    this.textureWeakMap.set(meshObject, glTexture)

    const image = meshObject.material.map

    this._gl.pixelStorei(this._gl.UNPACK_FLIP_Y_WEBGL, 1) // Flip the image's y-axis

    this._gl.activeTexture(this._gl.TEXTURE0)

    // Bind the texture object to the target
    this._gl.bindTexture(this._gl.TEXTURE_2D, glTexture)

    // Set texture parameters
    this._gl.texParameteri(
      this._gl.TEXTURE_2D,
      this._gl.TEXTURE_MIN_FILTER,
      this._gl.LINEAR
    )
    // Set the image to texture
    this._gl.texImage2D(
      this._gl.TEXTURE_2D,
      0,
      this._gl.RGBA,
      this._gl.RGBA,
      this._gl.UNSIGNED_BYTE,
      image
    )
  }
}

export { WebglTexture }
