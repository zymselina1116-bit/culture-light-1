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

    generatePattern(type) {
        this.clear();
        this.ctx.fillStyle = '#000000';

        switch(type) {
            case 'dancer':
                this.generateDancer();
                break;
            case 'bird':
                this.generateBird();
                break;
            case 'tree':
                this.generateTree();
                break;
            case 'geometric':
                this.generateGeometric();
                break;
            case 'abstract':
                this.generateAbstract();
                break;
        }

        this.hasDrawn = true;
    }

    generateDancer() {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        this.ctx.beginPath();
        this.ctx.arc(cx, cy - 100, 20, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillRect(cx - 10, cy - 80, 20, 80);
        this.ctx.save();
        this.ctx.translate(cx - 10, cy - 60);
        this.ctx.rotate(-Math.PI / 3);
        this.ctx.fillRect(0, -5, 50, 10);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(cx + 10, cy - 60);
        this.ctx.rotate(Math.PI / 4);
        this.ctx.fillRect(0, -5, 45, 10);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(cx - 10, cy);
        this.ctx.rotate(-Math.PI / 6);
        this.ctx.fillRect(-5, 0, 10, 60);
        this.ctx.restore();
        this.ctx.save();
        this.ctx.translate(cx + 10, cy);
        this.ctx.rotate(Math.PI / 6);
        this.ctx.fillRect(-5, 0, 10, 60);
        this.ctx.restore();
    }

    generateBird() {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, 30, 20, 0, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.arc(cx + 25, cy - 10, 15, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(cx + 38, cy - 10);
        this.ctx.lineTo(cx + 50, cy - 5);
        this.ctx.lineTo(cx + 38, cy - 5);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.beginPath();
        this.ctx.moveTo(cx - 5, cy);
        this.ctx.quadraticCurveTo(cx - 50, cy - 60, cx - 70, cy - 50);
        this.ctx.quadraticCurveTo(cx - 60, cy - 40, cx - 20, cy + 5);
        this.ctx.closePath();
        this.ctx.fill();
    }

    generateTree() {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height;

        this.ctx.fillRect(cx - 15, cy - 150, 30, 150);
        this.ctx.beginPath();
        this.ctx.moveTo(cx, cy - 250);
        this.ctx.lineTo(cx - 80, cy - 150);
        this.ctx.lineTo(cx + 80, cy - 150);
        this.ctx.closePath();
        this.ctx.fill();
    }

    generateGeometric() {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        for (let i = 0; i < 4; i++) {
            const size = 150 - i * 35;
            const sides = 3 + i;
            this.ctx.beginPath();
            for (let j = 0; j <= sides; j++) {
                const angle = (j / sides) * Math.PI * 2 - Math.PI / 2;
                const x = cx + Math.cos(angle) * size;
                const y = cy + Math.sin(angle) * size;
                if (j === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            }
            if (i % 2 === 0) {
                this.ctx.fill();
            } else {
                this.ctx.lineWidth = 20;
                this.ctx.stroke();
            }
        }
    }

    generateAbstract() {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        for (let i = 0; i < 8; i++) {
            const startX = cx + (Math.random() - 0.5) * 200;
            const startY = cy + (Math.random() - 0.5) * 300;
            this.ctx.beginPath();
            this.ctx.moveTo(startX, startY);
            for (let j = 0; j < 5; j++) {
                const cpX = startX + (Math.random() - 0.5) * 100;
                const cpY = startY + (Math.random() - 0.5) * 100;
                const endX = startX + (Math.random() - 0.5) * 80;
                const endY = startY + (Math.random() - 0.5) * 80;
                this.ctx.quadraticCurveTo(cpX, cpY, endX, endY);
            }
            this.ctx.closePath();
            this.ctx.fill();
        }
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

        // Lantern position (bottom-left)
        this.lanternX = 120;
        this.lanternY = 0;

        this.setupInteraction();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.wallX = this.canvas.width * this.splitRatio;
        this.lanternY = this.canvas.height - 120; // Bottom position
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

        if (distance < 100) { // Click within lantern area
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

        const radius = 60;
        const height = 100;

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
        const shadowScale = 3.5; // Large shadow
        const shadowX = this.wallX + 250;
        const shadowY = this.canvas.height / 2;

        // Collect visible panels
        const shadowPanels = [];
        for (let i = 0; i < this.panelCount; i++) {
            const angle = (i / this.panelCount) * Math.PI * 2 + this.rotation;
            const z = Math.sin(angle) * 60;

            if (z > -30) { // Panel facing forward
                shadowPanels.push({
                    angle,
                    z,
                    x: Math.cos(angle) * 60
                });
            }
        }

        // Draw crisp black shadows
        this.ctx.save();

        for (const panel of shadowPanels) {
            // Create shadow from panel image
            const tempCanvas = document.createElement('canvas');
            const panelWidth = this.panelImage.width / this.panelCount;
            tempCanvas.width = panelWidth;
            tempCanvas.height = this.panelImage.height;
            const tempCtx = tempCanvas.getContext('2d');

            // Extract panel portion
            tempCtx.drawImage(
                this.panelImage,
                0, 0, this.panelImage.width, this.panelImage.height,
                0, 0, panelWidth, this.panelImage.height
            );

            // Convert to pure black silhouette
            const imageData = tempCtx.getImageData(0, 0, panelWidth, this.panelImage.height);
            const shadowData = tempCtx.createImageData(panelWidth, this.panelImage.height);

            for (let i = 0; i < imageData.data.length; i += 4) {
                if (imageData.data[i] < 128) { // Dark pixels
                    shadowData.data[i] = 0; // Pure black
                    shadowData.data[i + 1] = 0;
                    shadowData.data[i + 2] = 0;
                    shadowData.data[i + 3] = 255; // Full opacity
                }
            }

            tempCtx.clearRect(0, 0, panelWidth, this.panelImage.height);
            tempCtx.putImageData(shadowData, 0, 0);

            // Draw shadow on wall - crisp, no blur
            const shadowWidth = panelWidth * shadowScale;
            const shadowHeight = this.panelImage.height * shadowScale;
            const offsetX = panel.x * shadowScale * 0.3;

            this.ctx.globalAlpha = 0.8;
            this.ctx.drawImage(
                tempCanvas,
                shadowX + offsetX - shadowWidth / 2,
                shadowY - shadowHeight / 2,
                shadowWidth,
                shadowHeight
            );
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
        this.currentMode = 'draw';

        this.init();
    }

    init() {
        // Mode switching
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.currentTarget.dataset.mode;
                this.switchMode(mode);
            });
        });

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

        // Generate controls
        document.getElementById('generate-btn').addEventListener('click', () => {
            const pattern = document.getElementById('pattern-type').value;
            this.panelCreator.generatePattern(pattern);
            document.getElementById('canvas-instructions').classList.add('hidden');
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

    switchMode(mode) {
        this.currentMode = mode;

        // Update buttons
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });

        // Update control panels
        document.querySelectorAll('.mode-controls').forEach(controls => {
            controls.classList.remove('active');
        });

        if (mode === 'draw') {
            document.getElementById('draw-controls').classList.add('active');
        } else {
            document.getElementById('generate-controls').classList.add('active');
        }
    }

    buildLantern() {
        if (!this.panelCreator.hasDrawn) {
            alert('Please draw or generate a pattern first!');
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
