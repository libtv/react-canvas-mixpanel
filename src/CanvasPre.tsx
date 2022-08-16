import React, { useCallback, useEffect, useRef, useState } from "react";

interface Array {
    x: number;
    y: number;
}

function CanvasPre() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
    const [toggle, setToggle] = useState(false);
    const array: Array[] = [];

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            canvas.width = window.innerWidth * 0.5;
            canvas.height = window.innerHeight;

            const context = canvas.getContext("2d");

            if (context) {
                context.strokeStyle = "blue";
                context.lineWidth = 2.5;
                context.fillStyle = "black";
                context.fillRect(0, 0, canvas.width, canvas.height);
                setCtx(context);
            }
        }

        return () => {};
    }, []);

    const canvasEventLinstener = useCallback(
        (type: string) => {
            return (event: React.MouseEvent) => {
                let x = event.clientX;
                let y = event.clientY;

                if (type === "leave") setToggle(false);
                if (type === "up") setToggle(false);
                if (type === "down") setToggle(true);
                if (type === "move") {
                    if (toggle) {
                        if (array.length === 0) {
                            array.push({ x, y });
                        } else {
                            ctx?.save();
                            ctx?.beginPath();
                            ctx?.moveTo(array[array.length - 1].x, array[array.length - 1].y);
                            ctx?.lineTo(x, y);
                            ctx?.closePath();
                            ctx?.stroke();
                            ctx?.restore();
                            array.push({ x, y });
                        }
                    }
                }
            };
        },
        [ctx, toggle]
    );

    return (
        <div className="canvas_wrap">
            <canvas ref={canvasRef} onMouseDown={canvasEventLinstener("down")} onMouseMove={canvasEventLinstener("move")} onMouseLeave={canvasEventLinstener("leave")} onMouseUp={canvasEventLinstener("up")}></canvas>
        </div>
    );
}

export default CanvasPre;
