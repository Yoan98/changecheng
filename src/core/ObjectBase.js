class ObjectBase {
  constructor() {

    this.children = []
  }

  add(object){
    this.children.push(object)
  }
}

export { ObjectBase }
