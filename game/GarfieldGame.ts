import * as Phaser from "phaser";

export default class GarfieldGame extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private obstacles!: Phaser.Physics.Arcade.Group;
  private dollars!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private gameSpeed: number = 400;
  private isGameOver: boolean = false;
  private gameStarted: boolean = false;
  private obstacleTimer!: Phaser.Time.TimerEvent;
  private dollarTimer!: Phaser.Time.TimerEvent;
  private gameStartTime: number = 0;
  private onGameOver?: (score: number, duration: number) => void;
  private onPlayAgain?: () => void;
  private playAgainButton?: Phaser.GameObjects.Container;
  private startButton?: Phaser.GameObjects.Container;

  private jumpPressStart: number = 0;
  private isPressingJump: boolean = false;
  private readonly MIN_JUMP_VELOCITY = -500;
  private readonly MAX_JUMP_VELOCITY = -900;
  private readonly MAX_HOLD_MS = 1000;

  private audioCtx: AudioContext | null = null;

  constructor() {
    super({ key: "GarfieldGame" });
  }

  init(data: {
    onGameOver?: (score: number, duration: number) => void;
    onPlayAgain?: () => void;
  }) {
    this.onGameOver = data.onGameOver;
    this.onPlayAgain = data.onPlayAgain;
  }

  preload() {
    this.load.image("garfield", "garfield-standing.png");
    this.load.image("coin", "garfield-coin.jpeg");
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      this.audioCtx = new AudioContext();
    }
    return this.audioCtx;
  }

  private playCoinSound() {
    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(784, ctx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(1047, ctx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } catch (e) {}
  }

  private playHitSound() {
    try {
      const ctx = this.getAudioContext();

      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      oscillator.type = "sawtooth";
      oscillator.frequency.setValueAtTime(200, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(50, ctx.currentTime + 0.4);
      gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.4);

      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);
      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(ctx.currentTime);
    } catch (e) {}
  }

  create() {
    this.score = 0;
    this.isGameOver = false;
    this.gameStarted = false;
    this.gameSpeed = 400;
    this.isPressingJump = false;
    this.jumpPressStart = 0;

    this.cameras.main.setBackgroundColor("#87CEEB");

    const ground = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height - 20,
      this.scale.width,
      40,
      0x228b22
    );
    this.physics.add.existing(ground, true);

    this.player = this.physics.add.sprite(200, this.scale.height - 150, "garfield");
    this.player.setScale(0.35);
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    playerBody.setSize(this.player.displayWidth * 0.85, this.player.displayHeight * 0.9, true);
    (this.player.body as Phaser.Physics.Arcade.Body).setGravityY(1800);
    this.player.refreshBody();

    this.physics.add.collider(this.player, ground);

    // Generate obstacle texture once
    if (!this.textures.exists("obstacle")) {
      const g = this.add.graphics();
      g.fillStyle(0xff0000, 1);
      g.fillRect(0, 0, 50, 80);
      g.generateTexture("obstacle", 50, 80);
      g.destroy();
    }

    // Pre-warm object pools
    this.obstacles = this.physics.add.group({
      key: "obstacle",
      quantity: 8,
      active: false,
      visible: false,
    });
    this.obstacles.getChildren().forEach((o) => {
      const body = (o as Phaser.Physics.Arcade.Sprite).body as Phaser.Physics.Arcade.Body;
      body.allowGravity = false;
    });

    this.dollars = this.physics.add.group({
      key: "coin",
      quantity: 12,
      active: false,
      visible: false,
    });
    this.dollars.getChildren().forEach((d) => {
      const sprite = d as Phaser.Physics.Arcade.Sprite;
      sprite.setScale(0.08);
      const body = sprite.body as Phaser.Physics.Arcade.Body;
      body.allowGravity = false;
    });

    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      color: "#FFD23F",
      fontStyle: "bold",
    });

    this.showStartButton();

    // Keyboard input
    this.input.keyboard?.on("keydown-SPACE", (event: KeyboardEvent) => {
      event.preventDefault();
      if (!this.gameStarted || this.isGameOver || this.isPressingJump) return;
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      if (body.touching.down) {
        this.isPressingJump = true;
        this.jumpPressStart = Date.now();
      }
    });

    this.input.keyboard?.on("keyup-SPACE", (event: KeyboardEvent) => {
      event.preventDefault();
      if (!this.gameStarted || this.isGameOver) return;
      if (this.isPressingJump) this.fireJump();
    });

    // Pointer input
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.startButton && !this.gameStarted) {
        const bounds = this.startButton.getBounds();
        if (bounds.contains(pointer.x, pointer.y)) {
          this.startGame();
          return;
        }
      }
      if (this.playAgainButton && this.isGameOver) {
        const bounds = this.playAgainButton.getBounds();
        if (bounds.contains(pointer.x, pointer.y)) {
          this.restartGame();
          return;
        }
      }
      if (!this.gameStarted || this.isGameOver || this.isPressingJump) return;
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      if (body.touching.down) {
        this.isPressingJump = true;
        this.jumpPressStart = Date.now();
      }
    });

    this.input.on("pointerup", () => {
      if (!this.gameStarted || this.isGameOver) return;
      if (this.isPressingJump) this.fireJump();
    });

    this.physics.add.overlap(
      this.player,
      this.dollars,
      this.collectDollar as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.obstacles,
      this.hitObstacle as Phaser.Types.Physics.Arcade.ArcadePhysicsCallback,
      undefined,
      this
    );
  }

  private showStartButton() {
    const overlay = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.5
    );

    const title = this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 100, "GARFIELD RUNNER", {
        fontSize: "64px",
        color: "#FFD23F",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const instructions = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 20,
        "Hold SPACE or TAP to charge your jump!\nCollect coins and avoid obstacles!",
        {
          fontSize: "24px",
          color: "#FFFFFF",
          fontStyle: "normal",
          align: "center",
        }
      )
      .setOrigin(0.5);

    const buttonBg = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2 + 100,
      250,
      70,
      0x4caf50
    );
    buttonBg.setInteractive({ useHandCursor: true });

    const buttonText = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 100, "START GAME", {
        fontSize: "32px",
        color: "#FFFFFF",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.startButton = this.add.container(0, 0, [overlay, title, instructions, buttonBg, buttonText]);

    buttonBg.on("pointerdown", () => this.startGame());
    buttonBg.on("pointerover", () => buttonBg.setFillStyle(0x66bb6a));
    buttonBg.on("pointerout", () => buttonBg.setFillStyle(0x4caf50));
  }

  private startGame() {
    if (this.gameStarted) return;
    
    this.gameStarted = true;
    this.gameStartTime = Date.now();

    if (this.startButton) {
      this.startButton.destroy();
      this.startButton = undefined;
    }

    this.obstacleTimer = this.time.addEvent({
      delay: 2000,
      callback: this.spawnObstacle,
      callbackScope: this,
      loop: true,
    });

    this.dollarTimer = this.time.addEvent({
      delay: 1500,
      callback: this.spawnDollar,
      callbackScope: this,
      loop: true,
    });
  }

  private fireJump() {
    this.isPressingJump = false;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (!body.touching.down) return;
    const heldMs = Date.now() - this.jumpPressStart;
    const t = Math.min(heldMs, this.MAX_HOLD_MS) / this.MAX_HOLD_MS;
    const velocity = this.MIN_JUMP_VELOCITY + t * (this.MAX_JUMP_VELOCITY - this.MIN_JUMP_VELOCITY);
    this.player.setVelocityY(velocity);
  }

  spawnObstacle() {
    if (this.isGameOver || !this.gameStarted) return;

    const obstacle = this.obstacles.get(
      this.scale.width + 25,
      this.scale.height - 80,
      "obstacle"
    ) as Phaser.Physics.Arcade.Sprite;
    if (!obstacle) return;

    obstacle.setActive(true).setVisible(true);
    obstacle.setPosition(this.scale.width + 25, this.scale.height - 80);
    const body = obstacle.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = false;
    body.reset(this.scale.width + 25, this.scale.height - 80);
    obstacle.setVelocityX(-this.gameSpeed);
  }

  spawnDollar() {
    if (this.isGameOver || !this.gameStarted) return;

    const yPos = Phaser.Math.Between(this.scale.height - 250, this.scale.height - 120);
    const dollar = this.dollars.get(
      this.scale.width,
      yPos,
      "coin"
    ) as Phaser.Physics.Arcade.Sprite;
    if (!dollar) return;

    dollar.setActive(true).setVisible(true).setScale(0.08);
    dollar.setPosition(this.scale.width, yPos);
    const body = dollar.body as Phaser.Physics.Arcade.Body;
    body.allowGravity = false;
    body.reset(this.scale.width, yPos);
    dollar.setVelocityX(-this.gameSpeed);
  }

  collectDollar(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    dollar: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    const d = dollar as Phaser.Physics.Arcade.Sprite;
    this.dollars.killAndHide(d);
    (d.body as Phaser.Physics.Arcade.Body).reset(0, 0);

    this.score += 1;
    this.scoreText.setText(`Score: ${this.score}`);
    this.playCoinSound();

    if (this.score % 10 === 0) {
      this.gameSpeed += 20;
    }
  }

  hitObstacle() {
    if (this.isGameOver) return;

    this.isPressingJump = false;
    this.isGameOver = true;
    this.playHitSound();
    this.physics.pause();
    this.obstacleTimer.destroy();
    this.dollarTimer.destroy();

    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.7
    );

    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 80, "GAME OVER", {
        fontSize: "72px",
        color: "#FF6B35",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 10,
        `Final Score: ${this.score}`,
        {
          fontSize: "36px",
          color: "#FFD23F",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    const buttonBg = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2 + 80,
      200,
      60,
      0xffd23f
    );
    buttonBg.setInteractive({ useHandCursor: true });

    const buttonText = this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 80, "PLAY AGAIN", {
        fontSize: "24px",
        color: "#000000",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.playAgainButton = this.add.container(0, 0, [buttonBg, buttonText]);

    buttonBg.on("pointerdown", () => this.restartGame());
    buttonBg.on("pointerover", () => buttonBg.setFillStyle(0xff6b35));
    buttonBg.on("pointerout", () => buttonBg.setFillStyle(0xffd23f));

    const gameDuration = Math.floor((Date.now() - this.gameStartTime) / 1000);
    if (this.onGameOver) this.onGameOver(this.score, gameDuration);
  }

  restartGame() {
    this.scene.restart();
  }

  update() {
    if (this.isGameOver || !this.gameStarted) return;

    const obstacles = this.obstacles.getChildren();
    for (let i = obstacles.length - 1; i >= 0; i--) {
      const obs = obstacles[i] as Phaser.Physics.Arcade.Sprite;
      if (obs.active && obs.x < -60) {
        this.obstacles.killAndHide(obs);
        (obs.body as Phaser.Physics.Arcade.Body).reset(0, 0);
      }
    }

    const dollarChildren = this.dollars.getChildren();
    for (let i = dollarChildren.length - 1; i >= 0; i--) {
      const dol = dollarChildren[i] as Phaser.Physics.Arcade.Sprite;
      if (dol.active && dol.x < -60) {
        this.dollars.killAndHide(dol);
        (dol.body as Phaser.Physics.Arcade.Body).reset(0, 0);
      }
    }
  }
}