
enchant();


//初期化
window.onload = function(){
//穴の数
var maxPit = 10;
var pit = new Array(10);
  game = new Game(320, 320);
  //画像を読み込む
  game.preload('mogura.png');
  game.preload('goldmogura.png');
  game.onload = function(){
  //背景
  var scene = game.rootScene;
  scene.backgroundColor = "#33CC33";
  //var scene = game.rootScene;
   /*scene = new Sprite(320, 320);
   scene.image= game.assets['haikei.jpg'];
   game.rootScene.addChild(scene);*/
  //スコアラベルを表示
  scoreLabel = new ScoreLabel(5,5);
  game.rootScene.addChild(scoreLabel);
  //ランダムに置いてみる
  makePit: for(var i = 0;i < maxPit;i++){
  	var newPit = new Pit(rand(game.width - 48),rand(game.height - 48));
  	for(var j = 0; 0 < i && j < i ; j++){
  		if(pit[j].intersect(newPit)){
  			//console.log(i+" "+j + " : "+ pit[j].x + ","+pit[j].y+" intersect with "+newPit.x+","+newPit.y);
  			i--;
  			continue makePit;
  		}
  	}
  	pit[i] = newPit;
 	game.rootScene.addChild(pit[i]);
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
    this.y = y ;
    this._element.style.zIndex = y + this.height;
    //イベントリスナーを定義
    this.addEventListener('enterframe',this.tick);
   //叩いた場合のイベントリスナーを定義
    this.addEventListener('touchstart',this.hit);
    //モグラ出現モード
    this.mode = 2;
    this.nextMode = 0;
    this.waitFor = game.frame+rand(100);
  },
  
  //モグラが出るアニメーションを繰り返す
  tick:function(){
  if(maxDroid<0){
	game.end("Gameover"); 
}
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

/*
//金モグラの穴クラスの定義
//Spriteクラスを継承する
Pit = Class.create(Sprite,{
  initialize:function(x,y){
    //Spriteクラスのコンストラクターの呼び出し
   enchant.Sprite.call(this,48,48);
    this.image = game.assets['goldmogura.png'];
    this.x = x;
    this.y = y ;
    this._element.style.zIndex = y + this.height;
    //イベントリスナーを定義
    this.addEventListener('enterframe',this.tick);
   //叩いた場合のイベントリスナーを定義
    this.addEventListener('touchstart',this.hit);
    //モグラ出現モード
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
       this.mode = 3;
       //待った後に遷移するモードは１（隠れる）
       }
       break;
       
    //モグラが穴に隠れる
    case 1:
      this.frame--;
      if(this.frame<=0){
      //出切ったら、モード２待つへ
      this.mode = 3;
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
    scoreLabel.add(5);
    }
  }
});
*/


//ScoreLabelクラスの定義
//Labelクラスを継承する
ScoreLabel = Class.create(Label,{
  initialize:function(x,y){
      //Labelクラスのコンストラクターの呼び出し
      enchant.Label.call(this,"たおした数:0匹");
      this.x=x;
       this.y=y;
      this.score = 0;
    },
    
    //スコアを加算
    add:function(pts){
     this.score+=pts;
      //表示を修正
      this.text="たおした数:"+this.score + "匹";
    }
});



game.start();
}
