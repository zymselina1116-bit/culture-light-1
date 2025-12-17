// ========================================
// PANEL CREATOR MODULE
// ========================================
class PanelCreator {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.brushSize = 20;
        this.hasDrawn = false;

        this.setupDrawing();
    }

    setupDrawing() {
        this.canvas.addEventListener('mousedown', (e) => this.startDrawing(e));
        this.canvas.addEventListener('mousemove', (e) => this.draw(e));
        this.canvas.addEventListener('mouseup', () => this.stopDrawing());
        this.canvas.addEventListener('mouseout', () => this.stopDrawing());

        // Touch support
        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousedown', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent('mousemove', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            this.canvas.dispatchEvent(mouseEvent);
        });

        this.canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            const mouseEvent = new MouseEvent('mouseup', {});
            this.canvas.dispatchEvent(mouseEvent);
        });
    }

    startDrawing(e) {
        this.isDrawing = true;
        this.hasDrawn = true;
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.ctx.beginPath();
        this.ctx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
        this.ctx.fillStyle = '#000000';
        this.ctx.fill();
    }

    draw(e) {
        if (!this.isDrawing) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.ctx.lineTo(x, y);
        this.ctx.lineWidth = this.brushSize;
        this.ctx.lineCap = 'round';
        this.ctx.strokeStyle = '#000000';
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(x, y, this.brushSize / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    stopDrawing() {
        this.isDrawing = false;
        this.ctx.beginPath();
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.hasDrawn = false;
    }

    setBrushSize(size) {
        this.brushSize = size;
    }


    getImageData() {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
}


// ========================================
// LANTERN RENDERER WITH DRAG INTERACTION
// ========================================
class LanternRenderer {
    constructor(canvasId, panelImage) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.panelImage = panelImage;

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Lantern properties
        this.rotation = 0;
        this.rotationVelocity = 0;
        this.panelCount = 8;
        this.lanternSize = 200; // Fixed 200px width

        // Drag interaction
        this.isDragging = false;
        this.lastMouseX = 0;

        // Split layout
        this.splitRatio = 0.3; // 30% left dark, 70% right white
        this.wallX = 0;

        // Lantern position (bottom-left corner)
        this.lanternX = 40;
        this.lanternY = 0;

        this.setupInteraction();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.wallX = this.canvas.width * this.splitRatio;
        this.lanternY = this.canvas.height - 50; // Closer to bottom
    }

    setupInteraction() {
        this.canvas.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        window.addEventListener('mouseup', () => this.handleMouseUp());

        this.canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.handleMouseDown({clientX: touch.clientX, clientY: touch.clientY});
        });

        window.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.handleMouseMove({clientX: touch.clientX, clientY: touch.clientY});
        });

        window.addEventListener('touchend', () => this.handleMouseUp());
    }

    handleMouseDown(e) {
        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check if click is on lantern area
        const dx = x - this.lanternX;
        const dy = y - this.lanternY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 60) { // Click within lantern area
            this.isDragging = true;
            this.lastMouseX = x;
            this.rotationVelocity = 0;
        }
    }

    handleMouseMove(e) {
        if (!this.isDragging) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;

        const deltaX = x - this.lastMouseX;
        this.rotationVelocity = deltaX * 0.02; // Drag speed determines rotation
        this.rotation += this.rotationVelocity;

        this.lastMouseX = x;
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    animate() {
        // Apply friction/ease-out when not dragging
        if (!this.isDragging) {
            this.rotation += this.rotationVelocity;
            this.rotationVelocity *= 0.95; // Friction

            if (Math.abs(this.rotationVelocity) < 0.001) {
                this.rotationVelocity = 0;
            }
        }

        this.render();
        requestAnimationFrame(() => this.animate());
    }

    render() {
        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw split background
        // Left 30% - dark
        this.ctx.fillStyle = '#1A1A1A';
        this.ctx.fillRect(0, 0, this.wallX, this.canvas.height);

        // Right 70% - white wall
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(this.wallX, 0, this.canvas.width - this.wallX, this.canvas.height);

        // Draw shadow on white wall
        this.renderShadow();

        // Draw lantern in bottom-left
        this.renderLantern();
    }

    renderLantern() {
        this.ctx.save();
        this.ctx.translate(this.lanternX, this.lanternY);

        const radius = 30;
        const height = 60;

        // Create panels array with depth
        const panels = [];
        for (let i = 0; i < this.panelCount; i++) {
            const angle = (i / this.panelCount) * Math.PI * 2 + this.rotation;
            const nextAngle = ((i + 1) / this.panelCount) * Math.PI * 2 + this.rotation;

            const x1 = Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;
            const x2 = Math.cos(nextAngle) * radius;
            const z2 = Math.sin(nextAngle) * radius;

            panels.push({
                x1, z1, x2, z2,
                avgZ: (z1 + z2) / 2,
                index: i
            });
        }

        // Sort back to front
        panels.sort((a, b) => a.avgZ - b.avgZ);

        // Draw panels
        for (const panel of panels) {
            this.renderPanel(panel, height, radius);
        }

        this.ctx.restore();
    }

    renderPanel(panel, height, radius) {
        const {x1, z1, x2, z2} = panel;
        const y1 = -height / 2;
        const y2 = height / 2;

        // Panel brightness based on angle
        const avgZ = (z1 + z2) / 2;
        const brightness = Math.max(0.3, (avgZ + radius) / (radius * 2));

        // Draw panel outline
        this.ctx.strokeStyle = `rgba(180, 180, 180, ${brightness})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.lineTo(x1, y2);
        this.ctx.closePath();
        this.ctx.stroke();

        // Draw panel texture if facing forward
        if (avgZ > 0) {
            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.moveTo(x1, y1);
            this.ctx.lineTo(x2, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.lineTo(x1, y2);
            this.ctx.closePath();
            this.ctx.clip();

            const panelWidth = Math.abs(x2 - x1);
            this.ctx.globalAlpha = brightness * 0.6;
            this.ctx.drawImage(
                this.panelImage,
                Math.min(x1, x2), y1,
                panelWidth, height
            );

            this.ctx.restore();
        }
    }

    renderShadow() {
        const shadowScale = 2.0; // Adjusted for better proportion
        const shadowX = this.canvas.width / 2; // Center of screen
        const shadowY = this.canvas.height / 2;

        // Speed-based blur intensity
        const velocityBlur = Math.abs(this.rotationVelocity) * 200;
        const baseBlur = 8;
        const totalBlur = Math.min(25, baseBlur + velocityBlur);

        // Collect ALL visible panels for multi-layered shadows
        const shadowPanels = [];
        for (let i = 0; i < this.panelCount; i++) {
            const angle = (i / this.panelCount) * Math.PI * 2 + this.rotation;
            const x = Math.cos(angle) * 30;
            const z = Math.sin(angle) * 30;

            // Include panels facing forward or sideways
            if (z > -20) {
                // Calculate depth-based properties
                const depthFactor = (z + 20) / 50;
                const opacity = 0.6 + depthFactor * 0.2; // 0.6 to 0.8 range

                // Soft grey tones based on depth
                const greyValue = Math.floor(58 + depthFactor * 32); // #3a to #5a
                const shadowColor = `rgb(${greyValue}, ${greyValue}, ${greyValue})`;

                shadowPanels.push({
                    angle,
                    x,
                    z,
                    opacity: Math.max(0.6, Math.min(0.8, opacity)),
                    color: shadowColor,
                    scale: shadowScale + depthFactor * 0.3
                });
            }
        }

        // Sort by depth (back to front)
        shadowPanels.sort((a, b) => a.z - b.z);

        // Create shadow silhouette from FULL user drawing
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = this.panelImage.width;
        tempCanvas.height = this.panelImage.height;
        const tempCtx = tempCanvas.getContext('2d');

        // Draw full image
        tempCtx.drawImage(this.panelImage, 0, 0);

        // Convert to soft grey silhouette
        const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
        const shadowData = tempCtx.createImageData(tempCanvas.width, tempCanvas.height);

        for (let i = 0; i < imageData.data.length; i += 4) {
            const brightness = (imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3;
            if (brightness < 128 && imageData.data[i + 3] > 0) {
                // Soft grey instead of pure black
                shadowData.data[i] = 58; // #3a3a3a
                shadowData.data[i + 1] = 58;
                shadowData.data[i + 2] = 58;
                shadowData.data[i + 3] = imageData.data[i + 3];
            }
        }

        tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        tempCtx.putImageData(shadowData, 0, 0);

        // Draw multiple overlapping shadows with blur
        this.ctx.save();

        for (const panel of shadowPanels) {
            this.ctx.save();

            // Apply Gaussian blur
            this.ctx.filter = `blur(${totalBlur}px)`;
            this.ctx.globalAlpha = panel.opacity;

            const shadowWidth = tempCanvas.width * panel.scale;
            const shadowHeight = tempCanvas.height * panel.scale;

            // Spread out shadows more - increased multiplier from 0.4 to 1.2
            const offsetX = panel.x * panel.scale * 1.2;
            const skewX = (panel.z / 30) * 20; // Increased perspective distortion

            // Apply subtle horizontal stretch
            const stretchFactor = 1 + Math.abs(panel.x / 30) * 0.15;

            this.ctx.drawImage(
                tempCanvas,
                shadowX + offsetX - (shadowWidth * stretchFactor) / 2 + skewX,
                shadowY - shadowHeight / 2,
                shadowWidth * stretchFactor,
                shadowHeight
            );

            this.ctx.restore();
        }

        this.ctx.restore();
    }
}


// ========================================
// MAIN APP
// ========================================
class ZoetropeLantern {
    constructor() {
        this.panelCreator = new PanelCreator('draw-canvas');
        this.lanternRenderer = null;

        this.init();
    }

    init() {
        // Draw controls
        const brushSizeInput = document.getElementById('brush-size');
        const brushSizeValue = document.getElementById('brush-size-value');

        brushSizeInput.addEventListener('input', (e) => {
            const size = e.target.value;
            this.panelCreator.setBrushSize(size);
            brushSizeValue.textContent = size + 'px';
        });

        document.getElementById('clear-btn').addEventListener('click', () => {
            this.panelCreator.clear();
            document.getElementById('canvas-instructions').classList.remove('hidden');
        });

        // Build lantern
        document.getElementById('build-lantern-btn').addEventListener('click', () => {
            this.buildLantern();
        });

        // Canvas interaction indicator
        this.panelCreator.canvas.addEventListener('mousedown', () => {
            document.getElementById('canvas-instructions').classList.add('hidden');
        });
    }

    buildLantern() {
        if (!this.panelCreator.hasDrawn) {
            alert('Please draw a pattern first!');
            return;
        }

        const imageData = this.panelCreator.getImageData();

        // Create canvas from image data
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = imageData.width;
        tempCanvas.height = imageData.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(imageData, 0, 0);

        // Initialize lantern renderer
        this.lanternRenderer = new LanternRenderer('lantern-canvas', tempCanvas);

        // Switch screens
        document.getElementById('creator-screen').classList.remove('active');
        document.getElementById('lantern-screen').classList.add('active');
    }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    new ZoetropeLantern();
});
