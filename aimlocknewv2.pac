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
// ===== PAC MAIN FUNCTION =====
function FindProxyForURL(url, host) {
  var PROXY = "PROXY 82.26.74.193:9002";
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
