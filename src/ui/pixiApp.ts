import * as PIXI from 'pixi.js';

export class PixiApp {
    app = new PIXI.Application<HTMLCanvasElement>({
        backgroundColor: 0xEBF8FF,
        resolution: window.devicePixelRatio || 1,
        resizeTo: window
    });

    cleanUp() {
        this.app.stage.children.forEach(e => {
            this.app.stage.removeChild(e);
        });
    }

    get view() {
        return this.app.view;
    }
}