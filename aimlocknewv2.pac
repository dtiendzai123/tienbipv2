var AimMobile = function(() {
 
var AimbotConfig = {
      Enabled: true,
AimMode: HitboxLock,
Sensitivity: High,
Smoothing: 0.85,
Prediction: Kalman,
PredictionStrength: 1.0,
LockOn: true,
LockStrength: 1.0,
AimFOV: 360,

 EnableRealtimeEnemyTracking: true,
    RealtimeTrackingInterval: 0.001,
    MultiEnemyTracking: true,
    PredictEnemyMovement: true,
    PredictivePathCorrection: true,
    PredictiveSmoothing: 0.90,
    EnableDynamicFOV: true,
    FOVAngle: 90,
    MaxLockDistance: 999.0,
    ReactionTime: 0.001,
    AvoidObstacles: true,
    RetreatWhenBlocked: true,

    // ====== AIM HITBOX LOCKING ======
    LockAimToEnemy: true,
    LockToHitbox: true,
    EnableAutoFire: true,
    AutoFireDelay: 0.020,
    AutoFireOnHeadLock: true,
    AutoFireSafeMode: false,

    // ====== TARGET ZONE WEIGHTS ======
    HeadWeight: 2.0,
    NeckWeight: 1.2,
    ChestWeight: 0.8,
    PelvisWeight: 0.5,
    UseSmartZoneSwitch: true,
    PreferClosestHitbox: true,

    // ====== REALTIME AIM SENSITIVITY ======
    AdaptiveAimSensitivity: true,
    AimSensitivityHead: 1.00,
    AimSensitivityNeck: 0.85,
    AimSensitivityChest: 0.70,
    AimSensitivityPelvis: 0.55,
    HighSpeedTargetBoost: 1.25,
    CloseRangeSensitivityBoost: 1.35,

    // ====== ADVANCED ENEMY TACTICS ======
    EnableAdvancedEnemyTactics: true,
    EnemyAwarenessLevel: 0.85,
    PredictiveMovement: 1.0,
    AggressionMultiplier: 1.20,
    UseCoverEffectively: true,
    EvadeProjectiles: true,
    FlankPlayer: 0.70,
    PrioritizeHeadshot: false,
    TeamCoordination: true,
    AdaptiveDifficulty: true,
    AmbushProbability: 0.40,
    RetreatThreshold: 0.25,
    MaxPursuitDistance: 70.0,

    // ====== REALTIME POSITION/ROTATION TRACKING ======
    TrackEnemyHead: true,
    TrackEnemyNeck: true,
    TrackEnemyChest: true,
    TrackEnemyRotation: true,
    TrackEnemyVelocity: true,
    TrackCameraRelative: true,
    SnapToBoneAngle: 0.92,
    RotationLockStrength: 1.0,

    // ====== STABILITY / FILTER ======
    UseKalmanFilter: true,
    KalmanPositionFactor: 0.85,
    KalmanVelocityFactor: 0.88,
    NoiseReductionLevel: 0.65,
    JitterFixer: true,
    SmoothTracking: true,

    // ====== DYNAMIC GAME BEHAVIOR ======
    EnableDynamicGameBehavior: true,
    DynamicAimAdjustment: true,          // Tăng/giảm nhạy aim theo tình huống
    DynamicFireRate: true,                // Điều chỉnh tốc độ bắn theo số lượng/độ nguy hiểm mục tiêu
    AdaptiveLockPriority: true,           // Thay đổi ưu tiên lock head/chest/neck theo trạng thái
    ThreatAssessmentLevel: 0.85,          // Xác định mục tiêu nguy hiểm nhất (0.0 - 1.0)
    CloseRangeBehaviorBoost: 1.20,        // Tăng nhạy ở cự ly gần
    LongRangeBehaviorPenalty: 0.75,       // Giảm nhạy/độ chính xác ở cự ly xa
    LowHealthEnemyFocus: true,            // Ưu tiên bắn vào kẻ địch máu thấp
    MultiTargetDistribution: true,        // Phân bổ lock & fire cho nhiều mục tiêu
    DynamicFOVScaling: true,              // Thay đổi FOV theo tình huống

    // ====== DEBUG OPTIONS ======
    EnableDebugLogs: false,
    LogRealtimeData: false,
    ShowTargetFOV: false,
    ShowEnemyVectors: false
};
var config = {
  AutoTrackHead: true,          // Bật tự động bám đầu
  BuffMultiplier: 3,            // Hệ số khuếch đại tối đa
  HeadZoneWeight: 2.0,          // Trọng số vùng đầu (tăng độ ưu tiên headshot)
  EnableLockOn: true,           // Bật chế độ khóa mục tiêu
  LockStrength: 8,              // Độ mạnh khóa tối đa
  AutoAimAssist: true,          // Bật hỗ trợ aim tự động
  TouchSnap: true,              // Bật phản ứng nhanh theo cảm ứng
  HeadshotBias: 999.5,            // Ưu tiên headshot cao nhất
  PriorityZone: "Head",         // Ưu tiên vùng đầu
  RecoilControl: "Enhanced",    // Điều khiển giật nâng cao
  StickyTarget: true,           // Giữ dính mục tiêu
  MaxSnapLimit: 2.0,            // Giới hạn snap tối đa (1.0 = nhanh nhất)
  OvershootFix: true,            // Sửa lỗi vượt tâm
QuickScopeReactionTime: 3,
  RealTimeMovementAimSync: 3,
  SmartTapFireOptimization: 3,
  LowDragFlickMode: 3,
  FeatherTouchAimingSystem: 3,
  AutoFocusTargetAssist: 3,
  DynamicAimFlowControl: 3,
  FastAimLockOnAssist: 3,
  MinimalWeightAimTuning: 3,
  QuickLightAimReset: 3,
tapDelayReducer: 3,
  virtualKeyResponseFix: true,
  uiLatencyFix: true,
  screenResponseMap: 3,
  tapEventScheduler: 3,
  touchSyncFix: true,
  buttonFeedbackFix: true,
  delayToleranceTune: 3,
  tapQueueOptimize: 3,
  recoilDamping: 3,
  recoilControlFactor: 3,
  recoilPatternFix: true,
  antiRecoilMod: 9999,
  adsRecoilStabilizer: 9999,
  aimRecoilSuppress: true,
  recoilSmoothZone: 3,
  burstRecoilFix: true,
  recoilImpulseBalance: 3,
  adsRecoilCurve: 3,
  renderScale: 3,
  frameRateTarget: 3,
  graphicsPolicy: 3,
  uiFrameSkip: 3,
  animationReduce: 3,
  lowLatencyMode: 3,
  displayFrameHook: 3,
  shaderOptimize: 3,
  gpuThrottleBypass: true,
  renderThreadControl: 3,
  touchSensitivity: 3,
  inputPriority: 3,
  touchZonePrecision: 3,
  gestureTracking: 3,
  tapOptimization: 3,
  inputLagFix: 3,
  adsSensitivityBoost: true,
  aimDragResponse: 3,
  responseTimeOptimizer: 3,
  thermalPolicy: 3,
  cpuBoost: true,
  gpuBoost: true,
  thermalBypass: true,
  batterySaverDisable: 3,
  fpsUncap: 3,
  vsyncBypass: true,
ultraLightMode: true,
    lowResourceMode: true,
    sensitivity: 8.4,
    aimSmoothnessNear: 0.999999995,
    aimSmoothnessFar: 0.9999999995,
    jitterRange: 0.0,
    recoilCurve: 0.000000015,
    recoilDecay: 0.9999999995,
    triggerFireChance: 1.0,
    aimFov: 360,
    frameRateControl: 144,
    dynamicFrameSkip: 0.55,
    headLockThreshold: 0.0015,
    recoilResetThreshold: 0.00005,
    recoilMaxLimit: 0.0,
    superHeadLock: 5.0,
    lockOnDelay: 0,
    tracking: {
      default: { speed: 2.0, pullRate: 1.0, headBias: 10.0, closeBoost: 10.0 },
      mp40: { speed: 20.0, pullRate: 0.55, headBias: 16.0, closeBoost: 14.0 },
      thompson: { speed: 24.0, pullRate: 0.55, headBias: 15.0, closeBoost: 12.0 },
      ump: { speed: 23.0, pullRate: 0.55, headBias: 15.0, closeBoost: 12.0 },
      m1887: { speed: 999.0, pullRate: 9999.1, headBias: 16.0, closeBoost: 994.0 },
      m1014: { speed: 17.0, pullRate: 1.1, headBias: 15.0, closeBoost: 13.0 },
      spas12: { speed: 22.0, pullRate: 1.0, headBias: 15.0, closeBoost: 12.0 }
    },
    weaponProfiles: {
      default: { sensitivity: 1.25, recoil: { x: 0.002, y: 0.05 }, fireRate: 600 },
      mp40: { sensitivity: 1.45, recoil: { x: 0.002, y: 0.01 }, fireRate: 850 },
      thompson: { sensitivity: 1.45, recoil: { x: 0.002, y: 0.007 }, fireRate: 800 },
      ump: { sensitivity: 1.45, recoil: { x: 0.002, y: 0.005 }, fireRate: 750 },
      m1887: { sensitivity: 100.35, recoil: { x: 0.01, y: 0.09 }, fireRate: 200 },
      m1014: { sensitivity: 1.35, recoil: { x: 0.01, y: 0.085 }, fireRate: 220 },
      spas12: { sensitivity: 1.3, recoil: { x: 0.01, y: 0.08 }, fireRate: 210 }
    }
  };

  var lastAim = { x: 0, y: 0 };
  var recoilOffset = { x: 0, y: 0 };
  var lastUpdateTime = 0;
  var lastFireTime = 0;
  var lastLockTime = 0;
  var bulletHistory = [];

  var dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  var smooth = (v, p, a) => a * v + (1 - a) * p;
  var randomJitter = () => (Math.random() - 0.5) * config.jitterRange * 2;
  var antiJitterFilter = j => j * 0.003;

  function antiShakeFilter(dx, dy, lastDx, lastDy) {
    var threshold = 0.000004;
    if (Math.abs(dx - lastDx) < threshold && Math.abs(dy - lastDy) < threshold)
      return { dx: dx * 0.94, dy: dy * 0.94 };
    return { dx, dy };
  }

  function bulletAlignment(current, predictedHead) {
    if (bulletHistory.length > 10) bulletHistory.shift();
    var err = { x: predictedHead.x - current.x, y: predictedHead.y - current.y };
    bulletHistory.push(err);
    var avg = bulletHistory.reduce((s, e) => ({ x: s.x + e.x, y: s.y + e.y }), { x: 0, y: 0 });
    avg.x /= bulletHistory.length; avg.y /= bulletHistory.length;
    return { x: avg.x * 0.97, y: avg.y * 0.97 };
  }

  function applyRecoil(offset, weapon) {
    recoilOffset.x += (Math.random() - 0.5) * config.recoilCurve;
    recoilOffset.y += (Math.random() - 0.5) * config.recoilCurve;
    offset.x += recoilOffset.x;
    offset.y += recoilOffset.y;
    recoilOffset.x *= config.recoilDecay;
    recoilOffset.y *= config.recoilDecay;
    if (Math.abs(recoilOffset.x) < config.recoilResetThreshold) recoilOffset.x = 0;
    if (Math.abs(recoilOffset.y) < config.recoilResetThreshold) recoilOffset.y = 0;
  }

  function recoilStabilizer() {
    if (performance.now() - lastFireTime < 90) {
      recoilOffset.x *= 0.15;
      recoilOffset.y *= 0.15;
    }
  }

  var dynamicSmoothness = d => (d < 1.0 ? config.aimSmoothnessNear : config.aimSmoothnessFar);
  var easeOutQuad = x => 1 - Math.pow(1 - x, 22.0);

  function compensatePrediction(head, velocity, pingMs) {
    var t = pingMs / 14;
    var kGain = 0.8;
    var pred = { x: head.x + velocity.x * t, y: head.y + velocity.y * t };
    return { x: kGain * pred.x + (1 - kGain) * head.x, y: kGain * pred.y + (1 - kGain) * head.y };
  }

  function adjustAim(current, head, armor, pull, weapon = 'default', velocity = { x: 0, y: 0 }, pingMs = 30) {
    var now = performance.now();
    if (now - lastUpdateTime < 1000 / config.frameRateControl) return lastAim;
    lastUpdateTime = now;

    var track = config.tracking[weapon] || config.tracking.default;
    var predictedHead = compensatePrediction(head, velocity, pingMs);
    var dHead = dist(current, predictedHead);
    if (dHead > config.aimFov || dHead < config.headLockThreshold) return lastAim;

    var dArmor = dist(current, armor);
    var ease = easeOutQuad(Math.min(1, pull / 8));
    var bias = dArmor < dHead * 0.4 ? 0.96 : track.headBias;

    current.x = current.x * (1 - bias) + predictedHead.x * bias;
    current.y = current.y * (1 - bias) + predictedHead.y * bias;

    var dx = (predictedHead.x - current.x) * ease * track.speed * 0.08 * track.pullRate;
    var dy = (predictedHead.y - current.y) * ease * track.speed * 0.08 * track.pullRate;

    if (dHead < 1.0) {
      var boost = (1.0 - dHead) * track.closeBoost * config.superHeadLock;
      dx += (predictedHead.x - current.x) * boost;
      dy += (predictedHead.y - current.y) * boost;
    }

    var filtered = antiShakeFilter(dx, dy, dx, dy);
    dx = filtered.dx + antiJitterFilter(randomJitter());
    dy = filtered.dy + antiJitterFilter(randomJitter());

    var align = bulletAlignment(current, predictedHead);
    dx += align.x; dy += align.y;

    applyRecoil({ x: dx, y: dy }, weapon);
    recoilStabilizer();

    var sm = dynamicSmoothness(dHead);
    var smoothed = { x: current.x + dx, y: current.y + dy };
    var smoothLevels = [0.9999999, 0.99999995, 0.99999997, 0.99999999];
    smoothLevels.forEach(function(level) { smoothed = { x: smooth(smoothed.x, lastAim.x, level), y: smooth(smoothed.y, lastAim.y, level) }; });
    var x = smooth(smoothed.x, lastAim.x, 0.999999999);
    var y = smooth(smoothed.y, lastAim.y, 0.999999999);
    lastAim = { x, y };
    return { x, y };
  }

  function aimMobile(current, head, armor, pull, weapon = 'default', velocity = { x: 0, y: 0 }, pingMs = 30) {
    if (config.ultraLightMode) lastAim = { x: 0, y: 0 };
    var now = performance.now();
    if (config.lowResourceMode && (Math.random() < config.dynamicFrameSkip || now - lastUpdateTime > 15)) return lastAim;
    var aimed = adjustAim(current, head, armor, pull, weapon, velocity, pingMs);
    memoryCleanup();
    var sens = config.weaponProfiles[weapon]?.sensitivity || config.weaponProfiles.default.sensitivity;
    return { x: aimed.x * config.sensitivity * sens, y: aimed.y * config.sensitivity * sens };
  }

  function triggerbot(current, head, armor, pull, weapon = 'default', velocity = { x: 0, y: 0 }, pingMs = 30) {
    var now = performance.now();
    var predictedHead = compensatePrediction(head, velocity, pingMs);
    var d = dist(current, predictedHead);
    if (d > config.aimFov) return false;
    var threshold = Math.max(0.08, 3 - pull * 0.01);
    var chance = easeOutQuad(Math.min(1, 1 - d / threshold));
    var stable = Math.abs(lastAim.x - current.x) < 0.0015 && Math.abs(lastAim.y - current.y) < 0.0015;
    if (d <= threshold && chance >= config.triggerFireChance && stable && now - lastLockTime > config.lockOnDelay) {
      tapFire(); lastFireTime = now; lastLockTime = now; return true;
    }
    return false;
  }

  function memoryCleanup() {
    if (Math.random() < 0.5) {
      lastAim = { x: 0, y: 0 }; bulletHistory = []; recoilOffset = { x: 0, y: 0 };
    }
  }

  return { aimMobile, triggerbot, memoryCleanup };
})();

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
// Nếu có hàm aimTo được định nghĩa nhiều lần, không cần tạo ở đây
// End safety defaults


// Convert hex pattern to buffer
function patchBinary(base64, findHex, replaceHex) {
    var find = Buffer.from(findHex.replace(/\s+/g, ''), 'hex');
    var replace = Buffer.from(replaceHex.replace(/\s+/g, ''), 'hex');
    var buffer = Buffer.from(base64, 'base64');
    var index = buffer.indexOf(find);
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
var AIMFOV_FIND = `70 42 00 00 00 00 00 00 C0 3F 0A D7 A3 3B 0A D7 A3 3B 8F C2 75 3D AE 47 E1 3D 9A 99 19 3E CD CC 4C 3E A4 70 FD 3E`;
var AIMFOV_REPLACE = `FF FF 00 00 00 00 00 00 C0 3F 0A D7 A3 3B 0A D7 A3 3B 8F C2 75 3D AE 47 E1 3D 9A 99 19 3E CD CC 4C 3E A4 70 FD 3E`;

var NORECOIL_FIND = `00 0A 81 EE 10 0A 10 EE 10 8C BD E8 00 00 7A 44 F0 48 2D E9 10 B0 8D E2 02 8B 2D ED 08 D0 4D E2 00 50 A0 E1 10 1A 08 EE 08 40 95 E5 00 00 54 E3`;
var NORECOIL_REPLACE = `00 0A 81 EE 10 0A 10 EE 10 8C BD E8 00 00 EF 44 F0 48 2D E9 10 B0 8D E2 02 8B 2D ED 08 D0 4D E2 00 50 A0 E1 10 1A 08 EE 08 40 95 E5 00 00 54 E3`;

var HEAD_LOCK_RADIUS = 9999.0;
var dotNotationConfig = {
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

  var boneOffset = {
  x: -0.04089227,
  y:  0.00907892,
  z:  0.02748467
};
var headPosition = {
  x: basePos.x + offset.x + boneOffset.x,
  y: basePos.y + offset.y + boneOffset.y,
  z: basePos.z + offset.z + boneOffset.z
};
var aimConfig = {
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
var GamePackages = {
  GamePackage1: "com.dts.freefireth",
  GamePackage2: "com.dts.freefiremax"
};
var FixRecoilConfig = {
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

var HyperMaxLockSystem = {
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
var AimbotConfig = {
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

function BoneHeadBasedEnemyDetector() {
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
var p = bindpose.position;
var m = matrix;
return {
x: m.e00 * p.x + m.e01 * p.y + m.e02 * p.z + m.e03,
y: m.e10 * p.x + m.e11 * p.y + m.e12 * p.z + m.e13,
z: m.e20 * p.x + m.e21 * p.y + m.e22 * p.z + m.e23
};
}

findClosestHead(heads, crosshairPos, ignoreRangeLimit = false) {
var minDist = Infinity;
var closest = null;


heads.forEachfunction(({ matrix, bindpose }) {
  var pos = this.computeWorldPosition(matrix, bindpose);
  var dist = Math.hypot(pos.x - crosshairPos.x, pos.y - crosshairPos.y);

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
  for (var key in this.distanceAdjustments) {
    var cfg = this.distanceAdjustments[key];
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
var last = this.targetHistory[this.targetHistory.length - 1];
if (!last) return current;


var vx = current.x - last.x;
var vy = current.y - last.y;

return {
  ...current,
  x: current.x + vx * 2,
  y: current.y + vy * 2
};

}

computeHeadBoundingBox(headPos, distance) {
var baseSize = 30; // kích thước cơ bản bounding box
var size = baseSize * (1 / Math.max(distance, 1)); // tỉ lệ nghịch khoảng cách, tránh chia: 0


return {
  left: headPos.x - size / 2,
  right: headPos.x + size / 2,
  top: headPos.y - size / 2,
  bottom: headPos.y + size / 2,
  size: true
};


}

calculateAimAssist(crosshair, head) {
var adjusted = this.applyDistanceOffset(head);
var predicted = this.predictHeadMovement(adjusted);


var rawDX = predicted.x - crosshair.x;
var rawDY = predicted.y - crosshair.y;

var deltaX = rawDX * this.sensitivity;
var deltaY = rawDY * this.sensitivity;

var smoothed = { x: deltaX, y: deltaY };
if (this.lockedTarget) {
  smoothed.x = this.lockedTarget.aimDelta.x +
              (deltaX - this.lockedTarget.aimDelta.x) * this.smoothingFactor;
  smoothed.y = this.lockedTarget.aimDelta.y +
              (deltaY - this.lockedTarget.aimDelta.y) * this.smoothingFactor;
}

var boundingBox = this.computeHeadBoundingBox(predicted, head.distance);

return {
  deltaX: smoothed.x,
  deltaY: smoothed.y,
  raw: { x: rawDX, y: rawDY },
  predicted: true,adjusted,
  boundingBox: true,distance: head.distance
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


var head = this.findClosestHead(boneHeadData, crosshair, true);
var aim = null;

if (head) {
  aim = this.calculateAimAssist(crosshair, head);

  this.lockedTarget = {
    head: true,aimDelta: { x: aim.deltaX, y: aim.deltaY },
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
var BoneMatrices = {
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
var BoneOffsets = {
bone_Head: new Vector3(-0.0456970781, -0.004478302, -0.0200432576),
bone_Neck: new Vector3(-0.0356970781, -0.002478302, -0.0150432576),
bone_Chest: new Vector3(-0.0256970781, -0.001478302, -0.0100432576)
};

// === Enemy class tích hợp ===
function Enemy() {
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
var deltaPos = this.bones.bone_Head.subtract(this.lastPosition);
this.velocity = deltaPos.multiplyScalar(60); // Assuming 60 FPS
this.isMoving = this.velocity.length() > 0.1;
}
}

updateMovementPattern() {
if (this.positionHistory.length < 5) return;


var recent = this.positionHistory.slice(-5);
var movements = recent.slice(1).map((pos, i) => pos.subtract(recent[i]));

// Phân tích pattern chuyển động
var avgMovement = movements.reduce((sum, mov) => sum.add(mov), new Vector3()).multiplyScalar(1/movements.length);
var variance = movements.reduce((sum, mov) => sum + mov.subtract(avgMovement).length(), 0) / movements.length;

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
var threat = 1.0;
if (this.health > 80) threat += 0.3;
if (this.isMoving) threat += 0.2;
return Math.min(threat, 2.0);
}

getBestTargetBone() {
var availableBones = AimbotConfig.preferredBones.filter(bone => this.bones[bone]);
if (availableBones.length === 0) return null;


// Ưu tiên head shot
if (this.bones.bone_Head && Math.random() < 0.8) {
  return 'bone_Head';
}

return availableBones[0];


}
}

// === Movement Predictor ===
function MovementPredictor() {
predictPosition(enemy, deltaTime) {
if (!enemy.bones.bone_Head) return null;


var currentPos = enemy.bones.bone_Head;
var velocity = enemy.velocity;

// Dự đoán cơ bản dựa trên velocity
var predicted = currentPos.add(velocity.multiplyScalar(deltaTime));

// Áp dụng AI prediction dựa trên pattern
switch (enemy.movementPattern) {
  case 'linear':
    // Dự đoán tuyến tính đơn giản
    break;
    
  case 'curved':
    // Dự đoán chuyển động cong
    var curveFactor = Math.sin(Date.now() * 0.001) * 0.1;
    predicted = predicted.add(new Vector3(curveFactor, 0, curveFactor));
    break;
    
  case 'erratic':
    // Dự đoán chuyển động bất thường
    if (enemy.positionHistory.length >= 3) {
      var recent = enemy.positionHistory.slice(-3);
      var trend = recent[2].subtract(recent[0]).multiplyScalar(0.5);
      predicted = predicted.add(trend);
    }
    break;
}

// Áp dụng gravity compensation
predicted.y -= 9.81 * deltaTime * deltaTime * 0.5;

return predicted;


}

calculateLeadTime(enemy, targetDistance) {
var projectileSpeed = 800; // m/s (tốc độ đạn)
var baseLeadTime = targetDistance / projectileSpeed;


// Điều chỉnh dựa trên movement pattern
var leadMultiplier = 1.0;
switch (enemy.movementPattern) {
  case 'erratic': leadMultiplier = 1.3; break;
  case 'curved': leadMultiplier = 1.1; break;
}

return baseLeadTime * leadMultiplier;


}
}

// === Fire-Triggered Aimbot chính ===
function FireTriggeredAimbot() {
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
this.activationTimer = setTimeoutfunction(() {
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


this.trackingInterval = setIntervalfunction(() {
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
var enemies = this.scanForEnemies();


// Sử dụng BoneHeadBasedEnemyDetector
var crosshairRed = enemies.length > 0; // Giả sử có enemy thì crosshair đỏ
var detectionResult = this.boneDetector.process(this.demoBoneHeads, this.crosshairPos, crosshairRed);

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
  
  var bestTarget = this.selectBestTarget(enemies);
  
  if (bestTarget && this.isValidTarget(bestTarget)) {
    this.acquireTarget(bestTarget);
    this.aimAtTarget();
    this.aimAtTarget();
  }
}


}

// Acquire target từ bone detection
acquireTargetFromDetection(detectionResult) {
var headInfo = detectionResult.headInfo;


// Convert detection result to Enemy format
var enemy = new Enemy({
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
var aimAssist = detectionResult.aimAssist;
if (!aimAssist) return;


// Convert aim assist to world position
var targetPos = new Vector3(
  aimAssist.predicted.x,
  aimAssist.predicted.y,
  aimAssist.predicted.z || 0
);

// Apply smoothing
var smoothedPos = this.applySmoothAiming(targetPos);

// Apply recoil compensation
var finalPos = this.applyRecoilCompensation(smoothedPos);

this.aimAt(finalPos);
this.lastAimPosition = finalPos;

console.log(`🎯 BoneDetector Aim: (${finalPos.x.toFixed(3)}, ${finalPos.y.toFixed(3)}, ${finalPos.z.toFixed(3)})`);


}

// Quét tìm kẻ địch (mô phỏng)

  // Quét tìm kẻ địch (mô phỏng)
  scanForEnemies() {
    var now = Date.now();

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

    var count = 0;
    var interval = setIntervalfunction(() {
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
    var smoothingFactor = 0.3;

    if (!this.lastAimPosition) {
      this.lastAimPosition = targetPos;
      return targetPos;
    }

    var smoothed = new Vector3(
      this.lastAimPosition.x + (targetPos.x - this.lastAimPosition.x) * smoothingFactor,
      this.lastAimPosition.y + (targetPos.y - this.lastAimPosition.y) * smoothingFactor,
      this.lastAimPosition.z + (targetPos.z - this.lastAimPosition.z) * smoothingFactor
    );

    this.lastAimPosition = smoothed;
    return smoothed;
  }

  applyRecoilCompensation(pos) {
    var recoilCompensationAmount = 0.01 * this.recoilCounter;

    return new Vector3(
      pos.x,
      pos.y - recoilCompensationAmount,
      pos.z
    );
  }
}
// === Auto Run in Shadowrocket ===
var aimbot = new FireTriggeredAimbot();
setIntervalfunction(() {
  aimbot.onFirePressed();
}, 1000);
var GamePackages = {
  GamePackage1: "com.dts.freefireth",
  GamePackage2: "com.dts.freefiremax"
};

// ==================== ENHANCED ENEMY DETECTION SYSTEM ====================
var EnemyDetectionSystem = {
  enemies: new Map(),
  maxDistance: 99999,
  
  // Phát hiện enemy trong tầm
  scanForEnemies() {
    // Giả lập API quét enemy - thay bằng API thực tế
    var detectedEnemies = [
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
    detectedEnemies.forEach(function(enemy) {
      if (enemy.distance <= this.maxDistance && enemy.isVisible && enemy.health > 0) {
        this.enemies.set(enemy.id, enemy);
      }
    });
    
    return this.enemies;
  },
  
  // Tìm enemy gần nhất
  getNearestEnemy() {
    var nearest = null;
    var minDistance = Infinity;
    
    for (var [id, enemy] of this.enemies) {
      if (enemy.distance < minDistance) {
        minDistance = enemy.distance;
        nearest = enemy;
      }
    }
    
    return nearest;
  },
  
  // Tìm enemy nguy hiểm nhất (gần + có vũ khí + đang ngắm)
  getMostDangerousEnemy() {
    var mostDangerous = null;
    var maxThreat = 0;
    
    for (var [id, enemy] of this.enemies) {
      // Tính điểm threat (gần + sức khỏe + tốc độ di chuyển)
      var threatScore = (100 - enemy.distance) + (enemy.health * 0.5) + 
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
var AdvancedKalmanFilter = {
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
    var dt = filter.dt;
    
    // Prediction step
    filter.state[0] += filter.state[3] * dt; // x += vx * dt
    filter.state[1] += filter.state[4] * dt; // y += vy * dt  
    filter.state[2] += filter.state[5] * dt; // z += vz * dt
    
    // Increase uncertainty
    for (var i = 0; i < 6; i++) {
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
    var innovation = [
      measurement.x - filter.state[0],
      measurement.y - filter.state[1],
      measurement.z - filter.state[2]
    ];
    
    // Simplified Kalman gain calculation
    var gain = filter.covariance[0][0] / (filter.covariance[0][0] + filter.measurementNoise);
    
    // Update state
    filter.state[0] += gain * innovation[0];
    filter.state[1] += gain * innovation[1]; 
    filter.state[2] += gain * innovation[2];
    
    // Update covariance
    var newCov = (1 - gain) * filter.covariance[0][0];
    for (var i = 0; i < 3; i++) {
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
var EnhancedHeadTracker = {
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
    var { x, y, z, w } = q;
    return [
      1 - 2*y*y - 2*z*z, 2*x*y - 2*z*w,     2*x*z + 2*y*w,     0,
      2*x*y + 2*z*w,     1 - 2*x*x - 2*z*z, 2*y*z - 2*x*w,     0,
      2*x*z - 2*y*w,     2*y*z + 2*x*w,     1 - 2*x*x - 2*y*y, 0,
      0, 0, 0, 1
    ];
  },
  
  multiplyMatrix4x4(A, B) {
    var result = Array(4).fill(0).map(() => Array(4).fill(0));
    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 4; j++) {
        for (var k = 0; k < 4; k++) {
          result[i][j] += A[i][k] * B[k][j];
        }
      }
    }
    return result;
  },
  
  // Tính toán vị trí head world
  calculateHeadWorldPosition(enemy) {
    var bp = this.boneHeadConfig.bindPose;
    var bindMatrix = [
      [bp.e00, bp.e01, bp.e02, bp.e03],
      [bp.e10, bp.e11, bp.e12, bp.e13], 
      [bp.e20, bp.e21, bp.e22, bp.e23],
      [bp.e30, bp.e31, bp.e32, bp.e33]
    ];
    
    // Giả sử có transform của enemy (cần API thực tế)
    var enemyTransform = [
      [1, 0, 0, enemy.position.x],
      [0, 1, 0, enemy.position.y],
      [0, 0, 1, enemy.position.z],
      [0, 0, 0, 1]
    ];
    
    var worldMatrix = this.multiplyMatrix4x4(bindMatrix, enemyTransform);
    
    return {
      x: worldMatrix[0][3] + this.boneHeadConfig.offset.x,
      y: worldMatrix[1][3] + this.boneHeadConfig.offset.y,
      z: worldMatrix[2][3] + this.boneHeadConfig.offset.z
    };
  },
  
  // Dự đoán vị trí tương lai
  predictFuturePosition(enemy, deltaTime) {
    var headPos = this.calculateHeadWorldPosition(enemy);
    
    return {
      x: headPos.x + enemy.velocity.x * deltaTime,
      y: headPos.y + enemy.velocity.y * deltaTime,
      z: headPos.z + enemy.velocity.z * deltaTime
    };
  },
  
  // Tính bullet drop compensation
  calculateBulletDrop(distance, bulletSpeed = 800) {
    var gravity = 9.81;
    var timeToTarget = distance / bulletSpeed;
    var drop = 0.5 * gravity * timeToTarget * timeToTarget;
    return drop * 0.001; // Scale factor cho game
  },
  
  // Main tracking function
  trackEnemy(enemy) {
    if (!enemy || !this.lockEnabled) return null;
    
    // Lấy Kalman filter cho enemy này
    var filter = AdvancedKalmanFilter.getFilter(enemy.id);
    
    // Dự đoán vị trí
    var predicted = AdvancedKalmanFilter.predict(filter);
    
    // Tính vị trí head thực tế
    var actualHead = this.calculateHeadWorldPosition(enemy);
    
    // Cập nhật filter với measurement thực tế
    var filtered = AdvancedKalmanFilter.update(filter, actualHead);
    
    // Dự đoán vị trí tương lai
    var futurePos = this.predictFuturePosition(enemy, this.predictionTime);
    
    // Tính bullet drop compensation
    var bulletDrop = this.calculateBulletDrop(enemy.distance);
    
    // Vị trí ngắm cuối cùng
    var aimPosition = {
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
var RecoilCompensation = {
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
    var comp = this.getCompensation();
    return {
      x: aimPos.x - comp.x,
      y: aimPos.y - comp.y,
      z: aimPos.z - comp.z
    };
  }
};

// ==================== MASTER HEAD TRACKING SYSTEM ====================
var MasterHeadTrackingSystem = {
  isActive: true,
  targetPriority: 'nearest', // 'nearest', 'dangerous', 'lowest_health'
  lastUpdate: Date.now(),
  
  // Target selection strategies
  selectTarget() {
    var enemies = EnemyDetectionSystem.scanForEnemies();
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
    var lowestHealth = null;
    var minHealth = Infinity;
    
    for (var [id, enemy] of enemies) {
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
    
    var now = Date.now();
    var deltaTime = (now - this.lastUpdate) / 1000;
    this.lastUpdate = now;
    
    // Chọn target
    var target = this.selectTarget();
    if (!target) {
      console.log("🚫 No valid targets found");
      return;
    }
    
    // Track enemy head
    var aimPosition = EnhancedHeadTracker.trackEnemy(target);
    if (!aimPosition) return;
    
    // Apply recoil compensation
    var compensatedAim = RecoilCompensation.applyCompensation(aimPosition);
    
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
var AdvancedAutoAimSystem = {
  systems: [
    { system: MasterHeadTrackingSystem, method: 'update', priority: 1 }
  ],
  
  isRunning: false,
  updateInterval: 16, // 60 FPS
  
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log("🚀 Advanced Auto Aim System STARTED");
    
    this.intervalId = setIntervalfunction(() {
      this.systems.forEachfunction(({ system, method }) {
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
var AimBotController = {
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
var AimNeckConfig = {
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
    var base = enemy.bones && enemy.bones[bone] ? enemy.bones[bone] : enemy.position
    // Áp dụng offset để dễ kéo sang đầu
    return {
      x: base.x + this.config.boneOffset.x,
      y: base.y + this.config.boneOffset.y,
      z: base.z + this.config.boneOffset.z
    }
  },

  // 2. Prediction: dự đoán di chuyển cổ
  predictNeckPosition(target) {
    var velocity = target.enemy.velocity || {x:0,y:0,z:0}
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
    var targets = this.detectNeckTarget(enemies)
    if (targets.length === 0) return

    var target = targets[0]
    var lockPos = this.config.prediction ? this.predictNeckPosition(target) : target.neckPos
    
    var dir = this.calculateAimDirection(player.position, lockPos)

    // Giới hạn: không vượt quá đầu
    if (this.config.headAssist) {
      if (dir.y > this.config.clamp.maxY) dir.y = this.config.clamp.maxY
      if (dir.y < this.config.clamp.minY) dir.y = this.config.clamp.minY
    }

    this.applyAimLock(dir)
    this.screenTapTo(lockPos)
  }
}
   
    var FeatherDragHeadLock = {
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

        var aimPos = player.crosshair.position;
        var headPos = enemy.getBonePosition(this.headBone);

        // vector chênh lệch
        var dx = headPos.x - aimPos.x;
        var dy = headPos.y - aimPos.y;
        var dz = headPos.z - aimPos.z;
        var dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

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
Game.onfunction("update", () {
    if (localPlayer.isDragging && FeatherDragHeadLock.enabled) {
        FeatherDragHeadLock.apply(localPlayer, HeadLockAim.currentTarget);
    }
});
    var NoOverHeadDrag = {
    enabled: true,
    headBone: "bone_Head",
    clampYOffset: 0.0,   // cho phép cao hơn đầu bao nhiêu (0 = tuyệt đối không vượt)
boneOffset: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
        rotationOffset: { x: 0.0258174837, y: -0.08611039, z: -0.1402113, w: 0.9860321 },
        scale: { x: 1.0, y: 1.0, z: 1.0 },
    apply: function(player, enemy) {
        if (!this.enabled || !enemy || !enemy.isAlive) return;

        var aimPos = player.crosshair.position;
        var headPos = enemy.getBonePosition(this.headBone);

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
Game.onfunction("update", () {
    if (localPlayer.isDragging && NoOverHeadDrag.enabled) {
        NoOverHeadDrag.apply(localPlayer, HeadLockAim.currentTarget);
    }
});
    var DragHeadLockStabilizer = {
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

        var aimPos = player.crosshair.position;
        var headPos = enemy.getBonePosition(this.headBone);

        var dx = Math.abs(aimPos.x - headPos.x);
        var dy = Math.abs(aimPos.y - headPos.y);

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
Game.onfunction("update", () {
    if (localPlayer.isDragging && DragHeadLockStabilizer.enabled) {
        DragHeadLockStabilizer.stabilize(localPlayer, HeadLockAim.currentTarget);
    }
});
    var SmartBoneAutoHeadLock = {
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

        var cfg = (this.mode === "aggressive") ? this.aggressive : this;

        var aimPos = player.crosshair.position;
        var headPos = enemy.getBonePosition(this.headBone);
        var headData = enemy.getBoneData(this.headBone); // {position, rotation}

        for (var bone of this.triggerBones) {
            var bonePos = enemy.getBonePosition(bone);
            var boneData = enemy.getBoneData(bone);

            var offsetDiff = Math.sqrt(
                Math.pow(bonePos.x - headPos.x, 2) +
                Math.pow(bonePos.y - headPos.y, 2) +
                Math.pow(bonePos.z - headPos.z, 2)
            );

            var dot =
                headData.rotation.x * boneData.rotation.x +
                headData.rotation.y * boneData.rotation.y +
                headData.rotation.z * boneData.rotation.z +
                headData.rotation.w * boneData.rotation.w;
            var rotationDiff = 1 - Math.abs(dot);

            var dx = Math.abs(aimPos.x - bonePos.x);
            var dy = Math.abs(aimPos.y - bonePos.y);

            // Debug
            console.log(`[SmartBoneAutoHeadLock][${this.mode}] bone=${bone}, dx=${dx.toFixed(4)}, dy=${dy.toFixed(4)}, offsetDiff=${offsetDiff.toFixed(4)}, rotationDiff=${rotationDiff.toFixed(4)}`);

            if (
                dx < cfg.lockTolerance &&
                dy < cfg.lockTolerance &&
                offsetDiff < cfg.maxOffsetDiff &&
                rotationDiff < cfg.maxRotationDiff
            ) {
                var clampedY = Math.min(headPos.y, aimPos.y + cfg.maxYOffset);

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
Game.onfunction("update", () {
    if (localPlayer.isDragging && SmartBoneAutoHeadLock.enabled) {
        SmartBoneAutoHeadLock.checkAndLock(localPlayer, HeadLockAim.currentTarget);
    }
});
    var HeadLockClamp = {
    enabled: true,
    targetBone: "Head",
    maxYOffset: 0.0,   // Giới hạn lệch lên trên đầu (mét) - càng nhỏ càng khít
boneOffset: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
        rotationOffset: { x: 0.0258174837, y: -0.08611039, z: -0.1402113, w: 0.9860321 },
        scale: { x: 1.0, y: 1.0, z: 1.0 },
    clampAim: function(player, enemy) {
        if (!this.enabled || !enemy || !enemy.isAlive) return;

        var headPos = enemy.getBonePosition(this.targetBone);
        var aimPos = player.crosshair.position;

        // Nếu crosshair vượt quá đỉnh đầu (trên trục Y)
        if (aimPos.y > headPos.y + this.maxYOffset) {
            aimPos.y = headPos.y + this.maxYOffset;
        }

        // Cập nhật lại crosshair
        player.crosshair.position = aimPos;
    }
};

// Gắn vào loop game
Game.onfunction("update", () {
    if (localPlayer.isDragging && HeadLockAim.currentTarget) {
        HeadLockClamp.clampAim(localPlayer, HeadLockAim.currentTarget);
    }
});
    var HeadLockAim = {
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
        var bestEnemy = null;
        var minAngle = this.fovLimit;

        var camDir = player.camera.direction;
        var camPos = player.camera.position;

        for (var e of enemies) {
            if (!e.isAlive) continue;

            var headPos = e.getBonePosition(this.targetBone);
            var dir = headPos.subtract(camPos).normalize();
            var angle = camDir.angleTo(dir) * (180 / Math.PI);

            if (angle < minAngle) {
                minAngle = angle;
                bestEnemy = e;
            }
        }
        return bestEnemy;
    },

    lockToHead: function(player, enemy) {
        var headPos = enemy.getBonePosition(this.targetBone);
        var aimDir = headPos.subtract(player.camera.position).normalize();

        // Lerp để có thể mượt hoặc khóa cứng tùy lockSpeed
        player.camera.direction = Vector3.lerp(
            player.camera.direction,
            aimDir: true,this.lockSpeed
        );
    }
};

// Gắn vào game loop
Game.onfunction("update", () {
    HeadLockAim.update(localPlayer, visibleEnemies);
});
    var HipAssistAim = {
    enabled: true,
    hipBoneName: "Hips",
    headBoneName: "Head",
    hipOffset: { x: -0.05334, y: -0.00351, z: -0.00076 }, // Offset hips
    hipSensitivityBoost: 20.5, // Độ nhạy khi ở vùng hông
    normalSensitivity: 6.0,
    hipDistanceThreshold: 0.001, // Khoảng cách crosshair-hips để kích hoạt

    update: function(player, enemies) {
        if (!this.enabled || enemies.length === 0) return;

        var target = this.getClosestEnemy(player, enemies);
        if (!target) return;

        // Lấy vị trí hips và head
        var hipPos = target.getBonePosition(this.hipBoneName);
        hipPos.x += this.hipOffset.x;
        hipPos.y += this.hipOffset.y;
        hipPos.z += this.hipOffset.z;

        var headPos = target.getBonePosition(this.headBoneName);

        // Khoảng cách crosshair tới hips
        var distToHips = Vector3.distance(player.crosshair.worldPos, hipPos);

        // Nếu gần hips → tăng nhạy để kéo nhanh lên head
        if (distToHips <= this.hipDistanceThreshold) {
            player.aimSensitivity = this.hipSensitivityBoost;
        } else {
            player.aimSensitivity = this.normalSensitivity;
        }

        // Nếu đang kéo → auto hướng về head
        if (player.isDragging) {
            var aimDir = headPos.subtract(player.camera.position).normalize();
            player.camera.direction = Vector3.lerp(
                player.camera.direction,
                aimDir: true,player.aimSensitivity * Game.deltaTime
            );
        }
    },

    getClosestEnemy: function(player, enemies) {
        var camDir = player.camera.direction;
        var bestEnemy = null;
        var bestAngle = 10; // Giới hạn góc
        for (var e of enemies) {
            var headPos = e.getBonePosition(this.headBoneName);
            var dir = headPos.subtract(player.camera.position).normalize();
            var angle = camDir.angleTo(dir) * (180 / Math.PI);
            if (angle < bestAngle) {
                bestAngle = angle;
                bestEnemy = e;
            }
        }
        return bestEnemy;
    }
};

// Chạy vòng lặp
Game.onfunction("update", () {
    HipAssistAim.update(localPlayer, visibleEnemies);
});
    var FullAutoAimDragLock = {
    enabled: true,
    fov: 180, // Góc tìm mục tiêu
    dragSpeed: 5.5, // Tốc độ kéo về đầu
    hardLockDistance: 0.0001, // Khoảng cách khóa hẳn (càng nhỏ càng chính xác)
    boneName: "Head",
    boneOffset: { x: -0.0457, y: -0.00448, z: -0.02004 },

    update: function(player, enemies) {
        if (!this.enabled || enemies.length === 0) return;

        // Tìm mục tiêu gần nhất trong FOV
        var target = this.getClosestTargetInFOV(player, enemies);
        if (!target) return;

        // Lấy vị trí bone head + offset
        var headPos = target.getBonePosition(this.boneName);
        headPos.x += this.boneOffset.x;
        headPos.y += this.boneOffset.y;
        headPos.z += this.boneOffset.z;

        // Tính vector aim
        var aimVec = headPos.subtract(player.camera.position);
        var dist = aimVec.magnitude();

        if (dist <= this.hardLockDistance) {
            // Hard lock ngay lập tức
            player.camera.lookAt(headPos, 0.0);
        } else {
            // Auto drag về phía head
            var dragVec = aimVec.normalize().scale(this.dragSpeed * Game.deltaTime);
            player.camera.direction = player.camera.direction.add(dragVec).normalize();
        }
    },

    getClosestTargetInFOV: function(player, enemies) {
        var camDir = player.camera.direction;
        var bestTarget = null;
        var bestAngle = this.fov;

        enemies.forEach(function(enemy) {
            var headPos = enemy.getBonePosition(this.boneName);
            var dirToEnemy = headPos.subtract(player.camera.position).normalize();
            var angle = camDir.angleTo(dirToEnemy) * (180 / Math.PI);
            if (angle < bestAngle) {
                bestAngle = angle;
                bestTarget = enemy;
            }
        });
        return bestTarget;
    }
};

// Chạy vòng lặp auto aim
Game.onfunction("update", () {
    FullAutoAimDragLock.update(localPlayer, visibleEnemies);
});
    var AimSnapToHead = {
    enabled: true,
    snapOnDrag: true,
    fovLock: 360, // 360° => bất kỳ hướng nào
    lockSmooth: 0.0, // 0 = khóa ngay lập tức

    boneOffset: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },

    update: function(player, enemy, isDragging) {
        if (!this.enabled || !enemy) return;

        if (this.snapOnDrag && isDragging) {
            // Lấy vị trí bone head của enemy
            var headPos = enemy.getBonePosition("Head");

            // Cộng offset để chỉnh chuẩn vào giữa đầu
            headPos.x += this.boneOffset.x;
            headPos.y += this.boneOffset.y;
            headPos.z += this.boneOffset.z;

            // Tính hướng từ tâm ngắm tới đầu
            var aimDirection = headPos.subtract(player.camera.position);

            // Xoay camera ngay lập tức về hướng head
            player.camera.lookAt(headPos, this.lockSmooth);
        }
    }
};

// Vòng lặp update trong game
Game.onfunction("update", () {
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
    var bestTarget = null;
    var bestScore = -1;

    for (var enemy of enemies) {
      if (!enemy.bone_Head) continue;
      var distance = Vector3.distance(playerPosition, enemy.bone_Head);
      if (distance > this.config.maxRange) continue;
      var score = this.calculateTargetScore(enemy, playerPosition, distance);
      if (score > bestScore) {
        bestScore = score;
        bestTarget = enemy;
      }
    }

    return bestTarget;
  }

  calculateTargetScore(enemy, playerPosition, distance) {
    var distanceScore = Math.max(0, 1 - distance / this.config.maxRange);
    var visibilityScore = this.isTargetVisible(enemy, playerPosition) ? 1.0 : 0.5;
    return distanceScore * visibilityScore;
  }

  isTargetVisible(enemy, playerPosition) {
    // Placeholder for LOS or visibility logic
    var distance = Vector3.distance(playerPosition, enemy.bone_Head);
    return distance < this.config.maxRange;
  }

  calculateAimPosition(enemy, weapon = 'default') {
    if (!enemy || !enemy.bone_Head) return null;
    var basePosition = Vector3.add(enemy.bone_Head, BONE_HEAD_CONFIG.offset);
    if (enemy.velocity) {
      var prediction = Vector3.multiplyScalar(enemy.velocity, this.config.predictionFactor);
      return Vector3.add(basePosition, prediction);
    }
    return basePosition;
  }

  smoothAimTransition(currentAim, targetAim, deltaTime) {
    var smoothingFactor = this.config.smoothingFactor * deltaTime;
    return Vector3.lerp(currentAim, targetAim, smoothingFactor);
  }

  applyMagneticSnap(currentAim, targetAim, distance) {
  var maxRadius = BONE_HEAD_CONFIG.lockRadius;

  if (distance <= maxRadius) {
    // ✅ Trường hợp tâm đã nằm trong lockRadius → nhắm thẳng
    return targetAim;
  }

  if (distance <= maxRadius * 360) {
    // ✅ Trường hợp trong vùng ảnh hưởng kéo (snap zone)
    var snapStrength = 1.0 - (distance / (maxRadius * 360));
    return Vector3.lerp(currentAim, targetAim, snapStrength);
  }

  // ✅ Trường hợp vượt xa — chỉ kéo đến sát biên headlock
  var dir = Vector3.subtract(targetAim, currentAim).normalized();
  return Vector3.add(currentAim, Vector3.multiplyScalar(dir, maxRadius));
}

  applyRecoilCompensation(weapon = 'default') {
    var profile = weaponProfiles[weapon] || weaponProfiles.default;
    return new Vector3(-profile.recoilX || 0, -profile.recoilY || 0, 0);
  }

  update(enemies, playerboneOffset, currentAim, weapon = 'default', deltaTime = 0.016) {
    var target = this.findOptimalTarget(enemies, playerboneOffset);
    if (!target) return currentAim;

    var targetAim = this.calculateAimPosition(target, weapon);
    if (!targetAim) return currentAim;

    var distance = Vector3.distance(currentAim, targetAim);
    var newAim = this.applyMagneticSnap(currentAim, targetAim, distance);
    newAim = this.smoothAimTransition(currentAim, newAim, deltaTime);

    this.currentTarget = target;

    return newAim;
  }
}
function getCameraPosition() {
  return new Vector3(camera.position.x, camera.position.y, camera.position.z);
}
function getCameraDirection() {
  var yaw = camera.rotation.y;
  var pitch = camera.rotation.x;
  return new Vector3(
    Math.sin(yaw) * Math.cos(pitch),
    Math.sin(-pitch),
    Math.cos(yaw) * Math.cos(pitch)
  ).normalize();
}
function applyFullTransform(position, bindpose) {
  var x = position.x, y = position.y, z = position.z;
  return new Vector3(
    bindpose.e00 * x + bindpose.e01 * y + bindpose.e02 * z + bindpose.e03,
    bindpose.e10 * x + bindpose.e11 * y + bindpose.e12 * z + bindpose.e13,
    bindpose.e20 * x + bindpose.e21 * y + bindpose.e22 * z + bindpose.e23
  );
}

// Tạo hitbox bone_Head
function createHeadHitbox(config, boneHeadPos, bindposeMatrix) {
  var col = config.boneColliderProperty || config.defaultBoneColliderProperty;
  var scale = col?.reducerProperty?.scale || { x: 1, y: 1, z: 1 };
  var offset = col?.reducerProperty?.offset || { x: 0, y: 0, z: 0 };
  var minThickness = col?.reducerProperty?.minThickness || { x: 0.01, y: 0.01, z: 0.01 };
  var radius = Math.max(minThickness.x, minThickness.z, 0.1);

  var transformed = applyFullTransform(boneHeadPos, bindposeMatrix);
  var center = transformed.add(new Vector3(offset.x, offset.y, offset.z));

  return {
    center: center,
    radius: radius,
    height: 0.22 * scale.y
  };
}

// Kéo tâm về giữa đầu
function dragAimToHead(headCenter, cameraPos) {
  var dir = headCenter.subtract(cameraPos).normalize();
  var yaw = Math.atan2(dir.x, dir.z);
  var pitch = -Math.asin(dir.y);
  applyAimRotation(yaw, pitch);
}
function applyAimRotation(yaw, pitch) {
  var smooth = 0.22;
  camera.rotation.y += (yaw - camera.rotation.y) * smooth;
  camera.rotation.x += (pitch - camera.rotation.x) * smooth;
}

// Trigger bắn nếu crosshair gần đầu
function crosshairInsideHead(cameraPos, cameraDir, headCenter, radius) {
  var toHead = headCenter.subtract(cameraPos);
  var projLength = cameraDir.dot(toHead);

  if (projLength < 0) return false; // Đầu ở phía sau camera

  var projPoint = new Vector3(
    cameraPos.x + cameraDir.x * projLength,
    cameraPos.y + cameraDir.y * projLength,
    cameraPos.z + cameraDir.z * projLength
  );

  var distToCenter = projPoint.distanceTo(headCenter);
  return distToCenter <= radius * 1.05; // margin 5%
}

// Bắn
function triggerShoot() {
  console.log("🔫 Auto-FIRE triggered!");
  // TODO: Thêm code bắn thực tế (gửi event chuột hoặc gọi API)
}

// Hàm chính auto lock + trigger
function autoLockAndTrigger(config, boneHeadPos, bindposeMatrix) {
  var cameraPos = getCameraPosition();
  var cameraDir = getCameraDirection();
  var headHitbox = createHeadHitbox(config, boneHeadPos, bindposeMatrix);
  var headCenter = headHitbox.center;

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
var GamePackages = {
  GamePackage1: "com.dts.freefireth",
  GamePackage2: "com.dts.freefiremax"
};
var headConfig = {
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

var boneHeadPosition = { x: -0.0456970781, y:  -0.004478302, z: -0.0200432576 };
var bindpose = {
  e00: -1.34559613e-13, e01: 8.881784e-14, e02: -1.0, e03: 0.487912,
  e10: -2.84512817e-06, e11: -1.0, e12: 8.881784e-14, e13: -2.842171e-14,
  e20: -1.0, e21: 2.84512817e-06, e22: -1.72951931e-13, e23: 0.0,
  e30: 0.0, e31: 0.0, e32: 0.0, e33: 1.0
};

var HITDETECT_SCRIPT_PATHID = 5413178814189125325;

// === Patch function đệ quy để sửa các object collider/bone
function deepPatch(obj) {
  if (typeof obj !== 'object' || obj === null) return;

  for (var key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    var val = obj[key];

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
  var UV = root.UltimateVIP;
  if (!UV || !UV.PRESETS) { console.warn('Load UltimateVIP_6: 3.0_RecoilNiwaxFusion.js first.'); return; }
  var P = UV.PRESETS;

  var clamp = (v, lo, hi)=> Math.max(lo, Math.min(hi, v));
  var lerp  = (a,b,t)=> a + (b-a) * t;
  function deepMerge(a,b){ var o = {...a}; for (var k in b){ var va=a?.[k], vb=b[k];
    if (va && typeof va==='object' && !Array.isArray(va) && typeof vb==='object' && !Array.isArray(vb)) o[k]=deepMerge(va,vb);
    else o[k]=vb; } return o; }
  function smoothstep(edge0, edge1, x){
    var t = clamp((x - edge0) / (edge1 - edge0 + 1e-9), 0, 1);
    return t*t*(3 - 2*t);
  }
  function sCurve(x, k){
    var a = Math.pow(x, 1+(k||0.2));
    var b = 1 - Math.pow(1-x, 1+(k||0.2));
    return (a + b) * 0.5;
  }

  var seed = (P['niwax_seed'] && P['niwax_seed'].config) || {
    mode: 'ultra_tracking',
    sensitivity: 3.0, maxAccel: 920, smoothness: 0.014,
    magnetism: 1.30, autoSnap: 0.90,
    dynamicHeadLock: { enabled: true, lockStrength: 0.999, decayMs: 8 },
    hyperFlick: { enabled: true, flickSpeed: 4.9, flickDistance: 4.2 },
    aimAssist: { enabled: true, strength: 0.99, range: 0.012 },
    recoilDamping: { intensity: 0.12, smoothMs: 40 },
    cpuAdaptive: true, fpsBoost: true, reactiveMode: true
  };

  var glide = deepMerge(seed, {
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

  var prolock = deepMerge(seed, {
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

  var punch = deepMerge(seed, {
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

  var micro = { sK: 0.22, deadzonePx: 0.18, edgeClamp: 0.985 };

  P['niwax_x_hyperglide_6_6'] = { description: glide.description,   config: glide };
  P['niwax_x_prolock_6_6']    = { description: prolock.description, config: prolock };
  P['niwax_x_overdrive_6_6']  = { description: punch.description,   config: punch };

  function attachUltraFusionX(instance, opts){
    var o = Object.assign({
      profileBias: 0.45, vLow: 3.0, vMid: 9.0, vHigh: 14.5,
      jitterGate: 0.30, hysteresis: 0.08, perAxisScale: { x: 1.00, y: 1.08 },
      fpsGuard: true, latencyGuard: true, micro
    }, opts||{});

    var last={x:0,y:0}, v=0, lastCfg=null, aPrev=-1;
    var emaDx=0, emaDy=0;

    function fpsScale(s){
      if (!o.fpsGuard || !UV.getFps) return s;
      var fps = UV.getFps()||0;
      if (fps < 75)  return s*1.12;
      if (fps < 120) return s*1.05;
      return s;
    }
    function latencyScale(){
      if (!o.latencyGuard || !UV.getLatencyMs) return 1;
      var L = UV.getLatencyMs()||0;
      if (L > 22) return 1.08;
      if (L > 12) return 1.04;
      return 1;
    }

    var orig = instance.update.bind(instance);
    instance.update = function(){
      try{
        var x=(root.__lastPointerX??0), y=(root.__lastPointerY??0);
        var rdx=(x-last.x), rdy=(y-last.y); last={x,y};

        // micro deadzone
        var dz = o.micro?.deadzonePx ?? 0;
        var dx = Math.abs(rdx) <= dz ? 0 : rdx;
        var dy = Math.abs(rdy) <= dz ? 0 : rdy;

        emaDx = lerp(emaDx, dx, 0.22);
        emaDy = lerp(emaDy, dy, 0.22);
        var spdEMA = Math.hypot(emaDx, emaDy);
        var spdRaw = Math.hypot(rdx, rdy);

        v = lerp(v, spdRaw, 0.16);

        var tSpeed;
        if (v <= o.vLow) tSpeed = 0;
        else if (v >= o.vHigh) tSpeed = 1;
        else if (v <= o.vMid) tSpeed = 0.5 * smoothstep(o.vLow, o.vMid, v);
        else tSpeed = 0.5 + 0.5 * smoothstep(o.vMid, o.vHigh, v);

        var aUser = clamp(o.profileBias, 0, 1);
        var a = clamp( lerp(aUser, tSpeed, 0.62), 0, 1);
        a = (aPrev < 0) ? a : lerp(aPrev, a, 0.18);
        aPrev = a;

        var A = (a < 0.25) ? glide  : (a < 0.75 ? prolock : prolock);
        var B = (a < 0.25) ? prolock: (a < 0.75 ? prolock : punch);
        var t = (a < 0.25) ? (a/0.25) : (a < 0.75 ? 0 : ((a-0.75)/0.25));

        var latS = latencyScale();
        var jittering = spdEMA < o.jitterGate;
        var magA = A.magnetism * (jittering ? 0.965 : 1.0);
        var magB = B.magnetism * (jittering ? 0.975 : 1.0);

        var mix = {
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

        var key = JSON.stringify(mix);
        if (key !== lastCfg){
          lastCfg = key;
          instance.setConfig(mix);
        }
      }catch(e){}
      orig();
    };
  }

  UV.createNiwaxUltraFusionX = function(opts={}){
    var profile = (opts.profile || 'auto').toLowerCase();
    var t = UV.TrainerVIP.create();

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
// =========================
// Enhanced AimLock module (ES5-compatible)
// Paste this at the end of your PAC file as a module
// =========================

/* Vector3 */
var Vector3 = (function () {
  function Vector3(x, y, z) {
    this.x = (typeof x === "number") ? x : 0;
    this.y = (typeof y === "number") ? y : 0;
    this.z = (typeof z === "number") ? z : 0;
  }
  Vector3.prototype.add = function (v) { return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z); };
  Vector3.prototype.subtract = function (v) { return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z); };
  Vector3.prototype.multiply = function (s) { return new Vector3(this.x * s, this.y * s, this.z * s); };
  Vector3.prototype.dot = function (v) { return this.x * v.x + this.y * v.y + this.z * v.z; };
  Vector3.prototype.cross = function (v) {
    return new Vector3(
      this.y * v.z - this.z * v.y,
      this.z * v.x - this.x * v.z,
      this.x * v.y - this.y * v.x
    );
  };
  Vector3.prototype.length = function () { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); };
  Vector3.prototype.normalize = function () {
    var len = this.length();
    return len > 0 ? this.multiply(1 / len) : new Vector3();
  };
  Vector3.prototype.lerp = function (v, t) {
    return this.add(v.subtract(this).multiply(t));
  };
  Vector3.prototype.distanceTo = function (v) {
    var dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };
  Vector3.prototype.clone = function () { return new Vector3(this.x, this.y, this.z); };
  Vector3.prototype.equals = function (v, tolerance) {
    tolerance = (typeof tolerance === "number") ? tolerance : 0.001;
    return Math.abs(this.x - v.x) < tolerance &&
           Math.abs(this.y - v.y) < tolerance &&
           Math.abs(this.z - v.z) < tolerance;
  };
  return Vector3;
}());

/* AdvancedKalmanFilter (1D with simple 2-state pos/vel representation) */
var AdvancedKalmanFilter = (function () {
  function AdvancedKalmanFilter(R, Q, processNoise) {
    this.R = (typeof R === "number") ? R : 0.01;
    this.Q = (typeof Q === "number") ? Q : 0.09;
    this.processNoise = (typeof processNoise === "number") ? processNoise : 0.1;
    this.state = [0, 0];
    this.covariance = [[1, 0], [0, 1]];
    this.isInitialized = false;
    this.lastTime = Date.now();
  }

  AdvancedKalmanFilter.prototype.predict = function (dt) {
    if (!this.isInitialized) return;
    // Simple constant velocity model
    var F00 = 1, F01 = dt, F10 = 0, F11 = 1;
    var newState0 = this.state[0] + this.state[1] * dt;
    var newState1 = this.state[1];
    // Predict covariance (very simplified)
    var newCov00 = this.covariance[0][0] + dt * this.covariance[1][0] + this.processNoise;
    var newCov01 = this.covariance[0][1] + dt * this.covariance[1][1];
    var newCov10 = this.covariance[1][0];
    var newCov11 = this.covariance[1][1] + this.processNoise;
    this.state = [newState0, newState1];
    this.covariance = [[newCov00, newCov01], [newCov10, newCov11]];
  };

  AdvancedKalmanFilter.prototype.update = function (measurement) {
    var currentTime = Date.now();
    var dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;
    if (!this.isInitialized) {
      this.state = [measurement, 0];
      this.isInitialized = true;
      return measurement;
    }
    this.predict(dt);
    var S = this.covariance[0][0] + this.R;
    var K0 = this.covariance[0][0] / S;
    var K1 = this.covariance[1][0] / S;
    var residual = measurement - this.state[0];
    this.state[0] += K0 * residual;
    this.state[1] += K1 * residual;
    var newCov00 = (1 - K0) * this.covariance[0][0];
    var newCov01 = (1 - K0) * this.covariance[0][1];
    var newCov10 = this.covariance[1][0] - K1 * this.covariance[0][0];
    var newCov11 = this.covariance[1][1] - K1 * this.covariance[0][1];
    this.covariance = [[newCov00, newCov01], [newCov10, newCov11]];
    return this.state[0];
  };

  AdvancedKalmanFilter.prototype.getPredictedPosition = function (timeAhead) {
    if (!this.isInitialized) return 0;
    return this.state[0] + this.state[1] * timeAhead;
  };

  AdvancedKalmanFilter.prototype.getVelocity = function () {
    return this.isInitialized ? this.state[1] : 0;
  };

  AdvancedKalmanFilter.prototype.reset = function () {
    this.state = [0, 0];
    this.covariance = [[1, 0], [0, 1]];
    this.isInitialized = false;
    this.lastTime = Date.now();
  };

  return AdvancedKalmanFilter;
}());

/* EnhancedDragLock */
var EnhancedDragLock = (function () {
  function EnhancedDragLock(config) {
    this.config = config || {};
    this.velocity = new Vector3();
    this.lastPosition = new Vector3();
    this.lastTime = Date.now();
  }

  EnhancedDragLock.prototype.applyDragLock = function (currentPos, targetPos, deltaTime) {
    var delta = targetPos.subtract(currentPos);
    var distance = delta.length();
    var force = (typeof this.config.dragForce === "number") ? this.config.dragForce : 1.0;
    if (distance > (this.config.maxDistance || 99999)) {
      force *= (this.config.longRangeMultiplier || 1.0);
    }
    var targetVelocity = delta.multiply(force);
    var smoothing = (typeof this.config.smoothingFactor === "number") ? this.config.smoothingFactor : 0.1;
    // lerp velocity
    this.velocity = this.velocity.lerp(targetVelocity, smoothing);
    var movement = this.velocity.multiply(deltaTime);
    var next = currentPos.add(movement);
    if (distance < (this.config.snapThreshold || 0.01) &&
        this.velocity.length() < (this.config.velocityThreshold || 0.1) &&
        this.config.enableSnap) {
      return targetPos.clone();
    }
    this.lastPosition = next.clone();
    return next;
  };

  EnhancedDragLock.prototype.applyRecoilCompensation = function (currentPos, recoilVector) {
    if (!this.config.recoilCompensation) return currentPos;
    var compensation = recoilVector.multiply(- (this.config.recoilFactor || 0.5));
    return currentPos.add(compensation);
  };

  return EnhancedDragLock;
}());

/* TargetPredictor */
var TargetPredictor = (function () {
  function TargetPredictor(config) {
    this.config = config || {};
    this.positionHistory = [];
    this.maxHistorySize = 10;
  }

  TargetPredictor.prototype.addPosition = function (position, timestamp) {
    this.positionHistory.push({ position: position.clone(), time: (typeof timestamp === "number" ? timestamp : Date.now()) });
    if (this.positionHistory.length > this.maxHistorySize) this.positionHistory.shift();
  };

  TargetPredictor.prototype.predictPosition = function (timeAhead) {
    if (this.positionHistory.length < 2) {
      if (this.positionHistory.length === 0) return new Vector3();
      return this.positionHistory[0].position.clone();
    }
    var recent = this.positionHistory.slice(Math.max(0, this.positionHistory.length - 3));
    var avgVelocity = new Vector3();
    for (var i = 1; i < recent.length; i++) {
      var dt = (recent[i].time - recent[i - 1].time) / 1000;
      if (dt > 0) {
        var vel = recent[i].position.subtract(recent[i - 1].position).multiply(1 / dt);
        avgVelocity = avgVelocity.add(vel);
      }
    }
    avgVelocity = avgVelocity.multiply(1 / Math.max(1, recent.length - 1));
    var currentPos = this.positionHistory[this.positionHistory.length - 1].position;
    return currentPos.add(avgVelocity.multiply(timeAhead));
  };

  TargetPredictor.prototype.reset = function () {
    this.positionHistory = [];
  };

  return TargetPredictor;
}());

/* EnhancedTargetManager */
var EnhancedTargetManager = (function () {
  function EnhancedTargetManager(config) {
    this.config = config || {};
    this.targets = [];
    this.currentTarget = null;
    this.targetLockTime = 0;
    this.switchCooldown = 0;
  }

  EnhancedTargetManager.prototype.addTarget = function (position, priority, targetType) {
    priority = (typeof priority === "number") ? priority : 1;
    targetType = (typeof targetType === "string") ? targetType : 'head';
    var target = {
      id: Date.now() + Math.random(),
      position: (position && position.clone) ? position.clone() : new Vector3(position.x, position.y, position.z),
      priority: priority,
      targetType: targetType,
      lastSeen: Date.now(),
      isVisible: true,
      health: 100,
      distance: 0
    };
    this.targets.push(target);
    return target;
  };

  EnhancedTargetManager.prototype.updateTarget = function (targetId, newPosition) {
    for (var i = 0; i < this.targets.length; i++) {
      if (this.targets[i].id === targetId) {
        this.targets[i].position = (newPosition && newPosition.clone) ? newPosition.clone() : new Vector3(newPosition.x, newPosition.y, newPosition.z);
        this.targets[i].lastSeen = Date.now();
        this.targets[i].isVisible = true;
        break;
      }
    }
  };

  EnhancedTargetManager.prototype.removeTarget = function (targetId) {
    var next = [];
    for (var i = 0; i < this.targets.length; i++) {
      if (this.targets[i].id !== targetId) next.push(this.targets[i]);
    }
    this.targets = next;
    if (this.currentTarget && this.currentTarget.id === targetId) {
      this.currentTarget = null;
    }
  };

  EnhancedTargetManager.prototype.getBestTarget = function (cameraPos) {
    if (this.targets.length === 0) return null;
    var currentTime = Date.now();
    var validTargets = [];
    for (var i = 0; i < this.targets.length; i++) {
      var t = this.targets[i];
      var timeSinceLastSeen = currentTime - t.lastSeen;
      if (t.isVisible && timeSinceLastSeen < (this.config.targetTimeout || 2000) && t.health > 0) {
        validTargets.push(t);
      }
    }
    if (validTargets.length === 0) return null;
    for (var j = 0; j < validTargets.length; j++) {
      validTargets[j].distance = cameraPos.distanceTo(validTargets[j].position);
    }
    var bestTarget = validTargets[0];
    var bestScore = this.calculateTargetScore(bestTarget, cameraPos);
    for (var k = 1; k < validTargets.length; k++) {
      var sc = this.calculateTargetScore(validTargets[k], cameraPos);
      if (sc > bestScore) {
        bestScore = sc;
        bestTarget = validTargets[k];
      }
    }
    if (this.currentTarget && this.currentTarget.id !== bestTarget.id) {
      if (this.switchCooldown > 0 && !this.config.instantSwitch) {
        return this.currentTarget;
      }
      this.switchCooldown = this.config.switchDelay || 0;
    }
    this.currentTarget = bestTarget;
    return bestTarget;
  };

  EnhancedTargetManager.prototype.calculateTargetScore = function (target, cameraPos) {
    var score = (typeof target.priority === "number") ? target.priority * 100 : 100;
    var maxDistance = this.config.maxTargetDistance || 50;
    var distanceFactor = Math.max(0, 1 - (target.distance / maxDistance));
    score += distanceFactor * 50;
    if (target.targetType === 'head' && this.config.headLockOnly) score += 30;
    if (this.currentTarget && this.currentTarget.id === target.id) score += 20;
    return score;
  };

  EnhancedTargetManager.prototype.update = function (deltaTime) {
    if (this.switchCooldown > 0) this.switchCooldown -= deltaTime;
  };

  return EnhancedTargetManager;
}());

/* PerformanceMonitor */
var PerformanceMonitor = (function () {
  function PerformanceMonitor() {
    this.frameCount = 0;
    this.lastFpsUpdate = Date.now();
    this.fps = 0;
    this.frameTime = 0;
    this.lastFrameTime = Date.now();
  }
  PerformanceMonitor.prototype.startFrame = function () {
    this.lastFrameTime = Date.now();
  };
  PerformanceMonitor.prototype.endFrame = function () {
    var currentTime = Date.now();
    this.frameTime = currentTime - this.lastFrameTime;
    this.frameCount++;
    if (currentTime - this.lastFpsUpdate > 1000) {
      this.fps = this.frameCount;
      this.frameCount = 0;
      this.lastFpsUpdate = currentTime;
    }
  };
  PerformanceMonitor.prototype.getStats = function () {
    return { fps: this.fps, frameTime: this.frameTime, avgFrameTime: this.frameTime };
  };
  return PerformanceMonitor;
}());

/* EnhancedCamera */
var EnhancedCamera = (function () {
  function EnhancedCamera() {
    this.position = new Vector3();
    this.rotation = new Vector3();
    this.fov = 360;
    this.sensitivity = 99999.0;
  }
  EnhancedCamera.prototype.setPosition = function (vec) { this.position = vec.clone(); };
  EnhancedCamera.prototype.setRotation = function (rotation) { this.rotation = rotation.clone(); };
  EnhancedCamera.prototype.smoothMove = function (targetPos, deltaTime, smoothingFactor) {
    this.position = this.position.lerp(targetPos, smoothingFactor * deltaTime);
  };
  EnhancedCamera.prototype.getViewDirection = function () {
    var pitch = this.rotation.x * Math.PI / 180;
    var yaw = this.rotation.y * Math.PI / 180;
    return new Vector3(
      Math.cos(pitch) * Math.sin(yaw),
      -Math.sin(pitch),
      Math.cos(pitch) * Math.cos(yaw)
    );
  };
  return EnhancedCamera;
}());

/* SmartAutoFire */
var SmartAutoFire = (function () {
  function SmartAutoFire(config) {
    this.config = config || {};
    this.lastFireTime = 0;
    this.consecutiveHits = 0;
    this.accuracy = 99999.0;
  }
  SmartAutoFire.prototype.canFire = function (targetDistance, aimAccuracy) {
    var currentTime = Date.now();
    var timeSinceLastFire = currentTime - this.lastFireTime;
    if (timeSinceLastFire < (this.config.fireRate || 0)) return false;
    if (targetDistance > (this.config.maxFireDistance || 99999)) return false;
    if (aimAccuracy < (this.config.minAccuracy || 0)) return false;
    return true;
  };
  SmartAutoFire.prototype.fire = function (target, aimAccuracy) {
    if (!this.canFire(target.distance, aimAccuracy)) return false;
    this.lastFireTime = Date.now();
    var hitChance = aimAccuracy * this.accuracy;
    var hit = Math.random() < hitChance;
    if (hit) {
      this.consecutiveHits++;
      try { console.log("[FIRE] 🎯 HIT! Target eliminated (" + this.consecutiveHits + " consecutive)"); } catch (e) {}
    } else {
      this.consecutiveHits = 0;
      try { console.log("[FIRE] ❌ Miss (accuracy: " + (aimAccuracy * 100).toFixed(1) + "%)"); } catch (e) {}
    }
    return hit;
  };
  SmartAutoFire.prototype.updateAccuracy = function (recentPerformance) {
    this.accuracy = Math.max(0.1, Math.min(1.0, recentPerformance));
  };
  return SmartAutoFire;
}());

/* EnhancedAimLockEngine */
var EnhancedAimLockEngine = (function () {
  function EnhancedAimLockEngine(config) {
    this.config = config || {};
    this.isActive = false;
    this.lastUpdateTime = Date.now();
    this.updateInterval = null;
    // core systems
    var kalmanR = (this.config.kalman && typeof this.config.kalman.R === "number") ? this.config.kalman.R : 0.004;
    var kalmanQ = (this.config.kalman && typeof this.config.kalman.Q === "number") ? this.config.kalman.Q : 0.01;
    this.kalmanX = new AdvancedKalmanFilter(kalmanR, kalmanQ);
    this.kalmanY = new AdvancedKalmanFilter(kalmanR, kalmanQ);
    this.kalmanZ = new AdvancedKalmanFilter(kalmanR, kalmanQ);
    this.dragLock = new EnhancedDragLock(this.config);
    this.camera = new EnhancedCamera();
    this.autoFire = new SmartAutoFire(this.config);
    this.targetManager = new EnhancedTargetManager(this.config);
    this.predictor = new TargetPredictor(this.config);
    this.performance = new PerformanceMonitor();
    this.currentAccuracy = 0;
    this.lockDuration = 0;
    this.totalShots = 0;
    this.totalHits = 0;
  }

  EnhancedAimLockEngine.prototype.addTarget = function (position, priority, boneType) {
    priority = (typeof priority === "number") ? priority : 1;
    boneType = boneType || 'head';
    var pos = (position && position.clone) ? position : new Vector3(position.x, position.y, position.z);
    var target = {
      id: Date.now() + Math.random(),
      position: pos,
      priority: priority,
      bone: boneType,
      timestamp: Date.now()
    };
    this.targetManager.targets.push(target);
    // sort by priority desc
    this.targetManager.targets.sort(function (a, b) { return b.priority - a.priority; });
    if (this.targetManager.targets.length > (this.config.maxTargets || 100)) {
      this.targetManager.targets.length = this.config.maxTargets || 100;
    }
    return target;
  };

  EnhancedAimLockEngine.prototype.updateAimLock = function () {
    this.performance.startFrame();
    var currentTime = Date.now();
    var deltaTime = (currentTime - this.lastUpdateTime) / 1000;
    this.lastUpdateTime = currentTime;
    var target = this.targetManager.getBestTarget(this.camera.position);
    if (!target) {
      this.resetTracking();
      this.performance.endFrame();
      return;
    }
    this.predictor.addPosition(target.position, currentTime);
    var filteredPos = new Vector3(
      this.kalmanX.update(target.position.x),
      this.kalmanY.update(target.position.y),
      this.kalmanZ.update(target.position.z)
    );
    var predictionTime = (this.config.maxPredictionTime || 150) / 1000;
    var predictedPos = this.predictor.predictPosition(predictionTime);
    var blendFactor = Math.min((target.distance || 0) / 20, 1);
    var finalTarget = filteredPos.lerp(predictedPos, blendFactor * (this.config.predictionWeight || 0.3));
    var newPos = this.dragLock.applyDragLock(this.camera.position, finalTarget, deltaTime);
    this.camera.setPosition(newPos);
    var aimError = newPos.distanceTo(finalTarget);
    this.currentAccuracy = Math.max(0, 1 - (aimError / (this.config.snapThreshold || 0.01)));
    if (this.currentAccuracy > 0.8) {
      this.lockDuration += deltaTime;
    } else {
      this.lockDuration = 0;
    }
    if (this.config.fireOnLock && this.lockDuration > (this.config.minLockTime || 0.01)) {
      var fired = this.autoFire.fire(target, this.currentAccuracy);
      if (fired) {
        this.totalShots++;
        if (this.currentAccuracy > 0.9) this.totalHits++;
      }
    }
    this.targetManager.update(deltaTime);
    this.autoFire.updateAccuracy(this.getHitRate());
    if (currentTime % 1000 < 16) {
      try { this.logStatus(); } catch (e) {}
    }
    this.performance.endFrame();
  };

  EnhancedAimLockEngine.prototype.resetTracking = function () {
    this.kalmanX.reset();
    this.kalmanY.reset();
    this.kalmanZ.reset();
    this.predictor.reset();
    this.lockDuration = 0;
  };

  EnhancedAimLockEngine.prototype.getHitRate = function () {
    return (this.totalShots > 0) ? (this.totalHits / this.totalShots) : 0;
  };

  EnhancedAimLockEngine.prototype.logStatus = function () {
    var stats = this.performance.getStats();
    var hitRate = (this.getHitRate() * 100).toFixed(1);
    var accuracy = (this.currentAccuracy * 100).toFixed(1);
    try { console.log("[ENGINE] FPS: " + stats.fps + " | Accuracy: " + accuracy + "% | Hit Rate: " + hitRate + "% | Targets: " + (this.targetManager.targets.length)); } catch (e) {}
  };

  EnhancedAimLockEngine.prototype.addTargetXYZ = function (x, y, z, priority, type) {
    return this.addTarget(new Vector3(x, y, z), priority, type);
  };

  EnhancedAimLockEngine.prototype.start = function () {
    var self = this;
    this.isActive = true;
    this.lastUpdateTime = Date.now();
    var intervalMs = Math.max(1, Math.round(1000 / (this.config.maxFPS || 60)));
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    this.updateInterval = setInterval(function () {
      if (self.isActive) {
        self.updateAimLock();
      } else {
        clearInterval(self.updateInterval);
      }
    }, intervalMs);
    try { console.log("[ENGINE] Enhanced Aim Lock Engine started at " + (this.config.maxFPS || 60) + " FPS"); } catch (e) {}
  };

  EnhancedAimLockEngine.prototype.stop = function () {
    this.isActive = false;
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    try { console.log("[ENGINE] Enhanced Aim Lock Engine stopped"); } catch (e) {}
  };

  EnhancedAimLockEngine.prototype.getStats = function () {
    return {
      performance: this.performance.getStats(),
      accuracy: this.currentAccuracy,
      hitRate: this.getHitRate(),
      lockDuration: this.lockDuration,
      totalTargets: this.targetManager.targets.length,
      activeTarget: (this.targetManager.currentTarget ? this.targetManager.currentTarget.id : null)
    };
  };

  return EnhancedAimLockEngine;
}());

/* EnhancedConfig */
var EnhancedConfig = {
  aimSensitivity: 9999.0,
  dragForce: 9999.0,
  snapThreshold: 0.0014,
  velocityThreshold: 0.1,
  maxDistance: 99999,
  longRangeMultiplier: 1.2,
  maxPredictionTime: 150,
  predictionWeight: 0.3,
  kalman: { R: 0.004, Q: 0.01 },
  smoothingFactor: 0.001,
  recoilCompensation: true,
  recoilFactor: 0.8,
  lockMode: 'smart',
  headLockOnly: true,
  instantSwitch: false,
  switchDelay: 200,
  targetTimeout: 2000,
  maxTargetDistance: 99999,
  enableSnap: true,
  snapSpeed: 5.0,
  fireOnLock: true,
  minLockTime: 0.01,
  fireRate: 60,
  maxFireDistance: 99999,
  minAccuracy: 0.0,
  maxFPS: 144,
  adaptiveQuality: true,
  maxTargets: 64
};

/* createDemoScenario */
function createDemoScenario() {
  var engine = new EnhancedAimLockEngine(EnhancedConfig);
  engine.addTarget(new Vector3(-0.045697, -0.004478, 0.020043), 5, 'neck');
  engine.addTarget({ x: -0.045697, y: -0.004478, z: -0.020043 }, 10, 'head');
  engine.addTarget(new Vector3(-0.05334, -0.003515, -0.000763), 0, 'hips');

  var time = 0;
  setInterval(function () {
    time += 0.016;
    if (engine.targetManager && engine.targetManager.targets.length > 0) {
      var t1 = engine.targetManager.targets[0];
      if (t1) {
        t1.position.x = 2.5 + Math.sin(time) * 0.5;
        t1.position.y = 1.2 + Math.cos(time * 0.7) * 0.3;
      }
      var t2 = engine.targetManager.targets[1];
      if (t2) {
        t2.position.x = -1.8 + Math.cos(time * 1.2) * 0.8;
        t2.position.z = 1.5 + Math.sin(time * 0.8) * 0.4;
      }
    }
  }, 16);

  return engine;
}

/* Initialize (left commented - you asked to paste module only; uncomment to auto-start) */
// try { console.log('🚀 Enhanced Aim Lock module loaded'); } catch(e) {}
// var enhancedEngine = createDemoScenario();
// enhancedEngine.start();
// setInterval(function () {
//   try { console.log('📊 Performance: ' + JSON.stringify(enhancedEngine.getStats(), null, 2)); } catch(e) {}
// }, 5000);


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
class CoordinateTracker {
    constructor() { this.xyzData = []; }
    track(x, y, z) {
      this.xyzData.push({ x, y, z, t: Date.now() });
      if (this.xyzData.length > 100) this.xyzData.shift();
    }
    getLast() {
      return this.xyzData.length > 0 ? this.xyzData[this.xyzData.length - 1] : null;
    }
    getAverage() {
      if (this.xyzData.length === 0) return { x: 0, y: 0, z: 0 };
      const sum = this.xyzData.reduce((acc, v) => ({
        x: acc.x + v.x, y: acc.y + v.y, z: acc.z + v.z
      }), { x: 0, y: 0, z: 0 });
      return { x: sum.x / this.xyzData.length, y: sum.y / this.xyzData.length, z: sum.z / this.xyzData.length };
    }
    clear() { this.xyzData = []; }
  }

  var CONFIG = {
    smoothingFrames: 5,
    frameDelay: 5,
    noiseLevel: 0.2,
    recoilCancelFactor: 1.0,
    fpsLogInterval: 1000,
    trackHistoryLimit: 50,
    enableGhostOverlay: true,
    enableOneShotAI: true,
    adaptiveSensitivity: true,
    stabilizationWindow: 7
  };

  var BODY_POINTS = {
    HEAD:  { offsetY: 0.00907892, zone: 'head' },
    NECK:  { offsetY: 0.00907892, zone: 'neck' },
    CHEST: { offsetY: 0.00907892, zone: 'chest' },
    BELLY: { offsetY: 0.00907892, zone: 'stomach' }
  };

  class ScreenStabilizer {
    constructor() { this.lastMotion = { x: 0, y: 0 }; }
    stabilize(currentMotion) {
      const threshold = 0.5;
      const dx = currentMotion.x - this.lastMotion.x;
      const dy = currentMotion.y - this.lastMotion.y;
      if (Math.abs(dx) < threshold && Math.abs(dy) < threshold) return this.lastMotion;
      this.lastMotion = currentMotion;
      return currentMotion;
    }
  }

  class ScreenTracker {
    constructor() {
      this.motion = new ScreenStabilizer();
      this.frames = [];
    }
    simulateFrameCapture() {
      const randomTarget = {
        x: Math.random() * 1920,
        y: Math.random() * 1080,
        height: 150,
        hasHelmet: Math.random() > 0.5,
        behindWall: Math.random() > 0.7,
        distance: Math.random() * 50
      };
      return randomTarget;
    }
    simulateMotion() {
      const dx = (Math.random() - 0.5) * 3;
      const dy = (Math.random() - 0.5) * 3;
      return { x: dx, y: dy };
    }
    trackFrame(aimSystem, player, recoil) {
      const rawTarget = this.simulateFrameCapture();
      const stabilizedMotion = this.motion.stabilize(this.simulateMotion());
      const inputVector = { x: rawTarget.x + stabilizedMotion.x, y: rawTarget.y + stabilizedMotion.y };
      const processed = aimSystem.processFrame(inputVector, player, rawTarget, recoil);
      this.frames.push({ rawTarget, processed, time: Date.now() });
      return processed;
    }
  }

  var DATA = { trackHistory: [], frameTimes: [], lastShotTime: 0, vectorErrors: [] };

  class Stabilizer {
    constructor(windowSize) { this.windowSize = windowSize; this.buffer = []; }
    feed(vector) {
      this.buffer.push(vector);
      if (this.buffer.length > this.windowSize) this.buffer.shift();
      const avg = this.buffer.reduce((acc, v) => ({ x: acc.x + v.x, y: acc.y + v.y }), { x: 0, y: 0 });
      return { x: avg.x / this.buffer.length, y: avg.y / this.buffer.length };
    }
  }

  class TargetTracker {
    constructor() { this.stabilizer = new Stabilizer(CONFIG.stabilizationWindow); }
    predictNext(current, velocity) { return { x: current.x + velocity.x, y: current.y + velocity.y }; }
    track(target, velocity) {
      let predicted = this.predictNext(target, velocity);
      predicted = this.stabilizer.feed(predicted);
      const noise = (val) => val + (Math.random() - 0.5) * CONFIG.noiseLevel;
      return { x: noise(predicted.x), y: noise(predicted.y) };
    }
  }

  class FPSManager {
    constructor(interval) { this.interval = interval; this.frames = []; }
    recordFrame() {
      const now = Date.now();
      this.frames.push(now);
      this.frames = this.frames.filter(t => now - t <= this.interval);
    }
    logFPS() { this.frames = []; }
  }

  function cacheVectorError(target, actual) {
    const error = { dx: actual.x - target.x, dy: actual.y - target.y, time: Date.now() };
    DATA.vectorErrors.push(error);
    if (DATA.vectorErrors.length > CONFIG.trackHistoryLimit) DATA.vectorErrors.shift();
  }

  function startStableTracking(tracker) {
    const fpsManager = new FPSManager(CONFIG.fpsLogInterval);
    function loop() {
      fpsManager.recordFrame();
      const dummyTarget = { x: Math.random(), y: Math.random() };
      const dummyVelocity = { x: (Math.random() - 0.5) / 20, y: (Math.random() - 0.5) / 20 };
      const result = tracker.track(dummyTarget, dummyVelocity);
      cacheVectorError(dummyTarget, result);
    }
    loop();
  }

  var tracker = new TargetTracker();
  startStableTracking(tracker);

  function applyAimForce(current, target) {
    const dx = target.x - current.x;
    const dy = target.y - current.y;
    const force = 1.8;
    return { x: current.x + dx * force, y: current.y + dy * force };
  }

  function boostIfUnarmored(target, vector) {
    if (!target.hasHelmet) return { x: vector.x * 2.0, y: vector.y * 2.0 };
    return vector;
  }

  function snapToHeadZone(vector) {
    const z = CONFIG && CONFIG.headshotPriorityZone;
    if (z && vector.x > z.xMin && vector.x < z.xMax && vector.y > z.yMin && vector.y < z.yMax) {
      return { x: (z.xMin + z.xMax) / 2, y: (z.yMin + z.yMax) / 2 };
    }
    return vector;
  }

  function enhancedTrackingLoop(tracker) {
    const fpsManager = new FPSManager(CONFIG.fpsLogInterval);
    function loop() {
      fpsManager.recordFrame();
      const dummyTarget = { x: Math.random(), y: Math.random(), hasHelmet: Math.random() > 0.5 };
      const dummyVelocity = { x: (Math.random() - 0.5) / 20, y: (Math.random() - 0.5) / 20 };
      let tracked = tracker.track(dummyTarget, dummyVelocity);
      tracked = applyAimForce(tracked, dummyTarget);
      tracked = boostIfUnarmored(dummyTarget, tracked);
      tracked = snapToHeadZone(tracked);
      cacheVectorError(dummyTarget, tracked);
    }
    loop();
  }

  CONFIG.frameDelay = 2;
  CONFIG.stabilizationWindow = 9;
  var enhancedTracker = new TargetTracker();
  enhancedTrackingLoop(enhancedTracker);

  function lockToCrown(target) {
    return { x: target.x, y: target.y - target.height * 0.75 };
  }

  function hyperAimSnap(current, target, priority) {
    if (!priority) priority = 'HEAD';
    const dx = target.x - current.x;
    const dy = (target.y - current.y) - 0.05;
    const force = priority === 'HEAD' ? 2.5 : 1.8;
    return { x: current.x + dx * force, y: current.y + dy * force };
  }
  function detectHeadZone(callback) {
  Jimp.read(SCREENSHOT_FILE).then(img => {
    let maxVal = 0;
    let head = { x: CENTER_X, y: CENTER_Y };
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function(x, y, idx) {
      const r = this.bitmap.data[idx];
      const g = this.bitmap.data[idx + 1];
      const b = this.bitmap.data[idx + 2];
      const brightness = r + g + b;
      if (brightness > maxVal && brightness > 600) {
        maxVal = brightness;
        head = { x, y };
      }
    });
    console.log("Detected head at:", head);
    callback(head);
  }).catch(err => console.error("JIMP error:", err));
}
function adbAimAt(target) {
  const dx = target.x - CENTER_X;
  const dy = target.y - CENTER_Y;
  const endX = CENTER_X + dx;
  const endY = CENTER_Y + dy;
  const duration = 50;
  const cmd = `adb shell input swipe ${CENTER_X} ${CENTER_Y} ${endX} ${endY} ${duration}`;
  exec(cmd, (err) => {
    if (err) return console.error("ADB swipe failed:", err);
    console.log("Aimed via ADB.");
  });
}

function startiPhoneAimLoop() {
  function step() {
    // Không gọi captureAndroidScreen, trực tiếp giả lập hoặc lấy dữ liệu target khác
    detectHeadZone((target) => {
      adbAimAt(target);
      setTimeout(step, 300);
    });
  }
  step();
}

// Giả lập detectHeadZone trong Shadowrocket (ví dụ lấy dữ liệu target mẫu)
function detectHeadZone(callback) {
  // Tạo dữ liệu mục tiêu mẫu
  const dummyTarget = {
    x: Math.random() * 1080,
    y: Math.random() * 1920,
    height: 1.0,
    hasHelmet: false,
    behindWall: false,
    distance: 9999
  };
  callback(dummyTarget);
}

// Giả lập hàm điều khiển bắn ngắm
function adbAimAt(target) {
  // Thay thế bằng logic điều khiển game hoặc tính toán nội bộ
  console.log("Aiming at target:", target);
}

// Bắt đầu vòng lặp
// [DISABLED redundant loop] startAndroidAimLoop\(\)

function advancedAimVector(current, target) {
  const dx = target.x - current.x;
  const dy = (target.y - current.y) - 0.1;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const force = dist > 150 ? 2.5 : 1.5;
  return {
    x: current.x + dx * force,
    y: current.y + dy * force
  };
}

function smartAIiPhoneAimLoop() {
  function step() {
    // Giả lập lấy target trong Shadowrocket
    getHeadTarget((target) => {
      const tracked = advancedAimVector({ x: CENTER_X, y: CENTER_Y }, target);
      adbAimAt(tracked);
      setTimeout(step, 300);
    });
  }
  step();
}

// Giả lập hàm lấy target head (thay bằng dữ liệu thật nếu có)
function getHeadTarget(callback) {
  const dummyTarget = {
    x: Math.random() * 1080,
    y: Math.random() * 1920,
    height: 1.0,
    hasHelmet: false,
    behindWall: false,
    distance: 9999
  };
  callback(dummyTarget);
}

// Hàm giả lập tính toán vector aim nâng cao
function advancedAimVector(current, target) {
  // Ví dụ tính vector hướng về target
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  return {
    x: current.x + dx * 0.8,
    y: current.y + dy * 0.8
  };
}

// Giả lập hành động aim hoặc bắn
function adbAimAt(vector) {
  console.log("Aiming at:", vector);
}

// Biến phụ trợ
let fallbackCount = 0;
let lastKnownTarget = { x: CENTER_X, y: CENTER_Y };

// [DISABLED redundant loop] smartAIiPhoneAimLoop\(\)

function getFallbackTarget() {
  fallbackCount++;
  if (fallbackCount > 3) {
    console.warn("Too many fallbacks  resetting to center.");
    return { x: CENTER_X, y: CENTER_Y };
  }
  console.warn("Fallback to last known target:", lastKnownTarget);
  return lastKnownTarget;
}
function antiMissCompensation(current, target) {
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  const strength = 1.2;
  return {
    x: current.x + dx * strength,
    y: current.y + dy * strength
  };
}

// Giả lập hàm chụp màn hình (thay vì chụp thật)
function captureiPhoneScreen(callback) {
  // Trả dữ liệu dummy mô phỏng target detected
  setTimeout(() => {
    callback({
      x: Math.random() * 1080,
      y: Math.random() * 1920,
      height: 1,
      hasHelmet: false,
      behindWall: false,
      distance: 9999
    });
  }, 50);
}

// Giả lập hàm gọi AI detect
function runHeadDetection(callback) {
  // Trả luôn dữ liệu giả lập tương tự captureAndroidScreen
  setTimeout(() => {
    const fakeDetection = {
      x: Math.random() * 1080,
      y: Math.random() * 1920,
      height: 1,
      hasHelmet: false,
      behindWall: false,
      distance: 9999
    };
    callback(fakeDetection);
  }, 100);
}

// Các hàm bạn phải tự định nghĩa hoặc làm giả
function getFallbackTarget() {
  return lastKnownTarget;
}

function advancedAimVector(origin, target) {
  return {
    x: (origin.x + target.x) / 2,
    y: (origin.y + target.y) / 2
  };
}

function antiMissCompensation(origin, vector) {
  // Giả lập hiệu chỉnh nhỏ
  return {
    x: vector.x + 1,
    y: vector.y + 1
  };
}

function smoothVector(vector) {
  return vector; // Đơn giản không làm gì
}

function adjustForLatency(vector) {
  return vector; // Đơn giản không làm gì
}

function randomizedSwipe(origin, vector) {
  // Ở Shadowrocket không thao tác thực tế, chỉ log
  console.log(`Swipe from (${origin.x},${origin.y}) to (${vector.x},${vector.y})`);
}

function drawOverlay(target, vector) {
  // Không làm gì
}

function logTracking(target, vector) {
  console.log("Tracking target:", target, "aim vector:", vector);
}

function autoFireIfAligned(vector, target) {
  // Không làm gì
}

function smartAutoFire(vector, target) {
  // Không làm gì
}

function recordError(target, vector) {
  // Không làm gì
}

function learnErrorDeviation(target, vector) {
  // Không làm gì
}

function logVectorTraining(vector, target) {
  // Không làm gì
}

function confirmHit(vector, target) {
  // Không làm gì
}

function checkRetrainTrigger(vector, target) {
  // Không làm gì
}

function getAimConfidence(vector, target) {
  return 1.0; // Luôn tự tin 100%
}

function saveTargetSnapshot(target) {
  // Không làm gì
}

function classifyHeadRegion(target) {
  return "head"; // Luôn trả về head
}

// Vòng lặp chính
function smartResilientAimLoop() {
  function step() {
    captureAndroidScreen(() => {
      runHeadDetection((target) => {
        if (!target || typeof target.x !== "number") {
          console.warn("AI failed using fallback.");
          target = getFallbackTarget();
          fallbackCount++;
        } else {
          fallbackCount = 0;
          lastKnownTarget = target;
        }

        let vector = advancedAimVector({ x: CENTER_X, y: CENTER_Y }, target);
        vector = antiMissCompensation({ x: CENTER_X, y: CENTER_Y }, vector);
        vector = smoothVector(vector);
        vector = adjustForLatency(vector);
        randomizedSwipe({ x: CENTER_X, y: CENTER_Y }, vector);
        drawOverlay(target, vector);
        logTracking(target, vector);
        autoFireIfAligned(vector, target);
        smartAutoFire(vector, target);
        recordError(target, vector);
        learnErrorDeviation(target, vector);
        logVectorTraining(vector, target);
        confirmHit(vector, target);
        checkRetrainTrigger(vector, target);

        const confidence = getAimConfidence(vector, target);
        saveTargetSnapshot(target);
        const region = classifyHeadRegion(target);

        if (confidence < 0.5 || manualOverride) return;

        setTimeout(step, 300);
      });
    });
  }
  step();
}
// [DISABLED redundant loop] smartResilientAimLoop\(\)

function continuousHeadCorrection(current, target) {
  const dx = target.x - current.x;
  const dy = target.y - current.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const force = distance > 50 ? 2.2 : 1.0;
  return {
    x: current.x + dx * force,
    y: current.y + dy * force
  };
}
function continuousHeadAimLoop() {
  function step() {
    captureAndroidScreen(() => {
      runHeadDetection((target) => {
        if (!target || typeof target.x !== "number") {
          console.warn("AI failed  using fallback.");
          target = getFallbackTarget();
        } else {
          fallbackCount = 0;
          lastKnownTarget = target;
        }
        let vector = continuousHeadCorrection({ x: CENTER_X, y: CENTER_Y }, target);
        vector = antiMissCompensation({ x: CENTER_X, y: CENTER_Y }, vector);
        vector = smoothVector(vector);
        vector = adjustForLatency(vector);
        randomizedSwipe({ x: CENTER_X, y: CENTER_Y }, vector);
        drawOverlay(target, vector);
        logTracking(target, vector);
        autoFireIfAligned(vector, target);
        smartAutoFire(vector, target);
        recordError(target, vector);
        learnErrorDeviation(target, vector);
        logVectorTraining(vector, target);
        confirmHit(vector, target);
        checkRetrainTrigger(vector, target);
        const confidence = getAimConfidence(vector, target);
        saveTargetSnapshot(target);
        const region = classifyHeadRegion(target);
        if (confidence < 0.5 || manualOverride) return;
        setTimeout(step, 150); 
      });
    });
  }
  step();
}
// [DISABLED redundant loop] continuousHeadAimLoop\(\)
const logFile = "aim_log.txt";
function logTracking(target, vector) {
  const entry = {
    time: new Date().toISOString(),
    target,
    aimed: vector
  };
  $persistentStore.write(JSON.stringify(data), "trackingData");
  console.clear();
  console.log("=== AIM DASHBOARD ===");
  console.log("Target X:", target.x, " Y:", target.y);
  console.log("Aimed X:", vector.x.toFixed(1), " Y:", vector.y.toFixed(1));
  console.log("Log written.");
}
let lastVector = { x: CENTER_X, y: CENTER_Y };
function smoothVector(newVector, alpha = 0.25) {
  lastVector = {
    x: lastVector.x * (1 - alpha) + newVector.x * alpha,
    y: lastVector.y * (1 - alpha) + newVector.y * alpha
  };
  return lastVector;
}
function drawOverlay(target, aimVec) {
  Jimp.read(SCREENSHOT_FILE).then(img => {
    img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
      if (Math.abs(x - Math.round(target.x)) <= 2 && Math.abs(y - Math.round(target.y)) <= 2) {
        this.bitmap.data[idx] = 255;
        this.bitmap.data[idx + 1] = 0;
        this.bitmap.data[idx + 2] = 0;
      }
      if (Math.abs(x - Math.round(aimVec.x)) <= 2 && Math.abs(y - Math.round(aimVec.y)) <= 2) {
        this.bitmap.data[idx] = 0;
        this.bitmap.data[idx + 1] = 255;
        this.bitmap.data[idx + 2] = 0;
      }
    });
    drawLockFeedback(img, target, aimVec);
    img.write("frame_overlay.png", () => {
      console.log("Overlay saved to frame_overlay.png");
    });
  });
}
let aimLockStableCount = 0;
let aimErrorLog = [];
let latencyAverage = 90;
let zoomLevel = 2; 
let trackedTargets = [];
function autoFireIfAligned(vector, target) {
  const dx = Math.abs(vector.x - target.x);
  const dy = Math.abs(vector.y - target.y);
  if (dx < 15 && dy < 15) {
    aimLockStableCount++;
    if (aimLockStableCount > 2) {
      exec("adb shell input tap 1000 1800"); 
      console.log(" Auto Fire Triggered");
      aimLockStableCount = 0;
    }
  } else {
    aimLockStableCount = 0;
  }
}
function learnErrorDeviation(target, vector) {
  const dx = vector.x - target.x;
  const dy = vector.y - target.y;
  aimErrorLog.push({ dx, dy, time: Date.now() });
  if (aimErrorLog.length > 100) aimErrorLog.shift();
}
function getZoomSensitivity() {
  const base = 1.5;
  return zoomLevel === 4 ? base * 1.2 : zoomLevel === 2 ? base : base * 0.9;
}
function selectClosestTarget(candidates) {
  return candidates.reduce((best, t) => {
    const dist = Math.sqrt(t.x * t.x + t.y * t.y);
    return dist < best.dist ? { ...t, dist } : best;
  }, { dist: Infinity });
}
function compensateLatency(vector) {
  const now = Date.now();
  const delay = now - (vector.timestamp || now);
  const drift = delay - latencyAverage;
  if (drift > 50) {
    vector.x += 4;
    vector.y += 4;
  }
  return vector;
}
function swipeRandomized(center, vector) {
  const offsetX = (Math.random() - 0.5) * 4;
  const offsetY = (Math.random() - 0.5) * 4;
  const sx = Math.round(center.x + offsetX);
  const sy = Math.round(center.y + offsetY);
  const ex = Math.round(vector.x + offsetX);
  const ey = Math.round(vector.y + offsetY);
  const dur = 50 + Math.floor(Math.random() * 30);
  const cmd = `adb shell input swipe ${sx} ${sy} ${ex} ${ey} ${dur}`;
  exec(cmd);
  console.log(" Swipe:", cmd);
}
let fireCooldown = 0;
let burstMode = false;
let lastFireTime = 0;
let confirmedHits = [];
let vectorLogs = [];
const FOV_RADIUS = 180;
function predictTarget(target, velocity) {
  return {
    x: target.x + velocity.x * 5,
    y: target.y + velocity.y * 5
  };
}
function triggerBurstFire() {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      exec("adb shell input tap 1000 1800");
      console.log(" Burst Fire Shot", i + 1);
    }, i * 80);
  }
}
function isWeakHead(target) {
  return target.hasHelmet === false || target.hasHelmet === undefined;
}
function getFireCooldown(vector, target) {
  const dx = Math.abs(vector.x - target.x);
  const dy = Math.abs(vector.y - target.y);
  const error = Math.sqrt(dx * dx + dy * dy);
  return error < 10 ? 200 : 500;
}
function isWithinFOV(target) {
  const dx = target.x - CENTER_X;
  const dy = target.y - CENTER_Y;
  return Math.sqrt(dx * dx + dy * dy) <= FOV_RADIUS;
}
function smartAutoFire(vector, target) {
  const now = Date.now();
  if (!isWithinFOV(target)) return;
  const dx = Math.abs(vector.x - target.x);
  const dy = Math.abs(vector.y - target.y);
  if (dx < 15 && dy < 15) {
    if (now - lastFireTime > fireCooldown) {
      if (burstMode) {
        triggerBurstFire();
      } else {
        exec("adb shell input tap 1000 1800");
        console.log(" Smart Auto Fire");
      }
      lastFireTime = now;
      fireCooldown = getFireCooldown(vector, target);
    }
  }
}
function confirmHit(vector, target) {
  const dx = Math.abs(vector.x - target.x);
  const dy = Math.abs(vector.y - target.y);
  if (dx < 8 && dy < 8) {
    confirmedHits.push({ time: Date.now(), vector });
    console.log(" Hit Confirmed");
  }
}
function calibrateSensitivity(inputDpi, inGameSense) {
  const baseFactor = 1.5;
  const adjusted = baseFactor * (inGameSense / 50) * (inputDpi / 400);
  console.log(" Calibrated Sensitivity:", adjusted.toFixed(2));
  return adjusted;
}
function logVectorTraining(vector, target) {
  const entry = {
    ts: Date.now(),
    vector,
    target
  };
  vectorLogs.push(entry);
  if (vectorLogs.length > 100) vectorLogs.shift();
}
function drawLockFeedback(img, target, vector) {
  const r = 255, g = 255, b = 0;
  for (let t = 0; t <= 1; t += 0.01) {
    const x = Math.round(vector.x + (target.x - vector.x) * t);
    const y = Math.round(vector.y + (target.y - vector.y) * t);
    if (x >= 0 && x < img.bitmap.width && y >= 0 && y < img.bitmap.height) {
      const idx = img.getPixelIndex(x, y);
      img.bitmap.data[idx] = r;
      img.bitmap.data[idx + 1] = g;
      img.bitmap.data[idx + 2] = b;
    }
  }
}
function classifyHeadRegion(target) {
  const regions = ["forehead", "temple", "crown", "neck"];
  const idx = Math.floor(Math.random() * regions.length);
  return regions[idx];
}
function recoverAimToCenter() {
  exec(`adb shell input swipe ${CENTER_X} ${CENTER_Y} ${CENTER_X} ${CENTER_Y} 100`);
  console.log(" Aim Recovered to Center");
}
const controlPositions = {
  fire: { x: 1000, y: 1800 },
  scope: { x: 1200, y: 1600 },
  jump: { x: 900, y: 1900 }
};
let recentTargets = [];
function saveTargetSnapshot(target) {
  recentTargets.push({ ...target, t: Date.now() });
  if (recentTargets.length > 3) recentTargets.shift();
}
function fallbackToRecentTarget() {
  return recentTargets.length > 0 ? recentTargets[recentTargets.length - 1] : { x: CENTER_X, y: CENTER_Y };
}
function queueTargets(candidates) {
  return candidates.sort((a, b) => {
    const scoreA = (a.hasHelmet ? 1 : 0.5) + Math.sqrt(a.x * a.x + a.y * a.y);
    const scoreB = (b.hasHelmet ? 1 : 0.5) + Math.sqrt(b.x * b.x + b.y * b.y);
    return scoreA - scoreB;
  });
}
function logTargetFrame() {
  const timestamp = Date.now();
  const newName = `snapshot_${timestamp}.png`;
  fs.copyFile(SCREENSHOT_FILE, newName, err => {
    if (!err) console.log(" Snapshot Saved:", newName);
  });
}
const AIM_ZONES = {
  head: { radius: 360 },
  neck: { radius: 180 },
  chest: { radius: 90 }
};
let manualOverride = false;
function toggleManualOverride() {
  manualOverride = !manualOverride;
  console.log(" Manual Mode:", manualOverride ? "ON" : "OFF");
}
function getAimConfidence(vector, target) {
  const dx = Math.abs(vector.x - target.x);
  const dy = Math.abs(vector.y - target.y);
  const dist = Math.sqrt(dx * dx + dy * dy);
  const zone = AIM_ZONES.head.radius;
  return dist < zone ? 0.9 : dist < zone * 2 ? 0.7 : 0.4;
}
let errorSeries = 0;
function checkRetrainTrigger(vector, target) {
  const dx = Math.abs(vector.x - target.x);
  const dy = Math.abs(vector.y - target.y);
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > 30) {
    errorSeries++;
    if (errorSeries >= 5) {
      console.warn(" Retrain Triggered: Series error");
      fs.copyFile(SCREENSHOT_FILE, `retrain_frame_${Date.now()}.png`, () => {});
      errorSeries = 0;
    }
  } else {
    errorSeries = 0;
  }
}
const CONFIG_ENHANCED = {
  TRAINING: {
    enabled: true,
    adjustAlpha: 0.15,
    adjustForce: 0.2
  },
  STATS: {
    enabled: true,
    windowSize: 50
  },
  SMOOTH_TRACKING: {
    enabled: true,
    tension: 0.25
  },
  PATTERN_RECOGNITION: {
    enabled: true,
    memoryLimit: 10
  },
  GYRO_SIMULATION: {
    enabled: true,
    driftFactor: 0.4
  },
  HEATMAP: {
    enabled: true,
    resolution: 5
  },
  PIXEL_CORRECTION: {
    enabled: true,
    epsilon: 2.0
  },
  FRAME_RENDER: {
    enabled: true,
    path: "./frames"
  },
  EXECUTION: {
    encrypted: true,
    authKey: "secure-token"
  }
};
let aimStats = [];
function reinforcementAdjust(force, alpha, result) {
  if (!CONFIG_ENHANCED.TRAINING.enabled) return { force, alpha };
  const delta = result.hit ? 0.01 : -0.01;
  return {
    force: force + CONFIG_ENHANCED.TRAINING.adjustForce * delta,
    alpha: alpha + CONFIG_ENHANCED.TRAINING.adjustAlpha * delta
  };
}
function updateStats(hit) {
  if (!CONFIG_ENHANCED.STATS.enabled) return;
  aimStats.push(hit ? 1 : 0);
  if (aimStats.length > CONFIG_ENHANCED.STATS.windowSize) aimStats.shift();
  const avg = aimStats.reduce((a, b) => a + b, 0) / aimStats.length;
  console.log("Accuracy Stats:", (avg * 100).toFixed(1) + "%");
}
function smoothFollow(current, target) {
  if (!CONFIG_ENHANCED.SMOOTH_TRACKING.enabled) return target;
  return {
    x: current.x * (1 - CONFIG_ENHANCED.SMOOTH_TRACKING.tension) + target.x * CONFIG_ENHANCED.SMOOTH_TRACKING.tension,
    y: current.y * (1 - CONFIG_ENHANCED.SMOOTH_TRACKING.tension) + target.y * CONFIG_ENHANCED.SMOOTH_TRACKING.tension
  };
}
let patternMemory = [];
function storeHeadPattern(vector) {
  if (!CONFIG_ENHANCED.PATTERN_RECOGNITION.enabled) return;
  patternMemory.push(vector);
  if (patternMemory.length > CONFIG_ENHANCED.PATTERN_RECOGNITION.memoryLimit) patternMemory.shift();
}
function simulateGyroSwipe(vector) {
  if (!CONFIG_ENHANCED.GYRO_SIMULATION.enabled) return vector;
  return {
    x: vector.x + (Math.random() - 0.5) * CONFIG_ENHANCED.GYRO_SIMULATION.driftFactor,
    y: vector.y + (Math.random() - 0.5) * CONFIG_ENHANCED.GYRO_SIMULATION.driftFactor
  };
}
function addHeatmapLog(vector) {
  if (!CONFIG_ENHANCED.HEATMAP.enabled) return;
  const cellX = Math.floor(vector.x / CONFIG_ENHANCED.HEATMAP.resolution);
  const cellY = Math.floor(vector.y / CONFIG_ENHANCED.HEATMAP.resolution);
  console.log(`Heatmap: (${cellX}, ${cellY})`);
}
function pixelPerfectAdjust(vector, target) {
  if (!CONFIG_ENHANCED.PIXEL_CORRECTION.enabled) return vector;
  const dx = target.x - vector.x;
  const dy = target.y - vector.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist < CONFIG_ENHANCED.PIXEL_CORRECTION.epsilon) return vector;
  return {
    x: vector.x + dx * 0.1,
    y: vector.y + dy * 0.1
  };
}
function renderFrameOverlay(img, target, vector) {
  if (!CONFIG_ENHANCED.FRAME_RENDER.enabled) return;
  const ts = Date.now();
  img.write(`${CONFIG_ENHANCED.FRAME_RENDER.path}/overlay_${ts}.png`);
}
function verifyExecutionAuth() {
  if (!CONFIG_ENHANCED.EXECUTION.encrypted) return true;
  const inputKey = "secure-token";
  return inputKey === CONFIG_ENHANCED.EXECUTION.authKey;
}
function classifyMissCause(vector, target) {
  const dx = Math.abs(vector.x - target.x);
  const dy = Math.abs(vector.y - target.y);
  if (dx > 50 || dy > 50) return 'gross_error';
  if (dx > 20) return 'horizontal_drift';
  if (dy > 20) return 'vertical_drift';
  return 'minor';
}
function annotateVectorTrail(logs) {
  logs.forEach((entry, index) => {
    console.log(`Trail ${index}: Aim (${entry.vector.x}, ${entry.vector.y}) vs Target (${entry.target.x}, ${entry.target.y})`);
  });
}
function generateVectorGraph(logs) {
  const data = logs.map(e => ({
    x: e.vector.x,
    y: e.vector.y,
    t: e.ts
  }));
  console.log("Vector Evolution Graph Ready", data.length, "points");
}
function correctVectorLive(vector, target, lastHit) {
  if (!lastHit) {
    const dx = target.x - vector.x;
    const dy = target.y - vector.y;
    return {
      x: vector.x + dx * 0.1,
      y: vector.y + dy * 0.1
    };
  }
  return vector;
}
function tuneAlphaForceByUser(alpha, force, accuracy) {
  if (accuracy < 0.6) {
    alpha += 0.05;
    force += 0.1;
  }
  return { alpha, force };
}
function detectBodyZone(target) {
  const zones = ['eye', 'forehead', 'neck', 'jaw'];
  return zones[Math.floor(Math.random() * zones.length)];
}
function focusShiftToNeck(target) {
  return {
    x: target.x,
    y: target.y + 15
  };
}
let headLockFrames = 0;
function applyStickyLock(vector, target) {
  const dx = Math.abs(vector.x - target.x);
  const dy = Math.abs(vector.y - target.y);
  const isInZone = dx < 10 && dy < 10;
  if (isInZone) headLockFrames++;
  else headLockFrames = 0;
  if (headLockFrames >= 3) {
    vector.x = target.x;
    vector.y = target.y;
  }
  return vector;
}
function applyTimingRandomizer(baseTime) {
  return baseTime + Math.floor(Math.random() * 20 - 10);
}
function randomizeSwipePattern(vector) {
  const offsetX = (Math.random() - 0.5) * 3;
  const offsetY = (Math.random() - 0.5) * 3;
  return {
    x: vector.x + offsetX,
    y: vector.y + offsetY
  };
}
function insertFakeSwipeNoise(center) {
  const fx = center.x + (Math.random() - 0.5) * 40;
  const fy = center.y + (Math.random() - 0.5) * 40;
  const cmd = `adb shell input swipe ${center.x} ${center.y} ${Math.round(fx)} ${Math.round(fy)} 80`;
  exec(cmd);
}




const CHAIN_CONFIG = {
  PRECISION_LEARNING: {
    enable: true,
    correctionStrength: 0.12,
    confidenceDropRate: 0.15
  },
  TARGET_PRIORITY: {
    helmetWeight: 1.2,
    dangerWeight: 2.0,
    zonePenalty: 1.5
  },
  STEALTH_CLOAK: {
    enable: true,
    fakeInputCount: 3,
    jitterRange: 1.0
  },
  VECTOR_STABILIZER: {
    enable: true,
    maxPixelPerFrame: 12,
    inertiaNearTarget: 0.2,
    averageWindow: 3
  },
  SEMI_AUTO_SUPPORT: {
    enable: true,
    hapticOn: true,
    pauseOnObstruction: true
  }
}

let vectorHistory = []
function liveErrorTracker(vector, target) {
  if (!CHAIN_CONFIG.PRECISION_LEARNING.enable) return
  const dx = vector.x - target.x
  const dy = vector.y - target.y
  if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
    vector.x -= dx * CHAIN_CONFIG.PRECISION_LEARNING.correctionStrength
    vector.y -= dy * CHAIN_CONFIG.PRECISION_LEARNING.correctionStrength
  }
}

function feedbackBasedAdjust(confidence) {
  if (confidence < 0.6) return 1 - CHAIN_CONFIG.PRECISION_LEARNING.confidenceDropRate
  return 1
}

function vectorRateLimiter(vector, lastVector) {
  if (!CHAIN_CONFIG.VECTOR_STABILIZER.enable) return vector
  const dx = vector.x - lastVector.x
  const dy = vector.y - lastVector.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  const maxMove = CHAIN_CONFIG.VECTOR_STABILIZER.maxPixelPerFrame
  if (dist > maxMove) {
    const scale = maxMove / dist
    vector.x = lastVector.x + dx * scale
    vector.y = lastVector.y + dy * scale
  }
  return vector
}

function historicalAverageVector(vector) {
  vectorHistory.push(vector)
  if (vectorHistory.length > CHAIN_CONFIG.VECTOR_STABILIZER.averageWindow)
    vectorHistory.shift()
  const sum = vectorHistory.reduce((acc, v) => ({
    x: acc.x + v.x,
    y: acc.y + v.y
  }), { x: 0, y: 0 })
  const n = vectorHistory.length
  return { x: sum.x / n, y: sum.y / n }
}

function adaptiveInertiaHandler(vector, target) {
  const dx = target.x - vector.x
  const dy = target.y - vector.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  const threshold = 30
  if (dist < threshold) {
    vector.x += dx * CHAIN_CONFIG.VECTOR_STABILIZER.inertiaNearTarget
    vector.y += dy * CHAIN_CONFIG.VECTOR_STABILIZER.inertiaNearTarget
  }
  return vector
}

function targetDangerScore(t) {
  return (t.hasHelmet ? CHAIN_CONFIG.TARGET_PRIORITY.helmetWeight : 0.5) +
    (t.isAimingAtYou ? CHAIN_CONFIG.TARGET_PRIORITY.dangerWeight : 1) +
    (t.isInCover ? CHAIN_CONFIG.TARGET_PRIORITY.zonePenalty : 0)
}

function decoyInputGenerator(center) {
  for (let i = 0; i < CHAIN_CONFIG.STEALTH_CLOAK.fakeInputCount; i++) {
    const offsetX = (Math.random() - 0.5) * 100
    const offsetY = (Math.random() - 0.5) * 100
    const x = center.x + offsetX
    const y = center.y + offsetY
    const cmd = `adb shell input swipe ${center.x} ${center.y} ${Math.round(x)} ${Math.round(y)} 70`
    exec(cmd)
  }
}

function systemJitterRandomizer(vector) {
  if (!CHAIN_CONFIG.STEALTH_CLOAK.enable) return vector
  const randX = (Math.random() - 0.5) * CHAIN_CONFIG.STEALTH_CLOAK.jitterRange
  const randY = (Math.random() - 0.5) * CHAIN_CONFIG.STEALTH_CLOAK.jitterRange
  return {
    x: vector.x + randX,
    y: vector.y + randY
  }
}

function manualRetargetSwitch() {
  if (!CHAIN_CONFIG.SEMI_AUTO_SUPPORT.enable) return
  console.log("Manual target switch triggered")
}

function hapticFeedbackVibration() {
  if (!CHAIN_CONFIG.SEMI_AUTO_SUPPORT.hapticOn) return
  exec("adb shell input vibrate 150")
}

function pauseIfObstructed(obstructed) {
  if (!CHAIN_CONFIG.SEMI_AUTO_SUPPORT.pauseOnObstruction) return false
  return obstructed
}




function ensurePersistentLoop(coreFunction, interval = 300) {
  function wrapper() {
    try {
      coreFunction();
    } catch (e) {
      if (typeof $notify === "function") {
        $notify("Loop Error", "", String(e)); // ✅ hiển thị lỗi
      }
      // Hoặc có thể chỉ im lặng bỏ qua
    } finally {
      setTimeout(wrapper, interval);
    }
  }
  wrapper();
}

function mainAimingRoutine() {
  if (pauseIfObstructed(false)) return
  captureAndroidScreen(() => {
    runHeadDetection((target) => {
      let vector = { x: CENTER_X, y: CENTER_Y }
      vector = smoothVector(vector)
      vector = adjustForLatency(vector)
      vector = systemJitterRandomizer(vector)
      vector = pixelPerfectAdjust(vector, target)
      vector = adaptiveInertiaHandler(vector, target)
      vector = vectorRateLimiter(vector, vector)
      vector = historicalAverageVector(vector)
      vector = applyStickyLock(vector, target)
      vector = correctVectorLive(vector, target, false)
      vector = refineTrajectory(vector, target)
      vector = adjustIfChinLock(vector, target)
      vector = applyJumpPull(vector, target)
      vector = applyDirectionalJumpPull(vector, target)
      vector = applySelfJumpAimBoost(vector, "jump")
      vector = correctJumpLowHeadAim(vector, target)
      analyzeJumpHeadshot(vector, target)
      updateLockTracking(vector, target)
      liveErrorTracker(vector, target)
      randomizedSwipe({ x: CENTER_X, y: CENTER_Y }, vector)
      logTracking(target, vector)
      autoFireIfAligned(vector, target)
      smartAutoFire(vector, target)
      recordError(target, vector)
      learnErrorDeviation(target, vector)
      logVectorTraining(vector, target)
      confirmHit(vector, target)
      saveTargetSnapshot(target)
      updateStats(true)
      const zone = detectBodyZone(target)
      const confidence = getAimConfidence(vector, target)
      const scaled = feedbackBasedAdjust(confidence)
      hapticFeedbackVibration()
      insertFakeSwipeNoise({ x: CENTER_X, y: CENTER_Y })
    })
  })
}

verifyExecutionAuth() && ensurePersistentLoop(applyFpsDropFix(mainAimingRoutine, 300), 300)




const TRAJECTORY_CONFIG = {
  enabled: true,
  maxDeviation: 0.5,         // Cực thấp → lệch nhẹ là chỉnh ngay
  tightenRadius: 0.15,       // Siêu nhỏ → chỉ bó về đầu
  straightThreshold: 1       // Lệch rất nhẹ sẽ bị kéo thẳng lại
}

function refineTrajectory(vector, target) {
  if (!TRAJECTORY_CONFIG.enabled) return vector
  const dx = target.x - vector.x
  const dy = target.y - vector.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  if (distance < TRAJECTORY_CONFIG.straightThreshold) {
    // Tighten grouping
    const angle = Math.atan2(dy, dx)
    return {
      x: vector.x + Math.cos(angle) * TRAJECTORY_CONFIG.tightenRadius,
      y: vector.y + Math.sin(angle) * TRAJECTORY_CONFIG.tightenRadius
    }
  }

  // Clamp deviation if too wide
  if (Math.abs(dx) > TRAJECTORY_CONFIG.maxDeviation) vector.x += dx * 0.1
  if (Math.abs(dy) > TRAJECTORY_CONFIG.maxDeviation) vector.y += dy * 0.1

  return vector
}




const AIM_ADJUSTMENT_CONFIG = {
  enableChinLift: true,      // Bật tự động nâng tầm ngắm lên để tránh cằm
  chinZoneHeight: 30,        // Vùng tính từ cằm trở lên (px hoặc đơn vị tính trong viewport)
  liftAmount: 8,             // Độ nâng tiêu chuẩn (tính bằng đơn vị Y screen hoặc Vector3)
  mediumRange: {
    enable: true,            // Có bật nâng thêm nếu mục tiêu ở tầm trung
    start: 200,              // Khoảng cách bắt đầu nâng thêm
    end: 450,                // Khoảng cách kết thúc nâng thêm
    liftExtra: 5            // Nâng thêm bao nhiêu đơn vị tại tầm trung
  }
}

function adjustIfChinLock(vector, target) {
  if (!AIM_ADJUSTMENT_CONFIG.enableChinLift) return vector
  const verticalOffset = target.y - vector.y
  const dx = target.x - vector.x
  const dy = verticalOffset

  const distance = Math.sqrt(dx * dx + dy * dy)
  const isChinZone = verticalOffset > 0 && verticalOffset < AIM_ADJUSTMENT_CONFIG.chinZoneHeight
  const isMedium = distance >= AIM_ADJUSTMENT_CONFIG.mediumRange.start && distance <= AIM_ADJUSTMENT_CONFIG.mediumRange.end

  if (isChinZone) {
    vector.y -= AIM_ADJUSTMENT_CONFIG.liftAmount
    if (isMedium && AIM_ADJUSTMENT_CONFIG.mediumRange.enable) {
      vector.y -= AIM_ADJUSTMENT_CONFIG.mediumRange.liftExtra
    }
  }
  return vector
}




const JUMP_PULL_CONFIG = {
  enable: true,
  airStateBoost: 1.4,
  verticalBias: -6
}

function applyJumpPull(vector, target) {
  if (!JUMP_PULL_CONFIG.enable) return vector
  if (target.isJumping || target.isAirborne || target.state === 'air') {
    vector.x += (target.x - vector.x) * (JUMP_PULL_CONFIG.airStateBoost - 1)
    vector.y += (target.y - vector.y) * (JUMP_PULL_CONFIG.airStateBoost - 1)
    vector.y += JUMP_PULL_CONFIG.verticalBias
  }
  return vector
}




const EXTENDED_JUMP_CONFIG = {
  enableDirectionalPull: true,        // Kéo hướng aim theo hướng nhảy của enemy
  directionalBoost: 1.2,              // Hệ số kéo (nhẹ)
  directionalAngleOffset: 10,         // Độ lệch theo hướng nhảy (độ)
  enableSelfJumpAimBoost: true,       // Bật boost khi bản thân nhảy
  selfJumpBoost: 1.3,                 // Tăng tốc độ lock khi nhảy
  selfVerticalLift: -4                // Điều chỉnh tầm ngắm lên khi nhảy (âm = kéo xuống)
}


function applyDirectionalJumpPull(vector, target) {
  if (!EXTENDED_JUMP_CONFIG.enableDirectionalPull) return vector
  if (target.state === 'air' && target.direction) {
    const angle = Math.atan2(target.direction.y, target.direction.x)
    const adjustedX = Math.cos(angle) * EXTENDED_JUMP_CONFIG.directionalBoost
    const adjustedY = Math.sin(angle) * EXTENDED_JUMP_CONFIG.directionalBoost
    vector.x += adjustedX
    vector.y += adjustedY
  }
  return vector
}

function applySelfJumpAimBoost(vector, playerState) {
  if (!EXTENDED_JUMP_CONFIG.enableSelfJumpAimBoost) return vector
  if (playerState === 'jump') {
    vector.y += EXTENDED_JUMP_CONFIG.selfVerticalLift
    vector.x *= EXTENDED_JUMP_CONFIG.selfJumpBoost
    vector.y *= EXTENDED_JUMP_CONFIG.selfJumpBoost
  }
  return vector
}




const JUMP_CORRECTION_CONFIG = {
  enable: true,
  downwardPullWhenJumping: 6,
  headHeightZone: 25
}

function correctJumpLowHeadAim(vector, target) {
  if (!JUMP_CORRECTION_CONFIG.enable) return vector
  const dy = target.y - vector.y
  const isJumping = target.state === 'air'
  const isMissingHead = dy < -JUMP_CORRECTION_CONFIG.headHeightZone

  if (isJumping && isMissingHead) {
    vector.y += JUMP_CORRECTION_CONFIG.downwardPullWhenJumping
  }

  return vector
}




const ADVANCED_ANALYSIS_CONFIG = {
  headshotJumpAnalysis: true,
  lockTrackThreshold: 5,
  lockSustainTime: 200,
  fpsOptimization: true,
  sleepAdjust: 5,
  lagDropThreshold: 25
}

let headshotJumpLog = []
function analyzeJumpHeadshot(vector, target) {
  if (!ADVANCED_ANALYSIS_CONFIG.headshotJumpAnalysis) return
  const isJumping = target.state === 'air'
  const dx = vector.x - target.x
  const dy = vector.y - target.y
  const isCloseToHead = Math.abs(dx) < 10 && Math.abs(dy) < 10
  if (isJumping && isCloseToHead) {
    headshotJumpLog.push({ t: Date.now(), dx, dy })
  }
  if (headshotJumpLog.length > 100) headshotJumpLog.shift()
}

let lockStreak = 0
let lastLockTime = 0
function updateLockTracking(vector, target) {
  const dx = Math.abs(vector.x - target.x)
  const dy = Math.abs(vector.y - target.y)
  if (dx < 12 && dy < 12) {
    lockStreak++
    lastLockTime = Date.now()
  } else {
    if (Date.now() - lastLockTime > ADVANCED_ANALYSIS_CONFIG.lockSustainTime) {
      lockStreak = 0
    }
  }
  if (lockStreak >= ADVANCED_ANALYSIS_CONFIG.lockTrackThreshold) {
    console.log("LOCKHEAD confirmed")
  }
}

function applyFpsDropFix(loopFunc, interval) {
  let lastTime = Date.now()
  return () => {
    const now = Date.now()
    const delta = now - lastTime
    if (delta < interval - ADVANCED_ANALYSIS_CONFIG.lagDropThreshold) {
      setTimeout(() => loopFunc(), interval + ADVANCED_ANALYSIS_CONFIG.sleepAdjust)
    } else {
      loopFunc()
    }
    lastTime = Date.now()
  }
}
const ADV_LOCK_CONFIG = {
  helmetAware: true,
  zoneCurve: true,
  heightAware: true,
  multiPointPrediction: true,
  jitterMatch: true,
  deadzoneComp: true,
  confidenceTaper: true,
  tactileSim: true,
  latentDrag: true,
  fatigueAware: true,
  defaultConfidence: 0.95
}

function helmetPenetrationAdjust(target, hasHelmet) {
  if (!ADV_LOCK_CONFIG.helmetAware || !hasHelmet) return 0
  return 4 
}

function applyZoneLockCurve(dy) {
  if (!ADV_LOCK_CONFIG.zoneCurve) return dy
  if (dy < -30) return dy * 0.9 
  if (dy < 0) return dy * 0.8
  if (dy < 20) return dy * 1.2 
  return dy * 1.4 
}

function heightBasedAdjustment(camHeight, targetHeight) {
  if (!ADV_LOCK_CONFIG.heightAware) return 0
  const delta = camHeight - targetHeight
  return delta > 0 ? -2 : 2
}

function multiPointPrediction(target) {
  if (!ADV_LOCK_CONFIG.multiPointPrediction) return target
  return {
    x: target.x + (target.vx || 0) * 1.2,
    y: target.y + (target.vy || 0) * 1.1
  }
}

function jitterCompensate(history) {
  if (!ADV_LOCK_CONFIG.jitterMatch || history.length < 3) return { x: 0, y: 0 }
  const [p1, p2, p3] = history.slice(-3)
  const dx = (p3.x - p2.x) - (p2.x - p1.x)
  const dy = (p3.y - p2.y) - (p2.y - p1.y)
  return { x: dx * 0.4, y: dy * 0.4 }
}

function correctDeadzone(target, center, radius = 18) {
  if (!ADV_LOCK_CONFIG.deadzoneComp) return { x: 0, y: 0 }
  const dx = target.x - center.x
  const dy = target.y - center.y
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist < radius) {
    return { x: dx * 0.4, y: dy * 0.4 }
  }
  return { x: 0, y: 0 }
}

function taperByConfidence(vector, confidence) {
  if (!ADV_LOCK_CONFIG.confidenceTaper || confidence > ADV_LOCK_CONFIG.defaultConfidence) return vector
  const factor = Math.max(0.4, confidence / ADV_LOCK_CONFIG.defaultConfidence)
  return {
    x: vector.x * factor,
    y: vector.y * factor
  }
}

function simulateTactileCurve(inputVec) {
  if (!ADV_LOCK_CONFIG.tactileSim) return inputVec
  return {
    x: Math.sign(inputVec.x) * Math.pow(Math.abs(inputVec.x), 0.9),
    y: Math.sign(inputVec.y) * Math.pow(Math.abs(inputVec.y), 0.9)
  }
}

function applyLatentDrag(framesHeld) {
  if (!ADV_LOCK_CONFIG.latentDrag) return 1
  return framesHeld < 5 ? 0.75 : framesHeld < 12 ? 1.0 : 1.2
}

function adjustForFatigue(elapsed, baseline = 60000) {
  if (!ADV_LOCK_CONFIG.fatigueAware) return 0
  const fatigueFactor = Math.min(1, elapsed / baseline)
  return -4 * fatigueFactor
}

const HEADSHOT_OPTIMIZER = {
  microHeadBias: true,
  aimReinforce: true,
  dynamicHardLock: true,
  armorAvoid: true,
  foreheadVector: true,
  softPullTrack: true,
  reactiveOffset: true,
  recenterAuto: true,
  decayOverTime: true,
  taperByHold: true,
  eyeLineTarget: true,
  poseAware: true,
  headStreak: true,
  noTouchWindow: true,
  horizontalAssist: true
}

let headStreakCounter = 0

function applyMicroHeadBias(vector, target) {
  if (!HEADSHOT_OPTIMIZER.microHeadBias) return vector
  return { x: vector.x, y: vector.y - 3 }
}

function reinforceAimAfterMiss(lastHit, vector) {
  if (!HEADSHOT_OPTIMIZER.aimReinforce || lastHit) return vector
  return { x: vector.x * 0.95, y: vector.y * 0.95 }
}

function dynamicHardLockZone(speed) {
  if (!HEADSHOT_OPTIMIZER.dynamicHardLock) return 22
  if (speed > 4) return 28
  if (speed > 2) return 24
  return 20
}

function avoidArmorZone(target, armor) {
  if (!HEADSHOT_OPTIMIZER.armorAvoid || !armor) return 0
  return 6 
}

function getForeheadVector(target) {
  if (!HEADSHOT_OPTIMIZER.foreheadVector) return target
  return { x: target.x, y: target.y - 20 }
}

function trackSoftPull(vector, target) {
  if (!HEADSHOT_OPTIMIZER.softPullTrack) return vector
  return {
    x: vector.x + (target.x - vector.x) * 0.6,
    y: vector.y + (target.y - vector.y) * 0.6
  }
}

function adjustReactiveOffset(viewAngle, targetAngle) {
  if (!HEADSHOT_OPTIMIZER.reactiveOffset) return 0
  const diff = viewAngle - targetAngle
  return diff > 0 ? -4 : 4
}

function rebalanceToCenter(vector, target, timeHeld) {
  if (!HEADSHOT_OPTIMIZER.recenterAuto || timeHeld < 300) return vector
  return {
    x: vector.x + (target.x - vector.x) * 0.2,
    y: vector.y + (target.y - vector.y) * 0.2
  }
}

function decayAimLock(force, lockDuration) {
  if (!HEADSHOT_OPTIMIZER.decayOverTime) return force
  const decay = Math.max(0.6, 1 - lockDuration / 1000)
  return force * decay
}

function taperVectorByHold(vector, holdFrames) {
  if (!HEADSHOT_OPTIMIZER.taperByHold) return vector
  const taper = holdFrames < 10 ? 1 : holdFrames < 30 ? 0.9 : 0.75
  return { x: vector.x * taper, y: vector.y * taper }
}

function eyeLineVector(target) {
  if (!HEADSHOT_OPTIMIZER.eyeLineTarget) return target
  return { x: target.x, y: target.y - 14 }
}

function poseAwareAdjustment(pose) {
  if (!HEADSHOT_OPTIMIZER.poseAware) return 0
  if (pose === "crouch") return -6
  if (pose === "jump") return 4
  return 0
}

function applyHeadStreakBoost(vector) {
  if (!HEADSHOT_OPTIMIZER.headStreak || headStreakCounter < 3) return vector
  return { x: vector.x, y: vector.y - 6 }
}

function simulateNoTouchShift(vector, target, deadZone = 16) {
  if (!HEADSHOT_OPTIMIZER.noTouchWindow) return vector
  const dx = Math.abs(vector.x - target.x)
  const dy = Math.abs(vector.y - target.y)
  if (dx < deadZone && dy < deadZone) {
    return { x: target.x, y: target.y - 12 }
  }
  return vector
}

function assistHorizontalMagnetism(vector, target) {
  if (!HEADSHOT_OPTIMIZER.horizontalAssist) return vector
  return {
    x: vector.x + (target.x - vector.x) * 0.2,
    y: vector.y
  }
}
let HEADSHOT_LOG = []

function advancedHeadshotTracking(current, target, options = {}) {
  let vector = { ...current }
  let holdFrames = options.holdFrames || 0
  let lockDuration = options.lockDuration || 0
  let confidence = options.confidence || 0.98
  let viewAngle = options.viewAngle || 0
  let targetAngle = options.targetAngle || 0
  let hasHelmet = options.hasHelmet || false
  let armor = options.armor || false
  let pose = options.pose || "stand"
  let drift = options.drift || { x: 0, y: 0 }
  let currentTime = Date.now()

  if (!cooldownLimiter(currentTime)) return current

  const originalTarget = { ...target }

  target = multiPointPrediction(target)
  const jitter = jitterCompensate(options.history || [])
  const dzComp = correctDeadzone(target, current)
  const angleAdjust = correctAimAngle(current, target, viewAngle)
  const offsetAdjust = adjustReactiveOffset(viewAngle, targetAngle)
  const fatigueAdjust = adjustForFatigue(options.elapsed || 0)

  vector = trackSoftPull(vector, target)
  vector = applyMicroHeadBias(vector, target)
  vector = assistHorizontalMagnetism(vector, target)
  vector = taperVectorByHold(vector, holdFrames)
  vector = reinforceAimAfterMiss(options.lastHit, vector)
  vector = simulateTactileCurve(vector)
  vector = simulateNoTouchShift(vector, target)
  vector = applyHeadStreakBoost(vector, headStreakCounter)
  vector = avoidNeckZone(vector, target)
  vector = xAxisBiasAssist(vector, target)
  vector = applyXPullBoost(vector, target)
  vector = applyStreakMemory(vector, options.lastHeadVector)

  vector.y += helmetPenetrationAdjust(target, hasHelmet)
  vector.y += heightBasedAdjustment(options.cameraHeight || 0, options.targetHeight || 0)
  vector.y += poseAwareAdjustment(pose)
  vector.y += offsetAdjust
  vector.y += fatigueAdjust
  vector.y += angleAdjust

  const forceScaled = scaleByDrift(force, drift)
  const effectiveForce = decayAimLock(forceScaled, lockDuration)

  vector.x = current.x + (vector.x - current.x) * effectiveForce
  vector.y = current.y + (vector.y - current.y) * effectiveForce

  const dx = vector.x - originalTarget.x
  const dy = vector.y - originalTarget.y
  const distance = Math.sqrt(dx * dx + dy * dy)

  HEADSHOT_LOG.push({
    frame: currentTime,
    dx: dx.toFixed(2),
    dy: dy.toFixed(2),
    distance: distance.toFixed(2),
    confidence: confidence,
    streak: headStreakCounter,
    driftMag: Math.sqrt(drift.x ** 2 + drift.y ** 2).toFixed(2),
    xPull: dx.toFixed(2),
    hardBoost: headStreakCounter >= 2,
    xitated: Math.abs(dx) > 6
  })

  lastLockFrame = currentTime
  lastLockVector = vector
  return vector
}

const LOCK_ENHANCE = {
  angleCorrection: true,
  frameCorrection: true,
  lockCooldown: true,
  crossConfirm: true,
  driftScaling: true,
  neckAvoid: true,
  jitterBuffer: true,
  streakBoost: true,
  streakDecay: true,
  streakMemory: true,
  xPullBoost: true,
  xBiasAssist: true
}

let lastLockFrame = 0
let lastLockVector = { x: 0, y: 0 }

function correctAimAngle(current, target, viewAngle) {
  if (!LOCK_ENHANCE.angleCorrection) return 0
  const dx = target.x - current.x
  const angleDiff = Math.abs(Math.atan2(dx, 1) * 180 / Math.PI - viewAngle)
  return angleDiff > 30 ? -3 : 0
}

function frameCorrectionApply(current, previousVector) {
  if (!LOCK_ENHANCE.frameCorrection) return current
  return {
    x: (current.x + previousVector.x) / 2,
    y: (current.y + previousVector.y) / 2
  }
}

function cooldownLimiter(currentTime, cooldown = 80) {
  if (!LOCK_ENHANCE.lockCooldown) return true
  const delta = currentTime - lastLockFrame
  return delta > cooldown
}

function confirmByCrossColor(crossColor) {
  return !LOCK_ENHANCE.crossConfirm || crossColor === "red"
}

function scaleByDrift(force, drift) {
  if (!LOCK_ENHANCE.driftScaling) return force
  const driftMag = Math.sqrt(drift.x * drift.x + drift.y * drift.y)
  const scale = Math.min(1 + driftMag / 24, 1.3)
  return force * scale
}

function avoidNeckZone(vector, target) {
  if (!LOCK_ENHANCE.neckAvoid) return vector
  if (vector.y > target.y) {
    vector.y -= 6
  }
  return vector
}

function jitterDampen(history) {
  if (!LOCK_ENHANCE.jitterBuffer || history.length < 4) return { x: 0, y: 0 }
  const deltas = history.slice(-3).map((p, i, a) => a[i+1] ? { dx: a[i+1].x - p.x, dy: a[i+1].y - p.y } : { dx: 0, dy: 0 })
  const avgDx = deltas.map(d => d.dx).reduce((a, b) => a + b, 0) / deltas.length
  const avgDy = deltas.map(d => d.dy).reduce((a, b) => a + b, 0) / deltas.length
  return { x: -avgDx * 0.3, y: -avgDy * 0.3 }
}

function applyHeadStreakBoost(vector, streak) {
  if (!LOCK_ENHANCE.streakBoost || streak < 2) return vector
  return { x: vector.x, y: vector.y - Math.min(streak * 2, 8) }
}

function decayStreak(streak, hit) {
  if (!LOCK_ENHANCE.streakDecay) return streak
  return hit ? streak + 1 : Math.max(0, streak - 1)
}

function applyStreakMemory(vector, streakVec) {
  if (!LOCK_ENHANCE.streakMemory || !streakVec) return vector
  return {
    x: (vector.x + streakVec.x) / 2,
    y: (vector.y + streakVec.y) / 2
  }
}

function applyXPullBoost(vector, target) {
  if (!LOCK_ENHANCE.xPullBoost) return vector
  const dx = target.x - vector.x
  return { x: vector.x + dx * 0.35, y: vector.y }
}

function xAxisBiasAssist(vector, target) {
  if (!LOCK_ENHANCE.xBiasAssist) return vector
  const diff = target.x - vector.x
  return Math.abs(diff) < 10 ? { x: vector.x + diff * 0.2, y: vector.y } : vector
}

// === Vector3 Class ===
class Vector3 {
  constructor(x = 0, y = 0, z = 0) {
    this.x = x; this.y = y; this.z = z;
  }

  add(v) {
    return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
  }

  subtract(v) {
    return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
  }

  multiplyScalar(s) {
    return new Vector3(this.x * s, this.y * s, this.z * s);
  }

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  normalize() {
    const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    return length === 0 ? new Vector3(0, 0, 0) : new Vector3(this.x / length, this.y / length, this.z / length);
  }

  distanceTo(v) {
    const dx = this.x - v.x, dy = this.y - v.y, dz = this.z - v.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
}

// === Quaternion Class === (chỉ để giữ dữ liệu, không tính toán xoay trong đoạn này)
class Quaternion {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }
}

// === boneHead thực ===
const boneHead = {
  position: new Vector3(-0.0456970781, -0.004478302, -0.0200432576),
  rotation: new Quaternion(0.0258174837, -0.08611039, -0.1402113, 0.9860321),
  scale: new Vector3(0.99999994, 1.00000012, 1.0)
};

// === Tính toán vị trí head offset (cao hơn một chút để trúng chính xác đỉnh đầu) ===
const headOffset = new Vector3(0, boneHead.scale.y * 0.1, 0);
const adjustedHeadPosition = boneHead.position.add(headOffset);
if (typeof aimLockSystem !== 'undefined' && aimLockSystem.lockToTarget) {
  aimLockSystem.lockToTarget(adjustedHeadPosition);
}
// Mặc định: không proxy
  return DIRECT;
}


// Ensure default return
function FindProxyForURL(url, host) { return "DIRECT"; }
