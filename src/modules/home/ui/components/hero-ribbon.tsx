"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

export function HeroRibbon() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisabled(true);
      return;
    }

    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      setDisabled(true);
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    const size = () => {
      const rect = mount.getBoundingClientRect();
      return { w: Math.max(1, rect.width), h: Math.max(1, rect.height) };
    };

    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    renderer.setPixelRatio(dpr);
    renderer.setClearColor(0x000000, 0);
    const initial = size();
    renderer.setSize(initial.w, initial.h, false);
    mount.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);
    const key = new THREE.DirectionalLight(0xffffff, 1.1);
    key.position.set(3, 4, 5);
    scene.add(key);
    const warm = new THREE.PointLight(0xff5b2e, 1.4, 20);
    warm.position.set(-2, -1, 3);
    scene.add(warm);

    const group = new THREE.Group();
    scene.add(group);

    class OrbitCurve extends THREE.Curve<THREE.Vector3> {
      constructor(public radius: number) { super(); }
      getPoint(t: number, target: THREE.Vector3 = new THREE.Vector3()): THREE.Vector3 {
        const a = t * Math.PI * 2;
        const x = Math.cos(a) * this.radius;
        const y = Math.sin(a * 2) * 0.35 * this.radius;
        const z = Math.sin(a) * this.radius * 0.6;
        return target.set(x, y, z);
      }
    }
    const makeRibbon = (radius: number, tubeRadius: number, twist: number, color: number, opacity: number) => {
      const curve = new OrbitCurve(radius);
      const geo = new THREE.TubeGeometry(curve, 220, tubeRadius, 24, true);
      const mat = new THREE.MeshStandardMaterial({
        color,
        metalness: 0.25,
        roughness: 0.35,
        transparent: opacity < 1,
        opacity,
        side: THREE.DoubleSide,
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.z = twist;
      return { mesh, geo, mat };
    };

    const r1 = makeRibbon(1.65, 0.08, 0.2, 0xff5b2e, 1);
    const r2 = makeRibbon(1.95, 0.045, -0.6, 0xff8a63, 0.9);
    const r3 = makeRibbon(2.2, 0.025, 1.1, 0x0e0e10, 0.65);
    group.add(r1.mesh, r2.mesh, r3.mesh);

    const coreGeo = new THREE.IcosahedronGeometry(0.5, 1);
    const coreMat = new THREE.MeshStandardMaterial({ color: 0x0e0e10, metalness: 0.6, roughness: 0.25 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    group.add(core);

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    const onMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      pointer.tx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.ty = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    const onLeave = () => {
      pointer.tx = 0;
      pointer.ty = 0;
    };
    mount.addEventListener("pointermove", onMove, { passive: true });
    mount.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);

    let visible = true;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) visible = e.isIntersecting;
      },
      { threshold: 0.05 }
    );
    io.observe(mount);

    let docVisible = !document.hidden;
    const onVis = () => { docVisible = !document.hidden; };
    document.addEventListener("visibilitychange", onVis);

    const resize = () => {
      if (!renderer) return;
      const { w, h } = size();
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    const clock = new THREE.Clock();
    let frame = 0;
    const tick = () => {
      frame = requestAnimationFrame(tick);
      if (!visible || !docVisible) return;
      const dt = clock.getDelta();
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      group.rotation.y += dt * 0.25;
      group.rotation.x = pointer.y * 0.4;
      group.rotation.z = -pointer.x * 0.2;
      r1.mesh.rotation.x -= dt * 0.4;
      r2.mesh.rotation.y += dt * 0.5;
      r3.mesh.rotation.z += dt * 0.3;
      core.rotation.y += dt * 0.6;
      renderer!.render(scene, camera);
    };
    frame = requestAnimationFrame(tick);

    const onLost = (e: Event) => { e.preventDefault(); setDisabled(true); };
    renderer.domElement.addEventListener("webglcontextlost", onLost);

    return () => {
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      mount.removeEventListener("pointermove", onMove);
      mount.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      renderer?.domElement.removeEventListener("webglcontextlost", onLost);
      [r1, r2, r3].forEach(({ geo, mat }) => { geo.dispose(); mat.dispose(); });
      coreGeo.dispose();
      coreMat.dispose();
      renderer?.dispose();
      if (renderer?.domElement && renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
      renderer = null;
    };
  }, []);

  return (
    <div ref={mountRef} className="ribbon-wrap" aria-hidden="true">
      {disabled && (
        <div className="ribbon-poster rounded-full">
          <div className="w-[70%] h-[70%] rounded-full border border-[rgba(14,14,16,0.1)]" />
        </div>
      )}
    </div>
  );
}
