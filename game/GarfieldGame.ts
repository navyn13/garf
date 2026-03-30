import * as Phaser from "phaser";

export default class GarfieldGame extends Phaser.Scene {
  private player!: Phaser.Physics.Arcade.Sprite;
  private obstacles!: Phaser.Physics.Arcade.Group;
  private dollars!: Phaser.Physics.Arcade.Group;
  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private gameSpeed: number = 400;
  private isGameOver: boolean = false;
  private obstacleTimer!: Phaser.Time.TimerEvent;
  private dollarTimer!: Phaser.Time.TimerEvent;
  private gameStartTime: number = 0;
  private onGameOver?: (score: number, duration: number) => void;
  private onPlayAgain?: () => void;
  private playAgainButton?: Phaser.GameObjects.Container;

  // Variable jump tracking
  private jumpPressStart: number = 0;
  private isPressingJump: boolean = false;
  private readonly MIN_JUMP_VELOCITY = -500;
  private readonly MAX_JUMP_VELOCITY = -900;
  private readonly MIN_HOLD_MS = 0;
  private readonly MAX_HOLD_MS = 1000;

  // Audio
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
      oscillator.frequency.setValueAtTime(784, ctx.currentTime);       // G5
      oscillator.frequency.linearRampToValueAtTime(1047, ctx.currentTime + 0.1); // C6

      gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.15);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.15);
    } catch (e) {
      // Audio not available, silently ignore
    }
  }

  private playHitSound() {
    try {
      const ctx = this.getAudioContext();

      // Low thud
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

      // Short noise burst on top for impact
      const bufferSize = ctx.sampleRate * 0.1;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.4, ctx.currentTime);
      noiseGain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.1);

      noise.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(ctx.currentTime);
    } catch (e) {
      // Audio not available, silently ignore
    }
  }

  create() {
    this.gameStartTime = Date.now();
    this.score = 0;
    this.isGameOver = false;
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
    const bodyW = this.player.displayWidth * 0.85;
    const bodyH = this.player.displayHeight * 0.9;
    playerBody.setSize(bodyW, bodyH, true);
    (this.player.body as Phaser.Physics.Arcade.Body).setGravityY(1800);
    this.player.refreshBody();

    this.physics.add.collider(this.player, ground);

    this.obstacles = this.physics.add.group();
    this.dollars = this.physics.add.group();

    this.scoreText = this.add.text(16, 16, "Score: 0", {
      fontSize: "32px",
      color: "#FFD23F",
      fontStyle: "bold",
    });

    this.input.keyboard?.on("keydown-SPACE", (event: KeyboardEvent) => {
      event.preventDefault();
      if (this.isGameOver || this.isPressingJump) return;
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      if (body.touching.down) {
        this.isPressingJump = true;
        this.jumpPressStart = Date.now();
      }
    });

    this.input.keyboard?.on("keyup-SPACE", (event: KeyboardEvent) => {
      event.preventDefault();
      if (this.isGameOver) return;
      if (this.isPressingJump) {
        this.fireJump();
      }
    });

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.playAgainButton && this.isGameOver) {
        const bounds = this.playAgainButton.getBounds();
        if (bounds.contains(pointer.x, pointer.y)) {
          this.restartGame();
          return;
        }
      }
      if (this.isGameOver || this.isPressingJump) return;
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      if (body.touching.down) {
        this.isPressingJump = true;
        this.jumpPressStart = Date.now();
      }
    });

    this.input.on("pointerup", () => {
      if (this.isGameOver) return;
      if (this.isPressingJump) {
        this.fireJump();
      }
    });

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

  private fireJump() {
    this.isPressingJump = false;
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (!body.touching.down) return;

    const heldMs = Date.now() - this.jumpPressStart;
    const clampedMs = Math.min(heldMs, this.MAX_HOLD_MS);
    const t = (clampedMs - this.MIN_HOLD_MS) / (this.MAX_HOLD_MS - this.MIN_HOLD_MS);
    const velocity = this.MIN_JUMP_VELOCITY + t * (this.MAX_JUMP_VELOCITY - this.MIN_JUMP_VELOCITY);

    this.player.setVelocityY(velocity);
  }

  spawnObstacle() {
    if (this.isGameOver) return;

    const obstacleGraphics = this.add.graphics();
    obstacleGraphics.fillStyle(0xff0000, 1);
    obstacleGraphics.fillRect(0, 0, 50, 80);
    obstacleGraphics.generateTexture("obstacle", 50, 80);
    obstacleGraphics.destroy();

    const obstacle = this.obstacles.create(
      this.scale.width,
      this.scale.height - 80,
      "obstacle"
    );
    obstacle.setVelocityX(-this.gameSpeed);
    obstacle.body.allowGravity = false;
  }

  spawnDollar() {
    if (this.isGameOver) return;

    const yPos = Phaser.Math.Between(
      this.scale.height - 250,
      this.scale.height - 120
    );
    const dollar = this.dollars.create(this.scale.width, yPos, "coin");
    dollar.setScale(0.08);

    const dollarBody = dollar.body as Phaser.Physics.Arcade.Body;
    dollarBody.allowGravity = false;
    dollarBody.immovable = true;
    dollar.setVelocityX(-this.gameSpeed);
  }

  collectDollar(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    dollar: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    (dollar as Phaser.Physics.Arcade.Sprite).destroy();
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

    buttonBg.on("pointerdown", () => {
      this.restartGame();
    });

    buttonBg.on("pointerover", () => {
      buttonBg.setFillStyle(0xff6b35);
    });

    buttonBg.on("pointerout", () => {
      buttonBg.setFillStyle(0xffd23f);
    });

    const gameDuration = Math.floor((Date.now() - this.gameStartTime) / 1000);
    if (this.onGameOver) {
      this.onGameOver(this.score, gameDuration);
    }
  }

  restartGame() {
    this.scene.restart();
  }

  update() {
    this.obstacles.children.entries.forEach((obstacle) => {
      const obs = obstacle as Phaser.Physics.Arcade.Sprite;
      if (obs.x < -50) obs.destroy();
    });

    this.dollars.children.entries.forEach((dollar) => {
      const dol = dollar as Phaser.Physics.Arcade.Sprite;
      if (dol.x < -50) dol.destroy();
    });
  }
}