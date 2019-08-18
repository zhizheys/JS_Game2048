
(


    function(window,document,$){

        
        function game2048(opt){
            var prefix = opt.prefix
            var len =opt.len
            var size = opt.size
            var margin= opt.margin;

            
            

            var view = new View(prefix,len,size,margin);
            view.init();

            var board = new Board(len);
            board.init();

            board.onGenerate=function(e){
                //console.log(e)
                view.addNum(e.x,e.y,e.num)
            }

            board.generate();
            board.generate();

            board.onMove=function(e){

                view.move(e.from,e.to);

                if(e.to.num > e.from.num){
                    this.score = this.score + e.to.num;
                    view.updateScore(this.score);

                    if(this.score >= this.winScore){
                        this.isGameOver=true;
                        view.winGame();
                    }
                }

            }

            board.onMoveComplete = function(e){

                if(!board.canMove()){
                    this.isGameOver =true;
                    setTimeout(function(){
                        alert('本次得分: ' + this.score);
                    },300);
                }

                if(e.moved){
                    setTimeout(function(){
                        board.generate();

                    },200)
                }
            }

            $(document).keydown(
                function(e){

                    if(board.isGameOver){
                        return false;
                    }

                    switch(e.which){
                        case 37:
                            board.moveLeft();
                            break;

                        case 38:
                            board.moveUp();
                            break;

                        case 39:
                            board.moveRight();
                            break;

                        case 40:
                            console.log('to down');
                            board.moveDown();
                            break;

                        default:
                            break;
                    }

                   
                }
            )

            function start(){
                score=0;
                view.updateScore(0);
                view.cleanNum();
                board.init();
                board.generate();
                board.generate();
            }

            $('#' + prefix + '_restart').click(start);

        }

        window['game2048'] = game2048;


        function View(prefix,len,size,margin){
            this.prefix = prefix;
            this.len = len;
            this.margin = margin;
            this.size = size;
            //this.container = $('#' + prefix + '_container');
            this.container = $("#game_container");
            var containerSize = len * size + margin * (len+1);
            this.container.css({width:containerSize,height:containerSize})
            this.nums ={};
        }

        View.prototype ={
            getPos:function(n){
                return this.margin + n *(this.size + this.margin);
            },
            init:function(){
                for(var x=0,len=this.len;x<this.len;++x){
                    for(var y=0;y<len;++y){
                        var $cell = $('<div class="' + this.prefix + '-cell"></div>');

                        $cell.css({
                            width:this.size + 'px',
                            height:this.size + 'px',
                            top:this.getPos(x),
                            left:this.getPos(y)
                        });
                        
                        console.log("append")
                        $cell.appendTo(this.container);
                        
                    }
                }
            },
            addNum:function(x,y,num){
                var $num = $('<div class="' + this.prefix + '-num ' + this.prefix + '-num-' + num + '">');

                $num.text(num).css(
                    {
                        top:this.getPos(x) + parseInt(this.size / 2),
                        left:this.getPos(y) + parseInt(this.size /2)
                    }
                ).appendTo(this.container).animate(
                    {
                        width:this.size + 'px',
                        height:this.size + 'px',
                        lineHeight:this.size + 'px',
                        top:this.getPos(x),
                        left:this.getPos(y)
                    },100);

                this.nums[x + '-' + y ]=$num;
            },
            move:function(from,to){
                var fromIndex = from.x + '-' + from.y;
                var toIndex = to.x + '-' + to.y;
                var clean = this.nums[toIndex];

                this.nums[toIndex] = this.nums[fromIndex];
                delete this.nums[fromIndex];

                var prefix= this.prefix + '-num-';
                var pos = {top:this.getPos(to.x),
                    left:this.getPos(to.y)}

                this.nums[toIndex].finish().animate(pos,200,function(){
                    if(to.num > from.num){
                        clean.remove();
                        $(this).text(to.num).removeClass(prefix + from.num).addClass(prefix + to.num);
                    }
                })

            },
            updateScore:function(score){
                var $score = $('#' + this.prefix + '_score');
                $score.text(score);
            },
            winGame:function(){
                alert('win game');
            },
            win:function(){
                $('#' + this.prefix + '_over_info').html('<p>你胜利了</p>');
                $('#' + this.prefix + '_over').removeClass(this.prefix + '-hide');
            },
            over:function(){
                $('#' + this.prefix + '_over_info').html('<p>本次得分</p><p>' + this.score + '</p>');
                $('#' + this.prefix + '_over').removeClass(this.prefix + '-hide');
            },
            cleanNum:function(){
                this.nums={};
                $('#' + this.prefix + '_over').addClass(this.prefix  +'-hide')
                $('.'  + this.prefix + '-num').remove();
            }
        }

        function Board(len){
            this.len =len;
            this.arr =[];
            this.score=0;
            this.winScore=50;
            this.isGameOver=false;

        }

        Board.prototype ={
            init:function(){

                for(var arr=[],len = this.len,x=0;x<len;++x){
                    arr[x] = [];
                    
                    for(var y=0;y<len;++y){
                        arr[x][y] =0;
                    }
                }

                this.arr=arr;
            },
            generate:function(){
                var empty =[];

                for(var x=0,arr= this.arr,len=arr.length;x<len;++x){
                    for(var y=0;y<len;++y){

                        if(arr[x][y]==0){
                            empty.push({x:x,y:y});
                        }
                    }
                }

                if(empty.length<1){
                    return false;
                }

                var pos =empty[Math.floor((Math.random()*empty.length))];
                this.arr[pos.x][pos.y] = Math.random() < 0.5?2:4;
                this.onGenerate({x:pos.x,y:pos.y,num:this.arr[pos.x][pos.y]});
            },
            onGenerate:function(){
                console.log("on generate")
            },
            moveLeft:function(){
                console.log('left')
                var moved = false;

                for(var x=0,len = this.arr.length;x<len;++x){

                    var arr=this.arr[x]

                    for(var y=1;y<len;y++){
                        if(arr[y]==0){
                            continue;
                        }else{

                            for(var j=y;j>0;j--){

                                if(arr[j-1]==0){
                                    arr[j-1] =arr[j];
                                    var next=j-1;
                                    this.onMove({from:{x:x,y:j,num:arr[j]},
                                        to:{x:x,y:next,num:arr[j-1]}});
    
                                    arr[j]=0;
                                    moved=true;
    
                                }else{
                                    if(arr[j-1] == arr[j]){
                                        arr[j-1] *=2;
                                        var next=j-1;
    
                                        this.onMove({from:{x:x,y:j,num:arr[j]},
                                            to:{x:x,y:next,num:arr[j-1]}});
    
                                        arr[j]=0;
                                        moved=true;
                                    }
                                }

                            }

                        }
                    
                    }
                }

                this.onMoveComplete({moved:moved})
            },
            moveRight:function(){
                console.log('right')
                var moved = false;

                for(var x=0,len = this.arr.length;x<len;++x){
                    var arr=this.arr[x]
                    for(var y=0;y<len-1;y++){

                        if(arr[y]==0){
                            continue;
                        }else{

                            if(arr[y+1]==0){
                                arr[y+1] =arr[y];
                                var next=y+1;
                                this.onMove({from:{x:x,y:y,num:arr[y]},
                                    to:{x:x,y:next,num:arr[y+1]}});

                                arr[y]=0;
                                moved=true;

                            }else{
                                if(arr[y+1] == arr[y]){
                                    arr[y+1] *=2;
                                    var next=y+1;

                                    this.onMove({from:{x:x,y:y,num:arr[y]},
                                        to:{x:x,y:next,num:arr[y+1]}});

                                    arr[y]=0;
                                    moved=true;
                                }
                            }

                        }
                    
                    }
                }

                this.onMoveComplete({moved:moved})
            },
            moveDown:function(){
                console.log('down')
                var moved = false;
                var arr=this.arr;

                for(var x=0,len = this.arr.length;x<len-1;++x){
               
                    for(var y=0;y<len;y++){

                        if(arr[x][y]==0){
                            continue;
                        }else{

                            if(arr[x+1][y]==0){
                                arr[x+1][y] =arr[x][y];
                                var next=x+1;
                                this.onMove({from:{x:x,y:y,num:arr[x][y]},
                                    to:{x:next,y:y,num:arr[x+1][y]}});

                                arr[x][y]=0;
                                moved=true;

                            }else{
                                if(arr[x+1][y] == arr[x][y]){
                                    arr[x+1][y] *=2;
                                    var next=x+1;

                                    this.onMove({from:{x:x,y:y,num:arr[x][y]},
                                        to:{x:next,y:y,num:arr[x+1][y]}});

                                    arr[x][y]=0;
                                    moved=true;
                                }
                            }

                        }
                    
                    }
                }

                this.onMoveComplete({moved:moved})
            },
            onMove:function(){

            },
            onMoveComplete:function(){

            },
            canMove:function(){
                for(var x=0,arr=this.arr,len=arr.length;x<len;++x){
                    for(var y=0;y<len;++y){
                        if(arr[x][y]===0){
                            return true;
                        }

                        var curr= arr[x][y];
                        var right = arr[x][y+1];
                        var down= arr[x+1]?arr[x+1][y]:null;

                        if(right ===curr || down===curr){
                            return true;
                        }
                    }
                }

                return false;

            }

        }

        

    }


)(window,document,jQuery)