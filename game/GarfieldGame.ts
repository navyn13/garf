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

  create() {
    this.gameStartTime = Date.now();
    this.score = 0;
    this.isGameOver = false;
    this.gameSpeed = 400;

    this.cameras.main.setBackgroundColor("#87CEEB");

    const ground = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height - 40,
      this.scale.width,
      80,
      0x228B22
    );
    this.physics.add.existing(ground, true);

    this.player = this.physics.add.sprite(200, this.scale.height - 220, "garfield");
    this.player.setScale(0.35);
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);
    // Arcade Physics uses the sprite frame bounds (including transparent pixels),
    // so trimmed/transparent images can collide "early". We manually tighten the body.
    const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
    const bodyW = this.player.displayWidth * 0.55;
    const bodyH = this.player.displayHeight * 0.7;
    playerBody.setSize(bodyW, bodyH, true); // center body on sprite
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

    this.input.keyboard?.on("keydown-SPACE", () => {
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      if (!this.isGameOver && body.touching.down) {
        this.player.setVelocityY(-750);
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
      
      const body = this.player.body as Phaser.Physics.Arcade.Body;
      if (!this.isGameOver && body.touching.down) {
        this.player.setVelocityY(-750);
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

  spawnObstacle() {
    if (this.isGameOver) return;

    const obstacleGraphics = this.add.graphics();
    obstacleGraphics.fillStyle(0xFF0000, 1);
    obstacleGraphics.fillRect(0, 0, 50, 80);
    obstacleGraphics.generateTexture("obstacle", 50, 80);
    obstacleGraphics.destroy();

    const obstacle = this.obstacles.create(
      this.scale.width,
      this.scale.height - 120,
      "obstacle"
    );
    obstacle.setVelocityX(-this.gameSpeed);
    obstacle.body.allowGravity = false;
  }

  spawnDollar() {
    if (this.isGameOver) return;

    const yPos = Phaser.Math.Between(
      this.scale.height - 300,
      this.scale.height - 180
    );
    const dollar = this.dollars.create(this.scale.width, yPos, "coin");
    dollar.setScale(0.08);
    
    const dollarBody = dollar.body as Phaser.Physics.Arcade.Body;
    const coinSize = dollar.displayWidth * 0.6;
    dollarBody.setCircle(coinSize / 2);
    dollarBody.setOffset(
      (dollar.displayWidth - coinSize) / 2,
      (dollar.displayHeight - coinSize) / 2
    );
    
    dollar.setVelocityX(-this.gameSpeed);
    dollarBody.allowGravity = false;
  }

  collectDollar(
    player: Phaser.Types.Physics.Arcade.GameObjectWithBody,
    dollar: Phaser.Types.Physics.Arcade.GameObjectWithBody
  ) {
    dollar.destroy();
    this.score += 1;
    this.scoreText.setText(`Score: ${this.score}`);

    if (this.score % 10 === 0) {
      this.gameSpeed += 20;
    }
  }

  hitObstacle() {
    if (this.isGameOver) return;

    this.isGameOver = true;
    this.physics.pause();
    this.obstacleTimer.destroy();
    this.dollarTimer.destroy();

    const overlay = this.add.rectangle(
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
      .text(this.scale.width / 2, this.scale.height / 2 - 10, `Final Score: ${this.score}`, {
        fontSize: "36px",
        color: "#FFD23F",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    const buttonBg = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2 + 80,
      200,
      60,
      0xFFD23F
    );
    buttonBg.setInteractive({ useHandCursor: true });

    const buttonText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 2 + 80,
      "PLAY AGAIN",
      {
        fontSize: "24px",
        color: "#000000",
        fontStyle: "bold",
      }
    ).setOrigin(0.5);

    this.playAgainButton = this.add.container(0, 0, [buttonBg, buttonText]);

    buttonBg.on("pointerdown", () => {
      this.restartGame();
    });

    buttonBg.on("pointerover", () => {
      buttonBg.setFillStyle(0xFF6B35);
    });

    buttonBg.on("pointerout", () => {
      buttonBg.setFillStyle(0xFFD23F);
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
      if (obs.x < -50) {
        obs.destroy();
      }
    });

    this.dollars.children.entries.forEach((dollar) => {
      const dol = dollar as Phaser.Physics.Arcade.Sprite;
      if (dol.x < -50) {
        dol.destroy();
      }
    });
  }
}
