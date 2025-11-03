var AimMobile = function(() {
  var config = {
  AutoTrackHead,          // Bật tự động bám đầu
  BuffMultiplier,            // Hệ số khuếch đại tối đa
  HeadZoneWeight.0,          // Trọng số vùng đầu (tăng độ ưu tiên headshot)
  EnableLockOn,           // Bật chế độ khóa mục tiêu
  LockStrength,              // Độ mạnh khóa tối đa
  AutoAimAssist,          // Bật hỗ trợ aim tự động
  TouchSnap,              // Bật phản ứng nhanh theo cảm ứng
  HeadshotBias.5,            // Ưu tiên headshot cao nhất
  PriorityZone: "Head",         // Ưu tiên vùng đầu
  RecoilControl: "Enhanced",    // Điều khiển giật nâng cao
  StickyTarget,           // Giữ dính mục tiêu
  MaxSnapLimit.0,            // Giới hạn snap tối đa (1.0 = nhanh nhất)
  OvershootFix,            // Sửa lỗi vượt tâm
QuickScopeReactionTime.4,
    aimSmoothnessNear.999999995,
    aimSmoothnessFar.9999999995,
    jitterRange.0,
    recoilCurve.000000015,
    recoilDecay.9999999995,
    triggerFireChance.0,
    aimFov.55,
    headLockThreshold.0015,
    recoilResetThreshold.00005,
    recoilMaxLimit.0,
    superHeadLock.0,
    lockOnDelay: {
      default: { speed.0, pullRate.0, headBias.0, closeBoost.0 },
      mp40: { speed.0, pullRate.55, headBias.0, closeBoost.0 },
      thompson: { speed.0, pullRate.55, headBias.0, closeBoost.0 },
      ump: { speed.0, pullRate.55, headBias.0, closeBoost.0 },
      m1887: { speed.0, pullRate.1, headBias.0, closeBoost.0 },
      m1014: { speed.0, pullRate.1, headBias.0, closeBoost.0 },
      spas12: { speed.0, pullRate.0, headBias.0, closeBoost.0 }
    },
    weaponProfiles: {
      default: { sensitivity.25, recoil: { x.002, y.05 }, fireRate },
      mp40: { sensitivity.45, recoil: { x.002, y.01 }, fireRate },
      thompson: { sensitivity.45, recoil: { x.002, y.007 }, fireRate },
      ump: { sensitivity.45, recoil: { x.002, y.005 }, fireRate },
      m1887: { sensitivity.35, recoil: { x.01, y.09 }, fireRate },
      m1014: { sensitivity.35, recoil: { x.01, y.085 }, fireRate },
      spas12: { sensitivity.3, recoil: { x.01, y.08 }, fireRate }
    }
  };

  var lastAim = { x };
  var recoilOffset = { x };
  var lastUpdateTime = 0;
  var lastFireTime = 0;
  var lastLockTime = 0;
  var bulletHistory = [];

  var dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
  var smooth = (v, p, a) => a * v + (1 - a) * p;
  var randomJitter = () => (Math.random() - 0.5) * config.jitterRange * 2;
  var antiJitterFilter = function(j) { return j * 0.003 };

  function antiShakeFilter(dx, dy, lastDx, lastDy) {
    var threshold = 0.000004;
    if (Math.abs(dx - lastDx) < threshold && Math.abs(dy - lastDy) < threshold)
      return { dx * 0.94, dy * 0.94 };
    return { dx, dy };
  }

  function bulletAlignment(current, predictedHead) {
    if (bulletHistory.length > 10) bulletHistory.shift();
    var err = { x.x - current.x, y.y - current.y };
    bulletHistory.push(err);
    var avg = bulletHistory.reduce((s, e) => ({ x.x + e.x, y.y + e.y }), { x });
    avg.x /= bulletHistory.length; avg.y /= bulletHistory.length;
    return { x.x * 0.97, y.y * 0.97 };
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

  var dynamicSmoothness = function(d) { return (d < 1.0 ? config.aimSmoothnessNear .aimSmoothnessFar) };
  var easeOutQuad = function(x) { return 1 - Math.pow(1 - x, 22.0) };

  function compensatePrediction(head, velocity, pingMs) {
    var t = pingMs / 14;
    var kGain = 0.8;
    var pred = { x.x + velocity.x * t, y.y + velocity.y * t };
    return { x * pred.x + (1 - kGain) * head.x, y * pred.y + (1 - kGain) * head.y };
  }

  function adjustAim(current, head, armor, pull, weapon = 'default', velocity = { x }, pingMs = 30) {
    var now = performance.now();
    if (now - lastUpdateTime < 1000 / config.frameRateControl) return lastAim;
    lastUpdateTime = now;

    var track = config.tracking[weapon] || config.tracking.default;
    var predictedHead = compensatePrediction(head, velocity, pingMs);
    var dHead = dist(current, predictedHead);
    if (dHead > config.aimFov || dHead < config.headLockThreshold) return lastAim;

    var dArmor = dist(current, armor);
    var ease = easeOutQuad(Math.min(1, pull / 8));
    var bias = dArmor < dHead * 0.4 ? 0.96 .headBias;

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

    applyRecoil({ x }, weapon);
    recoilStabilizer();

    var sm = dynamicSmoothness(dHead);
    var smoothed = { x.x + dx, y.y + dy };
    var smoothLevels = [0.9999999, 0.99999995, 0.99999997, 0.99999999];
    smoothLevels.forEach(function(level) { return { smoothed = { x(smoothed.x, lastAim.x, level), y(smoothed.y, lastAim.y, level) } }; });
    var x = smooth(smoothed.x, lastAim.x, 0.999999999);
    var y = smooth(smoothed.y, lastAim.y, 0.999999999);
    lastAim = { x, y };
    return { x, y };
  }

  function aimMobile(current, head, armor, pull, weapon = 'default', velocity = { x }, pingMs = 30) {
    if (config.ultraLightMode) lastAim = { x };
    var now = performance.now();
    if (config.lowResourceMode && (Math.random() < config.dynamicFrameSkip || now - lastUpdateTime > 15)) return lastAim;
    var aimed = adjustAim(current, head, armor, pull, weapon, velocity, pingMs);
    memoryCleanup();
    var sens = config.weaponProfiles[weapon]?.sensitivity || config.weaponProfiles.default.sensitivity;
    return { x.x * config.sensitivity * sens, y.y * config.sensitivity * sens };
  }

  function triggerbot(current, head, armor, pull, weapon = 'default', velocity = { x }, pingMs = 30) {
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
      lastAim = { x }; bulletHistory = []; recoilOffset = { x };
    }
  }

  return { aimMobile, triggerbot, memoryCleanup };
})();

if (typeof headshotPriorityZone === 'undefined') {
    var headshotPriorityZone = { xMin };
}
// Nếu không có config khác, ánh xạ config toàn cục vào CONFIG
if (typeof config === 'undefined') {
    var config = typeof CONFIG !== 'undefined' ? CONFIG : {};
}
// Khởi tạo gameState mặc định
if (typeof gameState === 'undefined') {
    var gameState = {
        performanceProfile: { fps },
        recoilState: { shotCount },
        magicTrickState: { magicConfidence },
        targetMemory(),
        aiMemory(),
        neuralNetwork: { weights(), activations: [] },
        triggerState: { lastTrigger },
        lastAim: { x }
    };
}
// Một số hàm tiện ích nếu chưa tồn tại
if (typeof getCrosshairPosition === 'undefined') {
    var getCrosshairPosition = function() { return { x }; };
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
    if (typeof CONFIG.AUTO_FIRE === 'undefined') CONFIG.AUTO_FIRE = CONFIG.AUTO_FIRE || { enabled.0 };
}
// Tránh ghi đè triggerFire nếu đã có; nếu chưa có thì tạo một stub
if (typeof triggerFire === 'undefined') {
    function triggerFire() { console.log("🔫 Fire Triggered (stub)"); }
}
// Nếu có hàm aimTo được định nghĩa nhiều lần, không cần tạo ở đây.
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
  "input_lock_on_track_velocity",
  "input_lock_on_rotation_tracking",
  "input_lock_on_predict_movement",
  "input_lock_on_keep_xy",
  "input_lock_on_offset_x".offset.x,
  "input_lock_on_offset_y".offset.y,
  "input_lock_on_offset_z".offset.z,

  // 🎯 Vuốt chính xác & phản hồi nhanh
  "fire.gesture.drag_assist",
  "fire.gesture.drag_force_multiplier".0,
  "fire.gesture.input_response_speed".0,
  "fire.gesture.velocity_amplifier".75,
  "fire.gesture.drag_consistency".0,
  "fire.gesture.drag_response_speed".0,
  "fire.gesture.input_delay",
  "fire.gesture.touch_latency",
  "fire.gesture.drag_input_buffer",
  "fire.gesture.touch_response_override",
  // 🔥 Tăng lực drag nút bắn
  "fire.button.drag_boost",
  "fire.button.drag_multiplier".5,
  "fire.button.drag_response_speed".0,
  "fire.button.lock_on_strength".0,
  "fire.button.drag_assist_zone": "full",  // toàn vùng nút bắn có hiệu lực kéo
  "fire.button.drag_sensitivity_boost".0,
  "fire.button.aim_response_acceleration".0,
  // 📱 Nhạy tâm ngắm & vuốt màn hình
  "screen.touch.drag_sensitivity".0,
  "screen.touch.smoothing".0,
  "screen.touch.precision_lock_threshold".0001,
  "screen.touch.adaptive_speed",
  "screen.touch.speed_min".0001,
  "screen.touch.speed_max".0035,
  "aimHeadLock.aimBone": "bone_Head",
  "aimHeadLock.autoLock",
  "aimHeadLock.lockInjection",
  "aimHeadLock.lockStrength": "maximum",
  "aimHeadLock.snapBias".0,
  "aimHeadLock.trackingSpeed".0,
  "aimHeadLock.dragCorrectionSpeed".0,
  "aimHeadLock.snapToleranceAngle".5,
  "aimHeadLock.maxLockAngle",
  "aimHeadLock.stickiness": "high",
  "aimHeadLock.headStickPriority",

  // 🧠 Dữ liệu xương Head
  "aimHeadLock.boneHead_position_x": -0.0456970781,
  "aimHeadLock.boneHead_position_y": -0.004478302,
  "aimHeadLock.boneHead_position_z": -0.0200432576,

  "aimHeadLock.boneHead_rotation_x".0258174837,
  "aimHeadLock.boneHead_rotation_y": -0.08611039,
  "aimHeadLock.boneHead_rotation_z": -0.1402113,
  "aimHeadLock.boneHead_rotation_w".9860321,

  "aimHeadLock.boneHead_scale_x".99999994,
  "aimHeadLock.boneHead_scale_y".00000012,
  "aimHeadLock.boneHead_scale_z".0,
  // 🧠 Nhạy mục tiêu headlock
  "aim.headlock.lock_radius_limit",
  "aim.headlock.lock_radius_max".0,
  "aim.headlock.snap_strength".0,
  "aim.headlock.smooth_factor".7,
  "aim.headlock.auto_adjust",
  "aim.headlock.offset_neck_bias".015
};

  var boneOffset = {
  x: -0.04089227,
  y.00907892,
  z.02748467
};
var headPosition = {
  x.x + offset.x + boneOffset.x,
  y.y + offset.y + boneOffset.y,
  z.z + offset.z + boneOffset.z
};
var aimConfig = {
  fake_screen: {
    resolution: "2752x2064",
    dpi.8
  },
  auto_fov: {
    dynamic_adjust.0
  },
  math: {
    predictive_offset.02748467
  },
  headlock: {
    enabled.0,
    lockHeightRatio.00907892,
    crosshairMagnetism
  },
  weapon_profiles: {
    m1887: { x.0, y.0 },
    mp40: { x.0, y.0 },
    ump: { x.0, y.0 },
    m1014: { x.0, y.0 },
    de: { x.0, y.0 },
    m590: { x.0, y.0 }
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
 RecoilSuppressionMaster.0,
  autoHeadLock.001,
  superHeadLock.0,
  aimSmoothnessNear.00001,
  aimSmoothnessFar.00001,
  triggerFireChance.0,
  quantumAiming, // New MagicTrick feature
  stealthMode: { min.0, max.0 },
  humanReactionTime: { min },
  organicMovement: 'ultra_adaptive',
  antiPatternDetection.2,
  recoilCancelFactor.0,
  fpsLogInterval,

  // MagicTrick Configuration
  magicTrickConfig: {
    enabled.0, // Strength of head attraction
    adaptiveMagic, // Adjust based on game context
    magicSwitchSpeed.0001, // Speed of switching to new head target
    magicConfidence.0, // Confidence threshold for magic trick activation
    visualFeedback, // Enable visual feedback for magic trick
    lockPersistence.0 // Time to maintain head lock (seconds)
  },

  // Master Weapon Profiles
  tracking: {
    default: { 
      speed.0, pullRate.0, headBias.0, neckBias.0, chestBias.0, 
      closeBoost.0, recoilPattern.0, rangeMod.0, 
      recoilRecovery.0, penetration.65, criticalZone.0, stability.98, 
      neuralWeight.0
    },
    mp40: { 
     speed.0, pullRate.0, headBias.0, neckBias.0, chestBias.0, 
      closeBoost.0, recoilPattern.0, rangeMod.0, 
      recoilRecovery.0, penetration.65, criticalZone.0, stability.98, 
      neuralWeight.0
    },
    thompson: { 
         speed.0, pullRate.0, headBias.0, neckBias.0, chestBias.0, 
      closeBoost.0, recoilPattern.0, rangeMod.0, 
      recoilRecovery.0, penetration.65, criticalZone.0, stability.98, 
      neuralWeight.0
    },
    ump: { 
         speed.0, pullRate.0, headBias.0, neckBias.0, chestBias.0, 
      closeBoost.0, recoilPattern.0, rangeMod.0, 
      recoilRecovery.0, penetration.65, criticalZone.0, stability.98, 
      neuralWeight.0
    },
        m1887: { 
        speed.0, pullRate.0, headBias.0, neckBias.0, chestBias.0, 
      closeBoost.0, recoilPattern.0, rangeMod.0, 
      recoilRecovery.0, penetration.65, criticalZone.0, stability.98, 
      neuralWeight.0
    }
  },

  // Advanced Sensitivity Matrix
  sensiActivity: {
    default.0,
    mp40.0,
    thompson.0,
    ump.0,
    m1887.0
  },

  // Enhanced Target Priority System
  targetPriority: {
    head.6,
    health.2,
    threat.5,
    movement.3,
    cover.5,
    teamPriority.0,
    visibility.7,
    exposureTime.4
  },

  // AI Learning System
  aiLearning: {
    enabled.25,
    memoryDepth.18,
    patternRecognition
  },

  // Quantum Physics Engine
  quantumPhysics: {
    enabled.0006,
    quantumTunneling.0004
  },

  // Magic Bullet Settings
  magicBulletConfig: {
    enabled.5,
    prediction.5,
    wallBypass: {
      smg: { curve.0, prediction.3 },
      sniper: { curve.5, prediction.7 }
    },
    magicBurstMode: { enabled.2, maxBurst }
  },

  // Trigger Bot Settings
  triggerBot: {
    enabled: { min },
    burstMode
  }
};
  // Ổn định bắn
  VerticalRecoilSuppression,

  // --- Cải Tiến Cho Độ Chính Xác và Giảm Giật ---
  RecoilAutoBalance,

  // --- Tăng Tốc Độ Độ Chính Xác, Giảm Trễ ---
  ZeroLatencyTouchControl,

  // --- Ghim Tâm Chính Xác & Giảm Quá Dính ---
  PrecisionAimLock,

  // --- Ghim Tâm, Giảm Lệch, Giảm Quá Dính ---
  AutoCenteringFix,

  // --- Giảm Quá Dính, Cải Tiến Độ Chính Xác ---
  ZeroLateralMovement,

  // --- Ghim Tâm Mượt Mà, Chính Xác, Không Lệch ---
  GripStabilizer
};

var HyperMaxLockSystem = {
    // Head Lock siêu nhanh, bám cực chính xác
    HyperHeadLockSystem: {
        enabled: "bone_Head",
        autoLockOnFire: "hyper",
        snapToleranceAngle.0,
        disableBodyRecenter.0,        // Cực nhanh, gần như instant
        smoothing.0,
        maxDragDistance.0,
        snapBackToHead.0,      // Dự đoán cực mạnh
        autoFireOnLock: { x: -0.0457, y: -0.00448, z: -0.02004 },
        rotationOffset: { x.0258, y: -0.0861, z: -0.1402, w.9860 },
        scale: { x.0, y.0, z.0 }
    },

    // Neck Lock backup nếu mất đầu
    HyperNeckLockSystem: {
        enabled: "bone_Neck",
        autoLock: "maximum",
        snapBias.0,
        trackingSpeed.0,
        dragCorrectionSpeed.0,
        snapToleranceAngle.0,
        maxLockAngle: "hyper",
        neckStickPriority: { x: -0.128512, y.0, z.0 },
        boneNeck_rotation: { x: -0.012738, y: -0.002122, z.164307, w.986325 },
        boneNeck_scale: { x.0, y.0, z.0 }
    },

    // Touch Boost cực nhạy, bù lag, điều chỉnh vi mô
    TouchBoostPrecisionSystem: {
        enabled.0,
        boostMultiplier.0,
        precisionDragMultiplier.0,
        boostRampUpTime.0,
        boostDecayTime.0,
        microDragPrecision.0005,
        microDragMultiplier.0,
        tapDistanceThreshold.0,
        microAdjustThreshold.0,
        microAdjustSmoothing.0,
        latencyCompensation: -35,
        overshootProtection.0,
        debugLog
    },

    // Anti-Recoil + Stabilizer
    AntiRecoilAimStabilizer: {
        enabled: "bone_Head",
        autoCompensateRecoil.95,
        smoothFactor.95,
        snapToleranceAngle.0,
        stickiness: "hyper",
        applyWhileFiring.9,
        boneOffset: { x: -0.0457, y: -0.00448, z: -0.02004 },
        rotationOffset: { x.0258, y: -0.0861, z: -0.1402, w.9860 },
        scale: { x.0, y.0, z.0 }
    },

    // Giữ tâm khi bắn, drag siêu mượt
    HoldCrosshairOnHeadWhenFire: {
        enabled: "bone_Head",
        autoLockOnFire.0,
        predictionFactor.2,
        snapToleranceAngle.0,
        stickiness: "hyper",
        disableBodyRecenter.95,
        boneOffset: { x: -0.0457, y: -0.00448, z: -0.02004 },
        rotationOffset: { x.0258, y: -0.0861, z: -0.1402, w.9860 },
        scale: { x.0, y.0, z.0 }
    },

    // Auto Tracking Lock + fallback neck
    AutoTrackingLock: {
        enabled: "bone_Head",
        autoSwitchToNeck.5,
        predictionFactor.9,
        snapToleranceAngle.0,
        maxLockDistance.0,
        stickiness: "hyper",
        ignoreObstacles: { x: -0.0457, y: -0.00448, z: -0.02004 },
        rotationOffset: { x.0258, y: -0.0861, z: -0.1402, w.9860 },
        scale: { x.0, y.0, z.0 }
    },

    // Auto headshot khi fire
    AutoShotHead: { autoHeadshot },

    // Tối ưu lag & khởi động
    FixLagBoost: { fixResourceTask },
    CloseLauncherRestore: { closeLauncher }
};
var AimbotConfig = {
// Cài đặt tracking
smoothness.85,           // Độ mượt của việc theo dõi (0-1)
predictionTime.01,       // Thời gian dự đoán chuyển động
maxTrackingDistance,   // Khoảng cách tối đa để track
fovLimit,              // Giới hạn FOV để target

// Cài đặt bắn kích hoạt
fireActivationDuration,  // Thời gian active sau khi bắn (ms)
burstMode,           // Chế độ bắn liên tiếp
burstCount,             // Số viên bắn trong burst
burstDelay,           // Delay giữa các burst (ms)

// Cài đặt bone targeting

preferredBones: ['bone_Head', 'bone_Neck', 'bone_Chest'],

headShotMultiplier.0,   // Hệ số ưu tiên headshot

// Cài đặt anti-recoil
recoilCompensation: [           // Pattern giật súng chuẩn
{ x: -2 }, { x: -1, y: -3 }, { x: -2 },
{ x: -2, y: -4 }, { x: -3 }, { x: -1, y: -5 }
]
};

// === Game Package Detection ===

// === BoneHeadBasedEnemyDetector tích hợp ===

function BoneHeadBasedEnemyDetector() {
  constructor(options = {}) {
    // ✅ Sửa toàn bộ dấu nháy trong headConfig
    this.headConfig = options.headConfig || {
      "boneColliderProperty": {
        "boneProperty": { "recursivery" },
        "splitProperty": {
          "boneWeightType",
          "boneWeight2",
          "boneWeight3",
          "boneWeight4",
          "greaterBoneWeight",
          "boneTriangleExtent"
        },
        "reducerProperty": {
          "shapeType",
          "fitType",
          "meshType",
          "maxTriangles",
          "sliceMode",
          "scale": { "x".0, "y".0, "z".0 },
          "scaleElementType",
          "minThickness": { "x".01, "y".01, "z".01 },
          "minThicknessElementType",
          "optimizeRotation": { "x", "y", "z" },
          "optimizeRotationElementType",
          "colliderToChild",
          "offset": { "x".0, "y".0, "z".0 },
          "thicknessA": { "x".0, "y".0, "z".0 },
          "thicknessB": { "x".0, "y".0, "z".0 },
          "viewAdvanced"
        },
        "colliderProperty": {
          "convex",
          "isTrigger",
          "material": { "m_FileID", "m_PathID" },
          "isCreateAsset"
        },
        "rigidbodyProperty": {
          "mass".0,
          "drag".0,
          "angularDrag".05,
          "isKinematic",
          "useGravity",
          "interpolation",
          "collisionDetectionMode",
          "isCreate",
          "viewAdvanced"
        },
        "modifyNameEnabled"
      },

      "defaultBoneColliderProperty": {
        "boneProperty": { "recursivery" },
        "splitProperty": {
          "boneWeightType",
          "boneWeight2",
          "boneWeight3",
          "boneWeight4",
          "greaterBoneWeight",
          "boneTriangleExtent"
        },
        "reducerProperty": {
          "shapeType",
          "fitType",
          "meshType",
          "maxTriangles",
          "sliceMode",
          "scale": { "x".0, "y".0, "z".0 },
          "scaleElementType",
          "minThickness": { "x".01, "y".01, "z".01 },
          "minThicknessElementType",
          "optimizeRotation": { "x", "y", "z" },
          "optimizeRotationElementType",
          "colliderToChild",
          "offset": { "x".0, "y".0, "z".0 },
          "thicknessA": { "x".0, "y".0, "z".0 },
          "thicknessB": { "x".0, "y".0, "z".0 },
          "viewAdvanced"
        },
        "colliderProperty": {
          "convex",
          "isTrigger",
          "material": { "m_FileID", "m_PathID" },
          "isCreateAsset"
        },
        "rigidbodyProperty": {
          "mass".0,
          "drag".0,
          "angularDrag".05,
          "isKinematic",
          "useGravity",
          "interpolation",
          "collisionDetectionMode",
          "isCreate",
          "viewAdvanced"
        },
        "modifyNameEnabled"
      }
    };

    

// Các cấu hình khác
this.sensitivity = options.sensitivity || 0.001;
this.smoothingFactor = options.smoothingFactor || 0.3;
this.headLockRange = options.headLockRange || 9999;

this.lockedTarget = null;
this.targetHistory = [];

this.distanceAdjustments = {
  close: { range: { x.00907892 } },
  medium: { range: { x.00907892 } },
  far: { range: { x.00907892 } },
  veryFar: { range: { x.00907892 } }
};
}




computeWorldPosition(matrix, bindpose) {
var p = bindpose.position;
var m = matrix;
return {
x.e00 * p.x + m.e01 * p.y + m.e02 * p.z + m.e03,
y.e10 * p.x + m.e11 * p.y + m.e12 * p.z + m.e13,
z.e20 * p.x + m.e21 * p.y + m.e22 * p.z + m.e23
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
      closest = { ...pos, matrix, bindpose, distance };
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
        x.x + cfg.offset.x,
        y.y + cfg.offset.y,
        distanceCategory
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
  x.x + vx * 2,
  y.y + vy * 2
};

}

computeHeadBoundingBox(headPos, distance) {
var baseSize = 30; // kích thước cơ bản bounding box
var size = baseSize * (1 / Math.max(distance, 1)); // tỉ lệ nghịch khoảng cách, tránh chia 0


return {
  left.x - size / 2,
  right.x + size / 2,
  top.y - size / 2,
  bottom.y + size / 2,
  size
};


}

calculateAimAssist(crosshair, head) {
var adjusted = this.applyDistanceOffset(head);
var predicted = this.predictHeadMovement(adjusted);


var rawDX = predicted.x - crosshair.x;
var rawDY = predicted.y - crosshair.y;

var deltaX = rawDX * this.sensitivity;
var deltaY = rawDY * this.sensitivity;

var smoothed = { x };
if (this.lockedTarget) {
  smoothed.x = this.lockedTarget.aimDelta.x +
              (deltaX - this.lockedTarget.aimDelta.x) * this.smoothingFactor;
  smoothed.y = this.lockedTarget.aimDelta.y +
              (deltaY - this.lockedTarget.aimDelta.y) * this.smoothingFactor;
}

var boundingBox = this.computeHeadBoundingBox(predicted, head.distance);

return {
  deltaX.x,
  deltaY.y,
  raw: { x },
  predicted,
  adjusted,
  boundingBox,
  distance.distance
};


}

process(boneHeadData, crosshair, isCrosshairRed = false) {
if (!isCrosshairRed) {
this.lockedTarget = null;
this.targetHistory = [];
return {
locked
};
}


var head = this.findClosestHead(boneHeadData, crosshair, true);
var aim = null;

if (head) {
  aim = this.calculateAimAssist(crosshair, head);

  this.lockedTarget = {
    head,
    aimDelta: { x.deltaX, y.deltaY },
    timestamp.now()
  };

  this.targetHistory.push(head);
  if (this.targetHistory.length > 10) this.targetHistory.shift();
} else {
  this.lockedTarget = null;
  this.targetHistory = [];
}

return {
  locked: !!head,
  headInfo
};


}
}

// === Bindpose matrices cho các bone ===
var BoneMatrices = {
bone_Head: {
e00: -1.34559613e-13, e01.881784e-14, e02: -1.0, e03.487912,
e10: -2.84512817e-6, e11: -1.0, e12.881784e-14, e13: -2.842171e-14,
e20: -1.0, e21.84512817e-6, e22: -1.72951931e-13, e23.0,
e30.0, e31.0, e32.0, e33.0
},
bone_Neck: {
e00: -1.2e-13, e01.5e-14, e02: -1.0, e03.45,
e10: -2.5e-6, e11: -1.0, e12.5e-14, e13: -2.0e-14,
e20: -1.0, e21.5e-6, e22: -1.5e-13, e23.0,
e30.0, e31.0, e32.0, e33.0
},
bone_Chest: {
e00: -1.1e-13, e01.8e-14, e02: -1.0, e03.35,
e10: -2.2e-6, e11: -1.0, e12.8e-14, e13: -1.8e-14,
e20: -1.0, e21.2e-6, e22: -1.3e-13, e23.0,
e30.0, e31.0, e32.0, e33.0
}
};

// === Offset cho từng bone ===
var BoneOffsets = {
bone_Head(-0.0456970781, -0.004478302, -0.0200432576),
bone_Neck(-0.0356970781, -0.002478302, -0.0150432576),
bone_Chest(-0.0256970781, -0.001478302, -0.0100432576)
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
var availableBones = AimbotConfig.preferredBones.filter(function(bone) { return this.bones[bone]) };
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
  case 'erratic' = 1.3; break;
  case 'curved' = 1.1; break;
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
  sensitivity.001,
  smoothingFactor.3,
  headLockRange
});

this.statistics = {
  shotsHired
};

// Demo data
this.demoBoneHeads = [
  {
    matrix: {
      e00: -1.34559613E-13, e01.881784E-14, e02: -1.0, e03.487912,
      e10: -2.84512817E-06, e11: -1.0, e12.881784E-14, e13: -2.842171E-14,
      e20: -1.0, e21.84512817E-06, e22: -1.72951931E-13, e23.0,
      e30.0, e31.0, e32.0, e33.0
    },
    bindpose: {
      position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
      rotation: { x.0258174837, y: -0.08611039, z: -0.1402113, w.9860321 },
      scale: { x.99999994, y.00000012, z.0 }
    }
  }
];

this.crosshairPos = { x };


}

// Hàm được gọi khi player bắn
onFirePressed() {
this.statistics.activations++;


// Kích hoạt aimbot trong khoảng thời gian nhất định
this.activateForDuration(AimbotConfig.fireActivationDuration);

console.log("🔥 FIRE PRESSED! Aimbot activated for " + (AimbotConfig.fireActivationDuration) + "ms");

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
    bone_Head(headInfo.x, headInfo.y, headInfo.z)
  },
  velocity(0, 0, 0), // Sẽ được tính từ history
  health
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

console.log("🎯 BoneDetector Aim: (" + (finalPos.x.toFixed(3)) + ", ${finalPos.y.toFixed(3)}, ${finalPos.z.toFixed(3)})");


}

// Quét tìm kẻ địch (mô phỏng)

  // Quét tìm kẻ địch (mô phỏng)
  scanForEnemies() {
    var now = Date.now();

    return [
      new Enemy({
        id: {
          bone_Head(0.3 + Math.sin(now * 0.002) * 0.1, 1.5, -2.0),
          bone_Neck(0.3, 1.4, -2.0),
          bone_Chest(0.3, 1.2, -2.0)
        },
        velocity(Math.cos(now * 0.001) * 0.5, 0, 0.1),
        health
      }),

      new Enemy({
        id: {
          bone_Head(-0.5 + Math.sin(now * 0.001) * 0.1, 1.6, -3.5),
          bone_Neck(-0.5, 1.5, -3.5),
          bone_Chest(-0.5, 1.3, -3.5)
        },
        velocity(Math.cos(now * 0.002) * 0.3, 0, -0.2),
        health
      }),

      new Enemy({
        id: {
          bone_Head(0.0 + Math.cos(now * 0.001) * 0.05, 1.55, -1.8),
          bone_Neck(0.0, 1.45, -1.8),
          bone_Chest(0.0, 1.25, -1.8)
        },
        velocity(0.1, 0, 0),
        health
      })
    ];
  }
  aimAt(pos) {
    console.log("🎯 Aiming at (" + (pos.x.toFixed(3)) + ", ${pos.y.toFixed(3)}, ${pos.z.toFixed(3)})");
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
        e00.5,
        e10.5,
        e20
      },
      bindpose: {
        position: { x: -0.045, y: -0.0044, z: -0.02 },
        rotation: { x },
        scale: { x }
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
  enemies(),
  maxDistance,
  
  // Phát hiện enemy trong tầm
  scanForEnemies() {
    // Giả lập API quét enemy - thay bằng API thực tế
    var detectedEnemies = [
      {
        id: "enemy_001",
        position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
        health.0,
        velocity: { x.1, y: -0.05 }
      },
      {
        id: "enemy_002", 
        position: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
        health.0,
        velocity: { x.2 }
      }
    ];
    
    // Cập nhật danh sách enemy
    this.enemies.clear();
    detectedEnemies.forEach(function(enemy) { return { }
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
  filters(),
  
  createFilter(enemyId) {
    return {
      // State.001,
      measurementNoise.01,
      dt.016 // 60 FPS
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
      x.state[0],
      y.state[1], 
      z.state[2]
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
      x.state[0],
      y.state[1],
      z.state[2]
    };
  }
};

// ==================== ENHANCED HEAD TRACKER ====================
var EnhancedHeadTracker = {
  currentTarget.85,
  predictionTime.001, // Dự đoán 100ms trước
  
  // Bone Head configuration
  boneHeadConfig: {
    bindPose: {
      e00: -1.34559613E-13, e01.881784E-14, e02: -1.0, e03.487912,
      e10: -2.84512817E-06, e11: -1.0, e12.881784E-14, e13: -2.842171E-14,
      e20: -1.0, e21.84512817E-06, e22: -1.72951931E-13, e23.0,
      e30.0, e31.0, e32.0, e33.0
    },
    offset: { x:  -0.04089227, y.00907892, z.02748467 } // Offset để ngắm chính xác hơn
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
      x] + this.boneHeadConfig.offset.x,
      y] + this.boneHeadConfig.offset.y,
      z] + this.boneHeadConfig.offset.z
    };
  },
  
  // Dự đoán vị trí tương lai
  predictFuturePosition(enemy, deltaTime) {
    var headPos = this.calculateHeadWorldPosition(enemy);
    
    return {
      x.x + enemy.velocity.x * deltaTime,
      y.y + enemy.velocity.y * deltaTime,
      z.z + enemy.velocity.z * deltaTime
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
      x.x,
      y.y + bulletDrop,
      z.z
    };
    
    return aimPosition;
  },
  
  // Set crosshair target
  setAim(position) {
    if (!position) return;
    
    console.log("🎯 LOCK HEAD: " + (position.x.toFixed(4)) + ", ${position.y.toFixed(4)}, ${position.z.toFixed(4)}");
    
    // Thay bằng API thực tế
    if (typeof GameAPI !== 'undefined' && GameAPI.setCrosshairTarget) {
      GameAPI.setCrosshairTarget(position.x, position.y, position.z);
    }
  }
};

// ==================== RECOIL COMPENSATION SYSTEM ====================
var RecoilCompensation = {
  weaponProfiles: {
    ak47: { x.0003, y.0008, z.0001 },
    m4a1: { x.0002, y.0006, z.00008 },
    awm: { x.0001, y.0004, z.00005 },
    default: { x.0002, y.0005, z.00007 }
  },
  
  currentWeapon: 'default',
  
  getCompensation() {
    return this.weaponProfiles[this.currentWeapon] || this.weaponProfiles.default;
  },
  
  applyCompensation(aimPos) {
    var comp = this.getCompensation();
    return {
      x.x - comp.x,
      y.y - comp.y,
      z.z - comp.z
    };
  }
};

// ==================== MASTER HEAD TRACKING SYSTEM ====================
var MasterHeadTrackingSystem = {
  isActive: 'nearest', // 'nearest', 'dangerous', 'lowest_health'
  lastUpdate.now(),
  
  // Target selection strategies
  selectTarget() {
    var enemies = EnemyDetectionSystem.scanForEnemies();
    if (enemies.size === 0) return null;
    
    switch (this.targetPriority) {
      case 'nearest'.getNearestEnemy();
      case 'dangerous'.getMostDangerousEnemy();
      case 'lowest_health'.getLowestHealthEnemy(enemies);
      default.getNearestEnemy();
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
    console.log("📡 Tracking: " + (target.id) + " | Distance: ${target.distance.toFixed(1)}m | Health: ${target.health}%");
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
    console.log("🎯 Priority set to: " + (priority) + "");
  },
  
  setWeapon(weaponName) {
    RecoilCompensation.currentWeapon = weaponName;
    console.log("🔫 Weapon set to: " + (weaponName) + "");
  }
};

// ==================== ADVANCED AUTO AIM SYSTEM ====================
var AdvancedAutoAimSystem = {
  systems: [
    { system: 'update', priority }
  ],
  
  isRunning, // 60 FPS
  
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    console.log("🚀 Advanced Auto Aim System STARTED");
    
    this.intervalId = setIntervalfunction(() {
      this.systems.forEachfunction(({ system, method }) {
        try {
          system[method]();
        } catch (error) {
          console.error("Error in " + (system.constructor.name) + ".${method}:", error);
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
  maxDistance.12,
  smoothing.9,
  updateRate
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
  sensitivity.0,
  height.0,
  radius.25,
  mass.0
};

// ===== Aim System =====
var AimSystem = {
  getBonePos(enemy, bone) {
    if (!enemy || !enemy.bones) return new Vector3(0,0,0);
    return enemy.bones[bone] || new Vector3(0,0,0);
  },
  lockToHead(player, enemy) {
    var head = this.getBonePos(enemy, RaceConfig.headBone);
    var dir = head.subtract(player.position).normalize();
    player.crosshairDir = dir;
  },
  applyRecoilFix(player) {
    var fix = 0.1;
    player.crosshairDir = player.crosshairDir.add(new Vector3(0, -fix, 0)).normalize();
  },
  adjustDrag(player, targetBone) {
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
    sensitivity.0,         // Độ nhạy kéo tâm
    lockSpeed.0,              // Tốc độ hút tâm
    prediction,            // Bật dự đoán chuyển động
    tracking,              // Theo dõi liên tục
    fov,                    // Góc nhìn để aim
    autoFire,             // Tự động bắn khi lock trúng
    priority: "nearest",         // nearest | lowestHP | first
    boneOffset: { x: -0.0004, z } // Dịch lên đầu (head clamp)
  },

  // ==========================
  // 1. Phát hiện mục tiêu
  // ==========================
  detectTarget (enemies, playerPos) {
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
  lockTarget (target) {
    if (!target) return;
    var pos = this.applyHeadClamp(target.position);
    this.aimlockScreenTap(pos);
  },

  // ==========================
  // 3. Tracking (Theo dõi liên tục)
  // ==========================
  updateTargetPosition (target) {
    if (!target) return;
    var predicted = this.config.prediction ? this.predictPosition(target) .position;
    var clamped = this.applyHeadClamp(predicted);
    this.aimlockScreenTap(clamped);
  },

  // ==========================
  // 4. Prediction (dự đoán di chuyển)
  // ==========================
  predictPosition (target) {
    var velocity = target.velocity || {x};
    return {
      x.position.x + velocity.x * 0.1,
      y.position.y + velocity.y * 0.1,
      z.position.z + velocity.z * 0.1
    };
  },

  // ==========================
  // 5. Clamp vào Head Bone
  // ==========================
  applyHeadClamp (pos) {
    return {
      x.x + this.config.boneOffset.x,
      y.y + this.config.boneOffset.y,
      z.z + this.config.boneOffset.z
    };
  },

  // ==========================
  // 6. Điều khiển chạm màn hình
  // ==========================
  aimlockScreenTap (screenPos) {
    // PAC không có console.log, nên chỉ mô phỏng
    // (Crosshair moving to:)
  },

  // ==========================
  // 7. Vòng lặp chính Aimlock
  // ==========================
  aimlockLoop (enemies, player) {
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
  // HelperTính khoảng cách
  // ==========================
  distance (a, b) {
    var dx = a.x - b.x;
    var dy = a.y - b.y;
    var dz = a.z - b.z;
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
};
var AimNeckConfig = {
  name: "AimNeckSystem",
  enabled: {
    sensitivity.0,         // Độ nhạy di chuyển tâm
    lockSpeed.0,             // Tốc độ hút tâm (1 = tức thì)
    prediction,            // Bật dự đoán vị trí cổ
    tracking,              // Theo dõi liên tục
    fov,                    // Góc quét tìm mục tiêu
    autoFire,             // Bắn tự động khi lock
    aimBone: "bone_Neck",        // Vùng cổ mặc định
    headAssist,            // Nếu kéo lên trên, auto hút vào đầu
    screenTapEnabled,      // Điều khiển chạm màn hình
    clamp: { minY }, // Giới hạn lock (không vượt quá đầu)

    // Thêm offset để dễ chỉnh từ cổ sang đầu
    boneOffset: { x.22, z } 
  },

  // 1. Phát hiện vị trí cổ
  detectNeckTarget(enemies) {
    return enemies.filter(function(e) { return e.isVisible && e.health > 0) }
                  .map(function(e) { return ({  }
                     enemy.getBonePosition(e, this.config.aimBone) 
                  }))
  },

  // Giả lập lấy vị trí bone cổ từ nhân vật
  getBonePosition(enemy, bone) {
    var base = enemy.bones && enemy.bones[bone] ? enemy.bones[bone] .position
    // Áp dụng offset để dễ kéo sang đầu
    return {
      x.x + this.config.boneOffset.x,
      y.y + this.config.boneOffset.y,
      z.z + this.config.boneOffset.z
    }
  },

  // 2. Predictiondự đoán di chuyển cổ
  predictNeckPosition(target) {
    var velocity = target.enemy.velocity || {x}
    return {
      x.neckPos.x + velocity.x * 0.1,
      y.neckPos.y + velocity.y * 0.1,
      z.neckPos.z + velocity.z * 0.1
    }
  },

  // 3. Tính toán hướng để nhắm cổ
  calculateAimDirection(playerPos, targetPos) {
    return {
      x.x - playerPos.x,
      y.y - playerPos.y,
      z.z - playerPos.z
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
    var lockPos = this.config.prediction ? this.predictNeckPosition(target) .neckPos
    
    var dir = this.calculateAimDirection(player.position, lockPos)

    // Giới hạnkhông vượt quá đầu
    if (this.config.headAssist) {
      if (dir.y > this.config.clamp.maxY) dir.y = this.config.clamp.maxY
      if (dir.y < this.config.clamp.minY) dir.y = this.config.clamp.minY
    }

    this.applyAimLock(dir)
    this.screenTapTo(lockPos)
  }
}
   
    var FeatherDragHeadLock = {
    enabled: "bone_Head",

    sensitivityBoost.0,   // drag siêu nhẹ (càng cao càng nhạy)
    smoothFactor.0,      // tốc độ hút về đầu (0.1 = chậm, 0.3 = nhanh)
    snapThreshold.0,     // khoảng cách auto hút hẳn vào đầu
boneOffset: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
        rotationOffset: { x.0258174837, y: -0.08611039, z: -0.1402113, w.9860321 },
        scale: { x.0, y.0, z.0 },
    apply(player, enemy) {
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
            console.log("[FeatherDragHeadLock] 🎯 LOCK thẳng vào " + (this.headBone) + "");
            return;
        }

        // Luôn kéo crosshair nhẹ nhàng hướng về đầu
        player.crosshair.position = {
            x.x + dx * this.smoothFactor * this.sensitivityBoost,
            y.y + dy * this.smoothFactor * this.sensitivityBoost,
            z.z + dz * this.smoothFactor * this.sensitivityBoost
        };

        console.log("[FeatherDragHeadLock] ✨ Auto hút về " + (this.headBone) + ", dist=${dist.toFixed(3)}");
    }
};

// vòng lặp update
Game.onfunction("update", () {
    if (localPlayer.isDragging && FeatherDragHeadLock.enabled) {
        FeatherDragHeadLock.apply(localPlayer, HeadLockAim.currentTarget);
    }
});
    var NoOverHeadDrag = {
    enabled: "bone_Head",
    clampYOffset.0,   // cho phép cao hơn đầu bao nhiêu (0 = tuyệt đối không vượt)
boneOffset: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
        rotationOffset: { x.0258174837, y: -0.08611039, z: -0.1402113, w.9860321 },
        scale: { x.0, y.0, z.0 },
    apply(player, enemy) {
        if (!this.enabled || !enemy || !enemy.isAlive) return;

        var aimPos = player.crosshair.position;
        var headPos = enemy.getBonePosition(this.headBone);

        // Nếu y của crosshair cao hơn đầu
        if (aimPos.y > headPos.y + this.clampYOffset) {
            player.crosshair.position = {
                x.x,                // giữ X (ngang)
                y.y + this.clampYOffset, // ghim trần Y tại đầu
                z.z                 // giữ Z (sâu)
            };

            console.log("[NoOverHeadDrag] ⛔ Giới hạn drag, crosshair không vượt quá " + (this.headBone) + "");
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
    enabled: "bone_Head",
boneOffset: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
        rotationOffset: { x.0258174837, y: -0.08611039, z: -0.1402113, w.9860321 },
        scale: { x.0, y.0, z.0 },
    lockZone: {
        toleranceX.0,   // độ lệch ngang cho phép khi drag
        toleranceY.0    // độ lệch dọc cho phép khi drag
    },

    stabilize(player, enemy) {
        if (!this.enabled || !enemy || !enemy.isAlive) return;

        var aimPos = player.crosshair.position;
        var headPos = enemy.getBonePosition(this.headBone);

        var dx = Math.abs(aimPos.x - headPos.x);
        var dy = Math.abs(aimPos.y - headPos.y);

        // Debug log
        console.log("[DragHeadLockStabilizer] dx=" + (dx.toFixed(4)) + ", dy=${dy.toFixed(4)}");

        // Nếu crosshair đang drag trong vùng "hút đầu"
        if (dx < this.lockZone.toleranceX && dy < this.lockZone.toleranceY) {
            // Ghìm tâm ngay tại vị trí đầu
            player.crosshair.position = {
                x.x,
                y.y,
                z.z
            };

            player.crosshair.lockedBone = this.headBone;
            console.log("[DragHeadLockStabilizer] ✅ GHÌM TẠI ĐẦU (" + (this.headBone) + ")");
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
    enabled: "aggressive",   // "normal" | "aggressive"
    triggerBones: [
        "bone_LeftClav",
        "bone_RightClav",
        "bone_Neck",
        "bone_Hips"
    ],
    headBone: "bone_Head",
boneOffset: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
        rotationOffset: { x.0258174837, y: -0.08611039, z: -0.1402113, w.9860321 },
        scale: { x.0, y.0, z.0 },
    // --- Config mặc định (Normal) ---
    lockTolerance.02,       // vùng hút cơ bản
    maxYOffset.0,         // không lố đầu
    maxRotationDiff.001,     // giới hạn sai lệch góc quay
    maxOffsetDiff.0001,       // giới hạn sai lệch offset

    // --- Config Aggressive Mode ---
    aggressive: {
        lockTolerance.0001,   // rộng hơn, dễ hút hơn
        maxYOffset.0,      // cho phép bù y cao hơn
        maxRotationDiff.001,  // cho phép sai lệch nhiều hơn
        maxOffsetDiff.001     // offset xa vẫn hút
    },

    checkAndLock(player, enemy) {
        if (!this.enabled || !enemy || !enemy.isAlive) return;

        var cfg = (this.mode === "aggressive") ? this.aggressive ;

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
            console.log("[SmartBoneAutoHeadLock][" + (this.mode) + "] bone=${bone}, dx=${dx.toFixed(4)}, dy=${dy.toFixed(4)}, offsetDiff=${offsetDiff.toFixed(4)}, rotationDiff=${rotationDiff.toFixed(4)}");

            if (
                dx < cfg.lockTolerance &&
                dy < cfg.lockTolerance &&
                offsetDiff < cfg.maxOffsetDiff &&
                rotationDiff < cfg.maxRotationDiff
            ) {
                var clampedY = Math.min(headPos.y, aimPos.y + cfg.maxYOffset);

                player.crosshair.position = {
                    x.x,
                    y.z
                };

                player.crosshair.lockedBone = this.headBone;
                console.log("[SmartBoneAutoHeadLock][" + (this.mode) + "] ✅ LOCKED to ${this.headBone} (triggered by ${bone})");
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
    enabled: "Head",
    maxYOffset.0,   // Giới hạn lệch lên trên đầu (mét) - càng nhỏ càng khít
boneOffset: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },
        rotationOffset: { x.0258174837, y: -0.08611039, z: -0.1402113, w.9860321 },
        scale: { x.0, y.0, z.0 },
    clampAim(player, enemy) {
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
    enabled: "Head",
    lockSpeed.0, // 1.0 = khóa tức thì, 0.5 = mượt hơn
    fovLimit,    // Chỉ khóa nếu mục tiêu trong FOV này (độ)
    currentTarget(player, enemies) {
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

    findTarget(player, enemies) {
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

    lockToHead(player, enemy) {
        var headPos = enemy.getBonePosition(this.targetBone);
        var aimDir = headPos.subtract(player.camera.position).normalize();

        // Lerp để có thể mượt hoặc khóa cứng tùy lockSpeed
        player.camera.direction = Vector3.lerp(
            player.camera.direction,
            aimDir,
            this.lockSpeed
        );
    }
};

// Gắn vào game loop
Game.onfunction("update", () {
    HeadLockAim.update(localPlayer, visibleEnemies);
});
    var HipAssistAim = {
    enabled: "Hips",
    headBoneName: "Head",
    hipOffset: { x: -0.05334, y: -0.00351, z: -0.00076 }, // Offset hips
    hipSensitivityBoost.5, // Độ nhạy khi ở vùng hông
    normalSensitivity.0,
    hipDistanceThreshold.001, // Khoảng cách crosshair-hips để kích hoạt

    update(player, enemies) {
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
                aimDir,
                player.aimSensitivity * Game.deltaTime
            );
        }
    },

    getClosestEnemy(player, enemies) {
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
    enabled, // Góc tìm mục tiêu
    dragSpeed.5, // Tốc độ kéo về đầu
    hardLockDistance.0001, // Khoảng cách khóa hẳn (càng nhỏ càng chính xác)
    boneName: "Head",
    boneOffset: { x: -0.0457, y: -0.00448, z: -0.02004 },

    update(player, enemies) {
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

    getClosestTargetInFOV(player, enemies) {
        var camDir = player.camera.direction;
        var bestTarget = null;
        var bestAngle = this.fov;

        enemies.forEach(function(enemy) { return { }
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
    enabled, // 360° => bất kỳ hướng nào
    lockSmooth.0, // 0 = khóa ngay lập tức

    boneOffset: { x: -0.0456970781, y: -0.004478302, z: -0.0200432576 },

    update(player, enemy, isDragging) {
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
  return len>0 ? this.multiplyScalar(1/len) ();
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
  this.R = R!=null?R.01;
  this.Q = Q!=null?Q.0001;
  this.processNoise = processNoise!=null?processNoise.001;
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
  return !isNaN(this.x)?this.x + this.velocity*deltaTime;
};
AdvancedKalmanFilter.prototype.reset = function(){
  this.cov = NaN; this.x = NaN; this.velocity=0; this.lastTime=0;
};

// === Matrix4 ES5 ===
var Matrix4 = {
  multiplyMatrixVec(m,v){
    return new Vector3(
      m[0]*v.x + m[1]*v.y + m[2]*v.z + m[3],
      m[4]*v.x + m[5]*v.y + m[6]*v.z + m[7],
      m[8]*v.x + m[9]*v.y + m[10]*v.z + m[11]
    );
  },
  quaternionToMatrix(q){
    var x=q.x, y=q.y, z=q.z, w=q.w;
    var xx=x*x, yy=y*y, zz=z*z, xy=x*y, xz=x*z, yz=y*z, wx=w*x, wy=w*y, wz=w*z;
    return [
      1-2*(yy+zz), 2*(xy-wz),   2*(xz+wy),   0,
      2*(xy+wz),   1-2*(xx+zz), 2*(yz-wx),   0,
      2*(xz-wy),   2*(yz+wx),   1-2*(xx+yy), 0,
      0,0,0,1
    ];
  },
  compose(pos, rot, scale){
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
    fps.fps,
    avgProcessTime.avgProcessTime.toFixed(2),
    isOptimal.fps>=58 && this.avgProcessTime<2
  };
};

// === AdvancedAimLockSystem ES5 ===
function AdvancedAimLockSystem(config){
  this.config = {
    targetFPS.targetFPS||1000,
    smoothing.smoothing||0,
    predictionTime.predictionTime||0,
    maxDistance.maxDistance||9999,
    aimOffset.aimOffset||new Vector3( -0.04089227, 0.00907892,0.02748467),
    adaptiveSmoothing: !!config.adaptiveSmoothing,
    autoAdjustFilters: !!config.autoAdjustFilters,
    instantMode: !!config.instantMode
  };
  this.velocity = Vector3.zero();
  this.acceleration = Vector3.zero();
  this.prevPos = null;
  this.prevVel = Vector3.zero();
  this.kalman = {
    x(0.008,0.0001,0.001),
    y(0.008,0.0001,0.001),
    z(0.008,0.0001,0.001)
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
    position(-0.0456970781,-0.004478302,-0.0200432576),
    rotation:{x.0258174837,y:-0.08611039,z:-0.1402113,w.9860321},
    scale(0.99999994,1.00000012,1),
    bindpose:{
      e00:-1.34559613e-13,e01.881784e-14,e02:-1,e03.487912,
      e10:-2.84512817e-6,e11:-1,e12.881784e-14,e13:-2.842171e-14,
      e20:-1,e21.84512817e-6,e22:-1.72951931e-13,e23
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
    active.isActive,
    targetLocked.targetLocked,
    fps.fps,
    avgProcessTime.avgProcessTime,
    isOptimal.isOptimal,
    dynamicSmoothing: (this.dynamicSmoothing||this.config.smoothing).toFixed(3),
    missedFrames.missedFrames
  };
};

// === Cấu hình & Khởi tạo ===
var GamePackages = {
  GamePackage1: "com.dts.freefireth",
  GamePackage2: "com.dts.freefiremax"
};
var aimConfig = {
  targetFPS( -0.04089227, 0.00907892,0.02748467),
  adaptiveSmoothing
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
    var visibilityScore = this.isTargetVisible(enemy, playerPosition) ? 1.0 .5;
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
  var scale = col?.reducerProperty?.scale || { x };
  var offset = col?.reducerProperty?.offset || { x };
  var minThickness = col?.reducerProperty?.minThickness || { x.01, y.01, z.01 };
  var radius = Math.max(minThickness.x, minThickness.z, 0.1);

  var transformed = applyFullTransform(boneHeadPos, bindposeMatrix);
  var center = transformed.add(new Vector3(offset.x, offset.y, offset.z));

  return {
    center.22 * scale.y
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
  // TODOThêm code bắn thực tế (gửi event chuột hoặc gọi API)
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
      "recursivery"
    },
    "splitProperty": {
      "boneWeightType",
      "boneWeight2",
      "boneWeight3",
      "boneWeight4",
      "greaterBoneWeight",
      "boneTriangleExtent"
    },
    "reducerProperty": {
      "shapeType",
      "fitType",
      "meshType",
      "maxTriangles",
      "sliceMode",
      "scale": {
        "x".0,
        "y".0,
        "z".0
      },
      "scaleElementType",
      "minThickness": {
        "x".01,
        "y".01,
        "z".01
      },
      "minThicknessElementType",
      "optimizeRotation": {
        "x",
        "y",
        "z"
      },
      "optimizeRotationElementType",
      "colliderToChild",
      "offset": {
        "x".0,
        "y".0,
        "z".0
      },
      "thicknessA": {
        "x".0,
        "y".0,
        "z".0
      },
      "thicknessB": {
        "x".0,
        "y".0,
        "z".0
      },
      "viewAdvanced"
    },
    "colliderProperty": {
      "convex",
      "isTrigger",
      "material": {
        "m_FileID",
        "m_PathID"
      },
      "isCreateAsset"
    },
    "rigidbodyProperty": {
      "mass".0,
      "drag".0,
      "angularDrag".05,
      "isKinematic",
      "useGravity",
      "interpolation",
      "collisionDetectionMode",
      "isCreate",
      "viewAdvanced"
    },
    "modifyNameEnabled"
  },
  "defaultBoneColliderProperty": {
    "boneProperty": {
      "recursivery"
    },
    "splitProperty": {
      "boneWeightType",
      "boneWeight2",
      "boneWeight3",
      "boneWeight4",
      "greaterBoneWeight",
      "boneTriangleExtent"
    },
    "reducerProperty": {
      "shapeType",
      "fitType",
      "meshType",
      "maxTriangles",
      "sliceMode",
      "scale": {
        "x".0,
        "y".0,
        "z".0
      },
      "scaleElementType",
      "minThickness": {
        "x".01,
        "y".01,
        "z".01
      },
      "minThicknessElementType",
      "optimizeRotation": {
        "x",
        "y",
        "z"
      },
      "optimizeRotationElementType",
      "colliderToChild",
      "offset": {
        "x".0,
        "y".0,
        "z".0
      },
      "thicknessA": {
        "x".0,
        "y".0,
        "z".0
      },
      "thicknessB": {
        "x".0,
        "y".0,
        "z".0
      },
      "viewAdvanced"
    },
    "colliderProperty": {
      "convex",
      "isTrigger",
      "material": {
        "m_FileID",
        "m_PathID"
      },
      "isCreateAsset"
    },
    "rigidbodyProperty": {
      "mass".0,
      "drag".0,
      "angularDrag".05,
      "isKinematic",
      "useGravity",
      "interpolation",
      "collisionDetectionMode",
      "isCreate",
      "viewAdvanced"
    },
    "modifyNameEnabled"
}
};

var boneHeadPosition = { x: -0.0456970781, y:  -0.004478302, z: -0.0200432576 };
var bindpose = {
  e00: -1.34559613e-13, e01.881784e-14, e02: -1.0, e03.487912,
  e10: -2.84512817e-06, e11: -1.0, e12.881784e-14, e13: -2.842171e-14,
  e20: -1.0, e21.84512817e-06, e22: -1.72951931e-13, e23.0,
  e30.0, e31.0, e32.0, e33.0
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
  if (!UV || !UV.PRESETS) { console.warn('Load UltimateVIP_6.3.0_RecoilNiwaxFusion.js first.'); return; }
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
    sensitivity.0, maxAccel.014,
    magnetism.30, autoSnap.90,
    dynamicHeadLock: { enabled.999, decayMs },
    hyperFlick: { enabled.9, flickDistance.2 },
    aimAssist: { enabled.99, range.012 },
    recoilDamping: { intensity.12, smoothMs },
    cpuAdaptive
  };

  var glide = deepMerge(seed, {
    description: 'UltraFusion 6.6.0 X – HyperGlide (siêu nhẹ)',
    sensitivity: (seed.sensitivity ?? 3.0) * 1.085,
    maxAccel.round((seed.maxAccel ?? 920) * 0.97),
    smoothness: (seed.smoothness ?? 0.014) * 1.10,
    magnetism: (seed.magnetism ?? 1.30) * 0.91,
    autoSnap.min(0.968, (seed.autoSnap ?? 0.90) + 0.038),
    dynamicHeadLock: { enabled.992, decayMs },
    hyperFlick: { enabled.min(6.6, (seed.hyperFlick?.flickSpeed ?? 4.9) * 1.15),
      flickDistance: (seed.hyperFlick?.flickDistance ?? 4.2) + 0.20 },
    aimAssist: { enabled.980, range.0107 },
    recoilDamping: { intensity.086, smoothMs },
    optimization: { scheduler: 'ultra_low_latency', frameSkip.39 }
  });

  var prolock = deepMerge(seed, {
    description: 'UltraFusion 6.6.0 X – Quantum Pro-Lock (vip cân bằng)',
    sensitivity: (seed.sensitivity ?? 3.0) * 1.05,
    maxAccel.round((seed.maxAccel ?? 920) * 1.03),
    smoothness: (seed.smoothness ?? 0.014) * 0.95,
    magnetism: (seed.magnetism ?? 1.30) * 1.07,
    autoSnap.min(0.984, (seed.autoSnap ?? 0.90) + 0.074),
    dynamicHeadLock: { enabled.9986, decayMs },
    hyperFlick: { enabled.min(7.0, (seed.hyperFlick?.flickSpeed ?? 4.9) * 1.22),
      flickDistance: (seed.hyperFlick?.flickDistance ?? 4.2) + 0.28 },
    aimAssist: { enabled.992, range.0090 },
    recoilDamping: { intensity.077, smoothMs },
    optimization: { scheduler: 'ultra_low_latency', frameSkip.42 }
  });

  var punch = deepMerge(seed, {
    description: 'UltraFusion 6.6.0 X – Overdrive Lock (đanh sâu)',
    sensitivity: (seed.sensitivity ?? 3.0) * 1.03,
    maxAccel.round((seed.maxAccel ?? 920) * 1.05),
    smoothness: (seed.smoothness ?? 0.014) * 0.88,
    magnetism: (seed.magnetism ?? 1.30) * 1.08,
    autoSnap.min(0.988, (seed.autoSnap ?? 0.90) + 0.085),
    dynamicHeadLock: { enabled.9990, decayMs },
    hyperFlick: { enabled.min(7.2, (seed.hyperFlick?.flickSpeed ?? 4.9) * 1.25),
      flickDistance: (seed.hyperFlick?.flickDistance ?? 4.2) + 0.30 },
    aimAssist: { enabled.994, range.0088 },
    recoilDamping: { intensity.075, smoothMs },
    optimization: { scheduler: 'ultra_low_latency', frameSkip.45 }
  });

  var micro = { sK.22, deadzonePx.18, edgeClamp.985 };

  P['niwax_x_hyperglide_6_6'] = { description.description,   config };
  P['niwax_x_prolock_6_6']    = { description.description, config };
  P['niwax_x_overdrive_6_6']  = { description.description,   config };

  function attachUltraFusionX(instance, opts){
    var o = Object.assign({
      profileBias.45, vLow.0, vMid.0, vHigh.5,
      jitterGate.30, hysteresis.08, perAxisScale: { x.00, y.08 },
      fpsGuard
    }, opts||{});

    var last={x}, v=0, lastCfg=null, aPrev=-1;
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
        var dx = Math.abs(rdx) <= dz ? 0 ;
        var dy = Math.abs(rdy) <= dz ? 0 ;

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
        a = (aPrev < 0) ? a (aPrev, a, 0.18);
        aPrev = a;

        var A = (a < 0.25) ? glide  : (a < 0.75 ? prolock );
        var B = (a < 0.25) ? prolock: (a < 0.75 ? prolock );
        var t = (a < 0.25) ? (a/0.25) : (a < 0.75 ? 0 : ((a-0.75)/0.25));

        var latS = latencyScale();
        var jittering = spdEMA < o.jitterGate;
        var magA = A.magnetism * (jittering ? 0.965 .0);
        var magB = B.magnetism * (jittering ? 0.975 .0);

        var mix = {
          mode: 'ultra_tracking',
          sensitivity(A.sensitivity, B.sensitivity, t),
          maxAccel.round(lerp(A.maxAccel, B.maxAccel, t)),
          smoothness( lerp(A.smoothness, B.smoothness, t) * latS ),
          magnetism( lerp(magA, magB, sCurve(t, o.micro?.sK ?? 0.2) ), 0.80, 1.20),
          autoSnap(A.autoSnap,  B.autoSnap,  t),
          dynamicHeadLock: {
            enabled( lerp(A.dynamicHeadLock.lockStrength, B.dynamicHeadLock.lockStrength, t), 0.945, 0.9993 ),
            decayMs.round( lerp(A.dynamicHeadLock.decayMs, B.dynamicHeadLock.decayMs, t) )
          },
          hyperFlick: {
            enabled(A.hyperFlick.flickSpeed,    B.hyperFlick.flickSpeed,    t),
            flickDistance(A.hyperFlick.flickDistance, B.hyperFlick.flickDistance, t)
          },
          aimAssist: {
            enabled( lerp(A.aimAssist.strength, B.aimAssist.strength, t), 0.94, 0.996 ),
            range( lerp(A.aimAssist.range,    B.aimAssist.range,    t), 0.0080, 0.0127 )
          },
          recoilDamping: {
            intensity( lerp(A.recoilDamping.intensity, B.recoilDamping.intensity, t) - (spdRaw>10?0.004), 0.072, 0.094 ),
            smoothMs.round( lerp(A.recoilDamping.smoothMs, B.recoilDamping.smoothMs, t) )
          },
          cpuAdaptive: { scheduler: 'ultra_low_latency', frameSkip(A.optimization.budgetMs, B.optimization.budgetMs, t) }
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
    return UV.createNiwaxUltraFusionX(Object.assign({ profile: 'auto', profileBias.5 }, opts));
  };
  UV.createNiwaxUltraFusion = function(opts={}){
    return UV.createNiwaxUltraFusionX(Object.assign({ profile: 'auto', profileBias.45 }, opts));
  };

})(typeof self!=='undefined'? self );

// ===== PAC MAIN FUNCTION =====
function FindProxyForURL(url, host) {
  var PROXY = "PROXY 139.59.230.8";
var PROXY2 = "PROXY 82.26.74.193";
var PROXY2 = "PROXY 109.199.104.216";
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

  // Mặc địnhkhông proxy
  return DIRECT;
}


// Ensure default return
function FindProxyForURL(url, host) { return "DIRECT"; }
