"use client";

import * as d3 from "d3";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

  const legendItems = [
    { range: '≥ 3%', color: '#2cce5a', type: 'positive' },
    { range: '2% to 3%', color: '#359347', type: 'positive' },
    { range: '1% to 2%', color: '#35764e', type: 'positive' },
    { range: '0.1% to 1%', color: '#2d5c3a', type: 'positive' },
    { range: '0%', color: '#45454e', type: 'neutral' },
    { range: '-0.1% to 0%', color: '#6b3538', type: 'negative' },
    { range: '-1% to -0.1%', color: '#8a444e', type: 'negative' },
    { range: '-2% to -1%', color: '#c04342', type: 'negative' },
    { range: '≤ -3%', color: '#f5353a', type: 'negative' },
  ];

const TreeMapCanvas = ({ data }) => {
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const canvasContainerRef = useRef(null);
  const backCanvasRef = useRef(null);
  const backCtxRef = useRef(null);

  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  const [root, setRoot] = useState(null);
  const [hasDrawn, setHasDrawn] = useState(false);

  const boxesRef = useRef([]);
  const industryBoxesRef = useRef([]);
  const highlightIndustryRef = useRef(null);
  const tooltipTimeoutRef = useRef(null);
  const animationFrameRef = useRef(null);
  const mmRAFRef = useRef(null);
  
  const transformRef = useRef({
    scale: 1,
    translateX: 0,
    translateY: 0,
    targetScale: 1,
    targetTranslateX: 0,
    targetTranslateY: 0,
    animating: false
  });

  const dragRef = useRef({
    isDragging: false,
    startX: 0,
    startY: 0,
    startTranslateX: 0,
    startTranslateY: 0
  });

  const ZOOM_LIMIT = 3;
  const ZOOM_INTENSITY = 0.15;
  
const getColorFromChange = useCallback((change) => {
  if (change === null || change === undefined) return '#45454e';
  
  if (change >= 3) return '#2cce5a';
  if (change >= 2 && change < 3) return '#359347';
  if (change >= 1 && change < 2) return '#35764e';
  if (change >= 0.1 && change < 1) return '#2d5c3a';
  if (change === 0) return '#45454e';
  if (change <= -3) return '#f5353a';
  if (change > -3 && change <= -2) return '#c04342';
  if (change > -2 && change <= -1) return '#8a444e';
  if (change > -1 && change < 0) return '#6b3538';
  
  return '#45454e';
}, []);



  const hasPositiveSize = useCallback(() => 
    canvasSize.width > 0 && canvasSize.height > 0, 
    [canvasSize]
  );

  const getMinScale = useCallback(() => {
    if (!root || !canvasRef.current || !hasPositiveSize()) return 1;
    return Math.min(
      canvasRef.current.clientWidth / root.x1,
      canvasRef.current.clientHeight / root.y1
    );
  }, [root, hasPositiveSize]);

  const setupCanvases = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasPositiveSize()) return false;

    const dpr = window.devicePixelRatio || 1;
    const { width, height } = canvasSize;
    const w = width * dpr;
    const h = height * dpr;

    if (w === 0 || h === 0) return false;

    const vctx = canvas.getContext("2d", { alpha: false });
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    vctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    vctx.fillStyle = "#f8f9fa";
    vctx.fillRect(0, 0, width, height);

    if (!backCanvasRef.current) {
      backCanvasRef.current = document.createElement("canvas");
      backCtxRef.current = backCanvasRef.current.getContext("2d", { alpha: false });
    }
    const bcanvas = backCanvasRef.current;
    const bctx = backCtxRef.current;
    
    bcanvas.width = w;
    bcanvas.height = h;
    bctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    return true;
  }, [canvasSize, hasPositiveSize]);

  const drawRoundedRect = useCallback((ctx, x, y, w, h, r) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }, []);

 const computeTreemap = useCallback((inputData, width, height) => {
  return d3.treemap()
    .size([width, height])
    .paddingOuter(2)                             
    .paddingTop(node => node.depth === 0 ? 2 : 18) 
    .round(true)(
      d3.hierarchy(inputData)
        .sum(d => d.value || 0)
        .sort((a, b) => (b.value || 0) - (a.value || 0))
    );
}, []);

  const drawTreemap = useCallback(() => {
    if (!hasPositiveSize() || !root) return;

    const bcanvas = backCanvasRef.current;
    const bctx = backCtxRef.current;
    if (!bcanvas || !bctx || bcanvas.width === 0) return;

    const { scale, translateX, translateY } = transformRef.current;
    const { width, height } = canvasSize;

    bctx.fillStyle = "#f8f9fa";
    bctx.fillRect(0, 0, width, height);
    bctx.save();
    bctx.translate(translateX, translateY);
    bctx.scale(scale, scale);

    boxesRef.current = [];
    industryBoxesRef.current = [];

    root.each((d) => {
      const x = d.x0, y = d.y0, w = d.x1 - d.x0, h = d.y1 - d.y0;

      if (d.depth === 2) {
        bctx.save();
        drawRoundedRect(bctx, x, y, w, h, 3);
        bctx.fillStyle = getColorFromChange(d.data.change);
        bctx.fill();
        bctx.strokeStyle = "#fff";
        bctx.lineWidth = 1;
        bctx.stroke();

        const cx = x + w / 2, cy = y + h / 2;
        bctx.fillStyle = "#fff";
        bctx.textAlign = "center";
        bctx.textBaseline = "middle";
        
        const symbol = d.data.name || "";
        if (w > bctx.measureText(symbol).width + 8 && h > 20) {
          bctx.font = "bold 12px sans-serif";
          if (h > 35) {
            bctx.fillText(symbol, cx, cy - 8);
            bctx.font = "10px sans-serif";
            const change = d.data.change ?? 0;
            bctx.fillText(change > 0 ? `+${change.toFixed(1)}%` : `${change.toFixed(1)}%`, cx, cy + 8);
          } else {
            bctx.fillText(symbol, cx, cy);
          }
        }
        bctx.restore();

        boxesRef.current.push({
          x, y, w, h, node: d,
          name: d.data.name,
          value: d.data.value,
          change: d.data.change,
          sector: d.parent.data.name
        });
      }
    });

    const hi = highlightIndustryRef.current;
    if (hi) {
      bctx.strokeStyle = "#FFD700";
      bctx.lineWidth = 3;
      bctx.strokeRect(hi.x, hi.y, hi.w, hi.h);
    }

    root.each((d) => {
      const x = d.x0, y = d.y0, w = d.x1 - d.x0;

      if (d.depth === 1) {
        const boxHeight = 18;
        const boxX = x;
        const boxY = y;
        const boxWidth = w;

        const isHighlighted = hi && hi.name === d.data.name;

        bctx.save();
        bctx.fillStyle = isHighlighted ? "#FFD700" : "#fff";
        bctx.strokeStyle = isHighlighted ? "#FFA500" : "#070707";
        bctx.lineWidth = isHighlighted ? 2 : 1.5;
        bctx.fillRect(boxX, boxY, boxWidth, boxHeight);
        bctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
        
        bctx.fillStyle = isHighlighted ? "#000" : "#070707";
        bctx.font = "bold 11px sans-serif";
        bctx.textAlign = "left";
        bctx.textBaseline = "middle";
        bctx.fillText(d.data.name, boxX + 8, boxY + boxHeight / 2);

        const arrowX = boxX + 12;
        const arrowY = boxY + boxHeight;
        const arrowWidth = 12;
        const arrowHeight = 8;
        
        bctx.beginPath();
        bctx.moveTo(arrowX, arrowY + arrowHeight);
        bctx.lineTo(arrowX - arrowWidth / 2, arrowY);
        bctx.lineTo(arrowX + arrowWidth / 2, arrowY);
        bctx.closePath();
        bctx.fillStyle = isHighlighted ? "#FFD700" : "#070707";
        bctx.fill();
        
        bctx.restore();
        industryBoxesRef.current.push({ x, y, w, h: d.y1 - d.y0, name: d.data.name, node: d });
      }
    });

    bctx.restore();

    const canvas = canvasRef.current;
    const vctx = canvas.getContext("2d");
    vctx.fillStyle = "#f8f9fa";
    vctx.fillRect(0, 0, width, height);
    vctx.drawImage(bcanvas, 0, 0);

    if (!hasDrawn) setHasDrawn(true);
  }, [hasPositiveSize, root, canvasSize, drawRoundedRect, hasDrawn, getColorFromChange]);

  const safeDraw = useCallback(() => {
    if (!setupCanvases()) {
      requestAnimationFrame(safeDraw);
      return;
    }
    drawTreemap();
  }, [setupCanvases, drawTreemap]);

  const clampPan = useCallback(() => {
    if (!root || !canvasRef.current || !hasPositiveSize()) return;
    
    const t = transformRef.current;
    const { clientWidth, clientHeight } = canvasRef.current;
    
    const minX = clientWidth - root.x1 * t.scale;
    const minY = clientHeight - root.y1 * t.scale;
    
    t.translateX = Math.max(Math.min(t.translateX, 0), minX);
    t.translateY = Math.max(Math.min(t.translateY, 0), minY);
    t.targetTranslateX = t.translateX;
    t.targetTranslateY = t.translateY;
  }, [root, hasPositiveSize]);

  const animateZoom = useCallback(() => {
    const t = transformRef.current;
    const dx = t.targetTranslateX - t.translateX;
    const dy = t.targetTranslateY - t.translateY;
    const ds = t.targetScale - t.scale;

    const ease = Math.min(0.12 + (Math.hypot(dx, dy) + Math.abs(ds)) * 0.001, 0.25);

    if (Math.abs(dx) > 0.1 || Math.abs(dy) > 0.1 || Math.abs(ds) > 0.001) {
      t.translateX += dx * ease;
      t.translateY += dy * ease;
      t.scale += ds * ease;
      safeDraw();
      animationFrameRef.current = requestAnimationFrame(animateZoom);
    } else {
      t.translateX = t.targetTranslateX;
      t.translateY = t.targetTranslateY;
      t.scale = t.targetScale;
      clampPan();
      safeDraw();
      t.animating = false;
    }
  }, [safeDraw, clampPan]);

  const hideTooltip = useCallback(() => {
    clearTimeout(tooltipTimeoutRef.current);
    tooltipTimeoutRef.current = setTimeout(() => {
      if (tooltipRef.current) {
        tooltipRef.current.style.visibility = "hidden";
        tooltipRef.current.style.opacity = "0";
      }
    }, 200);
  }, []);

  const showTooltip = useCallback((content, e) => {
    clearTimeout(tooltipTimeoutRef.current);
    const tooltip = tooltipRef.current;
    tooltip.innerHTML = content;
    tooltip.style.cssText = `position:fixed;left:${e.clientX+15}px;top:${e.clientY+15}px;visibility:visible;opacity:1;z-index:1000;pointer-events:none;transition:opacity 0.15s`;
  }, []);

  useEffect(() => {
    if (!canvasContainerRef.current) return;
    
    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      const w = Math.max(0, Math.round(entry.contentRect.width));
      const h = Math.max(0, Math.round(window.innerHeight * 0.72));
      setCanvasSize(prev => prev.width === w && prev.height === h ? prev : { width: w, height: h });
    });
    
    ro.observe(canvasContainerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!data || !hasPositiveSize()) {
      setRoot(null);
      return;
    }
    setRoot(computeTreemap(data, canvasSize.width, canvasSize.height));
    setHasDrawn(false);
  }, [data, canvasSize, hasPositiveSize, computeTreemap]);

  useLayoutEffect(() => {
    if (canvasRef.current) safeDraw();
  }, [root, canvasSize, safeDraw]);

  useEffect(() => {
    if (!root || !hasPositiveSize()) return;
    
    const t = transformRef.current;
    const minS = getMinScale();
    t.targetScale = t.scale = Math.max(minS, t.scale);
    
    if (canvasRef.current) {
      const { clientWidth, clientHeight } = canvasRef.current;
      t.targetTranslateX = t.translateX = (clientWidth - root.x1 * t.scale) / 2;
      t.targetTranslateY = t.translateY = (clientHeight - root.y1 * t.scale) / 2;
    }
    
    highlightIndustryRef.current = null;
    clampPan();
    safeDraw();
  }, [root, hasPositiveSize, getMinScale, clampPan, safeDraw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onWheel = (e) => {
      e.preventDefault();
      if (!root || !hasPositiveSize()) return;

      const t = transformRef.current;
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const wheel = e.deltaY < 0 ? 1 + ZOOM_INTENSITY : 1 - ZOOM_INTENSITY;
      const newScale = Math.max(getMinScale(), Math.min(t.targetScale * wheel, ZOOM_LIMIT));

      if (Math.abs(newScale - t.targetScale) < 0.001) return;

      t.targetTranslateX = mouseX - (mouseX - t.targetTranslateX) * (newScale / t.targetScale);
      t.targetTranslateY = mouseY - (mouseY - t.targetTranslateY) * (newScale / t.targetScale);
      t.targetScale = newScale;

      const minX = canvas.clientWidth - root.x1 * newScale;
      const minY = canvas.clientHeight - root.y1 * newScale;
      t.targetTranslateX = Math.max(Math.min(t.targetTranslateX, 0), minX);
      t.targetTranslateY = Math.max(Math.min(t.targetTranslateY, 0), minY);

      if (!t.animating) {
        t.animating = true;
        animateZoom();
      }
    };

    const onMouseDown = (e) => {
      const drag = dragRef.current;
      const t = transformRef.current;
      
      drag.isDragging = true;
      drag.startX = e.clientX;
      drag.startY = e.clientY;
      drag.startTranslateX = t.translateX;
      drag.startTranslateY = t.translateY;
      
      canvas.style.cursor = 'grabbing';
    };

    const onMouseMove = (e) => {
      const drag = dragRef.current;
      
      if (drag.isDragging) {
        const t = transformRef.current;
        const dx = e.clientX - drag.startX;
        const dy = e.clientY - drag.startY;
        
        t.translateX = drag.startTranslateX + dx;
        t.translateY = drag.startTranslateY + dy;
        t.targetTranslateX = t.translateX;
        t.targetTranslateY = t.translateY;
        
        clampPan();
        safeDraw();
        return;
      }

      if (mmRAFRef.current) return;
      mmRAFRef.current = requestAnimationFrame(() => {
        mmRAFRef.current = null;
        if (!hasPositiveSize()) return;

        const rect = canvas.getBoundingClientRect();
        const t = transformRef.current;
        const mouseX = (e.clientX - rect.left - t.translateX) / t.scale;
        const mouseY = (e.clientY - rect.top - t.translateY) / t.scale;

        const hovered = boxesRef.current.find(b => 
          mouseX >= b.x && mouseX <= b.x + b.w && mouseY >= b.y && mouseY <= b.y + b.h
        );

        if (hovered) {
          highlightIndustryRef.current = {
            x: hovered.node.parent.x0,
            y: hovered.node.parent.y0,
            w: hovered.node.parent.x1 - hovered.node.parent.x0,
            h: hovered.node.parent.y1 - hovered.node.parent.y0,
            name: hovered.sector
          };
          safeDraw();

          const changeText = hovered.change != null
            ? (hovered.change > 0 ? `+${hovered.change.toFixed(2)}%` : `${hovered.change.toFixed(2)}%`)
            : "N/A";
          
          showTooltip(`
            <div style="padding:12px;background:rgba(0,0,0,0.95);color:#fff;border-radius:8px;font-size:13px;max-width:280px;box-shadow:0 8px 32px rgba(0,0,0,0.3);border:1px solid rgba(255,255,255,0.1)">
              <div style="font-weight:bold;margin-bottom:6px;color:#ffd700;font-size:12px">${hovered.sector}</div>
              <div style="font-weight:bold;margin-bottom:6px;font-size:15px;color:#87ceeb">${hovered.name}</div>
              <div style="margin-bottom:3px;color:#e2e8f0">Value: <span style="color:#87ceeb;font-weight:bold">${hovered.value?.toFixed(2) || 'N/A'}</span></div>
              <div style="color:#e2e8f0">Change: <span style="color:${hovered.change > 0 ? '#4ade80' : '#f87171'};font-weight:bold">${changeText}</span></div>
            </div>
          `, e);
          return;
        }

        highlightIndustryRef.current = null;
        safeDraw();
        hideTooltip();
      });
    };

    const onMouseUp = () => {
      dragRef.current.isDragging = false;
      canvas.style.cursor = 'grab';
    };

    const onMouseLeave = () => {
      dragRef.current.isDragging = false;
      canvas.style.cursor = 'default';
      highlightIndustryRef.current = null;
      safeDraw();
      hideTooltip();
    };

    canvas.style.cursor = 'grab';

    canvas.addEventListener("wheel", onWheel, { passive: false });
    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mouseleave", onMouseLeave);

    return () => {
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup", onMouseUp);
      canvas.removeEventListener("mouseleave", onMouseLeave);
      clearTimeout(tooltipTimeoutRef.current);
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mmRAFRef.current) cancelAnimationFrame(mmRAFRef.current);
    };
  }, [root, hasPositiveSize, getMinScale, animateZoom, safeDraw, showTooltip, hideTooltip, clampPan]);

  return (
    <div className="w-full">
      <div
        ref={canvasContainerRef}
        className="relative border border-gray-300 rounded-lg overflow-hidden"
        style={{height: `${canvasSize.height}px`}}
      >
        <canvas ref={canvasRef} className="w-full h-full bg-[#f8f9fa] block" />
        {!hasDrawn && (
          <div className="absolute inset-0 bg-gray-50 flex items-center justify-center">
            <div className="text-gray-500 text-sm">Loading visualization...</div>
          </div>
        )}
      </div>
       <div className="mt-4 flex items-center justify-center gap-2 flex-wrap">
        {legendItems.map((item, index) => (
            <div
            key={index}
              className="w-20 h-6 rounded border border-gray-300 flex items-center justify-center gap-1"
              style={{ backgroundColor: item.color }}
            >
              <span className="text-xs text-white font-semibold">{item.range}</span>
            </div>
        ))}
      </div>
      <div ref={tooltipRef} />
    </div>
  );
};

export default TreeMapCanvas;
