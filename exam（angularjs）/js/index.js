/**
 * Created by luojieyu on 2016/9/22.
 * 这是项目的核心js
 */


//左侧导航动画的功能
$(function(){
    //收缩全部
    $(".baseUI>li>ul").slideUp("fast");
    $(".baseUI>li>a").off("click");
    $(".baseUI>li>a").on("click",function(){
        //点击展开列表前，先收缩全部
        $(".baseUI>li>ul").slideUp("fast");
        $(this).next().slideDown();
    });
    //默认让第一个展开
    $(".baseUI>li>a").eq(0).trigger("click");
    //改变背景
    $(".baseUI ul>li").off("click")
    $(".baseUI ul>li").on("click",function(){
        if(!$(this).hasClass("current")){
            $(".baseUI ul>li").removeClass("current");
            $(this).addClass("current");
        }
    });
    //默认点击第一个
    $(".baseUI ul>li").eq(0).find("a").trigger("click");
});



//这是angularjs代码
angular.module("app",["ng","ngRoute","app.subjectModule","app.paperModule"])
    .controller("mainController",["$scope",function($scope){

    }])
    .config(["$routeProvider",function($routeProvider){
        $routeProvider
            .when("/SubjectList/dpId/:dpId/topicId/:topicId/levelId/:levelId/typeId/:typeId",{
                templateUrl:"tpl/subject/subjectList.html",
                controller:"subjectController"
            })
            .when("/SubjectManager/dpId/:dpId/topicId/:topicId/levelId/:levelId/typeId/:typeId",{
                templateUrl:"tpl/subject/subjectManager.html",
                controller:"subjectController"
            })
            //单选按钮跳转页面
            .when("/subjectAdd",{
                templateUrl:"tpl/subject/subjectAdd.html",
                controller:"subjectController"
            })
            //删除
            .when("/SubjectDel/id/:id",{
                templateUrl:"tpl/subject/subjectList.html",
                controller:"subjectDelController"
            })
            //审核
            .when("/checkState/id/:id/checkState/:checkState",{
                templateUrl:"tpl/subject/subjectList.html",
                controller:"subjectCheckController"
            })
            .when("/PaperList",{
                templateUrl:"tpl/paper/paperManager.html",
                controller:"paperListController"
            })
            //点击加入试卷
            .when("/PaperAdd/id/:id/stem/:stem/type/:type/topic/:topic/level/:level",{
                templateUrl:"tpl/paper/paperAdd.html",
                controller:"paperAddController"
            })
            .when("/PaperAddSubject",{
                templateUrl:"tpl/paper/subjectList.html",
                controller:"subjectController"
            })
    }]);