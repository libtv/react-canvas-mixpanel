import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

const width = window.innerWidth;
const height = window.innerHeight;
const a = 50;
const b = 200;

interface IPoint {
    x: number;
    y: number;
}

class Drawing implements IPoint {
    public x: number;
    public y: number;
    public radius = 5;
    public ctx: CanvasRenderingContext2D;
    public bigbang_x: number;
    public bigbang_y: number;
    public radian: number;
    public timeInterval = 0.05;

    constructor(x: number, i: number, ctx: CanvasRenderingContext2D, bigbang_x: number, bigbang_y: number) {
        this.x = x;
        this.radian = i * 0.58;
        this.y = a * Math.sin(this.radian) + b;
        this.ctx = ctx;
        this.bigbang_x = bigbang_x;
        this.bigbang_y = bigbang_y;
    }

    draw() {
        // Circle
        if (this.ctx !== undefined && this.ctx !== null) {
            this.ctx.beginPath();
            this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
            this.ctx.fill();
        }

        //LINE
        if (this.ctx !== undefined && this.ctx !== null) {
            this.ctx.beginPath();
            this.ctx.moveTo(this.bigbang_x, this.bigbang_y);
            this.ctx.lineTo(this.x, this.y);
            this.ctx.closePath();
            this.ctx.stroke();
        }
    }

    animate() {
        this.radian += this.timeInterval;
        this.y = a * Math.sin(this.radian) + b;

        this.draw();
    }
}

function App() {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);

    // math
    const bigbang_width = width / 2;
    const bigbang_height = height * (11 / 12);
    const circle_distance = width / 50;

    const resetCallback = useCallback(
        (ctx: CanvasRenderingContext2D) => {
            ctx.fillStyle = "#201f24";
            ctx.fillRect(0, 0, width, height);

            ctx.fillStyle = "#f7be34";
            ctx.arc(bigbang_width, bigbang_height, 50, 0, 2 * Math.PI, false);
            ctx.fill();
        },
        [ctx]
    );

    useEffect(() => {
        const canvas = canvasRef.current;

        if (canvas) {
            canvas.width = width;
            canvas.height = height;

            const context = canvas.getContext("2d");

            if (context) {
                resetCallback(context);
                setCtx(context);
            }
        }

        return () => {};
    }, [ctx]);

    let aniArr: Drawing[] = [];

    if (ctx) {
        ctx.strokeStyle = "#f8bc3b";
        ctx.fillStyle = "#f8bc3b";
        ctx.lineWidth = 0.5;
        for (let i = 0; i < 49; i++) {
            let x = circle_distance * i + 30;
            let a = new Drawing(x, i, ctx, bigbang_width, bigbang_height);
            aniArr.push(a);
        }
    }

    const animate = () => {
        if (ctx) {
            resetCallback(ctx);

            aniArr.map((draw) => {
                draw.animate();
            });
        }
    };

    let requestId: number;
    const requestAnimation = () => {
        requestId = window.requestAnimationFrame(requestAnimation);

        if (ctx) {
            animate();
        }
    };
    requestAnimation();

    return (
        <div className="canvas_wrap">
            <canvas ref={canvasRef}></canvas>
        </div>
    );
}

export default App;
