
enchant();


//初期化
window.onload = function(){
  game = new Game(320, 320);
  //もぐらの画像を読み込む
  game.preload('mogura.png');
  game.onload = function(){
  //背景色
  var scene = game.rootScene;
  scene.backgroundColor = "#33CC33";
  //スコアラベルを表示
  scoreLabel = new ScoreLabel(5,5);
  game.rootScene.addChild(scoreLabel);
  
  //ランダムに置いてみる
  for(i=0; i<15; i++){
    var pit = new Pit(rand(300),rand(300));
    game.rootScene.addChild(pit);
  }
   /* for(y=0;y<4;y++){
       for(x=0;x<4;x++){
          var pit = new Pit(x*48+20,y*48+20);
          game.rootScene.addChild(pit);
          }
    }*/
}

rand = function(n){
  return Math.floor(Math.random()*n);
}

//ドロイド君の出現回数
maxDroid = 30;

//穴クラスの定義
//Spriteクラスを継承する
Pit = Class.create(Sprite,{
  initialize:function(x,y){
    //Spriteクラスのコンストラクターの呼び出し
    enchant.Sprite.call(this,48,48);
    this.image = game.assets['mogura.png'];
    this.x = x;
    this.y = y;
    //イベントリスナーを定義
    this.addEventListener('enterframe',this.tick);
    //叩いた場合のイベントリスナーを定義
    this.addEventListener('touchstart',this.hit);
    //ドロイド君出現モード
    this.mode = 2;
    this.nextMode = 0;
    this.waitFor = game.frame+rand(100);
  },
  
  //ドロイド君が出るアニメーションを繰り返す
  tick:function(){
    //２フレームごとに実行する
    if(game.frame%2!= 0)return;
    switch(this.mode){
    
    //穴からドロイド君が出てくる
    case 0:
        this.frame++;
        if(this.frame>=4){
       //出切ったら、モード2（待つ）へ
       this.mode = 2;
       //待った後に遷移するモードは１（隠れる）
       this.nextMode = 1;
       //0～99フレームまでランダムに待ち時間を設定
       this.waitFor = game.frame+rand(30);
       }
       break;
       
    //ドロイド君が穴に隠れる
    case 1:
      this.frame--;
      if(this.frame<=0){
      //出切ったら、モード２待つへ
      this.mode = 2;
      //待った後に遷移するモードは０（出現）
      this.nextMode = 0;
      //0～99フレームまでランダムに待ち時間を設定
      this.waitFor = game.frame+rand(200);
      
      //ドロイド君の最大数を減らす
      maxDroid--;
      //もしこれ以上ドロイド君が出現しないなら穴をふさぐ
      if(maxDroid<=0)this.mode=3;
    }
    break;
    
    //待つ
    case 2:
      //指定されたフレームに達したら
      if(game.frame>this.waitFor){
        //次のモードへ遷移
        this.mode = this.nextMode;
      }
      break;
      
      //なにもしない
      case 3:
      break;
    }
  },

//ドロイド君を殴る
  hit:function(){
    //すでに殴られた状態なら何もしない
    if(this.frame==5)return;
    //ドロイド君が半分以上出ていた場合
    if(this.frame>=2){
    //殴られたドロイド君
    this.frame=5;
    //待ちモードに入る
    this.mode=2;
    this.nextMode=1;
    //待つフレーム数は１０で一定
    this.waitFor = game.frame+10;
    //スコアに加算
    scoreLabel.add(1);
    }
  }
});

//ScoreLabelクラスの定義
//Labelクラスを継承する
ScoreLabel = Class.create(Label,{
  initialize:function(x,y){
      //Labelクラスのコンストラクターの呼び出し
      enchant.Label.call(this,"SCORE:0");
      this.x=x;
      this.y=y;
      this.score = 0;
    },
    
    //スコアを加算
    add:function(pts){
      this.score+=pts;
      //表示を修正
      this.text="SCORE:"+this.score;
    }
});



game.start();
}
