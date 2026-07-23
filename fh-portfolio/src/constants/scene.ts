const ROOM_SIZE = 3;
const ROOM_HALF = ROOM_SIZE / 2;
const ROOM_FLOOR_Y = -1;
const ROOM_CEILING_Y = ROOM_FLOOR_Y + ROOM_SIZE;
const ROOM_CENTER_Y = (ROOM_FLOOR_Y + ROOM_CEILING_Y) / 2;
const WALL_INSET = 0.01;
const WALL_THICKNESS = 0.06;

const COLS = 4;
const ROWS = 2;
const FRAME_BASE_SIZE = 0.22;
const FRAME_WIDTH_MULTIPLIER = 1.8;
const FRAME_HEIGHT_MULTIPLIER = 2;

const FRAME_GAP = 0.03;
const FRAME_W = FRAME_BASE_SIZE * FRAME_WIDTH_MULTIPLIER;
const FRAME_H = FRAME_BASE_SIZE * FRAME_HEIGHT_MULTIPLIER;
const PITCH_X = FRAME_W + FRAME_GAP;
const PITCH_Y = FRAME_H + FRAME_GAP;

const GRID_TOP = ((ROWS - 1) / 2) * PITCH_Y + FRAME_H / 2;
const GRID_BOTTOM = -GRID_TOP;

function buildFramePositions(): [number, number, number][] {
  const positions: [number, number, number][] = [];
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = (col - (COLS - 1) / 2) * PITCH_X;
      const y = ((ROWS - 1) / 2 - row) * PITCH_Y;
      positions.push([x, y, 0]);
    }
  }
  return positions;
}

export const SCENE_CONFIG = {
  ROOM: {
    SIZE: ROOM_SIZE,
    HALF: ROOM_HALF,
    FLOOR_Y: ROOM_FLOOR_Y,
    CEILING_Y: ROOM_CEILING_Y,
    CENTER_Y: ROOM_CENTER_Y,
    WALL_INSET,
    WALL_THICKNESS,
  },
  SURFACES: {
    WALL: {
      MAP: "/textures/wall/wall-texture.webp",
      MAP_REPEAT: 1,
      TINT: "#ffffff",
      NORMAL_MAP: "/textures/wall/wall-normal.webp",
      NORMAL_SCALE: 0.15,
      NORMAL_REPEAT: 3,
      METALNESS: 0,
      ROUGHNESS: 1,
    },
  },
  CAMERA: {
    FOV: 60,
    BACKGROUND_COLOR: "#070710",
  },
  PERFORMANCE: {
    MAX_DPR: { low: 1.5, medium: 1.75, high: 2 },
    ANTIALIAS: { low: false, medium: true, high: true },
    SHADOWS: { low: "soft", medium: "soft", high: "soft" },
    SHADOW_MAP_MAX: { low: 1024, medium: 2048, high: 8192 },
  },
  GESTURES: {
    SWIPE_MIN_DISTANCE: 50,
    SWIPE_HORIZONTAL_RATIO: 1.2,
  },
  NEBULA: {
    RADIUS: 120,
    BASE_COLOR: "#070710",
    COLOR_A: "#2f3a6b",
    COLOR_B: "#1f6f8c",
    COLOR_C: "#5a2f6b",
    SCALE: 4.0,
    INTENSITY: 0.35,
    SPEED: 0.01,
    FBM_OCTAVES: 5,
    FBM_OCTAVES_MEDIUM: 4,
    FBM_OCTAVES_LOW_POWER: 3,
  },
  LIGHTING: {
    CEILING_LAMP: {
      POSITION: [0, ROOM_CEILING_Y - 0.13, 0] as [number, number, number],
      INTENSITY: 2,
      COLOR: "#ffd6a5",
      DECAY: 1.4,
      DISTANCE: 6,
      SHADOW_MAP_SIZE: 2048,
    },
    MOONLIGHT: {
      POSITION: [-4, ROOM_CEILING_Y + 3, 0] as [number, number, number],
      TARGET: [0, ROOM_CENTER_Y, 0] as [number, number, number],
      INTENSITY: 4,
      COLOR: "#b8c8e0",
      SHADOW_MAP_SIZE: 2048,
      SHADOW_BOUNDS: 3.5,
      SHADOW_NEAR: 0.5,
      SHADOW_FAR: 15,
    },
    PET_RIM: {
      POSITION: [-0.55, 0.2, -0.4] as [number, number, number],
      TARGET: [-0.65, 0.1, 0.5] as [number, number, number],
      INTENSITY: 4,
      COLOR: "#cdd8ec",
      ANGLE: Math.PI,
      PENUMBRA: 0.9,
      DECAY: 2,
      DISTANCE: 2.6,
    },
    READING_LAMP: {
      POSITION: [0.52, 1.1, -0.13] as [number, number, number],
      TARGET: [0.5, 0.9, 0.05] as [number, number, number],
      INTENSITY: 5,
      COLOR: "#ffca7a",
      ANGLE: Math.PI / 1.6,
      PENUMBRA: 1,
      DECAY: 1,
      DISTANCE: 0.8,
      SHADOW_MAP_SIZE: 2,
    },
  },
  AREAS: {
    OVERVIEW: {
      name: "Overview",
      position: [-2.42, 1, -4.34] as [number, number, number],
      target: [0.3, 0.3, 0] as [number, number, number],
      componentPosition: [1, ROOM_FLOOR_Y, -1] as [number, number, number],
      minPolarAngle: 0,
      maxPolarAngle: Math.PI,
      mobileZoomOut: 0.5,
    },
    GALLERY: {
      name: "Gallery",
      position: [0, ROOM_CENTER_Y, 0] as [number, number, number],
      target: [-(ROOM_HALF - WALL_INSET), ROOM_CENTER_Y, 0] as [
        number,
        number,
        number,
      ],
      componentPosition: [0, 0, 0] as [number, number, number],
      minPolarAngle: 0,
      maxPolarAngle: Math.PI,
      mobileZoomOut: 0.1,
    },
    PORTFOLIO: {
      name: "Portfolio",
      position: [0, ROOM_CENTER_Y, 0] as [number, number, number],
      target: [0.3, 0.3, 1.0] as [number, number, number],
      componentPosition: [0.3, ROOM_FLOOR_Y, 1] as [number, number, number],
      minPolarAngle: 0,
      maxPolarAngle: Math.PI,
    },
    TOPOL: {
      name: "Topol",
      position: [0, 0.3, 0.2] as [number, number, number],
      target: [-0.55, 0.18, 1] as [number, number, number],
      componentPosition: [-0.55, ROOM_FLOOR_Y + 1.07, 1] as [
        number,
        number,
        number,
      ],
      minPolarAngle: 0,
      maxPolarAngle: Math.PI,
    },
    AVATAR: {
      name: "Avatar",
      position: [0, ROOM_CENTER_Y, 0] as [number, number, number],
      target: [1, 0.3, -1] as [number, number, number],
      componentPosition: [0, 0, 0] as [number, number, number],
      minPolarAngle: 0,
      maxPolarAngle: Math.PI,
    },
    WINDOW: {
      name: "Window",

      position: [0.55, ROOM_CENTER_Y, 0] as [number, number, number],
      target: [ROOM_HALF - WALL_INSET, ROOM_CENTER_Y, 0] as [
        number,
        number,
        number,
      ],
      componentPosition: [0, 0, 0] as [number, number, number],
      minPolarAngle: 0,
      maxPolarAngle: Math.PI,
      mobileZoomOut: 0.15,
    },
  },

  WALL_TRIM: {
    COLOR: "#1c1c20",
    HEIGHT: 0.05,
    PROTRUSION: 0.015,
  },

  WINDOW: {
    RADIUS: 0.5,
    CENTER_Y: ROOM_CENTER_Y,
    SEGMENTS: 64,
    FRAME_TUBE: 0.045,
    FRAME_COLOR: "#9aa3ad",
    FRAME_METALNESS: 0.95,
    FRAME_ROUGHNESS: 0.28,
  },

  MONITOR: {
    POSITION: [0, 1.3, -0.1] as [number, number, number],

    SCALE: [1, 1, 1] as [number, number, number],
    ROTATION: [-0.05, 0, 0] as [number, number, number],
  },
  LAPTOP_SCREEN: {
    POSITION: [-0.05, -0.235, -0.16] as [number, number, number],
    ROTATION: [-0.15, 0.3, 0.05] as [number, number, number],
    WIDTH: 0.48,
    HEIGHT: 0.3,
    PIXEL_WIDTH: 1280,
    PIXEL_HEIGHT: 800,
    ZOOM_DISTANCE: 0.42,
    ZOOM_DISTANCE_MOBILE: 0.85,
    HOVER_FRACTION: 0.22,
    HOVER_DURATION: 380,
    ZOOM_DURATION: 700,
    STATIC_IMAGE_URL: "/images/laptop-frame/os-screen.webp",
    STATIC_IMAGE_Z_OFFSET: 0.004,
    IFRAME_FADE_MS: 350,
    DEBUG_VISIBLE_BACKPLATE: false,
    DEBUG_BACKPLATE_COLOR: "#ff00aa",
  },

  GALLERY: {
    WALL_POSITION: [-(ROOM_HALF - WALL_INSET), ROOM_CENTER_Y, 0] as [
      number,
      number,
      number,
    ],
    WALL_ROTATION: [0, Math.PI / 2, 0] as [number, number, number],
    CAMERA_OFFSET: 0.4,
    CAMERA_OFFSET_MOBILE: 0.85,
    FRAME: {
      BASE_SIZE: FRAME_BASE_SIZE,

      WIDTH_MULTIPLIER: FRAME_WIDTH_MULTIPLIER,
      HEIGHT_MULTIPLIER: FRAME_HEIGHT_MULTIPLIER,

      MOLDING_WIDTH: 0.022,
      PROTRUSION: 0.034,
      MAT_RECESS: 0.016,
      MAT_PADDING: 0.026,
      MAT_COLOR: "#f4f0e8",
      COLORS: {
        DEFAULT: "#4A2D1B",
      },
      MATERIAL: {
        METALNESS: 0.1,
        ROUGHNESS: 0.6,
      },
      FILLET_WIDTH: 0.006,
      FILLET_DEPTH: 0.008,
      FILLET_COLOR: "#B08D57",
      FILLET_METALNESS: 0.9,
      FILLET_ROUGHNESS: 0.35,
    },
    LAMP: {
      GLOW_COLOR: "#ffd9a0",
      RADIUS: 0.014,
      Y: GRID_TOP + 0.07,
      Z: 0.1,

      MODEL_URL: "/models/gallery-lamp/gallery-lamp.glb",
      MODEL_POSITION: [0, 0.1, 0.03] as [number, number, number],
      MODEL_ROTATION: [0, 0, 0] as [number, number, number],
      MODEL_SCALE: [0.6, 0.4, 0.3] as [number, number, number],

      GLOW_WIDTH: 1.2,
      GLOW_HEIGHT: 0.06,
      GLOW_INTENSITY: 3,
      FILL_COLOR: "#ffdca8",
      FILL_INTENSITY: 3,
      FILL_DECAY: 2,
      FILL_DISTANCE: 5,
      FILL_OFFSET: 0.4,
    },

    LABEL: {
      TEXT: "MOMENTS, PLACES & PEOPLE THAT SHAPE ME.",
      PLATE_COLOR: "#241c16",
      PLATE_METALNESS: 0.7,
      PLATE_ROUGHNESS: 0.45,
      TEXT_COLOR: "#d8b577",
      BORDER_COLOR: "#B08D57",
      BORDER_METALNESS: 0.9,
      BORDER_ROUGHNESS: 0.3,
      BORDER_INSET: 0.011,
      BORDER_WIDTH: 0.0035,
      SCREW_COLOR: "#B08D57",
      SCREW_RADIUS: 0.006,
      SCREW_DEPTH: 0.004,
      SCREW_INSET: 0.024,
      WIDTH: 1.1,
      HEIGHT: 0.066,
      DEPTH: 0.014,
      Y: GRID_BOTTOM - 0.08,
      Z: 0.022,
      FONT_SIZE: 0.026,
      LETTER_SPACING: 0.14,
      TEXT_MAX_WIDTH_FRACTION: 0.86,
    },
    FRAME_POSITIONS: buildFramePositions(),
    IMAGES: [
      "/images/gallery/gallery1.webp",
      "/images/gallery/gallery2.jpg",
      "/images/gallery/gallery3.jpg",
      "/images/gallery/gallery4.jpg",
      "/images/gallery/gallery5.webp",
      "/images/gallery/gallery6.jpg",
      "/images/gallery/gallery7.jpg",
      "/images/gallery/gallery8.jpg",
    ],
  },

  MODELS: {
    FH: {
      URL: "/models/fh/fh.glb",
      POSITION: [1, -0.06, -1] as [number, number, number],
      ROTATION: [0, -0.7, 0] as [number, number, number],
      SCALE: 1,
    },
    SKATEBOARD: {
      URL: "/models/skateboard/skateboard.glb",
      POSITION: [-1.3, -0.59, 1.2] as [number, number, number],
      ROTATION: [5.2, 6.1, 2.8] as [number, number, number],
      SCALE: [1, 1, 1] as [number, number, number],
    },
    FLOWERS: {
      URL: "/models/flower-pot/flower-pot.glb",
      POSITION: [1.15, 0, 1.1] as [number, number, number],
      ROTATION: [0, Math.PI / 4, 0] as [number, number, number],
      SCALE: [1, 1, 1] as [number, number, number],
    },
    COMPUTER: {
      URL: "/models/laptop/laptop.glb",
      POSITION: [0, -0.256, 0] as [number, number, number],
      ROTATION: [0, 0.3, 0] as [number, number, number],
      SCALE: 0.28,
    },
    DESK: {
      URL: "/models/desk/desk.glb",
      POSITION: [0.3, 0.43, 0] as [number, number, number],
      SCALE: [1, 1, 1] as [number, number, number],
    },
    CHAIR: {
      URL: "/models/chair/chair.glb",
      POSITION: [0.6, 0.56, 0.55] as [number, number, number],
      ROTATION: [0, Math.PI + 0.5, 0] as [number, number, number],
      SCALE: 0.55,
    },
    SPEAKER: {
      URL: "/models/speaker/speaker.glb",
      POSITION: [-0.38, 0.86, -0.2] as [number, number, number],
      ROTATION: [0, 0.4, 0] as [number, number, number],
      SCALE: 0.6,
    },

    WALL_SHELF: {
      URL: "/models/wall-shelf/wall-shelf.glb",
      POSITION: [0.3, 2, -0.35] as [number, number, number],
      ROTATION: [0, 0, 0] as [number, number, number],
      SCALE: 0.6,
    },

    READING_LAMP: {
      URL: "/models/reading-lamp/reading-lamp.glb",
      POSITION: [0.55, 1.07, -0.2] as [number, number, number],
      ROTATION: [0, -0.4, 0] as [number, number, number],
      SCALE: 0.24,
    },
    PET: {
      URL: "/models/pet/topol-idle/cat-idle.glb",
      POSITION: [-0.55, ROOM_FLOOR_Y + 1.07, 1] as [number, number, number],
      ROTATION: [0, Math.PI / 1.1, 0] as [number, number, number],
      SCALE: [0.008, 0.008, 0.008] as [number, number, number],
    },

    CARPET: {
      URL: "/models/carpet/carpet.glb",
      POSITION: [0.28, 0.02, 1.2] as [number, number, number],
      ROTATION: [0, 0, 0] as [number, number, number],
      SCALE: [1, 1, 0.7] as [number, number, number],
    },
  },

  ANIMATION: {
    AREA_TRANSITION_DURATION: 900,
    GALLERY_ZOOM_DURATION: 600,
    EASING_POWER: 3,
  },

  DEBUG: {
    ENABLED: false,
    BOX_SIZE: 0.2,
    TARGET_BOX_SIZE: 0.1,
    SHOW_WALLS: true,
  },
} as const;
