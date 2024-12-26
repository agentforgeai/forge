import React, { useMemo, useRef } from "react";
import vertexShader from "./vertexShader";
import fragmentShader from "./fragmentShader";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import { OrbitControls } from "@react-three/drei";

export const Blob = () => {
  const mesh = useRef();
  const hover = useRef(false);
  const uniforms = useMemo(() => ({
    u_time: { value: 0 },
    u_intensity: { value: 0.3 },
  }), []); // اضافه کردن آرایه وابستگی‌ها

  useFrame((state) => {
    const { clock } = state;
    if (mesh.current) {
      mesh.current.rotation.x += 0.005;
      mesh.current.rotation.y += 0.005;

      mesh.current.material.uniforms.u_time.value =
        0.4 * clock.getElapsedTime();

      mesh.current.material.uniforms.u_intensity.value = MathUtils.lerp(
        mesh.current.material.uniforms.u_intensity.value,
        hover.current ? 1 : 0.15,
        0.02
      );
    }
  });

  return (
    <>
      <OrbitControls enableZoom={false} />
      <mesh
        ref={mesh}
        scale={1.7}
        position={[0, 0, 0]}
        onPointerOver={() => (hover.current = true)}
        onPointerOut={() => (hover.current = false)}
      >
        <icosahedronGeometry args={[2, 20]} />
        <shaderMaterial
          wireframe={true}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
        />
      </mesh>
    </>
  );
};
