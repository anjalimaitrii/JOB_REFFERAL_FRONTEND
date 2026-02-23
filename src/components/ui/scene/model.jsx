import React, { useRef } from "react";
import { MeshTransmissionMaterial, useGLTF, Text } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";

export default function Model() {

  const { nodes } = useGLTF("/medias/torrus.glb");

  const { viewport } = useThree();

  const torus = useRef();

  useFrame(() => {
    if (torus.current) {
      torus.current.rotation.x += 0.02;
    }
  });

  return (
    <group scale={viewport.width / 2.75}>

     
      <mesh ref={torus} {...nodes.Torus002}>
        <MeshTransmissionMaterial
          thickness={0.2}
          roughness={0}
          transmission={1}
          ior={1.2}
          chromaticAberration={0.02}
          backside={true}
        />
      </mesh>

    </group>
  );
}

useGLTF.preload("/medias/torrus.glb");