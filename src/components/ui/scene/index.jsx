'use client';

import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import Model from "./Model.jsx";

export default function Index() {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Canvas>

        <ambientLight intensity={0.5} />

        <directionalLight
          intensity={2}
          position={[0, 2, 3]}
        />

        <Suspense fallback={null}>
          <Model />
          <Environment preset="city" />
        </Suspense>

      </Canvas>
    </div>
  );
}