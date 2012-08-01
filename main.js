
enchant();


//初期化
window.onload = function(){
  game = new Game(320, 320);
  //もぐらの画像を読み込む
  game.preload('mogura.png');
  game.preload('goldmogura.png');
  game.onload = function(){
  //背景色
  var scene = game.rootScene;
  scene.backgroundColor = "#33CC33";
  //スコアラベルを表示
  scoreLabel = new ScoreLabel(5,5);
  game.rootScene.addChild(scoreLabel);
  //ランダムに置いてみる
  for(i=0; i<10; i++){
    var pit = new Pit(rand(300),rand(300)); 
       //if(this.intersect(pit)){
       //pit = rand(300,300);
       //}
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

//モグラの出現回数
maxDroid = 50;

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
    //モグラ君出現モード
    this.mode = 2;
    this.nextMode = 0;
    this.waitFor = game.frame+rand(100);
  },
  
  //モグラが出るアニメーションを繰り返す
  tick:function(){
    //２フレームごとに実行する
    if(game.frame%2!= 0)return;
    switch(this.mode){
    
    //穴からモグラが出てくる
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
       
    //モグラが穴に隠れる
    case 1:
      this.frame--;
      if(this.frame<=0){
      //出切ったら、モード２待つへ
      this.mode = 2;
      //待った後に遷移するモードは０（出現）
      this.nextMode = 0;
      //0～99フレームまでランダムに待ち時間を設定
      this.waitFor = game.frame+rand(200);
      
      //モグラの最大数を減らす
      maxDroid--;
      //もしこれ以上モグラが出現しないなら穴をふさぐ
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

//モグラを殴る
  hit:function(){
    //すでに殴られた状態なら何もしない
    if(this.frame==5)return;
    //モグラ君が半分以上出ていた場合
    if(this.frame>=2){
    //殴られたモグラ
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
      enchant.Label.call(this,"たおした数:0/50匹");
      this.x=x;
      this.y=y;
      this.score = 0;
    },
    
    //スコアを加算
    add:function(pts){
      this.score+=pts;
      //表示を修正
      this.text="たおした数:"+this.score + "/50匹";
    }
});



game.start();
}
