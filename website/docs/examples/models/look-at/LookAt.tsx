import React, { FC, Suspense, useEffect, useRef, useState } from 'react'

// import "@babylonjs/inspector";
import { Color3 } from '@babylonjs/core/Maths/math.color'
import { Vector3 } from '@babylonjs/core/Maths/math.vector'
import { AbstractMesh } from '@babylonjs/core/Meshes/abstractMesh'
import '@babylonjs/loaders/glTF'
import { Engine, ILoadedModel, Model, Scene } from 'react-babylonjs'

type LookAtModelProps = {
  lookAtPosition: Vector3
  position: Vector3
  id: string
}

const LookAtModel: FC<LookAtModelProps> = ({ lookAtPosition, position, id }) => {
  let baseUrl = 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/'

  const modelRef = useRef<AbstractMesh | null>(null)

  const onModelLoaded = (model: ILoadedModel) => {
    modelRef.current = model.rootMesh!
    modelRef.current.lookAt(lookAtPosition.clone())
  }

  useEffect(() => {
    if (modelRef.current) {
      modelRef.current.lookAt(lookAtPosition)
    }
  }, [lookAtPosition])

  return (
    <Suspense fallback={<box name="fallback" position={position} />}>
      <Model
        name="Avocado"
        rootUrl={`${baseUrl}Avocado/glTF/`}
        sceneFilename={`Avocado.gltf?id=${id}`}
        scaleToDimension={1}
        position={position}
        onModelLoaded={onModelLoaded}
      />
    </Suspense>
  )
}

const LookAt: FC = () => {
  const [lookAtPosition, setLookAtPosition] = useState(Vector3.Zero())

  return (
    <>
      <div style={{ flex: 1, display: 'flex' }}>
        <button
          className="btn btn-primary m-2"
          onClick={() =>
            setLookAtPosition(
              new Vector3(0, lookAtPosition.y >= 2 ? -2 : lookAtPosition.y + 0.5, 0)
            )
          }
        >
          Look Up, Down
        </button>
      </div>
      <div style={{ flex: 1, display: 'flex' }}>
        <Engine antialias adaptToDeviceRatio canvasId="babylonJS">
          <Scene>
            <arcRotateCamera
              name="camera1"
              alpha={Math.PI / 2}
              beta={Math.PI / 2}
              radius={9.0}
              target={Vector3.Zero()}
              minZ={0.001}
            />
            <icoSphere name={'target'} radius={0.2} flat subdivisions={1} position={lookAtPosition}>
              <standardMaterial
                name={`target-mat`}
                diffuseColor={Color3.Red()}
                specularColor={Color3.Black()}
              />
            </icoSphere>
            <hemisphericLight name="light1" intensity={0.7} direction={Vector3.Up()} />
            <LookAtModel lookAtPosition={lookAtPosition} position={new Vector3(3, 0, 3)} id="1" />
            <LookAtModel lookAtPosition={lookAtPosition} position={new Vector3(-3, 0, -3)} id="2" />
          </Scene>
        </Engine>
      </div>
    </>
  )
}

export default LookAt
