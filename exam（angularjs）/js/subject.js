/**
 * Created by luojieyu on 2016/9/22.
 *
 * 题库模块
 */

angular.module("app.subjectModule",["ng"])
    //删除
    .controller("subjectDelController",["$routeParams","$location","subjectService",function($routeParams,$location,subjectService){
        var res=confirm("确定要删除吗？");         /*返回结果为true或者false*/
        if(res){
            subjectService.delSubject($routeParams.id,function(data){
                alert(data);
            });
        }
        //删除成功后跳转页面
        $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
    }])
    //审核
    .controller("subjectCheckController",["$routeParams","$location","subjectService",function($routeParams,$location,subjectService){
        subjectService.checkSubject($routeParams.id,$routeParams.checkState,function(data){
            alert(data);
        });
        //审核成功后跳转页面
        $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
    }])
    .controller("subjectController",["$scope","commentService","subjectService","$filter","$routeParams","$location",function($scope,commentService,subjectService,$filter,$routeParams,$location){
       //改变题型的下拉框,初始化
        $scope.addChange=function(){
            $scope.model.choiceCorrect=[false,false,false,false];
            //每次一改变题型下拉框，让单选和复选全都默认不选
            $(":radio").prop("checked",false);
            $(":checkbox").prop("checked",false);
        };


        //创建一个默认值,用对象
        $scope.model={
            typeId:1,
            departmentId:1,
            levelId:1,
            topicId:1,
            stem:"",
            answer:"",
            analysis:"",
            choiceContent:[],
            choiceCorrect:[false,false,false,false]
        };

        //调用提交单个添加题目的方法,点击保存并继续
        $scope.addSave=function(){
            subjectService.postAddData($scope.model,function(data){
                alert(data);
            });

            var model={
                typeId:1,
                departmentId:1,
                levelId:1,
                topicId:1,
                stem:"",
                answer:"",
                analysis:"",
                choiceContent:[],
                choiceCorrect:[false,false,false,false]
            };
            //重置数据
            angular.copy(model,$scope.model);
            $(":radio").prop("checked",false);
        };
        //点击添加页面的保存并关闭
        $scope.addClose=function(){
            subjectService.postAddData($scope.model,function(data){
                alert(data);
                //先保存成功再跳转页面
                //跳转到全部题目页面
                $location.path("/SubjectList/dpId/0/topicId/0/levelId/0/typeId/0");
            });

        }



        //当前路由中的参数
        $scope.param=$routeParams;

        //将值用一个对象提交给后台
        //postData接收函数的返回值，也就是obj
        var postData=(function(){
            //先创建一个空对象
            var obj={};
            //如果不是全部，$routeParams为当前参数的id
            if($routeParams.typeId!=0) {
                obj["subject.subjectType.id"] = $routeParams.typeId;
            }
            if($routeParams.dpId!=0) {
                obj["subject.department.id"] = $routeParams.dpId;
            }
            if($routeParams.topicId!=0) {
                obj["subject.topic.id"] = $routeParams.topicId;
            }
            if($routeParams.levelId!=0) {
                obj["subject.subjectLevel.id"] = $routeParams.levelId;
            }
           return obj;
        })();



        //调用服务方法加载题目属性信息，并且进行绑定
        //题型
        commentService.getAllType(function(data){
            $scope.types=data;
        });
        //方向
        commentService.getAllDepartment(function(data){
            $scope.departments=data;
        });
        //知识点
        commentService.getAllTopics(function(data){
            $scope.topics=data;
        });
        //难度
        commentService.getAllLevels(function(data){
            $scope.levels=data;
        });

        //调用subjectService调用所有题目信息
        subjectService.getAllSubjects(postData,function(data){
            //遍历所有的题目，计算出选择题的答案，并且将答案赋给subject.answer
            data.forEach(function(subject){
                var answer=[];
                if(subject.subjectType && subject.subjectType.id!=3){
                    subject.choices.forEach(function(choice,index){
                        if(choice.correct){
                            var no=$filter("indexToNo")(index);
                            answer.push(no);
                        }
                    });
                    //将计算出来的正确答案赋值给subject.answer
                    subject.answer=answer.toString();
                }
            });
            $scope.subjects=data;
        });

    }])
    //给题目提供的服务，封装操作题目的函数
    .service("subjectService",["$http","$httpParamSerializer",function($http,$httpParamSerializer){
        //审核
        this.checkSubject=function(id,checkState,handler){
            //http://172.16.0.5:7777/test/exam/manager/checkSubject.action
            $http.get("http://172.16.0.5:7777/test/exam/manager/checkSubject.action",{
                params:{
                    "subject.id":id,
                    "subject.checkState":checkState
                }
            }).success(function(data){
                handler(data);
            });
        };
        //删除
        this.delSubject=function(id,handler){
            $http.get("http://172.16.0.5:7777/test/exam/manager/delSubject.action",{
                params:{
                    "subject.id":id
                }
            }).success(function(data){
                handler(data)
            });
        };

        //拿后台数据
        this.getAllSubjects=function(param,handler){
            //http://172.16.0.5:7777/test/exam/manager/getAllSubjects.action
           $http.get("data/subject.json",{
               params:param
           }).success(function(data){
               handler(data);
           });
       };

       //保存并继续，提交添加题目页面的数据
        this.postAddData=function(addData,handler){
            //创建一个空对象
            var obj={};
            //首先遍历对象
            for(key in addData){
                var val=addData[key];
                //为空对象动态添加属性
                switch(key){
                    case "typeId":
                        obj["subject.subjectType.id"]=val;
                        break;
                    case "departmentId":
                        obj["subject.department.id"]=val;
                        break;
                    case "levelId":
                        obj["subject.subjectLevel.id"]=val;
                        break;
                    case "topicId":
                        obj["subject.topic.id"]=val;
                        break;
                    case "stem":
                        obj["subject.stem"]=val;
                        break;
                    case "answer":
                        obj["subject.answer"]=val;
                        break;
                    case "analysis":
                        obj["subject.analysis"]=val;
                        break;
                    case "choiceContent":
                        obj["choiceContent"]=val;
                        break;
                    case "choiceCorrect":
                        obj["choiceCorrect"]=val;
                        break;
                };
            }
            //将对象数据转化为表单编码的数据,$httpParamSerializer注入在服务中，同$http
            obj=$httpParamSerializer(obj);

            $http.post("http://172.16.0.5:7777/test/exam/manager/saveSubject.action",obj,{
                headers:{
                    "Content-Type":"application/x-www-form-urlencoded"
                }
            }).success(function(data){
                handler(data);
            });
        };
    }])
    //公共服务，用于获取题目相关信息
    .factory("commentService",["$http",function($http){
            return {
                //获取题型方向
                getAllType:function(handler){
                    //http://172.16.0.5:7777/test/exam/manager/getAllSubjectType.action
                    $http.get("data/types.json").success(function(data){
                        handler(data);
                    });
                },
                //获取方向
                getAllDepartment:function(handler){
                    //http://172.16.0.5:7777/test/exam/manager/getAllDepartmentes.action
                    $http.get("data/departments.json").success(function(data){
                        handler(data);
                    });
                },
                //获取知识点
                getAllTopics:function(handler){
                    //http://172.16.0.5:7777/test/exam/manager/getAllTopics.action
                    $http.get("data/topics.json").success(function(data){
                        handler(data);
                    });
                },
                //获取难度
                getAllLevels:function(handler){
                    //http://172.16.0.5:7777/test/exam/manager/getAllSubjectLevel.action
                    $http.get("data/levels.json").success(function(data){
                        handler(data);
                    });
                }
            };
    }])
    //过滤器
    .filter("selectTopics",function(){
        return function(input,id){
          if(input){
              //通过数组中的过滤器函数过滤满足条件的topic
              return input.filter(function(item){
                  return item.department.id==id;
              });
          }
        };
    })
    .filter("indexToNo",function(){
        return function(input){
            var result;
            switch (input){
                case 0:
                       result = "A";
                    break;
                case 1:
                    result = "B";
                    break;
                case 2:
                    result = "C";
                    break;
                case 3:
                    result = "D";
                    break;
                case 4:
                    result = "E";
                    break;
                case 5:
                    result = "F";
                    break;
            };
            return result;
        };
    })
    //通过指令处理选择题
    .directive("selectOption",function(){
        return {
            //只能当属性使用
            restrict:"A",
            //关注链接阶段
            link:function(scope,element){
                //scope代表当前元素所在的作用域
                //element代表当前绑定的元素
                //绑定事件
                element.on("change",function(){
                    var type=element.attr("type");
                    var isCheck=element.prop("checked");
                    //如果为单选题
                    if(type=="radio"){
                        //每次改变之前先清除原来点击过的值
                        scope.model.choiceCorrect=[false,false,false,false];
                        var index=$(this).val();
                        //拿作用域中的model,此时没有独立作用域，只能单向绑，不能改变源作用域中的值
                        scope.model.choiceCorrect[index]=true;
                    }
                    if(type=="checkbox"&&isCheck){
                        var index=$(this).val();
                        scope.model.choiceCorrect[index]=true;
                    }
                    if(type=="checkbox"&&!isCheck){
                        var index=$(this).val();
                        scope.model.choiceCorrect[index]=false;
                    }
                    //强制将scope更新，此时可以改变原作用域中的值
                    scope.$digest();
                });
            }
        }
    });