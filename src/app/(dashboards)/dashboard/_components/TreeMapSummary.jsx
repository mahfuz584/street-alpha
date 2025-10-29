"use client";

import * as d3 from "d3";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const TreeMapCanvas = ({ data }) => {
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const canvasContainerRef = useRef(null);

  // Back buffer
  const backCanvasRef = useRef(null);
  const backCtxRef = useRef(null);

  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 600 });
  const [root, setRoot] = useState(null);

  const boxes = useRef([]);
  const industryBoxes = useRef([]);
  const tooltipHideTimeout = useRef(null);

  // Zoom / pan
  const scale = useRef(1);
  const translateX = useRef(0);
  const translateY = useRef(0);
  const targetScale = useRef(1);
  const targetTranslateX = useRef(0);
  const targetTranslateY = useRef(0);
  const animating = useRef(false);
  const animationFrameRef = useRef(null);
  const zoomLimit = 3;

  // Highlight
  const highlightIndustryRef = useRef(null);
  const highlightIndustryKeyRef = useRef(null);

  // Throttle
  const mmRAFRef = useRef(null);
  const retryRAFRef = useRef(null); // for zero-size retries

  // First paint tracking
  const [hasDrawn, setHasDrawn] = useState(false);
  const hasDrawnRef = useRef(false);

  const logicalWidth = canvasSize.width;
  const logicalHeight = canvasSize.height;

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

  const hasPositiveSize = () => logicalWidth > 0 && logicalHeight > 0;

  // Resize handling (responsive width; capped height)
  useEffect(() => {
    if (!canvasContainerRef.current) return;
    const el = canvasContainerRef.current;

    let rafId = 0;
    const ro = new ResizeObserver((entries) => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        for (const entry of entries) {
          const containerWidth =
            entry.contentBoxSize?.[0]?.inlineSize ??
            entry.contentRect?.width ??
            el.clientWidth;

          const containerHeight = Math.min(window.innerHeight * 0.8, 600);
          const w = Math.max(0, Math.round(containerWidth));
          const h = Math.max(0, Math.round(containerHeight));

          setCanvasSize((prev) =>
            prev.width === w && prev.height === h
              ? prev
              : { width: w, height: h }
          );
        }
      });
    });

    ro.observe(el);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Setup visible + back buffer with DPR (SAFE: no-op when size is 0)
  const setupCanvases = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasPositiveSize()) return false;

    const dpr = Math.max(1, window.devicePixelRatio || 1);

    // Visible canvas
    const vctx = canvas.getContext("2d");
    const w = logicalWidth * dpr;
    const h = logicalHeight * dpr;
    if (w === 0 || h === 0) return false;

    canvas.width = w;
    canvas.height = h;
    canvas.style.width = logicalWidth + "px";
    canvas.style.height = logicalHeight + "px";
    vctx.setTransform(1, 0, 0, 1, 0, 0);
    vctx.scale(dpr, dpr);
    vctx.fillStyle = "#f8f9fa";
    vctx.fillRect(0, 0, logicalWidth, logicalHeight);

    // Back buffer
    if (!backCanvasRef.current) {
      backCanvasRef.current = document.createElement("canvas");
      backCtxRef.current = backCanvasRef.current.getContext("2d");
    }
    const bcanvas = backCanvasRef.current;
    const bctx = backCtxRef.current;

    bcanvas.width = w;
    bcanvas.height = h;
    bctx.setTransform(1, 0, 0, 1, 0, 0);
    bctx.scale(dpr, dpr);
    bctx.fillStyle = "#f8f9fa";
    bctx.fillRect(0, 0, logicalWidth, logicalHeight);

    return true;
  };

  const safeDraw = () => {
    // If zero-sized, retry next frame (prevents drawImage with 0x0 canvas)
    if (!setupCanvases()) {
      if (!retryRAFRef.current) {
        retryRAFRef.current = requestAnimationFrame(() => {
          retryRAFRef.current = null;
          safeDraw();
        });
      }
      return;
    }
    drawTreemap();
  };

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

  const computeTreemap = (inputData, width, height) => {
    const hierarchy = d3
      .hierarchy(inputData)
      .sum((d) => d.value || 0)
      .sort((a, b) => (b.value || 0) - (a.value || 0));

    return d3
      .treemap()
      .size([width, height])
      .padding(2)
      .paddingTop((d) => (d.depth === 1 ? 25 : 2))
      .round(true)(hierarchy);
  };

  const drawTreemap = () => {
    if (!hasPositiveSize()) return;

    const canvas = canvasRef.current;
    const bcanvas = backCanvasRef.current;
    const bctx = backCtxRef.current;
    if (!canvas || !bcanvas || !bctx) return;

    // If back buffer still zero, abort (prevents InvalidStateError)
    if (bcanvas.width === 0 || bcanvas.height === 0) return;

    // Clear back buffer
    bctx.fillStyle = "#f8f9fa";
    bctx.fillRect(0, 0, logicalWidth, logicalHeight);

    bctx.save();
    bctx.translate(translateX.current, translateY.current);
    bctx.scale(scale.current, scale.current);

    boxes.current.length = 0;
    industryBoxes.current.length = 0;

    if (root) {
      root.each((d) => {
        const x = d.x0,
          y = d.y0,
          w = d.x1 - d.x0,
          h = d.y1 - d.y0;

        if (d.depth === 1) {
          bctx.save();
          bctx.fillStyle = "#070707";
          bctx.font = "bold 14px sans-serif";
          bctx.textAlign = "left";
          bctx.textBaseline = "top";
          bctx.fillText(d.data.name, x + 4, y + 4);
          bctx.restore();

          industryBoxes.current.push({
            x,
            y,
            w,
            h,
            name: d.data.name,
            node: d,
          });
        } else if (d.depth === 2) {
          bctx.save();
          drawRoundedRect(bctx, x, y, w, h, 3);
          const changeValue = d.data.change ?? 0;
          bctx.fillStyle = getExactColor(changeValue);
          bctx.fill();
          bctx.strokeStyle = "#fff";
          bctx.lineWidth = 1;
          bctx.stroke();

          const cx = x + w / 2;
          const cy = y + h / 2;

          bctx.textAlign = "center";
          bctx.textBaseline = "middle";
          bctx.fillStyle = "#fff";
          bctx.font = "bold 12px sans-serif";

          const symbol = d.data.name || "";
          const symbolWidth = bctx.measureText(symbol).width;

          if (w > symbolWidth + 8 && h > 20) {
            if (h > 35) {
              bctx.fillText(symbol, cx, cy - 8);
              bctx.font = "10px sans-serif";
              const changeText =
                changeValue > 0
                  ? `+${changeValue.toFixed(1)}%`
                  : `${changeValue.toFixed(1)}%`;
              bctx.fillText(changeText, cx, cy + 8);
            } else {
              bctx.fillText(symbol, cx, cy);
            }
          }

          bctx.restore();

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
        }
      });

      const hi = highlightIndustryRef.current;
      if (hi) {
        bctx.save();
        bctx.strokeStyle = "#070707";
        bctx.lineWidth = 1.5;
        bctx.strokeRect(hi.x, hi.y, hi.w, hi.h);
        bctx.restore();
      }
    }

    bctx.restore();

    // Blit back buffer to visible (guard visible ctx too)
    const vctx = canvas.getContext("2d");
    if (!vctx) return;

    vctx.fillStyle = "#f8f9fa";
    vctx.fillRect(0, 0, logicalWidth, logicalHeight);

    // If either dimension is 0, skip drawImage to avoid InvalidStateError
    if (bcanvas.width === 0 || bcanvas.height === 0) return;

    vctx.drawImage(
      bcanvas,
      0,
      0,
      bcanvas.width,
      bcanvas.height,
      0,
      0,
      logicalWidth,
      logicalHeight
    );

    if (!hasDrawnRef.current) {
      hasDrawnRef.current = true;
      setHasDrawn(true);
    }
  };

  const getMinScale = () => {
    const canvas = canvasRef.current;
    if (!root || !canvas || !hasPositiveSize()) return 1;
    return Math.min(
      canvas.clientWidth / root.x1,
      canvas.clientHeight / root.y1
    );
  };

  const clampPan = () => {
    const canvas = canvasRef.current;
    if (!root || !canvas || !hasPositiveSize()) return;

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

      safeDraw();
      animationFrameRef.current = requestAnimationFrame(animateZoom);
    } else {
      translateX.current = targetTranslateX.current;
      translateY.current = targetTranslateY.current;
      scale.current = targetScale.current;
      clampPan();
      safeDraw();
      animating.current = false;

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
  };

  const getMousePos = (event) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    return { x: event.clientX - rect.left, y: event.clientY - rect.top };
  };

  // Tooltip helpers
  const hideTooltip = () => {
    if (tooltipHideTimeout.current) clearTimeout(tooltipHideTimeout.current);
    tooltipHideTimeout.current = setTimeout(() => {
      const tooltip = tooltipRef.current;
      if (tooltip) {
        tooltip.style.visibility = "hidden";
        tooltip.style.opacity = "0";
      }
    }, 200);
  };

  const showTooltip = (content, mouseEvent) => {
    if (tooltipHideTimeout.current) clearTimeout(tooltipHideTimeout.current);

    const tooltip = tooltipRef.current;
    tooltip.innerHTML = content;
    tooltip.style.position = "fixed";
    tooltip.style.left = `${mouseEvent.clientX + 15}px`;
    tooltip.style.top = `${mouseEvent.clientY + 15}px`;
    tooltip.style.visibility = "visible";
    tooltip.style.opacity = "1";
    tooltip.style.zIndex = "1000";
    tooltip.style.transition = "opacity 0.15s";
    tooltip.style.pointerEvents = "none";
  };

  const setIndustryHighlightByNode = (industryNode) => {
    if (!industryNode) {
      if (highlightIndustryRef.current) {
        highlightIndustryRef.current = null;
        highlightIndustryKeyRef.current = null;
        safeDraw();
      }
      return;
    }

    const key = industryNode.data.name;
    if (highlightIndustryKeyRef.current === key) return;

    highlightIndustryKeyRef.current = key;
    highlightIndustryRef.current = {
      x: industryNode.x0,
      y: industryNode.y0,
      w: industryNode.x1 - industryNode.x0,
      h: industryNode.y1 - industryNode.y0,
      name: key,
    };
    safeDraw();
  };

  // Re-layout when data/size changes
  useEffect(() => {
    if (!data || !hasPositiveSize()) {
      setRoot(null);
      return;
    }
    const treemapRoot = computeTreemap(data, logicalWidth, logicalHeight);
    setRoot(treemapRoot);

    hasDrawnRef.current = false;
    setHasDrawn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, logicalWidth, logicalHeight]);

  // Draw ASAP when root/size ready (prevents white-on-return)
  useLayoutEffect(() => {
    if (!canvasRef.current) return;
    safeDraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, logicalWidth, logicalHeight]);

  // After root set, fit & center
  useEffect(() => {
    if (!root || !hasPositiveSize()) return;

    const minS = getMinScale();
    if (targetScale.current < minS) {
      targetScale.current = minS;
      scale.current = minS;
    }
    const canvas = canvasRef.current;
    if (canvas) {
      targetTranslateX.current =
        (canvas.clientWidth - root.x1 * targetScale.current) / 2;
      targetTranslateY.current =
        (canvas.clientHeight - root.y1 * targetScale.current) / 2;
      translateX.current = targetTranslateX.current;
      translateY.current = targetTranslateY.current;
    }

    highlightIndustryRef.current = null;
    highlightIndustryKeyRef.current = null;

    clampPan();
    safeDraw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, logicalWidth, logicalHeight]);

  // First paint on mount & when becoming visible
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      safeDraw();
    });

    let io;
    if (canvasContainerRef.current && "IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            safeDraw();
          }
        },
        { root: null, threshold: 0.0 }
      );
      io.observe(canvasContainerRef.current);
    }

    return () => {
      cancelAnimationFrame(id);
      if (io) io.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redraw on page visibility / bfcache restore
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        safeDraw();
      }
    };
    const handlePageShow = () => {
      safeDraw();
    };

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pageshow", handlePageShow);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pageshow", handlePageShow);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Events
  useEffect(() => {
    const canvas = canvasRef.current;
    const tooltip = tooltipRef.current;
    if (!canvas || !tooltip) return;

    const onWheel = (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!root || !hasPositiveSize()) return;

      const zoomIntensity = 0.15;
      const wheel = e.deltaY < 0 ? 1 + zoomIntensity : 1 - zoomIntensity;

      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const minScale = getMinScale();
      const newScale = Math.min(
        Math.max(targetScale.current * wheel, minScale),
        zoomLimit
      );

      if (Math.abs(newScale - targetScale.current) < 0.001) return;

      targetTranslateX.current =
        mouseX -
        (mouseX - targetTranslateX.current) * (newScale / targetScale.current);
      targetTranslateY.current =
        mouseY -
        (mouseY - targetTranslateY.current) * (newScale / targetScale.current);

      targetScale.current = newScale;

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

      if (!animating.current) {
        animating.current = true;
        animateZoom();
      }
    };

    const onMouseMove = (e) => {
      if (mmRAFRef.current) return;
      mmRAFRef.current = requestAnimationFrame(() => {
        mmRAFRef.current = null;

        if (!hasPositiveSize()) return;

        const { x, y } = getMousePos(e);
        const mouseX = (x - translateX.current) / scale.current;
        const mouseY = (y - translateY.current) / scale.current;

        let hoveredCompany = null;
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
          const industryNode = hoveredCompany.node.parent;
          if (industryNode) setIndustryHighlightByNode(industryNode);

          const changeText =
            hoveredCompany.change !== null &&
            hoveredCompany.change !== undefined
              ? hoveredCompany.change > 0
                ? `+${hoveredCompany.change.toFixed(2)}%`
                : `${hoveredCompany.change.toFixed(2)}%`
              : "N/A";

          const valueText =
            hoveredCompany.value !== null && hoveredCompany.value !== undefined
              ? hoveredCompany.value.toFixed(2)
              : "N/A";

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
            </div>
          `;
          showTooltip(content, e);
          return;
        }

        const cur = highlightIndustryRef.current;
        if (
          cur &&
          mouseX >= cur.x &&
          mouseX <= cur.x + cur.w &&
          mouseY >= cur.y &&
          mouseY <= cur.y + cur.h
        ) {
          hideTooltip();
          return;
        }

        let foundIndustry = null;
        for (const ind of industryBoxes.current) {
          if (
            mouseX >= ind.x &&
            mouseX <= ind.x + ind.w &&
            mouseY >= ind.y &&
            mouseY <= ind.y + ind.h
          ) {
            foundIndustry = ind;
            break;
          }
        }
        if (foundIndustry && root) {
          const node = root.children?.find(
            (c) => c.data.name === foundIndustry.name
          );
          if (node) setIndustryHighlightByNode(node);
          hideTooltip();
          return;
        }

        setIndustryHighlightByNode(null);
        hideTooltip();
      });
    };

    const onMouseLeave = () => {
      setIndustryHighlightByNode(null);
      hideTooltip();
    };

    const onEnter = () => {
      safeDraw();
    };

    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseleave", onMouseLeave);
    canvas.addEventListener("mouseenter", onEnter);

    return () => {
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      canvas.removeEventListener("mouseenter", onEnter);

      if (tooltipHideTimeout.current) clearTimeout(tooltipHideTimeout.current);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (mmRAFRef.current) cancelAnimationFrame(mmRAFRef.current);
      if (retryRAFRef.current) cancelAnimationFrame(retryRAFRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, logicalWidth, logicalHeight]);

  return (
    <div className="w-full">
      <div
        ref={canvasContainerRef}
        className="relative border border-gray-300 rounded-lg overflow-hidden"
        style={{ height: `${logicalHeight}px` }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "#f8f9fa",
            transition: "opacity 0.1s ease-in-out",
            cursor: "default",
            display: "block", // avoids inline-block whitespace issues
          }}
        />
        {!hasDrawn && (
          <div
            className="absolute inset-0 bg-gray-50 flex items-center justify-center"
            style={{ backgroundColor: "#f8f9fa" }}
          >
            <div className="text-gray-500 text-sm">
              Loading visualization...
            </div>
          </div>
        )}
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        style={{
          position: "fixed",
          visibility: "hidden",
          opacity: 0,
          transition: "opacity 0.2s",
          zIndex: 1000,
          pointerEvents: "none",
        }}
      />
    </div>
  );
};

export default TreeMapCanvas;
