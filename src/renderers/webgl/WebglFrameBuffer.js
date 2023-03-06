// 帧缓冲区
class WebglFrameBuffer {
  constructor(gl, config) {
    this._gl = gl
    this._config = config

    this.framebuffer = null
  }

  getFramebuffer() {
    let framebuffer, texture, depthBuffer

    framebuffer = this.framebuffer
    if (framebuffer) {
      return framebuffer
    }

    // Define the error handling function
    const error = function () {
      if (framebuffer) this._gl.deleteFramebuffer(framebuffer)
      if (texture) this._gl.deleteTexture(texture)
      if (depthBuffer) this._gl.deleteRenderbuffer(depthBuffer)
      return null
    }

    // Create a frame buffer object (FBO)
    framebuffer = this._gl.createFramebuffer()
    if (!framebuffer) {
      console.log('Failed to create frame buffer object')
      return error()
    }

    // Create a texture object and set its size and parameters
    texture = this._gl.createTexture() // Create a texture object
    if (!texture) {
      console.log('Failed to create texture object')
      return error()
    }
    this._gl.bindTexture(this._gl.TEXTURE_2D, texture) // Bind the object to target
    this._gl.texImage2D(
      this._gl.TEXTURE_2D,
      0,
      this._gl.RGBA,
      this._config.OFFSCREEN_WIDTH,
      this._config.OFFSCREEN_HEIGHT,
      0,
      this._gl.RGBA,
      this._gl.UNSIGNED_BYTE,
      null
    )
    this._gl.texParameteri(
      this._gl.TEXTURE_2D,
      this._gl.TEXTURE_MIN_FILTER,
      this._gl.LINEAR
    )
    framebuffer.texture = texture // Store the texture object

    // Create a renderbuffer object and Set its size and parameters
    depthBuffer = this._gl.createRenderbuffer() // Create a renderbuffer object
    if (!depthBuffer) {
      console.log('Failed to create renderbuffer object')
      return error()
    }
    this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, depthBuffer) // Bind the object to target
    this._gl.renderbufferStorage(
      this._gl.RENDERBUFFER,
      this._gl.DEPTH_COMPONENT16,
      this._config.OFFSCREEN_WIDTH,
      this._config.OFFSCREEN_HEIGHT
    )

    // Attach the texture and the renderbuffer object to the FBO
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, framebuffer)
    this._gl.framebufferTexture2D(
      this._gl.FRAMEBUFFER,
      this._gl.COLOR_ATTACHMENT0,
      this._gl.TEXTURE_2D,
      texture,
      0
    )
    this._gl.framebufferRenderbuffer(
      this._gl.FRAMEBUFFER,
      this._gl.DEPTH_ATTACHMENT,
      this._gl.RENDERBUFFER,
      depthBuffer
    )

    // Check if FBO is configured correctly
    const e = this._gl.checkFramebufferStatus(this._gl.FRAMEBUFFER)
    if (this._gl.FRAMEBUFFER_COMPLETE !== e) {
      console.log('Frame buffer object is incomplete: ' + e.toString())
      return error()
    }

    this.framebuffer = framebuffer

    // Unbind the buffer object
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null)
    this._gl.bindTexture(this._gl.TEXTURE_2D, null)
    this._gl.bindRenderbuffer(this._gl.RENDERBUFFER, null)

    return framebuffer
  }
}

export { WebglFrameBuffer }
