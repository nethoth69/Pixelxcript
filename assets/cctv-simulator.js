/* Pixelxcript — CCTV Coverage Simulator
   Vanilla JS canvas widget. Drag cameras onto a sample floor plan
   and see coverage cones update live. Illustrative only — a real
   site visit determines actual camera count and placement. */
(function () {
  "use strict";

  function init() {
    var mount = document.getElementById("cctv-sim");
    if (!mount) return;

    var W = mount.clientWidth || 640;
    var H = 380;

    mount.innerHTML =
      '<div class="cctv-sim-toolbar">' +
      '  <button type="button" class="btn btn-outline" data-action="add" style="padding:0.5rem 1rem;font-size:0.85rem;">+ Add camera</button>' +
      '  <button type="button" class="btn btn-outline" data-action="reset" style="padding:0.5rem 1rem;font-size:0.85rem;">Reset</button>' +
      '  <span class="cctv-sim-coverage" style="font-family:var(--font-mono);font-size:0.85rem;color:var(--steel);margin-left:auto;"></span>' +
      '</div>' +
      '<canvas class="cctv-sim-canvas" width="' + W + '" height="' + H + '" style="width:100%;height:' + H + 'px;touch-action:none;cursor:grab;display:block;margin-top:0.75rem;border:1px solid var(--line);border-radius:2px;"></canvas>' +
      '<p style="font-size:0.8rem;color:var(--steel);margin:0.6rem 0 0;">Drag a camera to move it. Drag the small handle on its edge to rotate.</p>';

    var canvas = mount.querySelector(".cctv-sim-canvas");
    var ctx = canvas.getContext("2d");
    var coverageLabel = mount.querySelector(".cctv-sim-coverage");

    var ROOM_MARGIN = 20;
    var CAM_RADIUS = 10;
    var FOV = Math.PI / 3.2; // ~56 degrees
    var RANGE = 150;

    var cameras = [
      { x: 90, y: 90, angle: Math.PI / 4 },
      { x: W - 90, y: H - 90, angle: Math.PI + Math.PI / 4 }
    ];

    var dragging = null; // { cam, mode: 'move' | 'rotate' }

    function roomPath() {
      ctx.beginPath();
      ctx.rect(ROOM_MARGIN, ROOM_MARGIN, W - ROOM_MARGIN * 2, H - ROOM_MARGIN * 2);
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);

      // paper background
      ctx.fillStyle = "#F5F2EA";
      ctx.fillRect(0, 0, W, H);

      // blueprint grid
      ctx.strokeStyle = "rgba(22,50,79,0.08)";
      ctx.lineWidth = 1;
      for (var gx = 0; gx <= W; gx += 20) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke();
      }
      for (var gy = 0; gy <= H; gy += 20) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(W, gy); ctx.stroke();
      }

      // room outline
      ctx.strokeStyle = "#16324F";
      ctx.lineWidth = 2;
      roomPath();
      ctx.stroke();

      // coverage cones (drawn first, under camera icons)
      var offCanvas = document.createElement("canvas");
      offCanvas.width = W; offCanvas.height = H;
      var octx = offCanvas.getContext("2d");

      cameras.forEach(function (cam) {
        octx.save();
        octx.beginPath();
        octx.moveTo(cam.x, cam.y);
        octx.arc(cam.x, cam.y, RANGE, cam.angle - FOV / 2, cam.angle + FOV / 2);
        octx.closePath();
        octx.fillStyle = "rgba(232,163,61,0.35)";
        octx.fill();
        octx.restore();
      });
      ctx.drawImage(offCanvas, 0, 0);

      // cone outlines
      cameras.forEach(function (cam) {
        ctx.beginPath();
        ctx.moveTo(cam.x, cam.y);
        ctx.arc(cam.x, cam.y, RANGE, cam.angle - FOV / 2, cam.angle + FOV / 2);
        ctx.closePath();
        ctx.strokeStyle = "rgba(201,127,30,0.7)";
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // camera icons + rotate handles
      cameras.forEach(function (cam) {
        ctx.save();
        ctx.translate(cam.x, cam.y);

        // body
        ctx.fillStyle = "#0E2136";
        ctx.beginPath();
        ctx.arc(0, 0, CAM_RADIUS, 0, Math.PI * 2);
        ctx.fill();

        // direction indicator
        ctx.strokeStyle = "#E8A33D";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(Math.cos(cam.angle) * (CAM_RADIUS + 6), Math.sin(cam.angle) * (CAM_RADIUS + 6));
        ctx.stroke();

        // rotate handle
        var hx = Math.cos(cam.angle) * (CAM_RADIUS + 18);
        var hy = Math.sin(cam.angle) * (CAM_RADIUS + 18);
        ctx.fillStyle = "#E8A33D";
        ctx.beginPath();
        ctx.arc(hx, hy, 5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });

      // rough coverage estimate (approx, illustrative only)
      var roomArea = (W - ROOM_MARGIN * 2) * (H - ROOM_MARGIN * 2);
      var coneArea = cameras.length * (0.5 * FOV * RANGE * RANGE);
      var pct = Math.min(95, Math.round((coneArea / roomArea) * 100));
      coverageLabel.textContent = cameras.length + " camera" + (cameras.length === 1 ? "" : "s") + " · ~" + pct + "% estimated coverage";
    }

    function getPos(evt) {
      var rect = canvas.getBoundingClientRect();
      var scaleX = canvas.width / rect.width;
      var scaleY = canvas.height / rect.height;
      var clientX = evt.touches ? evt.touches[0].clientX : evt.clientX;
      var clientY = evt.touches ? evt.touches[0].clientY : evt.clientY;
      return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
    }

    function hitTest(pos) {
      for (var i = cameras.length - 1; i >= 0; i--) {
        var cam = cameras[i];
        var hx = cam.x + Math.cos(cam.angle) * (CAM_RADIUS + 18);
        var hy = cam.y + Math.sin(cam.angle) * (CAM_RADIUS + 18);
        if (Math.hypot(pos.x - hx, pos.y - hy) <= 8) {
          return { cam: cam, mode: "rotate" };
        }
        if (Math.hypot(pos.x - cam.x, pos.y - cam.y) <= CAM_RADIUS + 4) {
          return { cam: cam, mode: "move" };
        }
      }
      return null;
    }

    function onDown(evt) {
      var pos = getPos(evt);
      var hit = hitTest(pos);
      if (hit) {
        dragging = hit;
        canvas.style.cursor = "grabbing";
        evt.preventDefault();
      }
    }

    function onMove(evt) {
      if (!dragging) return;
      var pos = getPos(evt);
      if (dragging.mode === "move") {
        dragging.cam.x = Math.max(ROOM_MARGIN, Math.min(W - ROOM_MARGIN, pos.x));
        dragging.cam.y = Math.max(ROOM_MARGIN, Math.min(H - ROOM_MARGIN, pos.y));
      } else if (dragging.mode === "rotate") {
        dragging.cam.angle = Math.atan2(pos.y - dragging.cam.y, pos.x - dragging.cam.x);
      }
      draw();
      evt.preventDefault();
    }

    function onUp() {
      dragging = null;
      canvas.style.cursor = "grab";
    }

    canvas.addEventListener("mousedown", onDown);
    canvas.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    canvas.addEventListener("touchstart", onDown, { passive: false });
    canvas.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onUp);

    mount.addEventListener("click", function (evt) {
      var action = evt.target.getAttribute("data-action");
      if (action === "add" && cameras.length < 6) {
        cameras.push({ x: W / 2, y: H / 2, angle: 0 });
        draw();
      } else if (action === "reset") {
        cameras = [
          { x: 90, y: 90, angle: Math.PI / 4 },
          { x: W - 90, y: H - 90, angle: Math.PI + Math.PI / 4 }
        ];
        draw();
      }
    });

    draw();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
