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

        // Head
        this.ctx.beginPath();
        this.ctx.arc(cx, cy - 100, 20, 0, Math.PI * 2);
        this.ctx.fill();

        // Body
        this.ctx.fillRect(cx - 10, cy - 80, 20, 80);

        // Left arm (raised)
        this.ctx.save();
        this.ctx.translate(cx - 10, cy - 60);
        this.ctx.rotate(-Math.PI / 3);
        this.ctx.fillRect(0, -5, 50, 10);
        this.ctx.restore();

        // Right arm (down)
        this.ctx.save();
        this.ctx.translate(cx + 10, cy - 60);
        this.ctx.rotate(Math.PI / 4);
        this.ctx.fillRect(0, -5, 45, 10);
        this.ctx.restore();

        // Left leg
        this.ctx.save();
        this.ctx.translate(cx - 10, cy);
        this.ctx.rotate(-Math.PI / 6);
        this.ctx.fillRect(-5, 0, 10, 60);
        this.ctx.restore();

        // Right leg
        this.ctx.save();
        this.ctx.translate(cx + 10, cy);
        this.ctx.rotate(Math.PI / 6);
        this.ctx.fillRect(-5, 0, 10, 60);
        this.ctx.restore();
    }

    generateBird() {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        // Body
        this.ctx.beginPath();
        this.ctx.ellipse(cx, cy, 30, 20, 0, 0, Math.PI * 2);
        this.ctx.fill();

        // Head
        this.ctx.beginPath();
        this.ctx.arc(cx + 25, cy - 10, 15, 0, Math.PI * 2);
        this.ctx.fill();

        // Beak
        this.ctx.beginPath();
        this.ctx.moveTo(cx + 38, cy - 10);
        this.ctx.lineTo(cx + 50, cy - 5);
        this.ctx.lineTo(cx + 38, cy - 5);
        this.ctx.closePath();
        this.ctx.fill();

        // Left wing (up)
        this.ctx.beginPath();
        this.ctx.moveTo(cx - 5, cy);
        this.ctx.quadraticCurveTo(cx - 50, cy - 60, cx - 70, cy - 50);
        this.ctx.quadraticCurveTo(cx - 60, cy - 40, cx - 20, cy + 5);
        this.ctx.closePath();
        this.ctx.fill();

        // Right wing (down)
        this.ctx.beginPath();
        this.ctx.moveTo(cx - 5, cy);
        this.ctx.quadraticCurveTo(cx - 30, cy + 50, cx - 40, cy + 70);
        this.ctx.quadraticCurveTo(cx - 30, cy + 60, cx - 10, cy + 10);
        this.ctx.closePath();
        this.ctx.fill();

        // Tail
        this.ctx.beginPath();
        this.ctx.moveTo(cx - 30, cy + 5);
        this.ctx.lineTo(cx - 50, cy + 20);
        this.ctx.lineTo(cx - 30, cy + 15);
        this.ctx.closePath();
        this.ctx.fill();
    }

    generateTree() {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height;

        // Trunk
        this.ctx.fillRect(cx - 15, cy - 150, 30, 150);

        // Branches
        for (let i = 0; i < 5; i++) {
            const branchY = cy - 150 + i * 30;
            const branchLength = 40 + Math.random() * 30;
            const angle = (Math.random() - 0.5) * Math.PI / 3;

            this.ctx.save();
            this.ctx.translate(cx, branchY);
            this.ctx.rotate(angle);
            this.ctx.fillRect(0, -5, branchLength, 10);
            this.ctx.restore();
        }

        // Leaves
        for (let i = 0; i < 15; i++) {
            const leafX = cx + (Math.random() - 0.5) * 120;
            const leafY = cy - 180 + Math.random() * 100;
            const leafSize = 10 + Math.random() * 15;

            this.ctx.beginPath();
            this.ctx.ellipse(leafX, leafY, leafSize, leafSize * 1.5, Math.random() * Math.PI, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    generateGeometric() {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        // Concentric shapes
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

        // Random organic shapes
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

        // Add some circles
        for (let i = 0; i < 5; i++) {
            const x = cx + (Math.random() - 0.5) * 180;
            const y = cy + (Math.random() - 0.5) * 280;
            const radius = 10 + Math.random() * 30;

            this.ctx.beginPath();
            this.ctx.arc(x, y, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }
    }

    getImageData() {
        return this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    }
}


// ========================================
// LANTERN RENDERER MODULE
// ========================================
class LanternRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Lantern properties
        this.rotation = 0;
        this.rotationSpeed = 0.3;
        this.panelCount = 8;
        this.lanternSize = 1.0;
        this.lightIntensity = 0.8;
        this.lightOn = true;

        // Panel image
        this.panelImage = null;

        // Geometry
        this.centerX = 0;
        this.centerY = 0;
        this.lanternRadius = 120;
        this.lanternHeight = 180;

        this.animationFrame = null;
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.centerX = this.canvas.width / 2;
        this.centerY = this.canvas.height / 2;
    }

    setPanelImage(imageData) {
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = imageData.width;
        tempCanvas.height = imageData.height;
        const tempCtx = tempCanvas.getContext('2d');
        tempCtx.putImageData(imageData, 0, 0);

        this.panelImage = tempCanvas;
    }

    setRotationSpeed(speed) {
        this.rotationSpeed = speed / 100 * 1.5;
    }

    setLanternSize(size) {
        this.lanternSize = size / 100;
    }

    setLightIntensity(intensity) {
        this.lightIntensity = intensity / 100;
    }

    setPanelCount(count) {
        this.panelCount = count;
    }

    setLightOn(on) {
        this.lightOn = on;
    }

    start() {
        const animate = () => {
            this.rotation += this.rotationSpeed * 0.01;
            this.render();
            this.animationFrame = requestAnimationFrame(animate);
        };
        animate();
    }

    stop() {
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
        }
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1B1B1B';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        if (!this.panelImage) return;

        const radius = this.lanternRadius * this.lanternSize;
        const height = this.lanternHeight * this.lanternSize;
        const topY = this.centerY - height / 2;
        const bottomY = this.centerY + height / 2;

        // Light source position
        const lightX = this.centerX - 200;
        const lightY = this.centerY;

        // Draw shadow on back wall first
        if (this.lightOn) {
            this.renderShadow(lightX, lightY, radius, height, topY, bottomY);
        }

        // Draw light glow
        if (this.lightOn) {
            const gradient = this.ctx.createRadialGradient(lightX, lightY, 0, lightX, lightY, 80 * this.lightIntensity);
            gradient.addColorStop(0, `rgba(248, 220, 166, ${0.6 * this.lightIntensity})`);
            gradient.addColorStop(0.5, `rgba(248, 220, 166, ${0.2 * this.lightIntensity})`);
            gradient.addColorStop(1, 'rgba(248, 220, 166, 0)');

            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(lightX - 100, lightY - 100, 200, 200);
        }

        // Render lantern panels
        this.renderLantern(radius, height, topY, bottomY);
    }

    renderLantern(radius, height, topY, bottomY) {
        // Create array of panels with their Z-depth for sorting
        const panels = [];

        for (let i = 0; i < this.panelCount; i++) {
            const angle = (i / this.panelCount) * Math.PI * 2 + this.rotation;
            const nextAngle = ((i + 1) / this.panelCount) * Math.PI * 2 + this.rotation;

            const x1 = this.centerX + Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;
            const x2 = this.centerX + Math.cos(nextAngle) * radius;
            const z2 = Math.sin(nextAngle) * radius;

            // Average Z for sorting
            const avgZ = (z1 + z2) / 2;

            panels.push({
                x1, z1, x2, z2,
                topY, bottomY,
                avgZ,
                angle
            });
        }

        // Sort panels back-to-front
        panels.sort((a, b) => a.avgZ - b.avgZ);

        // Draw panels
        for (const panel of panels) {
            this.renderPanel(panel);
        }
    }

    renderPanel(panel) {
        const { x1, z1, x2, z2, topY, bottomY } = panel;

        // Draw panel quad
        this.ctx.save();

        // Create clipping path for the panel
        this.ctx.beginPath();
        this.ctx.moveTo(x1, topY);
        this.ctx.lineTo(x2, topY);
        this.ctx.lineTo(x2, bottomY);
        this.ctx.lineTo(x1, bottomY);
        this.ctx.closePath();
        this.ctx.clip();

        // Calculate lighting
        const normalAngle = Math.atan2(z1 + z2, -(x1 - this.centerX + x2 - this.centerX));
        const lightAngle = Math.PI;
        const brightness = this.lightOn ?
            Math.max(0.3, Math.cos(normalAngle - lightAngle) * 0.5 + 0.5) : 0.3;

        // Draw panel image
        if (this.panelImage) {
            this.ctx.globalAlpha = brightness;

            // Calculate panel width for texture mapping
            const panelWidth = Math.abs(x2 - x1);

            // Draw stretched panel texture
            this.ctx.drawImage(
                this.panelImage,
                Math.min(x1, x2), topY,
                panelWidth, bottomY - topY
            );

            this.ctx.globalAlpha = 1;
        }

        // Draw panel outline
        this.ctx.strokeStyle = `rgba(100, 100, 100, ${brightness})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(x1, topY);
        this.ctx.lineTo(x2, topY);
        this.ctx.lineTo(x2, bottomY);
        this.ctx.lineTo(x1, bottomY);
        this.ctx.closePath();
        this.ctx.stroke();

        this.ctx.restore();
    }

    renderShadow(lightX, lightY, radius, height, topY, bottomY) {
        // Shadow wall position (far right)
        const wallX = this.canvas.width - 100;

        // Find the current front panel for shadow
        const shadowPanels = [];

        for (let i = 0; i < this.panelCount; i++) {
            const angle = (i / this.panelCount) * Math.PI * 2 + this.rotation;
            const nextAngle = ((i + 1) / this.panelCount) * Math.PI * 2 + this.rotation;

            const x1 = this.centerX + Math.cos(angle) * radius;
            const z1 = Math.sin(angle) * radius;
            const x2 = this.centerX + Math.cos(nextAngle) * radius;
            const z2 = Math.sin(nextAngle) * radius;

            // Only shadow panels facing the wall (positive Z)
            if (z1 > 0 || z2 > 0) {
                shadowPanels.push({ x1, x2, topY, bottomY, angle, i });
            }
        }

        // Draw shadow for visible panels
        this.ctx.save();
        this.ctx.globalAlpha = 0.7 * this.lightIntensity;

        for (const panel of shadowPanels) {
            // Project shadow onto wall
            const shadowTop1 = this.projectShadow(lightX, lightY, panel.x1, panel.topY, wallX);
            const shadowBottom1 = this.projectShadow(lightX, lightY, panel.x1, panel.bottomY, wallX);
            const shadowTop2 = this.projectShadow(lightX, lightY, panel.x2, panel.topY, wallX);
            const shadowBottom2 = this.projectShadow(lightX, lightY, panel.x2, panel.bottomY, wallX);

            // Draw shadow with panel silhouette
            const tempCanvas = document.createElement('canvas');
            const panelWidth = this.panelImage.width / this.panelCount;
            tempCanvas.width = panelWidth;
            tempCanvas.height = this.panelImage.height;
            const tempCtx = tempCanvas.getContext('2d');

            // Extract this panel's portion
            tempCtx.drawImage(
                this.panelImage,
                panel.i * panelWidth, 0, panelWidth, this.panelImage.height,
                0, 0, panelWidth, this.panelImage.height
            );

            // Get image data and create shadow
            const imageData = tempCtx.getImageData(0, 0, panelWidth, this.panelImage.height);
            const shadowCanvas = document.createElement('canvas');
            shadowCanvas.width = panelWidth;
            shadowCanvas.height = this.panelImage.height;
            const shadowCtx = shadowCanvas.getContext('2d');
            const shadowImageData = shadowCtx.createImageData(panelWidth, this.panelImage.height);

            // Convert to black silhouette
            for (let i = 0; i < imageData.data.length; i += 4) {
                const alpha = imageData.data[i + 3];
                if (imageData.data[i] < 128) { // Dark pixels become shadow
                    shadowImageData.data[i] = 0;
                    shadowImageData.data[i + 1] = 0;
                    shadowImageData.data[i + 2] = 0;
                    shadowImageData.data[i + 3] = 255;
                }
            }

            shadowCtx.putImageData(shadowImageData, 0, 0);

            // Draw projected shadow
            this.ctx.save();

            // Create transform for shadow projection
            const shadowWidth = Math.abs(shadowTop2.y - shadowTop1.y);
            const shadowHeight = Math.abs(shadowBottom1.y - shadowTop1.y);

            if (shadowWidth > 0 && shadowHeight > 0) {
                this.ctx.filter = `blur(${2 + this.lightIntensity * 3}px)`;
                this.ctx.drawImage(
                    shadowCanvas,
                    wallX - shadowWidth / 2,
                    Math.min(shadowTop1.y, shadowTop2.y),
                    shadowWidth,
                    shadowHeight
                );
            }

            this.ctx.restore();
        }

        this.ctx.restore();
    }

    projectShadow(lightX, lightY, objX, objY, wallX) {
        // Calculate shadow projection using similar triangles
        const dx = objX - lightX;
        const dy = objY - lightY;
        const t = (wallX - lightX) / dx;

        return {
            x: wallX,
            y: lightY + dy * t
        };
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

        // Back to creator
        document.getElementById('back-to-creator').addEventListener('click', () => {
            this.showCreator();
        });

        // Lantern controls
        this.setupLanternControls();
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

        // Get panel image data
        const imageData = this.panelCreator.getImageData();

        // Initialize lantern renderer
        if (!this.lanternRenderer) {
            this.lanternRenderer = new LanternRenderer('lantern-canvas');
        }

        this.lanternRenderer.setPanelImage(imageData);
        this.lanternRenderer.start();

        // Switch screens
        document.getElementById('creator-screen').classList.remove('active');
        document.getElementById('lantern-screen').classList.add('active');
    }

    showCreator() {
        if (this.lanternRenderer) {
            this.lanternRenderer.stop();
        }

        document.getElementById('lantern-screen').classList.remove('active');
        document.getElementById('creator-screen').classList.add('active');
    }

    setupLanternControls() {
        // Rotation speed
        const rotationSpeed = document.getElementById('rotation-speed');
        const rotationSpeedValue = document.getElementById('rotation-speed-value');

        rotationSpeed.addEventListener('input', (e) => {
            const value = e.target.value;
            rotationSpeedValue.textContent = value;
            if (this.lanternRenderer) {
                this.lanternRenderer.setRotationSpeed(value);
            }
        });

        // Lantern size
        const lanternSize = document.getElementById('lantern-size');
        const lanternSizeValue = document.getElementById('lantern-size-value');

        lanternSize.addEventListener('input', (e) => {
            const value = e.target.value;
            lanternSizeValue.textContent = value + '%';
            if (this.lanternRenderer) {
                this.lanternRenderer.setLanternSize(value);
            }
        });

        // Light intensity
        const lightIntensity = document.getElementById('light-intensity');
        const lightIntensityValue = document.getElementById('light-intensity-value');

        lightIntensity.addEventListener('input', (e) => {
            const value = e.target.value;
            lightIntensityValue.textContent = value + '%';
            if (this.lanternRenderer) {
                this.lanternRenderer.setLightIntensity(value);
            }
        });

        // Panel count
        const panelCount = document.getElementById('panel-count');
        const panelCountValue = document.getElementById('panel-count-value');

        panelCount.addEventListener('input', (e) => {
            const value = e.target.value;
            panelCountValue.textContent = value;
            if (this.lanternRenderer) {
                this.lanternRenderer.setPanelCount(parseInt(value));
            }
        });

        // Light toggle
        const lightToggle = document.getElementById('light-toggle');

        lightToggle.addEventListener('change', (e) => {
            if (this.lanternRenderer) {
                this.lanternRenderer.setLightOn(e.target.checked);
            }
        });
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ZoetropeLantern();
});
