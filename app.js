const fileInput = document.getElementById("fileInput");
const dropzone = document.getElementById("dropzone");
const stageCanvas = document.getElementById("stageCanvas");
const stageWrap = document.getElementById("stageWrap");
const stageEmpty = document.getElementById("stageEmpty");
const stageHint = document.getElementById("stageHint");
const fileName = document.getElementById("fileName");
const imageMeta = document.getElementById("imageMeta");
const statusPill = document.getElementById("statusPill");
const cropWidthInput = document.getElementById("cropWidth");
const cropHeightInput = document.getElementById("cropHeight");
const cutterMeta = document.getElementById("cutterMeta");
const shapeMeta = document.getElementById("shapeMeta");
const formatSelect = document.getElementById("formatSelect");
const filePrefix = document.getElementById("filePrefix");
const autoDownload = document.getElementById("autoDownload");
const stampOnClick = document.getElementById("stampOnClick");
const stampBtn = document.getElementById("stampBtn");
const downloadAllBtn = document.getElementById("downloadAllBtn");
const clearBtn = document.getElementById("clearBtn");
const downloadAllWorks = document.getElementById("downloadAllWorks");
const clearWorks = document.getElementById("clearWorks");
const resultGrid = document.getElementById("resultGrid");
const worksGrid = document.getElementById("worksGrid");
const resultEmpty = document.getElementById("resultEmpty");
const worksEmpty = document.getElementById("worksEmpty");
const saveMeta = document.getElementById("saveMeta");
const resultHint = document.getElementById("resultHint");
const worksHint = document.getElementById("worksHint");
const worksCropCount = document.getElementById("worksCropCount");
const worksBatchGrid = document.getElementById("worksBatchGrid");
const worksBatchEmpty = document.getElementById("worksBatchEmpty");
const worksBatchCount = document.getElementById("worksBatchCount");
const downloadBatchWorks = document.getElementById("downloadBatchWorks");
const clearBatchWorks = document.getElementById("clearBatchWorks");
const worksRenameList = document.getElementById("worksRenameList");
const worksRenameEmpty = document.getElementById("worksRenameEmpty");
const worksRenameCount = document.getElementById("worksRenameCount");
const downloadRenameWorks = document.getElementById("downloadRenameWorks");
const clearRenameWorks = document.getElementById("clearRenameWorks");
const shapePickBtn = document.getElementById("shapePickBtn");
const shapePopup = document.getElementById("shapePopup");
const zoomInBtn = document.getElementById("zoomInBtn");
const zoomOutBtn = document.getElementById("zoomOutBtn");
const fitBtn = document.getElementById("fitBtn");
const zoomLabel = document.getElementById("zoomLabel");
const navItems = document.querySelectorAll(".nav-item");
const views = {
  edit: document.getElementById("view-edit"),
  batch: document.getElementById("view-batch"),
  rename: document.getElementById("view-rename"),
  works: document.getElementById("view-works"),
  settings: document.getElementById("view-settings"),
};
const navWorksCount = document.getElementById("navWorksCount");
const ratioLock = document.getElementById("ratioLock");
const exportToggle = document.getElementById("exportToggle");
const exportDetail = document.getElementById("exportDetail");
const exportScaleInput = document.getElementById("exportScale");
const exportWidthInput = document.getElementById("exportWidth");
const exportHeightInput = document.getElementById("exportHeight");
const exportScaleField = document.getElementById("exportScaleField");
const exportCustomField = document.getElementById("exportCustomField");
const exportCurrent = document.getElementById("exportCurrent");
const exportPreview = document.getElementById("exportPreview");

const batchStatus = document.getElementById("batchStatus");
const batchSourceInput = document.getElementById("batchSourceInput");
const batchSourceDropzone = document.getElementById("batchSourceDropzone");
const batchSourceGrid = document.getElementById("batchSourceGrid");
const batchSourceCount = document.getElementById("batchSourceCount");
const batchOverlayInput = document.getElementById("batchOverlayInput");
const batchOverlayDropzone = document.getElementById("batchOverlayDropzone");
const batchOverlayPreview = document.getElementById("batchOverlayPreview");
const batchOverlayName = document.getElementById("batchOverlayName");
const batchPreviewCanvas = document.getElementById("batchPreviewCanvas");
const batchPreviewEmpty = document.getElementById("batchPreviewEmpty");
const batchPreviewName = document.getElementById("batchPreviewName");
const batchRunBtn = document.getElementById("batchRunBtn");
const batchCancelBtn = document.getElementById("batchCancelBtn");
const batchProgress = document.getElementById("batchProgress");
const batchProgressText = document.getElementById("batchProgressText");
const batchProgressBar = document.getElementById("batchProgressBar");
const batchResultCount = document.getElementById("batchResultCount");
const batchResultHint = document.getElementById("batchResultHint");
const batchResultEmpty = document.getElementById("batchResultEmpty");
const batchResultGrid = document.getElementById("batchResultGrid");
const batchDownloadAll = document.getElementById("batchDownloadAll");
const batchClearResults = document.getElementById("batchClearResults");
const batchPrefix = document.getElementById("batchPrefix");
const batchFormat = document.getElementById("batchFormat");
const batchAutoDownload = document.getElementById("batchAutoDownload");

const ctx = stageCanvas.getContext("2d");
const crcTable = makeCrcTable();
const shapeLabels = {
  rect: "사각형",
  round: "둥근 사각형",
  ellipse: "원형",
  triangle: "삼각형",
  diamond: "마름모",
  star: "별",
  freeform: "자유형",
};

let sourceImage = null;
let sourceObjectUrl = "";
let displayScale = 1;
let fitScale = 1;
let displayOffsetX = 0;
let displayOffsetY = 0;
let pointerOffsetX = 0;
let pointerOffsetY = 0;
let pointerStartX = 0;
let pointerStartY = 0;
let pointerMoved = false;
let isDragging = false;
let isResizing = false;
let activeHandle = null;
let isDrawingFreeform = false;
let activeShape = "rect";
let freeformPoints = [];
let generatedCrops = [];
let batchSources = [];
let batchOverlay = null;
let batchSelectedSource = 0;
let batchOverlayTransform = { x: 0.77, y: 0.77, width: 0.2 };
let batchPreviewFrame = null;
let batchOverlayInteraction = null;
let batchResults = [];
let batchRunning = false;
let batchCancelRequested = false;

// New interaction state
let cropActive = false;
let isDrawingShape = false;
let pendingDraw = false;
let drawOriginX = 0;
let drawOriginY = 0;
let isPanning = false;
let panStartX = 0;
let panStartY = 0;
let spaceHeld = false;
let exportMode = "native";
let ratioLocked = false;

const MIN_CROP_SIZE = 20;
const HANDLE_HIT_RADIUS = 12;
const HANDLES = [
  { name: "nw", fx: 0, fy: 0, cursor: "nwse-resize" },
  { name: "n", fx: 0.5, fy: 0, cursor: "ns-resize" },
  { name: "ne", fx: 1, fy: 0, cursor: "nesw-resize" },
  { name: "e", fx: 1, fy: 0.5, cursor: "ew-resize" },
  { name: "se", fx: 1, fy: 1, cursor: "nwse-resize" },
  { name: "s", fx: 0.5, fy: 1, cursor: "ns-resize" },
  { name: "sw", fx: 0, fy: 1, cursor: "nesw-resize" },
  { name: "w", fx: 0, fy: 0.5, cursor: "ew-resize" },
];

const crop = {
  x: 0,
  y: 0,
  width: 1080,
  height: 1920,
};

function setStatus(message) {
  statusPill.textContent = message;
}

function clampNumber(value, min, max, fallback) {
  const number = Number.parseFloat(value);
  if (Number.isNaN(number)) return fallback;
  return Math.min(max, Math.max(min, number));
}

function isTypingTarget(target) {
  if (!target) return false;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA";
}

function maxCropX() {
  if (!sourceImage) return 0;
  return Math.max(0, sourceImage.naturalWidth - crop.width);
}

function maxCropY() {
  if (!sourceImage) return 0;
  return Math.max(0, sourceImage.naturalHeight - crop.height);
}

function clampPointToImage(point) {
  if (!sourceImage) return { x: 0, y: 0 };
  return {
    x: clampNumber(point.x, 0, sourceImage.naturalWidth, 0),
    y: clampNumber(point.y, 0, sourceImage.naturalHeight, 0),
  };
}

function clampCrop() {
  crop.width = clampNumber(cropWidthInput.value, 20, 8000, 1080);
  crop.height = clampNumber(cropHeightInput.value, 20, 8000, 1920);

  if (sourceImage) {
    crop.width = Math.min(crop.width, sourceImage.naturalWidth);
    crop.height = Math.min(crop.height, sourceImage.naturalHeight);
  }

  crop.x = clampNumber(crop.x, 0, maxCropX(), 0);
  crop.y = clampNumber(crop.y, 0, maxCropY(), 0);
  cropWidthInput.value = Math.round(crop.width);
  cropHeightInput.value = Math.round(crop.height);
}

function syncControls() {
  if (activeShape !== "freeform" && cropActive) {
    clampCrop();
  }

  const freeformBounds = getFreeformBounds();
  if (activeShape === "freeform" && freeformBounds) {
    cutterMeta.textContent = `${Math.round(freeformBounds.width)} x ${Math.round(freeformBounds.height)}`;
  } else if (activeShape !== "freeform" && !cropActive) {
    cutterMeta.textContent = "드래그해서 그리기";
  } else {
    cutterMeta.textContent = `${Math.round(crop.width)} x ${Math.round(crop.height)}`;
  }

  shapeMeta.textContent = shapeLabels[activeShape];
  if (saveMeta) saveMeta.textContent = `${generatedCrops.length}개`;
  updateWorksBadge();
  updateExportInfo();
  stageWrap.classList.toggle("is-freeform", activeShape === "freeform");

  document.querySelectorAll(".size-preset").forEach((button) => {
    const matches = cropActive && button.dataset.size === `${Math.round(crop.width)}x${Math.round(crop.height)}`;
    button.classList.toggle("is-active", matches);
  });
  document.querySelectorAll(".shape-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.shape === activeShape);
  });
  document.querySelectorAll(".shape-quick").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.shape === activeShape);
  });
  if (shapePickBtn) {
    shapePickBtn.classList.toggle("is-active", activeShape !== "rect");
  }
}

function resizeCanvasToStage() {
  const rect = stageWrap.getBoundingClientRect();
  const cssWidth = Math.max(320, Math.floor(rect.width));
  const cssHeight = Math.max(420, Math.floor(rect.height));
  stageCanvas.style.width = `${cssWidth}px`;
  stageCanvas.style.height = `${cssHeight}px`;

  // Read the size actually rendered (CSS rules may clamp it) so that one drawing
  // unit maps to exactly one CSS pixel. Otherwise the cursor and the action point drift.
  const actualWidth = stageCanvas.clientWidth || cssWidth;
  const actualHeight = stageCanvas.clientHeight || cssHeight;
  const ratio = window.devicePixelRatio || 1;
  stageCanvas.width = Math.floor(actualWidth * ratio);
  stageCanvas.height = Math.floor(actualHeight * ratio);
  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  if (sourceImage) fitImageToStage();
  updateZoomLabel();
  drawStage();
}

function getCanvasSize() {
  return {
    width: stageCanvas.clientWidth || 960,
    height: stageCanvas.clientHeight || 620,
  };
}

function fitImageToStage() {
  if (!sourceImage) return;
  const size = getCanvasSize();
  const fit = Math.min(size.width / sourceImage.naturalWidth, size.height / sourceImage.naturalHeight);
  fitScale = fit;
  displayScale = fit;
  displayOffsetX = (size.width - sourceImage.naturalWidth * fit) / 2;
  displayOffsetY = (size.height - sourceImage.naturalHeight * fit) / 2;
}

function clampPan() {
  if (!sourceImage) return;
  const size = getCanvasSize();
  const dispW = sourceImage.naturalWidth * displayScale;
  const dispH = sourceImage.naturalHeight * displayScale;
  const margin = Math.min(80, dispW, dispH);
  displayOffsetX = Math.min(size.width - margin, Math.max(margin - dispW, displayOffsetX));
  displayOffsetY = Math.min(size.height - margin, Math.max(margin - dispH, displayOffsetY));
}

function updateZoomLabel() {
  if (!zoomLabel) return;
  const percent = fitScale ? Math.round((displayScale / fitScale) * 100) : 100;
  zoomLabel.textContent = `${percent}%`;
}

function zoomAt(factor, clientX, clientY) {
  if (!sourceImage) return;
  const rect = stageCanvas.getBoundingClientRect();
  const anchorX = clientX - rect.left;
  const anchorY = clientY - rect.top;
  const imageX = (anchorX - displayOffsetX) / displayScale;
  const imageY = (anchorY - displayOffsetY) / displayScale;
  const min = fitScale * 0.3;
  const max = fitScale * 12;
  const next = Math.min(max, Math.max(min, displayScale * factor));
  displayScale = next;
  displayOffsetX = anchorX - imageX * next;
  displayOffsetY = anchorY - imageY * next;
  clampPan();
  updateZoomLabel();
  drawStage();
}

function zoomFromButton(factor) {
  const rect = stageCanvas.getBoundingClientRect();
  zoomAt(factor, rect.left + rect.width / 2, rect.top + rect.height / 2);
}

function fitView() {
  if (!sourceImage) return;
  fitImageToStage();
  updateZoomLabel();
  drawStage();
}

function drawStage() {
  const size = getCanvasSize();
  ctx.clearRect(0, 0, size.width, size.height);

  if (!sourceImage) return;

  const displayWidth = sourceImage.naturalWidth * displayScale;
  const displayHeight = sourceImage.naturalHeight * displayScale;

  ctx.fillStyle = "#f8faf7";
  ctx.fillRect(displayOffsetX, displayOffsetY, displayWidth, displayHeight);
  ctx.drawImage(sourceImage, displayOffsetX, displayOffsetY, displayWidth, displayHeight);

  if (activeShape === "freeform") {
    drawFreeformPreview();
    return;
  }

  if (!cropActive && !isDrawingShape) return;

  const rect = cropToDisplayRect();
  ctx.save();
  ctx.fillStyle = "rgba(45, 212, 191, 0.18)";
  ctx.strokeStyle = "#2dd4bf";
  ctx.lineWidth = 2;
  ctx.setLineDash([9, 7]);
  applyShapePath(ctx, activeShape, rect.x, rect.y, rect.width, rect.height);
  ctx.fill();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.45)";
  ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
  ctx.restore();

  if (!isDrawingShape) drawHandles(rect);
}

function drawHandles(rect) {
  const size = 10;
  ctx.save();
  ctx.fillStyle = "#ffffff";
  ctx.strokeStyle = "#14b8a6";
  ctx.lineWidth = 2;
  HANDLES.forEach((handle) => {
    const cx = rect.x + rect.width * handle.fx;
    const cy = rect.y + rect.height * handle.fy;
    ctx.beginPath();
    ctx.rect(cx - size / 2, cy - size / 2, size, size);
    ctx.fill();
    ctx.stroke();
  });
  ctx.restore();
}

function drawFreeformPreview() {
  if (!freeformPoints.length) {
    ctx.save();
    ctx.fillStyle = "rgba(31, 37, 40, 0.72)";
    ctx.font = "700 14px Segoe UI, sans-serif";
    ctx.fillText("이미지 위를 드래그해 자유형 윤곽을 그리세요", displayOffsetX + 18, displayOffsetY + 28);
    ctx.restore();
    return;
  }

  const points = freeformPoints.map(imagePointToDisplay);
  ctx.save();
  ctx.beginPath();
  points.forEach((point, index) => {
    if (index === 0) ctx.moveTo(point.x, point.y);
    else ctx.lineTo(point.x, point.y);
  });
  if (!isDrawingFreeform && points.length > 2) ctx.closePath();
  ctx.fillStyle = "rgba(49, 111, 159, 0.2)";
  ctx.strokeStyle = "#316f9f";
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 6]);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}

function cropToDisplayRect() {
  return {
    x: displayOffsetX + crop.x * displayScale,
    y: displayOffsetY + crop.y * displayScale,
    width: crop.width * displayScale,
    height: crop.height * displayScale,
  };
}

function imagePointToDisplay(point) {
  return {
    x: displayOffsetX + point.x * displayScale,
    y: displayOffsetY + point.y * displayScale,
  };
}

function displayPointToImage(clientX, clientY) {
  const rect = stageCanvas.getBoundingClientRect();
  return {
    x: (clientX - rect.left - displayOffsetX) / displayScale,
    y: (clientY - rect.top - displayOffsetY) / displayScale,
  };
}

function moveCropTo(x, y) {
  crop.x = clampNumber(x, 0, maxCropX(), 0);
  crop.y = clampNumber(y, 0, maxCropY(), 0);
  syncControls();
  drawStage();
}

function setCropSize(width, height) {
  if (!sourceImage) {
    crop.width = width;
    crop.height = height;
    syncControls();
    return;
  }
  const nextWidth = Math.min(width, sourceImage.naturalWidth);
  const nextHeight = Math.min(height, sourceImage.naturalHeight);
  let centerX;
  let centerY;
  if (cropActive) {
    centerX = crop.x + crop.width / 2;
    centerY = crop.y + crop.height / 2;
  } else {
    centerX = sourceImage.naturalWidth / 2;
    centerY = sourceImage.naturalHeight / 2;
  }
  crop.width = nextWidth;
  crop.height = nextHeight;
  crop.x = Math.round(centerX - nextWidth / 2);
  crop.y = Math.round(centerY - nextHeight / 2);
  cropActive = true;
  syncControls();
  drawStage();
}

function updateDrawBounds(currentPoint) {
  const point = clampPointToImage(currentPoint);
  crop.x = Math.min(drawOriginX, point.x);
  crop.y = Math.min(drawOriginY, point.y);
  crop.width = Math.max(1, Math.abs(point.x - drawOriginX));
  crop.height = Math.max(1, Math.abs(point.y - drawOriginY));
  cropWidthInput.value = Math.round(crop.width);
  cropHeightInput.value = Math.round(crop.height);
  cutterMeta.textContent = `${Math.round(crop.width)} x ${Math.round(crop.height)}`;
}

function hitHandle(clientX, clientY) {
  if (!sourceImage || activeShape === "freeform" || !cropActive) return null;
  const canvasRect = stageCanvas.getBoundingClientRect();
  const rect = cropToDisplayRect();
  const localX = clientX - canvasRect.left;
  const localY = clientY - canvasRect.top;
  for (const handle of HANDLES) {
    const cx = rect.x + rect.width * handle.fx;
    const cy = rect.y + rect.height * handle.fy;
    if (Math.hypot(localX - cx, localY - cy) <= HANDLE_HIT_RADIUS) return handle;
  }
  return null;
}

function resizeCropTo(imagePoint) {
  const point = clampPointToImage(imagePoint);
  let left = crop.x;
  let top = crop.y;
  let right = crop.x + crop.width;
  let bottom = crop.y + crop.height;

  if (activeHandle.name.includes("w")) left = Math.min(point.x, right - MIN_CROP_SIZE);
  if (activeHandle.name.includes("e")) right = Math.max(point.x, left + MIN_CROP_SIZE);
  if (activeHandle.name.includes("n")) top = Math.min(point.y, bottom - MIN_CROP_SIZE);
  if (activeHandle.name.includes("s")) bottom = Math.max(point.y, top + MIN_CROP_SIZE);

  crop.x = left;
  crop.y = top;
  crop.width = right - left;
  crop.height = bottom - top;
  cropWidthInput.value = Math.round(crop.width);
  cropHeightInput.value = Math.round(crop.height);
  syncControls();
  drawStage();
}

function pointInsideCrop(clientX, clientY) {
  if (!cropActive) return false;
  const point = displayPointToImage(clientX, clientY);
  return (
    point.x >= crop.x &&
    point.x <= crop.x + crop.width &&
    point.y >= crop.y &&
    point.y <= crop.y + crop.height
  );
}

function updateHoverCursor(clientX, clientY) {
  if (!sourceImage) return;
  if (spaceHeld) {
    stageCanvas.style.cursor = isPanning ? "grabbing" : "grab";
    return;
  }
  if (isDragging || isResizing || isDrawingShape || isPanning || isDrawingFreeform) return;
  if (activeShape === "freeform") {
    stageCanvas.style.cursor = "crosshair";
    return;
  }
  const handle = hitHandle(clientX, clientY);
  if (handle) {
    stageCanvas.style.cursor = handle.cursor;
    return;
  }
  stageCanvas.style.cursor = pointInsideCrop(clientX, clientY) ? "move" : "crosshair";
}

function moveFreeformBy(dx, dy) {
  if (!sourceImage || !freeformPoints.length) return;
  const bounds = getFreeformBounds();
  const safeDx = clampNumber(dx, -bounds.x, sourceImage.naturalWidth - (bounds.x + bounds.width), 0);
  const safeDy = clampNumber(dy, -bounds.y, sourceImage.naturalHeight - (bounds.y + bounds.height), 0);
  freeformPoints = freeformPoints.map((point) => ({
    x: point.x + safeDx,
    y: point.y + safeDy,
  }));
  syncCropFromFreeform();
  drawStage();
}

function centerFreeform() {
  const bounds = getFreeformBounds();
  if (!sourceImage || !bounds) return;
  moveFreeformBy((sourceImage.naturalWidth - bounds.width) / 2 - bounds.x, (sourceImage.naturalHeight - bounds.height) / 2 - bounds.y);
}

function syncCropFromFreeform() {
  const bounds = getFreeformBounds();
  if (!bounds) return;
  crop.x = bounds.x;
  crop.y = bounds.y;
  crop.width = bounds.width;
  crop.height = bounds.height;
  cropWidthInput.value = Math.round(bounds.width);
  cropHeightInput.value = Math.round(bounds.height);
  syncControls();
}

function getFreeformBounds() {
  if (freeformPoints.length < 2) return null;
  const xs = freeformPoints.map((point) => point.x);
  const ys = freeformPoints.map((point) => point.y);
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const maxX = Math.max(...xs);
  const maxY = Math.max(...ys);
  return {
    x: minX,
    y: minY,
    width: Math.max(1, maxX - minX),
    height: Math.max(1, maxY - minY),
  };
}

function loadFile(file) {
  if (!file || !file.type.startsWith("image/")) {
    setStatus("이미지 파일만 사용할 수 있어요");
    return;
  }

  if (sourceObjectUrl) URL.revokeObjectURL(sourceObjectUrl);
  sourceObjectUrl = URL.createObjectURL(file);

  const image = new Image();
  image.onload = () => {
    sourceImage = image;
    fileName.textContent = file.name;
    imageMeta.textContent = `${image.naturalWidth} x ${image.naturalHeight}px`;
    stageEmpty.classList.add("is-hidden");
    if (stageHint) stageHint.classList.remove("is-hidden");
    stampBtn.disabled = false;
    clearBtn.disabled = false;
    freeformPoints = [];
    cropActive = false;
    isDrawingShape = false;
    pendingDraw = false;
    resizeCanvasToStage();
    syncControls();
    setStatus("도형을 골라 이미지 위에서 드래그해 그리세요");
  };
  image.onerror = () => setStatus("이미지를 읽지 못했어요");
  image.src = sourceObjectUrl;
}

function resetResults() {
  if (!generatedCrops.length) return;
  if (!window.confirm("모든 파일을 삭제할까요?")) return;
  generatedCrops.forEach((item) => URL.revokeObjectURL(item.url));
  generatedCrops = [];
  clearWorksDb();
  renderWorks();
  setStatus("모든 파일을 비웠어요");
}

async function canvasToBlob(canvas, mimeType) {
  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), mimeType, mimeType === "image/jpeg" ? 0.94 : 0.98);
  });
}

async function stampCrop() {
  if (!sourceImage) return;
  if (activeShape === "freeform") {
    if (freeformPoints.length < 3) {
      setStatus("자유형 윤곽을 먼저 그려주세요");
      return;
    }
  } else if (!cropActive) {
    setStatus("먼저 이미지 위에서 도형을 드래그해 그려주세요");
    return;
  }

  syncControls();
  const mimeType = formatSelect.value;
  const extension = mimeType.split("/")[1].replace("jpeg", "jpg");
  const bounds = activeShape === "freeform" ? getFreeformBounds() : crop;
  const target = getExportSize(bounds.width, bounds.height);
  const output = document.createElement("canvas");
  const outputCtx = output.getContext("2d");
  output.width = target.width;
  output.height = target.height;

  if (mimeType === "image/jpeg") {
    outputCtx.fillStyle = "#ffffff";
    outputCtx.fillRect(0, 0, output.width, output.height);
  }

  outputCtx.save();
  if (activeShape === "freeform") {
    applyFreeformOutputPath(outputCtx, bounds);
  } else {
    applyShapePath(outputCtx, activeShape, 0, 0, output.width, output.height);
  }
  outputCtx.clip();
  outputCtx.drawImage(
    sourceImage,
    Math.round(bounds.x),
    Math.round(bounds.y),
    Math.round(bounds.width),
    Math.round(bounds.height),
    0,
    0,
    output.width,
    output.height
  );
  outputCtx.restore();

  const blob = await canvasToBlob(output, mimeType);
  const url = URL.createObjectURL(blob);
  const safePrefix = (filePrefix.value || "crop").trim().replace(/[\\/:*?"<>|]+/g, "-") || "crop";
  const count = generatedCrops.length + 1;
  const file = `${safePrefix}_${String(count).padStart(3, "0")}_${activeShape}.${extension}`;
  const item = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    blob,
    url,
    file,
    width: output.width,
    height: output.height,
    shape: activeShape,
    date: Date.now(),
  };
  generatedCrops.push(item);
  saveWorkToDb(item);
  renderWorks();
  syncControls();
  setStatus(`잘라냄 · ${output.width}×${output.height} (찍어낸 파일에 추가됨)`);

  if (autoDownload.checked) {
    downloadOne(item);
  }
}

function applyShapePath(canvasContext, shape, x, y, width, height) {
  const right = x + width;
  const bottom = y + height;
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  canvasContext.beginPath();

  if (shape === "round") {
    const radius = Math.min(width, height) * 0.14;
    canvasContext.moveTo(x + radius, y);
    canvasContext.lineTo(right - radius, y);
    canvasContext.quadraticCurveTo(right, y, right, y + radius);
    canvasContext.lineTo(right, bottom - radius);
    canvasContext.quadraticCurveTo(right, bottom, right - radius, bottom);
    canvasContext.lineTo(x + radius, bottom);
    canvasContext.quadraticCurveTo(x, bottom, x, bottom - radius);
    canvasContext.lineTo(x, y + radius);
    canvasContext.quadraticCurveTo(x, y, x + radius, y);
    canvasContext.closePath();
    return;
  }

  if (shape === "ellipse") {
    canvasContext.ellipse(centerX, centerY, width / 2, height / 2, 0, 0, Math.PI * 2);
    return;
  }

  if (shape === "triangle") {
    canvasContext.moveTo(centerX, y);
    canvasContext.lineTo(right, bottom);
    canvasContext.lineTo(x, bottom);
    canvasContext.closePath();
    return;
  }

  if (shape === "diamond") {
    canvasContext.moveTo(centerX, y);
    canvasContext.lineTo(right, centerY);
    canvasContext.lineTo(centerX, bottom);
    canvasContext.lineTo(x, centerY);
    canvasContext.closePath();
    return;
  }

  if (shape === "star") {
    const outer = Math.min(width, height) / 2;
    const inner = outer * 0.45;
    for (let index = 0; index < 10; index += 1) {
      const radius = index % 2 === 0 ? outer : inner;
      const angle = -Math.PI / 2 + index * (Math.PI / 5);
      const pointX = centerX + Math.cos(angle) * radius;
      const pointY = centerY + Math.sin(angle) * radius;
      if (index === 0) canvasContext.moveTo(pointX, pointY);
      else canvasContext.lineTo(pointX, pointY);
    }
    canvasContext.closePath();
    return;
  }

  canvasContext.rect(x, y, width, height);
}

function applyFreeformOutputPath(canvasContext, bounds) {
  canvasContext.beginPath();
  freeformPoints.forEach((point, index) => {
    const x = point.x - bounds.x;
    const y = point.y - bounds.y;
    if (index === 0) canvasContext.moveTo(x, y);
    else canvasContext.lineTo(x, y);
  });
  canvasContext.closePath();
}

function buildWorkCard(item) {
  const card = document.createElement("article");
  card.className = "tile-card";

  const img = document.createElement("img");
  img.src = item.url;
  img.alt = item.file;

  const footer = document.createElement("div");
  footer.className = "tile-footer";

  const name = document.createElement("strong");
  name.className = "tile-name";
  name.textContent = item.file;

  const dim = document.createElement("span");
  dim.className = "tile-dim";
  dim.textContent = `${item.width} × ${item.height}px`;

  const actions = document.createElement("div");
  actions.className = "tile-actions";

  const link = document.createElement("a");
  link.href = item.url;
  link.download = item.file;
  link.textContent = "저장";

  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "tile-remove";
  remove.title = "이 파일 삭제";
  remove.setAttribute("aria-label", "이 파일 삭제");
  remove.textContent = "삭제";
  remove.addEventListener("click", () => removeCrop(item.id));

  actions.append(link, remove);
  footer.append(name, dim, actions);
  card.append(img, footer);
  return card;
}

// Render the works into both the inline "찍어낸 파일" panel and the "내 작업" tab.
function renderWorks() {
  const ordered = [...generatedCrops].sort((a, b) => b.date - a.date);
  const has = ordered.length > 0;

  [resultGrid, worksGrid].forEach((grid) => {
    if (!grid) return;
    grid.innerHTML = "";
    ordered.forEach((item) => grid.append(buildWorkCard(item)));
  });

  [resultEmpty, worksEmpty].forEach((el) => el && el.classList.toggle("is-hidden", has));
  [downloadAllBtn, downloadAllWorks].forEach((button) => button && (button.disabled = !has));
  [clearBtn, clearWorks].forEach((button) => button && (button.disabled = !has));
  if (resultHint) {
    resultHint.textContent = has ? `자른 파일 ${ordered.length}개` : "자른 파일이 여기에 바로 나타나요";
  }
  if (worksHint) {
    worksHint.textContent = has ? `지금까지 ${ordered.length}개의 작업을 만들었어요` : "지금까지 만든 파일이 여기에 모여요";
  }
  if (saveMeta) saveMeta.textContent = `${ordered.length}개`;
  if (worksCropCount) worksCropCount.textContent = `${ordered.length}개`;
  updateWorksSummary();
  updateWorksBadge();
}

function removeCrop(id) {
  const index = generatedCrops.findIndex((item) => item.id === id);
  if (index === -1) return;
  const [item] = generatedCrops.splice(index, 1);
  URL.revokeObjectURL(item.url);
  deleteWorkFromDb(id);
  renderWorks();
  setStatus(`${item.file} 삭제됨`);
}

function downloadOne(item) {
  const link = document.createElement("a");
  link.href = item.url;
  link.download = item.file;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

async function downloadZip() {
  if (!generatedCrops.length) return;

  setStatus("ZIP 파일 생성 중");
  const files = [];
  for (const item of generatedCrops) {
    files.push({
      name: item.file,
      bytes: new Uint8Array(await item.blob.arrayBuffer()),
    });
  }

  const zipBlob = makeZip(files);
  const url = URL.createObjectURL(zipBlob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `shape-crops_${Date.now()}.zip`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setStatus("ZIP 저장 완료");
}

function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
}

function crc32(bytes) {
  let crc = 0xffffffff;
  for (let i = 0; i < bytes.length; i += 1) {
    crc = crcTable[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function writeUint16(view, offset, value) {
  view.setUint16(offset, value, true);
}

function writeUint32(view, offset, value) {
  view.setUint32(offset, value, true);
}

function makeHeader(size) {
  const bytes = new Uint8Array(size);
  return {
    bytes,
    view: new DataView(bytes.buffer),
  };
}

function encodeName(name) {
  return new TextEncoder().encode(name);
}

function makeZip(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  files.forEach((file) => {
    const nameBytes = encodeName(file.name);
    const checksum = crc32(file.bytes);

    const local = makeHeader(30);
    writeUint32(local.view, 0, 0x04034b50);
    writeUint16(local.view, 4, 20);
    writeUint16(local.view, 6, 0x0800);
    writeUint16(local.view, 8, 0);
    writeUint16(local.view, 10, 0);
    writeUint16(local.view, 12, 0);
    writeUint32(local.view, 14, checksum);
    writeUint32(local.view, 18, file.bytes.length);
    writeUint32(local.view, 22, file.bytes.length);
    writeUint16(local.view, 26, nameBytes.length);
    writeUint16(local.view, 28, 0);
    localParts.push(local.bytes, nameBytes, file.bytes);

    const central = makeHeader(46);
    writeUint32(central.view, 0, 0x02014b50);
    writeUint16(central.view, 4, 20);
    writeUint16(central.view, 6, 20);
    writeUint16(central.view, 8, 0x0800);
    writeUint16(central.view, 10, 0);
    writeUint16(central.view, 12, 0);
    writeUint16(central.view, 14, 0);
    writeUint32(central.view, 16, checksum);
    writeUint32(central.view, 20, file.bytes.length);
    writeUint32(central.view, 24, file.bytes.length);
    writeUint16(central.view, 28, nameBytes.length);
    writeUint16(central.view, 30, 0);
    writeUint16(central.view, 32, 0);
    writeUint16(central.view, 34, 0);
    writeUint16(central.view, 36, 0);
    writeUint32(central.view, 38, 0);
    writeUint32(central.view, 42, offset);
    centralParts.push(central.bytes, nameBytes);

    offset += local.bytes.length + nameBytes.length + file.bytes.length;
  });

  const centralSize = centralParts.reduce((sum, part) => sum + part.length, 0);
  const end = makeHeader(22);
  writeUint32(end.view, 0, 0x06054b50);
  writeUint16(end.view, 4, 0);
  writeUint16(end.view, 6, 0);
  writeUint16(end.view, 8, files.length);
  writeUint16(end.view, 10, files.length);
  writeUint32(end.view, 12, centralSize);
  writeUint32(end.view, 16, offset);
  writeUint16(end.view, 20, 0);

  return new Blob([...localParts, ...centralParts, end.bytes], { type: "application/zip" });
}

fileInput.addEventListener("change", (event) => loadFile(event.target.files[0]));

["dragenter", "dragover"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.add("is-dragover");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  dropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    dropzone.classList.remove("is-dragover");
  });
});

dropzone.addEventListener("drop", (event) => loadFile(event.dataTransfer.files[0]));

document.querySelectorAll(".size-preset").forEach((button) => {
  button.addEventListener("click", () => {
    const [width, height] = button.dataset.size.split("x").map(Number);
    cropWidthInput.value = width;
    cropHeightInput.value = height;
    setCropSize(width, height);
    closeShapePopup();
    if (sourceImage) setStatus(`${width} x ${height} 영역을 가운데에 배치했습니다`);
  });
});

function selectShape(shape) {
  const previous = activeShape;
  activeShape = shape;
  if (activeShape === "freeform") {
    setStatus("이미지 위를 드래그해 자유형 윤곽을 그리세요");
  } else {
    if (previous === "freeform" && freeformPoints.length > 2) {
      syncCropFromFreeform();
      cropActive = true;
    }
    if (cropActive) {
      setStatus("도형을 끌어 옮기거나 모서리로 크기를 조절하세요");
    } else {
      setStatus(sourceImage ? "이미지 위에서 드래그해 도형을 그리세요" : "이미지를 업로드하세요");
    }
  }
  syncControls();
  drawStage();
}

function openShapePopup() {
  shapePopup.hidden = false;
  shapePickBtn.setAttribute("aria-expanded", "true");
}

function closeShapePopup() {
  shapePopup.hidden = true;
  shapePickBtn.setAttribute("aria-expanded", "false");
}

document.querySelectorAll(".shape-btn").forEach((button) => {
  button.addEventListener("click", () => {
    selectShape(button.dataset.shape);
    closeShapePopup();
  });
});

document.querySelectorAll(".shape-quick").forEach((button) => {
  button.addEventListener("click", () => selectShape(button.dataset.shape));
});

shapePickBtn.addEventListener("click", (event) => {
  event.stopPropagation();
  if (shapePopup.hidden) openShapePopup();
  else closeShapePopup();
});

document.addEventListener("click", (event) => {
  if (shapePopup.hidden) return;
  if (shapePopup.contains(event.target) || shapePickBtn.contains(event.target)) return;
  closeShapePopup();
});

function onSizeInput(which) {
  if (activeShape === "freeform") {
    syncControls();
    drawStage();
    return;
  }
  let width = clampNumber(cropWidthInput.value, 20, 8000, crop.width);
  let height = clampNumber(cropHeightInput.value, 20, 8000, crop.height);
  if (ratioLocked && crop.width > 0 && crop.height > 0) {
    const ratio = crop.width / crop.height;
    if (which === "height") width = Math.round(height * ratio);
    else height = Math.round(width / ratio);
  }
  setCropSize(width, height);
}

cropWidthInput.addEventListener("change", () => onSizeInput("width"));
cropHeightInput.addEventListener("change", () => onSizeInput("height"));

ratioLock.addEventListener("click", () => {
  ratioLocked = !ratioLocked;
  ratioLock.setAttribute("aria-pressed", ratioLocked ? "true" : "false");
  ratioLock.textContent = ratioLocked ? "🔒" : "🔗";
  setStatus(ratioLocked ? "가로·세로 비율을 잠갔어요" : "비율 잠금을 해제했어요");
});

function nudgeCrop(dx, dy) {
  if (!sourceImage) return;
  if (activeShape === "freeform" && freeformPoints.length) moveFreeformBy(dx, dy);
  else if (cropActive) moveCropTo(crop.x + dx, crop.y + dy);
}

stageCanvas.addEventListener("contextmenu", (event) => event.preventDefault());

stageCanvas.addEventListener("pointerdown", (event) => {
  if (!sourceImage) return;
  pointerStartX = event.clientX;
  pointerStartY = event.clientY;
  pointerMoved = false;

  // Pan with space, middle button, or right button.
  if (spaceHeld || event.button === 1 || event.button === 2) {
    isPanning = true;
    panStartX = event.clientX;
    panStartY = event.clientY;
    stageCanvas.setPointerCapture(event.pointerId);
    stageCanvas.style.cursor = "grabbing";
    return;
  }

  if (event.button !== 0) return;

  const imagePoint = clampPointToImage(displayPointToImage(event.clientX, event.clientY));

  if (activeShape === "freeform") {
    freeformPoints = [imagePoint];
    isDrawingFreeform = true;
    stageCanvas.setPointerCapture(event.pointerId);
    drawStage();
    return;
  }

  const handle = hitHandle(event.clientX, event.clientY);
  if (handle) {
    isResizing = true;
    activeHandle = handle;
    pointerMoved = true;
    stageCanvas.setPointerCapture(event.pointerId);
    setStatus("도형 크기를 조절하는 중");
    return;
  }

  if (pointInsideCrop(event.clientX, event.clientY)) {
    pointerOffsetX = imagePoint.x - crop.x;
    pointerOffsetY = imagePoint.y - crop.y;
    isDragging = true;
    stageCanvas.setPointerCapture(event.pointerId);
    return;
  }

  // Start drawing a new shape from this point
  pendingDraw = true;
  drawOriginX = imagePoint.x;
  drawOriginY = imagePoint.y;
  stageCanvas.setPointerCapture(event.pointerId);
});

stageCanvas.addEventListener("pointermove", (event) => {
  if (!sourceImage) return;
  if (Math.hypot(event.clientX - pointerStartX, event.clientY - pointerStartY) > 4) {
    pointerMoved = true;
  }

  if (isPanning) {
    displayOffsetX += event.clientX - panStartX;
    displayOffsetY += event.clientY - panStartY;
    panStartX = event.clientX;
    panStartY = event.clientY;
    clampPan();
    drawStage();
    return;
  }

  if (isResizing) {
    resizeCropTo(displayPointToImage(event.clientX, event.clientY));
    return;
  }

  if (activeShape === "freeform" && isDrawingFreeform) {
    const point = clampPointToImage(displayPointToImage(event.clientX, event.clientY));
    const lastPoint = freeformPoints[freeformPoints.length - 1];
    if (!lastPoint || Math.hypot(point.x - lastPoint.x, point.y - lastPoint.y) > 3) {
      freeformPoints.push(point);
      drawStage();
    }
    return;
  }

  if (pendingDraw && pointerMoved) {
    pendingDraw = false;
    isDrawingShape = true;
    cropActive = true;
  }

  if (isDrawingShape) {
    updateDrawBounds(displayPointToImage(event.clientX, event.clientY));
    drawStage();
    return;
  }

  if (isDragging) {
    const imagePoint = displayPointToImage(event.clientX, event.clientY);
    moveCropTo(imagePoint.x - pointerOffsetX, imagePoint.y - pointerOffsetY);
    return;
  }

  updateHoverCursor(event.clientX, event.clientY);
});

stageCanvas.addEventListener("pointerup", (event) => {
  if (!sourceImage) return;

  if (isPanning) {
    isPanning = false;
    stageCanvas.releasePointerCapture(event.pointerId);
    stageCanvas.style.cursor = spaceHeld ? "grab" : "crosshair";
    return;
  }

  if (isResizing) {
    isResizing = false;
    activeHandle = null;
    stageCanvas.releasePointerCapture(event.pointerId);
    syncControls();
    setStatus(`커터 크기 ${Math.round(crop.width)} x ${Math.round(crop.height)}`);
    updateHoverCursor(event.clientX, event.clientY);
    return;
  }

  if (activeShape === "freeform" && isDrawingFreeform) {
    isDrawingFreeform = false;
    stageCanvas.releasePointerCapture(event.pointerId);
    if (freeformPoints.length > 2) {
      syncCropFromFreeform();
      cropActive = true;
      setStatus("자유형 영역이 준비됐습니다");
    } else {
      freeformPoints = [];
      setStatus("자유형 윤곽을 조금 더 크게 그려주세요");
    }
    drawStage();
    return;
  }

  if (isDrawingShape) {
    isDrawingShape = false;
    stageCanvas.releasePointerCapture(event.pointerId);
    if (crop.width < MIN_CROP_SIZE || crop.height < MIN_CROP_SIZE) {
      cropActive = false;
      setStatus("도형을 더 크게 드래그해 그려주세요");
      syncControls();
      drawStage();
    } else {
      syncControls();
      setStatus(`${shapeLabels[activeShape]} ${Math.round(crop.width)} x ${Math.round(crop.height)} 영역 완성`);
      drawStage();
      updateHoverCursor(event.clientX, event.clientY);
    }
    return;
  }

  if (isDragging) {
    isDragging = false;
    stageCanvas.releasePointerCapture(event.pointerId);
    if (!pointerMoved && stampOnClick.checked) stampCrop();
    return;
  }

  if (pendingDraw) {
    pendingDraw = false;
    try {
      stageCanvas.releasePointerCapture(event.pointerId);
    } catch (error) {
      /* pointer already released */
    }
  }
});

stageCanvas.addEventListener("wheel", (event) => {
  if (!sourceImage) return;
  event.preventDefault();
  const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
  zoomAt(factor, event.clientX, event.clientY);
}, { passive: false });

stageCanvas.addEventListener("dblclick", () => {
  if (activeShape !== "freeform" && cropActive) stampCrop();
});

const NUDGE_KEYS = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0],
};

document.addEventListener("keydown", (event) => {
  if (isTypingTarget(event.target)) return;

  if (event.code === "Space") {
    if (!spaceHeld) {
      spaceHeld = true;
      if (sourceImage && !isPanning) stageCanvas.style.cursor = "grab";
    }
    event.preventDefault();
    return;
  }

  if (!sourceImage) return;

  if (event.key === "+" || event.key === "=") {
    zoomFromButton(1.2);
    event.preventDefault();
    return;
  }
  if (event.key === "-" || event.key === "_") {
    zoomFromButton(1 / 1.2);
    event.preventDefault();
    return;
  }

  const direction = NUDGE_KEYS[event.key];
  if (direction) {
    const step = event.shiftKey ? 10 : 1;
    nudgeCrop(direction[0] * step, direction[1] * step);
    event.preventDefault();
  }
});

document.addEventListener("keyup", (event) => {
  if (event.code === "Space") {
    spaceHeld = false;
    if (!isPanning) stageCanvas.style.cursor = "crosshair";
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && shapePopup && !shapePopup.hidden) closeShapePopup();
});

/* ============================================================
   Works badge + export resolution
   ============================================================ */
function updateWorksBadge() {
  if (!navWorksCount) return;
  const count = generatedCrops.length + batchResults.length + renameEntries.length;
  navWorksCount.textContent = String(count);
  navWorksCount.hidden = count === 0;
}

function updateWorksSummary() {
  if (!worksHint) return;
  const count = generatedCrops.length + batchResults.length + renameEntries.length;
  worksHint.textContent = count ? `세 가지 도구에서 만든 작업 ${count}개` : "지금까지 만든 파일이 여기에 모여요";
}

function getExportSize(width, height) {
  const baseW = Math.max(1, Math.round(width));
  const baseH = Math.max(1, Math.round(height));
  if (exportMode === "scale") {
    const percent = clampNumber(exportScaleInput.value, 1, 1000, 100) / 100;
    return {
      width: Math.max(1, Math.round(baseW * percent)),
      height: Math.max(1, Math.round(baseH * percent)),
    };
  }
  if (exportMode === "custom") {
    return {
      width: Math.max(1, Math.round(clampNumber(exportWidthInput.value, 1, 20000, baseW))),
      height: Math.max(1, Math.round(clampNumber(exportHeightInput.value, 1, 20000, baseH))),
    };
  }
  return { width: baseW, height: baseH };
}

function getCurrentBounds() {
  if (activeShape === "freeform") return getFreeformBounds();
  return cropActive ? crop : null;
}

function updateExportInfo() {
  const bounds = getCurrentBounds();
  if (exportCurrent) {
    exportCurrent.textContent = bounds
      ? `${Math.round(bounds.width)} × ${Math.round(bounds.height)}`
      : "— × —";
  }
  if (exportPreview) {
    if (!bounds) {
      exportPreview.textContent = "저장 크기 — × —";
    } else {
      const target = getExportSize(bounds.width, bounds.height);
      exportPreview.textContent = `저장 크기 ${target.width} × ${target.height}px`;
    }
  }
}

function setExportMode(mode) {
  exportMode = mode;
  document.querySelectorAll(".seg-btn[data-export]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.export === mode);
  });
  exportScaleField.hidden = mode !== "scale";
  exportCustomField.hidden = mode !== "custom";
  if (mode === "custom") {
    const bounds = getCurrentBounds();
    if (bounds) {
      exportWidthInput.value = Math.round(bounds.width);
      exportHeightInput.value = Math.round(bounds.height);
    }
  }
  updateExportInfo();
}

exportToggle.addEventListener("click", () => {
  const willOpen = exportDetail.hasAttribute("hidden");
  exportDetail.toggleAttribute("hidden", !willOpen);
  exportToggle.setAttribute("aria-expanded", willOpen ? "true" : "false");
  if (willOpen) updateExportInfo();
});

document.querySelectorAll(".seg-btn[data-export]").forEach((button) => {
  button.addEventListener("click", () => setExportMode(button.dataset.export));
});

[exportScaleInput, exportWidthInput, exportHeightInput].forEach((input) => {
  input.addEventListener("input", updateExportInfo);
});

/* ============================================================
   Batch paste
   ============================================================ */
function setBatchStatus(message) {
  if (batchStatus) batchStatus.textContent = message;
}

function loadBatchImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("invalid image"));
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => resolve({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      file,
      image,
      url,
    });
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image load failed"));
    };
    image.src = url;
  });
}

async function addBatchSources(files) {
  if (batchRunning) return;
  const available = Math.max(0, 50 - batchSources.length);
  const selected = Array.from(files || []).filter((file) => file.type.startsWith("image/")).slice(0, available);
  if (!selected.length) {
    setBatchStatus(available ? "사용할 수 있는 이미지 파일이 없어요" : "원본 이미지는 최대 50개까지 추가할 수 있어요");
    return;
  }
  setBatchStatus(`${selected.length}개 이미지를 불러오는 중`);
  const loaded = await Promise.allSettled(selected.map(loadBatchImage));
  loaded.forEach((result) => {
    if (result.status === "fulfilled") batchSources.push(result.value);
  });
  if (batchSelectedSource >= batchSources.length) batchSelectedSource = Math.max(0, batchSources.length - 1);
  renderBatchSources();
  drawBatchPreview();
  syncBatchControls();
  setBatchStatus(`${batchSources.length}개 원본 이미지 준비됨`);
}

async function setBatchOverlay(file) {
  if (batchRunning) return;
  if (!file || !file.type.startsWith("image/")) {
    setBatchStatus("붙여넣을 이미지 파일을 선택해 주세요");
    return;
  }
  try {
    const loaded = await loadBatchImage(file);
    if (batchOverlay) URL.revokeObjectURL(batchOverlay.url);
    batchOverlay = loaded;
    batchOverlayPreview.innerHTML = "";
    const image = document.createElement("img");
    image.src = loaded.url;
    image.alt = file.name;
    batchOverlayPreview.append(image);
    batchOverlayName.textContent = file.name;
    resetBatchOverlayTransform();
    drawBatchPreview();
    syncBatchControls();
    setBatchStatus("붙여넣을 이미지 준비됨");
  } catch (error) {
    setBatchStatus("붙여넣을 이미지를 읽지 못했어요");
  }
}

function renderBatchSources() {
  batchSourceGrid.innerHTML = "";
  batchSources.forEach((source, index) => {
    const card = document.createElement("article");
    card.className = `batch-file-card${index === batchSelectedSource ? " is-active" : ""}`;
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `${source.file.name} 미리보기`);

    const image = document.createElement("img");
    image.src = source.url;
    image.alt = "";
    const name = document.createElement("span");
    name.textContent = source.file.name;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "batch-file-remove";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `${source.file.name} 제거`);

    const select = () => {
      batchSelectedSource = index;
      renderBatchSources();
      drawBatchPreview();
    };
    card.addEventListener("click", select);
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select();
      }
    });
    remove.addEventListener("click", (event) => {
      event.stopPropagation();
      if (batchRunning) return;
      URL.revokeObjectURL(source.url);
      batchSources.splice(index, 1);
      batchSelectedSource = Math.min(batchSelectedSource, Math.max(0, batchSources.length - 1));
      renderBatchSources();
      drawBatchPreview();
      syncBatchControls();
      setBatchStatus(batchSources.length ? `${batchSources.length}개 원본 이미지 준비됨` : "원본 이미지를 업로드하세요");
    });

    card.append(image, name, remove);
    batchSourceGrid.append(card);
  });
  batchSourceCount.textContent = `${batchSources.length}개`;
}

function getBatchOverlayRatio() {
  if (!batchOverlay) return 1;
  return batchOverlay.image.naturalHeight / batchOverlay.image.naturalWidth;
}

function getBatchPlacement(baseWidth, baseHeight) {
  const ratio = getBatchOverlayRatio();
  const minWidth = Math.min(0.08, 24 / baseWidth);
  const maxWidth = Math.min(0.96, (baseHeight * 0.96) / (baseWidth * ratio));
  const widthFraction = Math.min(maxWidth, Math.max(minWidth, batchOverlayTransform.width));
  const width = baseWidth * widthFraction;
  const height = width * ratio;
  const maxX = Math.max(0, baseWidth - width);
  const maxY = Math.max(0, baseHeight - height);
  return {
    x: Math.min(maxX, Math.max(0, batchOverlayTransform.x * baseWidth)),
    y: Math.min(maxY, Math.max(0, batchOverlayTransform.y * baseHeight)),
    width,
    height,
  };
}

function constrainBatchOverlayTransform(baseWidth, baseHeight) {
  if (!batchOverlay) return;
  const placement = getBatchPlacement(baseWidth, baseHeight);
  batchOverlayTransform.width = placement.width / baseWidth;
  batchOverlayTransform.x = placement.x / baseWidth;
  batchOverlayTransform.y = placement.y / baseHeight;
}

function resetBatchOverlayTransform() {
  const source = batchSources[batchSelectedSource];
  batchOverlayTransform = { x: 0.77, y: 0.77, width: 0.2 };
  if (!source || !batchOverlay) return;
  const baseWidth = source.image.naturalWidth;
  const baseHeight = source.image.naturalHeight;
  constrainBatchOverlayTransform(baseWidth, baseHeight);
  const placement = getBatchPlacement(baseWidth, baseHeight);
  batchOverlayTransform.x = Math.max(0, (baseWidth - placement.width) / baseWidth - 0.03);
  batchOverlayTransform.y = Math.max(0, (baseHeight - placement.height) / baseHeight - 0.03);
}

function drawBatchPreview() {
  const context = batchPreviewCanvas.getContext("2d");
  const canvasWidth = batchPreviewCanvas.width;
  const canvasHeight = batchPreviewCanvas.height;
  context.clearRect(0, 0, canvasWidth, canvasHeight);
  batchPreviewFrame = null;
  const source = batchSources[batchSelectedSource];
  batchPreviewName.textContent = source ? source.file.name : "선택된 원본 없음";
  batchPreviewEmpty.classList.toggle("is-hidden", Boolean(source && batchOverlay));
  if (!source) return;

  const baseWidth = source.image.naturalWidth;
  const baseHeight = source.image.naturalHeight;
  const scale = Math.min(canvasWidth / baseWidth, canvasHeight / baseHeight);
  const drawWidth = baseWidth * scale;
  const drawHeight = baseHeight * scale;
  const originX = (canvasWidth - drawWidth) / 2;
  const originY = (canvasHeight - drawHeight) / 2;
  context.fillStyle = "#ffffff";
  context.fillRect(originX, originY, drawWidth, drawHeight);
  context.drawImage(source.image, originX, originY, drawWidth, drawHeight);

  if (batchOverlay) {
    constrainBatchOverlayTransform(baseWidth, baseHeight);
    const placement = getBatchPlacement(baseWidth, baseHeight);
    context.save();
    context.beginPath();
    context.rect(originX, originY, drawWidth, drawHeight);
    context.clip();
    context.drawImage(
      batchOverlay.image,
      originX + placement.x * scale,
      originY + placement.y * scale,
      placement.width * scale,
      placement.height * scale
    );
    context.restore();

    const box = {
      x: originX + placement.x * scale,
      y: originY + placement.y * scale,
      width: placement.width * scale,
      height: placement.height * scale,
    };
    const accent = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#e24a99";
    context.save();
    context.strokeStyle = accent;
    context.lineWidth = 2;
    context.setLineDash([7, 4]);
    context.strokeRect(box.x, box.y, box.width, box.height);
    context.setLineDash([]);
    const handleSize = 10;
    [
      [box.x, box.y],
      [box.x + box.width, box.y],
      [box.x, box.y + box.height],
      [box.x + box.width, box.y + box.height],
    ].forEach(([x, y]) => {
      context.fillStyle = "#ffffff";
      context.fillRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
      context.strokeStyle = accent;
      context.strokeRect(x - handleSize / 2, y - handleSize / 2, handleSize, handleSize);
    });
    context.restore();
    batchPreviewFrame = { originX, originY, scale, baseWidth, baseHeight, box };
  }
}

function getBatchPreviewPoint(event) {
  const rect = batchPreviewCanvas.getBoundingClientRect();
  return {
    x: (event.clientX - rect.left) * (batchPreviewCanvas.width / rect.width),
    y: (event.clientY - rect.top) * (batchPreviewCanvas.height / rect.height),
  };
}

function getBatchNormalizedPoint(point, frame = batchPreviewFrame) {
  return {
    x: (point.x - frame.originX) / (frame.scale * frame.baseWidth),
    y: (point.y - frame.originY) / (frame.scale * frame.baseHeight),
  };
}

function getBatchOverlayHandle(point) {
  if (!batchPreviewFrame) return null;
  const box = batchPreviewFrame.box;
  const hitRadius = 12;
  const handles = [
    { name: "nw", x: box.x, y: box.y, cursor: "nwse-resize" },
    { name: "ne", x: box.x + box.width, y: box.y, cursor: "nesw-resize" },
    { name: "sw", x: box.x, y: box.y + box.height, cursor: "nesw-resize" },
    { name: "se", x: box.x + box.width, y: box.y + box.height, cursor: "nwse-resize" },
  ];
  return handles.find((handle) => Math.hypot(point.x - handle.x, point.y - handle.y) <= hitRadius) || null;
}

function pointInsideBatchOverlay(point) {
  if (!batchPreviewFrame) return false;
  const box = batchPreviewFrame.box;
  return point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height;
}

function updateBatchPreviewCursor(point) {
  const handle = getBatchOverlayHandle(point);
  batchPreviewCanvas.style.cursor = handle ? handle.cursor : pointInsideBatchOverlay(point) ? "grab" : "default";
}

batchPreviewCanvas.addEventListener("pointerdown", (event) => {
  if (batchRunning || !batchPreviewFrame || event.button !== 0) return;
  const point = getBatchPreviewPoint(event);
  const handle = getBatchOverlayHandle(point);
  if (!handle && !pointInsideBatchOverlay(point)) return;
  const start = getBatchNormalizedPoint(point);
  const ratio = getBatchOverlayRatio();
  const originalHeight = batchOverlayTransform.width * batchPreviewFrame.baseWidth * ratio / batchPreviewFrame.baseHeight;
  batchOverlayInteraction = {
    type: handle ? "resize" : "move",
    handle: handle ? handle.name : null,
    start,
    original: { ...batchOverlayTransform, height: originalHeight },
  };
  batchPreviewCanvas.setPointerCapture(event.pointerId);
  batchPreviewCanvas.style.cursor = handle ? handle.cursor : "grabbing";
});

batchPreviewCanvas.addEventListener("pointermove", (event) => {
  if (!batchPreviewFrame) return;
  const point = getBatchPreviewPoint(event);
  if (!batchOverlayInteraction) {
    updateBatchPreviewCursor(point);
    return;
  }
  const current = getBatchNormalizedPoint(point);
  const interaction = batchOverlayInteraction;
  const dx = current.x - interaction.start.x;
  const dy = current.y - interaction.start.y;
  if (interaction.type === "move") {
    batchOverlayTransform.x = interaction.original.x + dx;
    batchOverlayTransform.y = interaction.original.y + dy;
  } else {
    const ratio = getBatchOverlayRatio();
    const widthFromX = interaction.original.width + (interaction.handle.includes("e") ? dx : -dx);
    const widthDeltaFromY = dy * batchPreviewFrame.baseHeight / (batchPreviewFrame.baseWidth * ratio);
    const widthFromY = interaction.original.width + (interaction.handle.includes("s") ? widthDeltaFromY : -widthDeltaFromY);
    const newWidth = Math.abs(widthFromX - interaction.original.width) >= Math.abs(widthFromY - interaction.original.width)
      ? widthFromX
      : widthFromY;
    const newHeight = newWidth * batchPreviewFrame.baseWidth * ratio / batchPreviewFrame.baseHeight;
    batchOverlayTransform.width = newWidth;
    batchOverlayTransform.x = interaction.handle.includes("w")
      ? interaction.original.x + interaction.original.width - newWidth
      : interaction.original.x;
    batchOverlayTransform.y = interaction.handle.includes("n")
      ? interaction.original.y + interaction.original.height - newHeight
      : interaction.original.y;
  }
  constrainBatchOverlayTransform(batchPreviewFrame.baseWidth, batchPreviewFrame.baseHeight);
  drawBatchPreview();
});

function endBatchOverlayInteraction(event) {
  if (!batchOverlayInteraction) return;
  batchOverlayInteraction = null;
  try {
    batchPreviewCanvas.releasePointerCapture(event.pointerId);
  } catch (error) {
    /* pointer capture already released */
  }
  updateBatchPreviewCursor(getBatchPreviewPoint(event));
}

batchPreviewCanvas.addEventListener("pointerup", endBatchOverlayInteraction);
batchPreviewCanvas.addEventListener("pointercancel", endBatchOverlayInteraction);

function syncBatchControls() {
  const ready = batchSources.length > 0 && Boolean(batchOverlay);
  batchRunBtn.disabled = !ready || batchRunning;
  batchCancelBtn.disabled = !batchRunning || batchCancelRequested;
  batchRunBtn.textContent = batchRunning
    ? "처리 중..."
    : ready ? `${batchSources.length}개 일괄 붙여넣기` : "일괄 붙여넣기";
  [batchSourceInput, batchOverlayInput, batchPrefix, batchFormat].forEach((control) => {
    control.disabled = batchRunning;
  });
}

function buildBatchResultCard(item) {
  const card = document.createElement("article");
  card.className = "tile-card";
  const image = document.createElement("img");
  image.src = item.url;
  image.alt = item.file;
  const footer = document.createElement("div");
  footer.className = "tile-footer";
  const name = document.createElement("strong");
  name.className = "tile-name";
  name.textContent = item.file;
  const dim = document.createElement("span");
  dim.className = "tile-dim";
  dim.textContent = `${item.width} × ${item.height}px`;
  const actions = document.createElement("div");
  actions.className = "tile-actions";
  const link = document.createElement("a");
  link.href = item.url;
  link.download = item.file;
  link.textContent = "저장";
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "tile-remove";
  remove.textContent = "삭제";
  remove.addEventListener("click", () => {
    if (!batchRunning) removeBatchResult(item.id);
  });
  actions.append(link, remove);
  footer.append(name, dim, actions);
  card.append(image, footer);
  return card;
}

function renderBatchResults() {
  [batchResultGrid, worksBatchGrid].forEach((grid) => {
    grid.innerHTML = "";
    batchResults.slice().reverse().forEach((item) => grid.append(buildBatchResultCard(item)));
  });
  const hasResults = batchResults.length > 0;
  batchResultEmpty.classList.toggle("is-hidden", hasResults);
  worksBatchEmpty.classList.toggle("is-hidden", hasResults);
  batchDownloadAll.disabled = !hasResults || batchRunning;
  downloadBatchWorks.disabled = !hasResults || batchRunning;
  batchClearResults.disabled = !hasResults || batchRunning;
  clearBatchWorks.disabled = !hasResults || batchRunning;
  batchResultCount.textContent = `${batchResults.length}개`;
  worksBatchCount.textContent = `${batchResults.length}개`;
  batchResultHint.textContent = hasResults ? `완성된 파일 ${batchResults.length}개` : "붙여넣기 완료 후 파일이 여기에 표시됩니다";
  updateWorksSummary();
  updateWorksBadge();
}

function removeBatchResult(id) {
  const index = batchResults.findIndex((item) => item.id === id);
  if (index === -1) return;
  const [item] = batchResults.splice(index, 1);
  URL.revokeObjectURL(item.url);
  renderBatchResults();
}

function clearBatchResults() {
  if (batchRunning || !batchResults.length) return;
  batchResults.forEach((item) => URL.revokeObjectURL(item.url));
  batchResults = [];
  renderBatchResults();
  setBatchStatus("결과를 비웠어요");
}

async function runBatchPaste() {
  if (batchRunning || !batchSources.length || !batchOverlay) return;
  batchRunning = true;
  batchCancelRequested = false;
  batchProgress.hidden = false;
  batchProgressBar.max = batchSources.length;
  batchProgressBar.value = 0;
  batchProgressText.textContent = `0 / ${batchSources.length}`;
  syncBatchControls();
  renderBatchResults();

  const mimeType = batchFormat.value;
  const extension = mimeType.split("/")[1].replace("jpeg", "jpg");
  const safePrefix = (batchPrefix.value || "pasted").trim().replace(/[\\/:*?"<>|]+/g, "-") || "pasted";
  let completed = 0;
  let failed = false;

  try {
    for (const source of batchSources) {
      if (batchCancelRequested) break;
      setBatchStatus(`${source.file.name} 처리 중`);
      await new Promise((resolve) => requestAnimationFrame(resolve));

      const output = document.createElement("canvas");
      output.width = source.image.naturalWidth;
      output.height = source.image.naturalHeight;
      const context = output.getContext("2d");
      if (mimeType === "image/jpeg") {
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, output.width, output.height);
      }
      context.drawImage(source.image, 0, 0);
      const placement = getBatchPlacement(output.width, output.height);
      context.drawImage(batchOverlay.image, placement.x, placement.y, placement.width, placement.height);

      const blob = await canvasToBlob(output, mimeType);
      const originalName = source.file.name.replace(/\.[^.]+$/, "");
      const serial = String(batchResults.length + 1).padStart(3, "0");
      const item = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        blob,
        url: URL.createObjectURL(blob),
        file: `${safePrefix}_${serial}_${originalName}.${extension}`,
        width: output.width,
        height: output.height,
        date: Date.now(),
      };
      batchResults.push(item);
      completed += 1;
      batchProgressBar.value = completed;
      batchProgressText.textContent = `${completed} / ${batchSources.length}`;
      renderBatchResults();
      if (batchAutoDownload.checked) downloadOne(item);
    }
  } catch (error) {
    failed = true;
  } finally {
    const cancelled = batchCancelRequested;
    batchRunning = false;
    batchCancelRequested = false;
    syncBatchControls();
    renderBatchResults();
    setBatchStatus(
      failed
        ? `처리 중 오류 발생 · ${completed}개 완료`
        : cancelled ? `실행 취소됨 · ${completed}개 완료` : `일괄 붙여넣기 완료 · ${completed}개`
    );
  }
}

function cancelBatchPaste() {
  if (!batchRunning) return;
  batchCancelRequested = true;
  batchCancelBtn.disabled = true;
  setBatchStatus("현재 파일 처리 후 실행을 취소합니다");
}

async function downloadBatchZip() {
  if (!batchResults.length) return;
  setBatchStatus("ZIP 파일 생성 중");
  const files = [];
  for (const item of batchResults) {
    files.push({ name: item.file, bytes: new Uint8Array(await item.blob.arrayBuffer()) });
  }
  const blob = makeZip(files);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `batch-paste_${Date.now()}.zip`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  setBatchStatus("ZIP 저장 완료");
}

function wireBatchDropzone(element, onFiles) {
  ["dragenter", "dragover"].forEach((eventName) => {
    element.addEventListener(eventName, (event) => {
      event.preventDefault();
      element.classList.add("is-dragover");
    });
  });
  ["dragleave", "drop"].forEach((eventName) => {
    element.addEventListener(eventName, (event) => {
      event.preventDefault();
      element.classList.remove("is-dragover");
    });
  });
  element.addEventListener("drop", (event) => onFiles(event.dataTransfer.files));
}

batchSourceInput.addEventListener("change", (event) => {
  addBatchSources(event.target.files);
  event.target.value = "";
});
batchOverlayInput.addEventListener("change", (event) => {
  setBatchOverlay(event.target.files[0]);
  event.target.value = "";
});
wireBatchDropzone(batchSourceDropzone, addBatchSources);
wireBatchDropzone(batchOverlayDropzone, (files) => setBatchOverlay(files[0]));
batchRunBtn.addEventListener("click", runBatchPaste);
batchCancelBtn.addEventListener("click", cancelBatchPaste);
batchDownloadAll.addEventListener("click", downloadBatchZip);
batchClearResults.addEventListener("click", clearBatchResults);

/* ============================================================
   IndexedDB — persistent "내 작업" store
   ============================================================ */
const WORKS_DB = "cookielab-works";
const WORKS_STORE = "works";
let worksDbPromise = null;

function openWorksDb() {
  if (worksDbPromise) return worksDbPromise;
  worksDbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(WORKS_DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(WORKS_STORE, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
  return worksDbPromise;
}

async function saveWorkToDb(item) {
  try {
    const db = await openWorksDb();
    db.transaction(WORKS_STORE, "readwrite").objectStore(WORKS_STORE).put({
      id: item.id,
      blob: item.blob,
      file: item.file,
      width: item.width,
      height: item.height,
      shape: item.shape,
      date: item.date,
    });
  } catch (error) {
    /* persistence is best-effort */
  }
}

async function deleteWorkFromDb(id) {
  try {
    const db = await openWorksDb();
    db.transaction(WORKS_STORE, "readwrite").objectStore(WORKS_STORE).delete(id);
  } catch (error) {
    /* ignore */
  }
}

async function clearWorksDb() {
  try {
    const db = await openWorksDb();
    db.transaction(WORKS_STORE, "readwrite").objectStore(WORKS_STORE).clear();
  } catch (error) {
    /* ignore */
  }
}

async function loadWorksFromDb() {
  try {
    const db = await openWorksDb();
    const records = await new Promise((resolve, reject) => {
      const request = db.transaction(WORKS_STORE, "readonly").objectStore(WORKS_STORE).getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
    records.forEach((record) => {
      generatedCrops.push(Object.assign({}, record, { url: URL.createObjectURL(record.blob) }));
    });
  } catch (error) {
    /* IndexedDB unavailable — keep working in-memory only */
  }
  renderWorks();
}

/* ============================================================
   View switching + theme
   ============================================================ */
function setView(name, navButton) {
  Object.entries(views).forEach(([key, element]) => {
    if (element) element.hidden = key !== name;
  });
  navItems.forEach((button) => button.classList.remove("is-active"));
  if (navButton) navButton.classList.add("is-active");
  if (name === "edit") requestAnimationFrame(resizeCanvasToStage);
  if (name === "batch") requestAnimationFrame(drawBatchPreview);
}

navItems.forEach((button) => {
  button.addEventListener("click", () => setView(button.dataset.view, button));
});

function applyTheme(name) {
  document.documentElement.classList.toggle("theme-dark", name === "dark");
  document.querySelectorAll(".seg-btn[data-theme]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.theme === name);
  });
  try {
    localStorage.setItem("cookielab-theme", name);
  } catch (error) {
    /* storage unavailable */
  }
}

document.querySelectorAll(".seg-btn[data-theme]").forEach((button) => {
  button.addEventListener("click", () => {
    applyTheme(button.dataset.theme);
    drawStage();
  });
});

/* ============================================================
   Wiring + startup
   ============================================================ */
zoomInBtn.addEventListener("click", () => zoomFromButton(1.2));
zoomOutBtn.addEventListener("click", () => zoomFromButton(1 / 1.2));
fitBtn.addEventListener("click", fitView);

window.addEventListener("resize", resizeCanvasToStage);
stampBtn.addEventListener("click", stampCrop);
downloadAllBtn.addEventListener("click", downloadZip);
clearBtn.addEventListener("click", resetResults);
downloadAllWorks.addEventListener("click", downloadZip);
clearWorks.addEventListener("click", resetResults);

/* ============================================================
   파일명 일괄 변경 (batch rename)
   ============================================================ */
const renameInput = document.getElementById("renameInput");
const renameDropzone = document.getElementById("renameDropzone");
const renameList = document.getElementById("renameList");
const renameEmpty = document.getElementById("renameEmpty");
const renameCount = document.getElementById("renameCount");
const renameStatus = document.getElementById("renameStatus");
const renameApplyAll = document.getElementById("renameApplyAll");
const renameReset = document.getElementById("renameReset");
const renameDownloadAll = document.getElementById("renameDownloadAll");
const renameBase = document.getElementById("renameBase");
const renameStart = document.getElementById("renameStart");
const renameDigits = document.getElementById("renameDigits");
const renameFind = document.getElementById("renameFind");
const renameReplace = document.getElementById("renameReplace");
const renamePrefix = document.getElementById("renamePrefix");
const renameSuffix = document.getElementById("renameSuffix");
const renameNumberFields = document.getElementById("renameNumberFields");
const renameReplaceFields = document.getElementById("renameReplaceFields");
const renameAffixFields = document.getElementById("renameAffixFields");

let renameEntries = [];
let renameMode = "number";

function setRenameStatus(message) {
  if (renameStatus) renameStatus.textContent = message;
}

function splitFileName(name) {
  const dot = name.lastIndexOf(".");
  if (dot <= 0) return { base: name, ext: "" };
  return { base: name.slice(0, dot), ext: name.slice(dot) };
}

function safeRenameBase(value, fallback) {
  const base = (value || fallback || "file").trim().replace(/[\\/:*?"<>|]+/g, "-");
  return base || "file";
}

function renameFinalName(entry) {
  return safeRenameBase(entry.newBase, entry.base) + entry.ext;
}

function addRenameFiles(fileList) {
  const files = Array.from(fileList || []);
  if (!files.length) return;
  files.forEach((file) => {
    const { base, ext } = splitFileName(file.name);
    const isImage = file.type.startsWith("image/");
    renameEntries.push({
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      file,
      originalName: file.name,
      base,
      ext,
      newBase: base,
      isImage,
      url: isImage ? URL.createObjectURL(file) : "",
    });
  });
  renderRenameList();
  setRenameStatus(`${renameEntries.length}개 파일 준비됨`);
}

function removeRenameEntry(id) {
  const index = renameEntries.findIndex((entry) => entry.id === id);
  if (index === -1) return;
  if (renameEntries[index].url) URL.revokeObjectURL(renameEntries[index].url);
  renameEntries.splice(index, 1);
  renderRenameList();
}

function renderRenameList() {
  const has = renameEntries.length > 0;
  renameList.innerHTML = "";
  renameEmpty.classList.toggle("is-hidden", has);
  renameCount.textContent = `${renameEntries.length}개`;
  renameApplyAll.disabled = !has;
  renameReset.disabled = !has;
  renameDownloadAll.disabled = !has;

  renameEntries.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "rename-row";

    const thumb = document.createElement("div");
    thumb.className = "rename-thumb";
    if (entry.isImage) {
      const img = document.createElement("img");
      img.src = entry.url;
      img.alt = entry.originalName;
      thumb.append(img);
    } else {
      thumb.classList.add("is-file");
      thumb.textContent = (entry.ext.replace(".", "").toUpperCase() || "FILE").slice(0, 4);
    }

    const meta = document.createElement("div");
    meta.className = "rename-meta";
    const orig = document.createElement("span");
    orig.className = "rename-orig";
    orig.textContent = entry.originalName;
    const field = document.createElement("div");
    field.className = "rename-field";
    const input = document.createElement("input");
    input.type = "text";
    input.value = entry.newBase;
    input.setAttribute("aria-label", `${entry.originalName} 새 이름`);
    input.addEventListener("input", () => {
      entry.newBase = input.value;
      renderRenameWorks();
    });
    const ext = document.createElement("span");
    ext.className = "rename-ext";
    ext.textContent = entry.ext || "(확장자 없음)";
    field.append(input, ext);
    meta.append(orig, field);

    const actions = document.createElement("div");
    actions.className = "rename-row-actions";
    const save = document.createElement("button");
    save.type = "button";
    save.className = "mini-btn";
    save.textContent = "저장";
    save.addEventListener("click", () => downloadBlobAs(entry.file, renameFinalName(entry)));
    const del = document.createElement("button");
    del.type = "button";
    del.className = "mini-btn danger";
    del.textContent = "✕";
    del.title = "목록에서 제거";
    del.setAttribute("aria-label", "목록에서 제거");
    del.addEventListener("click", () => removeRenameEntry(entry.id));
    actions.append(save, del);

    row.append(thumb, meta, actions);
    renameList.append(row);
  });
  renderRenameWorks();
}

function renderRenameWorks() {
  const has = renameEntries.length > 0;
  worksRenameList.innerHTML = "";
  worksRenameEmpty.classList.toggle("is-hidden", has);
  worksRenameCount.textContent = `${renameEntries.length}개`;
  downloadRenameWorks.disabled = !has;
  clearRenameWorks.disabled = !has;

  renameEntries.forEach((entry) => {
    const row = document.createElement("div");
    row.className = "works-rename-item";
    const names = document.createElement("div");
    const original = document.createElement("span");
    original.textContent = entry.originalName;
    const renamed = document.createElement("strong");
    renamed.textContent = renameFinalName(entry);
    names.append(original, renamed);
    const save = document.createElement("button");
    save.type = "button";
    save.className = "mini-btn";
    save.textContent = "저장";
    save.addEventListener("click", () => downloadBlobAs(entry.file, renameFinalName(entry)));
    row.append(names, save);
    worksRenameList.append(row);
  });
  updateWorksSummary();
  updateWorksBadge();
}

function clearRenameWorksEntries() {
  renameEntries.forEach((entry) => {
    if (entry.url) URL.revokeObjectURL(entry.url);
  });
  renameEntries = [];
  renderRenameList();
  setRenameStatus("파일 목록을 비웠어요");
}

function setRenameMode(mode) {
  renameMode = mode;
  document.querySelectorAll("#renameModeSeg .seg-btn").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.rmode === mode);
  });
  renameNumberFields.hidden = mode !== "number";
  renameReplaceFields.hidden = mode !== "replace";
  renameAffixFields.hidden = mode !== "affix";
}

function applyRenameAll() {
  if (!renameEntries.length) return;
  if (renameMode === "number") {
    const baseRaw = (renameBase.value || "file").trim();
    const start = Math.round(clampNumber(renameStart.value, 0, 1e9, 1));
    const digits = Math.round(clampNumber(renameDigits.value, 1, 6, 3));
    renameEntries.forEach((entry, index) => {
      entry.newBase = `${baseRaw}_${String(start + index).padStart(digits, "0")}`;
    });
    setRenameStatus("번호 매기기를 적용했어요");
  } else if (renameMode === "replace") {
    const find = renameFind.value;
    if (!find) {
      setRenameStatus("찾을 내용을 입력해 주세요");
      return;
    }
    const replacement = renameReplace.value;
    renameEntries.forEach((entry) => {
      entry.newBase = entry.newBase.split(find).join(replacement);
    });
    setRenameStatus("찾기·바꾸기를 적용했어요");
  } else if (renameMode === "affix") {
    const prefix = renamePrefix.value;
    const suffix = renameSuffix.value;
    renameEntries.forEach((entry) => {
      entry.newBase = `${prefix}${entry.newBase}${suffix}`;
    });
    setRenameStatus("접두·접미를 적용했어요");
  }
  renderRenameList();
}

function resetRenameAll() {
  renameEntries.forEach((entry) => {
    entry.newBase = entry.base;
  });
  renderRenameList();
  setRenameStatus("원래 이름으로 되돌렸어요");
}

function downloadBlobAs(blob, name) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

async function downloadRenameZip() {
  if (!renameEntries.length) return;
  setRenameStatus("ZIP 생성 중…");
  const used = new Map();
  const files = [];
  for (const entry of renameEntries) {
    let name = renameFinalName(entry);
    if (used.has(name)) {
      const count = used.get(name) + 1;
      used.set(name, count);
      const parts = splitFileName(name);
      name = `${parts.base}_${count}${parts.ext}`;
    } else {
      used.set(name, 1);
    }
    files.push({ name, bytes: new Uint8Array(await entry.file.arrayBuffer()) });
  }
  downloadBlobAs(makeZip(files), `renamed_${Date.now()}.zip`);
  setRenameStatus(`${files.length}개 파일을 ZIP으로 저장했어요`);
}

renameInput.addEventListener("change", (event) => {
  addRenameFiles(event.target.files);
  renameInput.value = "";
});

["dragenter", "dragover"].forEach((eventName) => {
  renameDropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    renameDropzone.classList.add("is-dragover");
  });
});

["dragleave", "drop"].forEach((eventName) => {
  renameDropzone.addEventListener(eventName, (event) => {
    event.preventDefault();
    renameDropzone.classList.remove("is-dragover");
  });
});

renameDropzone.addEventListener("drop", (event) => {
  if (event.dataTransfer && event.dataTransfer.files) addRenameFiles(event.dataTransfer.files);
});

document.querySelectorAll("#renameModeSeg .seg-btn").forEach((button) => {
  button.addEventListener("click", () => setRenameMode(button.dataset.rmode));
});

renameApplyAll.addEventListener("click", applyRenameAll);
renameReset.addEventListener("click", resetRenameAll);
renameDownloadAll.addEventListener("click", downloadRenameZip);
downloadBatchWorks.addEventListener("click", downloadBatchZip);
clearBatchWorks.addEventListener("click", clearBatchResults);
downloadRenameWorks.addEventListener("click", downloadRenameZip);
clearRenameWorks.addEventListener("click", clearRenameWorksEntries);

(function init() {
  let savedTheme = "light";
  try {
    savedTheme = localStorage.getItem("cookielab-theme") || "light";
  } catch (error) {
    /* storage unavailable */
  }
  applyTheme(savedTheme === "dark" ? "dark" : "light");
  setExportMode("native");
  setRenameMode("number");
  loadWorksFromDb();
  renderBatchSources();
  renderBatchResults();
  syncBatchControls();
  syncControls();
  resizeCanvasToStage();
})();
