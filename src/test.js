const DEFAULT_SPHERE_PARAMS = {
  radius: 1,
  widthSegments: 32,
  heightSegments: 16,
  phiStart: 0,
  phiLength: Math.PI * 2,
  thetaStart: 0,
  thetaLength: Math.PI
}

function createSphere(parameters = DEFAULT_SPHERE_PARAMS,material){

  let {widthSegments,heightSegments} = parameters

  widthSegments = Math.max( 3, Math.floor( widthSegments ) );
	heightSegments = Math.max( 2, Math.floor( heightSegments ) );

  return 1
}


console.log(createSphere())