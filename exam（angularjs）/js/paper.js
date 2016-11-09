/**
 * Created by luojieyu on 2016/9/28.
 * 这是试卷模块
 */

angular.module("app.paperModule",["ng","app.subjectModule"])
    .controller("paperAddController",["$scope","commentService","paperModel","$routeParams","postPaper",function($scope,commentService,paperModel,$routeParams,postPaper){
        //将查询到的所有方向数据绑定到作用域中
        commentService.getAllDepartment(function(data){
            $scope.departments=data;
        });
        //双向绑定对象
        $scope.model=paperModel.model;

        //如果有题目
        if($routeParams.id!=0){
            //将id放入
            paperModel.addSubjectId($routeParams.id);
            //$routeParams为一个对象，放入subjects数组中
            paperModel.addSubjects(angular.copy($routeParams));
        }

        //点击保存
        $scope.save=function(){
            //提交数据,
            postPaper.paperData($scope.model,function(data){
                alert(data);
            });
            //点击保存成功后清空内容
            angular.copy(paperModel.modelCopy,paperModel.model);
        };


    }])
    .controller("paperListController",["$scope",function($scope){

    }])
    //向后台传数据
    .factory("postPaper",["$http","$httpParamSerializer",function($http,$httpParamSerializer){
        return {
            paperData:function(postData,handler){
                //创建一个空对象
                var obj={};
                for(var key in postData){
                    var val=postData[key];
                    switch(key){
                        case "dId":
                            obj["paper.department.id"]=val;
                            break;
                        case "title":
                            obj["paper.title"]=val;
                            break;
                        case "desc":
                            obj["paper.description"]=val;
                            break;
                        case "tt":
                            obj["paper.totalPoints"]=val;
                            break;
                        case "at":
                            obj["paper.answerQuestionTime"]=val;
                            break;
                        case "scores":
                            obj["scores"]=val;
                            break;
                        case "subjectId":
                            obj["subjectIds"]=val;
                            break;
                    };
                }
                console.log(obj)
                //将对象数据转化为表单编码的数据,$httpParamSerializer注入在服务中，同$http
                obj=$httpParamSerializer(obj);

                //http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action

                $http.post("http://172.16.0.5:7777/test/exam/manager/saveExamPaper.action",obj,{
                    headers:{
                        "Content-Type":"application/x-www-form-urlencoded"
                    }
                }).success(function(data){
                    handler(data);
                });
            }
        };
    }])
    .factory("paperModel",function(){
        //放入服务中，每次调用控制器,原来的值不改变
        return {
            model:{
                dId:1,
                title:"",
                desc:"",
                tt:"",
                at:"",
                scores:[],
                subjectId:[],
                subjects:[]
            },
            modelCopy:{
                dId:1,
                title:"",
                desc:"",
                tt:"",
                at:"",
                scores:[],
                subjectId:[],
                subjects:[]
            },
            //放入id的值
            addSubjectId:function(id){
                this.model.subjectId.push(id);
            },
            //放入对象
            addSubjects:function(obj){
                this.model.subjects.push(obj)
            }
        };
    });