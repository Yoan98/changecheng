import { ObjectBase } from './ObjectBase';

class Scene extends ObjectBase{
  constructor(){
    super()

    this.type = 'scene';
  }
}

export { Scene}