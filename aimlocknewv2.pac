if (typeof headshotPriorityZone === 'undefined') {
    var headshotPriorityZone = { xMin: 0, xMax: 0, yMin: 0, yMax: 0 };
}
// Nếu không có config khác, ánh xạ config toàn cục vào CONFIG
if (typeof config === 'undefined') {
    var config = typeof CONFIG !== 'undefined' ? CONFIG : {};
}
// Khởi tạo gameState mặc định
if (typeof gameState === 'undefined') {
    var gameState = {
        performanceProfile: { fps: 60, latency: 0, magicTrickConfidence: 0 },
        recoilState: { shotCount: 0, lastShot: 0, weapon: null },
        magicTrickState: { magicConfidence: 0, lastHeadLock: 0, activeTarget: null },
        targetMemory: new Map(),
        aiMemory: new Map(),
        neuralNetwork: { weights: new Map(), activations: [] },
        triggerState: { lastTrigger: 0, burstCount: 0 },
        lastAim: { x: 0, y: 0 }
    };
}
// Một số hàm tiện ích nếu chưa tồn tại
if (typeof getCrosshairPosition === 'undefined') {
    var getCrosshairPosition = function() { return { x: 0, y: 0, z: 0 }; };
}
if (typeof currentTarget === 'undefined') {
    var currentTarget = null;
}
// Một số hằng số cấu hình bổ sung nếu chưa có
if (typeof CONFIG !== 'undefined') {
    if (typeof CONFIG.headSnapRadius === 'undefined') CONFIG.headSnapRadius = 0.05;
    if (typeof CONFIG.chestSnapRadius === 'undefined') CONFIG.chestSnapRadius = 0.12;
    if (typeof CONFIG.HEAD_SNAP_RADIUS === 'undefined') CONFIG.HEAD_SNAP_RADIUS = CONFIG.headSnapRadius;
    if (typeof CONFIG.DRAG_HEAD_LOCK_ENABLED === 'undefined') CONFIG.DRAG_HEAD_LOCK_ENABLED = true;
    if (typeof CONFIG.DRAG_HEAD_LOCK_RADIUS === 'undefined') CONFIG.DRAG_HEAD_LOCK_RADIUS = 0.3;
    if (typeof CONFIG.AUTO_FIRE === 'undefined') CONFIG.AUTO_FIRE = CONFIG.AUTO_FIRE || { enabled: true, minLockConfidence: 0.0 };
}
// Tránh ghi đè triggerFire nếu đã có; nếu chưa có thì tạo một stub
if (typeof triggerFire === 'undefined') {
    function triggerFire() { console.log("🔫 Fire Triggered (stub)"); }
}
// Nếu có hàm aimTo được định nghĩa nhiều lần, không cần tạo ở đây.
// End safety defaults


// Convert hex pattern to buffer
function patchBinary(base64, findHex, replaceHex) {
    const find = Buffer.from(findHex.replace(/\s+/g, ''), 'hex');
    const replace = Buffer.from(replaceHex.replace(/\s+/g, ''), 'hex');
    let buffer = Buffer.from(base64, 'base64');
    let index = buffer.indexOf(find);
    if (index !== -1) {
        replace.copy(buffer, index);
        console.log("✅ Patch success at index:", index);
        return buffer.toString('base64');
    } else {
        console.log("❌ Patch not found.");
        return base64;
    }
}

// === Constants ===
const AIMFOV_FIND = `70 42 00 00 00 00 00 00 C0 3F 0A D7 A3 3B 0A D7 A3 3B 8F C2 75 3D AE 47 E1 3D 9A 99 19 3E CD CC 4C 3E A4 70 FD 3E`;
const AIMFOV_REPLACE = `FF FF 00 00 00 00 00 00 C0 3F 0A D7 A3 3B 0A D7 A3 3B 8F C2 75 3D AE 47 E1 3D 9A 99 19 3E CD CC 4C 3E A4 70 FD 3E`;

const NORECOIL_FIND = `00 0A 81 EE 10 0A 10 EE 10 8C BD E8 00 00 7A 44 F0 48 2D E9 10 B0 8D E2 02 8B 2D ED 08 D0 4D E2 00 50 A0 E1 10 1A 08 EE 08 40 95 E5 00 00 54 E3`;
const NORECOIL_REPLACE = `00 0A 81 EE 10 0A 10 EE 10 8C BD E8 00 00 EF 44 F0 48 2D E9 10 B0 8D E2 02 8B 2D ED 08 D0 4D E2 00 50 A0 E1 10 1A 08 EE 08 40 95 E5 00 00 54 E3`;

const HEAD_LOCK_RADIUS = 9999.0;
const dotNotationConfig = {
  "input_lock_on_precision_mode": "head_3d_tracking",
  "input_lock_on_track_velocity": true,
  "input_lock_on_rotation_tracking": true,
  "input_lock_on_predict_movement": true,
  "input_lock_on_keep_xy": true,
  "input_lock_on_offset_x": BONE_HEAD_CONFIG.offset.x,
  "input_lock_on_offset_y": BONE_HEAD_CONFIG.offset.y,
  "input_lock_on_offset_z": BONE_HEAD_CONFIG.offset.z,

  // 🎯 Vuốt chính xác & phản hồi nhanh
  "fire.gesture.drag_assist": true,
  "fire.gesture.drag_force_multiplier": 40.0,
  "fire.gesture.input_response_speed": 999.0,
  "fire.gesture.velocity_amplifier": 10.75,
  "fire.gesture.drag_consistency": 10.0,
  "fire.gesture.drag_response_speed": 999.0,
  "fire.gesture.input_delay": 0,
  "fire.gesture.touch_latency": 0,
  "fire.gesture.drag_input_buffer": 0,
  "fire.gesture.touch_response_override": true,
  // 🔥 Tăng lực drag nút bắn
  "fire.button.drag_boost": true,
  "fire.button.drag_multiplier": 10.5,
  "fire.button.drag_response_speed": 9999.0,
  "fire.button.lock_on_strength": 10.0,
  "fire.button.drag_assist_zone": "full",  // toàn vùng nút bắn có hiệu lực kéo
  "fire.button.drag_sensitivity_boost": 10.0,
  "fire.button.aim_response_acceleration": 10.0,
  // 📱 Nhạy tâm ngắm & vuốt màn hình
  "screen.touch.drag_sensitivity": 8.0,
  "screen.touch.smoothing": 1.0,
  "screen.touch.precision_lock_threshold": 0.0001,
  "screen.touch.adaptive_speed": true,
  "screen.touch.speed_min": 0.0001,
  "screen.touch.speed_max": 0.0035,
  "aimHeadLock.aimBone": "bone_Head",
  "aimHeadLock.autoLock": true,
  "aimHeadLock.lockInjection": true,
  "aimHeadLock.lockStrength": "maximum",
  "aimHeadLock.snapBias": 5.0,
  "aimHeadLock.trackingSpeed": 7.0,
  "aimHeadLock.dragCorrectionSpeed": 7.0,
  "aimHeadLock.snapToleranceAngle": 7.5,
  "aimHeadLock.maxLockAngle": 360,
  "aimHeadLock.stickiness": "high",
  "aimHeadLock.headStickPriority": true,

  // 🧠 Dữ liệu xương Head
  "aimHeadLock.boneHead_position_x": -0.0456970781,
  "aimHeadLock.boneHead_position_y": -0.004478302,
  "aimHeadLock.boneHead_position_z": -0.0200432576,

  "aimHeadLock.boneHead_rotation_x": 0.0258174837,
  "aimHeadLock.boneHead_rotation_y": -0.08611039,
  "aimHeadLock.boneHead_rotation_z": -0.1402113,
  "aimHeadLock.boneHead_rotation_w": 0.9860321,

  "aimHeadLock.boneHead_scale_x": 0.99999994,
  "aimHeadLock.boneHead_scale_y": 1.00000012,
  "aimHeadLock.boneHead_scale_z": 1.0,
  // 🧠 Nhạy mục tiêu headlock
  "aim.headlock.lock_radius_limit": true,
  "aim.headlock.lock_radius_max": 360.0,
  "aim.headlock.snap_strength": 10.0,
  "aim.headlock.smooth_factor": 0.7,
  "aim.headlock.auto_adjust": true,
  "aim.headlock.offset_neck_bias": 0.015
};

  const boneOffset = {
  x: -0.04089227,
  y:  0.00907892,
  z:  0.02748467
};
const headPosition = {
  x: basePos.x + offset.x + boneOffset.x,
  y: basePos.y + offset.y + boneOffset.y,
  z: basePos.z + offset.z + boneOffset.z
};
const aimConfig = {
  fake_screen: {
    resolution: "2752x2064",
    dpi: 3600,
    sensitivity_multiplier: 6.8
  },
  auto_fov: {
    dynamic_adjust: true,
    max: 360.0
  },
  math: {
    predictive_offset: 0.02748467
  },
  headlock: {
    enabled: true,
    biasFactor: 5.0,
    lockHeightRatio:  0.00907892,
    crosshairMagnetism: true,
    adaptiveRange: true,
    distanceCompensation: true,
    velocityAdaption: true
  },
  weapon_profiles: weaponProfiles,
  recoil: {
    m1887: { x: 0.0, y: 0.0 },
    mp40: { x: 0.0, y: 0.0 },
    ump: { x: 0.0, y: 0.0 },
    m1014: { x: 0.0, y: 0.0 },
    de: { x: 0.0, y: 0.0 },
    m590: { x: 0.0, y: 0.0 }
  }
};
// --- Fix Rung Mạnh Config - Tối Ưu Giảm Giật & Rung ---
// --- Giảm Giật Và Rung Tối Đa ---
const GamePackages = {
  GamePackage1: "com.dts.freefireth",
  GamePackage2: "com.dts.freefiremax"
};
const FixRecoilConfig = {
  // Giảm giật & rung mạnh
 RecoilSuppressionMaster: 99999,
  AntiShakeStablizer: 99999,
  ZeroRecoilDrag: 99999,
  SmoothRecoilControl: 99999,
  StabilizedDragForce: 99999,
  DragRecoilFixer: 99999,
  GripForceStabilizer: 99999,
  RecoilLockdown: 99999,
  ZeroDriftFix: 99999,
  GripMomentumControl: 99999,
  DragResistanceEnhancer: 99999,
  UltraStabilizedDrag: 99999,
  RecoilSmoothing: 99999,
  PrecisionGripFix: 99999,
  LowFrictionGrip: 99999,
 sensitivity: 9999.0,
  autoHeadLock: true,
  aimLockHead: true,
  headLockFov: 520,
  aimFov: 380,
  predictiveMultiplier: 0.001,
  superHeadLock: 9999.0,
  aimSmoothnessNear: 0.00001,
  aimSmoothnessFar: 0.00001,
  triggerFireChance: 1.0,
  quantumAiming: true,
  neuralPrediction: true,
  adaptiveAI: true,
  multiThreaded: true,
  ghostMode: true,
  perfectHumanization: true,
  realTimeML: true,
  contextualAwareness: true,
  wallPenetration: true,
  magicBullet: true,
  magicTrick: true, // New MagicTrick feature
  stealthMode: true,
  behaviorCloning: true,
  naturalJitter: { min: 0.0, max: 0.0 },
  humanReactionTime: { min: 0, max: 0 },
  organicMovement: true,
  biometricMimicry: true,
  mousePersonality: 'ultra_adaptive',
  antiPatternDetection: true,
  hyperOptimization: true,
  quantumCalculations: true,
  memoryOptimization: true,
  realTimeAdaptation: true,
  cacheOptimization: true,

  smoothingFrames: 5,
  frameDelay: 5,
  noiseLevel: 0.2,
  recoilCancelFactor: 1.0,
  fpsLogInterval: 1000,
  trackHistoryLimit: 50,
  enableGhostOverlay: true,
  enableOneShotAI: true,
  adaptiveSensitivity: true,
  stabilizationWindow: 7,

  wasmAcceleration: true,
  threadPoolSize: 12,
  maxCalculationsPerFrame: 30,
  rapidHeadSwitch: true,
  dynamicHeadPriority: true,
  ultraSmoothTransition: true,
  contextualHeadLock: true,

  // MagicTrick Configuration
  magicTrickConfig: {
    enabled: true,
    headAttraction: 9999.0, // Strength of head attraction
    adaptiveMagic: true, // Adjust based on game context
    magicSwitchSpeed: 0.0001, // Speed of switching to new head target
    magicConfidence: 0.0, // Confidence threshold for magic trick activation
    visualFeedback: true, // Enable visual feedback for magic trick
    lockPersistence: 9999.0 // Time to maintain head lock (seconds)
  },

  // Master Weapon Profiles
  tracking: {
    default: { 
      speed: 9999.0, pullRate: 9999.0, headBias: 9999.0, neckBias: 10.0, chestBias: 1.0, 
      closeBoost: 9999.0, recoilPattern: [0, 0], burstControl: 1.0, rangeMod: 9999.0, 
      recoilRecovery: 9999.0, penetration: 0.65, criticalZone: 15.0, stability: 0.98, 
      neuralWeight: 9999.0
    },
    mp40: { 
     speed: 9999.0, pullRate: 9999.0, headBias: 9999.0, neckBias: 10.0, chestBias: 1.0, 
      closeBoost: 9999.0, recoilPattern: [0, 0], burstControl: 1.0, rangeMod: 9999.0, 
      recoilRecovery: 9999.0, penetration: 0.65, criticalZone: 15.0, stability: 0.98, 
      neuralWeight: 9999.0
    },
    thompson: { 
         speed: 9999.0, pullRate: 9999.0, headBias: 9999.0, neckBias: 10.0, chestBias: 1.0, 
      closeBoost: 9999.0, recoilPattern: [0, 0], burstControl: 1.0, rangeMod: 9999.0, 
      recoilRecovery: 9999.0, penetration: 0.65, criticalZone: 15.0, stability: 0.98, 
      neuralWeight: 9999.0
    },
    ump: { 
         speed: 9999.0, pullRate: 9999.0, headBias: 9999.0, neckBias: 10.0, chestBias: 1.0, 
      closeBoost: 9999.0, recoilPattern: [0, 0], burstControl: 1.0, rangeMod: 9999.0, 
      recoilRecovery: 9999.0, penetration: 0.65, criticalZone: 15.0, stability: 0.98, 
      neuralWeight: 9999.0
    },
        m1887: { 
        speed: 9999.0, pullRate: 9999.0, headBias: 9999.0, neckBias: 10.0, chestBias: 1.0, 
      closeBoost: 9999.0, recoilPattern: [0, 0], burstControl: 1.0, rangeMod: 9999.0, 
      recoilRecovery: 9999.0, penetration: 0.65, criticalZone: 15.0, stability: 0.98, 
      neuralWeight: 9999.0
    }
  },

  // Advanced Sensitivity Matrix
  sensiActivity: {
    default: 9999.0,
    mp40: 9999.0,
    thompson: 9999.0,
    ump: 9999.0,
    m1887: 9999.0
  },

  // Enhanced Target Priority System
  targetPriority: {
    head: 230,
    neck: 130,
    chest: 90,
    limbs: 60,
    distance: 1.6,
    health: 1.2,
    threat: 1.5,
    movement: 1.3,
    cover: 0.5,
    teamPriority: 2.0,
    visibility: 1.7,
    exposureTime: 1.4
  },

  // AI Learning System
  aiLearning: {
    enabled: true,
    learningRate: 0.25,
    memoryDepth: 120,
    adaptationSpeed: 0.18,
    patternRecognition: true,
    behaviorAnalysis: true,
    performanceFeedback: true,
    maxTrainingSamples: 2500
  },

  // Quantum Physics Engine
  quantumPhysics: {
    enabled: true,
    uncertaintyPrinciple: 0.0006,
    quantumTunneling: true,
    superposition: true,
    entanglement: true,
    quantumCurveFluctuation: 0.0004
  },

  // Magic Bullet Settings
  magicBulletConfig: {
    enabled: true,
    curve: 3.5,
    prediction: 1.5,
    wallBypass: true,
    trajectoryOptimization: true,
    dynamicCurveAdjustment: true,
    adaptiveTrajectory: {
      smg: { curve: 3.0, prediction: 1.3 },
      sniper: { curve: 4.5, prediction: 1.7 }
    },
    magicBurstMode: { enabled: true, burstBoost: 1.2, maxBurst: 5 }
  },

  // Trigger Bot Settings
  triggerBot: {
    enabled: true,
    delay: { min: 0, max: 0 },
    burstMode: true,
    smartTrigger: true,
    safeMode: true,
    adaptiveBurst: true
  }
};
  // Ổn định bắn
  VerticalRecoilSuppression: 99999,
  HorizontalShakeReduction: 99999,
  RealTimeGunStabilityControl: 99999,
  DynamicRecoilFeedbackModulation: 99999,
  AdvancedShootingBalance: 99999,
  InteractiveWeaponResponse: 99999,
  RealTimeCrosshairAnchor: 99999,
  AutoRecoilAdjustSystem: 99999,
  StabilizedFiringRateControl: 99999,
  QuickRecoilResetOptions: 99999,

  // --- Cải Tiến Cho Độ Chính Xác và Giảm Giật ---
  RecoilAutoBalance: 99999,
  TouchDriftFix: 99999,
  RecoilPressureCompensator: 99999,
  GripCalibrationTuning: 99999,
  GripForceControl: 99999,
  DragFlowStabilizer: 99999,
  PressureGripFix: 99999,
  VerticalDragCorrection: 99999,
  HorizontalDragFixer: 99999,
  AntiShakeEnhancer: 99999,
  QuickGripCorrection: 99999,
  SuperStableDrag: 99999,
  StableSwipeCalibration: 99999,

  // --- Tăng Tốc Độ Độ Chính Xác, Giảm Trễ ---
  ZeroLatencyTouchControl: 99999,
  RealTimeRecoilFixer: 99999,
  QuickDragRestraint: 99999,
  DragStabilityEnhancer: 99999,
  TouchPressureBalancer: 99999,
  TouchInputFixer: 99999,
  SwipeStabilizer: 99999,
  RapidGripAdjustment: 99999,
  FineGripOptimizer: 99999,

  // --- Ghim Tâm Chính Xác & Giảm Quá Dính ---
  PrecisionAimLock: 99999,
  VerticalAimFix: 99999,
  HorizontalAimFix: 99999,
  SmoothGripControl: 99999,
  DragStabilityBalancer: 99999,
  GripSensitivityTuning: 99999,
  AutoAimFix: 99999,
  DragSpeedAdjuster: 99999,
  DragControlLimiter: 99999,
  TouchGripResponse: 99999,
  DynamicGripReset: 99999,

  // --- Ghim Tâm, Giảm Lệch, Giảm Quá Dính ---
  AutoCenteringFix: 99999,
  RealTimeAimLock: 99999,
  VerticalDragLimiter: 99999,
  HorizontalDragLimiter: 99999,
  HeadSnapLimiter: 99999,
  DragPrecisionTuner: 99999,
  GripCorrectionEnhancer: 99999,
  NoExcessiveGrip: 99999,
  BalancedDragControl: 99999,
  RealTimePrecisionSync: 99999,

  // --- Giảm Quá Dính, Cải Tiến Độ Chính Xác ---
  ZeroLateralMovement: 99999,
  ZeroVerticalDrift: 99999,
  NoAimSnapFixer: 99999,
  TouchSensitivityLock: 99999,
  DragReductionOptimizer: 99999,
  RecoilCorrectionSystem: 99999,
  DragAndDropSync: 99999,
  GripForceLimiter: 99999,
  ZeroFluctuationDrag: 99999,

  // --- Ghim Tâm Mượt Mà, Chính Xác, Không Lệch ---
  GripStabilizer: 99999,
  FastDragControl: 99999,
  TouchInputCorrection: 99999,
  DragSpeedLimiter: 99999
};

const HyperMaxLockSystem = {
    // Head Lock siêu nhanh, bám cực chính xác
    HyperHeadLockSystem: {
        enabled: true,
        aimBone: "bone_Head",
        autoLockOnFire: true,
        holdLockWhileDragging: true,
        stickiness: "hyper",
        snapToleranceAngle: 0.0,
        disableBodyRecenter: true,
        trackingSpeed: 15.0,        // Cực nhanh, gần như instant
        smoothing: 1.0,
        maxDragDistance: 0.0,
        snapBackToHead: true,
        predictionFactor: 2.0,      // Dự đoán cực mạnh
        autoFireOnLock: true,
        boneOffset: { x: -0.0457, y: -0.00448, z: -0.02004 },
        rotationOffset: { x: 0.0258, y: -0.0861, z: -0.1402, w: 0.9860 },
        scale: { x: 1.0, y: 1.0, z: 1.0 }
    },

    // Neck Lock backup nếu mất đầu
    HyperNeckLockSystem: {
        enabled: true,
        aimTrackingBone: "bone_Neck",
        autoLock: true,
        lockStrength: "maximum",
        snapBias: 1.0,
        trackingSpeed: 12.0,
        dragCorrectionSpeed: 5.0,
        snapToleranceAngle: 0.0,
        maxLockAngle: 360,
        stickiness: "hyper",
        neckStickPriority: true,
        boneNeck_position: { x: -0.128512, y: 0.0, z: 0.0 },
        boneNeck_rotation: { x: -0.012738, y: -0.002122, z: 0.164307, w: 0.986325 },
        boneNeck_scale: { x: 1.0, y: 1.0, z: 1.0 }
    },

    // Touch Boost cực nhạy, bù lag, điều chỉnh vi mô
    TouchBoostPrecisionSystem: {
        enabled: true,
        precisionMode: true,
        boostOnTouch: true,
        boostOnDrag: true,
        boostOnFire: true,
        baseSensitivity: 25.0,
        boostMultiplier: 40.0,
        precisionDragMultiplier: 0.0,
        boostRampUpTime: 0.0,
        boostDecayTime: 0.0,
        microDragPrecision: 0.0005,
        microDragMultiplier: 1.0,
        tapDistanceThreshold: 0.0,
        microAdjustThreshold: 0.0,
        microAdjustSmoothing: 1.0,
        latencyCompensation: true,
        latencyMs: -35,
        overshootProtection: true,
        overshootLimit: 0.0,
        debugLog: false
    },

    // Anti-Recoil + Stabilizer
    AntiRecoilAimStabilizer: {
        enabled: true,
        targetBone: "bone_Head",
        autoCompensateRecoil: true,
        compensationStrength: 0.95,
        smoothFactor: 0.95,
        snapToleranceAngle: 0.0,
        stickiness: "hyper",
        applyWhileFiring: true,
        predictionFactor: 0.9,
        boneOffset: { x: -0.0457, y: -0.00448, z: -0.02004 },
        rotationOffset: { x: 0.0258, y: -0.0861, z: -0.1402, w: 0.9860 },
        scale: { x: 1.0, y: 1.0, z: 1.0 }
    },

    // Giữ tâm khi bắn, drag siêu mượt
    HoldCrosshairOnHeadWhenFire: {
        enabled: true,
        targetBone: "bone_Head",
        autoLockOnFire: true,
        holdLockWhileFiring: true,
        trackingSpeed: 2.0,
        predictionFactor: 1.2,
        snapToleranceAngle: 0.0,
        stickiness: "hyper",
        disableBodyRecenter: true,
        smoothing: 0.95,
        boneOffset: { x: -0.0457, y: -0.00448, z: -0.02004 },
        rotationOffset: { x: 0.0258, y: -0.0861, z: -0.1402, w: 0.9860 },
        scale: { x: 1.0, y: 1.0, z: 1.0 }
    },

    // Auto Tracking Lock + fallback neck
    AutoTrackingLock: {
        enabled: true,
        trackingBone: "bone_Head",
        autoSwitchToNeck: true,
        trackingSpeed: 1.5,
        predictionFactor: 0.9,
        snapToleranceAngle: 0.0,
        maxLockDistance: 250.0,
        stickiness: "hyper",
        ignoreObstacles: true,
        recenterDelay: 0,
        boneOffset: { x: -0.0457, y: -0.00448, z: -0.02004 },
        rotationOffset: { x: 0.0258, y: -0.0861, z: -0.1402, w: 0.9860 },
        scale: { x: 1.0, y: 1.0, z: 1.0 }
    },

    // Auto headshot khi fire
    AutoShotHead: { autoHeadshot: true, aimListextension: true },

    // Tối ưu lag & khởi động
    FixLagBoost: { fixResourceTask: true },
    CloseLauncherRestore: { closeLauncher: true, forceRestore: true }
};
const AimbotConfig = {
// Cài đặt tracking
smoothness: 0.85,           // Độ mượt của việc theo dõi (0-1)
predictionTime: 0.01,       // Thời gian dự đoán chuyển động
maxTrackingDistance: 99999,   // Khoảng cách tối đa để track
fovLimit: 360,              // Giới hạn FOV để target

// Cài đặt bắn kích hoạt
fireActivationDuration: 1000,  // Thời gian active sau khi bắn (ms)
burstMode: true,           // Chế độ bắn liên tiếp
burstCount: 200,             // Số viên bắn trong burst
burstDelay: 0,           // Delay giữa các burst (ms)

// Cài đặt bone targeting

preferredBones: ['bone_Head', 'bone_Neck', 'bone_Chest'],

headShotMultiplier: 10.0,   // Hệ số ưu tiên headshot

// Cài đặt anti-recoil
recoilCompensation: true,
recoilPattern: [           // Pattern giật súng chuẩn
{ x: 0, y: -2 }, { x: -1, y: -3 }, { x: 1, y: -2 },
{ x: -2, y: -4 }, { x: 2, y: -3 }, { x: -1, y: -5 }
]
};

// === Game Package Detection ===

// === BoneHeadBasedEnemyDetector tích hợp ===

class BoneHeadBasedEnemyDetector {
  constructor(options = {}) {
    // ✅ Sửa toàn bộ dấu nháy trong headConfig
    this.headConfig = options.headConfig || {
      "boneColliderProperty": {
        "boneProperty": { "recursivery": 0 },
        "splitProperty": {
          "boneWeightType": 0,
          "boneWeight2": 100,
          "boneWeight3": 100,
          "boneWeight4": 100,
          "greaterBoneWeight": 1,
          "boneTriangleExtent": 0
        },
        "reducerProperty": {
          "shapeType": 3,
          "fitType": 0,
          "meshType": 3,
          "maxTriangles": 255,
          "sliceMode": 0,
          "scale": { "x": 1.0, "y": 1.0, "z": 1.0 },
          "scaleElementType": 0,
          "minThickness": { "x": 0.01, "y": 0.01, "z": 0.01 },
          "minThicknessElementType": 0,
          "optimizeRotation": { "x": 1, "y": 1, "z": 1 },
          "optimizeRotationElementType": 0,
          "colliderToChild": 2,
          "offset": { "x": 0.0, "y": 0.0, "z": 0.0 },
          "thicknessA": { "x": 0.0, "y": 0.0, "z": 0.0 },
          "thicknessB": { "x": 0.0, "y": 0.0, "z": 0.0 },
          "viewAdvanced": 0
        },
        "colliderProperty": {
          "convex": 1,
          "isTrigger": 0,
          "material": { "m_FileID": 0, "m_PathID": 0 },
          "isCreateAsset": 0
        },
        "rigidbodyProperty": {
          "mass": 1.0,
          "drag": 0.0,
          "angularDrag": 0.05,
          "isKinematic": 1,
          "useGravity": 0,
          "interpolation": 0,
          "collisionDetectionMode": 0,
          "isCreate": 0,
          "viewAdvanced": 0
        },
        "modifyNameEnabled": 0
      },

      "defaultBoneColliderProperty": {
        "boneProperty": { "recursivery": 0 },
        "splitProperty": {
          "boneWeightType": 0,
          "boneWeight2": 50,
          "boneWeight3": 33,
          "boneWeight4": 25,
          "greaterBoneWeight": 1,
          "boneTriangleExtent": 1
        },
        "reducerProperty": {
          "shapeType": 2,
          "fitType": 0,
          "meshType": 3,
          "maxTriangles": 255,
          "sliceMode": 0,
          "scale": { "x": 1.0, "y": 1.0, "z": 1.0 },
          "scaleElementType": 0,
          "minThickness": { "x": 0.01, "y": 0.01, "z": 0.01 },
          "minThicknessElementType": 0,
          "optimizeRotation": { "x": 1, "y": 1, "z": 1 },
          "optimizeRotationElementType": 0,
          "colliderToChild": 0,
          "offset": { "x": 0.0, "y": 0.0, "z": 0.0 },
          "thicknessA": { "x": 0.0, "y": 0.0, "z": 0.0 },
          "thicknessB": { "x": 0.0, "y": 0.0, "z": 0.0 },
          "viewAdvanced": 0
        },
        "colliderProperty": {
          "convex": 1,
          "isTrigger": 0,
          "material": { "m_FileID": 0, "m_PathID": 0 },
          "isCreateAsset": 0
        },
        "rigidbodyProperty": {
          "mass": 1.0,
          "drag": 0.0,
          "angularDrag": 0.05,
          "isKinematic": 1,
          "useGravity": 0,
          "interpolation": 0,
          "collisionDetectionMode": 0,
          "isCreate": 1,
          "viewAdvanced": 0
        },
        "modifyNameEnabled": 0
      }
    };

    

// Các cấu hình khác
this.sensitivity = options.sensitivity || 0.001;
this.smoothingFactor = options.smoothingFactor || 0.3;
this.headLockRange = options.headLockRange || 9999;

this.lockedTarget = null;
this.targetHistory = [];

this.distanceAdjustments = {
  close: { range: [0, 50], offset: { x: 0, y: 0.00907892 } },
  medium: { range: [50, 150], offset: { x: 0, y: 0.00907892 } },
  far: { range: [150, 300], offset: { x: 0, y: 0.00907892 } },
  veryFar: { range: [300, Infinity], offset: { x: 0, y: 0.00907892 } }
};
}




computeWorldPosition(matrix, bindpose) {
const p = bindpose.position;
const m = matrix;
return {
x: m.e00 * p.x + m.e01 * p.y + m.e02 * p.z + m.e03,
y: m.e10 * p.x + m.e11 * p.y + m.e12 * p.z + m.e13,
z: m.e20 * p.x + m.e21 * p.y + m.e22 * p.z + m.e23
};
}

findClosestHead(heads, crosshairPos, ignoreRangeLimit = false) {
let minDist = Infinity;
let closest = null;


heads.forEach(({ matrix, bindpose }) => {
  const pos = this.computeWorldPosition(matrix, bindpose);
  const dist = Math.hypot(pos.x - crosshairPos.x, pos.y - crosshairPos.y);

  if (ignoreRangeLimit || dist < this.headLockRange) {
    if (dist < minDist) {
      minDist = dist;
      closest = { ...pos, matrix, bindpose, distance: dist };
    }
  }
});

return closest;


}

applyDistanceOffset(head) {
  for (const key in this.distanceAdjustments) {
    const cfg = this.distanceAdjustments[key];
    if (head.distance >= cfg.range[0] && head.distance < cfg.range[1]) {
      return {
        ...head,
        x: head.x + cfg.offset.x,
        y: head.y + cfg.offset.y,
        distanceCategory: key
      };
    }
  }
  return head;
}

predictHeadMovement(current) {
const last = this.targetHistory[this.targetHistory.length - 1];
if (!last) return current;


const vx = current.x - last.x;
const vy = current.y - last.y;

return {
  ...current,
  x: current.x + vx * 2,
  y: current.y + vy * 2
};

}

computeHeadBoundingBox(headPos, distance) {
const baseSize = 30; // kích thước cơ bản bounding box
const size = baseSize * (1 / Math.max(distance, 1)); // tỉ lệ nghịch khoảng cách, tránh chia 0


return {
  left: headPos.x - size / 2,
  right: headPos.x + size / 2,
  top: headPos.y - size / 2,
  bottom: headPos.y + size / 2,
  size
};


}

calculateAimAssist(crosshair, head) {
const adjusted = this.applyDistanceOffset(head);
const predicted = this.predictHeadMovement(adjusted);


const rawDX = predicted.x - crosshair.x;
const rawDY = predicted.y - crosshair.y;

const deltaX = rawDX * this.sensitivity;
const deltaY = rawDY * this.sensitivity;

let smoothed = { x: deltaX, y: deltaY };
if (this.lockedTarget) {
  smoothed.x = this.lockedTarget.aimDelta.x +
              (deltaX - this.lockedTarget.aimDelta.x) * this.smoothingFactor;
  smoothed.y = this.lockedTarget.aimDelta.y +
              (deltaY - this.lockedTarget.aimDelta.y) * this.smoothingFactor;
}

const boundingBox = this.computeHeadBoundingBox(predicted, head.distance);

return {
  deltaX: smoothed.x,
  deltaY: smoothed.y,
  raw: { x: rawDX, y: rawDY },
  predicted,
  adjusted,
  boundingBox,
  distance: head.distance
};


}

process(boneHeadData, crosshair, isCrosshairRed = false) {
if (!isCrosshairRed) {
this.lockedTarget = null;
this.targetHistory = [];
return {
locked: false,
headInfo: null,
aimAssist: null
};
}


const head = this.findClosestHead(boneHeadData, crosshair, true);
let aim = null;

if (head) {
  aim = this.calculateAimAssist(crosshair, head);

  this.lockedTarget = {
    head,
    aimDelta: { x: aim.deltaX, y: aim.deltaY },
    timestamp: Date.now()
  };

  this.targetHistory.push(head);
  if (this.targetHistory.length > 10) this.targetHistory.shift();
} else {
  this.lockedTarget = null;
  this.targetHistory = [];
}

return {
  locked: !!head,
  headInfo: head,
  aimAssist: aim
};


}
}

// === Bindpose matrices cho các bone ===
const BoneMatrices = {
bone_Head: {
e00: -1.34559613e-13, e01: 8.881784e-14, e02: -1.0, e03: 0.487912,
e10: -2.84512817e-6, e11: -1.0, e12: 8.881784e-14, e13: -2.842171e-14,
e20: -1.0, e21: 2.84512817e-6, e22: -1.72951931e-13, e23: 0.0,
e30: 0.0, e31: 0.0, e32: 0.0, e33: 1.0
},
bone_Neck: {
e00: -1.2e-13, e01: 7.5e-14, e02: -1.0, e03: 0.45,
e10: -2.5e-6, e11: -1.0, e12: 7.5e-14, e13: -2.0e-14,
e20: -1.0, e21: 2.5e-6, e22: -1.5e-13, e23: 0.0,
e30: 0.0, e31: 0.0, e32: 0.0, e33: 1.0
},
bone_Chest: {
e00: -1.1e-13, e01: 6.8e-14, e02: -1.0, e03: 0.35,
e10: -2.2e-6, e11: -1.0, e12: 6.8e-14, e13: -1.8e-14,
e20: -1.0, e21: 2.2e-6, e22: -1.3e-13, e23: 0.0,
e30: 0.0, e31: 0.0, e32: 0.0, e33: 1.0
}
};

// === Offset cho từng bone ===
const BoneOffsets = {
bone_Head: new Vector3(-0.0456970781, -0.004478302, -0.0200432576),
bone_Neck: new Vector3(-0.0356970781, -0.002478302, -0.0150432576),
bone_Chest: new Vector3(-0.0256970781, -0.001478302, -0.0100432576)
};

// === Enemy class tích hợp ===
class Enemy {
constructor(data) {
this.id = data.id || Math.random();
this.bones = data.bones || {};
this.velocity = data.velocity || new Vector3(0, 0, 0);
this.health = data.health || 100;
this.lastPosition = null;
this.positionHistory = [];
this.isMoving = false;

this.movementPattern = "linear";
this.threatLevel = this.calculateThreatLevel();
}

updatePosition(newBones) {
if (this.bones.bone_Head) {
this.lastPosition = this.bones.bone_Head.clone();
}


this.bones = { ...this.bones, ...newBones };
this.updateVelocity();
this.updateMovementPattern();
this.addToHistory();


}

updateVelocity() {
if (this.lastPosition && this.bones.bone_Head) {
const deltaPos = this.bones.bone_Head.subtract(this.lastPosition);
this.velocity = deltaPos.multiplyScalar(60); // Assuming 60 FPS
this.isMoving = this.velocity.length() > 0.1;
}
}

updateMovementPattern() {
if (this.positionHistory.length < 5) return;


const recent = this.positionHistory.slice(-5);
const movements = recent.slice(1).map((pos, i) => pos.subtract(recent[i]));

// Phân tích pattern chuyển động
const avgMovement = movements.reduce((sum, mov) => sum.add(mov), new Vector3()).multiplyScalar(1/movements.length);
const variance = movements.reduce((sum, mov) => sum + mov.subtract(avgMovement).length(), 0) / movements.length;

if (variance < 0.1) this.movementPattern = 'linear';
else if (variance < 0.5) this.movementPattern = 'curved';
else this.movementPattern = 'erratic';


}

addToHistory() {
if (this.bones.bone_Head) {
this.positionHistory.push(this.bones.bone_Head.clone());
if (this.positionHistory.length > 10) {
this.positionHistory.shift();
}
}
}

calculateThreatLevel() {
let threat = 1.0;
if (this.health > 80) threat += 0.3;
if (this.isMoving) threat += 0.2;
return Math.min(threat, 2.0);
}

getBestTargetBone() {
const availableBones = AimbotConfig.preferredBones.filter(bone => this.bones[bone]);
if (availableBones.length === 0) return null;


// Ưu tiên head shot
if (this.bones.bone_Head && Math.random() < 0.8) {
  return 'bone_Head';
}

return availableBones[0];


}
}

// === Movement Predictor ===
class MovementPredictor {
static predictPosition(enemy, deltaTime) {
if (!enemy.bones.bone_Head) return null;


const currentPos = enemy.bones.bone_Head;
const velocity = enemy.velocity;

// Dự đoán cơ bản dựa trên velocity
let predicted = currentPos.add(velocity.multiplyScalar(deltaTime));

// Áp dụng AI prediction dựa trên pattern
switch (enemy.movementPattern) {
  case 'linear':
    // Dự đoán tuyến tính đơn giản
    break;
    
  case 'curved':
    // Dự đoán chuyển động cong
    const curveFactor = Math.sin(Date.now() * 0.001) * 0.1;
    predicted = predicted.add(new Vector3(curveFactor, 0, curveFactor));
    break;
    
  case 'erratic':
    // Dự đoán chuyển động bất thường
    if (enemy.positionHistory.length >= 3) {
      const recent = enemy.positionHistory.slice(-3);
      const trend = recent[2].subtract(recent[0]).multiplyScalar(0.5);
      predicted = predicted.add(trend);
    }
    break;
}

// Áp dụng gravity compensation
predicted.y -= 9.81 * deltaTime * deltaTime * 0.5;

return predicted;


}

static calculateLeadTime(enemy, targetDistance) {
const projectileSpeed = 800; // m/s (tốc độ đạn)
const baseLeadTime = targetDistance / projectileSpeed;


// Điều chỉnh dựa trên movement pattern
let leadMultiplier = 1.0;
switch (enemy.movementPattern) {
  case 'erratic': leadMultiplier = 1.3; break;
  case 'curved': leadMultiplier = 1.1; break;
}

return baseLeadTime * leadMultiplier;


}
}

// === Fire-Triggered Aimbot chính ===
class FireTriggeredAimbot {
constructor() {
this.isActive = false;
this.currentTarget = null;
this.lockOnTarget = null;
this.smoothingQueue = [];
this.lastAimPosition = new Vector3();
this.recoilCounter = 0;
this.burstCounter = 0;
this.lastShotTime = 0;
this.activationTimer = null;
this.trackingInterval = null;

// Tích hợp BoneHeadBasedEnemyDetector
this.boneDetector = new BoneHeadBasedEnemyDetector({
  sensitivity: 0.001,
  smoothingFactor: 0.3,
  headLockRange: 9999
});

this.statistics = {
  shotsHired: 0,
  headshotsHit: 0,
  accuracy: 0,
  activations: 0
};

// Demo data
this.demoBoneHeads = [
  {
    matrix: {
      e00: -1.34559613E-13, e01: 8.881784E-14, e02: -1.0, e03: 0.487912,
      e10: -2.84512817E-06, e11: -1.0, e12: 8.881784E-14, e13: -2.842171E-14,
      e20: -1.0, e21: 2.84512817E-06, e22: -1.72951931E-13, e23: 0.0,
      e30: 0.0, e31: 0.0, e32: 0.0, e33: 1.0
    },
    bindpose: {
      position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
      rotation: { x: 0.0258174837, y: -0.08611039, z: -0.1402113, w: 0.9860321 },
      scale: { x: 0.99999994, y: 1.00000012, z: 1.0 }
    }
  }
];

this.crosshairPos = { x: 400, y: 300 };


}

// Hàm được gọi khi player bắn
onFirePressed() {
this.statistics.activations++;


// Kích hoạt aimbot trong khoảng thời gian nhất định
this.activateForDuration(AimbotConfig.fireActivationDuration);

console.log(`🔥 FIRE PRESSED! Aimbot activated for ${AimbotConfig.fireActivationDuration}ms`);

// Xử lý shooting logic
this.handleShooting();


}

// Kích hoạt aimbot trong thời gian nhất định
activateForDuration(duration) {
// Clear timer cũ nếu có
if (this.activationTimer) {
clearTimeout(this.activationTimer);
}


// Kích hoạt aimbot
if (!this.isActive) {
  this.isActive = true;
  this.startTracking();
}

// Tự động tắt sau thời gian nhất định
this.activationTimer = setTimeout(() => {
  this.deactivate();
}, duration);


}

// Tắt aimbot
deactivate() {
this.isActive = false;
this.stopTracking();
this.currentTarget = null;
this.lockOnTarget = null;


if (this.activationTimer) {
  clearTimeout(this.activationTimer);
  this.activationTimer = null;
}

console.log("⏹️  Aimbot deactivated");


}

// Bắt đầu tracking
startTracking() {
if (this.trackingInterval) return;


this.trackingInterval = setInterval(() => {
  if (this.isActive) {
    this.updateTracking();
  }
}, 8); // ~120 FPS để match với BoneDetector

console.log("🚀 Head tracking started");


}

// Dừng tracking
stopTracking() {
if (this.trackingInterval) {
clearInterval(this.trackingInterval);
this.trackingInterval = null;
}
}

// Cập nhật tracking logic chính
updateTracking() {
const enemies = this.scanForEnemies();


// Sử dụng BoneHeadBasedEnemyDetector
const crosshairRed = enemies.length > 0; // Giả sử có enemy thì crosshair đỏ
const detectionResult = this.boneDetector.process(this.demoBoneHeads, this.crosshairPos, crosshairRed);

if (detectionResult.locked && detectionResult.headInfo) {
  this.acquireTargetFromDetection(detectionResult);
  this.aimAtDetectedTarget(detectionResult);
} else {
  // Fallback to original enemy detection
  if (enemies.length === 0) {
    this.currentTarget = null;
    this.lockOnTarget = null;
    return;
  }
  
  const bestTarget = this.selectBestTarget(enemies);
  
  if (bestTarget && this.isValidTarget(bestTarget)) {
    this.acquireTarget(bestTarget);
    this.aimAtTarget();
    this.aimAtTarget();
  }
}


}

// Acquire target từ bone detection
acquireTargetFromDetection(detectionResult) {
const headInfo = detectionResult.headInfo;


// Convert detection result to Enemy format
const enemy = new Enemy({
  id: 'detected_enemy',
  bones: {
    bone_Head: new Vector3(headInfo.x, headInfo.y, headInfo.z)
  },
  velocity: new Vector3(0, 0, 0), // Sẽ được tính từ history
  health: 100
});

this.currentTarget = enemy;
this.lockOnTarget = enemy;


}

// Aim at detected target
aimAtDetectedTarget(detectionResult) {
const aimAssist = detectionResult.aimAssist;
if (!aimAssist) return;


// Convert aim assist to world position
const targetPos = new Vector3(
  aimAssist.predicted.x,
  aimAssist.predicted.y,
  aimAssist.predicted.z || 0
);

// Apply smoothing
const smoothedPos = this.applySmoothAiming(targetPos);

// Apply recoil compensation
const finalPos = this.applyRecoilCompensation(smoothedPos);

this.aimAt(finalPos);
this.lastAimPosition = finalPos;

console.log(`🎯 BoneDetector Aim: (${finalPos.x.toFixed(3)}, ${finalPos.y.toFixed(3)}, ${finalPos.z.toFixed(3)})`);


}

// Quét tìm kẻ địch (mô phỏng)

  // Quét tìm kẻ địch (mô phỏng)
  scanForEnemies() {
    const now = Date.now();

    return [
      new Enemy({
        id: 1,
        bones: {
          bone_Head: new Vector3(0.3 + Math.sin(now * 0.002) * 0.1, 1.5, -2.0),
          bone_Neck: new Vector3(0.3, 1.4, -2.0),
          bone_Chest: new Vector3(0.3, 1.2, -2.0)
        },
        velocity: new Vector3(Math.cos(now * 0.001) * 0.5, 0, 0.1),
        health: 85
      }),

      new Enemy({
        id: 2,
        bones: {
          bone_Head: new Vector3(-0.5 + Math.sin(now * 0.001) * 0.1, 1.6, -3.5),
          bone_Neck: new Vector3(-0.5, 1.5, -3.5),
          bone_Chest: new Vector3(-0.5, 1.3, -3.5)
        },
        velocity: new Vector3(Math.cos(now * 0.002) * 0.3, 0, -0.2),
        health: 60
      }),

      new Enemy({
        id: 3,
        bones: {
          bone_Head: new Vector3(0.0 + Math.cos(now * 0.001) * 0.05, 1.55, -1.8),
          bone_Neck: new Vector3(0.0, 1.45, -1.8),
          bone_Chest: new Vector3(0.0, 1.25, -1.8)
        },
        velocity: new Vector3(0.1, 0, 0),
        health: 100
      })
    ];
  }
  aimAt(pos) {
    console.log(`🎯 Aiming at (${pos.x.toFixed(3)}, ${pos.y.toFixed(3)}, ${pos.z.toFixed(3)})`);
  }

  handleShooting() {
    if (!AimbotConfig.burstMode) return this.shoot();

    let count = 0;
    const interval = setInterval(() => {
      if (!this.isActive || count >= AimbotConfig.burstCount) return clearInterval(interval);
      this.shoot(); count++;
    }, AimbotConfig.burstDelay);
  }

  shoot() {
    this.recoilCounter++;
    console.log("🔫 Shot fired");
  }

    getDemoBoneHeads() {
    return [{
      matrix: {
        e00: 1, e01: 0, e02: 0, e03: 0.5,
        e10: 0, e11: 1, e12: 0, e13: 1.5,
        e20: 0, e21: 0, e22: 1, e23: 0,
        e30: 0, e31: 0, e32: 0, e33: 1
      },
      bindpose: {
        position: { x: -0.045, y: -0.0044, z: -0.02 },
        rotation: { x: 0, y: 0, z: 0, w: 1 },
        scale: { x: 1, y: 1, z: 1 }
      }
    }];
  }

  // Làm mượt chuyển động tới target
  applySmoothAiming(targetPos) {
    const smoothingFactor = 0.3;

    if (!this.lastAimPosition) {
      this.lastAimPosition = targetPos;
      return targetPos;
    }

    const smoothed = new Vector3(
      this.lastAimPosition.x + (targetPos.x - this.lastAimPosition.x) * smoothingFactor,
      this.lastAimPosition.y + (targetPos.y - this.lastAimPosition.y) * smoothingFactor,
      this.lastAimPosition.z + (targetPos.z - this.lastAimPosition.z) * smoothingFactor
    );

    this.lastAimPosition = smoothed;
    return smoothed;
  }

  applyRecoilCompensation(pos) {
    const recoilCompensationAmount = 0.01 * this.recoilCounter;

    return new Vector3(
      pos.x,
      pos.y - recoilCompensationAmount,
      pos.z
    );
  }
}
// === Auto Run in Shadowrocket ===
const aimbot = new FireTriggeredAimbot();
setInterval(() => {
  aimbot.onFirePressed();
}, 1000);
const GamePackages = {
  GamePackage1: "com.dts.freefireth",
  GamePackage2: "com.dts.freefiremax"
};

// ==================== ENHANCED ENEMY DETECTION SYSTEM ====================
const EnemyDetectionSystem = {
  enemies: new Map(),
  maxDistance: 99999,
  
  // Phát hiện enemy trong tầm
  scanForEnemies() {
    // Giả lập API quét enemy - thay bằng API thực tế
    const detectedEnemies = [
      {
        id: "enemy_001",
        position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
        health: 100,
        isVisible: true,
        distance: 99999.0,
        velocity: { x: 0.1, y: 0, z: -0.05 }
      },
      {
        id: "enemy_002", 
        position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
        health: 80,
        isVisible: true,
        distance: 99999.0,
        velocity: { x: 0, y: 0, z: 0.2 }
      }
    ];
    
    // Cập nhật danh sách enemy
    this.enemies.clear();
    detectedEnemies.forEach(enemy => {
      if (enemy.distance <= this.maxDistance && enemy.isVisible && enemy.health > 0) {
        this.enemies.set(enemy.id, enemy);
      }
    });
    
    return this.enemies;
  },
  
  // Tìm enemy gần nhất
  getNearestEnemy() {
    let nearest = null;
    let minDistance = Infinity;
    
    for (const [id, enemy] of this.enemies) {
      if (enemy.distance < minDistance) {
        minDistance = enemy.distance;
        nearest = enemy;
      }
    }
    
    return nearest;
  },
  
  // Tìm enemy nguy hiểm nhất (gần + có vũ khí + đang ngắm)
  getMostDangerousEnemy() {
    let mostDangerous = null;
    let maxThreat = 0;
    
    for (const [id, enemy] of this.enemies) {
      // Tính điểm threat (gần + sức khỏe + tốc độ di chuyển)
      const threatScore = (100 - enemy.distance) + (enemy.health * 0.5) + 
                         (Math.sqrt(enemy.velocity.x**2 + enemy.velocity.z**2) * 10);
      
      if (threatScore > maxThreat) {
        maxThreat = threatScore;
        mostDangerous = enemy;
      }
    }
    
    return mostDangerous;
  }
};

// ==================== ADVANCED KALMAN FILTER ====================
const AdvancedKalmanFilter = {
  // Khởi tạo cho từng enemy
  filters: new Map(),
  
  createFilter(enemyId) {
    return {
      // State: [x, y, z, vx, vy, vz]
      state: [0, 0, 0, 0, 0, 0],
      covariance: [
        [1, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0], 
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 1]
      ],
      processNoise: 0.001,
      measurementNoise: 0.01,
      dt: 0.016 // 60 FPS
    };
  },
  
  getFilter(enemyId) {
    if (!this.filters.has(enemyId)) {
      this.filters.set(enemyId, this.createFilter(enemyId));
    }
    return this.filters.get(enemyId);
  },
  
  predict(filter) {
    const dt = filter.dt;
    
    // Prediction step
    filter.state[0] += filter.state[3] * dt; // x += vx * dt
    filter.state[1] += filter.state[4] * dt; // y += vy * dt  
    filter.state[2] += filter.state[5] * dt; // z += vz * dt
    
    // Increase uncertainty
    for (let i = 0; i < 6; i++) {
      filter.covariance[i][i] += filter.processNoise;
    }
    
    return {
      x: filter.state[0],
      y: filter.state[1], 
      z: filter.state[2]
    };
  },
  
  update(filter, measurement) {
    // Update với measurement mới
    const innovation = [
      measurement.x - filter.state[0],
      measurement.y - filter.state[1],
      measurement.z - filter.state[2]
    ];
    
    // Simplified Kalman gain calculation
    const gain = filter.covariance[0][0] / (filter.covariance[0][0] + filter.measurementNoise);
    
    // Update state
    filter.state[0] += gain * innovation[0];
    filter.state[1] += gain * innovation[1]; 
    filter.state[2] += gain * innovation[2];
    
    // Update covariance
    const newCov = (1 - gain) * filter.covariance[0][0];
    for (let i = 0; i < 3; i++) {
      filter.covariance[i][i] = newCov;
    }
    
    return {
      x: filter.state[0],
      y: filter.state[1],
      z: filter.state[2]
    };
  }
};

// ==================== ENHANCED HEAD TRACKER ====================
const EnhancedHeadTracker = {
  currentTarget: null,
  lockEnabled: true,
  smoothing: 0.85,
  predictionTime: 0.001, // Dự đoán 100ms trước
  
  // Bone Head configuration
  boneHeadConfig: {
    bindPose: {
      e00: -1.34559613E-13, e01: 8.881784E-14, e02: -1.0, e03: 0.487912,
      e10: -2.84512817E-06, e11: -1.0, e12: 8.881784E-14, e13: -2.842171E-14,
      e20: -1.0, e21: 2.84512817E-06, e22: -1.72951931E-13, e23: 0.0,
      e30: 0.0, e31: 0.0, e32: 0.0, e33: 1.0
    },
    offset: { x:  -0.04089227, y: 0.00907892, z: 0.02748467 } // Offset để ngắm chính xác hơn
  },
  
  // Ma trận toán học
  quaternionToMatrix(q) {
    const { x, y, z, w } = q;
    return [
      1 - 2*y*y - 2*z*z, 2*x*y - 2*z*w,     2*x*z + 2*y*w,     0,
      2*x*y + 2*z*w,     1 - 2*x*x - 2*z*z, 2*y*z - 2*x*w,     0,
      2*x*z - 2*y*w,     2*y*z + 2*x*w,     1 - 2*x*x - 2*y*y, 0,
      0, 0, 0, 1
    ];
  },
  
  multiplyMatrix4x4(A, B) {
    const result = Array(4).fill(0).map(() => Array(4).fill(0));
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 4; k++) {
          result[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    return result;
  },
  
  // Tính toán vị trí head world
  calculateHeadWorldPosition(enemy) {
    const bp = this.boneHeadConfig.bindPose;
    const bindMatrix = [
      [bp.e00, bp.e01, bp.e02, bp.e03],
      [bp.e10, bp.e11, bp.e12, bp.e13], 
      [bp.e20, bp.e21, bp.e22, bp.e23],
      [bp.e30, bp.e31, bp.e32, bp.e33]
    ];
    
    // Giả sử có transform của enemy (cần API thực tế)
    const enemyTransform = [
      [1, 0, 0, enemy.position.x],
      [0, 1, 0, enemy.position.y],
      [0, 0, 1, enemy.position.z],
      [0, 0, 0, 1]
    ];
    
    const worldMatrix = this.multiplyMatrix4x4(bindMatrix, enemyTransform);
    
    return {
      x: worldMatrix[0][3] + this.boneHeadConfig.offset.x,
      y: worldMatrix[1][3] + this.boneHeadConfig.offset.y,
      z: worldMatrix[2][3] + this.boneHeadConfig.offset.z
    };
  },
  
  // Dự đoán vị trí tương lai
  predictFuturePosition(enemy, deltaTime) {
    const headPos = this.calculateHeadWorldPosition(enemy);
    
    return {
      x: headPos.x + enemy.velocity.x * deltaTime,
      y: headPos.y + enemy.velocity.y * deltaTime,
      z: headPos.z + enemy.velocity.z * deltaTime
    };
  },
  
  // Tính bullet drop compensation
  calculateBulletDrop(distance, bulletSpeed = 800) {
    const gravity = 9.81;
    const timeToTarget = distance / bulletSpeed;
    const drop = 0.5 * gravity * timeToTarget * timeToTarget;
    return drop * 0.001; // Scale factor cho game
  },
  
  // Main tracking function
  trackEnemy(enemy) {
    if (!enemy || !this.lockEnabled) return null;
    
    // Lấy Kalman filter cho enemy này
    const filter = AdvancedKalmanFilter.getFilter(enemy.id);
    
    // Dự đoán vị trí
    const predicted = AdvancedKalmanFilter.predict(filter);
    
    // Tính vị trí head thực tế
    const actualHead = this.calculateHeadWorldPosition(enemy);
    
    // Cập nhật filter với measurement thực tế
    const filtered = AdvancedKalmanFilter.update(filter, actualHead);
    
    // Dự đoán vị trí tương lai
    const futurePos = this.predictFuturePosition(enemy, this.predictionTime);
    
    // Tính bullet drop compensation
    const bulletDrop = this.calculateBulletDrop(enemy.distance);
    
    // Vị trí ngắm cuối cùng
    const aimPosition = {
      x: futurePos.x,
      y: futurePos.y + bulletDrop,
      z: futurePos.z
    };
    
    return aimPosition;
  },
  
  // Set crosshair target
  setAim(position) {
    if (!position) return;
    
    console.log(`🎯 LOCK HEAD: ${position.x.toFixed(4)}, ${position.y.toFixed(4)}, ${position.z.toFixed(4)}`);
    
    // Thay bằng API thực tế
    if (typeof GameAPI !== 'undefined' && GameAPI.setCrosshairTarget) {
      GameAPI.setCrosshairTarget(position.x, position.y, position.z);
    }
  }
};

// ==================== RECOIL COMPENSATION SYSTEM ====================
const RecoilCompensation = {
  weaponProfiles: {
    ak47: { x: 0.0003, y: 0.0008, z: 0.0001 },
    m4a1: { x: 0.0002, y: 0.0006, z: 0.00008 },
    awm: { x: 0.0001, y: 0.0004, z: 0.00005 },
    default: { x: 0.0002, y: 0.0005, z: 0.00007 }
  },
  
  currentWeapon: 'default',
  
  getCompensation() {
    return this.weaponProfiles[this.currentWeapon] || this.weaponProfiles.default;
  },
  
  applyCompensation(aimPos) {
    const comp = this.getCompensation();
    return {
      x: aimPos.x - comp.x,
      y: aimPos.y - comp.y,
      z: aimPos.z - comp.z
    };
  }
};

// ==================== MASTER HEAD TRACKING SYSTEM ====================
const MasterHeadTrackingSystem = {
  isActive: true,
  targetPriority: 'nearest', // 'nearest', 'dangerous', 'lowest_health'
  lastUpdate: Date.now(),
  
  // Target selection strategies
  selectTarget() {
    const enemies = EnemyDetectionSystem.scanForEnemies();
    if (enemies.size === 0) return null;
    
    switch (this.targetPriority) {
      case 'nearest':
        return EnemyDetectionSystem.getNearestEnemy();
      case 'dangerous':
        return EnemyDetectionSystem.getMostDangerousEnemy();
      case 'lowest_health':
        return this.getLowestHealthEnemy(enemies);
      default:
        return EnemyDetectionSystem.getNearestEnemy();
    }
  },
  
  getLowestHealthEnemy(enemies) {
    let lowestHealth = null;
    let minHealth = Infinity;
    
    for (const [id, enemy] of enemies) {
      if (enemy.health < minHealth) {
        minHealth = enemy.health;
        lowestHealth = enemy;
      }
    }
    
    return lowestHealth;
  },
  
  // Main update loop
  update() {
    if (!this.isActive) return;
    
    const now = Date.now();
    const deltaTime = (now - this.lastUpdate) / 1000;
    this.lastUpdate = now;
    
    // Chọn target
    const target = this.selectTarget();
    if (!target) {
      console.log("🚫 No valid targets found");
      return;
    }
    
    // Track enemy head
    const aimPosition = EnhancedHeadTracker.trackEnemy(target);
    if (!aimPosition) return;
    
    // Apply recoil compensation
    const compensatedAim = RecoilCompensation.applyCompensation(aimPosition);
    
    // Set aim
    EnhancedHeadTracker.setAim(compensatedAim);
    
    // Debug info
    console.log(`📡 Tracking: ${target.id} | Distance: ${target.distance.toFixed(1)}m | Health: ${target.health}%`);
  },
  
  // Control methods
  enable() {
    this.isActive = true;
    console.log("✅ Head Tracking ENABLED");
  },
  
  disable() {
    this.isActive = false;
    console.log("❌ Head Tracking DISABLED");
  },
  
  setPriority(priority) {
    this.targetPriority = priority;
    console.log(`🎯 Priority set to: ${priority}`);
  },
  
  setWeapon(weaponName) {
    RecoilCompensation.currentWeapon = weaponName;
    console.log(`🔫 Weapon set to: ${weaponName}`);
  }
};

// ==================== ADVANCED AUTO AIM SYSTEM ====================
const AdvancedAutoAimSystem = {
  systems: [
    { system: MasterHeadTrackingSystem, method: 'update', priority: 1 }
  ],
  
  isRunning: false,
  updateInterval: 16, // 60 FPS
  
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log("🚀 Advanced Auto Aim System STARTED");
    
    this.intervalId = setInterval(() => {
      this.systems.forEach(({ system, method }) => {
        try {
          system[method]();
        } catch (error) {
          console.error(`Error in ${system.constructor.name}.${method}:`, error);
        }
      });
    }, this.updateInterval);
  },
  
  stop() {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    clearInterval(this.intervalId);
    console.log("⏹️ Advanced Auto Aim System STOPPED");
  },
  
  // Hot-reload configuration
  reloadConfig() {
    console.log("🔄 Reloading configuration...");
    AdvancedKalmanFilter.filters.clear();
    EnemyDetectionSystem.enemies.clear();
  }
};

// ==================== CONTROL INTERFACE ====================
const AimBotController = {
  // Quick controls
  toggle() {
    if (MasterHeadTrackingSystem.isActive) {
      MasterHeadTrackingSystem.disable();
    } else {
      MasterHeadTrackingSystem.enable();
    }
  },
  
  setTargetMode(mode) {
    MasterHeadTrackingSystem.setPriority(mode);
  },
  
  setWeapon(weapon) {
    MasterHeadTrackingSystem.setWeapon(weapon);
  },
  
  // System controls
  start() {
    AdvancedAutoAimSystem.start();
  },
  
  stop() {
    AdvancedAutoAimSystem.stop();
  },
  
  // Configuration
  configure(options) {
    if (options.maxDistance) EnemyDetectionSystem.maxDistance = options.maxDistance;
    if (options.predictionTime) EnhancedHeadTracker.predictionTime = options.predictionTime;
    if (options.smoothing) EnhancedHeadTracker.smoothing = options.smoothing;
    if (options.updateRate) AdvancedAutoAimSystem.updateInterval = 1000 / options.updateRate;
    
    console.log("⚙️ Configuration updated:", options);
  }
};

// ==================== KHỞI CHẠY HỆ THỐNG ====================
// Tự động khởi chạy hệ thống
console.log("🎮 Initializing Advanced Head Tracking System...");

// Cấu hình mặc định
AimBotController.configure({
  maxDistance: 99999,
  predictionTime: 0.12,
  smoothing: 0.9,
  updateRate: 60
});

// Khởi chạy
AimBotController.start();

// ===== Vector3 =====
function Vector3(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}
Vector3.prototype.subtract = function(v) {
  return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
};
Vector3.prototype.magnitude = function() {
  return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z);
};
Vector3.prototype.normalize = function() {
  var mag = this.magnitude();
  if (mag === 0) return new Vector3(0,0,0);
  return new Vector3(this.x/mag, this.y/mag, this.z/mag);
};
Vector3.prototype.add = function(v) {
  return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
};

// ===== Kalman Filter =====
function KalmanFilter(r, q) {
  this.r = r || 0.01;
  this.q = q || 0.1;
  this.p = 1;
  this.x = 0;
  this.k = 0;
}
KalmanFilter.prototype.filter = function(value) {
  this.p += this.q;
  this.k = this.p / (this.p + this.r);
  this.x += this.k * (value - this.x);
  this.p *= (1 - this.k);
  return this.x;
};

// ===== Race Config =====
var RaceConfig = {
  raceName: "BaseMale",
  headBone: "bone_Head",
  bodyBones: ["bone_Chest", "bone_Spine", "bone_Legs", "bone_Feet"],
  sensitivity: 9999.0,
  height: 2.0,
  radius: 0.25,
  mass: 50.0
};

// ===== Aim System =====
var AimSystem = {
  getBonePos: function(enemy, bone) {
    if (!enemy || !enemy.bones) return new Vector3(0,0,0);
    return enemy.bones[bone] || new Vector3(0,0,0);
  },
  lockToHead: function(player, enemy) {
    var head = this.getBonePos(enemy, RaceConfig.headBone);
    var dir = head.subtract(player.position).normalize();
    player.crosshairDir = dir;
  },
  applyRecoilFix: function(player) {
    var fix = 0.1;
    player.crosshairDir = player.crosshairDir.add(new Vector3(0, -fix, 0)).normalize();
  },
  adjustDrag: function(player, targetBone) {
    var sens = 9999.0;
    if (targetBone === "head") sens *= 1.0;
    if (targetBone === "body") sens *= 9999.3;
    player.dragForce = sens;
  }
};

// ===== Auto Head Lock =====
function AutoHeadLock() {
  this.kalmanX = new KalmanFilter();
  this.kalmanY = new KalmanFilter();
  this.kalmanZ = new KalmanFilter();
}
AutoHeadLock.prototype.getBone = function(enemy, boneName) {
  if (!enemy || !enemy.bones) return new Vector3(0,0,0);
  return enemy.bones[boneName] || new Vector3(0,0,0);
};
AutoHeadLock.prototype.detectClosestBone = function(player, enemy) {
  var minDist = 1e9, closest = null;
  var allBones = [RaceConfig.headBone].concat(RaceConfig.bodyBones);
  for (var i = 0; i < allBones.length; i++) {
    var bone = allBones[i];
    var pos = this.getBone(enemy, bone);
    var dist = pos.subtract(player.position).magnitude();
    if (dist < minDist) { minDist = dist; closest = bone; }
  }
  return closest;
};
AutoHeadLock.prototype.lockCrosshair = function(player, enemy) {
  if (!enemy) return;
  var targetBone = this.detectClosestBone(player, enemy);
  var bonePos = this.getBone(enemy, targetBone);
  var dir = bonePos.subtract(player.position).normalize();
  dir.x = this.kalmanX.filter(dir.x);
  dir.y = this.kalmanY.filter(dir.y);
  dir.z = this.kalmanZ.filter(dir.z);
  player.crosshairDir = dir;
};
var AimLockSystem = {
  // ==========================
  // 0. Config
  // ==========================
  config: {
    sensitivity: 9999.0,         // Độ nhạy kéo tâm
    lockSpeed: 2.0,              // Tốc độ hút tâm
    prediction: true,            // Bật dự đoán chuyển động
    tracking: true,              // Theo dõi liên tục
    fov: 360,                    // Góc nhìn để aim
    autoFire: false,             // Tự động bắn khi lock trúng
    priority: "nearest",         // nearest | lowestHP | first
    boneOffset: { x: 0, y: -0.0004, z: 0 } // Dịch lên đầu (head clamp)
  },

  // ==========================
  // 1. Phát hiện mục tiêu
  // ==========================
  detectTarget: function (enemies, playerPos) {
    var visible = [];
    for (var i = 0; i < enemies.length; i++) {
      var e = enemies[i];
      if (e.isVisible && e.health > 0) visible.push(e);
    }

    var prio = this.config.priority;
    visible.sort(function (a, b) {
      if (prio === "nearest") {
        return AimLockSystem.distance(playerPos, a.position) - AimLockSystem.distance(playerPos, b.position);
      } else if (prio === "lowestHP") {
        return a.health - b.health;
      } else {
        return 0;
      }
    });

    return visible;
  },

  // ==========================
  // 2. Khóa mục tiêu (Lock-On)
  // ==========================
  lockTarget: function (target) {
    if (!target) return;
    var pos = this.applyHeadClamp(target.position);
    this.aimlockScreenTap(pos);
  },

  // ==========================
  // 3. Tracking (Theo dõi liên tục)
  // ==========================
  updateTargetPosition: function (target) {
    if (!target) return;
    var predicted = this.config.prediction ? this.predictPosition(target) : target.position;
    var clamped = this.applyHeadClamp(predicted);
    this.aimlockScreenTap(clamped);
  },

  // ==========================
  // 4. Prediction (dự đoán di chuyển)
  // ==========================
  predictPosition: function (target) {
    var velocity = target.velocity || {x:0,y:0,z:0};
    return {
      x: target.position.x + velocity.x * 0.1,
      y: target.position.y + velocity.y * 0.1,
      z: target.position.z + velocity.z * 0.1
    };
  },

  // ==========================
  // 5. Clamp vào Head Bone
  // ==========================
  applyHeadClamp: function (pos) {
    return {
      x: pos.x + this.config.boneOffset.x,
      y: pos.y + this.config.boneOffset.y,
      z: pos.z + this.config.boneOffset.z
    };
  },

  // ==========================
  // 6. Điều khiển chạm màn hình
  // ==========================
  aimlockScreenTap: function (screenPos) {
    // PAC không có console.log, nên chỉ mô phỏng
    // (Crosshair moving to:)
  },

  // ==========================
  // 7. Vòng lặp chính Aimlock
  // ==========================
  aimlockLoop: function (enemies, player) {
    var targets = this.detectTarget(enemies, player.position);
    if (targets.length > 0) {
      var mainTarget = targets[0];
      this.lockTarget(mainTarget);
      if (this.config.tracking) {
        this.updateTargetPosition(mainTarget);
      }
      if (this.config.autoFire) {
        // Auto fire nếu bật (giả lập)
      }
    }
  },

  // ==========================
  // Helper: Tính khoảng cách
  // ==========================
  distance: function (a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
};
const AimNeckConfig = {
  name: "AimNeckSystem",
  enabled: true,

  config: {
    sensitivity: 9999.0,         // Độ nhạy di chuyển tâm
    lockSpeed: 9999.0,             // Tốc độ hút tâm (1 = tức thì)
    prediction: true,            // Bật dự đoán vị trí cổ
    tracking: true,              // Theo dõi liên tục
    fov: 360,                    // Góc quét tìm mục tiêu
    autoFire: false,             // Bắn tự động khi lock
    aimBone: "bone_Neck",        // Vùng cổ mặc định
    headAssist: true,            // Nếu kéo lên trên, auto hút vào đầu
    screenTapEnabled: true,      // Điều khiển chạm màn hình
    clamp: { minY: 0, maxY: 0 }, // Giới hạn lock (không vượt quá đầu)

    // Thêm offset để dễ chỉnh từ cổ sang đầu
    boneOffset: { x: 0, y: 0.22, z: 0 } 
  },

  // 1. Phát hiện vị trí cổ
  detectNeckTarget(enemies) {
    return enemies.filter(e => e.isVisible && e.health > 0)
                  .map(e => ({ 
                     enemy: e, 
                     neckPos: this.getBonePosition(e, this.config.aimBone) 
                  }))
  },

  // Giả lập lấy vị trí bone cổ từ nhân vật
  getBonePosition(enemy, bone) {
    let base = enemy.bones && enemy.bones[bone] ? enemy.bones[bone] : enemy.position
    // Áp dụng offset để dễ kéo sang đầu
    return {
      x: base.x + this.config.boneOffset.x,
      y: base.y + this.config.boneOffset.y,
      z: base.z + this.config.boneOffset.z
    }
  },

  // 2. Prediction: dự đoán di chuyển cổ
  predictNeckPosition(target) {
    let velocity = target.enemy.velocity || {x:0,y:0,z:0}
    return {
      x: target.neckPos.x + velocity.x * 0.1,
      y: target.neckPos.y + velocity.y * 0.1,
      z: target.neckPos.z + velocity.z * 0.1
    }
  },

  // 3. Tính toán hướng để nhắm cổ
  calculateAimDirection(playerPos, targetPos) {
    return {
      x: targetPos.x - playerPos.x,
      y: targetPos.y - playerPos.y,
      z: targetPos.z - playerPos.z
    }
  },

  // 4. Điều khiển drag/tap màn hình
  screenTapTo(targetPos) {
    if (this.config.screenTapEnabled) {
      console.log("Screen tap/drag tới:", targetPos)
    }
  },

  // Áp dụng aimlock (dịch chuyển crosshair)
  applyAimLock(direction) {
    console.log("AimLock hướng tới:", direction)
  },

  // 5. Aimneck Loop
  run(player, enemies) {
    if (!this.enabled) return
    let targets = this.detectNeckTarget(enemies)
    if (targets.length === 0) return

    let target = targets[0]
    let lockPos = this.config.prediction ? this.predictNeckPosition(target) : target.neckPos
    
    let dir = this.calculateAimDirection(player.position, lockPos)

    // Giới hạn: không vượt quá đầu
    if (this.config.headAssist) {
      if (dir.y > this.config.clamp.maxY) dir.y = this.config.clamp.maxY
      if (dir.y < this.config.clamp.minY) dir.y = this.config.clamp.minY
    }

    this.applyAimLock(dir)
    this.screenTapTo(lockPos)
  }
}
   
    const FeatherDragHeadLock = {
    enabled: true,
    headBone: "bone_Head",

    sensitivityBoost: 99999.0,   // drag siêu nhẹ (càng cao càng nhạy)
    smoothFactor: 0.0,      // tốc độ hút về đầu (0.1 = chậm, 0.3 = nhanh)
    snapThreshold: 9999.0,     // khoảng cách auto hút hẳn vào đầu
boneOffset: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
        rotationOffset: { x: 0.0258174837, y: -0.08611039, z: -0.1402113, w: 0.9860321 },
        scale: { x: 1.0, y: 1.0, z: 1.0 },
    apply: function(player, enemy) {
        if (!this.enabled || !enemy || !enemy.isAlive) return;

        let aimPos = player.crosshair.position;
        let headPos = enemy.getBonePosition(this.headBone);

        // vector chênh lệch
        let dx = headPos.x - aimPos.x;
        let dy = headPos.y - aimPos.y;
        let dz = headPos.z - aimPos.z;
        let dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

        // Nếu crosshair lọt vào vùng snap → lock thẳng vào đầu
        if (dist < this.snapThreshold) {
            player.crosshair.position = { ...headPos };
            player.crosshair.lockedBone = this.headBone;
            console.log(`[FeatherDragHeadLock] 🎯 LOCK thẳng vào ${this.headBone}`);
            return;
        }

        // Luôn kéo crosshair nhẹ nhàng hướng về đầu
        player.crosshair.position = {
            x: aimPos.x + dx * this.smoothFactor * this.sensitivityBoost,
            y: aimPos.y + dy * this.smoothFactor * this.sensitivityBoost,
            z: aimPos.z + dz * this.smoothFactor * this.sensitivityBoost
        };

        console.log(`[FeatherDragHeadLock] ✨ Auto hút về ${this.headBone}, dist=${dist.toFixed(3)}`);
    }
};

// vòng lặp update
Game.on("update", () => {
    if (localPlayer.isDragging && FeatherDragHeadLock.enabled) {
        FeatherDragHeadLock.apply(localPlayer, HeadLockAim.currentTarget);
    }
});
    const NoOverHeadDrag = {
    enabled: true,
    headBone: "bone_Head",
    clampYOffset: 0.0,   // cho phép cao hơn đầu bao nhiêu (0 = tuyệt đối không vượt)
boneOffset: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
        rotationOffset: { x: 0.0258174837, y: -0.08611039, z: -0.1402113, w: 0.9860321 },
        scale: { x: 1.0, y: 1.0, z: 1.0 },
    apply: function(player, enemy) {
        if (!this.enabled || !enemy || !enemy.isAlive) return;

        let aimPos = player.crosshair.position;
        let headPos = enemy.getBonePosition(this.headBone);

        // Nếu y của crosshair cao hơn đầu
        if (aimPos.y > headPos.y + this.clampYOffset) {
            player.crosshair.position = {
                x: aimPos.x,                // giữ X (ngang)
                y: headPos.y + this.clampYOffset, // ghim trần Y tại đầu
                z: aimPos.z                 // giữ Z (sâu)
            };

            console.log(`[NoOverHeadDrag] ⛔ Giới hạn drag, crosshair không vượt quá ${this.headBone}`);
        }
    }
};

// Vòng lặp update
Game.on("update", () => {
    if (localPlayer.isDragging && NoOverHeadDrag.enabled) {
        NoOverHeadDrag.apply(localPlayer, HeadLockAim.currentTarget);
    }
});
    const DragHeadLockStabilizer = {
    enabled: true,
    headBone: "bone_Head",
boneOffset: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
        rotationOffset: { x: 0.0258174837, y: -0.08611039, z: -0.1402113, w: 0.9860321 },
        scale: { x: 1.0, y: 1.0, z: 1.0 },
    lockZone: {
        toleranceX: 0.0,   // độ lệch ngang cho phép khi drag
        toleranceY: 0.0    // độ lệch dọc cho phép khi drag
    },

    stabilize: function(player, enemy) {
        if (!this.enabled || !enemy || !enemy.isAlive) return;

        let aimPos = player.crosshair.position;
        let headPos = enemy.getBonePosition(this.headBone);

        let dx = Math.abs(aimPos.x - headPos.x);
        let dy = Math.abs(aimPos.y - headPos.y);

        // Debug log
        console.log(`[DragHeadLockStabilizer] dx=${dx.toFixed(4)}, dy=${dy.toFixed(4)}`);

        // Nếu crosshair đang drag trong vùng "hút đầu"
        if (dx < this.lockZone.toleranceX && dy < this.lockZone.toleranceY) {
            // Ghìm tâm ngay tại vị trí đầu
            player.crosshair.position = {
                x: headPos.x,
                y: headPos.y,
                z: headPos.z
            };

            player.crosshair.lockedBone = this.headBone;
            console.log(`[DragHeadLockStabilizer] ✅ GHÌM TẠI ĐẦU (${this.headBone})`);
        }
    }
};

// vòng lặp update
Game.on("update", () => {
    if (localPlayer.isDragging && DragHeadLockStabilizer.enabled) {
        DragHeadLockStabilizer.stabilize(localPlayer, HeadLockAim.currentTarget);
    }
});
    const SmartBoneAutoHeadLock = {
    enabled: true,
    mode: "aggressive",   // "normal" | "aggressive"
    triggerBones: [
        "bone_LeftClav",
        "bone_RightClav",
        "bone_Neck",
        "bone_Hips"
    ],
    headBone: "bone_Head",
boneOffset: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
        rotationOffset: { x: 0.0258174837, y: -0.08611039, z: -0.1402113, w: 0.9860321 },
        scale: { x: 1.0, y: 1.0, z: 1.0 },
    // --- Config mặc định (Normal) ---
    lockTolerance: 0.02,       // vùng hút cơ bản
    maxYOffset: 0.0,         // không lố đầu
    maxRotationDiff: 0.001,     // giới hạn sai lệch góc quay
    maxOffsetDiff: 0.0001,       // giới hạn sai lệch offset

    // --- Config Aggressive Mode ---
    aggressive: {
        lockTolerance: 0.0001,   // rộng hơn, dễ hút hơn
        maxYOffset: 0.0,      // cho phép bù y cao hơn
        maxRotationDiff: 0.001,  // cho phép sai lệch nhiều hơn
        maxOffsetDiff: 0.001     // offset xa vẫn hút
    },

    checkAndLock: function(player, enemy) {
        if (!this.enabled || !enemy || !enemy.isAlive) return;

        let cfg = (this.mode === "aggressive") ? this.aggressive : this;

        let aimPos = player.crosshair.position;
        let headPos = enemy.getBonePosition(this.headBone);
        let headData = enemy.getBoneData(this.headBone); // {position, rotation}

        for (let bone of this.triggerBones) {
            let bonePos = enemy.getBonePosition(bone);
            let boneData = enemy.getBoneData(bone);

            let offsetDiff = Math.sqrt(
                Math.pow(bonePos.x - headPos.x, 2) +
                Math.pow(bonePos.y - headPos.y, 2) +
                Math.pow(bonePos.z - headPos.z, 2)
            );

            let dot =
                headData.rotation.x * boneData.rotation.x +
                headData.rotation.y * boneData.rotation.y +
                headData.rotation.z * boneData.rotation.z +
                headData.rotation.w * boneData.rotation.w;
            let rotationDiff = 1 - Math.abs(dot);

            let dx = Math.abs(aimPos.x - bonePos.x);
            let dy = Math.abs(aimPos.y - bonePos.y);

            // Debug
            console.log(`[SmartBoneAutoHeadLock][${this.mode}] bone=${bone}, dx=${dx.toFixed(4)}, dy=${dy.toFixed(4)}, offsetDiff=${offsetDiff.toFixed(4)}, rotationDiff=${rotationDiff.toFixed(4)}`);

            if (
                dx < cfg.lockTolerance &&
                dy < cfg.lockTolerance &&
                offsetDiff < cfg.maxOffsetDiff &&
                rotationDiff < cfg.maxRotationDiff
            ) {
                let clampedY = Math.min(headPos.y, aimPos.y + cfg.maxYOffset);

                player.crosshair.position = {
                    x: headPos.x,
                    y: clampedY,
                    z: headPos.z
                };

                player.crosshair.lockedBone = this.headBone;
                console.log(`[SmartBoneAutoHeadLock][${this.mode}] ✅ LOCKED to ${this.headBone} (triggered by ${bone})`);
                return;
            }
        }
    }
};

// vòng lặp update
Game.on("update", () => {
    if (localPlayer.isDragging && SmartBoneAutoHeadLock.enabled) {
        SmartBoneAutoHeadLock.checkAndLock(localPlayer, HeadLockAim.currentTarget);
    }
});
    const HeadLockClamp = {
    enabled: true,
    targetBone: "Head",
    maxYOffset: 0.0,   // Giới hạn lệch lên trên đầu (mét) - càng nhỏ càng khít
boneOffset: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
        rotationOffset: { x: 0.0258174837, y: -0.08611039, z: -0.1402113, w: 0.9860321 },
        scale: { x: 1.0, y: 1.0, z: 1.0 },
    clampAim: function(player, enemy) {
        if (!this.enabled || !enemy || !enemy.isAlive) return;

        let headPos = enemy.getBonePosition(this.targetBone);
        let aimPos = player.crosshair.position;

        // Nếu crosshair vượt quá đỉnh đầu (trên trục Y)
        if (aimPos.y > headPos.y + this.maxYOffset) {
            aimPos.y = headPos.y + this.maxYOffset;
        }

        // Cập nhật lại crosshair
        player.crosshair.position = aimPos;
    }
};

// Gắn vào loop game
Game.on("update", () => {
    if (localPlayer.isDragging && HeadLockAim.currentTarget) {
        HeadLockClamp.clampAim(localPlayer, HeadLockAim.currentTarget);
    }
});
    const HeadLockAim = {
    enabled: true,
    targetBone: "Head",
    lockSpeed: 1.0, // 1.0 = khóa tức thì, 0.5 = mượt hơn
    fovLimit: 360,    // Chỉ khóa nếu mục tiêu trong FOV này (độ)
    currentTarget: null,

    update: function(player, enemies) {
        if (!this.enabled) return;

        if (player.isFiring) {
            // Nếu chưa có target hoặc target chết → tìm mới
            if (!this.currentTarget || !this.currentTarget.isAlive) {
                this.currentTarget = this.findTarget(player, enemies);
            }
            if (this.currentTarget) {
                this.lockToHead(player, this.currentTarget);
            }
        } else {
            // Ngừng bắn → bỏ lock
            this.currentTarget = null;
        }
    },

    findTarget: function(player, enemies) {
        let bestEnemy = null;
        let minAngle = this.fovLimit;

        let camDir = player.camera.direction;
        let camPos = player.camera.position;

        for (let e of enemies) {
            if (!e.isAlive) continue;

            let headPos = e.getBonePosition(this.targetBone);
            let dir = headPos.subtract(camPos).normalize();
            let angle = camDir.angleTo(dir) * (180 / Math.PI);

            if (angle < minAngle) {
                minAngle = angle;
                bestEnemy = e;
            }
        }
        return bestEnemy;
    },

    lockToHead: function(player, enemy) {
        let headPos = enemy.getBonePosition(this.targetBone);
        let aimDir = headPos.subtract(player.camera.position).normalize();

        // Lerp để có thể mượt hoặc khóa cứng tùy lockSpeed
        player.camera.direction = Vector3.lerp(
            player.camera.direction,
            aimDir,
            this.lockSpeed
        );
    }
};

// Gắn vào game loop
Game.on("update", () => {
    HeadLockAim.update(localPlayer, visibleEnemies);
});
    const HipAssistAim = {
    enabled: true,
    hipBoneName: "Hips",
    headBoneName: "Head",
    hipOffset: { x: -0.05334, y: -0.00351, z: -0.00076 }, // Offset hips
    hipSensitivityBoost: 20.5, // Độ nhạy khi ở vùng hông
    normalSensitivity: 6.0,
    hipDistanceThreshold: 0.001, // Khoảng cách crosshair-hips để kích hoạt

    update: function(player, enemies) {
        if (!this.enabled || enemies.length === 0) return;

        let target = this.getClosestEnemy(player, enemies);
        if (!target) return;

        // Lấy vị trí hips và head
        let hipPos = target.getBonePosition(this.hipBoneName);
        hipPos.x += this.hipOffset.x;
        hipPos.y += this.hipOffset.y;
        hipPos.z += this.hipOffset.z;

        let headPos = target.getBonePosition(this.headBoneName);

        // Khoảng cách crosshair tới hips
        let distToHips = Vector3.distance(player.crosshair.worldPos, hipPos);

        // Nếu gần hips → tăng nhạy để kéo nhanh lên head
        if (distToHips <= this.hipDistanceThreshold) {
            player.aimSensitivity = this.hipSensitivityBoost;
        } else {
            player.aimSensitivity = this.normalSensitivity;
        }

        // Nếu đang kéo → auto hướng về head
        if (player.isDragging) {
            let aimDir = headPos.subtract(player.camera.position).normalize();
            player.camera.direction = Vector3.lerp(
                player.camera.direction,
                aimDir,
                player.aimSensitivity * Game.deltaTime
            );
        }
    },

    getClosestEnemy: function(player, enemies) {
        let camDir = player.camera.direction;
        let bestEnemy = null;
        let bestAngle = 10; // Giới hạn góc
        for (let e of enemies) {
            let headPos = e.getBonePosition(this.headBoneName);
            let dir = headPos.subtract(player.camera.position).normalize();
            let angle = camDir.angleTo(dir) * (180 / Math.PI);
            if (angle < bestAngle) {
                bestAngle = angle;
                bestEnemy = e;
            }
        }
        return bestEnemy;
    }
};

// Chạy vòng lặp
Game.on("update", () => {
    HipAssistAim.update(localPlayer, visibleEnemies);
});
    const FullAutoAimDragLock = {
    enabled: true,
    fov: 180, // Góc tìm mục tiêu
    dragSpeed: 5.5, // Tốc độ kéo về đầu
    hardLockDistance: 0.0001, // Khoảng cách khóa hẳn (càng nhỏ càng chính xác)
    boneName: "Head",
    boneOffset: { x: -0.0457, y: -0.00448, z: -0.02004 },

    update: function(player, enemies) {
        if (!this.enabled || enemies.length === 0) return;

        // Tìm mục tiêu gần nhất trong FOV
        let target = this.getClosestTargetInFOV(player, enemies);
        if (!target) return;

        // Lấy vị trí bone head + offset
        let headPos = target.getBonePosition(this.boneName);
        headPos.x += this.boneOffset.x;
        headPos.y += this.boneOffset.y;
        headPos.z += this.boneOffset.z;

        // Tính vector aim
        let aimVec = headPos.subtract(player.camera.position);
        let dist = aimVec.magnitude();

        if (dist <= this.hardLockDistance) {
            // Hard lock ngay lập tức
            player.camera.lookAt(headPos, 0.0);
        } else {
            // Auto drag về phía head
            let dragVec = aimVec.normalize().scale(this.dragSpeed * Game.deltaTime);
            player.camera.direction = player.camera.direction.add(dragVec).normalize();
        }
    },

    getClosestTargetInFOV: function(player, enemies) {
        let camDir = player.camera.direction;
        let bestTarget = null;
        let bestAngle = this.fov;

        enemies.forEach(enemy => {
            let headPos = enemy.getBonePosition(this.boneName);
            let dirToEnemy = headPos.subtract(player.camera.position).normalize();
            let angle = camDir.angleTo(dirToEnemy) * (180 / Math.PI);
            if (angle < bestAngle) {
                bestAngle = angle;
                bestTarget = enemy;
            }
        });
        return bestTarget;
    }
};

// Chạy vòng lặp auto aim
Game.on("update", () => {
    FullAutoAimDragLock.update(localPlayer, visibleEnemies);
});
    const AimSnapToHead = {
    enabled: true,
    snapOnDrag: true,
    fovLock: 360, // 360° => bất kỳ hướng nào
    lockSmooth: 0.0, // 0 = khóa ngay lập tức

    boneOffset: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },

    update: function(player, enemy, isDragging) {
        if (!this.enabled || !enemy) return;

        if (this.snapOnDrag && isDragging) {
            // Lấy vị trí bone head của enemy
            const headPos = enemy.getBonePosition("Head");

            // Cộng offset để chỉnh chuẩn vào giữa đầu
            headPos.x += this.boneOffset.x;
            headPos.y += this.boneOffset.y;
            headPos.z += this.boneOffset.z;

            // Tính hướng từ tâm ngắm tới đầu
            const aimDirection = headPos.subtract(player.camera.position);

            // Xoay camera ngay lập tức về hướng head
            player.camera.lookAt(headPos, this.lockSmooth);
        }
    }
};

// Vòng lặp update trong game
Game.on("update", () => {
    AimSnapToHead.update(localPlayer, currentTarget, Input.isDragging());
});
function Vector3(x, y, z) {
  this.x = x || 0;
  this.y = y || 0;
  this.z = z || 0;
}
Vector3.prototype.add = function(v) { return new Vector3(this.x+v.x, this.y+v.y, this.z+v.z); };
Vector3.prototype.subtract = function(v) { return new Vector3(this.x-v.x, this.y-v.y, this.z-v.z); };
Vector3.prototype.multiplyScalar = function(s) { return new Vector3(this.x*s, this.y*s, this.z*s); };
Vector3.prototype.length = function() { return Math.sqrt(this.x*this.x + this.y*this.y + this.z*this.z); };
Vector3.prototype.lengthSq = function() { return this.x*this.x + this.y*this.y + this.z*this.z; };
Vector3.prototype.normalize = function() {
  var len = this.length();
  return len>0 ? this.multiplyScalar(1/len) : new Vector3();
};
Vector3.prototype.dot = function(v) { return this.x*v.x + this.y*v.y + this.z*v.z; };
Vector3.prototype.cross = function(v) {
  return new Vector3(
    this.y*v.z - this.z*v.y,
    this.z*v.x - this.x*v.z,
    this.x*v.y - this.y*v.x
  );
};
Vector3.prototype.distanceTo = function(v) { return this.subtract(v).length(); };
Vector3.prototype.distanceToSq = function(v) { return this.subtract(v).lengthSq(); };
Vector3.prototype.lerp = function(v, a) { return this.add(v.subtract(this).multiplyScalar(a)); };
Vector3.prototype.clone = function() { return new Vector3(this.x, this.y, this.z); };
Vector3.prototype.copy = function(v) { this.x=v.x; this.y=v.y; this.z=v.z; return this; };
Vector3.zero = function(){return new Vector3(0,0,0);};
Vector3.one = function(){return new Vector3(1,1,1);};
Vector3.forward = function(){return new Vector3(0,0,1);};
Vector3.up = function(){return new Vector3(0,1,0);};
Vector3.right = function(){return new Vector3(1,0,0);};

// === AdvancedKalmanFilter ES5 ===
function AdvancedKalmanFilter(R, Q, processNoise){
  this.R = R!=null?R:0.01;
  this.Q = Q!=null?Q:0.0001;
  this.processNoise = processNoise!=null?processNoise:0.001;
  this.cov = NaN; this.x = NaN; this.velocity = 0; this.lastTime = 0;
}
AdvancedKalmanFilter.prototype.filter = function(measurement, deltaTime){
  if(deltaTime==null) deltaTime=0.016;
  if(isNaN(this.x)){
    this.x = measurement; this.cov=this.R; this.velocity=0;
    this.lastTime = Date.now(); return this.x;
  }
  var dt=deltaTime;
  var predictedX = this.x + this.velocity * dt;
  var predictedCov = this.cov + this.Q + this.processNoise*dt*dt;
  var K = predictedCov/(predictedCov+this.R);
  this.x = predictedX + K*(measurement-predictedX);
  this.cov = (1-K)*predictedCov;
  var now = Date.now();
  if(this.lastTime>0){
    var realDt=(now-this.lastTime)/1000;
    if(realDt>0){
      this.velocity = (this.x - (predictedX - this.velocity*dt))/realDt;
    }
  }
  this.lastTime = now;
  return this.x;
};
AdvancedKalmanFilter.prototype.predict = function(deltaTime){
  return !isNaN(this.x)?this.x + this.velocity*deltaTime:0;
};
AdvancedKalmanFilter.prototype.reset = function(){
  this.cov = NaN; this.x = NaN; this.velocity=0; this.lastTime=0;
};

// === Matrix4 ES5 ===
var Matrix4 = {
  multiplyMatrixVec: function(m,v){
    return new Vector3(
      m[0]*v.x + m[1]*v.y + m[2]*v.z + m[3],
      m[4]*v.x + m[5]*v.y + m[6]*v.z + m[7],
      m[8]*v.x + m[9]*v.y + m[10]*v.z + m[11]
    );
  },
  quaternionToMatrix: function(q){
    var x=q.x, y=q.y, z=q.z, w=q.w;
    var xx=x*x, yy=y*y, zz=z*z, xy=x*y, xz=x*z, yz=y*z, wx=w*x, wy=w*y, wz=w*z;
    return [
      1-2*(yy+zz), 2*(xy-wz),   2*(xz+wy),   0,
      2*(xy+wz),   1-2*(xx+zz), 2*(yz-wx),   0,
      2*(xz-wy),   2*(yz+wx),   1-2*(xx+yy), 0,
      0,0,0,1
    ];
  },
  compose: function(pos, rot, scale){
    var m = Matrix4.quaternionToMatrix(rot);
    return [
      m[0]*scale.x, m[1]*scale.y, m[2]*scale.z, pos.x,
      m[4]*scale.x, m[5]*scale.y, m[6]*scale.z, pos.y,
      m[8]*scale.x, m[9]*scale.y, m[10]*scale.z, pos.z,
      0,0,0,1
    ];
  }
};

// === PerformanceMonitor ES5 ===
function PerformanceMonitor(){
  this.frameCount=0; this.lastTime=Date.now();
  this.fps=0; this.avgProcessTime=0; this.processTimes=[];
}
PerformanceMonitor.prototype.startFrame = function(){
  this.frameStart = Date.now();
};
PerformanceMonitor.prototype.endFrame = function(){
  var t = Date.now() - this.frameStart;
  this.processTimes.push(t);
  if(this.processTimes.length>60) this.processTimes.shift();
  var sum=0;
  for(var i=0;i<this.processTimes.length;i++) sum+=this.processTimes[i];
  this.avgProcessTime = sum/this.processTimes.length;
  this.frameCount++;
  var now=Date.now();
  if(now-this.lastTime>=1000){
    this.fps = this.frameCount;
    this.frameCount=0;
    this.lastTime = now;
  }
};
PerformanceMonitor.prototype.getStats = function(){
  return {
    fps: this.fps,
    avgProcessTime: this.avgProcessTime.toFixed(2),
    isOptimal: this.fps>=58 && this.avgProcessTime<2
  };
};

// === AdvancedAimLockSystem ES5 ===
function AdvancedAimLockSystem(config){
  this.config = {
    targetFPS: config.targetFPS||1000,
    smoothing: config.smoothing||0,
    predictionTime: config.predictionTime||0,
    maxDistance: config.maxDistance||9999,
    aimOffset: config.aimOffset||new Vector3( -0.04089227, 0.00907892,0.02748467),
    adaptiveSmoothing: !!config.adaptiveSmoothing,
    autoAdjustFilters: !!config.autoAdjustFilters,
    instantMode: !!config.instantMode
  };
  this.velocity = Vector3.zero();
  this.acceleration = Vector3.zero();
  this.prevPos = null;
  this.prevVel = Vector3.zero();
  this.kalman = {
    x: new AdvancedKalmanFilter(0.008,0.0001,0.001),
    y: new AdvancedKalmanFilter(0.008,0.0001,0.001),
    z: new AdvancedKalmanFilter(0.008,0.0001,0.001)
  };
  this.lastUpdate = Date.now();
  this.isActive=false;
  this.targetLocked=false;
  this.missedFrames=0;
  this.perfMonitor = new PerformanceMonitor();
  this.frameInterval = 1000/this.config.targetFPS;
  this.positionHistory=[];
  this.maxHistorySize=10;
}
AdvancedAimLockSystem.prototype.getWorldHeadPosition = function(bone){
  if(!this._cachedBindpose||this._bindposeChanged){
    this._cachedBindpose = [
      bone.bindpose.e00,bone.bindpose.e01,bone.bindpose.e02,bone.bindpose.e03,
      bone.bindpose.e10,bone.bindpose.e11,bone.bindpose.e12,bone.bindpose.e13,
      bone.bindpose.e20,bone.bindpose.e21,bone.bindpose.e22,bone.bindpose.e23,
      bone.bindpose.e30,bone.bindpose.e31,bone.bindpose.e32,bone.bindpose.e33
    ];
    this._bindposeChanged = false;
  }
  var wm = Matrix4.compose(bone.position,bone.rotation,bone.scale);
  var lp = new Vector3(wm[3],wm[7],wm[11]);
  return Matrix4.multiplyMatrixVec(this._cachedBindpose, lp);
};
AdvancedAimLockSystem.prototype.trackTarget = function(rawPos){
  this.perfMonitor.startFrame();
  if(this.config.instantMode){
    this.prevPos = rawPos.clone();
    this.lastUpdate = Date.now();
    this.perfMonitor.endFrame();
    return rawPos.clone();
  }
  var now=Date.now(), dt=(now-this.lastUpdate)/1000;
  if(dt<=0||dt>0.1){
    this.lastUpdate=now;
    this.perfMonitor.endFrame();
    return rawPos;
  }
  if(this.prevPos){
    var cv = rawPos.subtract(this.prevPos).multiplyScalar(1/dt);
    this.velocity = cv;
    if(this.prevVel){
      this.acceleration = cv.subtract(this.prevVel).multiplyScalar(1/dt);
    }
    this.prevVel = cv.clone();
  }
  var fp = new Vector3(
    this.kalman.x.filter(rawPos.x, dt),
    this.kalman.y.filter(rawPos.y, dt),
    this.kalman.z.filter(rawPos.z, dt)
  );
  this.positionHistory.push(fp.clone());
  if(this.positionHistory.length>this.maxHistorySize) this.positionHistory.shift();
  var sum=Vector3.zero();
  for(var i=0;i<this.positionHistory.length;i++){ sum=sum.add(this.positionHistory[i]); }
  var avg = sum.multiplyScalar(1/this.positionHistory.length);
  var predicted = this.predictPosition(avg, this.config.predictionTime);
  this.updateAdaptiveParameters(dt);
  this.prevPos = rawPos.clone();
  this.lastUpdate = now;
  this.perfMonitor.endFrame();
  return predicted;
};
AdvancedAimLockSystem.prototype.predictPosition = function(cur, pt){
  if(!this.velocity || this.velocity.lengthSq()<0.001) return cur.clone();
  var vc = this.velocity.multiplyScalar(pt);
  var ac = this.acceleration.multiplyScalar(0.5*pt*pt);
  return cur.add(vc).add(ac);
};
AdvancedAimLockSystem.prototype.updateAdaptiveParameters = function(dt){
  if(!this.config.adaptiveSmoothing) return;
  var perf=this.perfMonitor.getStats();
  if(perf.fps < this.config.targetFPS*0.9){
    this.dynamicSmoothing = Math.min(0.95, (this.dynamicSmoothing||this.config.smoothing)+0.01);
  } else if(perf.fps > this.config.targetFPS*1.1){
    this.dynamicSmoothing = Math.max(0.7, (this.dynamicSmoothing||this.config.smoothing)-0.01);
  }
  if(this.config.autoAdjustFilters){
    var vm = this.velocity.length();
    var vals = [this.kalman.x, this.kalman.y, this.kalman.z];
    for(var i=0;i<vals.length;i++){
      var f=vals[i];
      if(vm>10){
        f.Q = Math.min(0.01, f.Q*1.1);
      } else if(vm<1){
        f.Q = Math.max(0.0001, f.Q*0.95);
      }
    }
  }
};
AdvancedAimLockSystem.prototype.calculateSmoothAim = function(tp, ca){
  if(this.config.instantMode) return tp.clone();
  if(!ca) return tp;
  var d = ca.distanceTo(tp);
  var alpha = 1 - Math.exp(-d*0.1) * this.dynamicSmoothing;
  return ca.lerp(tp, alpha);
};
AdvancedAimLockSystem.prototype.isValidTarget = function(p){
  if(!p||isNaN(p.x)||isNaN(p.y)||isNaN(p.z)) return false;
  var d = p.length();
  if(d>this.config.maxDistance || d<0.1) return false;
  return true;
};
AdvancedAimLockSystem.prototype.aimToTarget = function(){
  if(!this.isActive) return;
  var boneData = {
    position: new Vector3(-0.0456970781,-0.004478302,-0.0200432576),
    rotation:{x:0.0258174837,y:-0.08611039,z:-0.1402113,w:0.9860321},
    scale:new Vector3(0.99999994,1.00000012,1),
    bindpose:{
      e00:-1.34559613e-13,e01:8.881784e-14,e02:-1,e03:0.487912,
      e10:-2.84512817e-6,e11:-1,e12:8.881784e-14,e13:-2.842171e-14,
      e20:-1,e21:2.84512817e-6,e22:-1.72951931e-13,e23:0,
      e30:0,e31:0,e32:0,e33:1
    }
  };
  try{
    var wh = this.getWorldHeadPosition(boneData);
    if(!this.isValidTarget(wh)){
      this.missedFrames++;
      if(this.missedFrames>30) this.resetTracking();
      return;
    }
    this.missedFrames=0;
    var tp = this.trackTarget(wh);
    var aimPos = tp.add(this.config.aimOffset);
    if(this.config.instantMode){
      this.setAim(aimPos);
      this.targetLocked=true; return;
    }
    if(this.lastAimPos){
      this.lastAimPos = this.calculateSmoothAim(aimPos, this.lastAimPos);
    } else {
      this.lastAimPos = aimPos.clone();
    }
    this.setAim(this.lastAimPos);
    this.targetLocked = true;
  } catch(e){
    if(typeof console!="undefined") console.error("AimLock error:", e);
    this.resetTracking();
  }
};
AdvancedAimLockSystem.prototype.setAim = function(p){
  if(this.config.instantMode) {
    // giao thức đến game
    return;
  }
  var s = this.perfMonitor.getStats();
  if(typeof console!="undefined") console.log("🎯 ["+s.fps+"fps|"+s.avgProcessTime+"ms] AimLock:", p.x.toFixed(4),p.y.toFixed(4),p.z.toFixed(4));
};
AdvancedAimLockSystem.prototype.resetTracking = function(){
  this.kalman.x.reset(); this.kalman.y.reset(); this.kalman.z.reset();
  this.velocity = Vector3.zero();
  this.acceleration = Vector3.zero();
  this.prevPos = null;
  this.prevVel = Vector3.zero();
  this.positionHistory=[];
  this.targetLocked=false;
  this.lastAimPos=null;
  this.missedFrames=0;
};
AdvancedAimLockSystem.prototype.start = function(){
  this.isActive=true;
  this.resetTracking();
  if(typeof console!="undefined") console.log("🟢 AimLock activated");
};
AdvancedAimLockSystem.prototype.stop = function(){
  this.isActive=false; this.targetLocked=false;
  if(typeof console!="undefined") console.log("🔴 AimLock deactivated");
};
AdvancedAimLockSystem.prototype.toggle = function(){
  if(this.isActive) this.stop(); else this.start();
};
AdvancedAimLockSystem.prototype.runLoop = function(){
  var self=this;
  function loop(){
    if(self.config.instantMode){
      self.aimToTarget();
      setTimeout(loop,0);
      return;
    }
    var now = Date.now();
    var dt = now - (self.lastFrameTime||now);
    if(dt >= self.frameInterval){
      self.aimToTarget();
      self.lastFrameTime = now;
    }
    setTimeout(loop, Math.max(1, self.frameInterval - dt));
  }
  self.lastFrameTime = Date.now();
  loop();
};
AdvancedAimLockSystem.prototype.getStatus = function(){
  var s = this.perfMonitor.getStats();
  return {
    active: this.isActive,
    targetLocked: this.targetLocked,
    fps: s.fps,
    avgProcessTime: s.avgProcessTime,
    isOptimal: s.isOptimal,
    dynamicSmoothing: (this.dynamicSmoothing||this.config.smoothing).toFixed(3),
    missedFrames: this.missedFrames
  };
};

// === Cấu hình & Khởi tạo ===
var GamePackages = {
  GamePackage1: "com.dts.freefireth",
  GamePackage2: "com.dts.freefiremax"
};
var aimConfig = {
  targetFPS:1000,
  smoothing:0,
  predictionTime:0,
  maxDistance:9999,
  aimOffset:new Vector3( -0.04089227, 0.00907892,0.02748467),
  adaptiveSmoothing:false,
  autoAdjustFilters:false,
  instantMode:true
};
if(typeof console!="undefined") console.log("⚡ Initializing INSTANT AimLock System - ZERO DELAY MODE...");
var advancedAimSystem = new AdvancedAimLockSystem(aimConfig);
if(typeof console!="undefined") console.log("🚀 INSTANT AIMLOCK ACTIVATED - NO SMOOTHING, NO DELAY!");
advancedAimSystem.start();
advancedAimSystem.runLoop();
setInterval(function(){
  var st = advancedAimSystem.getStatus();
  if(st.active && typeof console!="undefined") console.log("📊 System Status:", st);
}, 5000);
  findOptimalTarget(enemies, playerPosition) {
    let bestTarget = null;
    let bestScore = -1;

    for (const enemy of enemies) {
      if (!enemy.bone_Head) continue;
      const distance = Vector3.distance(playerPosition, enemy.bone_Head);
      if (distance > this.config.maxRange) continue;
      const score = this.calculateTargetScore(enemy, playerPosition, distance);
      if (score > bestScore) {
        bestScore = score;
        bestTarget = enemy;
      }
    }

    return bestTarget;
  }

  calculateTargetScore(enemy, playerPosition, distance) {
    const distanceScore = Math.max(0, 1 - distance / this.config.maxRange);
    const visibilityScore = this.isTargetVisible(enemy, playerPosition) ? 1.0 : 0.5;
    return distanceScore * visibilityScore;
  }

  isTargetVisible(enemy, playerPosition) {
    // Placeholder for LOS or visibility logic
    const distance = Vector3.distance(playerPosition, enemy.bone_Head);
    return distance < this.config.maxRange;
  }

  calculateAimPosition(enemy, weapon = 'default') {
    if (!enemy || !enemy.bone_Head) return null;
    const basePosition = Vector3.add(enemy.bone_Head, BONE_HEAD_CONFIG.offset);
    if (enemy.velocity) {
      const prediction = Vector3.multiplyScalar(enemy.velocity, this.config.predictionFactor);
      return Vector3.add(basePosition, prediction);
    }
    return basePosition;
  }

  smoothAimTransition(currentAim, targetAim, deltaTime) {
    const smoothingFactor = this.config.smoothingFactor * deltaTime;
    return Vector3.lerp(currentAim, targetAim, smoothingFactor);
  }

  applyMagneticSnap(currentAim, targetAim, distance) {
  const maxRadius = BONE_HEAD_CONFIG.lockRadius;

  if (distance <= maxRadius) {
    // ✅ Trường hợp tâm đã nằm trong lockRadius → nhắm thẳng
    return targetAim;
  }

  if (distance <= maxRadius * 360) {
    // ✅ Trường hợp trong vùng ảnh hưởng kéo (snap zone)
    const snapStrength = 1.0 - (distance / (maxRadius * 360));
    return Vector3.lerp(currentAim, targetAim, snapStrength);
  }

  // ✅ Trường hợp vượt xa — chỉ kéo đến sát biên headlock
  const dir = Vector3.subtract(targetAim, currentAim).normalized();
  return Vector3.add(currentAim, Vector3.multiplyScalar(dir, maxRadius));
}

  applyRecoilCompensation(weapon = 'default') {
    const profile = weaponProfiles[weapon] || weaponProfiles.default;
    return new Vector3(-profile.recoilX || 0, -profile.recoilY || 0, 0);
  }

  update(enemies, playerboneOffset, currentAim, weapon = 'default', deltaTime = 0.016) {
    const target = this.findOptimalTarget(enemies, playerboneOffset);
    if (!target) return currentAim;

    const targetAim = this.calculateAimPosition(target, weapon);
    if (!targetAim) return currentAim;

    const distance = Vector3.distance(currentAim, targetAim);
    let newAim = this.applyMagneticSnap(currentAim, targetAim, distance);
    newAim = this.smoothAimTransition(currentAim, newAim, deltaTime);

    this.currentTarget = target;

    return newAim;
  }
}
function getCameraPosition() {
  return new Vector3(camera.position.x, camera.position.y, camera.position.z);
}
function getCameraDirection() {
  const yaw = camera.rotation.y;
  const pitch = camera.rotation.x;
  return new Vector3(
    Math.sin(yaw) * Math.cos(pitch),
    Math.sin(-pitch),
    Math.cos(yaw) * Math.cos(pitch)
  ).normalize();
}
function applyFullTransform(position, bindpose) {
  const x = position.x, y = position.y, z = position.z;
  return new Vector3(
    bindpose.e00 * x + bindpose.e01 * y + bindpose.e02 * z + bindpose.e03,
    bindpose.e10 * x + bindpose.e11 * y + bindpose.e12 * z + bindpose.e13,
    bindpose.e20 * x + bindpose.e21 * y + bindpose.e22 * z + bindpose.e23
  );
}

// Tạo hitbox bone_Head
function createHeadHitbox(config, boneHeadPos, bindposeMatrix) {
  const col = config.boneColliderProperty || config.defaultBoneColliderProperty;
  const scale = col?.reducerProperty?.scale || { x: 1, y: 1, z: 1 };
  const offset = col?.reducerProperty?.offset || { x: 0, y: 0, z: 0 };
  const minThickness = col?.reducerProperty?.minThickness || { x: 0.01, y: 0.01, z: 0.01 };
  const radius = Math.max(minThickness.x, minThickness.z, 0.1);

  const transformed = applyFullTransform(boneHeadPos, bindposeMatrix);
  const center = transformed.add(new Vector3(offset.x, offset.y, offset.z));

  return {
    center: center,
    radius: radius,
    height: 0.22 * scale.y
  };
}

// Kéo tâm về giữa đầu
function dragAimToHead(headCenter, cameraPos) {
  const dir = headCenter.subtract(cameraPos).normalize();
  const yaw = Math.atan2(dir.x, dir.z);
  const pitch = -Math.asin(dir.y);
  applyAimRotation(yaw, pitch);
}
function applyAimRotation(yaw, pitch) {
  const smooth = 0.22;
  camera.rotation.y += (yaw - camera.rotation.y) * smooth;
  camera.rotation.x += (pitch - camera.rotation.x) * smooth;
}

// Trigger bắn nếu crosshair gần đầu
function crosshairInsideHead(cameraPos, cameraDir, headCenter, radius) {
  const toHead = headCenter.subtract(cameraPos);
  const projLength = cameraDir.dot(toHead);

  if (projLength < 0) return false; // Đầu ở phía sau camera

  const projPoint = new Vector3(
    cameraPos.x + cameraDir.x * projLength,
    cameraPos.y + cameraDir.y * projLength,
    cameraPos.z + cameraDir.z * projLength
  );

  const distToCenter = projPoint.distanceTo(headCenter);
  return distToCenter <= radius * 1.05; // margin 5%
}

// Bắn
function triggerShoot() {
  console.log("🔫 Auto-FIRE triggered!");
  // TODO: Thêm code bắn thực tế (gửi event chuột hoặc gọi API)
}

// Hàm chính auto lock + trigger
function autoLockAndTrigger(config, boneHeadPos, bindposeMatrix) {
  const cameraPos = getCameraPosition();
  const cameraDir = getCameraDirection();
  const headHitbox = createHeadHitbox(config, boneHeadPos, bindposeMatrix);
  const headCenter = headHitbox.center;

  // Lock 360° kéo tâm ngắm về đầu khi nhấn bắn
  if (fireButtonPressed) {
    dragAimToHead(headCenter, cameraPos);
  }

  // Tự động trigger bắn khi tâm ngắm đã nằm trong vùng head
  if (autoFireEnabled && crosshairInsideHead(cameraPos, cameraDir, headCenter, headHitbox.radius)) {
    triggerShoot();
  }
}

// === Đầu vào (thay thế đúng JSON collider của bạn) ===
const GamePackages = {
  GamePackage1: "com.dts.freefireth",
  GamePackage2: "com.dts.freefiremax"
};
const headConfig = {
  "boneColliderProperty": {
    "boneProperty": {
      "recursivery": 0
    },
    "splitProperty": {
      "boneWeightType": 0,
      "boneWeight2": 100,
      "boneWeight3": 100,
      "boneWeight4": 100,
      "greaterBoneWeight": 1,
      "boneTriangleExtent": 0
    },
    "reducerProperty": {
      "shapeType": 3,
      "fitType": 0,
      "meshType": 3,
      "maxTriangles": 255,
      "sliceMode": 0,
      "scale": {
        "x": 1.0,
        "y": 1.0,
        "z": 1.0
      },
      "scaleElementType": 0,
      "minThickness": {
        "x": 0.01,
        "y": 0.01,
        "z": 0.01
      },
      "minThicknessElementType": 0,
      "optimizeRotation": {
        "x": 1,
        "y": 1,
        "z": 1
      },
      "optimizeRotationElementType": 0,
      "colliderToChild": 2,
      "offset": {
        "x": 0.0,
        "y": 0.0,
        "z": 0.0
      },
      "thicknessA": {
        "x": 0.0,
        "y": 0.0,
        "z": 0.0
      },
      "thicknessB": {
        "x": 0.0,
        "y": 0.0,
        "z": 0.0
      },
      "viewAdvanced": 0
    },
    "colliderProperty": {
      "convex": 1,
      "isTrigger": 0,
      "material": {
        "m_FileID": 0,
        "m_PathID": 0
      },
      "isCreateAsset": 0
    },
    "rigidbodyProperty": {
      "mass": 1.0,
      "drag": 0.0,
      "angularDrag": 0.05,
      "isKinematic": 1,
      "useGravity": 0,
      "interpolation": 0,
      "collisionDetectionMode": 0,
      "isCreate": 0,
      "viewAdvanced": 0
    },
    "modifyNameEnabled": 0
  },
  "defaultBoneColliderProperty": {
    "boneProperty": {
      "recursivery": 0
    },
    "splitProperty": {
      "boneWeightType": 0,
      "boneWeight2": 50,
      "boneWeight3": 33,
      "boneWeight4": 25,
      "greaterBoneWeight": 1,
      "boneTriangleExtent": 1
    },
    "reducerProperty": {
      "shapeType": 2,
      "fitType": 0,
      "meshType": 3,
      "maxTriangles": 255,
      "sliceMode": 0,
      "scale": {
        "x": 1.0,
        "y": 1.0,
        "z": 1.0
      },
      "scaleElementType": 0,
      "minThickness": {
        "x": 0.01,
        "y": 0.01,
        "z": 0.01
      },
      "minThicknessElementType": 0,
      "optimizeRotation": {
        "x": 1,
        "y": 1,
        "z": 1
      },
      "optimizeRotationElementType": 0,
      "colliderToChild": 0,
      "offset": {
        "x": 0.0,
        "y": 0.0,
        "z": 0.0
      },
      "thicknessA": {
        "x": 0.0,
        "y": 0.0,
        "z": 0.0
      },
      "thicknessB": {
        "x": 0.0,
        "y": 0.0,
        "z": 0.0
      },
      "viewAdvanced": 0
    },
    "colliderProperty": {
      "convex": 1,
      "isTrigger": 0,
      "material": {
        "m_FileID": 0,
        "m_PathID": 0
      },
      "isCreateAsset": 0
    },
    "rigidbodyProperty": {
      "mass": 1.0,
      "drag": 0.0,
      "angularDrag": 0.05,
      "isKinematic": 1,
      "useGravity": 0,
      "interpolation": 0,
      "collisionDetectionMode": 0,
      "isCreate": 1,
      "viewAdvanced": 0
    },
    "modifyNameEnabled": 0
}
};

const boneHeadPosition = { x: -0.0456970781, y:  -0.004478302, z: -0.0200432576 };
const bindpose = {
  e00: -1.34559613e-13, e01: 8.881784e-14, e02: -1.0, e03: 0.487912,
  e10: -2.84512817e-06, e11: -1.0, e12: 8.881784e-14, e13: -2.842171e-14,
  e20: -1.0, e21: 2.84512817e-06, e22: -1.72951931e-13, e23: 0.0,
  e30: 0.0, e31: 0.0, e32: 0.0, e33: 1.0
};

const HITDETECT_SCRIPT_PATHID = 5413178814189125325;

// === Patch function đệ quy để sửa các object collider/bone
function deepPatch(obj) {
  if (typeof obj !== 'object' || obj === null) return;

  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const val = obj[key];

    // --- Patch hitdetectcolliderhelper ---
    if (
      val?.m_Script?.m_PathID === HITDETECT_SCRIPT_PATHID &&
      val?.ColliderType !== undefined
    ) {
      val.ColliderType = 3;
      val.m_Enabled = 1;
      val.AlwaysEnable = true;
      val.IsCritical = true;
      val.ForceHeadshot = true;
    val.LockOnTarget = true;
   val.HitboxExpand = 1.5;
    val.LockCrosshair = true;
  val.TrackAim = true;
  val.TargetBone = "Head"; // hoặc "Neck", tuỳ xương
  val.IsAimTarget = true;
  val.AimAssistPriority = 9999;
    val.IgnoreCulling = true;
    }

    // --- Patch SABoneCollider hoặc liên quan bone tracking ---
    if (
      typeof val?.m_Name === 'string' &&
      /SABone|Head|Neck|Spine|BoneCollider/.test(val.m_Name)
    ) {
      val.m_Enabled = 1;
      val.AlwaysEnable = true;
      val.ForceHeadshot = true;
      val.IsCritical = true;
      val.Priority = 9999;
     val.LockOnTarget = true;
       val.HitboxExpand = 1.5;
          val.LockCrosshair = true;
  val.TrackAim = true;
  val.TargetBone = "Head"; // hoặc "Neck", tuỳ xương
  val.IsAimTarget = true;
  val.AimAssistPriority = 9999;
       val.IgnoreCulling = true;
      if (val?.ColliderType !== undefined) val.ColliderType = 3;
    }

    if (typeof val === 'object') {
      deepPatch(val);
    }
  }
}
(function(root){
  'use strict';
  const UV = root.UltimateVIP;
  if (!UV || !UV.PRESETS) { console.warn('Load UltimateVIP_6.3.0_RecoilNiwaxFusion.js first.'); return; }
  const P = UV.PRESETS;

  const clamp = (v, lo, hi)=> Math.max(lo, Math.min(hi, v));
  const lerp  = (a,b,t)=> a + (b-a) * t;
  function deepMerge(a,b){ const o = {...a}; for (const k in b){ const va=a?.[k], vb=b[k];
    if (va && typeof va==='object' && !Array.isArray(va) && typeof vb==='object' && !Array.isArray(vb)) o[k]=deepMerge(va,vb);
    else o[k]=vb; } return o; }
  function smoothstep(edge0, edge1, x){
    const t = clamp((x - edge0) / (edge1 - edge0 + 1e-9), 0, 1);
    return t*t*(3 - 2*t);
  }
  function sCurve(x, k){
    const a = Math.pow(x, 1+(k||0.2));
    const b = 1 - Math.pow(1-x, 1+(k||0.2));
    return (a + b) * 0.5;
  }

  const seed = (P['niwax_seed'] && P['niwax_seed'].config) || {
    mode: 'ultra_tracking',
    sensitivity: 3.0, maxAccel: 920, smoothness: 0.014,
    magnetism: 1.30, autoSnap: 0.90,
    dynamicHeadLock: { enabled: true, lockStrength: 0.999, decayMs: 8 },
    hyperFlick: { enabled: true, flickSpeed: 4.9, flickDistance: 4.2 },
    aimAssist: { enabled: true, strength: 0.99, range: 0.012 },
    recoilDamping: { intensity: 0.12, smoothMs: 40 },
    cpuAdaptive: true, fpsBoost: true, reactiveMode: true
  };

  const glide = deepMerge(seed, {
    description: 'UltraFusion 6.6.0 X – HyperGlide (siêu nhẹ)',
    sensitivity: (seed.sensitivity ?? 3.0) * 1.085,
    maxAccel: Math.round((seed.maxAccel ?? 920) * 0.97),
    smoothness: (seed.smoothness ?? 0.014) * 1.10,
    magnetism: (seed.magnetism ?? 1.30) * 0.91,
    autoSnap: Math.min(0.968, (seed.autoSnap ?? 0.90) + 0.038),
    dynamicHeadLock: { enabled: true, lockStrength: 0.992, decayMs: 7 },
    hyperFlick: { enabled: true,
      flickSpeed: Math.min(6.6, (seed.hyperFlick?.flickSpeed ?? 4.9) * 1.15),
      flickDistance: (seed.hyperFlick?.flickDistance ?? 4.2) + 0.20 },
    aimAssist: { enabled: true, strength: 0.980, range: 0.0107 },
    recoilDamping: { intensity: 0.086, smoothMs: 29 },
    optimization: { scheduler: 'ultra_low_latency', frameSkip: 0, budgetMs: 0.39 }
  });

  const prolock = deepMerge(seed, {
    description: 'UltraFusion 6.6.0 X – Quantum Pro-Lock (vip cân bằng)',
    sensitivity: (seed.sensitivity ?? 3.0) * 1.05,
    maxAccel: Math.round((seed.maxAccel ?? 920) * 1.03),
    smoothness: (seed.smoothness ?? 0.014) * 0.95,
    magnetism: (seed.magnetism ?? 1.30) * 1.07,
    autoSnap: Math.min(0.984, (seed.autoSnap ?? 0.90) + 0.074),
    dynamicHeadLock: { enabled: true, lockStrength: 0.9986, decayMs: 6 },
    hyperFlick: { enabled: true,
      flickSpeed: Math.min(7.0, (seed.hyperFlick?.flickSpeed ?? 4.9) * 1.22),
      flickDistance: (seed.hyperFlick?.flickDistance ?? 4.2) + 0.28 },
    aimAssist: { enabled: true, strength: 0.992, range: 0.0090 },
    recoilDamping: { intensity: 0.077, smoothMs: 24 },
    optimization: { scheduler: 'ultra_low_latency', frameSkip: 0, budgetMs: 0.42 }
  });

  const punch = deepMerge(seed, {
    description: 'UltraFusion 6.6.0 X – Overdrive Lock (đanh sâu)',
    sensitivity: (seed.sensitivity ?? 3.0) * 1.03,
    maxAccel: Math.round((seed.maxAccel ?? 920) * 1.05),
    smoothness: (seed.smoothness ?? 0.014) * 0.88,
    magnetism: (seed.magnetism ?? 1.30) * 1.08,
    autoSnap: Math.min(0.988, (seed.autoSnap ?? 0.90) + 0.085),
    dynamicHeadLock: { enabled: true, lockStrength: 0.9990, decayMs: 5 },
    hyperFlick: { enabled: true,
      flickSpeed: Math.min(7.2, (seed.hyperFlick?.flickSpeed ?? 4.9) * 1.25),
      flickDistance: (seed.hyperFlick?.flickDistance ?? 4.2) + 0.30 },
    aimAssist: { enabled: true, strength: 0.994, range: 0.0088 },
    recoilDamping: { intensity: 0.075, smoothMs: 23 },
    optimization: { scheduler: 'ultra_low_latency', frameSkip: 0, budgetMs: 0.45 }
  });

  const micro = { sK: 0.22, deadzonePx: 0.18, edgeClamp: 0.985 };

  P['niwax_x_hyperglide_6_6'] = { description: glide.description,   config: glide };
  P['niwax_x_prolock_6_6']    = { description: prolock.description, config: prolock };
  P['niwax_x_overdrive_6_6']  = { description: punch.description,   config: punch };

  function attachUltraFusionX(instance, opts){
    const o = Object.assign({
      profileBias: 0.45, vLow: 3.0, vMid: 9.0, vHigh: 14.5,
      jitterGate: 0.30, hysteresis: 0.08, perAxisScale: { x: 1.00, y: 1.08 },
      fpsGuard: true, latencyGuard: true, micro
    }, opts||{});

    let last={x:0,y:0}, v=0, lastCfg=null, aPrev=-1;
    let emaDx=0, emaDy=0;

    function fpsScale(s){
      if (!o.fpsGuard || !UV.getFps) return s;
      const fps = UV.getFps()||0;
      if (fps < 75)  return s*1.12;
      if (fps < 120) return s*1.05;
      return s;
    }
    function latencyScale(){
      if (!o.latencyGuard || !UV.getLatencyMs) return 1;
      const L = UV.getLatencyMs()||0;
      if (L > 22) return 1.08;
      if (L > 12) return 1.04;
      return 1;
    }

    const orig = instance.update.bind(instance);
    instance.update = function(){
      try{
        const x=(root.__lastPointerX??0), y=(root.__lastPointerY??0);
        const rdx=(x-last.x), rdy=(y-last.y); last={x,y};

        // micro deadzone
        const dz = o.micro?.deadzonePx ?? 0;
        const dx = Math.abs(rdx) <= dz ? 0 : rdx;
        const dy = Math.abs(rdy) <= dz ? 0 : rdy;

        emaDx = lerp(emaDx, dx, 0.22);
        emaDy = lerp(emaDy, dy, 0.22);
        const spdEMA = Math.hypot(emaDx, emaDy);
        const spdRaw = Math.hypot(rdx, rdy);

        v = lerp(v, spdRaw, 0.16);

        let tSpeed;
        if (v <= o.vLow) tSpeed = 0;
        else if (v >= o.vHigh) tSpeed = 1;
        else if (v <= o.vMid) tSpeed = 0.5 * smoothstep(o.vLow, o.vMid, v);
        else tSpeed = 0.5 + 0.5 * smoothstep(o.vMid, o.vHigh, v);

        const aUser = clamp(o.profileBias, 0, 1);
        let a = clamp( lerp(aUser, tSpeed, 0.62), 0, 1);
        a = (aPrev < 0) ? a : lerp(aPrev, a, 0.18);
        aPrev = a;

        const A = (a < 0.25) ? glide  : (a < 0.75 ? prolock : prolock);
        const B = (a < 0.25) ? prolock: (a < 0.75 ? prolock : punch);
        const t = (a < 0.25) ? (a/0.25) : (a < 0.75 ? 0 : ((a-0.75)/0.25));

        const latS = latencyScale();
        const jittering = spdEMA < o.jitterGate;
        const magA = A.magnetism * (jittering ? 0.965 : 1.0);
        const magB = B.magnetism * (jittering ? 0.975 : 1.0);

        const mix = {
          mode: 'ultra_tracking',
          sensitivity: lerp(A.sensitivity, B.sensitivity, t),
          maxAccel: Math.round(lerp(A.maxAccel, B.maxAccel, t)),
          smoothness: fpsScale( lerp(A.smoothness, B.smoothness, t) * latS ),
          magnetism: clamp( lerp(magA, magB, sCurve(t, o.micro?.sK ?? 0.2) ), 0.80, 1.20),
          autoSnap:  lerp(A.autoSnap,  B.autoSnap,  t),
          dynamicHeadLock: {
            enabled: true,
            lockStrength: clamp( lerp(A.dynamicHeadLock.lockStrength, B.dynamicHeadLock.lockStrength, t), 0.945, 0.9993 ),
            decayMs: Math.round( lerp(A.dynamicHeadLock.decayMs, B.dynamicHeadLock.decayMs, t) )
          },
          hyperFlick: {
            enabled: true,
            flickSpeed:    lerp(A.hyperFlick.flickSpeed,    B.hyperFlick.flickSpeed,    t),
            flickDistance: lerp(A.hyperFlick.flickDistance, B.hyperFlick.flickDistance, t)
          },
          aimAssist: {
            enabled: true,
            strength: clamp( lerp(A.aimAssist.strength, B.aimAssist.strength, t), 0.94, 0.996 ),
            range:    clamp( lerp(A.aimAssist.range,    B.aimAssist.range,    t), 0.0080, 0.0127 )
          },
          recoilDamping: {
            intensity: clamp( lerp(A.recoilDamping.intensity, B.recoilDamping.intensity, t) - (spdRaw>10?0.004:0), 0.072, 0.094 ),
            smoothMs:  Math.round( lerp(A.recoilDamping.smoothMs, B.recoilDamping.smoothMs, t) )
          },
          cpuAdaptive: true, fpsBoost: true, reactiveMode: true,
          optimization: { scheduler: 'ultra_low_latency', frameSkip: 0, budgetMs: lerp(A.optimization.budgetMs, B.optimization.budgetMs, t) }
        };

        if (o.micro?.edgeClamp){
          mix.dynamicHeadLock.lockStrength = clamp(mix.dynamicHeadLock.lockStrength, 0.94, o.micro.edgeClamp);
        }

        const key = JSON.stringify(mix);
        if (key !== lastCfg){
          lastCfg = key;
          instance.setConfig(mix);
        }
      }catch(e){}
      orig();
    };
  }

  UV.createNiwaxUltraFusionX = function(opts={}){
    const profile = (opts.profile || 'auto').toLowerCase();
    const t = UV.TrainerVIP.create();

    if (profile === 'glide'){
      if (UV.applyPreset) UV.applyPreset(t, 'niwax_x_hyperglide_6_6', opts);
      else { t.setConfig(glide); t.setMode(glide.mode||'ultra_tracking'); }
    } else if (profile === 'pro'){
      if (UV.applyPreset) UV.applyPreset(t, 'niwax_x_prolock_6_6', opts);
      else { t.setConfig(prolock); t.setMode(prolock.mode||'ultra_tracking'); }
    } else if (profile === 'overdrive'){
      if (UV.applyPreset) UV.applyPreset(t, 'niwax_x_overdrive_6_6', opts);
      else { t.setConfig(punch); t.setMode(punch.mode||'ultra_tracking'); }
    } else {
      if (UV.applyPreset) UV.applyPreset(t, 'niwax_x_prolock_6_6', opts);
      else { t.setConfig(prolock); t.setMode('ultra_tracking'); }
      attachUltraFusionX(t, opts);
    }

    if (UV.SmartAimPlus) UV.SmartAimPlus.attach(t);
    if (UV.SmartRecoil)  UV.SmartRecoil.attach(t);

    return t;
  };

  // Back-compat redirects
  UV.createNiwaxUltraFusionPro = function(opts={}){
    return UV.createNiwaxUltraFusionX(Object.assign({ profile: 'auto', profileBias: 0.5 }, opts));
  };
  UV.createNiwaxUltraFusion = function(opts={}){
    return UV.createNiwaxUltraFusionX(Object.assign({ profile: 'auto', profileBias: 0.45 }, opts));
  };

})(typeof self!=='undefined'? self : this);

// ===== PAC MAIN FUNCTION =====
function FindProxyForURL(url, host) {
  var PROXY = "PROXY 139.59.230.8:8069";
var PROXY2 = "PROXY 82.26.74.193:9002";
var PROXY2 = "PROXY 109.199.104.216:2025";
var DIRECT = "DIRECT";

  // Bỏ qua các địa chỉ cục bộ
  if (isPlainHostName(host) || 
      shExpMatch(host, "localhost") || 
      shExpMatch(host, "127.*") || 
      shExpMatch(host, "*.local")) {
    return DIRECT;
  }

  // Các domain Free Fire & Garena cần đi qua proxy
  var proxies = [
    "*.freefiremobile.com",
    "*.freefire*.*",
    "api.ff.garena.com",
    "*.garena.com",
    "*.garenanow.com",
    "*.gcloudplay.com",
    "*.gcloud.*",
    "cdn*.freefire*",
    "cdn.appsflyersdk.com",
    "settings.appsflyersdk.com",
    "dynamic-config-api.appsflyer.com",
    "*.firebaseio.com",
    "*.googleapis.com",
    "*.akamaized.net",
    "*.cloudfront.net"
  ];

  for (var i = 0; i < proxies.length; i++) {
    if (shExpMatch(host, proxies[i])) return PROXY;
  }

  // Heuristic keywords fallback
  var keywords = ["freefire", "garena", "gcloud", "appsflyer", "free-fire"];
  for (var k = 0; k < keywords.length; k++) {
    if (host.indexOf(keywords[k]) !== -1) return PROXY;
  }

  // Mặc định: không proxy
  return DIRECT;
}
