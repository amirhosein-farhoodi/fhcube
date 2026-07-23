import { useLoader } from "@react-three/fiber";
import { forwardRef, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { SCENE_CONFIG } from "../../../constants/scene";

function makeHoledWall(
  width: number,
  height: number,
  radius: number,
  segments: number,
) {
  const shape = new THREE.Shape();
  shape.moveTo(-width / 2, -height / 2);
  shape.lineTo(width / 2, -height / 2);
  shape.lineTo(width / 2, height / 2);
  shape.lineTo(-width / 2, height / 2);
  shape.lineTo(-width / 2, -height / 2);

  const hole = new THREE.Path();
  hole.absarc(0, 0, radius, 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geo = new THREE.ShapeGeometry(shape, segments);
  const pos = geo.attributes.position;
  const uv = geo.attributes.uv;
  for (let i = 0; i < pos.count; i++) {
    uv.setXY(i, pos.getX(i) / width + 0.5, pos.getY(i) / height + 0.5);
  }
  uv.needsUpdate = true;
  return geo;
}

const { SIZE, HALF, FLOOR_Y, CEILING_Y, CENTER_Y, WALL_INSET, WALL_THICKNESS } =
  SCENE_CONFIG.ROOM;
const WINDOW = SCENE_CONFIG.WINDOW;
const { WALL } = SCENE_CONFIG.SURFACES;
const { SHOW_WALLS } = SCENE_CONFIG.DEBUG;

export const Ground = forwardRef<THREE.Group>(function Ground(_, ref) {
  const groundRef = useRef<THREE.Mesh>(null);
  const rootRef = useRef<THREE.Group | null>(null);

  const setRootRef = (g: THREE.Group | null) => {
    rootRef.current = g;
    if (typeof ref === "function") ref(g);
    else if (ref) ref.current = g;
  };

  useEffect(() => {
    rootRef.current?.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) obj.castShadow = true;
    });
  }, []);

  const floorMap = useLoader(
    THREE.TextureLoader,
    "/textures/ground/mdf/black-painted-planks-diff.webp",
  );
  floorMap.colorSpace = THREE.SRGBColorSpace;

  const [outerMap, outerNormalMap, wallNormalMap, wallColorMap] = useLoader(
    THREE.TextureLoader,
    [
      "/textures/wall-outside/dirt-window-stains-col.webp",
      "/textures/wall-outside/dirt-window-stains-nrm.webp",
      WALL.NORMAL_MAP,
      WALL.MAP,
    ],
  );

  floorMap.wrapS = THREE.RepeatWrapping;
  floorMap.wrapT = THREE.RepeatWrapping;
  floorMap.repeat.set(4, 4);
  floorMap.anisotropy = 16;

  [outerMap, outerNormalMap].forEach((texture) => {
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(2, 2);
  });

  wallNormalMap.wrapS = THREE.RepeatWrapping;
  wallNormalMap.wrapT = THREE.RepeatWrapping;
  wallNormalMap.repeat.set(WALL.NORMAL_REPEAT, WALL.NORMAL_REPEAT);
  wallNormalMap.anisotropy = 16;

  wallColorMap.colorSpace = THREE.SRGBColorSpace;
  wallColorMap.wrapS = THREE.RepeatWrapping;
  wallColorMap.wrapT = THREE.RepeatWrapping;
  wallColorMap.repeat.set(WALL.MAP_REPEAT, WALL.MAP_REPEAT);
  wallColorMap.anisotropy = 16;

  const wallInset = HALF - WALL_INSET;
  const t = WALL_THICKNESS;
  const ext = HALF + t;
  const cubeY0 = FLOOR_Y - t;
  const cubeY1 = CEILING_Y + t;
  const cubeSize = 2 * ext;
  const revealSpan = ext - wallInset;
  const revealCenterX = (wallInset + ext) / 2;

  const interiorWallGeo = useMemo(
    () => makeHoledWall(SIZE, SIZE, WINDOW.RADIUS, WINDOW.SEGMENTS),
    [],
  );
  const exteriorWallGeo = useMemo(
    () => makeHoledWall(cubeSize, SIZE, WINDOW.RADIUS, WINDOW.SEGMENTS),
    [cubeSize],
  );

  const innerMatProps = {
    map: wallColorMap,
    color: WALL.TINT,
    normalMap: wallNormalMap,
    normalScale: new THREE.Vector2(WALL.NORMAL_SCALE, WALL.NORMAL_SCALE),
    metalness: WALL.METALNESS,
    roughness: WALL.ROUGHNESS,
  };

  const outerMatProps = {
    map: outerMap,
    normalMap: outerNormalMap,
    color: "#d8d0c4",
    roughness: 0.85,
  };

  const thicknessMatProps = {
    color: "#0a0a0c",
    roughness: 1,
    metalness: 0,
  };

  const setLayer1 = (self: THREE.Object3D) => self.layers.set(1);

  return (
    <group ref={setRootRef}>

      <mesh
        ref={groundRef}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, FLOOR_Y, 0]}
        receiveShadow
      >
        <planeGeometry args={[SIZE, SIZE]} />
        <meshStandardMaterial map={floorMap} metalness={0.05} roughness={0.75} />
      </mesh>

      {SHOW_WALLS && (
        <>
      <mesh position={[0, CENTER_Y, -wallInset]} receiveShadow>
        <planeGeometry args={[SIZE, SIZE]} />
        <meshStandardMaterial {...innerMatProps} />
      </mesh>

      <mesh
        position={[-wallInset, CENTER_Y, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
      >
        <planeGeometry args={[SIZE, SIZE]} />
        <meshStandardMaterial {...innerMatProps} />
      </mesh>

      <mesh
        geometry={interiorWallGeo}
        position={[wallInset, CENTER_Y, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
      >
        <meshStandardMaterial {...innerMatProps} />
      </mesh>

      <mesh
        position={[revealCenterX, WINDOW.CENTER_Y, 0]}
        rotation={[0, 0, Math.PI / 2]}
      >
        <cylinderGeometry
          args={[
            WINDOW.RADIUS,
            WINDOW.RADIUS,
            revealSpan,
            WINDOW.SEGMENTS,
            1,
            true,
          ]}
        />
        <meshStandardMaterial {...thicknessMatProps} side={THREE.DoubleSide} />
      </mesh>

      <mesh
        position={[0, CENTER_Y, wallInset]}
        rotation={[0, Math.PI, 0]}
        receiveShadow
      >
        <planeGeometry args={[SIZE, SIZE]} />
        <meshStandardMaterial {...innerMatProps} />
      </mesh>

      <mesh
        position={[0, CEILING_Y, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry args={[SIZE, SIZE]} />
        <meshStandardMaterial {...innerMatProps} />
      </mesh>

      {(() => {
        const { COLOR, HEIGHT: th, PROTRUSION: pr } = SCENE_CONFIG.WALL_TRIM;
        const inner = wallInset;
        const strips: {
          pos: [number, number, number];
          args: [number, number, number];
        }[] = [];

        for (const y of [FLOOR_Y + th / 2, CEILING_Y - th / 2]) {
          strips.push({ pos: [0, y, -inner + pr / 2], args: [SIZE, th, pr] });
          strips.push({ pos: [0, y, inner - pr / 2], args: [SIZE, th, pr] });
          strips.push({ pos: [-inner + pr / 2, y, 0], args: [pr, th, SIZE] });
          strips.push({ pos: [inner - pr / 2, y, 0], args: [pr, th, SIZE] });
        }
        return strips.map((s, i) => (
          <mesh key={i} position={s.pos} receiveShadow>
            <boxGeometry args={s.args} />
            <meshStandardMaterial color={COLOR} roughness={1} metalness={0} />
          </mesh>
        ));
      })()}

      <mesh
        position={[0, cubeY0, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        receiveShadow
        onUpdate={setLayer1}
      >
        <planeGeometry args={[cubeSize, cubeSize]} />
        <meshStandardMaterial {...outerMatProps} />
      </mesh>

      <mesh
        position={[0, cubeY1, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
        onUpdate={setLayer1}
      >
        <planeGeometry args={[cubeSize, cubeSize]} />
        <meshStandardMaterial {...outerMatProps} />
      </mesh>

      <mesh
        position={[0, (cubeY0 + FLOOR_Y) / 2, ext]}
        receiveShadow
        onUpdate={setLayer1}
      >
        <planeGeometry args={[cubeSize, t]} />
        <meshStandardMaterial {...thicknessMatProps} />
      </mesh>
      <mesh position={[0, CENTER_Y, ext]} receiveShadow onUpdate={setLayer1}>
        <planeGeometry args={[cubeSize, SIZE]} />
        <meshStandardMaterial {...outerMatProps} />
      </mesh>
      <mesh
        position={[0, (CEILING_Y + cubeY1) / 2, ext]}
        receiveShadow
        onUpdate={setLayer1}
      >
        <planeGeometry args={[cubeSize, t]} />
        <meshStandardMaterial {...thicknessMatProps} />
      </mesh>

      <mesh
        position={[-ext, (cubeY0 + FLOOR_Y) / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
        onUpdate={setLayer1}
      >
        <planeGeometry args={[cubeSize, t]} />
        <meshStandardMaterial {...thicknessMatProps} />
      </mesh>
      <mesh
        position={[-ext, CENTER_Y, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
        onUpdate={setLayer1}
      >
        <planeGeometry args={[cubeSize, SIZE]} />
        <meshStandardMaterial {...outerMatProps} />
      </mesh>
      <mesh
        position={[-ext, (CEILING_Y + cubeY1) / 2, 0]}
        rotation={[0, -Math.PI / 2, 0]}
        receiveShadow
        onUpdate={setLayer1}
      >
        <planeGeometry args={[cubeSize, t]} />
        <meshStandardMaterial {...thicknessMatProps} />
      </mesh>

      <mesh
        position={[ext, (cubeY0 + FLOOR_Y) / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
        onUpdate={setLayer1}
      >
        <planeGeometry args={[cubeSize, t]} />
        <meshStandardMaterial {...thicknessMatProps} />
      </mesh>
      <mesh
        position={[ext, (CEILING_Y + cubeY1) / 2, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
        onUpdate={setLayer1}
      >
        <planeGeometry args={[cubeSize, t]} />
        <meshStandardMaterial {...thicknessMatProps} />
      </mesh>
      <mesh
        geometry={exteriorWallGeo}
        position={[ext, CENTER_Y, 0]}
        rotation={[0, Math.PI / 2, 0]}
        receiveShadow
        onUpdate={setLayer1}
      >
        <meshStandardMaterial {...outerMatProps} />
      </mesh>

      {(() => {
        const zc = -(wallInset + ext) / 2;
        const depth = revealSpan;
        return (
          <>
            <mesh
              position={[0, (CEILING_Y + cubeY1) / 2, zc]}
              receiveShadow
              onUpdate={setLayer1}
            >
              <boxGeometry args={[cubeSize, t, depth]} />
              <meshStandardMaterial {...thicknessMatProps} />
            </mesh>
            <mesh
              position={[0, (cubeY0 + FLOOR_Y) / 2, zc]}
              receiveShadow
              onUpdate={setLayer1}
            >
              <boxGeometry args={[cubeSize, t, depth]} />
              <meshStandardMaterial {...thicknessMatProps} />
            </mesh>
            <mesh
              position={[-(ext + wallInset) / 2, CENTER_Y, zc]}
              receiveShadow
              onUpdate={setLayer1}
            >
              <boxGeometry args={[revealSpan, SIZE, depth]} />
              <meshStandardMaterial {...thicknessMatProps} />
            </mesh>
            <mesh
              position={[(ext + wallInset) / 2, CENTER_Y, zc]}
              receiveShadow
              onUpdate={setLayer1}
            >
              <boxGeometry args={[revealSpan, SIZE, depth]} />
              <meshStandardMaterial {...thicknessMatProps} />
            </mesh>
          </>
        );
      })()}
        </>
      )}
    </group>
  );
});
