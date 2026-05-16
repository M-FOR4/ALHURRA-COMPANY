"use client";

import { useState, useEffect, useRef } from "react";

export default function TestPage() {
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [logs, setLogs] = useState<string[]>([]);
    const vanillaBtnRef = useRef<HTMLButtonElement>(null);

    const addLog = (msg: string) => {
        setLogs((prev) => [...prev.slice(-4), `${new Date().toLocaleTimeString()} - ${msg}`]);
    };

    useEffect(() => {
        addLog("Component Mounted");

        // Vanilla JS Event Listener
        const btn = vanillaBtnRef.current;
        if (btn) {
            const handleVanillaClick = (e: Event) => {
                e.preventDefault();
                addLog("Vanilla JS Clicked!");
                setActiveMenu(prev => prev === "vanilla" ? null : "vanilla");
            };

            // Use both click and touchend
            btn.addEventListener("click", handleVanillaClick);
            btn.addEventListener("touchend", handleVanillaClick);

            return () => {
                btn.removeEventListener("click", handleVanillaClick);
                btn.removeEventListener("touchend", handleVanillaClick);
            };
        }
    }, []);

    return (
        <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", padding: 20 }}>
            <h1 style={{ fontSize: 24, marginBottom: 20 }}>Mobile Click Debugger v4</h1>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                {/* Method 1: React onClick */}
                <div style={{ border: "1px solid #334155", padding: 16, borderRadius: 8 }}>
                    <h2 style={{ fontSize: 16, marginBottom: 10 }}>1. Standard React onClick</h2>
                    <button
                        onClick={() => {
                            addLog("React onClick fired");
                            setActiveMenu(activeMenu === "react" ? null : "react");
                        }}
                        style={{ padding: "12px 24px", background: "#f97316", color: "white", borderRadius: 8, cursor: "pointer" }}
                    >
                        Click Me (React)
                    </button>
                    {activeMenu === "react" && <div style={{ marginTop: 10, padding: 10, background: "white", color: "black" }}>React Menu OPEN</div>}
                </div>

                {/* Method 2: React onTouchStart */}
                <div style={{ border: "1px solid #334155", padding: 16, borderRadius: 8 }}>
                    <h2 style={{ fontSize: 16, marginBottom: 10 }}>2. React onTouchStart</h2>
                    <div
                        onTouchStart={() => {
                            addLog("React onTouchStart fired");
                            setActiveMenu(activeMenu === "touch" ? null : "touch");
                        }}
                        style={{ padding: "12px 24px", background: "#3b82f6", color: "white", borderRadius: 8, display: "inline-block" }}
                    >
                        Touch Me (Div)
                    </div>
                    {activeMenu === "touch" && <div style={{ marginTop: 10, padding: 10, background: "white", color: "black" }}>Touch Menu OPEN</div>}
                </div>

                {/* Method 3: Vanilla JS Listener */}
                <div style={{ border: "1px solid #334155", padding: 16, borderRadius: 8 }}>
                    <h2 style={{ fontSize: 16, marginBottom: 10 }}>3. Vanilla JS Event</h2>
                    <button
                        ref={vanillaBtnRef}
                        style={{ padding: "12px 24px", background: "#10b981", color: "white", borderRadius: 8, cursor: "pointer" }}
                    >
                        Click Me (Vanilla)
                    </button>
                    {activeMenu === "vanilla" && <div style={{ marginTop: 10, padding: 10, background: "white", color: "black" }}>Vanilla Menu OPEN</div>}
                </div>

                {/* Method 4: CSS ONLY Checkbox Hack */}
                <div style={{ border: "1px solid #334155", padding: 16, borderRadius: 8 }}>
                    <h2 style={{ fontSize: 16, marginBottom: 10 }}>4. CSS Only (No JS)</h2>
                    <style dangerouslySetInnerHTML={{
                        __html: `
            .css-hack-menu { display: none; margin-top: 10px; padding: 10px; background: white; color: black; }
            #css-toggle { display: none; }
            #css-toggle:checked ~ .css-hack-menu { display: block; }
          `}} />
                    <div>
                        <label htmlFor="css-toggle" style={{ padding: "12px 24px", background: "#a855f7", color: "white", borderRadius: 8, cursor: "pointer", display: "inline-block" }} onClick={() => addLog("CSS Label Clicked")}>
                            Toggle Me (CSS)
                        </label>
                        <input type="checkbox" id="css-toggle" />
                        <div className="css-hack-menu">CSS Menu OPEN</div>
                    </div>
                </div>

                {/* Method 5: Plain Inline Script */}
                <div style={{ border: "1px solid #334155", padding: 16, borderRadius: 8 }}>
                    <h2 style={{ fontSize: 16, marginBottom: 10 }}>5. Native Script Status</h2>
                    <div id="raw-js-status" style={{ padding: "12px 24px", background: "red", color: "white", borderRadius: 8, display: "inline-block", fontWeight: "bold" }}>
                        IF RED, JS IS DEAD ☠️
                    </div>
                    <script dangerouslySetInnerHTML={{
                        __html: `
              document.addEventListener('DOMContentLoaded', function() {
                var el = document.getElementById('raw-js-status');
                if(el) {
                  el.innerHTML = 'JS IS ALIVE 🚀';
                  el.style.backgroundColor = 'green';
                  el.onclick = function() { alert('JS Click Works!'); };
                }
              });
            `
                    }} />
                </div>

            </div>

            {/* Logs Console */}
            <div style={{ marginTop: 30, padding: 16, background: "black", borderRadius: 8, fontFamily: "monospace", fontSize: 12 }}>
                <h3 style={{ color: "#0f0", marginBottom: 10 }}>Event Logs:</h3>
                {logs.map((log, i) => <div key={i}>{log}</div>)}
                {logs.length === 0 && <div style={{ opacity: 0.5 }}>No events recorded yet...</div>}
            </div>
        </div>
    );
}
