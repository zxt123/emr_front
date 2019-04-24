//检测登录状态
window.onload = function () {
    var username = window.localStorage.getItem("username");
    if (!username) {
        $("#hello")[0].innerHTML = "请登录";
        // window.location.href = "login.html";
    } else {
        $("#hello")[0].innerHTML = "Hello," + " " + username;
    }
};

//同步文章滚动条
var s1 = document.getElementById("content");
var s2 = document.getElementById("content2");
var s3 = document.getElementById("content3");
s1.onscroll = function(){
    s2.scrollTop = s1.scrollTop;
    s3.scrollTop = s1.scrollTop;
};
s2.onscroll = function(){
    s1.scrollTop = s2.scrollTop;
    s3.scrollTop = s2.scrollTop;
};
s3.onscroll = function(){
    s2.scrollTop = s3.scrollTop;
    s1.scrollTop = s3.scrollTop;
};


$("#logout").click(function () {
    window.localStorage.clear();
    window.location.href = "login.html";
});
angular.module("app", []).controller("table", function ($scope, $http) {
    var urls = "http://127.0.0.1:5000/";
    //本地导入 已废弃
    // $("#importFile").click(function () {
    //     $("#readFile").click();
    // })
    $scope.sel = true;
    /*初始化变量*/
    $scope.aa = false;
    $scope.categoryList = []; // 存储全部实体选中的类别
    $scope.decorationList = []; //存储全部实体的修饰
    $scope.entityList = [];
    $scope.entityList2 = [];
    $scope.entityRemoved = [];
    $scope.allowEdit = true;
    $scope.categories = ["疾病", "疾病诊断分类", "自述症状","异常检查结果","检查","治疗","身体部位","时间"];
    $scope.level_2_options = [];
    var content = document.getElementById("content");
    /*---------------------------------*/
    /*从服务器读取病历文本*/
    $scope.loadFile = function () {
        $scope.aa = true;
        $http({
            method: "POST",
            url: urls + "getContent",
            data: {fileId: document.getElementById("fileId").value}//此处应为文本id
        }).then(function successCallback(response) {
            $scope.categoryList = [];
            $scope.entityList = [];
            $scope.entityList2 = [];
            $scope.reloadStyle();
            console.log('success');
            console.log(response);
            //获取ocntent成功回调函数
            $("#content")[0].value = response.data.result.replace(/</g, '(').replace(/>/g, ')');
            $("#content2")[0].innerHTML = response.data.result.replace(/</g, '(').replace(/>/g, ')');
            // $scope.fileId = response.data.fileId;
            window.localStorage.setItem("fileId", response.data.fileId);
        }, function errorCallback(response) {
            //获取ocntent失败回调函数
            alert("失败：" + response.error);
        })
    };
    /*---------------------------------*/
    /*修改实体的显示与隐藏*/
    $scope.refreshEntity = function () {
        $scope.sel = !$scope.sel;
    };
    /*---------------------------------*/
    /*从服务器下载实体*/
    $scope.loadEntity = function () {
        $scope.aa = true;
        $http({
            method: "POST",
            url: urls + "getEntity",
            data: {
                fileId: document.getElementById("fileId").value,
                editUser: window.localStorage.getItem("username")
            }//此处应为文本id
        }).then(function successCallback(response) {
            console.log("下载实体已执行");
            $scope.entityList = [];
            $scope.entityList2 = [];
            if (response.data.flag == 1) {
                $scope.sel = false;
                console.log(response.data.entityList.length);
                for (i = 0; i < response.data.entityList.length; i++) {
                    $scope.entityList[i] = response.data.entityList[i];
                }
                $scope.allowEdit = true;
                $("#");
                $scope.reloadStyle();
            }
        }, function errorCallback(response) {
            //获取ocntent失败回调函数
            alert("失败：" + response.error);
        })
    };
    /*---------------------------------*/
    /*为实体添加点击，添加颜色*/
    $scope.addClickEvent = function () {
        var originContent = content.value;
        document.getElementById("content3").innerHTML = originContent;
        var items = document.getElementsByClassName("item");
        $scope.$watch('$viewContentLoaded', function () {
            console.log("items:");
            console.log(items);
            console.log(items.length);
            for (i = 0; i < items.length; i++) {
                items[i].addEventListener("click", function () {
                    // console.log(this.getElementsByClassName("pos_b")[0].innerHTML);
                    // console.log(this.getElementsByClassName("pos_e")[0].innerHTML);
                    var startPos = this.getElementsByClassName("pos_b")[0].innerHTML;
                    var endPos = this.getElementsByClassName("pos_e")[0].innerHTML;
                    var extr_info = this.getElementsByClassName("extr_info")[0].innerHTML;
                    var thisCategory = this.getElementsByClassName("category")[0].innerHTML;
                    var divContent = document.getElementById("content").value;
                    var entityName = divContent.slice(startPos, endPos);
                    divContent = divContent.split('');
                    divContent.splice(endPos, 0, "</span>");
                    if (thisCategory == "疾病") {
                        divContent.splice(startPos, 0, "<span class='class1'>");
                    } else if (thisCategory == "疾病诊断分类") {
                        divContent.splice(startPos, 0, "<span class='class2'>");
                    } else if (thisCategory == "自述症状") {
                        divContent.splice(startPos, 0, "<span class='class3'>");
                    } else if (thisCategory == "异常检查结果") {
                        divContent.splice(startPos, 0, "<span class='class4'>");
                    } else if (thisCategory == "检查") {
                        divContent.splice(startPos, 0, "<span class='class5'>");
                    } else if (thisCategory == "治疗") {
                        divContent.splice(startPos, 0, "<span class='class6'>");
                    } else if (thisCategory == "身体部位") {
                        divContent.splice(startPos, 0, "<span class='class7'>");
                    } else if (thisCategory == "时间") {
                        divContent.splice(startPos, 0, "<span class='class8'>");
                    }
                    divContent.join('');
                    document.getElementById("content3").innerHTML = divContent.join('');
                })
            }
        })
    };
    /*---------------------------------*/
    /*从服务器下载全部用户添加的实体*/
    $scope.reviewEntity = function () {
        $http({
            method: "POST",
            url: urls + "reviewEntity",
            data: {
                fileId: document.getElementById("fileId").value
                /**/
            }
        }).then(function successCallback(response) {
            if (response.data.flag == 1) {
                $scope.aa = true;
                console.log($scope.entityList);
                for (i = 0; i < response.data.entityList.length; i++) {
                    $scope.entityList[i] = response.data.entityList[i];
                }
                console.log($scope.entityList);
                $scope.addClickEvent();
                for (i = 0; i < $scope.indexList.length; i++) {
                    $scope.entityList2.length = $scope.entityList.length;
                    $scope.entityList2[$scope.indexList.length - 1 - i] = $scope.entityList[$scope.indexList[i]];
                    var startPos = $scope.entityList[$scope.indexList[i]].startPosition;
                    var endPos = $scope.entityList[$scope.indexList[i]].endPosition;
                    var thisCategory = $scope.entityList[$scope.indexList[i]].category;
                    var divContent = document.getElementById("content2").innerHTML;
                    var entityName = divContent.slice(startPos, endPos);
                    divContent = divContent.split('');
                    divContent.splice(endPos, 0, "</span>");
                    if (thisCategory == "疾病") {
                        divContent.splice(startPos, 0, "<span class='class1'>");
                    } else if (thisCategory == "疾病诊断分类") {
                        divContent.splice(startPos, 0, "<span class='class2'>");
                    } else if (thisCategory == "自述症状") {
                        divContent.splice(startPos, 0, "<span class='class3'>");
                    } else if (thisCategory == "异常检查结果") {
                        divContent.splice(startPos, 0, "<span class='class4'>");
                    } else if (thisCategory == "检查") {
                        divContent.splice(startPos, 0, "<span class='class5'>");
                    } else if (thisCategory == "治疗") {
                        divContent.splice(startPos, 0, "<span class='class6'>");
                    } else if (thisCategory == "身体部位") {
                        divContent.splice(startPos, 0, "<span class='class7'>");
                    } else if (thisCategory == "时间") {
                        divContent.splice(startPos, 0, "<span class='class8'>");
                    }
                    divContent.join('');
                    document.getElementById("content2").innerHTML = divContent.join('');
                }
            }
            $scope.allowEdit = true;
            $scope.aa = false;
            /**/
        }, function errorCallback(response) {
            /**/
        })
    };
    /*---------------------------------*/
    // /*上传最终的实体到数据库*/
    // $scope.pushChecked = function () {
    //     console.log($scope.entityList);
    //     var jsons = {};
    //     jsons.entities = [];
    //     for (var j = 0; j < $scope.entityList.length; j++) {
    //         if ($scope.entityList[j].category) {
    //             jsons.entities.push({
    //                 "name": $scope.entityList[j].name,
    //                 "startPosition": $scope.entityList[j].startPosition.toString(),
    //                 "endPosition": $scope.entityList[j].endPosition.toString(),
    //                 "category": $scope.entityList[j].category
    //             })
    //             jsons.fileId = window.localStorage.getItem("fileId");
    //             jsons.editUser = "admin";
    //             jsons.editTime = new Date().getTime();
    //             jsons.entityRemove = $scope.entityRemoved;
    //         } else {
    //             alert("请选择类别");
    //             break;
    //         }
    //     }
    //     if ($scope.entityList.length > 0) {
    //         $http({
    //             method: "post",
    //             url: urls,
    //             data: JSON.stringify(jsons)
    //         }).then(function successCallback(response) {
    //             if (response.data.flag == 1) {
    //                 alert("上传完成！")
    //             }
    //         }, function errorCallback(response) {
    //             alert("失败：" + response.statusText);
    //         })
    //     }
    //     else {
    //         alert('尚未添加任何实体！')
    //     }
    // }
    /*----------------------------------*/
    /*重新加载content2中的颜色样式*/
    $scope.reloadStyle = function () {
        function NumDescSort(a, b) {
            return b - a;
        }

        var arr = [];
        var originArr = [];
        $scope.indexList = [];
        for (i = 0; i < $scope.entityList.length; i++) {
            arr.push($scope.entityList[i].startPosition);
        }
        var originArr = arr.slice();
        arr.sort(NumDescSort);//倒序
        for (i = 0; i < arr.length; i++) {
            $scope.indexList.push(originArr.indexOf(arr[i]));
        }
        var originContent = content.value;
        document.getElementById("content2").innerHTML = originContent;
        for (i = 0; i < $scope.indexList.length; i++) {
            $scope.entityList2.length = $scope.entityList.length;
            $scope.entityList2[$scope.indexList.length - 1 - i] = $scope.entityList[$scope.indexList[i]];
            var startPos = $scope.entityList[$scope.indexList[i]].startPosition;
            var endPos = $scope.entityList[$scope.indexList[i]].endPosition;
            var thisCategory = $scope.entityList[$scope.indexList[i]].category;
            var divContent = document.getElementById("content2").innerHTML;
            var entityName = divContent.slice(startPos, endPos);
            divContent = divContent.split('');
            divContent.splice(endPos, 0, "</span>");
            if (thisCategory == "疾病") {
                divContent.splice(startPos, 0, "<span class='class1'>");
            } else if (thisCategory == "疾病诊断分类") {
                divContent.splice(startPos, 0, "<span class='class2'>");
            } else if (thisCategory == "自述症状") {
                divContent.splice(startPos, 0, "<span class='class3'>");
            } else if (thisCategory == "异常检查结果") {
                divContent.splice(startPos, 0, "<span class='class4'>");
            } else if (thisCategory == "检查") {
                divContent.splice(startPos, 0, "<span class='class5'>");
            } else if (thisCategory == "治疗") {
                divContent.splice(startPos, 0, "<span class='class6'>");
            } else if (thisCategory == "身体部位") {
                divContent.splice(startPos, 0, "<span class='class7'>");
            } else if (thisCategory == "时间") {
                divContent.splice(startPos, 0, "<span class='class8'>");
            }
            divContent.join('');
            document.getElementById("content2").innerHTML = divContent.join('');
        }
    };
    /*----------------------------------*/
    /*监听select选项框中的option改变*/
    $scope.change = function () {
        console.log(this);
        var index = this.$index;
        var selectedValue = this.selectValue;
        $scope.categoryList[index] = selectedValue;
        if(selectedValue =="疾病"||selectedValue=="疾病诊断分类"||selectedValue=="自述症状"||selectedValue=="异常检查结果"){
            $scope.level_2_options[index] = ["当前的","否认的","非患者本人的","可能的"];
        }else if(selectedValue == "治疗"){
            $scope.level_2_options[index] = ["既往的","否认的","当前的"];
        }else {
            $scope.level_2_options[index] = ["无"];
        }
        // console.log("类别列表："+$scope.categoryList);
        //将选择的类别添加为实体对象属性
        $scope.entityList[index].category = $scope.categoryList[index];
        $scope.entityList[index].category_optinons = $scope.level_2_options[index];
        $scope.reloadStyle();
    };
    $scope.change_extr = function () {
        var index = this.$index;
        var selectExtr = this.selectExtr;
        $scope.decorationList[index] = selectExtr;
        $scope.entityList[index].decoration = $scope.decorationList[index];
        // $scope.entityList[index].extr_info = $scope.categoryList[index];
        console.log("entityList",$scope.entityList);
        $scope.reloadStyle();
    };

    /*----------------------------------*/
    /*添加实体-------------------------*/
    $scope.addEntity = function () {
        $scope.text = "";
        if (navigator.appName == "Microsoft Internet Explorer") {
            alert("不支持IE浏览器");
        } else {
            var sel = window.getSelection();
            // console.log("开始位置"+document.getElementById("content").selectionStart);
            // console.log("结束位置"+document.getElementById("content").selectionEnd);
            $scope.text = window.getSelection().toString();
        }
        if ($scope.text != "") {
            // $scope.wordList.push($scope.text);
            $scope.entity = {
                name: $scope.text,
                startPosition: content.selectionStart,
                endPosition: content.selectionEnd,
            };
            $scope.entityList.push($scope.entity);
            if (!$scope.aa) {
                $scope.addClickEvent();
            }
            // console.log($scope.entityList);
        }
    };
    /*---------------------------------*/
    /*删除实体------------------------*/
    $scope.removeEntity = function () {
        console.log("delete:");
        console.log(this.x.name);
        var index = this.$index;
        var r = confirm('确认删除该实体？');
        if (r) {
            $scope.entityList.splice(index, 1);
            $scope.entityRemoved.push({
                name: this.x.name,
                startPosition: this.x.startPosition
            });
            $scope.reloadStyle();
        }
        // console.log("删除的实体",$scope.entityRemoved);
    };
    /*---------------------------------*/
    // /*--输出实体列表到本地-------------------*/
    // $scope.exportEntity = function () {
    //     // console.log("实体列表");
    //     // console.log($scope.entityList2.length);
    //     var title = prompt("请输入文件名", "");
    //     var textExport = "";
    //     for (var i = 0; i < $scope.entityList2.length; i++) {
    //         textExport += $scope.entityList2[i].name + "\t" + $scope.entityList2[i].startPosition + "\t" + $scope.entityList2[i].endPosition + "\t" + $scope.entityList2[i].category + "\r\n";
    //     }
    //     var blob = new Blob([textExport], {type: "text/plain;charset=utf-8"});
    //     saveAs(blob, title + ".txt");
    // }
    /*---------------------------------*/
    /*---向服务器发送标注结果-----------*/
    $scope.pushToDB = function () {
        var jsons = {};
        jsons.entities = [];
        extr_infos = document.getElementsByClassName("extr_info");
        for (var j = 0; j < $scope.entityList.length; j++) {
            if ($scope.entityList[j].category) {
                jsons.entities.push({
                    "name": $scope.entityList[j].name,
                    "startPosition": $scope.entityList[j].startPosition.toString(),
                    "endPosition": $scope.entityList[j].endPosition.toString(),
                    "category": $scope.entityList[j].category,
                    "extr_info":$scope.entityList[j].decoration
                });
                jsons.fileId = window.localStorage.getItem("fileId");
                jsons.editUser = window.localStorage.getItem("username");
                jsons.editTime = new Date().getTime();
                jsons.entityRemove = $scope.entityRemoved;
                // jsons.fileName = window.localStorage.getItem("fileName");
                // console.log(jsons);
            } else {
                alert("请选择类别");
                break;
            }
        }
        if ($scope.entityList.length > 0) {

            $http({
                method: "post",
                url: "http://localhost:5000/",
                data: JSON.stringify(jsons)
            }).then(function successCallback(response) {
                if (response.data.flag == 1) {
                    alert("上传完成！")
                }
            }, function errorCallback(response) {
                alert("失败：" + response.statusText);
            })
        }
        else {
            alert('尚未添加任何实体！')
        }
    }
    /*---------------------------------*/
});