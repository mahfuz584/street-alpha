import * as d3 from "d3";
import { useEffect, useRef, useState } from "react";

const TreeMapCanvas = () => {
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const canvasContainerRef = useRef(null);

  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 600 });
  const [root, setRoot] = useState(null);
  const [highlightIndustry, setHighlightIndustry] = useState(null);
  const [loading, setLoading] = useState(true);

  const boxes = useRef([]);
  const industryBoxes = useRef([]);
  const industryMap = useRef(new Map());

  // Keep the fetched data here so we can recompute layouts without refetching
  const dataRef = useRef(null);

  // Enhanced drag state with velocity tracking
  const isDraggingRef = useRef(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const dragVelocityRef = useRef({ x: 0, y: 0 });
  const lastDragTimeRef = useRef(0);
  const momentumRef = useRef(false);

  // Touch state
  const isTouchPanning = useRef(false);
  const lastTouchX = useRef(0);
  const lastTouchY = useRef(0);
  const lastPinchDist = useRef(0);

  // Enhanced zoom & pan state with smoother interpolation
  const scale = useRef(1);
  const translateX = useRef(0);
  const translateY = useRef(0);
  const targetScale = useRef(1);
  const targetTranslateX = useRef(0);
  const targetTranslateY = useRef(0);
  const animating = useRef(false);
  const animationFrameRef = useRef(null);
  const zoomLimit = 3;

  // Enhanced tooltip state refs
  const tooltipHideTimeout = useRef(null);
  const isTooltipHovered = useRef(false);
  const currentTooltipType = useRef("none");
  const currentHoveredElement = useRef(null);
  const tooltipShowTimeout = useRef(null);

  const logicalWidth = canvasSize.width;
  const logicalHeight = canvasSize.height;

  // Color scale for performance changes
  const getExactColor = d3
    .scaleLinear()
    .domain([-10, -7, -3, 0, 3, 7, 10])
    .range([
      "rgb(121, 8, 0)",
      "rgb(205, 10, 1)",
      "rgb(235, 43, 33)",
      "rgb(236, 216, 0)",
      "rgb(87, 197, 40)",
      "rgb(4, 172, 18)",
      "rgb(4, 102, 4)",
    ])
    .interpolate(d3.interpolateRgb);

  // Mock data (fallback)
  const generateMockData = () => {
    const sectors = [
      "Technology",
      "Healthcare",
      "Finance",
      "Energy",
      "Consumer Goods",
      "Industrial",
      "Real Estate",
      "Telecommunications",
      "Utilities",
      "Materials",
    ];

    const mockData = {
      name: "Market",
      children: sectors.map((sector) => ({
        name: sector,
        children: Array.from(
          { length: Math.floor(Math.random() * 20) + 5 },
          (_, i) => ({
            name: `${sector.substring(0, 3).toUpperCase()}${i + 1}`,
            value: Math.random() * 1000 + 100,
            change: (Math.random() - 0.5) * 20,
            url: `https://example.com/${sector.toLowerCase()}-${i + 1}`,
          })
        ),
      })),
    };

    return mockData;
  };

  // ---------- Size management (no network calls) ----------
  // Observe container width changes
  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const el = canvasContainerRef.current;

    const ro = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const containerWidth =
          entry.contentBoxSize?.[0]?.inlineSize ??
          entry.contentRect?.width ??
          el.clientWidth;
        const containerHeight = Math.min(window.innerHeight * 0.8, 600);
        setCanvasSize((prev) => {
          // Avoid useless state updates
          const w = Math.round(containerWidth);
          const h = Math.round(containerHeight);
          if (prev.width === w && prev.height === h) return prev;
          return { width: w, height: h };
        });
      }
    });

    ro.observe(el);

    // Height also depends on window.innerHeight; recheck via rAF loop
    let rAF = 0;
    let lastH = 0;
    const tick = () => {
      const h = Math.round(Math.min(window.innerHeight * 0.8, 600));
      if (h !== lastH) {
        lastH = h;
        setCanvasSize((prev) =>
          prev.height === h ? prev : { ...prev, height: h }
        );
      }
      rAF = requestAnimationFrame(tick);
    };
    rAF = requestAnimationFrame(tick);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rAF);
    };
  }, []);

  // Setup canvas with device pixel ratio
  const setupCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;

    canvas.width = logicalWidth * dpr;
    canvas.height = logicalHeight * dpr;
    canvas.style.width = logicalWidth + "px";
    canvas.style.height = logicalHeight + "px";

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
  };

  // Draw rounded rectangle helper
  function drawRoundedRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
  }

  // Build treemap layout from data + size (no network)
  const computeTreemap = (data, width, height) => {
    const hierarchy = d3
      .hierarchy(data)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    return d3
      .treemap()
      .size([width, height])
      .padding(2)
      .paddingTop((d) => (d.depth === 1 ? 25 : 2))
      .round(true)(hierarchy);
  };

  // Draw the treemap
  const drawTreemap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(translateX.current, translateY.current);
    ctx.scale(scale.current, scale.current);

    // Clear previous data
    boxes.current.length = 0;
    industryBoxes.current.length = 0;
    industryMap.current.clear();

    if (!root) {
      ctx.restore();
      return;
    }

    root.each((d) => {
      const x = d.x0;
      const y = d.y0;
      const w = d.x1 - d.x0;
      const h = d.y1 - d.y0;

      if (d.depth === 1) {
        // Sector labels
        ctx.save();
        ctx.fillStyle = "#070707";
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "top";
        ctx.fillText(d.data.name, x + 4, y + 4);
        ctx.restore();

        industryBoxes.current.push({
          x,
          y,
          w,
          h,
          name: d.data.name,
          children: d.children || [],
        });
      } else if (d.depth === 2) {
        // Companies
        ctx.save();
        drawRoundedRect(ctx, x, y, w, h, 3);
        const changeValue = d.data.change ?? 0;
        ctx.fillStyle = getExactColor(changeValue);
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 1;
        ctx.stroke();

        // Text
        const centerX = x + w / 2;
        const centerY = y + h / 2;

        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px sans-serif";

        const symbol = d.data.name || "";
        const symbolWidth = ctx.measureText(symbol).width;

        if (w > symbolWidth + 8 && h > 20) {
          if (h > 35) {
            ctx.fillText(symbol, centerX, centerY - 8);
            ctx.font = "10px sans-serif";
            const changeText =
              changeValue > 0
                ? `+${changeValue.toFixed(1)}%`
                : `${changeValue.toFixed(1)}%`;
            ctx.fillText(changeText, centerX, centerY + 8);
          } else {
            ctx.fillText(symbol, centerX, centerY);
          }
        }

        ctx.restore();

        boxes.current.push({
          x,
          y,
          w,
          h,
          node: d,
          name: d.data.name,
          value: d.data.value,
          change: d.data.change,
          sector: d.parent.data.name,
          url: d.data.url,
        });

        industryMap.current.set(d, d.parent);
      }
    });

    if (highlightIndustry) {
      ctx.save();
      ctx.strokeStyle = "#070707";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(
        highlightIndustry.x,
        highlightIndustry.y,
        highlightIndustry.w,
        highlightIndustry.h
      );
      ctx.restore();
    }

    ctx.restore();
  };

  // Get minimum scale to fit canvas
  const getMinScale = () => {
    const canvas = canvasRef.current;
    if (!root || !canvas) return 1;
    return Math.min(
      canvas.clientWidth / root.x1,
      canvas.clientHeight / root.y1
    );
  };

  // Clamp pan within boundaries (for current scale)
  const clampPan = () => {
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const minTranslateX = canvas.clientWidth - root.x1 * scale.current;
    const minTranslateY = canvas.clientHeight - root.y1 * scale.current;

    translateX.current = Math.min(
      Math.max(translateX.current, minTranslateX),
      0
    );
    translateY.current = Math.min(
      Math.max(translateY.current, minTranslateY),
      0
    );

    targetTranslateX.current = translateX.current;
    targetTranslateY.current = translateY.current;
  };

  const clampPanTouch = () => {
    const canvas = canvasRef.current;
    if (!root || !canvas) return;

    const minTranslateX = canvas.clientWidth - root.x1 * targetScale.current;
    const minTranslateY = canvas.clientHeight - root.y1 * targetScale.current;

    targetTranslateX.current = Math.min(
      Math.max(targetTranslateX.current, minTranslateX),
      0
    );
    targetTranslateY.current = Math.min(
      Math.max(targetTranslateY.current, minTranslateY),
      0
    );
  };

  // Animate zoom/pan with adaptive easing
  const animateZoom = () => {
    const dx = targetTranslateX.current - translateX.current;
    const dy = targetTranslateY.current - translateY.current;
    const ds = targetScale.current - scale.current;

    const distance = Math.hypot(dx, dy);
    const scaleDistance = Math.abs(ds);

    const baseEase = 0.12;
    const adaptiveEase = Math.min(
      baseEase + (distance + scaleDistance) * 0.001,
      0.25
    );

    const threshold = 0.1;
    const scaleThreshold = 0.001;

    if (
      Math.abs(dx) > threshold ||
      Math.abs(dy) > threshold ||
      Math.abs(ds) > scaleThreshold
    ) {
      translateX.current += dx * adaptiveEase;
      translateY.current += dy * adaptiveEase;
      scale.current += ds * adaptiveEase;

      drawTreemap();
      animationFrameRef.current = requestAnimationFrame(animateZoom);
    } else {
      translateX.current = targetTranslateX.current;
      translateY.current = targetTranslateY.current;
      scale.current = targetScale.current;
      clampPan();
      drawTreemap();
      animating.current = false;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  };

  // Momentum animation for drag
  const animateMomentum = () => {
    if (!momentumRef.current) return;

    const friction = 0.95;
    const threshold = 0.1;

    targetTranslateX.current += dragVelocityRef.current.x;
    targetTranslateY.current += dragVelocityRef.current.y;

    dragVelocityRef.current.x *= friction;
    dragVelocityRef.current.y *= friction;

    const canvas = canvasRef.current;
    if (root && canvas) {
      const minTranslateX = canvas.clientWidth - root.x1 * targetScale.current;
      const minTranslateY = canvas.clientHeight - root.y1 * targetScale.current;

      targetTranslateX.current = Math.min(
        Math.max(targetTranslateX.current, minTranslateX),
        0
      );
      targetTranslateY.current = Math.min(
        Math.max(targetTranslateY.current, minTranslateY),
        0
      );
    }

    if (
      Math.abs(dragVelocityRef.current.x) > threshold ||
      Math.abs(dragVelocityRef.current.y) > threshold
    ) {
      if (!animating.current) {
        animating.current = true;
        animateZoom();
      }
      requestAnimationFrame(animateMomentum);
    } else {
      momentumRef.current = false;
      dragVelocityRef.current = { x: 0, y: 0 };
    }
  };

  // Get mouse position relative to canvas
  const getMousePos = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  // Tooltip helpers
  const hideTooltip = () => {
    if (tooltipHideTimeout.current) {
      clearTimeout(tooltipHideTimeout.current);
    }

    tooltipHideTimeout.current = setTimeout(() => {
      if (!isTooltipHovered.current) {
        const tooltip = tooltipRef.current;
        if (tooltip) {
          tooltip.style.visibility = "hidden";
          tooltip.style.transform = "scale(.85)";
          tooltip.style.opacity = "0";
          tooltip.style.pointerEvents = "none";
        }
        setHighlightIndustry(null);
        currentTooltipType.current = "none";
        currentHoveredElement.current = null;
        drawTreemap();
      }
    }, 300);
  };

  const positionTooltip = (tooltip, mouseEvent) => {
    const padding = 15;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = mouseEvent.clientX + padding;
    let top = mouseEvent.clientY + padding;

    tooltip.style.position = "fixed";
    tooltip.style.left = "-9999px";
    tooltip.style.top = "-9999px";
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = "0";

    setTimeout(() => {
      const tooltipRect = tooltip.getBoundingClientRect();

      if (left + tooltipRect.width > viewportWidth - 20) {
        left = mouseEvent.clientX - tooltipRect.width - padding;
        if (left < 20) {
          left = Math.max(20, (viewportWidth - tooltipRect.width) / 2);
        }
      }

      if (top + tooltipRect.height > viewportHeight - 20) {
        top = mouseEvent.clientY - tooltipRect.height - padding;
        if (top < 20) {
          top = 20;
        }
      }

      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
      tooltip.style.opacity = "1";
      tooltip.style.transform = "scale(1)";
      tooltip.style.zIndex = "1000";
      tooltip.style.transition = "opacity 0.2s, transform 0.2s";
    }, 0);
  };

  const showCompanyTooltip = (content, mouseEvent) => {
    if (tooltipHideTimeout.current) clearTimeout(tooltipHideTimeout.current);
    if (tooltipShowTimeout.current) clearTimeout(tooltipShowTimeout.current);

    const tooltip = tooltipRef.current;
    tooltip.innerHTML = content;
    currentTooltipType.current = "company";

    positionTooltip(tooltip, mouseEvent);
    tooltip.style.pointerEvents = "none";
  };

  const showSectorTooltip = (foundHighlight, mouseEvent) => {
    if (tooltipHideTimeout.current) clearTimeout(tooltipHideTimeout.current);
    if (tooltipShowTimeout.current) clearTimeout(tooltipShowTimeout.current);

    tooltipShowTimeout.current = setTimeout(() => {
      const tooltip = tooltipRef.current;
      currentTooltipType.current = "sector";

      const companies = boxes.current.filter(
        (b) => b.sector === foundHighlight.name
      );

      const sectorName = foundHighlight.name;
      const companyCount = companies.length;

      let content = `
        <div style="padding: 12px; background: rgba(0,0,0,0.95); color: white; border-radius: 8px; font-size: 13px; max-height: 450px; position: absolute; box-shadow: 0 8px 32px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); top:-120px;  width:380px;">
          <div style="font-weight: bold; margin-bottom: 8px; color: #ffd700; font-size: 14px; border-bottom: 1px solid #444; padding-bottom: 6px; position: sticky; top: 0; background: rgba(0,0,0,0.95); z-index: 1; backdrop-filter: blur(10px);">
            ${sectorName} Sector (${companyCount} companies)
          </div>
          <div class="tooltip-scroll" style="max-height: 360px; width:100%; overflow-y: auto; padding-right: 6px;">
      `;

      const sortedCompanies = companies.sort(
        (a, b) => (b.change || 0) - (a.change || 0)
      );
      const displayLimit = Math.min(companies.length, 100);

      for (let i = 0; i < displayLimit; i++) {
        const c = sortedCompanies[i];
        const change =
          c.change !== null
            ? c.change > 0
              ? "+" + c.change.toFixed(2)
              : c.change.toFixed(2)
            : "N/A";

        const colorBox = getExactColor(c.change || 0);
        const changeColor =
          c.change > 0 ? "#4ade80" : c.change < 0 ? "#f87171" : "#94a3b8";
        const companyName = c.name || "";
        const valueText = c.value ? c.value.toFixed(1) : "N/A";

        content += `
          <div style="margin-bottom: 6px; font-size: 11px; padding: 6px 0; border-bottom: 1px solid rgba(255,255,255,0.1); transition: background 0.2s;">
            <span style="display:inline-block;width:10px;height:10px;background:${colorBox};margin-right:8px;border-radius:2px;vertical-align:middle;box-shadow:0 1px 3px rgba(0,0,0,0.3);"></span>
            <strong style="color: #87ceeb; font-size: 12px;">${companyName}</strong>
            <div style="margin-left: 18px; color: #ccc; margin-top: 2px;">
              <span style="margin-right: 12px;">Value: <span style="color: #e2e8f0;">${valueText}</span></span>
              <span>Change: <span style="color: ${changeColor}; font-weight: bold;">${change}%</span></span>
            </div>
          </div>
        `;
      }

      if (companies.length > displayLimit) {
        const remaining = companies.length - displayLimit;
        content += `
          <div style="text-align: center; margin-top: 12px; color: #888; font-style: italic; font-size: 11px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 4px;">
            ... and ${remaining} more companies
          </div>
        `;
      }

      if (companies.length > 5) {
        content += `
          <div style="position: absolute; bottom: 4px; right: 8px; color: #666; font-size: 10px; pointer-events: none;">
            ↕ Scroll
          </div>
        `;
      }

      content += `
          </div>
        </div>
      `;

      tooltip.innerHTML = content;

      const style = document.createElement("style");
      style.textContent = `
        .tooltip-scroll::-webkit-scrollbar { width: 6px; }
        .tooltip-scroll::-webkit-scrollbar-track { background: rgba(255,255,255,0.1); border-radius: 3px; }
        .tooltip-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.3); border-radius: 3px; }
        .tooltip-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.5); }
      `;
      if (!document.head.querySelector("style[data-tooltip-styles]")) {
        style.setAttribute("data-tooltip-styles", "true");
        document.head.appendChild(style);
      }

      positionTooltip(tooltip, mouseEvent);
      tooltip.style.pointerEvents = "auto";
    }, 200);
  };

  const isSameElement = (newElement, elementType) => {
    if (!currentHoveredElement.current) return false;

    if (elementType === "company") {
      return (
        currentHoveredElement.current.type === "company" &&
        currentHoveredElement.current.name === newElement.name
      );
    } else if (elementType === "sector") {
      return (
        currentHoveredElement.current.type === "sector" &&
        currentHoveredElement.current.name === newElement.name
      );
    }
    return false;
  };

  // ---------- DATA FETCH (ONCE) ----------
  useEffect(() => {
    let cancelled = false;
    const loadData = async () => {
      try {
        setLoading(true);
        let data;
        try {
          const response = await fetch("/api/summary");
          data = await response.json();
        } catch (error) {
          // API not available → mock
          data = generateMockData();
        }
        if (cancelled) return;

        dataRef.current = data;
        const treemapRoot = computeTreemap(data, logicalWidth, logicalHeight);
        setRoot(treemapRoot);
      } catch (err) {
        const mockData = generateMockData();
        dataRef.current = mockData;
        const treemapRoot = computeTreemap(
          mockData,
          logicalWidth,
          logicalHeight
        );
        setRoot(treemapRoot);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    loadData();
    return () => {
      cancelled = true;
    };
    // IMPORTANT: no dependency on logicalWidth/Height here
  }, []);

  // ---------- RE-LAYOUT ON SIZE CHANGE (NO REFETCH) ----------
  useEffect(() => {
    setupCanvas();
    if (!dataRef.current) return;
    const treemapRoot = computeTreemap(
      dataRef.current,
      logicalWidth,
      logicalHeight
    );
    setRoot(treemapRoot);

    // Make sure current zoom isn't smaller than min scale after resize
    const minS = getMinScale();
    if (targetScale.current < minS) {
      targetScale.current = minS;
      scale.current = minS;
    }

    // Center content after resize
    const canvas = canvasRef.current;
    if (canvas && treemapRoot) {
      targetTranslateX.current =
        (canvas.clientWidth - treemapRoot.x1 * targetScale.current) / 2;
      targetTranslateY.current =
        (canvas.clientHeight - treemapRoot.y1 * targetScale.current) / 2;
      translateX.current = targetTranslateX.current;
      translateY.current = targetTranslateY.current;
    }

    drawTreemap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logicalWidth, logicalHeight]);

  // Draw when root or highlight changes
  useEffect(() => {
    setupCanvas();
    drawTreemap();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, highlightIndustry]);

  // ---------- EVENT HANDLERS ----------
  useEffect(() => {
    const canvas = canvasRef.current;
    const tooltip = tooltipRef.current;
    if (!canvas || !tooltip) return;

    setupCanvas();

    // Wheel zoom
    const onWheel = (e) => {
      e.preventDefault();
      if (!root) return;

      const zoomIntensity = 0.1;
      const wheel = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;
      const mouseX = e.offsetX;
      const mouseY = e.offsetY;

      const minScale = getMinScale();
      const newScale = Math.min(
        Math.max(targetScale.current * wheel, minScale),
        zoomLimit
      );
      if (Math.abs(newScale - targetScale.current) < 0.001) return;

      let newTranslateX, newTranslateY;

      if (wheel > 1) {
        // Zoom in at cursor
        newTranslateX =
          mouseX -
          (mouseX - targetTranslateX.current) *
            (newScale / targetScale.current);
        newTranslateY =
          mouseY -
          (mouseY - targetTranslateY.current) *
            (newScale / targetScale.current);
      } else {
        // Zoom out towards center
        const centerX = root ? root.x1 / 2 : logicalWidth / 2;
        const centerY = root ? root.y1 / 2 : logicalHeight / 2;
        newTranslateX = canvas.clientWidth / 2 - centerX * newScale;
        newTranslateY = canvas.clientHeight / 2 - centerY * newScale;
      }

      targetScale.current = newScale;
      targetTranslateX.current = newTranslateX;
      targetTranslateY.current = newTranslateY;

      if (!animating.current) {
        animating.current = true;
        animateZoom();
      }
    };

    const onMouseDown = (e) => {
      if (targetScale.current > 1) {
        isDraggingRef.current = true;
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        dragVelocityRef.current = { x: 0, y: 0 };
        lastDragTimeRef.current = Date.now();
        momentumRef.current = false;
      }
    };

    const onMouseMove = (e) => {
      if (isDraggingRef.current) {
        const currentTime = Date.now();
        const deltaTime = currentTime - lastDragTimeRef.current;

        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;

        if (deltaTime > 0) {
          dragVelocityRef.current.x = (deltaX / Math.max(deltaTime, 1)) * 16;
          dragVelocityRef.current.y = (deltaY / Math.max(deltaTime, 1)) * 16;
        }

        targetTranslateX.current += deltaX;
        targetTranslateY.current += deltaY;

        const canvas = canvasRef.current;
        if (root && canvas) {
          const minTranslateX =
            canvas.clientWidth - root.x1 * targetScale.current;
          const minTranslateY =
            canvas.clientHeight - root.y1 * targetScale.current;

          targetTranslateX.current = Math.min(
            Math.max(targetTranslateX.current, minTranslateX),
            0
          );
          targetTranslateY.current = Math.min(
            Math.max(targetTranslateY.current, minTranslateY),
            0
          );
        }

        dragStartRef.current = { x: e.clientX, y: e.clientY };
        lastDragTimeRef.current = currentTime;

        if (!animating.current) {
          animating.current = true;
          animateZoom();
        }
        return;
      }

      // Hover / tooltips
      const { x, y } = getMousePos(e);
      const mouseX = (x - translateX.current) / scale.current;
      const mouseY = (y - translateY.current) / scale.current;

      let foundHighlight = null;
      let hoveredCompany = null;

      for (const ind of industryBoxes.current) {
        if (
          mouseX >= ind.x &&
          mouseX <= ind.x + ind.w &&
          mouseY >= ind.y &&
          mouseY <= ind.y + ind.h
        ) {
          foundHighlight = ind;
          break;
        }
      }

      for (const box of boxes.current) {
        if (
          mouseX >= box.x &&
          mouseX <= box.x + box.w &&
          mouseY >= box.y &&
          mouseY <= box.y + box.h
        ) {
          hoveredCompany = box;
          break;
        }
      }

      if (hoveredCompany) {
        if (!isSameElement(hoveredCompany, "company")) {
          currentHoveredElement.current = {
            type: "company",
            name: hoveredCompany.name,
          };
          setHighlightIndustry(foundHighlight);

          const changeText =
            hoveredCompany.change !== null
              ? hoveredCompany.change > 0
                ? `+${hoveredCompany.change.toFixed(2)}%`
                : `${hoveredCompany.change.toFixed(2)}%`
              : "N/A";

          const valueText = hoveredCompany.value
            ? hoveredCompany.value.toFixed(2)
            : "N/A";
          const urlHint = hoveredCompany.url
            ? '<div style="margin-top: 8px; font-size: 11px; color: #94a3b8;">Double-click to open</div>'
            : "";

          const content = `
            <div style="padding: 12px; background: rgba(0,0,0,0.95); color: white; border-radius: 8px; font-size: 13px; max-width: 280px; box-shadow: 0 8px 32px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1);">
              <div style="font-weight: bold; margin-bottom: 6px; color: #ffd700; font-size: 12px;">${
                hoveredCompany.sector
              }</div>
              <div style="font-weight: bold; margin-bottom: 6px; font-size: 15px; color: #87ceeb;">${
                hoveredCompany.name
              }</div>
              <div style="margin-bottom: 3px; color: #e2e8f0;">Value: <span style="color: #87ceeb; font-weight: bold;">${valueText}</span></div>
              <div style="color: #e2e8f0;">Change: <span style="color: ${
                hoveredCompany.change > 0 ? "#4ade80" : "#f87171"
              }; font-weight: bold;">${changeText}</span></div>
              ${urlHint}
            </div>
          `;

          showCompanyTooltip(content, e);
          drawTreemap();
        }
      } else if (foundHighlight && foundHighlight.name) {
        if (!isSameElement(foundHighlight, "sector")) {
          currentHoveredElement.current = {
            type: "sector",
            name: foundHighlight.name,
          };
          setHighlightIndustry(foundHighlight);
          showSectorTooltip(foundHighlight, e);
          drawTreemap();
        }
      } else {
        if (!isTooltipHovered.current) {
          currentHoveredElement.current = null;
          hideTooltip();
        }
      }
    };

    const onMouseUp = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;

        const velocityThreshold = 0.5;
        if (
          Math.abs(dragVelocityRef.current.x) > velocityThreshold ||
          Math.abs(dragVelocityRef.current.y) > velocityThreshold
        ) {
          momentumRef.current = true;
          animateMomentum();
        }
      }
    };

    const onMouseLeave = () => {
      if (isDraggingRef.current) {
        isDraggingRef.current = false;
        momentumRef.current = false;
        dragVelocityRef.current = { x: 0, y: 0 };
      }
      if (!isTooltipHovered.current) {
        hideTooltip();
      }
    };

    const onDoubleClick = (e) => {
      const { x, y } = getMousePos(e);
      const mouseX = (x - translateX.current) / scale.current;
      const mouseY = (y - translateY.current) / scale.current;

      for (const box of boxes.current) {
        if (
          mouseX >= box.x &&
          mouseX <= box.x + box.w &&
          mouseY >= box.y &&
          mouseY <= box.y + box.h
        ) {
          if (box.url) window.open(box.url, "_blank");
          break;
        }
      }
    };

    // Touch handlers
    const getPinchDistance = (touches) => {
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };

    const onTouchStart = (e) => {
      e.preventDefault();
      if (e.touches.length === 1) {
        isTouchPanning.current = true;
        lastTouchX.current = e.touches[0].clientX;
        lastTouchY.current = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        isTouchPanning.current = false;
        lastPinchDist.current = getPinchDistance(e.touches);
      }
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      if (e.touches.length === 1 && isTouchPanning.current) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - lastTouchX.current;
        const deltaY = touch.clientY - lastTouchY.current;

        targetTranslateX.current += deltaX;
        targetTranslateY.current += deltaY;

        clampPanTouch();

        lastTouchX.current = touch.clientX;
        lastTouchY.current = touch.clientY;

        if (!animating.current) {
          animating.current = true;
          animateZoom();
        }
      } else if (e.touches.length === 2) {
        const newDist = getPinchDistance(e.touches);
        const delta = newDist - lastPinchDist.current;

        const zoomFactor = 1 + delta / 300;
        const newScale = Math.min(
          Math.max(targetScale.current * zoomFactor, getMinScale()),
          zoomLimit
        );

        const touchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const touchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        const midX = (touchMidX - translateX.current) / scale.current;
        const midY = (touchMidY - translateY.current) / scale.current;

        targetTranslateX.current = touchMidX - midX * newScale;
        targetTranslateY.current = touchMidY - midY * newScale;
        targetScale.current = newScale;

        clampPanTouch();

        lastPinchDist.current = newDist;

        if (!animating.current) {
          animating.current = true;
          animateZoom();
        }
      }
    };

    const onTouchEnd = (e) => {
      if (e.touches.length < 2) lastPinchDist.current = 0;
      if (e.touches.length === 0) isTouchPanning.current = false;
      hideTooltip();
    };

    // Tooltip enter/leave
    const onTooltipMouseEnter = () => {
      isTooltipHovered.current = true;
      if (tooltipHideTimeout.current) clearTimeout(tooltipHideTimeout.current);
    };
    const onTooltipMouseLeave = () => {
      isTooltipHovered.current = false;
      hideTooltip();
    };

    // Add listeners
    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("dblclick", onDoubleClick);
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);
    tooltip.addEventListener("mouseenter", onTooltipMouseEnter);
    tooltip.addEventListener("mouseleave", onTooltipMouseLeave);

    return () => {
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("dblclick", onDoubleClick);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
      tooltip.removeEventListener("mouseenter", onTooltipMouseEnter);
      tooltip.removeEventListener("mouseleave", onTooltipMouseLeave);

      if (tooltipHideTimeout.current) clearTimeout(tooltipHideTimeout.current);
      if (tooltipShowTimeout.current) clearTimeout(tooltipShowTimeout.current);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root]); // handlers need root for bounds/centering

  return (
    <div className="w-full">
      <div
        ref={canvasContainerRef}
        className="relative border border-gray-300 rounded-lg overflow-hidden"
        style={{ height: `${logicalHeight}px` }}
      >
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 z-10">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#070707] mb-4"></div>
              <p className="text-gray-600 font-medium">
                Loading market data...
              </p>
            </div>
          </div>
        )}

        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            cursor: isDraggingRef.current
              ? "grabbing"
              : targetScale.current > 1
              ? "grab"
              : "default",
            opacity: loading ? 0.3 : 1,
            transition: "opacity 0.3s ease-in-out",
          }}
        />
        <div ref={tooltipRef} className="absolute pointer-events-none" />
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: "rgb(4, 172, 18)" }}
            ></div>
            <span>Positive Change</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: "rgb(235, 43, 33)" }}
            ></div>
            <span>Negative Change</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded"
              style={{ backgroundColor: "rgb(236, 216, 0)" }}
            ></div>
            <span>Neutral</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreeMapCanvas;
