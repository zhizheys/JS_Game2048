
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

            board.generate()
            board.generate()

            board.onMove=function(e){
                view.move(e.from,e.to);
            }

            board.onMoveComplete = function(e){
                if(e.moved){
                    setTimeout(function(){
                        board.generate();

                    },200)
                }
            }

            $(document).keydown(
                
                function(e){
                    switch(e.which){
                        case 37:
                            console.log('to left');
                            board.moveLeft();
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
            this.nums ={}
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

            }
        }

        function Board(len){
            this.len =len;
            this.arr =[];

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
                var moved = false;

                for(var x=0,len = this.arr.length;x<len;++x){
                    for(var y=0,arr=this.arr[x];y<len;++y){

                        for(var next =y+1;next <len;++next){
                            if(arr[next] ==0){
                                continue;
                            }

                            if(arr[y]===0){
                                arr[y] =arr[next];
                                this.onMove({from:{x:x,y:next,num:arr[next]},
                                            to:{x:x,y:y,num:arr[y]}});

                                arr[next] =0;
                                moved=true;

                            } else if(arr[y]===arr[next]){
                                arr[y] *=2;
                                this.onMove({from:{x:x,y:next,num:arr[next]},
                                    to:{x:x,y:y,num:arr[y]}});

                                arr[next] =0;
                                moved=true;
                            }

                            break;
                        }
                    }
                }

                this.onMoveComplete({moved:moved})
            },
            moveDown:function(){
                var moved = false;

                for(var x=0,len = this.arr.length;x<len;++x){
                    for(var y=0,arr=this.arr[x];y<len;++y){

                        for(var next =y+1;next <len;++next){
                            if(arr[next] ==0){
                                continue;
                            }

                            if(arr[y]===0){
                                arr[y] =arr[next];
                                this.onMove({from:{x:x,y:next,num:arr[next]},
                                            to:{x:x,y:y,num:arr[y]}});

                                arr[next] =0;
                                moved=true;

                            } else if(arr[y]===arr[next]){
                                arr[y] *=2;
                                this.onMove({from:{x:x,y:next,num:arr[next]},
                                    to:{x:x,y:y,num:arr[y]}});

                                arr[next] =0;
                                moved=true;
                            }

                            break;
                        }
                    }
                }

                this.onMoveComplete({moved:moved})
            },
            onMove:function(){

            },
            onMoveComplete:function(){

            }

        }

        

    }


)(window,document,jQuery)