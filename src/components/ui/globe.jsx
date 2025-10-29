"use client";
import { useEffect, useRef, useState } from "react";
import { Color, Scene, Fog, PerspectiveCamera, Vector3 } from "three";
import ThreeGlobe from "three-globe";
import { useThree, Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import countries from "@/app/data/globe.json";

const RING_PROPAGATION_SPEED = 3;
const cameraZ = 300;

export function Globe({ globeConfig, data }) {
  const globeRef = useRef();
  const groupRef = useRef();
  const [isInitialized, setIsInitialized] = useState(false);

  const defaultProps = {
    pointSize: 1,
    atmosphereColor: "#ffffff",
    showAtmosphere: true,
    atmosphereAltitude: 0.1,
    polygonColor: "rgba(255,255,255,0.7)",
    globeColor: "#1d072e",
    emissive: "#000000",
    emissiveIntensity: 0.1,
    shininess: 2,
    arcTime: 2000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    ...globeConfig,
  };

  useEffect(() => {
    if (!globeRef.current && groupRef.current) {
      globeRef.current = new ThreeGlobe();
      groupRef.current.add(globeRef.current);
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    if (!globeRef.current || !isInitialized) return;

    const globeMaterial = globeRef.current.globeMaterial();
    globeMaterial.color = new Color(defaultProps.globeColor);
    globeMaterial.emissive = new Color(defaultProps.emissive);
    globeMaterial.emissiveIntensity = defaultProps.emissiveIntensity;
    globeMaterial.shininess = defaultProps.shininess;
  }, [isInitialized]);

  useEffect(() => {
    if (!globeRef.current || !isInitialized || !data) return;

    const arcs = data.slice(0, 100); // Limit for performance
    const points = [];

    arcs.forEach((arc) => {
      points.push(
        {
          size: defaultProps.pointSize,
          color: arc.color,
          lat: arc.startLat,
          lng: arc.startLng,
        },
        {
          size: defaultProps.pointSize,
          color: arc.color,
          lat: arc.endLat,
          lng: arc.endLng,
        }
      );
    });

    globeRef.current
      .hexPolygonsData(countries.features)
      .hexPolygonResolution(2) // Lowered for performance
      .hexPolygonMargin(0.7)
      .showAtmosphere(defaultProps.showAtmosphere)
      .atmosphereColor(defaultProps.atmosphereColor)
      .atmosphereAltitude(defaultProps.atmosphereAltitude)
      .hexPolygonColor(() => defaultProps.polygonColor);

    // globeRef.current
    //   .arcsData(arcs)
    //   .arcStartLat((d) => d.startLat)
    //   .arcStartLng((d) => d.startLng)
    //   .arcEndLat((d) => d.endLat)
    //   .arcEndLng((d) => d.endLng)
    //   .arcColor((e) => e.color)
    //   .arcAltitude((e) => e.arcAlt || 0.3)
    //   .arcStroke(() => 0.3)
    //   .arcDashLength(defaultProps.arcLength)
    //   .arcDashInitialGap((e) => e.order || 0)
    //   .arcDashGap(15)
    //   .arcDashAnimateTime(() => defaultProps.arcTime);

    // globeRef.current
    //   .pointsData(points)
    //   .pointColor((e) => e.color)
    //   .pointsMerge(true)
    //   .pointAltitude(0)
    //   .pointRadius(1.5);
  }, [isInitialized, data]);

  return <group ref={groupRef} />;
}

export function WebGLRendererConfig() {
  const { gl, size } = useThree();
  useEffect(() => {
    gl.preserveDrawingBuffer = false;
    gl.setPixelRatio(window.devicePixelRatio);
    gl.setSize(size.width, size.height);
    gl.setClearColor(0xffaaff, 0);
  }, []);
  return null;
}

export function World({ globeConfig, data }) {
  const scene = new Scene();
  scene.fog = new Fog(0xffffff, 400, 2000);
  return (
    <Canvas
      className="aspect-[1/1] "
      scene={scene}
      camera={new PerspectiveCamera(50, 1.2, 180, 1800)}
    >
      <WebGLRendererConfig />
      <ambientLight color={globeConfig.ambientLight} intensity={0.6} />
      <directionalLight
        color={globeConfig.directionalLeftLight}
        position={new Vector3(-400, 100, 400)}
      />
      <directionalLight
        color={globeConfig.directionalTopLight}
        position={new Vector3(-200, 500, 200)}
      />
      <pointLight
        color={globeConfig.pointLight}
        position={new Vector3(-200, 500, 200)}
        intensity={0.8}
      />
      <Globe globeConfig={globeConfig} data={data} />
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minDistance={cameraZ}
        maxDistance={cameraZ}
        autoRotateSpeed={1}
        autoRotate
        minPolarAngle={Math.PI / 3.5}
        maxPolarAngle={Math.PI - Math.PI / 3}
      />
    </Canvas>
  );
}
